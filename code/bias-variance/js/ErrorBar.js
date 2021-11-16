import { select, selectAll, style } from "d3-selection";
import { axisBottom, axisLeft } from "d3-axis";
import { scaleBand, scaleLinear, scaleOrdinal } from "d3-scale";
import { line, curveCatmullRom } from "d3-shape";
import { transition } from "d3-transition";
import { testColorBar, trainColorBar } from "./constants";
import { errorData } from "./dataFiles";
import { extent, max } from "d3-array";
import { easeBack } from "d3-ease";

export class ErrorBar {
  constructor(opts) {
    this.element = opts.element;
    this.chartDims = select("#scroll-figure").node().getBoundingClientRect();
    console.log("chartDims", this.chartDims);
    this.MARGIN =
      window.innerWidth <= 700
        ? { TOP: 20, BOTTOM: 30, LEFT: 30, RIGHT: 9 }
        : { TOP: 20, BOTTOM: 40, LEFT: 40, RIGHT: 9 };
    this.WIDTH = this.chartDims.width * 0.8;
    this.HEIGHT = window.innerHeight * 0.36;

    // this.HEIGHT = 250;
    this.svgMain = select("#svg2")
      .append("svg")
      .attr("id", "errorBarSvg")
      .attr("width", this.WIDTH + this.MARGIN.LEFT + this.MARGIN.RIGHT)
      .attr("height", this.HEIGHT + this.MARGIN.TOP + this.MARGIN.BOTTOM);

    this.svg = this.svgMain
      .append("g")
      .attr("id", "errorchart-g")
      .attr("transform", `translate(${this.MARGIN.LEFT}, ${this.MARGIN.TOP})`);

    // add arrow for x-axis
    this.svgMain
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead-right")
      .attr("refX", 5)
      .attr("refY", 4.7)
      .attr("markerWidth", 16)
      .attr("markerHeight", 13)
      .append("path")
      .attr("d", "M 0 0 L 5 5 L 0 10")
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("fill", "none");
    // add arrow for y-axis
    this.svgMain
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead-up")
      .attr("refX", 5)
      .attr("refY", 4.7)
      .attr("markerWidth", 16)
      .attr("markerHeight", 23)
      .append("path")
      .attr("d", "M 10 10 L 5 5 L 0 10")
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("fill", "none");

    this.colorScale = scaleOrdinal()
      .domain(["Train", "Test"])
      .range([trainColorBar, testColorBar]);

    this.xScale = scaleLinear().domain([0, 0.42]).range([0, this.WIDTH]);
    this.xAxisGroup = this.svg
      .append("g")
      .attr("class", "axis")
      .attr("id", "error-x-axis")
      .attr("transform", `translate(0, ${this.HEIGHT})`);

    this.yScale = scaleBand().range([0, this.HEIGHT]).padding(0.1);

    this.yAxisGroup = this.svg
      .append("g")
      .attr("class", "axis")
      .attr("id", "error-y-axis");
  }

  drawErrorBase() {
    // set new axes and scales
    this.xScaleError = scaleLinear()
      .domain(extent(errorData, (d) => +d.x))
      .range([0, this.WIDTH]);

    this.xAxisGroup
      .transition()
      .style("opacity", 1)
      .call(axisBottom(this.xScaleError).tickSizeOuter(0).ticks(4))
      .selectAll("line.tick")
      .style("opacity", 0.2);

    this.yScaleError = scaleLinear()
      .domain([-0.05, 0.8])
      .range([this.HEIGHT, 0]);

    this.yAxisGroup
      .transition()
      .style("opacity", 1)
      .call(axisLeft(this.yScaleError).tickSizeOuter(0).ticks(4));
  }

