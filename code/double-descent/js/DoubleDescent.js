import { ddTrainTest } from "./dataFiles";
import { interpolateString } from "d3-interpolate";
import { select, selectAll } from "d3-selection";
import { scaleLinear } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import { transition } from "d3-transition";
import { curveCatmullRom, line } from "d3-shape";

const durationTime = 1300;

function findPathLen(path, x) {
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

function pathTransition(path, x1, x2) {
  path
    .transition()
    .duration(durationTime)
    .attrTween("stroke-dasharray", function () {
      const l = this.getTotalLength();
      const i = interpolateString(`${x1}, ${l}`, `${x2}, ${l}`);
      return function (t) {
        return i(t);
      };
    })
    .on("end", () => {
      select(this).call((d) => pathTransition(d, x1, x2));
    });
}

export class DoubleDescent {
  constructor(opts) {
    // set selections
    this.ddContainer = opts.ddContainer;

    // set constant SVG parameters
    this.MARGIN = {
      TOP: 50,
      BOTTOM: window.innerWidth < 600 ? 50 : 50,
      LEFT: window.innerWidth < 600 ? 38 : 42,
      RIGHT: window.innerWidth < 600 ? 5 : 25,
    };
    this.WIDTH = window.innerWidth * 0.75;
    this.HEIGHT =
      window.innerWidth < 600
        ? window.innerHeight * 0.35
        : window.innerHeight * 0.53;

    this.plotXMin = 0.8;

    // this.svg = select(this.ddContainer).select("#text-svg").append("g");

    // create svg for chart
    this.initChart(this.ddContainer);

    // draw axes
    this.drawAxes();

    // draw  lines
    this.drawDoubleDescentLines();

    // draw title
    this.addTitle();

    // draw Legend
    this.addLegend();
  }

  initChart(container) {
    // create svg
    this.svg = select(container)
      .append("svg")
      .attr("id", `dd-svg`)
      .attr("width", this.WIDTH + this.MARGIN.LEFT + this.MARGIN.RIGHT)
      .attr("height", this.HEIGHT + this.MARGIN.TOP + this.MARGIN.BOTTOM);

    // this.svg;

    // g container for double descent (dd)
    this.ddG = this.svg
      .append("g")
      .attr("id", `dd-g`)
      .attr("transform", `translate(${this.MARGIN.LEFT}, ${this.MARGIN.TOP})`);

    // add clip-path to limit U-line height
    this.ddG
      .append("clipPath")
      .attr("id", "dd-clip")
      .append("rect")
      .attr("x", 0)
      .attr("y", 10)
      .attr("width", this.WIDTH + this.MARGIN.LEFT + this.MARGIN.RIGHT)
      .attr("height", this.HEIGHT + this.MARGIN.TOP + this.MARGIN.BOTTOM);
  }

  resizeChart() {
    console.log("resizing");
    select("#dd-svg").remove();
    // this.MARGIN = {
    //   TOP: window.innerHeight * 0.05,
    //   BOTTOM: 0,
    //   LEFT: (window.innerWidth / 22) * 5,
    //   RIGHT: (window.innerWidth / 22) * 5,
    // };
    this.MARGIN = {
      TOP: 50,
      BOTTOM: window.innerWidth < 600 ? 50 : 50,
      LEFT: window.innerWidth < 600 ? 38 : 42,
      RIGHT: window.innerWidth < 600 ? 5 : 25,
    };
    // this.MARGIN = {
    //   TOP: window.innerHeight * 0.1,
    //   BOTTOM: window.innerHeight * 0.1,
    //   LEFT: window.innerWidth * 0.1,
    //   RIGHT: window.innerWidth * 0.1,
    // };
    this.WIDTH =
      window.innerWidth < 600
        ? window.innerWidth * 0.85
        : window.innerWidth * 0.8;
    // this.HEIGHT =
    //   window.innerWidth < 600
    //     ? window.innerHeight * 0.35
    //     : window.innerHeight * 0.53;

    this.initChart(this.ddContainer);

    // draw axes
    this.drawAxes();

    // draw  lines
    this.drawDoubleDescentLines();

    // draw title
    this.addTitle();

    // draw Legend
    this.addLegend();
  }

  drawAxes() {
    // define scales
    this.xScale = scaleLinear()
      .domain([this.plotXMin, 30])
      .range([0, this.WIDTH]);
    this.yScale = scaleLinear().domain([0, 23]).range([this.HEIGHT, 0]);

    // // draw x-axis
    this.xAxis = this.ddG
      .append("g")
      .attr("class", "axis")
      .attr("id", "dd-x-axis")
      .attr("transform", `translate(0, ${this.HEIGHT})`)
      .attr("vector-effect", "non-scaling-stroke");

    this.xAxis.call(axisBottom(this.xScale).tickSizeOuter(0).ticks(4));

    // draw y-axis
    this.yAxis = this.ddG
      .append("g")
      .attr("class", "axis")
      .attr("id", "dd-y-axis");

    this.yAxis.call(
      axisLeft(this.yScale)
        .tickSizeOuter(0)
        .ticks(4)
        .tickFormat((d, i) => ["0%", "20%", "40%", "60%", "80%"][i])
    );

    // make tick longer for y-axis
    select("#dd-y-axis").selectAll("line").attr("x2", this.WIDTH);

    // add labels to axes
    this.svg
      .append("text")
      .attr("class", "dd-axis-text")
      .attr("id", "dd-x-axis-text")
      .attr("x", (this.WIDTH + this.MARGIN.LEFT + this.MARGIN.RIGHT) / 2)
      .attr("y", this.HEIGHT + this.MARGIN.TOP + this.MARGIN.BOTTOM / 1.2)
      .text("Measure of Model Complexity")
      .attr("text-anchor", "middle");
    // this.svg
    //   .append("text")
    //   .attr("class", "dd-axis-text")
    //   .attr("id", "dd-y-axis-text")
    //   .attr("y", this.MARGIN.LEFT / 2)
    //   .attr("x", -(this.HEIGHT / 2 + this.MARGIN.TOP))
    //   .attr("dy", ".05em")
    //   .attr("transform", "rotate(-90)")
    //   .attr("text-anchor", "middle")
    //   .text("Prediction Error");

    // add arrow for x-axis
    this.svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead-right")
      .attr("refX", 5)
      .attr("refY", 4.7)
      .attr("markerWidth", 16)
      .attr("markerHeight", 13)
      .append("path")
      .attr("d", "M 0 0 L 5 5 L 0 10")
      .attr("stroke", "#a6a6a6")
      .attr("stroke-width", 2)
      .attr("fill", "none")
      .style("opacity", 0.6);

    // add arrow to x-axis
    this.svg
      .select("#dd-x-axis path.domain")
      .attr("marker-end", "url(#arrowhead-right)");

    // add arrow for y-axis
    this.svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead-up")
      .attr("refX", 5)
      .attr("refY", 10)
      .attr("markerWidth", 16)
      .attr("markerHeight", 23)
      .append("path")
      .attr("d", "M 10 10 L 5 5 L 0 10")
      .attr("stroke", "#a6a6a6")
      .attr("stroke-width", 2)
      .attr("fill", "none")
      .style("opacity", 0.6);

    this.svg
      .select("#dd-y-axis path.domain")
      .attr("marker-end", "url(#arrowhead-up)");

    this.lineSeparator = this.ddG
      .append("line")
      .attr("id", "line-separator")
      .attr("stroke", "white")
      .style("stroke-width", 4)
      .style("pointer-events", "none")
      .style("stroke-dasharray", 5)
      .attr("vector-effect", "non-scaling-stroke")
      .attr("x1", this.xScale(19))
      .attr("y1", this.yScale(0))
      .attr("x2", this.xScale(19))
      .attr("y2", this.yScale(0));

    // // add circles
    // this.ddG
    //   .selectAll("circle.test")
    //   .data(ddTrainTest)
    //   .join("circle")
    //   .attr("r", 5)
    //   .attr("class", "test")
    //   .attr("cx", (d) => this.xScale(d.x))
    //   .attr("cy", (d) => this.yScale(d.y_test))
    //   .attr("fill", "teal");
    // this.ddG
    //   .selectAll("circle.train")
    //   .data(ddTrainTest)
    //   .join("circle")
    //   .attr("r", 9)
    //   .attr("class", "train")
    //   .attr("cx", (d) => this.xScale(d.x))
    //   .attr("cy", (d) => this.yScale(d.y_train))
    //   .attr("fill", "coral")
    //   .attr("opacity", 0.5);

    // // texts
    // this.ddG
    //   .append("text")
    //   .attr("class", "dd-annotation-text")
    //   .attr("id", "text-classic-regime")
    //   .attr("x", this.xScale(10))
    //   .attr("y", this.yScale(0))
    //   .attr("text-anchor", "middle")
    //   .text("Classical Regime");
    this.interpolationText = this.ddG
      .append("text")
      .attr("class", "dd-annotation-text")
      .attr("id", "text-interpolation-threshold");

    this.interpolationText
      .attr("x", this.xScale(19))
      .attr("y", this.yScale(22.9))
      .attr("text-anchor", "middle")
      .text("Interpolation")
      .append("tspan")
      .text("Threshold")
      // .style('font-size', '.1rem')
      .attr("x", this.xScale(19))
      .attr("dy", "1.1em");
    this.interpolationText.attr("opacity", 0);
    // // texts
    // this.ddG
    //   .append("text")
    //   .attr("class", "dd-annotation-text")
    //   .attr("id", "text-interpolation-regime")
    //   .attr("x", this.xScale(25))
    //   .attr("y", this.yScale(0))
    //   .attr("text-anchor", "middle")
    //   .text("Interpolation Regime");

    selectAll(".dd-annotation-text").raise();
  }

  drawTransition0Down() {
    const startPoint = 1;
    const endPoint = 12.5;

    const trainLenStart = findPathLen(this.trainLine, this.xScale(startPoint));
    const testLenStart = findPathLen(this.testLine, this.xScale(startPoint));

    // get desired len of paths
    const trainLenEnd = findPathLen(this.trainLine, this.xScale(endPoint));
    const testLenEnd = findPathLen(this.testLine, this.xScale(endPoint));

    // // draw line to gien distance
    this.trainLine.call((d) => pathTransition(d, trainLenStart, trainLenEnd));
    this.testLine.call((d) => pathTransition(d, testLenStart, testLenEnd));

    const trainLenStartOutline = findPathLen(
      this.trainLineOutline,
      this.xScale(startPoint)
    );
    const testLenStartOutline = findPathLen(
      this.testLineOutline,
      this.xScale(startPoint)
    );
    const trainLenEndOutline = findPathLen(
      this.trainLineOutline,
      this.xScale(endPoint)
    );
    const testLenEndOutline = findPathLen(
      this.testLineOutline,
      this.xScale(endPoint)
    );
    this.trainLineOutline.call((d) =>
      pathTransition(d, trainLenStartOutline, trainLenEndOutline)
    );
    this.testLineOutline.call((d) =>
      pathTransition(d, testLenStartOutline, testLenEndOutline)
    );
  }

  drawTransition0Up() {
    const startPoint = 18.9;
    const endPoint = 1;

    const trainLenStart = findPathLen(this.trainLine, this.xScale(startPoint));
    const testLenStart = findPathLen(this.testLine, this.xScale(startPoint));

    // get desired len of paths
    const trainLenEnd = findPathLen(this.trainLine, this.xScale(endPoint));
    const testLenEnd = findPathLen(this.testLine, this.xScale(endPoint));

    // // draw line to gien distance
    this.trainLine.call((d) => pathTransition(d, trainLenStart, trainLenEnd));
    this.testLine.call((d) => pathTransition(d, testLenStart, testLenEnd));

    const trainLenStartOutline = findPathLen(
      this.trainLineOutline,
      this.xScale(startPoint)
    );
    const testLenStartOutline = findPathLen(
      this.testLineOutline,
      this.xScale(startPoint)
    );
    const trainLenEndOutline = findPathLen(
      this.trainLineOutline,
      this.xScale(endPoint)
    );
    const testLenEndOutline = findPathLen(
      this.testLineOutline,
      this.xScale(endPoint)
    );
    this.trainLineOutline.call((d) =>
      pathTransition(d, trainLenStartOutline, trainLenEndOutline)
    );
    this.testLineOutline.call((d) =>
      pathTransition(d, testLenStartOutline, testLenEndOutline)
    );

    this.interpolationText.attr("opacity", 0);
  }

  drawTransition1Down() {
    const startPoint = 12.5;
    const endPoint = 18.9;

    const trainLenStart = findPathLen(this.trainLine, this.xScale(startPoint));
    const testLenStart = findPathLen(this.testLine, this.xScale(startPoint));

    // get desired len of paths
    const trainLenEnd = findPathLen(this.trainLine, this.xScale(endPoint));
    const testLenEnd = findPathLen(this.testLine, this.xScale(endPoint));

    // // draw line to gien distance
    this.trainLine.call((d) => pathTransition(d, trainLenStart, trainLenEnd));
    this.testLine.call((d) => pathTransition(d, testLenStart, testLenEnd));

    const trainLenStartOutline = findPathLen(
      this.trainLineOutline,
      this.xScale(startPoint)
    );
    const testLenStartOutline = findPathLen(
      this.testLineOutline,
      this.xScale(startPoint)
    );
    const trainLenEndOutline = findPathLen(
      this.trainLineOutline,
      this.xScale(endPoint)
    );
    const testLenEndOutline = findPathLen(
      this.testLineOutline,
      this.xScale(endPoint)
    );
    this.trainLineOutline.call((d) =>
      pathTransition(d, trainLenStartOutline, trainLenEndOutline)
    );
    this.testLineOutline.call((d) =>
      pathTransition(d, testLenStartOutline, testLenEndOutline)
    );
  }

  drawTransition2Down() {
    const startPoint = 18.9;
    const endPoint = 30;

    const trainLenStart = findPathLen(this.trainLine, this.xScale(startPoint));
    const testLenStart = findPathLen(this.testLine, this.xScale(startPoint));

    // get desired len of paths
    const trainLenEnd = findPathLen(this.trainLine, this.xScale(endPoint));
    const testLenEnd = findPathLen(this.testLine, this.xScale(endPoint));

    // // draw line to gien distance
    this.trainLine.call((d) => pathTransition(d, trainLenStart, trainLenEnd));
    this.testLine.call((d) => pathTransition(d, testLenStart, testLenEnd));

    const trainLenStartOutline = findPathLen(
      this.trainLineOutline,
      this.xScale(startPoint)
    );
    const testLenStartOutline = findPathLen(
      this.testLineOutline,
      this.xScale(startPoint)
    );
    const trainLenEndOutline = findPathLen(
      this.trainLineOutline,
      this.xScale(endPoint)
    );
    const testLenEndOutline = findPathLen(
      this.testLineOutline,
      this.xScale(endPoint)
    );
    this.trainLineOutline.call((d) =>
      pathTransition(d, trainLenStartOutline, trainLenEndOutline)
    );
    this.testLineOutline.call((d) =>
      pathTransition(d, testLenStartOutline, testLenEndOutline)
    );
  }

  drawTransition1Up() {
    const startPoint = 30;
    const endPoint = 18.9;

    const trainLenStart = findPathLen(this.trainLine, this.xScale(startPoint));
    const testLenStart = findPathLen(this.testLine, this.xScale(startPoint));

    // get desired len of paths
    const trainLenEnd = findPathLen(this.trainLine, this.xScale(endPoint));
    const testLenEnd = findPathLen(this.testLine, this.xScale(endPoint));

    // // draw line to gien distance
    this.trainLine.call((d) => pathTransition(d, trainLenStart, trainLenEnd));
    this.testLine.call((d) => pathTransition(d, testLenStart, testLenEnd));

    const trainLenStartOutline = findPathLen(
      this.trainLineOutline,
      this.xScale(startPoint)
    );
    const testLenStartOutline = findPathLen(
      this.testLineOutline,
      this.xScale(startPoint)
    );
    const trainLenEndOutline = findPathLen(
      this.trainLineOutline,
      this.xScale(endPoint)
    );
    const testLenEndOutline = findPathLen(
      this.testLineOutline,
      this.xScale(endPoint)
    );
    this.trainLineOutline.call((d) =>
      pathTransition(d, trainLenStartOutline, trainLenEndOutline)
    );
    this.testLineOutline.call((d) =>
      pathTransition(d, testLenStartOutline, testLenEndOutline)
    );

    this.interpolationText.attr("opacity", 0);
  }

  redrawResize() {
    const trans = transition().duration(durationTime);
    const startPoint = 18.9;
    const endPoint = 30;

    const trainLenStart = findPathLen(this.trainLine, this.xScale(startPoint));
    const testLenStart = findPathLen(this.testLine, this.xScale(startPoint));

    // get desired len of paths
    const trainLenEnd = findPathLen(this.trainLine, this.xScale(endPoint));
    const testLenEnd = findPathLen(this.testLine, this.xScale(endPoint));

    // // draw line to gien distance
    this.trainLine.call((d) => pathTransition(d, trainLenStart, trainLenEnd));
    this.testLine.call((d) => pathTransition(d, testLenStart, testLenEnd));

    const trainLenStartOutline = findPathLen(
      this.trainLineOutline,
      this.xScale(startPoint)
    );
    const testLenStartOutline = findPathLen(
      this.testLineOutline,
      this.xScale(startPoint)
    );
    const trainLenEndOutline = findPathLen(
      this.trainLineOutline,
      this.xScale(endPoint)
    );
    const testLenEndOutline = findPathLen(
      this.testLineOutline,
      this.xScale(endPoint)
    );
    this.trainLineOutline.call((d) =>
      pathTransition(d, trainLenStartOutline, trainLenEndOutline)
    );
    this.testLineOutline.call((d) =>
      pathTransition(d, testLenStartOutline, testLenEndOutline)
    );

    // previous stuff
    this.lineSeparator.transition(trans).attr("y2", this.yScale(23));
    // toggle "Interpolation Threshold" text
    this.interpolationText.raise();
    this.interpolationText.transition(trans).attr("opacity", 1);
  }

  drawTransition2Up() {
    // shrink line
    this.lineSeparator
      .transition()
      .duration(durationTime)
      .attr("y2", this.yScale(0));

    // hide area
    const trans = transition().duration(durationTime);
    // this.rectUnder.transition(trans).attr("fill-opacity", 0);

    // toggle "Interpolation Threshold" text
    // this.interpolationText.raise();
    this.rectOver.transition(trans).attr("fill-opacity", 0);
    this.interpolationText.attr("opacity", 0);
  }

  drawTransition3Up() {
    const trans = transition().duration(durationTime);
    this.rectOver.transition(trans).attr("fill-opacity", 0);
    // this.rectUnder.transition(trans).attr("fill-opacity", 0);
    this.interpolationText.attr("opacity", 0);
  }

  drawTransition4Up() {
    const trans = transition().duration(durationTime);
    this.rectOver.transition(trans).attr("fill-opacity", 0);
    // this.rectUnder.transition(trans).attr("fill-opacity", 0.95);
  }

  drawTransition3Down() {
    const trans = transition().duration(durationTime);
    this.lineSeparator.transition(trans).attr("y2", this.yScale(23));

    this.rectOver.transition(trans).attr("fill-opacity", 0.95);

    // toggle "Interpolation Threshold" text
    this.interpolationText.raise();
    this.interpolationText.transition(trans).attr("opacity", 1);
  }

  drawTransition4Down() {
    const trans = transition().duration(durationTime);
    // this.rectUnder.transition(trans).attr("fill-opacity", 0.95);
    this.rectOver.transition(trans).attr("fill-opacity", 0);

    // previous stuff
    this.lineSeparator.transition(trans).attr("y2", this.yScale(23));
    // toggle "Interpolation Threshold" text
    this.interpolationText.raise();
    this.interpolationText.transition(trans).attr("opacity", 1);
  }

  drawTransition5Down() {
    const trans = transition().duration(durationTime);
    // this.rectUnder.transition(trans).attr("fill-opacity", 0);
    this.rectOver.transition(trans).attr("fill-opacity", 0);

    // previous stuff
    this.lineSeparator.transition(trans).attr("y2", this.yScale(23));
    // toggle "Interpolation Threshold" text
    this.interpolationText.raise();
    this.interpolationText.transition(trans).attr("opacity", 1);
  }

  drawDoubleDescentLines() {
    // init line generator
    this.lineGenTrain = line()
      .x((d) => this.xScale(d.x))
      .y((d) => this.yScale(d[`y_train`]))
      .curve(curveCatmullRom.alpha(0.8));

    this.trainLineOutline = this.ddG
      .append("path")
      .attr("class", "dd-line-outline")
      .attr("id", `dd-line-train-outline`)
      .attr("d", this.lineGenTrain(ddTrainTest))
      .call((d) => pathTransition(d, 0, 0));

    this.trainLine = this.ddG
      .append("path")
      .attr("class", "dd-line")
      .attr("id", `dd-line-train`)
      .attr("d", this.lineGenTrain(ddTrainTest))
      .call((d) => pathTransition(d, 0, 0));

    // init line generator
    this.lineGenTest = line()
      .x((d) => this.xScale(d.x))
      .y((d) => this.yScale(d[`y_test`]))
      .curve(curveCatmullRom.alpha(0.8));

    // draw line for given stage
    this.testLineOutline = this.ddG
      .append("path")
      .attr("class", "dd-line-outline")
      .attr("id", `dd-line-test-outline`)
      .attr("d", this.lineGenTest(ddTrainTest))
      .call((d) => pathTransition(d, 0, 0));

    this.testLine = this.ddG
      .append("path")
      .attr("class", "dd-line")
      .attr("id", `dd-line-test`)
      .attr("d", this.lineGenTest(ddTrainTest))
      .call((d) => pathTransition(d, 0, 0));

    // const interpolationGradient = this.svg
    //   .append("defs")
    //   .append("linearGradient")
    //   .attr("id", "interpolationGradient")
    //   .attr("x1", "0%")
    //   .attr("y1", "100%")
    //   .attr("x2", "0%")
    //   .attr("y2", "0%");

    // interpolationGradient
    //   .append("stop")
    //   .attr("offset", "0%")
    //   .attr("stop-color", "#0f151b")
    //   .attr("stop-opacity", 0.76);
    // interpolationGradient
    //   .append("stop")
    //   .attr("offset", "100%")
    //   .attr("stop-color", "#232f3e")
    //   .attr("stop-opacity", 0);

    const bgGradient = this.svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "bgGradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "0%")
      .attr("y2", "40%");

    bgGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "rgba(3, 117, 117, .25)")
      .attr("stop-opacity", 0.76);
    bgGradient
      .append("stop")
      .attr("offset", "90%")
      .attr("stop-color", "#232f3e")
      .attr("stop-opacity", 0);

    // make rect for bg gradient
    this.bgRect = this.ddG
      .append("rect")
      .attr("id", "rect-bg")
      .attr("x", this.xScale(this.plotXMin))
      .attr("y", this.yScale(23))
      .attr("width", this.WIDTH)
      .attr("height", this.yScale(0))
      .style("fill", "url(#bgGradient)");

    // add rects after so overlap
    this.rectOver = this.ddG
      .append("rect")
      .attr("id", "rect-interpolate")
      .attr("x", this.xScale(19))
      .attr("y", this.yScale(23))
      .attr("width", this.WIDTH - this.xScale(19))
      .attr("height", this.yScale(0) + 10)
      .attr("fill", "#232f3e")
      .attr("fill-opacity", 0);

    this.rectUnder = this.ddG
      .append("rect")
      .attr("id", "rect-interpolate")
      .attr("x", this.xScale(this.plotXMin))
      .attr("y", this.yScale(23))
      .attr("width", this.xScale(19))
      .attr("height", this.yScale(0) + 10)
      .attr("fill", "#232f3e")
      .attr("fill-opacity", 0);

    // this.rectOver.lower();
    // this.rectUnder.lower();
    this.bgRect.lower();
  }

  addTitle() {
    // add title to plot
    this.svg
      .append("text")
      .attr("id", "dd-title")
      .attr("x", 0)
      .attr("y", this.MARGIN.TOP / 1.9)
      .attr("text-anchor", "left")
      .text("The Double Descent Phenomenon")
      .text("Prediction Error")
      .style("font-weight", "bold");
  }

  // addAnnotations() {
  //   // add text annotations to chart
  //   // train label & circle
  //   this.ddG
  //     .attr("class", "dd-text")
  //     .append("text")
  //     .attr("x", this.xScale(19.25))
  //     .attr("y", this.yScale(1))
  //     .text("Train");
  //   this.ddG
  //     .append("circle")
  //     .attr("class", "dd-circle")
  //     .attr("id", "dd-circle-train")
  //     .attr("cx", this.xScale(19))
  //     .attr("cy", this.yScale(1.2))
  //     .attr("r", 5);

  //   // test label
  //   this.ddG
  //     .attr("class", "dd-text")
  //     .append("text")
  //     .attr("x", this.xScale(19.25))
  //     .attr("y", this.yScale(5))
  //     .text("Test");
  //   this.ddG
  //     .append("circle")
  //     .attr("class", "dd-circle")
  //     .attr("id", "dd-circle-test")
  //     .attr("cx", this.xScale(19))
  //     .attr("cy", this.yScale(5.2))
  //     .attr("r", 5);

  //   // U label
  //   this.ddG
  //     .attr("class", "dd-text")
  //     .append("text")
  //     .attr("x", this.xScale(9.8))
  //     .attr("y", this.yScale(30.25))
  //     .text("Expected Test Error");
  //   this.ddG
  //     .append("circle")
  //     .attr("class", "dd-circle")
  //     .attr("cx", this.xScale(9.55))
  //     .attr("cy", this.yScale(30.5))
  //     .attr("r", 4.5);
  // }

  addLegend() {
    const that = this;
    const legendData = ["Train", "Test"];

    const nodeWidth = (d) => d.getBBox().width;

    const legend = this.svg
      .append("g")
      .attr("class", "dd-legend")
      .attr("transform", "translate(0,40)");

    const lg = legend.selectAll("g").data(legendData).enter().append("g");

    const legendCircle = lg
      .append("rect")
      .attr("width", 10.5)
      .attr("height", 7.5)
      .attr("id", (d, i) => (i % 2 == 0 ? "dd-circle-train" : "dd-circle-test"))
      .attr("x", -1)
      .attr("y", 1)
      .attr("stroke-width", 0);

    lg.append("text")
      .attr("class", "dd-legend-text")
      .attr("x", 11.5)
      .attr("y", 10)
      .text((d) => d);

    let offset = 5;

    lg.attr("transform", function (d) {
      let x = offset;
      offset += nodeWidth(this) + 15;
      return `translate(${x}, ${0})`;
    });
  }
}
