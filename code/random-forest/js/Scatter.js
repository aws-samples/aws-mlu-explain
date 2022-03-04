import * as d3 from "d3";
// Note for Jenny - this file should be updated as it doesn't follow any d3 design patterns
function nCr(a, n) {
  let pascal = [
    [],
    [1],
    [],
    [1, 3],
    [],
    [1, 5, 10],
    [],
    [1, 7, 21, 35],
    [],
    [1, 9, 36, 84, 126],
    [],
    [1, 11, 55, 165, 330, 462],
    [],
    [1, 13, 78, 286, 715, 1287, 1716],
    [],
    [1, 15, 105, 455, 1365, 3003, 5005, 6435],
    [],
    [1, 17, 136, 680, 2380, 6188, 12376, 19448, 24310],
    [],
    [1, 19, 171, 969, 3876, 11628, 27132, 50388, 75582, 92378],
    [],
    [1, 21, 210, 1330, 5985, 20349, 54264, 116280, 203490, 293930, 352716],
    [],
    [
      1, 23, 253, 1771, 8855, 33649, 100947, 245157, 490314, 817190, 1144066,
      1352078,
    ],
    [],
    [
      1, 25, 300, 2300, 12650, 53130, 177100, 480700, 1081575, 2042975, 3268760,
      4457400, 5200300,
    ],
  ];
  return pascal[a][n];
}

export class Scatter {
  constructor(opts) {
    this.chartContainer = opts.chartContainer;
    this.strokeWidth = 1;
    this.width = d3
      .select(this.chartContainer)
      .node()
      .getBoundingClientRect().width;
    this.height = d3
      .select(this.chartContainer)
      .node()
      .getBoundingClientRect().height;
    this.prob = 0.6;
    this.data = [];
    this.numDots = 0;
    this.dataUpdate(this.prob);
    this.makeScatter();
    this.drawDots(this.numDots);
  }
  dataUpdate(prob) {
    this.prob = prob;
    this.data = [];
    let j = 0;
    let f = 1 - prob;
    for (j = 1; j < 26; j = j + 2) {
      let p = Math.pow(f, j);
      let k = 1;
      for (k = 1; k < j / 2; k++) {
        p = p + nCr(j, k) * Math.pow(f, j - k) * Math.pow(prob, k);
      }
      this.data.push([j, 1 - p]);
    }
  }
  makeScatter() {
    let vis = this;
    let padding = 40;

    //Create scale functions
    let xScale = d3
      .scaleLinear()
      .domain([0, 25])
      .range([padding, vis.width - padding / 2]);

    let yScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([vis.height - padding, padding / 2]);

    //Define X axis
    let xAxis = d3
      .axisBottom()
      .scale(xScale)
      .tickSize(0)
      .tickSizeOuter(0)
      .ticks(5);

    //Define Y axis
    let yAxis = d3
      .axisLeft()
      .scale(yScale)
      .tickSize(-this.width)
      .tickSizeOuter(0)
      .ticks(6)
      .tickFormat((x) => `${d3.format(".0%")(x)}`);

    const containerDims = d3
      .select(this.chartContainer)
      .node()
      .getBoundingClientRect();

    //Create SVG element
    let svg = d3
      .select(vis.chartContainer)
      .append("svg")
      .attr("class", "scatter")
      .attr("width", containerDims.width)
      .attr("height", containerDims.height);

    //Create X axis
    svg
      .append("g")
      .attr("class", "axis")
      .attr("id", "x-axis")
      .attr("transform", "translate(0," + (vis.height - padding) + ")")
      .style("font-size", this.width / 40)
      .style("color", "#354848")
      .call(xAxis);

    //Create Y axis
    svg
      .append("g")
      .attr("class", "axis")
      .attr("id", "y-axis")
      .attr("transform", "translate(" + padding + ",0)")
      .style("font-size", this.height / 20)
      .style("color", "#354848")
      .call(yAxis);

    // add text labels
    svg
      .append("text")
      .attr("class", "scatter-axis-text")
      .attr("x", this.width / 2)
      .attr("y", this.height)
      .attr("dy", -padding / 6)
      .attr("text-anchor", "middle")
      .text("Ensemble Accuracy by Tree Count");
    svg
      .append("text")
      .attr("class", "scatter-axis-text")
      .attr("x", -this.height / 2)
      .attr("y", -50)
      .attr("text-anchor", "middle")
      .text("Price, in USD")
      .attr("transform", "rotate(-90)");

    //Create circles
    const circle = svg.selectAll("circle").data(vis.data);

    const circleG = circle
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${xScale(d[0])}, ${yScale(d[1])})`);

    circleG
      .append("circle")
      .attr("class", (d, i) => "circle-" + i)
      .attr("r", 0)
      .style("fill", "rgb(254, 236, 169)")
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("fill-opacity", 1);

    circleG
      .append("text")
      .attr("class", "percent")
      .text((d) =>
        window.innerWidth < 700
          ? d3.format(".1f")(d[1])
          : d3.format(".2f")(d[1])
      )
      .attr("y", window.innerWidth < 700 ? "-5px" : "-.5rem")
      .attr("font-size", window.innerWidth < 700 ? ".3rem" : ".5rem")
      .attr("text-anchor", "middle");
  }

  drawDots(numDotsToDisplay) {
    this.numDots = numDotsToDisplay;
    let sliceTrees = this.data.slice(0, numDotsToDisplay);
    let j = 0;
    for (j = numDotsToDisplay; j < 25; j++) {
      sliceTrees.push(null);
    }
    let aScale = d3.scaleLinear().domain([0, 1]).range([1, 13]);
    let padding = 30;
    let vis = this;
    let sel = d3.select(this.chartContainer);
    sel
      .selectAll("svg.scatter")
      .selectAll("circle")
      .data(sliceTrees)
      .attr("r", (d) => {
        if (d != null) return aScale(vis.width / 1000);
        else return 0;
      });

    sel
      .selectAll("svg.scatter")
      .selectAll("text.percent")
      .data(sliceTrees)
      .attr("visibility", (d) => {
        if (d != null) return "visible";
        else return "hidden";
      });
  }

  // TODO: This can be more efficient by making sure axis are drawn only once.
  circleUpdate(newProb) {
    let vis = this;
    vis.prob = newProb;
    vis.dataUpdate(newProb);
    d3.select(vis.chartContainer).selectAll("svg.scatter").remove();
    this.makeScatter();
  }
  resizeChart() {
    let vis = this;
    this.width = d3
      .select(this.chartContainer)
      .node()
      .getBoundingClientRect().width;
    this.height = d3
      .select(this.chartContainer)
      .node()
      .getBoundingClientRect().height;
    this.dataUpdate(this.prob);
    d3.select(vis.chartContainer).selectAll("svg.scatter").remove();
    this.makeScatter();
    this.drawDots(this.numDots);
  }
}
