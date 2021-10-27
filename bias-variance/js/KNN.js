import { select, selectAll, pointer } from "d3-selection";
import { scaleQuantize, scaleOrdinal } from "d3-scale";
import { line } from "d3-shape";
import { transition } from "d3-transition";
import { curveCatmullRom } from "d3-shape";
import { range } from "d3-array";
import { Delaunay } from "d3-delaunay";
import * as d3hexbin from "d3-hexbin";

const dist = (x, y) => (x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2;
const equation = (x) => x - 0.1 * Math.pow(x, 2) - 1.1 * Math.sin(x) + 4;
const numPoints = 65;

export class KNN {
  constructor(opts) {
    const that = this;
    // selections
    this.fitContainer = opts.fitContainer;
    this.predictContainer = opts.predictContainer;
    this.sliderContainer = opts.sliderContainer;

    // set k
    this.k = opts.k;

    // values for chart components
    this.fitPointRadius = 6;
    this.hexRadius = 8;

    // set constant SVG parameters
    this.MARGIN = { TOP: 0, BOTTOM: 0, LEFT: 0, RIGHT: 0 };
    const containerSize = select(`#${this.fitContainer}`)
      .node()
      .getBoundingClientRect();
    this.WIDTH = containerSize.width * 0.9;
    // this.HEIGHT = containerSize.height * 0.85;
    this.HEIGHT =
      window.innerWidth <= 600
        ? containerSize.height * 0.7
        : containerSize.height * 0.85;

    this.padding = 40;

    // utils for charts
    this.classColorScale = scaleOrdinal()
      .domain([0, 1])
      .range(["#94CAE0", "#E57873"]);
    this.cellColor = scaleQuantize()
      .domain([-0.8, 0.8])
      .range([
        "#94CAE0",
        "rgba(148, 202, 224, 0.5)",
        "rgba(229, 120, 115, 0.5)",
        "#E57873",
      ]);
    this.xAcc = (d) => +d[0];
    this.yAcc = (d) => +d[1];

    // reusable hexbin
    this.hexbin = d3hexbin
      .hexbin()
      .radius(this.hexRadius)
      .extent([
        [0, 0],
        [this.WIDTH, this.HEIGHT],
      ]);

    // hexbin data
    this.hexCenters = this.hexbin(this.hexbin.centers());

    // init voronoi
    this.delan = Delaunay.from(
      this.hexCenters,
      (d) => d.x,
      (d) => d.y
    );

    // create datasets
    function genData(x, y) {
      if (Math.random() > 0.9) {
        return Math.round(Math.random());
      }
      return dBoundary(x, y);
    }

    function dBoundary(x, y) {
      let nx = (x / that.WIDTH) * 10 + 1.5;
      let ny = ((that.HEIGHT - y) / that.HEIGHT) * 10;

      if (ny < equation(nx)) {
        return 0;
      } else {
        return 1;
      }
    }

    this.trainData = range(numPoints).map(() => {
      let x = Math.random() * (this.WIDTH - this.padding) + this.padding / 2;
      let y = Math.random() * (this.HEIGHT - this.padding) + this.padding / 2;
      return [x, y, genData(x, y)];
    });

    // add slider to DOM
    this.addSlider();

    this.fitG = this.initChartSvg(this.fitContainer);
    this.predictG = this.initChartSvg(this.predictContainer);

    // draw charts
    this.drawKnnLeft();
    this.drawKnnRight();
  }

  refreshChartWithNewData() {
    const that = this;
    // redefine stuff so it stays in scope
    const equation = (x) => x - 0.1 * Math.pow(x, 2) - 1.1 * Math.sin(x) + 4;

    // create datasets
    function genData(x, y) {
      if (Math.random() > 0.9) {
        return Math.round(Math.random());
      }
      return dBoundary(x, y);
    }

    function dBoundary(x, y) {
      let nx = (x / that.WIDTH) * 10 + 1.5;
      let ny = ((that.HEIGHT - y) / that.HEIGHT) * 10;
      return ny < equation(nx) ? 0 : 1;
    }

    // regenerate data
    this.trainData = range(numPoints).map(() => {
      let x = Math.random() * (this.WIDTH - this.padding) + this.padding / 2;
      let y = Math.random() * (this.HEIGHT - this.padding) + this.padding / 2;
      return [x, y, genData(x, y)];
    });

    // redraw both charts
    this.drawKnnLeft();
    this.drawKnnRight();
  }

  drawKnnLeft() {
    const that = this;
    // redraw, so remove existing stuff
    const removeClasses = [
      ".data-point",
      ".highlight-circle",
      "mesh-g-fit",
      ".overlay",
      ".hex-cell",
      ".line-g",
      ".mesh-g-fit",
    ];
    removeClasses.map((d) => {
      selectAll(d).remove();
    });

    // redraw plot
    const delan = Delaunay.from(
      this.hexCenters,
      (d) => d.x,
      (d) => d.y
    );
    // draw training data circles
    const circlesTrain = this.fitG
      .selectAll(".data-point")
      .data(this.trainData)
      .enter()
      .append("circle")
      .classed("data-point", true)
      .attr("r", this.fitPointRadius)
      .attr("cx", this.xAcc)
      .attr("cy", this.yAcc)
      .attr("fill", (d) => this.classColorScale(d[2]))
      .style("stroke", "white");

    // add highlight circle
    this.fitG
      .append("circle")
      .attr("class", "highlight-circle")
      .attr("r", this.fitPointRadius)
      .style("fill", "black")
      .style("stroke", "white");
    // .style("display", "none");

    // draw hex grid
    this.fitG
      .append("g")
      .attr("class", "mesh-g-fit")
      .selectAll("path")
      .data(this.hexCenters)
      .enter()
      .append("path")
      .attr("class", "hex-cell-fit")
      .attr("d", (d) => `M${d.x},${d.y}${this.hexbin.hexagon()}`)
      .attr("fill", "white")
      .attr("stroke-width", 0)
      .attr("stroke", "white")
      .attr("opacity", 0);

    // add the overlay on top of everything to take the mouse events
    this.fitG
      .append("rect")
      .attr("class", "overlay")
      .attr("width", that.WIDTH)
      .attr("height", that.HEIGHT)
      .style("opacity", 0)
      .on("mousemove", hexHover)
      .on("mouseleave", this.hexLeave);

    function hexHover(event) {
      // get the current mouse position
      const [mx, my] = pointer(event);
      // use the new diagram.find() function to find the Voronoi mouse position
      const closestPoint = delan.find(mx, my);
      // highlight the point if we found one
      const closestHex = that.hexCenters[closestPoint];

      // get closest data point
      const closestData = { x: mx, y: my };

      that.highlight(closestData, that.k);

      // highlight current cell
      const cell = selectAll(".hex-cell").filter(
        (d) => d.x === closestHex.x && d.y === closestHex.y
      );

      cell.attr("stroke", "black").attr("stroke-width", 3).raise();

      // unhover other ones
      selectAll(".hex-cell")
        .filter((d) => d.x !== closestHex.x || d.y !== closestHex.y)
        .attr("stroke-width", 0)
        .style("stroke", "#161E2D");
    }
    // init highlight at random point
    this.highlight(this.hexCenters[60], this.k);
    this.addDecisionLine(this.fitG);
  }

  hexLeave() {
    // this.highlight(this.lastDataHovered, this.k);
    selectAll(".hex-cell").attr("stroke-width", 0.0);
  }

  // callback to highlight a point
  highlight(d, k) {
    this.k = k;

    select(".highlight-circle")
      .style("display", "")
      .attr("cx", d.x)
      .attr("cy", d.y)
      .attr("stroke", "black");

    selectAll(".neighbor-line").remove();

    // get location of currently select circle
    // let loc = d.slice(0, 2);
    let loc = [d.x, d.y];
    // get n-nearest neighbors to circle
    let nn = getNNN(this.trainData, loc, this.k);
    // edit opacity for polygons
    this.fitG.selectAll(".polygon").style("fill", "white");
    // draw lines between points
    const points = this.trainData.filter((d, i) => nn.indexOf(i) > -1);
    this.fitG
      .selectAll(".line")
      .data(points)
      .enter()
      .append("line")
      .attr("class", "neighbor-line")
      .attr("x1", (d) => loc[0])
      .attr("y1", (d) => loc[1])
      .attr("x2", this.xAcc)
      .attr("y2", this.yAcc)
      .attr("stroke", "#161E2D")
      .style("stroke-width", 2.5)
      .style("pointer-events", "none")
      .style("opacity", 0.45)
      .lower();

    // track last hovered so can change k easily
    this.lastDataHovered = d;
  }

  addDecisionLine(gEl) {
    const genBoundary = () => {
      let step = 1;
      let data = [];
      for (let x = 1.5; x <= 11.5; x += step) {
        data.push({
          x: ((x - 1.5) / 10) * this.WIDTH,
          y: this.HEIGHT - (equation(x) / 10) * this.HEIGHT,
        });
      }
      return data;
    };
    const boundaryLine = line()
      .x((d) => d.x)
      .y((d) => d.y)
      .curve(curveCatmullRom.alpha(0.95));

    gEl
      .append("g")
      .attr("class", "line-g")
      .selectAll(".boundary")
      .data([genBoundary()])
      .enter()
      .append("path")
      .attr("d", boundaryLine)
      .attr("class", "boundary")
      .attr("fill", "none")
      .attr("stroke", "#161E2D")
      .attr("stroke-width", 4)
      .attr("opacity", 0.5)
      .style("stroke-dasharray", "5, 5")
      .style("pointer-events", "none");

    gEl.select("path.boundary").lower();
  }

  drawKnnRight() {
    const that = this;
    // redraw, so remove existing stuff
    const removeClasses = [".mesh-g", ".hex-cell"];
    removeClasses.map((d) => {
      this.predictG.selectAll(d).remove();
    });

    // init voronoi
    const delan = Delaunay.from(
      this.hexCenters,
      (d) => d.x,
      (d) => d.y
    );

    // draw hex grid
    this.predictG
      .append("g")
      .attr("class", "mesh-g")
      .selectAll("path")
      .data(this.hexCenters)
      .enter()
      .append("path")
      .attr("class", "hex-cell")
      .attr("d", (d) => `M${d.x},${d.y}${this.hexbin.hexagon()}`)
      .attr("stroke-width", 0)
      .attr("stroke", "#161E2D");

    // add the overlay on top of everything to take the mouse events
    this.predictG
      .append("rect")
      .attr("class", "overlay")
      .attr("width", this.WIDTH)
      .attr("height", this.HEIGHT)
      .style("opacity", 0)
      .on("mousemove", hexHover)
      .on("mouseleave", this.hexLeave);
    // lll
    function hexHover(event) {
      // get the current mouse position
      const [mx, my] = pointer(event);
      // use the new diagram.find() function to find the Voronoi mouse position
      const closestPoint = delan.find(mx, my);
      // highlight the point if we found one
      const closestHex = that.hexCenters[closestPoint];
      // get closest data point
      const closestData = { x: mx, y: my };

      that.highlight(closestHex, that.k);

      // highlight current cell
      const cell = selectAll(".hex-cell").filter(
        (d) => d.x === closestHex.x && d.y === closestHex.y
      );

      cell.attr("stroke", "black").attr("stroke-width", 3).raise();

      // unhover other ones
      selectAll(".hex-cell")
        .filter((d) => d.x !== closestHex.x || d.y !== closestHex.y)
        .attr("stroke-width", 0)
        .style("stroke", "#161E2D");

      select(".highlight-circle")
        .style("display", "")
        .attr("cx", closestHex.x)
        .attr("cy", closestHex.y)
        .attr("stroke", "black");
    }

    // draw line
    this.addDecisionLine(this.predictG);
    this.updateHexGrid(this.k);
  }

  updateHexGrid(k) {
    const that = this;

    function getKnnClassScores(data, point, k) {
      // get nearest neighbors to cell
      const nn = getKNN(data, point, k);
      // filter data to class scores of nn
      const nScores = nn.map((d) => d[2]);
      const sum0 = nScores.filter((v) => v === 0).length / k;
      const sum1 = nScores.filter((v) => v === 1).length / k;
      const cellVal = sum1 - sum0;
      return that.cellColor(cellVal);
    }

    selectAll(".hex-cell").each(function (d, i) {
      const pred = getKnnClassScores(that.trainData, d[0], k);
      select(this).attr("fill", pred).attr("stroke", pred);
    });
  }

  addSlider() {
    const that = this;
    // SLIDER
    const el = select(`#${this.sliderContainer}`);

    // draw text
    el.append("h4").attr("id", `k-text`).html(`K: ${this.k}`);

    // draw slider
    el.append("input")
      .attr("class", "metric-slider")
      .attr("type", "range")
      .attr("value", `${this.k}`)
      .attr("min", 1)
      .attr("max", numPoints)
      .attr("step", 2)
      .attr("maxlength", "100");

    selectAll(`.metric-slider`).on("input", function (d) {
      // only update text
      let val = select(this).property("value");
      // set price to object state
      const currValue = Number(val);
      this.k = currValue;
      select("#k-text").html(`K: ${this.k}`);
      // update left chart
      that.highlight(that.lastDataHovered, this.k);
      // update right chart
      that.updateHexGrid(this.k);
    });
  }

  // initialize svg and params for chart
  initChartSvg(stage) {
    const svg = select(`#${stage}`)
      .append("svg")
      .attr("id", `${stage}-svg`)
      .attr("width", this.WIDTH + this.MARGIN.LEFT + this.MARGIN.RIGHT)
      .attr("height", this.HEIGHT + this.MARGIN.TOP + this.MARGIN.BOTTOM)
      .style("border", "1px solid rgba(0, 0, 0, 0.3)");

    const g = svg
      .append("g")
      .attr("id", `${stage}-g`)
      .attr("transform", `translate(${this.MARGIN.LEFT}, ${this.MARGIN.TOP})`);

    return g;
  }
}

// Nearest Neighbor Helper Functions
function getNNN(data, loc, k) {
  // 1. get the distances between the data (train_data)
  //    and the current point (loc).
  let dists = [];
  for (let i = 0; i < data.length; i++) {
    dists.push([i, dist(data[i], loc)]);
  }
  // 2. sort those points to the test data in ascending order
  dists.sort((a, b) => a[1] - b[1]);
  // 3. Keep the indices of the top k train_data points
  let nnn = [];
  for (let i = 0; i < k; i++) {
    nnn.push(dists[i][0]);
  }
  return nnn;
}

function getKNN(data, point, k) {
  // 1. get the distances between the data & current point.
  let dists = [];
  for (let i = 0; i < data.length; i++) {
    // now index 2 is the actual data
    dists.push([i, dist(data[i], point), data[i]]);
  }
  // 2. sort those points to the test data in ascending order
  dists.sort((a, b) => a[1] - b[1]);

  // 3. Keep the indices of the top n-nearest neighbors
  let knn = [];
  for (let i = 0; i < k; i++) {
    knn.push(dists[i][2]); // to return index, return 0
  }
  return knn;
}