  plotErrorLines(xVal, yVal) {
    // resolve yVal
    const noise = `noise_${yVal}`;
    const error = `error_${yVal}`;
    const bias = `bias_${yVal}`;
    const variance = `var_${yVal}`;
    const errorT = transition().delay(200).duration(1500);

    // update y-axis depending on y-value
    if (yVal === "final" || yVal == "point") {
      this.yScaleError.domain([-0.05, 1.3]);
      this.yAxisGroup
        .transition()
        .style("opacity", 1)
        .call(axisLeft(this.yScaleError).tickSizeOuter(0).ticks(0));
    } else {
      this.yScaleError.domain([-0.05, 0.8]);
      this.yAxisGroup
        .transition()
        .style("opacity", 1)
        .call(axisLeft(this.yScaleError).tickSizeOuter(0).ticks(4));
    }

    // define line generators
    const noiseLine = line()
      .x((d) => this.xScaleError(+d[xVal]))
      .y((d) => this.yScaleError(+d[noise]))
      .curve(curveCatmullRom.alpha(0.8));

    const errorLine = line()
      .x((d) => this.xScaleError(+d[xVal]))
      .y((d) => this.yScaleError(+d[error]))
      .curve(curveCatmullRom.alpha(0.8));

    const biasLine = line()
      .x((d) => this.xScaleError(+d[xVal]))
      .y((d) => this.yScaleError(+d[bias]))
      .curve(curveCatmullRom.alpha(0.8));

    const varLine = line()
      .x((d) => this.xScaleError(+d[xVal]))
      .y((d) => this.yScaleError(+d[variance]))
      .curve(curveCatmullRom.alpha(0.8));

    // draw noise data
    this.noiseLine = this.svg
      .selectAll("#noise-line")
      .data([errorData], (d) => +d[xVal]);

    this.noiseLine
      .enter()
      .append("path")
      .attr("id", "noise-line")
      .merge(this.noiseLine)
      .attr("class", "error-line-bottom")
      .transition(errorT)
      .attr("d", noiseLine);

    // draw error data
    this.errorLine = this.svg
      .selectAll("#error-line")
      .data([errorData], (d) => +d[xVal]);

    this.errorLine
      .enter()
      .append("path")
      .attr("id", "error-line")
      .merge(this.errorLine)
      .attr("class", "error-line-bottom")
      .transition(errorT)
      .attr("d", errorLine);

    // draw bias data
    this.biasLine = this.svg
      .selectAll("#bias-line")
      .data([errorData], (d) => +d[xVal]);

    this.biasLine
      .enter()
      .append("path")
      .attr("id", "bias-line")
      .merge(this.biasLine)
      .attr("class", "error-line-bottom")
      .transition(errorT)
      .attr("d", biasLine);

    // draw var data
    this.varLine = this.svg
      .selectAll("#var-line")
      .data([errorData], (d) => +d[xVal]);

    this.varLine
      .enter()
      .append("path")
      .attr("id", "var-line")
      .merge(this.varLine)
      .attr("class", "error-line-bottom")
      .transition(errorT)
      .attr("d", varLine);
  }

  plotComplexCircleOne() {
    // add a circle to each complex point
    // first, gcreate array for desired circles
    const circleData = ["bias", "var", "noise", "error"].map((d) => {
      return {
        x: errorData[0].x_point,
        y: errorData[0][`${d}_point`],
        name: d,
      };
    });

    // next, plot circle for each point
    this.svg
      .selectAll("circle.complexity")
      .data(circleData)
      .enter()
      .append("circle")
      .attr("class", "complexity")
      .attr("class", (d) => `complex-${d.name}`)
      .style("stroke-width", 2)
      .attr("stroke", "white")
      .attr("cx", (d) => this.xScaleError(+d.x))
      .attr("cy", (d) => this.yScaleError(+d.y))
      .attr("r", 0)
      .transition()
      .delay(1300)
      .attr("r", window.innerWidth <= 600 ? 9.5 : 12)
      .transition()
      .attr("r", window.innerWidth <= 600 ? 5 : 8);
  }

