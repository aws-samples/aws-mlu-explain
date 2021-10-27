import { regressionLinear } from "d3-regression";
import { meanSquaredError } from "./meanSquaredError";
import { trainData, testData, modelsData } from "./dataFiles";
import { testColorDot, trainColorDot } from "./constants";
import { select, selectAll } from "d3-selection";
import { axisBottom, axisLeft } from "d3-axis";
import { scaleLinear } from "d3-scale";
import { line, curveCatmullRom } from "d3-shape";
import { transition } from "d3-transition";
import { extent } from "d3-array";
import { easeBack } from "d3-ease";

export class Scatter {
  constructor(opts) {
    // load in arguments from config object
    this.element = opts.element;
    this.trainData = trainData;
    this.testData = testData;

    this.margin =
      window.innerWidth <= 700
        ? { left: 20, right: 1, top: 15, bottom: 30 }
        : { left: 40, right: 9, top: 15, bottom: 40 };
    this.chartDims = select("#scroll-figure").node().getBoundingClientRect();

    // this.innerWidth =
    //   window.innerWidth <= 700
    //     ? window.innerWidth / 3.1
    //     : window.innerWidth / 3;
    this.innerWidth = this.chartDims.width * 0.85;
    this.innerHeight = window.innerHeight * 0.36;
    this.radius = window.innerWidth < 700 ? 6 : 10;

    // scale for bottom charts (so don't remake)
    this.realizationScale = scaleLinear()
      .domain(extent(modelsData, (d) => d.x))
      .range([0, this.innerWidth]);
    this.realizationLine = line()
      .x((d) => this.realizationScale(d.x))
      .y((d) => this.yScale(d[column]))
      .curve(curveCatmullRom.alpha(0.5));

    // grab errorBar chart so we can line up transitions
    this.errorBar = opts.errorBar;

    this.linearRegression = regressionLinear()
      .x((d) => d.x)
      .y((d) => d.y)
      .domain([0, 16]);

    // tracker for loops
    this.loopDraw = true;

    this.drawBaseChart();
  }

  loop() {
    const that = this;
    // loop through async func calls
    const args = arguments;
    this.loopDraw = true;
    if (args.length <= 0) return;
    (function chain(i) {
      // break when scroll to different stage
      if (that.loopDraw !== true) return;
      if (i >= args.length || typeof args[i] !== "function") return;
      window.setTimeout(function () {
        args[i]();
        chain(i + 1);
      }, 110);
    })(0);
  }

  drawBaseChart() {
    // define x-scale
    this.xScale = scaleLinear()
      .domain([-0.05, 1.15])
      .range([0, this.innerWidth]);

    // define y-scale
    this.yScale = scaleLinear()
      .domain([-1.4, 1.4])
      .range([this.innerHeight, 0]);

    // create line generator
    this.lineGen = line()
      .x((d) => this.xScale(d.x))
      .y((d) => this.yScale(d.y))
      .curve(curveCatmullRom.alpha(0.5));

    this.lineGenUF = line()
      .x((d) => this.xScale(d.x))
      .y((d) => this.yScale(d.y_pred_uf))
      .curve(curveCatmullRom.alpha(0.5));

    this.lineGenOF = line()
      .x((d) => this.xScale(d.x))
      .y((d) => this.yScale(d.y_pred_of))
      .curve(curveCatmullRom.alpha(0.5));

    // define axes
    this.xAxisGenerator = axisBottom(this.xScale).tickSizeOuter(0).ticks(4);
    this.yAxisGenerator = axisLeft(this.yScale).tickSizeOuter(0).ticks(4);

    // create svg
    this.scatterSvg = select(this.element)
      .append("svg")
      .attr("id", "scatter-svg")
      .attr("width", this.innerWidth + this.margin.left + this.margin.right)
      .attr("height", this.innerHeight + this.margin.top + this.margin.bottom);

    // create scatter plot
    this.scatterPlot = this.scatterSvg
      .append("g")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

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
      .call(this.yAxisGenerator);

    // add circles
    this.scatterPlot
      .selectAll("circle.train")
      .data(this.trainData)
      .enter()
      .append("circle")
      .attr("class", "train")
      .attr("r", this.radius)
      .attr("cx", (d) => this.xScale(d.x))
      .attr("cy", (d) => this.yScale(d.y));

    // add labels to axes
    this.xLabel = this.scatterSvg
      .append("text")
      .attr("id", "scatter-x-axis-label")
      .attr("x", this.innerWidth / 2 + this.margin.left + this.margin.right)
      .attr("y", this.innerHeight + this.margin.top + this.margin.bottom)
      .text("X");
    this.yLabel = this.scatterSvg
      .append("text")
      .attr("id", "scatter-y-axis-label")
      .attr("x", 0)
      .attr("y", this.innerHeight / 2 + this.margin.top + 4)
      .text("Y")
      .style("fill", "black");
  }

