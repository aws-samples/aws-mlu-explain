import { interpolateString } from "d3-interpolate";
import { bisect } from "d3-array";
import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import { errorData } from "./dataFiles";
import { line } from "d3-shape";
import { format } from "d3-format";
import { transition } from "d3-transition";

function errorPathLen(path, x) {
  path = path.node();
  const pathLength = path.getTotalLength();
  let start = 0;
  let end = pathLength;
  let target = (start + end) / 2;

  while (target >= start && target <= pathLength) {
    let pos = path.getPointAtLength(target);
    if (Math.abs(pos.x - x) < 0.01) {
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
    this.data = errorData.map((d, i) => {
      return { i: i + 1, x: d.x, mae: d.mae };
    });

    this.innerWidth =
      window.innerWidth >= 1000
        ? window.innerWidth / 4
        : window.innerWidth / 1.6;
    this.innerHeight = window.innerHeight * 0.27;
    this.margin = {
      left: 55,
      right: 30,
      top: window.innerWidth > 600 ? 25 : 22,
      bottom: 50,
    };

    this.drawBaseChart();
    this.drawAxes();
    this.drawErrorLine();
    this.showToolTip();
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
      .attr("x", (this.innerWidth + this.margin.left + this.margin.right) / 2)
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
    this.tooltip = this.errorPlot.append("g");
    this.tooltip
      .append("text")
      .attr("id", "text-top")
      .attr("class", "error-tooltip-text")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .text(`K=5`);
    this.tooltip
      .append("text")
      .attr("id", "text-bottom")
      .attr("class", "error-tooltip-text")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .html(`MAE=.232`)
      .attr("dy", "1.1em");

    // init line generator
    this.errorLineGen = line()
      .x((d) => this.xScale(d.x))
      .y((d) => this.yScale(d.mae));

    // draw line of len 0
    this.trainLine = this.errorPlot
      .append("path")
      .attr("class", "error-line")
      .attr("id", `error-line`)
      .attr("d", this.errorLineGen(this.data))
      .call((d) => transitionError(d, 0, 0));
  }

  showToolTip() {
    this.verticalToolTip
      .attr("x1", this.xScale(this.data[4].x))
      .attr("y1", this.yScale(0))
      .attr("x2", this.xScale(this.data[4].x))
      .attr("y2", this.yScale(1.6));

    this.verticalToolTip.raise();
    this.tooltip.raise();
  }

  updateText(val) {
    this.tooltip
      .transition()
      .attr(
        "transform",
        `translate(${this.xScale(this.data[val].x)}, ${this.yScale(
          this.data[val].mae
        )})`
      );
    select("#text-top").text(`K: ${format(".0f")(val + 1)}`);
    select("#text-bottom").text(`MAE: ${format(".3f")(this.data[val].mae)}`);
  }

  updateToolTip(val) {
    this.verticalToolTip
      .transition()
      .attr("x1", this.xScale(errorData[val].x))
      .attr("x2", this.xScale(errorData[val].x));

    this.updateText(val);
  }

  dragToolTip(val) {
    this.verticalToolTip
      .attr("x1", this.xScale(this.data[val].x))
      .attr("x2", this.xScale(this.data[val].x));
    this.tooltip.attr(
      "transform",
      `translate(${this.xScale(this.data[val].x)}, ${this.yScale(
        this.data[val].mae
      )})`
    );
    select("#text-top").text(`K: ${format(".0f")(val + 1)}`);
    select("#text-bottom").text(`MAE: ${format(".3f")(this.data[val].mae)}`);
  }

  drawTransition0Down() {
    const startPoint = 0.01;
    const endPoint = 5.6;
    const trainLenStart = errorPathLen(this.trainLine, this.xScale(startPoint));
    const trainLenEnd = errorPathLen(this.trainLine, this.xScale(endPoint));
    // // draw line to gien distance
    this.trainLine.call((d) => transitionError(d, trainLenStart, trainLenEnd));
    this.updateToolTip(4);
  }
  drawTransition1Down() {
    this.updateToolTip(11);
  }
  drawTransition2Down() {
    this.updateToolTip(32);
  }
  drawTransition3Down() {
    this.updateToolTip(254);
  }
  drawTransition0Up() {
    this.updateToolTip(4);
  }
  drawTransition1Up() {
    this.updateToolTip(10);
  }
  drawTransition2Up() {
    this.updateToolTip(32);
  }
  drawTransition3Up() {
    this.updateToolTip(254);
  }
  drawTransition4Up() {}

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
