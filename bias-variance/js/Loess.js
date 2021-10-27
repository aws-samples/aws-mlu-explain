import { select, selectAll } from "d3-selection";
import { axisBottom, axisLeft } from "d3-axis";
import { scaleBand, scaleLinear, scaleOrdinal } from "d3-scale";
import { line } from "d3-shape";
import { transition } from "d3-transition";
import { easeBounceInOut, easeExpInOut } from "d3-ease";
import { regressionLoess } from "d3-regression";
import { meanSquaredError } from "./meanSquaredError";
import { randomNormal } from "d3-random";

export class Loess {
  constructor(opts) {
    const that = this;
    // selections
    this.loessContainer = opts.loessContainer;
    this.barContainer = opts.barContainer;
    this.sliderContainer = opts.sliderContainer;

    // init bandwidth hyperparameter
    this.bandwidth = 0.42;

    // set circle size
    this.circleSize = 4.5;

    // set constant SVG parameters
    this.MARGIN = { TOP: 30, BOTTOM: 20, LEFT: 35, RIGHT: 10 };
    const containerSize = select(`#${this.loessContainer}`)
      .node()
      .getBoundingClientRect();
    this.WIDTH = containerSize.width * 0.8;
    this.HEIGHT =
      window.innerWidth <= 600
        ? containerSize.height * 0.6
        : containerSize.height * 0.7;

    // add slider to DOM
    this.addSlider();

    // draw charts
    this.drawLoess();
    this.drawBars();

    this.generateData();

    // draw initial line
    this.drawLoessLine(this.bandwidth);
  }

  genData(train) {
    // generate dataset
    const n_samples = 30;

    // helper func for rounding (keep in scope)
    const roundToTwo = (num) => +(Math.round(num + "e+2") + "e-2");

    // equation to model
    const f = (x) => Math.sin(2.5 * Math.PI * x) / 1.5;

    // want array of objects
    let x = Array.from({ length: n_samples }, (x, i) => roundToTwo(i * 0.029));
    x = x.map((val) => val + Math.abs(randomNormal(0, 0.05)())).sort();
    // ensure x-values cover full span of plot
    if (train === true) {
      x[0] = 0.01;
      x[x.length - 1] = 0.99;
    }
    // define y vals
    const y = x.map((val) => f(val) + randomNormal(0, 0.25)());

    // create dataset of x, y pairs
    const data = x.map((val, i) => {
      return { x: val, y: y[i] };
    });

    return data;
  }

  generateData() {
    this.loessG.selectAll("circle.loess-train").remove();

    this.loessDataTrain = this.genData(true);

    // draw train circles
    this.loessG
      .selectAll("circle.loess-train")
      .data(this.loessDataTrain)
      .enter()
      .append("circle")
      .attr("class", "loess-train")
      .attr("r", this.circleSize)
      .attr("cx", (d) => this.xScale(+d.x))
      .attr("cy", (d) => this.yScale(+d.y));

    this.drawLoessLine(this.bandwidth);
  }

  drawLoess() {
    // set up svg
    this.loessG = this.initChartSvg(this.loessContainer);

    this.xScale = scaleLinear().domain([0, 1]).range([0, this.WIDTH]);

    // define y-scale
    this.yScale = scaleLinear().domain([-1.4, 1.4]).range([this.HEIGHT, 0]);

    // define axes
    const xAxisGeneratorLoess = axisBottom(this.xScale)
      .ticks(4)
      .tickSizeOuter(0);
    const yAxisGeneratorLoess = axisLeft(this.yScale)
      .tickSizeOuter(0)
      .tickValues([0]);

    // instantiate line generator
    this.lineGenerator = line()
      .x((d) => this.xScale(d[0]))
      .y((d) => this.yScale(d[1]));

    // add x-axis
    this.xAxis = this.loessG
      .append("g")
      .attr("class", "axis")
      .attr("id", "loess-x-axis")
      .call(xAxisGeneratorLoess)
      .attr("transform", `translate(0, ${this.HEIGHT})`);

    // add y-axis
    this.yAxis = this.loessG
      .append("g")
      .attr("class", "axis")
      .attr("id", "loess-y-axis")
      .call(yAxisGeneratorLoess);

    // make tick longer for y-axis
    select("#loess-y-axis").select("line").attr("x2", this.WIDTH);
    select("#loess-y-axis").select("line").lower();
    this.loessDataTest = this.genData(false);

    this.loessG
      .selectAll("circle.loess-test")
      .data(this.loessDataTest)
      .enter()
      .append("circle")
      .attr("class", "loess-test")
      .attr("r", this.circleSize)
      .attr("cx", (d) => this.xScale(+d.x))
      .attr("cy", (d) => this.yScale(+d.y));

    // add legend
    this.addLegend();
  }