  plotComplexCircleAll() {
    // add a circle to each complex point
    // first, gcreate array for desired circles
    // const circlesData = errorData.filter((d) => d.x !== 0.503);
    // console.log("circleData", circlesData);

    const noise = `noise_final`;
    const error = `error_final`;
    const bias = `bias_final`;
    const variance = `var_final`;

    // noise
    this.svg
      .selectAll("circle.complexity")
      .data(errorData)
      .enter()
      .append("circle")
      .attr("class", "complexity")
      .attr("class", (d) => `complex-noise`)
      .style("stroke-width", 2)
      .attr("stroke", "white")
      .attr("cx", (d) => this.xScaleError(+d.x))
      .attr("cy", (d) => this.yScaleError(+d[noise]))
      .attr("r", 0)
      .transition()
      .attr("r", window.innerWidth <= 600 ? 9.5 : 12)
      .transition()
      .attr("r", window.innerWidth <= 600 ? 5 : 8);

    // error
    this.svg
      .selectAll("circle.complexity")
      .data(errorData)
      .enter()
      .append("circle")
      .attr("class", "complexity")
      .attr("class", (d) => `complex-error`)
      .style("stroke-width", 2)
      .attr("stroke", "white")
      .attr("cx", (d) => this.xScaleError(+d.x))
      .attr("cy", (d) => this.yScaleError(+d[error]))
      .attr("r", 0)
      .transition()
      .attr("r", window.innerWidth <= 600 ? 9.5 : 12)
      .transition()
      .attr("r", window.innerWidth <= 600 ? 5 : 8);

    // bias
    this.svg
      .selectAll("circle.complexity")
      .data(errorData)
      .enter()
      .append("circle")
      .attr("class", "complexity")
      .attr("class", (d) => `complex-bias`)
      .style("stroke-width", 2)
      .attr("stroke", "white")
      .attr("cx", (d) => this.xScaleError(+d.x))
      .attr("cy", (d) => this.yScaleError(+d[bias]))
      .attr("r", 0)
      .transition()
      .attr("r", window.innerWidth <= 600 ? 9.5 : 12)
      .transition()
      .attr("r", window.innerWidth <= 600 ? 5 : 8);

    // var
    this.svg
      .selectAll("circle.complexity")
      .data(errorData)
      .enter()
      .append("circle")
      .attr("class", "complexity")
      .attr("class", (d) => `complex-var`)
      .style("stroke-width", 2)
      .attr("stroke", "white")
      .attr("cx", (d) => this.xScaleError(+d.x))
      .attr("cy", (d) => this.yScaleError(+d[variance]))
      .attr("r", 0)
      .transition()
      .attr("r", window.innerWidth <= 600 ? 9.5 : 12)
      .transition()
      .attr("r", window.innerWidth <= 600 ? 5 : 8);

    // next, plot circle for each point
  }

  plotReverseDecompositionBar() {
    let t = transition().duration(600);
    // rescale axis back to what it was
    this.xScale.domain([0, 0.42]);
    this.xAxisGroup
      .transition(t)
      .call(axisBottom(this.xScale).tickSizeOuter(0))
      .style("opacity", 1);
    // update y-axis in 5 up so it shows earlier
    this.yAxisGroup.transition(t).style("opacity", 1);
  }

