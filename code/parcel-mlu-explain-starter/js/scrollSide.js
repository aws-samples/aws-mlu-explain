import { select, selectAll } from "d3-selection";
import scrollama from "scrollama";
import { errorData } from "./dataFiles";
import { Error } from "./Error";
import { Scatter } from "./Scatter";
import "intersection-observer";

// ensure refresh goes to top of page
// window.onbeforeunload = () => window.scrollTo(0, 0);

// using d3 for convenience
const scrollySide = select("#scrolly-side");
const figureSide = scrollySide.select("figure");
const articleSide = scrollySide.select("article");
const stepSide = articleSide.selectAll(".step-side");

// chart selections
const scatterContainer = "#scatter-container";
const errorContainer = "#error-container";

const offsetTriggerFromTopSide = 0.7;

// initialize the scrollama
const scrollerSide = scrollama();

const scatter = new Scatter({
  container: scatterContainer,
});

const error = new Error({
  container: errorContainer,
});

// let initHeightSide = window.innerHeight;
// let initWidthSide = window.innerWidth;

// step events for chart
const stepEventsSide = {
  down: {
    0: () => {
      scatter.transition0Down();
      scatter.addTitle("Model with K=5 Features");
      // scatter.addTitle("K = 5, MAE = 0.2515");
      error.drawTransition0Down();
      // error.showToolTip();
    },
    1: () => {
      scatter.updateLine("y-11");
      scatter.addTitle("Model with K=12 Features");
      // scatter.addTitle("K = 12, MAE = 0.22");
      error.drawTransition1Down();
    },
    2: () => {
      scatter.updateLine("y-33");
      scatter.addTitle("Model with K=33 Features");
      // scatter.addTitle("K = 29, MAE = 0.78");
      error.drawTransition2Down();
    },
    3: () => {
      scatter.updateLine("y-255");
      scatter.addTitle("Model with K=255 Features");
      // scatter.addTitle("K = 255, MAE = 0.21");
      error.drawTransition3Down();
    },
    4: () => {},
    5: () => {
      scatter.updateLine("y-5");
      scatter.addTitle("Model with K=5 Features");
      // scatter.addTitle("K = 29, MAE = 0.78");
      error.updateToolTip(4);
      // error.showToolTip();
    },
  },
  up: {
    0: () => {
      scatter.transition0Up();
      scatter.addTitle("Model with K=5 Features");
      // scatter.addTitle("K = 5, MAE = 0.2515");
      error.drawTransition0Up();
    },
    1: () => {
      scatter.updateLine("y-11");
      scatter.addTitle("Model with K=11 Features");
      // scatter.addTitle("K = 12, MAE = 0.22");
      error.drawTransition1Up();
    },
    2: () => {
      scatter.updateLine("y-33");
      scatter.addTitle("Model with K=33 Features");
      // scatter.addTitle("K = 25 MAE = 0.78");
      error.drawTransition2Up();
    },
    3: () => {
      scatter.updateLine("y-255");
      scatter.addTitle("Model with K=255 Features");
      // scatter.addTitle("K = 255, MAE = 0.21");
      error.drawTransition3Up();
    },
    4: () => {
      error.drawTransition4Up();
    },
    5: () => {},
  },
};

// generic window resize listener event
function handleResizeSide() {
  // 1. update height of step elements
  let stepHPerc = window.innerHeight < 600 ? 1.5 : 1.5;
  let stepSideH = Math.floor(window.innerHeight * stepHPerc);
  stepSide.style("height", stepSideH + "px");

  let figureSideHeight = window.innerHeight / 1.2;
  let figureSideMarginTop = (window.innerHeight - figureSideHeight) / 2;

  figureSide
    .style("height", figureSideHeight + "px")
    .style("top", figureSideMarginTop + "px");

  // 3. tell scrollama to update new element dimensions
  scrollerSide.resize();
}

// scrollama event handlers
function handleStepEnterSide(response) {
  // add color to current step only
  // stepSide.classed("is-active", function (d, i) {
  //   return i === response.index;
  // });

  // update chart based on step
  stepEventsSide[response.direction][response.index]();
}

function setupStickyfillSide() {
  selectAll(".sticky").each(function () {
    Stickyfill.add(this);
  });
}

function initSide() {
  setupStickyfillSide();

  // 1. force a resize on load to ensure proper dimensions are sent to scrollama
  handleResizeSide();

  // 2. setup the scrollerSide passing options
  // 		this will also initSideialize trigger observations
  // 3. bind scrollama event handlers (this can be chained like below)
  scrollerSide
    .setup({
      step: "#scrolly-side article .step-side",
      offset: offsetTriggerFromTopSide,
      // debug: true,
    })
    .onStepEnter(handleStepEnterSide);

  // setup resize event
  // if (window.innerWidth > 900) {
  // prevent resize when height changes, width doesnt
  // if (!(window.innerHeight === initHeightSide && window.innerWidth !== initWidthSide)) {
  // window.addEventListener("resize", handleResizeSide);
  // }
  if (window.innerWidth > 900) {
    window.addEventListener("resize", handleResizeSide);
  }
}

// kick scrolly things off
initSide();

// add slider

const slider =
  window.innerWidth > 600
    ? select(`#slider-container`)
    : select(`#slider-container`);

// draw text
slider.append("h4").attr("id", `error-text`).html(`K=5`);

// draw slider
slider
  .append("input")
  .attr("id", `error-slider`)
  .attr("class", "metric-slider")
  .attr("type", "range")
  .attr("min", 1)
  .attr("max", 255)
  .attr("step", 1)
  .attr("value", 4);

selectAll(`#error-slider`).on("input", function (d) {
  // only update text
  let val = select(this).property("value");
  // set price to object state
  const currValue = Number(val);
  select("#error-text").html(`K=${currValue}`);
  scatter.updateLineInput(`y-${currValue - 1}`);

  // get current error data
  const errorValue = errorData[currValue - 1];
  scatter.addTitle(`Model With K=${currValue} Features`);
  // scatter.addTitle(`K = ${currValue}, MAE = ${errorValue.mae.toFixed(4)}`);
  error.dragToolTip(currValue - 1);
});