  drawLoessLine(bandwidth) {
    // remove text warning if exits
    select("#bar-warning").remove();

    // remove lines
    selectAll("#loess-line").remove();
    selectAll("circle.loess-t").remove();

    // set-up loess
    this.regressionGenerator = regressionLoess()
      .x((d) => d.x)
      .y((d) => d.y)
      .bandwidth(bandwidth);

    // get data from loess model
    const modelData = this.regressionGenerator(this.loessDataTrain);

    // draw loess line
    this.loesPath = this.loessG
      .append("path")
      .attr("id", "loess-line")
      .datum(modelData)
      .attr("d", this.lineGenerator);

    // ensure line under circles
    select("path#loess-line").lower();

    // calculate MSE
    const yTrain = this.loessDataTrain.map((d) => d.y);
    const yTest = this.loessDataTest.map((d) => d.y);
    const yPred = modelData.map((d) => d[1]);
    const trainMse = meanSquaredError(yTrain, yPred);
    const testMse = meanSquaredError(yTest, yPred);
    const mseData = [
      { name: "Train", error: trainMse },
      { name: "Test", error: testMse },
    ];
    this.plotBars(mseData);
    // add warning if unfit data
    if (trainMse > 0.4) {
      this.addBarWarning();
    }
  }

  addBarWarning() {
    let ttext = this.barG
      .append("text")
      .attr("id", "bar-warning")
      .style("font-size", ".9rem")
      .attr("x", 11.5)
      .attr("y", 0);
    ttext
      .append("tspan")
      .text("Uh-oh! Sometimes our model doesn't fit the data.");
    ttext.append("tspan").text("Try again!").attr("x", 11.5).attr("dy", 15);
  }

  drawBars() {
    // set up svg
    this.barG = this.initChartSvg(this.barContainer);

    // define scales
    // x scale
    this.xScaleError = scaleLinear().domain([0, 0.25]).range([0, this.WIDTH]);
    // y scale
    this.yScaleError = scaleBand()
      .domain(["Train", "Test"])
      .range([0, this.HEIGHT])
      .padding(0.1);
    this.loessBarColor = scaleOrdinal()
      .domain(["Test", "Train"])
      .range(["#e57873", "#94CAE0"]);

    // define axes
    this.xAxisGeneratorError = axisBottom(this.xScaleError)
      .tickSizeOuter(0)
      .ticks(4);

    this.yAxisGeneratorError = axisLeft(this.yScaleError)
      .tickSizeOuter(0)
      .ticks(4);
    // add x-axis
    this.xAxisError = this.barG
      .append("g")
      .attr("class", "axis")
      .attr("id", "bar-x-axis")
      .call(this.xAxisGeneratorError)
      .attr("transform", `translate(0, ${this.HEIGHT})`);

    // add y-axis
    this.yAxis = this.barG
      .append("g")
      .attr("class", "axis")
      .attr("id", "bar-y-axis")
      .call(this.yAxisGeneratorError);

    // instantiate line generator
    this.lineGenerator = line()
      .x((d) => this.xScale(d[0]))
      .y((d) => this.yScale(d[1]));
  }