  plotDecompositionBar(data) {
    const that = this;
    let t = transition().delay(100).duration(600);
    // draw same data 3 times, with slightly different errors
    // scale y-axis to full
    const maxError = max(data, (d) => +d.error);

    // set new band xscale for decomposition values

    this.xScale.domain([0, maxError]);
    // this.xScale.domain([0, maxError + maxError * 0.1]);
    this.xAxisGroup
      .transition(t)
      .call(axisBottom(this.xScale).tickSizeOuter(0).ticks(4));
    // update y-axis
    this.yScale.domain(["Test"]);
    this.yAxisGroup.transition(t).call(axisLeft(this.yScale).tickSizeOuter(0));

    // join
    this.rects = this.svg.selectAll(`rect.errorBar`).data(data, (d) => d.error);

    // exit
    this.rects
      .exit()
      .transition(t)
      .attr("height", 0)
      .attr("y", this.HEIGHT)
      .remove();

    // update
    this.rects
      .transition(t)
      .attr("x", (d) => this.xScale(0))
      .attr("y", (d) => this.yScale(d.name))
      .attr("width", (d) => this.xScale(maxError))
      .attr("height", this.yScale.bandwidth())
      .attr("id", "decomposition")
      .style("opacity", 1);
    // hide x-axis group (hide incase scroll up)
    this.hideAxes();

    // DECOMPOSITION
    this.decomp = [
      { name: "Test", error: "Bias2", value: 0.33 * maxError },
      { name: "Test", error: "Variance", value: 0.33 * maxError },
      { name: "Test", error: "Noise", value: 0.33 * maxError },
    ];

    this.biasMap = (d) => {
      return d === "Bias2" ? "Bias²" : d;
    };

    // axis for decomp positions
    this.decompAxis = scaleBand()
      .range([0, this.xScale(maxError)])
      .padding(0)
      .domain(["Bias2", "Variance", "Noise"]);

    // save value for error offset
    this.biasX =
      that.WIDTH / 10 -
      this.decompAxis("Bias2") +
      this.xScale(0.33 * maxError) / 2;

    const stackColor = scaleOrdinal()
      .domain(this.decomp, (d) => d.error)
      .range(["coral", "skyblue", "teal"]);

    this.decompLegend = this.svg
      .append("g")
      .attr("class", "decomp-legend")
      .attr("transform", "translate(0,0)");

    // create g elements to hold decomp rects and labels
    this.decompGs = this.decompLegend
      .selectAll("g.decompG")
      .data(this.decomp)
      .enter()
      .append("g")
      .attr("class", "decompG");

    // append rectangles to decomp G
    const stackedRects = this.decompGs
      .append("rect")
      .attr("class", "stacked")
      .attr("fill", (d) => stackColor(d.error))
      .attr("id", (d) => `rect-${d.error}`)
      .attr("x", (d) => this.decompAxis(d.error))
      .attr("y", (d) => this.yScale(d.name))
      .attr("height", this.yScale.bandwidth())
      .attr("width", (d) => this.xScale(+d.value))
      .style("opacity", 0);

    this.decompGs
      .append("text")
      .attr("class", "decomp-text")
      .attr("x", (d) => this.decompAxis(d.error))
      .attr("y", (d) => this.yScale.bandwidth() / 2 + this.MARGIN.TOP)
      .attr("dx", (d) => this.xScale(+d.value) / 2)
      .text((d) => this.biasMap(d.error))
      .style("opacity", 0);

    // init rectangle borders around text (for labels later)
    this.textBox = {};
    selectAll(".decomp-text").each(function (d) {
      const textBox = this.getBBox();
      that.textBox[d.error] = textBox;
    });

    // reset text-anchor to middle
    // we have to reset it because otherwise the later transition to legend won't work
    selectAll(".decomp-text").attr("text-anchor", "middle");

    // line up transitions
    const decompT = transition().delay(600).ease(easeBack).duration(500);

    // transition everything into view
    selectAll("rect.stacked").transition(decompT).style("opacity", 0.7);
    selectAll(".decomp-text").transition(decompT).style("opacity", 1);
    this.rects.transition(decompT).style("opacity", 0);
  }

