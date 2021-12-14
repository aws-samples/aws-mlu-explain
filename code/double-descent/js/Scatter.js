import { interpolateString } from "d3-interpolate";
import { select, selectAll } from "d3-selection";
import { scaleLinear } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import { line } from "d3-shape";
import { circleData, scatterData } from "./dataFiles";

function scatterPathLen(path, x) {
  path = path.node();
  const pathLength = path.getTotalLength();
  let start = 0;
  let end = pathLength;
  let target = (start + end) / 2;

  while (target >= start && target <= pathLength) {
    let pos = path.getPointAtLength(target);
    if (Math.abs(pos.x - x) < 0.1) {
      return target;
    } else if (pos.x > x) {
      end = target;
    } else {
      start = target;
    }
    target = (start + end) / 2;
  }
}

function transitionScatter(path, x1, x2) {
  path
    .transition()
    .attrTween("stroke-dasharray", function () {
      const l = this.getTotalLength();
      const i = interpolateString(`${x1}, ${l}`, `${x2}, ${l}`);
      return function (t) {
        return i(t);
      };
    })
    .on("end", () => {
      select(this).call((d) => transitionScatter(d, x1, x2));
    });
}

export class Scatter {
  constructor(opts) {
    // load in arguments from config object
    this.element = opts.container;

    this.innerWidth =
      window.innerWidth >= 1000
        ? window.innerWidth / 4
        : window.innerWidth / 1.6;
    this.innerHeight = window.innerHeight * 0.27;
    this.margin = { left: 55, right: 30, top: 15, bottom: 30 };

    this.circleRadius = window.innerWidth > 600 ? 4 : 3;

    this.drawBaseChart();
    this.drawCircles();
  }

  drawBaseChart() {
    // create svg
    this.scatterSvg = select(this.element)
      .append("svg")
      .attr("id", "scatter-svg")
      .attr("width", this.innerWidth + this.margin.left + this.margin.right)
      .attr("height", this.innerHeight + this.margin.top + this.margin.bottom);

    // create scatter plot g
    this.scatterPlot = this.scatterSvg
      .append("g")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

    // define x-scale
    this.xScale = scaleLinear().domain([-2.1, 2.1]).range([0, this.innerWidth]);

    // define y-scale
    this.yScale = scaleLinear()
      .domain([-3.5, 3.5])
      .range([this.innerHeight, 0]);

    // define axes
    this.xAxisGenerator = axisBottom(this.xScale)
      .tickSize(0)
      .tickSizeOuter(0)
      .ticks(4);
    this.yAxisGenerator = axisLeft(this.yScale)
      .tickSize(-this.innerWidth)
      .tickSizeOuter(0)
      .ticks(4);

    // add x-axis
    this.xAxis = this.scatterPlot
      .append("g")
      .attr("class", "axis")
      .attr("id", "scatter-x-axis")
      .call(this.xAxisGenerator)
      .attr("transform", `translate(0, ${this.innerHeight})`);

    // add y-axis
    this.yAxis = this.scatterPlot
      .append("g")
      .attr("class", "axis")
      .attr("id", "scatter-y-axis")
      .call(this.yAxisGenerator);
  }

  drawCircles() {
    // add circles
    this.scatterPlot
      .selectAll("circle.scatter-circle")
      .data(circleData)
      .enter()
      .append("circle")
      .attr("class", "scatter-circle")
      .attr("r", this.circleRadius)
      .attr("cx", (d) => this.xScale(d.x))
      .attr("cy", (d) => this.yScale(d.y));

    // create line generator
    this.lineGen = line()
      .x((d) => this.xScale(d.x))
      .y((d) => this.yScale(d["y-3"]));

    // Create a update selection: bind to the new data
    this.regressionLine = this.scatterPlot
      .selectAll("#scatter-line")
      .data([scatterData], (d) => d.x);

    // Updata the line
    this.regressionLine
      .enter()
      .append("path")
      .attr("id", "scatter-line")
      .attr("d", this.lineGen)
      .call((d) => transitionScatter(d, 0, 0));

    // ensure line under circles
    selectAll("path#scatter-line").lower();
  }

  transition0Down() {
    this.regressionLine = this.scatterPlot
      .selectAll("#scatter-line")
      .data([scatterData], (d) => d.x);

    let x1 = scatterPathLen(this.regressionLine, this.xScale(-2));
    let x2 = scatterPathLen(this.regressionLine, this.xScale(2));

    // Updata the line
    this.regressionLine
      .merge(this.regressionLine)
      .attr("d", this.lineGen)
      .call((d) => transitionScatter(d, x1, x2 + 10));
  }

  transition0Up() {
    let x1 = scatterPathLen(this.regressionLine, this.xScale(-2));
    let x2 = scatterPathLen(this.regressionLine, this.xScale(2));

    this.updateLine("y-3");
  }

  updateLineInput(line) {
    // update line generator
    this.lineGen.y((d) => this.yScale(d[line]));

    // rebind line data
    this.regressionLine = this.scatterPlot
      .selectAll("#scatter-line")
      .data([scatterData], (d) => d.x);

    // Updata the line
    this.regressionLine
      .enter()
      .append("path")
      .attr("id", "scatter-line")
      .merge(this.regressionLine)
      .attr("d", this.lineGen);

    // ensure line under circles
    selectAll("path#scatter-line").lower();
  }

  updateLine(line) {
    select("#scatter-line").style("stroke-dasharray", "none");
    // update line generator
    this.lineGen.y((d) => this.yScale(d[line]));

    // rebind line data
    this.regressionLine = this.scatterPlot
      .selectAll("#scatter-line")
      .data([scatterData], (d) => d.x);

    // Updata the line
    this.regressionLine
      .enter()
      .append("path")
      .attr("id", "scatter-line")
      .merge(this.regressionLine)
      .transition()
      .attr("d", this.lineGen);
  }

  addTitle(title) {
    // remove title if shown
    select(".scatter-title").remove();

    // add title
    this.scatterSvg
      .append("g")
      .append("text")
      .attr("class", "scatter-title")
      .attr("x", this.innerWidth / 2 + this.margin.left)
      .attr("y", 20)
      .text(title)
      .attr("text-anchor", "middle");
  }
}
