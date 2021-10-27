import "intersection-observer";
import scrollama from "scrollama";
import { ErrorBar } from "./ErrorBar";
import { a3, a4, a5, a6, a7, a8, a9, a10, a11 } from "./annotations";
import { Scatter } from "./Scatter";
import { KNN } from "./KNN";
import { Loess } from "./Loess";
import { DoubleDescent } from "./DoubleDescent";
import { select, selectAll } from "d3-selection";

// chart selections
const chart1Container = "#scroll-viz";
const chart2Container = "#svg2";

// get current width to track mobile
const screenWidth = window.innerWidth;
const mobileBreak = 600;

// using d3 for convenience
let main = select("main");
let scrolly = main.select("#scrolly");
let figure = scrolly.select("figure");
let article = scrolly.select("article");
let step = article.selectAll(".step");
let scatterChart = select(chart1Container);
let errorChart = select(chart1Container);

const stepHPercentage = 1;
const offsetTriggerFromTop = screenWidth > mobileBreak ? 0.5 : 0.5;

// ensure refresh goes to top of page
window.onbeforeunload = () => window.scrollTo(0, 0);

// initialize the scrollama
let scroller = scrollama();

const errorBar = new ErrorBar(chart2Container);
const reglin = new Scatter({
  element: chart1Container,
  errorBar: errorBar,
});

// KNN Stuff
const KnnModel = new KNN({
  fitContainer: "fit-container",
  predictContainer: "predict-container",
  sliderContainer: "slider-container",
  k: 3,
});

// button handler for knn
select("#button-knn").on("click", function () {
  KnnModel.refreshChartWithNewData();
});

// LOESS Stuff
const LOESSModel = new Loess({
  loessContainer: "fit-container-loess",
  barContainer: "predict-container-loess",
  sliderContainer: "slider-container-loess",
  k: 3,
});

select("#button-loess").on("click", function () {
  LOESSModel.generateData();
});

// draw double descent chart
const ddModel = new DoubleDescent({
  ddContainer: "dd-container",
});

// generic window resize listener event
function handleResize() {
  // 1. update height of step elements
  // important: height of each step
  let stepHPercentageResponsive =
    window.innerWidth <= 900 ? 1.8 : stepHPercentage;
  let stepH = Math.floor(window.innerHeight * stepHPercentageResponsive);
  step.style("height", stepH + "px");

  let figureHeight = window.innerHeight / 1.1;
  let figureWidth = window.innerWidth / 1.1;
  let responsiveWidth = window.innerWidth / 2.4;
  let responsiveHeight = window.innerHeight * 0.3;
  let figureMarginTop = (window.innerHeight - figureHeight) / 2;

  figure
    .style("height", `${figureHeight}px`)
    .style("width", `${figureWidth}px`)
    .style("top", `${figureMarginTop}px`);

  scatterChart
    .attr("height", `${responsiveHeight}px`)
    .attr("width", `${responsiveWidth}px`);

  errorChart
    .attr("height", `${responsiveHeight}px`)
    .attr("width", `${responsiveWidth}px`);

  // update knnSize
  // KnnModel.resizeCharts();
  LOESSModel.resizeCharts();

  // 3. tell scrollama to update new element dimensions
  scroller.resize();
}

// remove lines drawn from simulations all in one go
const removeModelRealizations = () => {
  selectAll("[id^='uf-preds']").remove();
  selectAll("[id^='of-preds']").remove();
  selectAll("[id^='good-preds']").remove();
};