  // scroll up function for decomposition
  reverseDecomposition() {
    let t = transition().delay(100).duration(600);

    // reposition squares
    this.decompGs
      .selectAll("rect")
      .transition(t)
      .attr("x", (d) => this.decompAxis(d.error))
      .attr("y", (d) => this.yScale(d.name))
      .attr("height", this.yScale.bandwidth())
      .attr("width", (d) => this.xScale(+d.value));

    // reposition text
    this.decompGs
      .selectAll("text")
      .attr("x", (d) => this.decompAxis(d.error))
      .attr("y", (d) => this.yScale.bandwidth() / 2 + this.MARGIN.TOP)
      .attr("dx", (d) => this.xScale(+d.value) / 2);

    // translate group back to decomp bar position
    this.decompGs
      .transition()
      .duration(1000)
      .attr("transform", "translate(0,0)")
      .selectAll(".decomp-text")
      .attr("text-anchor", "middle");

    // remove axes
    this.hideAxes();

    // set up y-axis for bar
    this.yScale.domain(["Train", "Test"]);
    this.yAxisGroup
      .call(axisLeft(this.yScale).tickSizeOuter(0))
      .style("opacity", 1);
  }

  hideAxes() {
    this.xAxisGroup.transition().style("opacity", 0);
    this.yAxisGroup.transition().style("opacity", 0);
  }

  positionErrorBarsAsLabels() {
    const that = this;
    const nodeWidth = (d) => d.getBBox().width;
    // const rectOffset = window.innerWidth <= 600 ? 4 : 8;
    const rectOffsetX = window.innerWidth <= 600 ? 4 : 8;
    const rectOffsetY = window.innerWidth <= 600 ? 4 : 8;
    const symbolSpace =
      window.innerWidth <= 600 ? rectOffsetX * 1.5 : rectOffsetX * 2;
    const errorTransTime = 800;

    // update y-axis
    this.yScale.domain(["Test"]);

    // hide label rects behind main rect
    selectAll("rect.stacked").style("opacity", 0.7);
    selectAll(".decomp-text").style("opacity", 1);

    // position label rects
    selectAll("rect.stacked")
      .transition()
      .attr("x", (d) => this.textBox[d.error].x - rectOffsetX)
      .attr("y", (d) => this.textBox[d.error].y - rectOffsetY)
      .attr("width", (d) =>
        window.innerWidth <= 600
          ? this.textBox[d.error].width + 1.5 * rectOffsetX
          : this.textBox[d.error].width + 2 * rectOffsetX
      )
      .attr("height", (d) => this.textBox[d.error].height + 2 * rectOffsetY);

    let offset = 0;
    this.decompGs
      .transition()
      .duration(errorTransTime)
      .attr("transform", function (d) {
        // resolve x position for transition
        let x = offset;
        offset += that.textBox[d.error].width + 2.5 * rectOffsetX + symbolSpace;
        let currentxPos = that.decompAxis(d.error) - rectOffsetX * 2;
        let xPos = that.WIDTH / 10 - currentxPos;
        xPos += x;
        xPos = window.innerWidth <= 600 ? xPos - that.MARGIN.LEFT / 2.5 : xPos;
        // resolve y position for transition
        let currentYPos = that.yScale.bandwidth() / 2 + that.MARGIN.TOP;
        // that.yScale.bandwidth() / 2 + this.MARGIN.TOP
        const yPos = -currentYPos;
        // transition
        return `translate(${xPos}, ${yPos})`;
      })
      .selectAll(".decomp-text")
      .attr("text-anchor", "right");

    this.decompLegend.attr("transform", function () {
      return `translate(${(that.WIDTH - nodeWidth(this)) / 2}, 0)`;
    });

    // init error legend text to get position/bbox
    let errorText = this.decompLegend
      .append("text")
      .attr("id", "error-text")
      .attr("x", this.biasX)
      .attr("y", this.MARGIN.TOP)
      .text("Error")
      .style("font-family", "AmazonEmberDisplayHeavy")
      .style("opacity", 0);

    // get bbox balues of text
    let errorCoords = {};
    select("#error-text").each(function (d, i) {
      const textBox = this.getBBox();
      const width = textBox.width + 2 * rectOffsetX;
      const height = textBox.height + 2 * rectOffsetY;
      errorCoords["x"] = that.biasX - width;
      errorCoords["width"] = width;
      errorCoords["height"] = height;
      errorCoords["y"] = textBox.y;
    });
    // translate text to correct position given other elements and bbox
    errorText
      .transition()
      .attr(
        "x",
        window.innerWidth <= 600
          ? errorCoords.x - rectOffsetX - that.MARGIN.LEFT / 2.5
          : errorCoords.x - rectOffsetX
      )
      .attr("y", 0);
    // add background rectangle
    const errorTextRect = this.decompLegend
      .append("rect")
      .attr("class", "stacked-error")
      .attr("fill", "red")
      .attr(
        "x",
        window.innerWidth <= 600
          ? errorCoords.x - 2 * rectOffsetX - that.MARGIN.LEFT / 2.5
          : errorCoords.x - 2 * rectOffsetX
      )
      .attr("y", errorCoords.y - rectOffsetY - that.MARGIN.TOP)
      .attr("width", errorCoords.width)
      .attr("height", errorCoords.height)
      .lower()
      .style("opacity", 0);

    // ADD MATH SYMBOLS TO LEGEND
    // add '=' sign after error
    let errorTextEquals = this.decompLegend
      .append("text")
      .attr("class", "error-symbol")
      .attr(
        "x",
        window.innerWidth <= 600
          ? errorCoords.x +
              errorCoords.width -
              rectOffsetX -
              that.MARGIN.LEFT / 2.5
          : errorCoords.x + errorCoords.width - rectOffsetX
      )
      .attr("y", 0)
      .text("=")
      .style("font-family", "AmazonEmberDisplayHeavy")
      .style("opacity", 0);

    // add '+' signs
    let errorTextPlus = this.decompGs
      .filter((d, i) => i !== 0)
      .append("text")
      .attr("class", "error-symbol")
      .attr("x", (d) => this.textBox[d.error].x - rectOffsetX - symbolSpace)
      .attr("dx", window.innerWidth <= 600 ? -2 : 0)
      .attr("y", that.yScale.bandwidth() / 2 + this.MARGIN.TOP)
      .text("+")
      .style("font-family", "AmazonEmberDisplayHeavy")
      .style("opacity", 0);

    // transition elements to visibility
    const errorTextT = transition().delay(errorTransTime);

    errorText.transition(errorTextT).style("opacity", 1);
    selectAll(".error-symbol").transition(errorTextT).style("opacity", 0.9);
    errorTextRect.transition(errorTextT).style("opacity", 0.7);
  }

