import { interpolateString } from "d3-interpolate";
import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import { errorData } from "./dataFiles";
import { line } from "d3-shape";
import { transition } from "d3-transition";

function errorPathLen(path, x) {
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

function transitionError(path, x1, x2) {
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
      select(this).call((d) => transitionError(d, x1, x2));
    });
}

export class Error {
  constructor(opts) {
    // load in arguments from config object
    this.element = opts.container;

    this.innerWidth =
      window.innerWidth >= 1000
        ? window.innerWidth / 4.1
        : window.innerWidth / 1.6;
    this.innerHeight = window.innerHeight * 0.28;
    this.margin = { left: 40, right: 9, top: 15, bottom: 50 };

    this.drawBaseChart();
    this.drawAxes();
    this.drawErrorLine();
  }

  drawBaseChart() {
    // create svg
    this.errorSvg = select(this.element)
      .append("svg")
      .attr("id", "error-svg")
      .attr("width", this.innerWidth + this.margin.left + this.margin.right)
      .attr("height", this.innerHeight + this.margin.top + this.margin.bottom);

    // create error plot g
    this.errorPlot = this.errorSvg
      .append("g")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

    // add vertical line
    this.verticalToolTip = this.errorPlot
      .append("line")
      .attr("id", "error-tooltip")
      .attr("stroke", "black")
      .style("stroke-width", 3)
      .style("pointer-events", "none")
      .style("stroke-dasharray", 4);
  }

  drawAxes() {
    // define scales
    this.xScale = scaleLinear().domain([0, 5.8]).range([0, this.innerWidth]);
    this.yScale = scaleLinear().domain([0, 1]).range([this.innerHeight, 0]);

    // // draw x-axis
    this.xAxis = this.errorPlot
      .append("g")
      .attr("class", "axis")
      .attr("id", "error-x-axis")
      .attr("transform", `translate(0, ${this.innerHeight})`);

    this.xAxis.call(
      axisBottom(this.xScale).tickSize(0).tickSizeOuter(0).ticks(4)
    );

    // draw y-axis
    this.yAxis = this.errorPlot
      .append("g")
      .attr("class", "axis")
      .attr("id", "error-y-axis");

    this.yAxis.call(
      axisLeft(this.yScale)
        .tickSize(-this.innerWidth)
        .tickSizeOuter(0)
        .tickValues([0.25, 0.5, 0.75, 1])
        .tickFormat((d) => d)
    );

    // aerror labels to axes
    this.errorSvg
      .append("text")
      .attr("class", "error-axis-text")
      .attr("x", this.innerWidth / 2 + this.margin.left + this.margin.right)
      .attr("y", this.innerHeight + this.margin.bottom)
      .text("Log(# of Non-linear Features)")
      .attr("text-anchor", "middle");
    this.errorSvg
      .append("text")
      .attr("class", "error-axis-text")
      .attr("y", this.margin.left / 4)
      .attr("x", -(this.innerHeight / 2 + this.margin.top))
      .attr("dy", ".0em")
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("Mean Absolute Error");
  }

  drawErrorLine() {
    // init line generator
    this.errorLineGen = line()
      .x((d) => this.xScale(d.x))
      .y((d) => this.yScale(d.mae));

    // draw line of len 0
    this.trainLine = this.errorPlot
      .append("path")
      .attr("class", "error-line")
      .attr("id", `error-line`)
      .attr("d", this.errorLineGen(errorData))
      .call((d) => transitionError(d, 0, 0));
  }

  showToolTip() {
    this.verticalToolTip
      .attr("x1", this.xScale(errorData[28].x))
      .attr("y1", this.yScale(0))
      .attr("x2", this.xScale(errorData[28].x))
      .attr("y2", this.yScale(0))
      .transition()
      .attr("y2", this.yScale(1.6));

    this.verticalToolTip.raise();
  }

  updateToolTip(val) {
    this.verticalToolTip
      .attr("x1", this.xScale(val))
      .attr("x2", this.xScale(val));
  }