// define event dict for each step in scrolly
const stepEvents = {
  down: {
    0: () => {
      reglin.drawLineUnderfit();
    },
    1: () => {
      reglin.drawTrainErrorUnderfit();
      select("#errorBarSvg")
        .selectAll(".axes")
        .transition()
        .delay(600)
        .attr("visibility", "visible");
    },
    2: () => {
      reglin.addLegend();
      reglin.drawTestErrorOverfit();
      setTimeout(() => {
        a4.show();
        a5.show();
      }, 750);
    },
    3: () => {
      // remove the underfit error lines
      const removeClasses = [".errorLine", ".testErrorLine"];
      removeClasses.map((d) => {
        selectAll(d).remove();
      });
      // draw the overfit line
      reglin.drawLineOverfit();
      // update bar
      reglin.drawBarsTrainOverfit();
    },
    4: () => {
      reglin.drawBarsTestOverfit();
      setTimeout(() => {
        a3.show();
        a6.show();
      }, 750);
    },
    5: () => {
      // remove error lines from prev step
      removeModelRealizations();
      selectAll(".errorLineComplex").remove();
      reglin.plotTestBar();
      // remove circles (make sure to add back in)
      selectAll("circle.test").transition().attr("r", 0);
      select("#regression-line-1").attr("visibility", "hidden");
      selectAll(".legend").attr("visibility", "hidden");
      setTimeout(() => {
        a10.show();
      }, 750);
    },
    6: () => {
      removeModelRealizations();
      reglin.errorBar.addTitle("");
      reglin.errorBar.positionErrorBarsAsLabels();
      reglin.drawUnderfitRealizations();
      reglin.errorBar.plotErrorLines("x", "uf");
      setTimeout(() => {
        a7.show();
      }, 750);
    },
    7: () => {
      removeModelRealizations();
      reglin.drawOverfitRealizations();
      reglin.errorBar.plotErrorLines("x", "of");
      setTimeout(() => {
        a8.show();
      }, 750);
    },
    8: () => {
      removeModelRealizations();
      reglin.drawGoodRealizations();
      reglin.errorBar.plotErrorLines("x", "good");
      setTimeout(() => {
        a9.show();
      }, 750);
    },
    9: () => {
      removeModelRealizations();
      reglin.errorBar.repositionSvgNew();
      reglin.errorBar.plotErrorLines("x_point", "point");
      reglin.errorBar.plotComplexCircleOne();
    },
    10: () => {
      removeModelRealizations();
      reglin.errorBar.plotErrorLines("x", "final");
      reglin.errorBar.plotComplexCircleAll();
      setTimeout(() => {
        a11.show();
      }, 750);
    },
  },

  up: {
    0: () => {
      removeModelRealizations();
      selectAll("rect.errorBar").transition().attr("width", 0);
      selectAll(".errorBar").transition().delay(500).remove();
      selectAll(".errorLine").remove();
      select("#errorBarSvg")
        .selectAll(".axes")
        .transition()
        .delay(600)
        .attr("visibility", "hidden");
      // remove barchart title
      select("#errorBarTitle").remove();
      selectAll(".legend").remove();
    },
    1: () => {
      removeModelRealizations();
      reglin.drawTrainErrorUnderfit();
      selectAll(".testErrorLine").remove();
      selectAll("circle.test").transition().attr("r", 0).transition().remove();
      selectAll(".legend").remove();
    },
    2: () => {
      removeModelRealizations();
      selectAll(".testErrorLine").remove();
      selectAll(".errorLineComplex").remove();
      reglin.drawLineUnderfit();
      reglin.addLegend();
      reglin.drawTestErrorOverfit();
    },
    3: () => {
      removeModelRealizations();
      selectAll(".errorLineComplex").remove();
      // draw the overfit line
      reglin.drawLineOverfit();
      // update bar
      reglin.drawBarsTrainOverfit();
    },
    4: () => {
      removeModelRealizations();
      selectAll("rect.stacked").remove();
      selectAll(".decomp-text").remove();
      selectAll("circle.test").transition().attr("r", 10);
      select("#regression-line-1").attr("visibility", "visible");
      selectAll(".legend").attr("visibility", "visible");
      reglin.errorBar.plotReverseDecompositionBar();
      reglin.errorBar.addTitle("Mean-Squared Error");
      reglin.drawBarsTestOverfit();
    },
    5: () => {
      // reset title
      reglin.addTitle("");
      // redraw model lines
      removeModelRealizations();
      reglin.transitionUp5();
    },
    6: () => {
      removeModelRealizations();
      reglin.drawUnderfitRealizations();
      reglin.errorBar.plotErrorLines("x", "uf");
    },
    7: () => {
      removeModelRealizations();
      reglin.drawOverfitRealizations();
      reglin.errorBar.plotErrorLines("x", "of");
    },
    8: () => {
      reglin.errorBar.upPositionSvg();
      reglin.errorBar.plotErrorLines("x", "good");
      selectAll("[class^='complex-']").transition().attr("r", 0).remove();
    },
    9: () => {
      selectAll("[class^='complex-']").transition().attr("r", 0).remove();
      reglin.errorBar.plotErrorLines("x_point", "point");
      reglin.errorBar.plotComplexCircleOne();
    },
    10: () => {}, // placeholder to stop error throw
  },
};

// scrollama event handlers
function handleStepEnter(response) {
  // update chart based on step
  stepEvents[response.direction][response.index]();
}

function setupStickyfill() {
  selectAll(".sticky").each(function () {
    Stickyfill.add(this);
  });
}

function init() {
  setupStickyfill();

  // 1. force a resize on load to ensure proper dimensions are sent to scrollama
  handleResize();

  // 2. setup the scroller passing options
  // 		this will also initialize trigger observations
  // 3. bind scrollama event handlers (this can be chained like below)
  scroller
    .setup({
      step: "#scrolly article .step",
      offset: offsetTriggerFromTop,
      // debug: true,
    })
    .onStepEnter(handleStepEnter);

  // setup resize event
  window.addEventListener("resize", handleResize);
}

// kick things off
init();