  addTitle(titleText) {
    // remove existing title
    select("#errorBarTitle").remove();

    // add new title
    this.svg
      .append("text")
      .attr("id", "errorBarTitle")
      .attr("x", this.WIDTH / 2)
      .attr("y", 0)
      .attr("text-anchor", "middle")
      .text(titleText)
      .style("font-weight", "bold");
  }

  plotBars(data) {
    // set consistent transition
    let t = transition().delay(500).duration(600);

    // resolve names for y-axis
    const names = extent(data, (d) => d.name).reverse();
    this.yScale.domain(names);

    // update y-axis
    this.yAxisGroup.transition(t).call(axisLeft(this.yScale).tickSizeOuter(0));

    // update x-axis
    this.xAxisGroup
      .transition(t)
      .call(axisBottom(this.xScale).ticks(4).tickSizeOuter(0))
      .selectAll("line.tick")
      .style("opacity", 0.1);

    // join rects
    this.rects = this.svg.selectAll(`rect.errorBar`).data(data, (d) => d.name);

    // exit rects
    this.rects
      .exit()
      .transition(t)
      .attr("width", 0)
      .attr("height", 0)
      .attr("y", this.HEIGHT)
      .remove();

    // update rects
    this.rects
      .transition(t)
      .attr("x", (d) => this.xScale(0))
      .attr("y", (d) => this.yScale(d.name))
      .attr("width", (d) => this.xScale(+d.error))
      .attr("height", this.yScale.bandwidth());

    // enter rects
    this.rects
      .enter()
      .append("rect")
      .attr("class", "errorBar")
      .attr("x", (d) => this.xScale(0))
      .attr("y", (d) => this.yScale(d.name))
      .attr("height", this.yScale.bandwidth())
      .attr("fill", (d) => this.colorScale(d.name))
      .transition(t)
      .attr("width", (d) => this.xScale(+d.error));
  }

