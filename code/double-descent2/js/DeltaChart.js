import { select } from "d3-selection";
import { axisBottom, axisLeft } from "d3-axis";
import { scaleLinear } from "d3-scale";

export class DeltaChart {
  constructor(opts) {
    this.element = opts.container;
    this.circleData = [
      { x: 0, y: 4 },
      { x: 2, y: 7 },
      { x: 4, y: 7.5 },
    ];
    this.deltaData = [
      { x: 1, y: 4.5 },
      { x: 3, y: 4.5 },
    ];
    this.deltaLabelData = [
      { x: 1, y: 5.5 },
      { x: 3, y: 7.2367 },
    ];
    this.innerWidth =
      window.innerWidth >= 1000
        ? window.innerWidth / 3.5
        : window.innerWidth / 1.4;
    this.innerHeight = window.innerHeight * 0.3;
    this.margin = { left: 15, right: 9, top: 5, bottom: 40 };

    this.drawBaseChart();
    this.drawFigure();
  }

  drawBaseChart() {
    // create svg
    this.deltaSvg = select("#delta-chart")
      .append("svg")
      .attr("id", "delta-svg")
      .attr("width", this.innerWidth + this.margin.left + this.margin.right)
      .attr("height", this.innerHeight + this.margin.top + this.margin.bottom);

    // create delta plot g
    this.deltaPlot = this.deltaSvg
      .append("g")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

    // define x-scale
    this.xScale = scaleLinear().domain([-2.1, 6.1]).range([0, this.innerWidth]);

    // define y-scale
    this.yScale = scaleLinear().domain([0, 12]).range([this.innerHeight, 0]);

    // define axes
    this.xAxisGenerator = axisBottom(this.xScale)
      .tickSize(0)
      .tickSizeOuter(0)
      .ticks(4)
      .tickValues([0, 2, 4])
      .tickFormat("");

    this.yAxisGenerator = axisLeft(this.yScale)
      .tickSize(-this.innerWidth)
      .tickSizeOuter(0)
      .ticks(4);

    // add x-axis
    this.xAxis = this.deltaPlot
      .append("g")
      .attr("class", "axis")
      .attr("id", "delta-x-axis")
      .call(this.xAxisGenerator)
      .attr("transform", `translate(0, ${this.innerHeight})`);

    // add y-axis
    this.yAxis = this.deltaPlot
      .append("g")
      .attr("class", "axis")
      .attr("id", "delta-y-axis")
      .call(this.yAxisGenerator);
  }

  drawFigure() {
    // add circles
    this.deltaPlot
      .selectAll("circle.delta-circle")
      .data(this.circleData)
      .enter()
      .append("circle")
      .attr("class", "delta-circle")
      .attr("r", 3.5)
      .attr("cx", (d) => this.xScale(d.x))
      .attr("cy", (d) => this.yScale(d.y));

    // draw lines
    this.deltaPlot
      .append("line")
      .attr("class", "delta-line")
      .attr("x1", this.xScale(this.circleData[0].x))
      .attr("y1", this.yScale(this.circleData[0].y))
      .attr("x2", this.xScale(this.circleData[1].x))
      .attr("y2", this.yScale(this.circleData[1].y));

    this.deltaPlot
      .append("line")
      .attr("class", "delta-line")
      .attr("x1", this.xScale(this.circleData[1].x))
      .attr("y1", this.yScale(this.circleData[1].y))
      .attr("x2", this.xScale(this.circleData[2].x))
      .attr("y2", this.yScale(this.circleData[2].y));

    // delta line
    this.deltaPlot
      .append("line")
      .attr("class", "delta-line")
      .attr("x1", this.xScale(this.deltaData[0].x))
      .attr("y1", this.yScale(this.deltaData[0].y))
      .attr("x2", this.xScale(this.deltaData[1].x))
      .attr("y2", this.yScale(this.deltaData[1].y));

    // delta circles
    this.deltaPlot
      .selectAll("rect.delta2-rect")
      .data(this.deltaData)
      .enter()
      .append("rect")
      .attr("class", "delta2-rect")
      .attr("width", 1)
      .attr("height", 8)
      .attr("x", (d) => this.xScale(d.x))
      .attr("y", (d) => this.yScale(d.y) - 4);

    // delta rects
    this.deltaPlot
      .selectAll("rect.delta3-rect")
      .data(this.deltaLabelData)
      .enter()
      .append("rect")
      .attr("class", "delta3-rect")
      .attr("width", 1)
      .attr("height", 8)
      .attr("x", (d) => this.xScale(d.x))
      .attr("y", (d) => this.yScale(d.y) - 4);

    // add text
    this.deltaPlot
      .selectAll(".axis-text")
      .data(this.circleData, (d) => d.x)
      .enter()
      .append("text")
      .attr("class", "axis-text")
      .attr("x", (d) => this.xScale(d.x))
      .attr("y", this.innerHeight + 15)
      .attr("dx", 2)
      .attr("text-anchor", "middle")
      .html("t")
      .style("font-size", "1rem")
      .append("tspan")
      .text((d, i) => {
        if (i == 0) {
          return "i-1";
        } else if (i == 2) {
          return "i+1";
        } else {
          return "i";
        }
      })
      .style("font-size", ".6rem");

    // draw delta annotation
    this.deltaPlot
      .selectAll(".axis-text2")
      .data(this.deltaLabelData, (d) => d.x)
      .enter()
      .append("text")
      .attr("class", "axis-text2")
      .attr("x", (d) => this.xScale(d.x))
      .attr("y", (d) => this.yScale(d.y))
      .attr("dx", 0)
      .attr("dy", -8)
      .attr("text-anchor", "middle")
      .html("&delta;")
      .style("font-size", "1rem")
      .append("tspan")
      .text((d, i) => (i == 0 ? "i" : "i+1"))
      .style("font-size", ".6rem");

    // draw Delta annotations
    this.deltaPlot
      .append("text")
      .attr("x", (d) => this.xScale(2.5))
      .attr("y", (d) => this.yScale(this.deltaData[0].y))
      .attr("dx", 0)
      .attr("dy", -8)
      .attr("text-anchor", "middle")
      .html("&Delta;")
      .style("font-size", "1rem")
      .append("tspan")
      .text((d, i) => (i == 0 ? "i" : "i+1"))
      .style("font-size", ".8rem");

    // draw vertical lines
    this.deltaPlot
      .selectAll(".interpretation-vertical-line")
      .data(this.circleData)
      .enter()
      .append("line")
      .attr("class", "interpretation-vertical-line")
      .attr("x1", (d) => this.xScale(d.x))
      .attr("y1", (d) => this.yScale(0))
      .attr("x2", (d) => this.xScale(d.x))
      .attr("y2", (d) => this.yScale(d.y));
  }
}