  drawLineUnderfit() {
    // Create a update selection: bind to the new data
    this.regressionLine = this.scatterPlot
      .selectAll("#regression-line-1")
      .data([this.trainData], (d) => d.x);
    // Updata the line
    this.regressionLine
      .enter()
      .append("path")
      .attr("id", "regression-line-1")
      .merge(this.regressionLine)
      .transition()
      .ease(easeBack)
      .duration(1500)
      .attr("d", this.lineGenUF);

    // ensure line under circles
    selectAll("path#regression-line-1").lower();
  }

  drawLineOverfit() {
    this.regressionLine = this.scatterPlot
      .selectAll("#regression-line-1")
      .data([this.trainData], (d) => d.x);
    // Updata the line
    this.regressionLine
      .enter()
      .append("path")
      .attr("id", "regression-line-1")
      .merge(this.regressionLine)
      .transition()
      .ease(easeBack)
      .duration(1500)
      .attr("d", this.lineGenOF);
  }

  drawTrainErrorUnderfit() {
    const linRegData = this.linearRegression(this.trainData);
    const a = linRegData.a;
    const b = linRegData.b;

    // draw error bars
    let errorData = this.trainData.map((pair) => {
      let errorBnds = {
        x: pair.x, // keep x at same point
        y1: a * pair.x + b,
        y2: pair.y,
      };
      return errorBnds;
    });
    // draw vertical line between pairs of points
    let errorLines = this.scatterPlot
      .selectAll("line.errorLine")
      .data(errorData);

    let errorLinePath = errorLines
      .enter()
      .merge(errorLines)
      .append("line")
      .attr("class", "errorLine")
      .attr("x1", (d) => this.xScale(d.x))
      .attr("x2", (d) => this.xScale(d.x))
      .attr("y1", (d) => this.yScale(d.y2))
      .attr("y2", (d) => this.yScale(d.y2));
    selectAll("line.errorLine").lower();

    errorLinePath
      .transition()
      .duration(1000)
      .attr("y1", (d) => this.yScale(d.y1));

    const trainY = this.trainData.map((d) => d.y);
    const trainPred = this.trainData.map((d) => a * d.x + b);

    const trainMSE = meanSquaredError(trainY, trainPred);
    this.underfitError = [{ name: "Train", error: trainMSE }];
    this.errorBar.plotBars(this.underfitError);

    // update title of bar
    this.errorBar.addTitle("Mean-Squared Error");
  }

  drawTestErrorOverfit() {
    const linRegData = this.linearRegression(this.trainData);
    const a = linRegData.a;
    const b = linRegData.b;
    let testErrorData = this.testData.map((pair) => {
      let errorBnds = {
        x: pair.x, // keep x at same point
        y1: a * pair.x + b,
        y2: pair.y,
      };
      return errorBnds;
    });

    let testErrorLines = this.scatterPlot
      .selectAll("line.testErrorLine")
      .data(testErrorData);

    testErrorLines
      .enter()
      .merge(testErrorLines)
      .append("line")
      .attr("class", "testErrorLine")
      .attr("x1", (d) => this.xScale(d.x))
      .attr("x2", (d) => this.xScale(d.x))
      .attr("y1", (d) => this.yScale(d.y2))
      .attr("y2", (d) => this.yScale(d.y2))
      .transition()
      .duration(1000)
      .attr("y1", (d) => this.yScale(d.y1));

    selectAll("line.testErrorLine").lower();

    this.scatterPlot
      .selectAll("circle.test")
      .data(this.testData)
      .enter()
      .append("circle")
      .attr("class", "test")
      .attr("r", 0)
      .attr("cx", (d) => this.xScale(d.x))
      .attr("cy", (d) => this.yScale(d.y))
      .transition()
      .attr("r", this.radius * 2)
      .transition()
      .attr("r", this.radius);

    //   calculate MSE for barcharts
    const testY = this.testData.map((d) => d.y);
    const testPred = this.testData.map((d) => a * d.x + b);
    const testMSE = meanSquaredError(testY, testPred);

    this.underfitError.push({ name: "Test", error: testMSE });
    this.errorBar.plotBars(this.underfitError);
  }