  repositionSvgNew() {
    // set up transition
    let trans = transition().duration(1500);

    // determine new height
    let newHeight =
      window.innerHeight * 0.45 + this.MARGIN.BOTTOM + this.MARGIN.TOP;

    // resize & hide top chart
    select("#scatter-svg")
      .transition(trans)
      .attr("height", 75)
      .style("opacity", 0);

    // ensure x-axis lines up with chart re-scaling
    this.xAxisGroup
      .transition(trans)
      .attr(
        "transform",
        `translate(0, ${newHeight - this.MARGIN.TOP - this.MARGIN.BOTTOM})`
      );

    // remove numbers from x-scale
    this.svg.select("#error-x-axis").selectAll(".tick").style("opacity", 0);

    // add arrow to x-axis
    this.svg
      .select("#error-x-axis path.domain")
      .attr("marker-end", "url(#arrowhead-right)");

    // add 'Model Complexity' label to x-axis
    this.svg
      .append("text")
      .attr("id", "error-x-text")
      .attr("x", this.WIDTH / 2)
      .attr("y", newHeight - this.MARGIN.TOP - this.MARGIN.BOTTOM / 2)
      .text("Model Complexity")
      .style("text-anchor", "middle")
      .style("font-family", "AmazonEmberDisplayLight");

    // update y-axis
    this.yScaleError
      .domain([0, 1])
      .range([newHeight - this.MARGIN.TOP - this.MARGIN.BOTTOM, 0]);
    this.yAxisGroup
      .transition(trans)
      .call(axisLeft(this.yScaleError).tickSizeOuter(0).ticks(4));
    // remove number from y-scale
    this.svg.select("#error-y-axis").selectAll(".tick").style("opacity", 0);

    // add arrow to x-axis
    this.svg
      .select("#error-y-axis path.domain")
      .attr("marker-end", "url(#arrowhead-up)");
    // .style("opacity", 0.8);

    // add 'Model Complexity' label to x-axis
    this.svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("id", "error-y-text")
      .attr("y", 0 - 0.3 * this.MARGIN.LEFT)
      .attr("x", 0 - newHeight / 2 + this.MARGIN.TOP)
      .text("Test Error")
      .style("text-anchor", "middle")
      .style("font-family", "AmazonEmberDisplayLight");

    // make svg larger
    this.svgMain.transition(trans).attr("height", newHeight);
  }

  upPositionSvg() {
    // set up transition
    let trans = transition();

    // make top chart its original height
    select("#scatter-svg")
      .transition(trans)
      .attr("height", window.innerHeight * 0.4 + 15 + 40)
      .style("opacity", 1);

    // update y-axis
    this.yScaleError.domain([0, 1]).range([this.HEIGHT, 0]);
    this.yAxisGroup
      .transition(trans)
      .call(axisLeft(this.yScaleError).ticks(4).tickSizeOuter(0));

    // ensure x-axis lines up with chart re-scaling
    this.xAxisGroup
      .transition(trans)
      .attr("transform", `translate(0, ${this.HEIGHT})`);

    // reshow axes numbers
    this.svg.select("#error-x-axis").selectAll(".tick").style("opacity", 1);
    this.svg.select("#error-y-axis").selectAll(".tick").style("opacity", 1);
    // remove axes arrows
    this.svg.select("#error-x-axis path.domain").attr("marker-end", "null");
    this.svg.select("#error-y-axis path.domain").attr("marker-end", "null");
    // remove axes text
    this.svg.select("#error-x-text").remove();
    this.svg.select("#error-y-text").remove();

    // redraw svg
    this.svgMain
      .transition(trans)
      .attr("height", this.HEIGHT + this.MARGIN.TOP + this.MARGIN.BOTTOM);
  }
}
