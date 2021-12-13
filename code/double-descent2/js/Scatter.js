import { select } from "d3-selection";
import { axisBottom, axisLeft } from "d3-axis";
import { scaleLinear } from "d3-scale";
import { line } from "d3-shape";
import { transition } from "d3-transition";
import { lineData } from "./dataFiles";

export class Scatter {
  constructor(opts) {
    // load in arguments from config object
    this.element = opts.container;
    this.lineIndex = opts.lineIndex;
    this.pts = opts.pts;
    this.yMin = opts.yMin;
    this.yMax = opts.yMax;
    (this.points = [
      { x: 0, y: 25 },
      { x: 1, y: 9 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 4, y: 9 },
      { x: 5, y: 25 },
    ]),
      (this.innerWidth =
        window.innerWidth >= 1000
          ? window.innerWidth / 3.5
          : window.innerWidth / 1.4);
    this.innerHeight = window.innerHeight * 0.3;
    this.margin = { left: 25, right: 9, top: 15, bottom: 40 };

    this.drawBaseChart();
    this.drawLine(this.lineIndex);

    this.drawCircles();
    this.drawVerticalLines();
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
    this.xScale = scaleLinear().domain([-0.1, 5.1]).range([0, this.innerWidth]);

    // define y-scale
    this.yScale = scaleLinear()
      .domain([this.yMin, this.yMax])
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
      .data(this.points)
      .enter()
      .append("circle")
      .attr("class", "scatter-circle")
      .attr("r", 3.5)
      .attr("cx", (d) => this.xScale(d.x))
      .attr("cy", (d) => this.yScale(d.y));
  }

  drawLine(lineIdx) {
    // create line generator
    this.lineGen = line()
      .x((d) => this.xScale(d.x))
      .y((d) => this.yScale(d[lineIdx]));

    // Create a update selection: bind to the new data
    this.line = this.scatterPlot
      .selectAll(".scatter-line")
      .data([lineData], (d) => d.x);

    // Updata the line
    this.line
      .enter()
      .append("path")
      .attr("class", "scatter-line")
      .attr("d", this.lineGen);
  }

  drawVerticalLines() {
    // if exist: draw vertical lines at pts values
    if (this.pts !== undefined || this.pts.length !== 0) {
      this.scatterPlot
        .selectAll(".vertical-line")
        .data(this.pts)
        .enter()
        .append("line")
        .attr("class", "vertical-line")
        .attr("x1", (d) => this.xScale(d))
        .attr("y1", this.yScale(this.yMin))
        .attr("x2", (d) => this.xScale(d))
        .attr("y2", this.yScale(this.yMax));
    }
  }

  animate() {
    const that = this;
    const transSpeed = 1200;

    // vertical line animation
    function animateVerticalLine() {
      // move line back and forth
      that.scatterPlot
        .select(".vertical-line")
        .transition()
        .duration(transSpeed)
        .attr("x1", that.xScale(1.8997986169532743))
        .attr("x2", that.xScale(1.8997986169532743))
        .transition()
        .duration(transSpeed)
        .attr("x1", that.xScale(1.1))
        .attr("x2", that.xScale(1.1))
        .on("end", animateVerticalLine);
    }

    // line chart data animation
    function animateLine() {
      // define new line gens
      that.lineGen1 = line()
        .x((d) => that.xScale(d.x))
        .y((d) => that.yScale(d["line4"]));
      that.lineGen2 = line()
        .x((d) => that.xScale(d.x))
        .y((d) => that.yScale(d["line_animate"]));

      // Create a update selection: bind to the new data
      that.line = that.scatterPlot
        .selectAll(".scatter-line")
        .data([lineData], (d) => d.x);

      // Updata the line on repeat
      that.line
        .merge(that.line)
        .transition()
        .duration(transSpeed)
        .attr("d", that.lineGen2)
        .transition()
        .duration(transSpeed)
        .attr("d", that.lineGen1)
        .on("end", animateLine);
    }

    // kick off animation funcs
    animateVerticalLine();
    animateLine();
  }
}