  drawBarsTestOverfit() {
    const that = this;
    // func to find interpolated point along complex path
    // using binary search
    function findY(path, x) {
      path = path.node();
      const pathLength = path.getTotalLength();
      let start = 0;
      let end = pathLength;
      let target = (start + end) / 2;

      while (target >= start && target <= pathLength) {
        let pos = path.getPointAtLength(target);

        // use threshold bc float point precision
        if (Math.abs(pos.x - x) < 0.1) {
          return that.yScale.invert(pos.y);
        } else if (pos.x > x) {
          end = target;
        } else {
          start = target;
        }
        target = (start + end) / 2;
      }
    }
    // define error data
    let errorData = this.testData.map((pair) => {
      let errorBnds = {
        x: pair.x, // keep x at same point
        y1: findY(that.regressionLine, that.xScale(pair.x)),
        y1: findY(that.regressionLine, that.xScale(pair.x)),
        y2: pair.y,
      };
      return errorBnds;
    });

    // draw error lines
    let errorLines = this.scatterPlot
      .selectAll("line.errorLineComplex")
      .data(errorData);

    let errorLinePath = errorLines
      .enter()
      .merge(errorLines)
      .append("line")
      .attr("class", "errorLineComplex")
      .attr("x1", (d) => this.xScale(d.x))
      .attr("x2", (d) => this.xScale(d.x))
      .attr("y1", (d) => this.yScale(d.y2))
      .attr("y2", (d) => this.yScale(d.y2));

    selectAll("line.errorLineComplex").lower();

    errorLinePath
      .transition()
      .duration(1000)
      .attr("y1", (d) => this.yScale(d.y1));

    // calculate MSE for barcharts
    const testY = this.testData.map((d) => d.y);
    const testPred = this.testData.map((d) =>
      findY(that.regressionLine, that.xScale(d.x))
    );
    const trainY = this.trainData.map((d) => d.y);
    const trainPred = this.trainData.map((d) =>
      findY(that.regressionLine, that.xScale(d.x))
    );

    const trainMSE = meanSquaredError(trainY, trainPred);
    const testMSE = meanSquaredError(testY, testPred);

    // draw bars overfit
    this.overfitError.push({ name: "Test", error: testMSE });
    this.errorBar.plotBars(this.overfitError);
  }

  drawBarsTrainOverfit() {
    this.overfitError = [{ name: "Train", error: 0.001 }];
    this.errorBar.plotBars(this.overfitError);
  }

  plotTestBar() {
    const testError = this.overfitError.filter((d) => d.name === "Test");
    const maxError = 5;
    testError.push({ name: "Test", error: maxError * 1.01 });
    testError.push({ name: "Test", error: maxError * 1.02 });
    this.errorBar.plotDecompositionBar(testError);
    this.errorBar.addTitle("Test Error Decomposition");
  }

  modelRealization(opa, column) {
    this.realizationLine.y((d) => this.yScale(d[column]));
    // Create a update selection: bind to the new data
    const modelRealization = this.scatterPlot
      .selectAll(`#${column}`)
      .data([modelsData]);

    // Updata the line
    modelRealization
      .enter()
      .append("path")
      .attr("id", `${column}`)
      .attr("class", `model-realization`)
      .attr("d", this.realizationLine)
      .style("opacity", opa)
      .transition()
      .style("opacity", opa);
    selectAll("path.model-realization").lower();
  }

  drawUnderfitRealizations() {
    this.addTitle("Simple Model Realizations");
    // draw associated errors
    const that = this;
    this.underfitOpa = 0.3;
    this.goodFitOpa = 0;
    this.overfitOpa = 0;
    this.drawLoop = false;
    selectAll("[id^='uf-preds']").remove();
    selectAll("[id^='of-preds']").remove();
    selectAll("[id^='good-preds']").remove();
    this.errorBar.drawErrorBase();
    window.setTimeout(function () {
      that.drawLoop = true;
    }, 120);
    this.loop(
      () => this.modelRealization(this.underfitOpa, "uf-preds-0"),
      () => this.modelRealization(this.underfitOpa, "uf-preds-1"),
      () => this.modelRealization(this.underfitOpa, "uf-preds-2"),
      () => this.modelRealization(this.underfitOpa, "uf-preds-3"),
      () => this.modelRealization(this.underfitOpa, "uf-preds-4"),
      () => this.modelRealization(this.underfitOpa, "uf-preds-5"),
      () => this.modelRealization(this.underfitOpa, "uf-preds-6"),
      () => this.modelRealization(this.underfitOpa, "uf-preds-7"),
      () => this.modelRealization(this.underfitOpa, "uf-preds-8"),
      () => this.modelRealization(this.underfitOpa, "uf-preds-9"),
      () => this.modelRealization(this.underfitOpa, "uf-preds-10"),
      () => this.modelRealization(this.underfitOpa, "uf-preds-11"),
      () => this.modelRealization(this.underfitOpa, "uf-preds-12")
    );
  }