  drawTransition0Down() {
    const startPoint = 0;
    const endPoint = 1.609;
    const trainLenStart = errorPathLen(this.trainLine, this.xScale(startPoint));
    const trainLenEnd = errorPathLen(this.trainLine, this.xScale(endPoint));
    // // draw line to gien distance
    this.trainLine.call((d) => transitionError(d, trainLenStart, trainLenEnd));
  }
  drawTransition1Down() {
    const startPoint = 1.609;
    const endPoint = 3.1;
    const trainLenStart = errorPathLen(this.trainLine, this.xScale(startPoint));
    const trainLenEnd = errorPathLen(this.trainLine, this.xScale(endPoint));
    // // draw line to gien distance
    this.trainLine.call((d) => transitionError(d, trainLenStart, trainLenEnd));
  }
  drawTransition2Down() {
    const startPoint = 2.75;
    const endPoint = 3.33;
    const trainLenStart = errorPathLen(this.trainLine, this.xScale(startPoint));
    const trainLenEnd = errorPathLen(this.trainLine, this.xScale(endPoint));
    // // draw line to gien distance
    this.trainLine.call((d) => transitionError(d, trainLenStart, trainLenEnd));
  }
  drawTransition3Down() {
    const startPoint = 3.33;
    const endPoint = 5.5;
    const trainLenStart = errorPathLen(this.trainLine, this.xScale(startPoint));
    const trainLenEnd = errorPathLen(this.trainLine, this.xScale(endPoint));
    // // draw line to gien distance
    this.trainLine.call((d) => transitionError(d, trainLenStart, trainLenEnd));
  }
  drawTransition0Up() {
    const startPoint = 3.1;
    const endPoint = 1.609;
    const trainLenStart = errorPathLen(this.trainLine, this.xScale(startPoint));
    const trainLenEnd = errorPathLen(this.trainLine, this.xScale(endPoint));
    // // draw line to gien distance
    this.trainLine.call((d) => transitionError(d, trainLenStart, trainLenEnd));
  }
  drawTransition1Up() {
    const startPoint = 3.33;
    const endPoint = 3.1;
    const trainLenStart = errorPathLen(this.trainLine, this.xScale(startPoint));
    const trainLenEnd = errorPathLen(this.trainLine, this.xScale(endPoint));
    // // draw line to gien distance
    this.trainLine.call((d) => transitionError(d, trainLenStart, trainLenEnd));
  }
  drawTransition2Up() {
    const startPoint = 5.5;
    const endPoint = 3.33;
    const trainLenStart = errorPathLen(this.trainLine, this.xScale(startPoint));
    const trainLenEnd = errorPathLen(this.trainLine, this.xScale(endPoint));
    // // draw line to gien distance
    this.trainLine.call((d) => transitionError(d, trainLenStart, trainLenEnd));
  }
  drawTransition3Up() {}
  drawTransition4Up() {
    this.verticalToolTip
      .transition()
      .attr("y1", this.yScale(0))
      .attr("y2", this.yScale(0));
  }

  addLegend() {
    const that = this;
    const legendData = ["Train Data", "Test Data"];

    const nodeWidth = (d) => d.getBBox().width;

    const legend = this.errorPlot
      .append("g")
      .attr("class", "legend")
      .attr("transform", "translate(0,0)");

    const lg = legend.selectAll("g").data(legendData).enter().append("g");

    const legendCircle = lg
      .append("circle")
      .attr("r", 6)
      .attr("fill", (d, i) => (i % 2 == 0 ? trainColorDot : testColorDot))
      .attr("cy", 5)
      .attr("cx", 1)
      .attr("stroke-width", 0);
    lg.append("text")
      .style("font-size", "16px")
      .attr("x", 11.5)
      .attr("y", 10)
      .text((d) => d);

    let offset = 0;

    lg.attr("transform", function (d) {
      let x = offset;
      offset += nodeWidth(this) + 10;
      return `translate(${x}, ${0})`;
    });

    legend.attr("transform", function () {
      return `translate(${(that.innerWidth - nodeWidth(this)) / 2}, 0)`;
    });
  }

  addTitle(title) {
    // remove title if shown
    select(".error-title").remove();

    // add title
    this.errorSvg
      .append("g")
      .append("text")
      .attr("class", "error-title")
      .attr("x", this.innerWidth / 2)
      .attr("y", 20)
      .text(title)
      .attr("text-anchor", "middle");
  }
}
