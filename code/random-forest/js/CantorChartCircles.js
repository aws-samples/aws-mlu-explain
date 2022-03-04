import * as d3 from "d3";
import { rf, trees } from "./data";
import textures from "textures";
import { Delaunay } from "d3-delaunay";

export class CantorChartCircles {
  constructor(opts) {
    this.treeGrid = opts.CantorChartTrees;
    this.chartContainer = opts.chartContainer;
    this.nrows = opts.nrows; // Number of Data Points
    this.ncols = opts.ncols; // Number of Trees + 1 for RF
    this.chartDims = d3
      .select(this.chartContainer)
      .node()
      .getBoundingClientRect();
    this.margin = {
      top: 30,
      bottom: 20,
      left: 40,
      right: 0,
    };
    this.drawChart();
    this.addLabel();
    this.addTexture();
    this.addDivider();
    this.addLegend();
  }
  drawChart() {
    const vis = this;
    // Add SVG and G element
    this.width = this.chartDims.width;
    this.height = this.chartDims.height;
    this.gridWidth = this.width - this.margin.right - this.margin.left;
    this.gridHeight = this.height - this.margin.top - this.margin.bottom;
    this.svg = d3
      .select(this.chartContainer)
      .append("svg")
      .attr("id", "cantor-grid")
      .attr("width", this.gridWidth + this.margin.right + this.margin.left)
      .attr("height", this.gridHeight + this.margin.top + this.margin.bottom);
    this.g = this.svg
      .append("g")
      .attr("transform", `translate(${this.margin.left},${this.margin.top})`)
      .style("stroke", "red");
    // Resolve Cell Size
    this.cellWidth = this.gridWidth / this.ncols;
    this.cellHeight = this.gridHeight / this.nrows;
    this.radius = Math.min(this.cellWidth, this.cellHeight) / 2; // divide by 2 b/c it's radius
    // Make Scales
    this.xScale = d3
      .scaleLinear()
      .domain([0, this.ncols - 1])
      .range([this.radius, this.gridWidth - this.radius]);
    this.yScale = d3
      .scaleLinear()
      .domain([0, this.nrows - 1])
      .range([this.radius, this.gridHeight - this.radius]);
    // Create a Dataset for the grid
    this.data = [];
    for (let rowNum = 0; rowNum < this.nrows; rowNum++) {
      for (let colNum = 0; colNum < this.ncols; colNum++) {
        let treeData = rowNum === 0 ? rf[colNum] : trees[rowNum - 1][colNum]; // This is data about the tree.
        let data = {
          x: colNum,
          y: rowNum,
          treeData: treeData,
        };
        this.data.push(data);
      }
    }

    //   DELAUNAY STUFF
    const delan = Delaunay.from(
      vis.data,
      (d) => vis.xScale(d.x),
      (d) => vis.yScale(d.y)
    );

    //Create a grid of gs to put the circles
    const circleG = this.g
      .selectAll("g.grid")
      .data(this.data)
      .enter()
      .append("g")
      .attr("class", "grid")
      .attr(
        "transform",
        (d) => `translate(${this.xScale(d.x)},${this.yScale(d.y)})`
      );

    // add overlay circle for delaunay
    this.g
      .append("rect")
      .attr("class", "overlay")
      .attr("width", this.gridWidth + this.margin.left + this.margin.right)
      .attr("height", this.gridHeight + this.margin.bottom + this.margin.top)
      .style("opacity", 0)
      .on("mousemove", hover)
      .on("mouseleave", unhover);

    // Add circles to the g element
    circleG.each(function (d) {
      // Placeholder for cells
      const cell = d3.select(this).append("g"); // this is internal this
      // Add Rect to the cell
      cell
        .append("circle")
        .attr("pathid", (d) => `p${d.treeData.id}`)
        .attr("class", "cantorCirc")
        .attr("r", vis.radius - 1)
        .attr("fill", (d) => (d.treeData.pd === 0 ? "#ED8888" : "#7BACC9"));
    });

    function hover(event) {
      // get the current mouse position
      const [mx, my] = d3.pointer(event);
      // use the new diagram.find() function to find the Voronoi mouse position
      const closestPoint = delan.find(mx, my);
      // highlight the point if we found one
      const closestDataPoint = vis.data[closestPoint];
      // // highlight current circle
      d3.selectAll("circle.cantorCirc")
        .filter((d) => d.x === closestDataPoint.x && d.y === closestDataPoint.y)
        .attr("stroke", "black")
        .attr("stroke-width", 2);

      // dehighlight all paths. do this before current hover
      vis.treeGrid.dehighlightPath();
      // highlight tree path associated with given circle
      vis.treeGrid.highlightPath(
        closestDataPoint.y === 0,
        closestDataPoint.y - 1,
        `p${closestDataPoint.treeData.id}`
      );

      //  // unhover all other circles
      d3.selectAll("circle.cantorCirc")
        .filter((d) => d.x !== closestDataPoint.x || d.y !== closestDataPoint.y)
        .attr("stroke", (d) => (d.treeData.c === 1 ? "#354848" : "white"))
        .attr("stroke-width", 1);
    }
    //   unhover everything if mouse out of rect
    function unhover() {
      d3.selectAll("circle.cantorCirc")
        .attr("stroke", (d) => (d.treeData.c === 1 ? "#354848" : "white"))
        .attr("stroke-width", 1);
      vis.treeGrid.dehighlightPath();
    }
  }
  // Arrow function this is not the same as function() this. For function() this,
  addLabel() {
    // Add Bottom Title
    this.svg
      .append("text")
      .attr("class", "cantor-label-text")
      .text("Hover over to see decision path!")
      .attr("x", this.width / 2 + this.margin.left / 3)
      .attr("y", this.height - this.margin.bottom / 10)
      .attr("text-anchor", "middle")
      .attr("font-size", "0.8rem");
    // Add "Forest" title
    this.svg
      .append("text")
      .text("Forest")
      .attr("class", "cantor-label-text")
      .attr("x", this.margin.left / 2)
      .attr("y", this.xScale(0) + this.radius - 2 + this.margin.top)
      .attr("text-anchor", "middle")
      .attr("font-size", "0.8rem");
    // Add Left Title
    this.svg
      .append("text")
      .text("Trees")
      .attr("class", "cantor-label-text")
      .attr("x", -(this.gridHeight + this.margin.top + this.margin.bottom) / 2)
      .attr("y", this.margin.left / 1.5)
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("font-size", "0.9rem");
  }
  addTexture() {
    let vis = this;
    // init scale
    const colorScalePrediction = d3
      .scaleOrdinal()
      .domain([0, 1])
      .range(["#ED8888", "#7BACC9"]);
    this.incorrectPink = textures
      .lines()
      .size(3)
      .strokeWidth(1)
      .stroke("white")
      .background("#ED8888");
    this.incorrectBlue = textures
      .lines()
      .size(3)
      .strokeWidth(1)
      .stroke("white")
      .background("#7BACC9");
    this.incorrectWhite = textures
      .lines()
      .size(3)
      .strokeWidth(1)
      .stroke("white")
      .background("#a7d1b4");
    this.svg.call(vis.incorrectPink);
    this.svg.call(vis.incorrectBlue);
    this.svg.call(vis.incorrectWhite);
    d3.selectAll("circle.cantorCirc")
      .attr("stroke", (d) => (d.treeData.c === 1 ? "#354848" : "white"))
      .attr("stroke-width", 1)
      .attr("fill", (d) =>
        d.treeData.c === 1
          ? colorScalePrediction(d.treeData.pd)
          : d.treeData.pd === 0
          ? vis.incorrectPink.url()
          : vis.incorrectBlue.url()
      );
  }
  addDivider() {
    this.svg
      .append("rect")
      .attr("class", "divider")
      .attr("y", this.yScale(1) - this.radius + this.margin.top) // put a divider perfectly inbetween two rows
      .attr("x", 0)
      .attr("height", 1)
      .attr("width", this.width)
      .attr("fill", "grey");
  }
  addLegend() {
    const vis = this;
    const legendData = ["Model Predictions: ", "No", "Yes", "Incorrect"];

    const nodeWidth = (d) => d.getBBox().width;

    const legend = this.svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", "translate(0,0)");

    const lg = legend.selectAll("g").data(legendData).enter().append("g");

    // add text
    lg.append("text")
      .attr("class", "legend-text")
      .attr("x", () => (window.innerWidth < 550 ? 7 : 10))
      .attr("y", window.innerWidth < 550 ? 8 : 10)
      .text((d) => d);

    // add circles
    lg.filter((d, i) => i !== 0)
      .append("circle")
      .attr("class", "legend-circle")
      .attr("r", window.innerWidth < 550 ? vis.radius - 1 : vis.radius - 2)
      .attr("fill", (d, i) =>
        i === 2
          ? vis.incorrectWhite.url()
          : i % 2 == 0
          ? "rgb(237, 136, 136)"
          : "rgb(123, 172, 201)"
      )
      .attr("cy", 5)
      .attr("cx", window.innerWidth < 550 ? -3 : 1)
      .attr("stroke-width", 1)
      .attr("stroke", (d, i) => (i === 2 ? "white" : "rgb(53, 72, 72)"));

    let offset = 0;

    lg.attr("transform", function (d, i) {
      let x = offset;
      const offsetLeft = window.innerWidth < 550 ? 12 : 15;
      const offsetCircle = window.innerWidth < 550 ? 15 : 10;
      if (i === 0) offset += offsetLeft;
      offset += nodeWidth(this) + offsetCircle;
      return `translate(${x}, ${0})`;
    });

    legend.attr("transform", function () {
      return `translate(${
        (vis.width - nodeWidth(this)) / 2
      }, ${vis.margin.top / 3})`;
    });
  }

  // Followed the same method in BarcodeGrid.js
  resizeChart() {
    let vis = this;
    vis.ncols = window.innerWidth < 600 ? 10 : 29;
    d3.selectAll("svg#cantor-grid").remove();
    this.chartDims = d3 // holds buttons
      .select(this.chartContainer)
      .node()
      .getBoundingClientRect();
    this.drawChart();
    this.addLabel();
    this.addTexture();
    this.addDivider();
    this.addLegend();
  }
}