  drawOverfitRealizations() {
    const that = this;
    this.drawLoop = false;
    this.overfitOpa = 0.3;
    this.underfitOpa = 0;
    this.goodFitOpa = 0;
    selectAll("[id^='uf-preds']").remove();
    selectAll("[id^='of-preds']").remove();
    selectAll("[id^='good-preds']").remove();
    this.addTitle("Complex Model Realizations");
    window.setTimeout(function () {
      that.drawLoop = true;
    }, 120);
    this.loop(
      () => this.modelRealization(this.overfitOpa, "of-preds-0"),
      () => this.modelRealization(this.overfitOpa, "of-preds-1"),
      () => this.modelRealization(this.overfitOpa, "of-preds-2"),
      () => this.modelRealization(this.overfitOpa, "of-preds-3"),
      () => this.modelRealization(this.overfitOpa, "of-preds-4"),
      () => this.modelRealization(this.overfitOpa, "of-preds-5"),
      () => this.modelRealization(this.overfitOpa, "of-preds-6"),
      () => this.modelRealization(this.overfitOpa, "of-preds-7"),
      () => this.modelRealization(this.overfitOpa, "of-preds-8"),
      () => this.modelRealization(this.overfitOpa, "of-preds-9"),
      () => this.modelRealization(this.overfitOpa, "of-preds-10"),
      () => this.modelRealization(this.overfitOpa, "of-preds-11"),
      () => this.modelRealization(this.overfitOpa, "of-preds-12")
    );
  }

  drawGoodRealizations() {
    const that = this;
    this.drawLoop = false;
    this.overfitOpa = 0;
    this.underfitOpa = 0;
    this.goodFitOpa = 0.3;
    selectAll("[id^='uf-preds']").remove();
    selectAll("[id^='of-preds']").remove();
    selectAll("[id^='good-preds']").remove();
    this.addTitle("Balanced Model Realizations");
    window.setTimeout(function () {
      that.drawLoop = true;
    }, 120);
    this.loop(
      () => this.modelRealization(this.goodFitOpa, "good-preds-0"),
      () => this.modelRealization(this.goodFitOpa, "good-preds-1"),
      () => this.modelRealization(this.goodFitOpa, "good-preds-2"),
      () => this.modelRealization(this.goodFitOpa, "good-preds-3"),
      () => this.modelRealization(this.goodFitOpa, "good-preds-4"),
      () => this.modelRealization(this.goodFitOpa, "good-preds-5"),
      () => this.modelRealization(this.goodFitOpa, "good-preds-6"),
      () => this.modelRealization(this.goodFitOpa, "good-preds-7"),
      () => this.modelRealization(this.goodFitOpa, "good-preds-8"),
      () => this.modelRealization(this.goodFitOpa, "good-preds-9"),
      () => this.modelRealization(this.goodFitOpa, "good-preds-10"),
      () => this.modelRealization(this.goodFitOpa, "good-preds-11"),
      () => this.modelRealization(this.goodFitOpa, "good-preds-12")
    );
  }

  addLegend() {
    const that = this;
    const legendData = ["Train Data", "Test Data"];

    const nodeWidth = (d) => d.getBBox().width;

    const legend = this.scatterPlot
      .append("g")
      .attr("class", "legend")
      .attr("transform", "translate(0,0)");

    const lg = legend.selectAll("g").data(legendData).enter().append("g");

    const legendCircle = lg
      .append("circle")
      .attr("class", "scatter-legend-circle")
      .attr("r", 6)
      .attr("fill", (d, i) => (i % 2 == 0 ? trainColorDot : testColorDot))
      .attr("cy", -5)
      .attr("cx", 1)
      .attr("stroke-width", 0);
    lg.append("text")
      .attr("class", "scatter-legend-text")
      .attr("x", 11.5)
      .attr("y", 0)
      .text((d) => d);

    let offset = 0;

    lg.attr("transform", function (d) {
      let x = offset;
      let offsetValue = window.innerWidth <= 600 ? 3 : 10;
      offset += nodeWidth(this) + offsetValue;
      return `translate(${x}, ${0})`;
    });

    legend.attr("transform", function () {
      return `translate(${(that.innerWidth - nodeWidth(this)) / 2}, 0)`;
    });
  }

  removeRealizationLines() {
    // remove predrawn lines
    this.overfitOpa = 0;
    this.underfitOpa = 0;
    this.goodFitOpa = 0.3;
    selectAll("[id^='uf-preds']").remove();
    selectAll("[id^='of-preds']").remove();
    selectAll("[id^='good-preds']").remove();
  }

  transitionUp5() {
    this.removeRealizationLines();

    // remove lines & symbols from error line charts
    selectAll(".error-line-bottom").remove();
    select("rect.stacked-error").remove();
    select("#error-text").remove();
    selectAll(".error-symbol").remove();

    // update title
    this.errorBar.addTitle("Test Error Decomposition");

    this.errorBar.reverseDecomposition();
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