  resizeCharts() {
    this.MARGIN = { TOP: 30, BOTTOM: 20, LEFT: 35, RIGHT: 10 };
    const containerSize = select(`#${this.loessContainer}`)
      .node()
      .getBoundingClientRect();
    this.WIDTH = containerSize.width * 0.8;
    // this.HEIGHT = containerSize.height * 0.7;
    select("#fit-container-loess-svg")
      .transition()
      .attr("width", this.WIDTH + this.MARGIN.LEFT + this.MARGIN.RIGHT)
      // .attr("height", this.HEIGHT + this.MARGIN.TOP + this.MARGIN.BOTTOM)
      .select("#fit-container-loess-g");
    // .attr("transform", `translate(${this.MARGIN.LEFT}, ${this.MARGIN.TOP})`);

    select("#predict-container-loess-svg")
      .transition()
      .attr("width", this.WIDTH + this.MARGIN.LEFT + this.MARGIN.RIGHT)
      // .attr("height", this.HEIGHT + this.MARGIN.TOP + this.MARGIN.BOTTOM)
      .select("#predict-container-loess-g");
    // .attr("transform", `translate(${this.MARGIN.LEFT}, ${this.MARGIN.TOP})`);

    // update scales
    // errir scales
    this.xScaleError.range([0, this.WIDTH]);
    this.yScaleError.range([0, this.HEIGHT]);
    // loess scales
    this.xScale.range([0, this.WIDTH]);
    this.yScale.range([this.HEIGHT, 0]);

    // update axes
    // error
    this.xAxisError
      .transition()
      .call(axisBottom(this.xScaleError).tickSizeOuter(0).ticks(4));
    // loess
    this.xAxis
      .transition()
      .call(axisBottom(this.xScale).ticks(4).tickSizeOuter(0));

    // resize bars
    this.rects
      .transition()
      .duration(1000)
      .attr("width", (d) => this.xScaleError(+d.error));

    // redraw circles
    this.loessG
      .selectAll("circle.loess-train")
      .transition()
      .ease(easeBounceInOut)
      .attr("cx", (d) => this.xScale(+d.x))
      .attr("cy", (d) => this.yScale(+d.y));

    // redraw circles
    this.loessG
      .selectAll("circle.loess-test")
      .transition()
      .ease(easeExpInOut)
      .attr("cx", (d) => this.xScale(+d.x))
      .attr("cy", (d) => this.yScale(+d.y));

    this.drawLoessLine(this.bandwidth);
  }

  plotBars(data) {
    // need to transition axes
    let t = transition().delay(500).duration(600);

    // join
    this.rects = this.barG.selectAll(`rect.loessBar`).data(data, (d) => d.name);

    // update
    this.rects
      .transition()
      .duration(65)
      .attr("x", (d) => this.xScaleError(0))
      .attr("y", (d) => this.yScaleError(d.name))
      .attr("width", (d) => this.xScaleError(+d.error))
      .attr("height", this.yScaleError.bandwidth());

    // enter
    this.rects
      .enter()
      .append("rect")
      .attr("class", "loessBar")
      .attr("x", (d) => this.xScaleError(0))
      .attr("y", (d) => this.yScaleError(d.name))
      .attr("height", this.yScaleError.bandwidth())
      .attr("width", (d) => this.xScaleError(+d.error))
      .attr("fill", (d) => this.loessBarColor(d.name));
  }

  addLegend() {
    const that = this;
    const legendData = ["Train Data", "Test Data"];

    const nodeWidth = (d) => d.getBBox().width;

    const legend = this.loessG
      .append("g")
      .attr("class", "loess-legend")
      .attr("transform", "translate(0,0)");

    const lg = legend.selectAll("g").data(legendData).enter().append("g");

    const legendCircle = lg
      .append("circle")
      .attr("r", 4.5)
      .attr("id", (d, i) => (i % 2 == 0 ? "loess-train" : "loess-test"))
      .attr("cy", 5)
      .attr("cx", 1)
      .attr("stroke-width", 0);
    lg.append("text")
      .style("font-size", "14px")
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
      return `translate(${
        (that.WIDTH - nodeWidth(this)) / 2
      }, ${-that.MARGIN.TOP / 2})`;
    });
  }

  addSlider() {
    const that = this;
    // SLIDER
    const el = select(`#${this.sliderContainer}`);

    // draw text
    el.append("h4")
      .attr("id", `loess-text`)
      .html(`Smoothness: ${this.bandwidth.toFixed(2)}`);

    // draw slider
    el.append("input")
      .attr("id", `loess-slider`)
      .attr("class", "metric-slider")
      .attr("type", "range")
      .attr("min", 0.01)
      .attr("max", 1)
      .attr("step", 0.01)
      .attr("value", 0.42);

    selectAll(`#loess-slider`).on("input", function (d) {
      // only update text
      let val = select(this).property("value");
      // set price to object state
      const currValue = Number(val);
      that.bandwidth = currValue;
      select("#loess-text").html(`Smoothness: ${that.bandwidth.toFixed(2)}`);
      // update left chart
      that.drawLoessLine(that.bandwidth);
    });
  }

  // initialize svg and params for chart
  initChartSvg(stage) {
    const svg = select(`#${stage}`)
      .append("svg")
      .attr("id", `${stage}-svg`)
      .attr("width", this.WIDTH + this.MARGIN.LEFT + this.MARGIN.RIGHT)
      .attr("height", this.HEIGHT + this.MARGIN.TOP + this.MARGIN.BOTTOM);

    const g = svg
      .append("g")
      .attr("id", `${stage}-g`)
      .attr("transform", `translate(${this.MARGIN.LEFT}, ${this.MARGIN.TOP})`);

    return g;
  }
}
