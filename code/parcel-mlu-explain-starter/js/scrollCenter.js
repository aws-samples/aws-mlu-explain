import { select, selectAll } from "d3-selection";
import scrollama from "scrollama";
import { DoubleDescent } from "./DoubleDescent";
import "intersection-observer";

// chart selections
const chart1Container = "#doubledescent-container";

// using d3 for convenience
const scrolly = select("#scrolly");
const figure = scrolly.select("figure");
const article = scrolly.select("article");
const step = article.selectAll(".step");

const stepHPercentage = window.innerWidth < 600 ? 1.5 : 1.1;
const offsetTriggerFromTop = 0.65;

// initialize the scrollama
const scroller = scrollama();

let centerTransitionIndex = -1;

const doubleDescentChart = new DoubleDescent({
  ddContainer: chart1Container,
});

// step events for chart
const stepEventsCenter = {
  down: {
    0: () => {
      doubleDescentChart.drawTransition0Down();
      centerTransitionIndex = 0;
    },
    1: () => {
      doubleDescentChart.drawTransition1Down();
      centerTransitionIndex = 1;
    },
    2: () => {
      doubleDescentChart.drawTransition2Down();
      centerTransitionIndex = 2;
    },
    3: () => {
      doubleDescentChart.drawTransition3Down();
      centerTransitionIndex = 3;
    },
    4: () => {
      doubleDescentChart.drawTransition4Down();
      centerTransitionIndex = 4;
    },
    5: () => {
      doubleDescentChart.drawTransition5Down();
      centerTransitionIndex = 5;
    },
  },
  up: {
    0: () => {
      doubleDescentChart.drawTransition0Up();
    },
    1: () => {
      doubleDescentChart.drawTransition1Up();
    },
    2: () => {
      doubleDescentChart.drawTransition2Up();
    },
    3: () => {
      doubleDescentChart.drawTransition3Up();
    },
    4: () => {
      doubleDescentChart.drawTransition4Up();
    },
    5: () => {},
  },
};

// generic window resize listener event
function handleResize() {
  // 1. update height of step elements
  let stepH = Math.floor(window.innerHeight * stepHPercentage);
  step.style("height", stepH + "px");

  //   let figureHeight = window.innerHeight / 1.5;
  let figureHeight = window.innerHeight * 0.8;
  let figureMarginTop = (window.innerHeight - figureHeight) / 2;

  figure
    .style("height", figureHeight + "px")
    .style("top", figureMarginTop + "px");

  // 3. tell scrollama to update new element dimensions
  scroller.resize();

  doubleDescentChart.resizeChart();
  // resolve previous transition
  if (centerTransitionIndex > -1) {
    if (centerTransitionIndex > 2) {
      doubleDescentChart.redrawResize();
    }
    stepEventsCenter["down"][centerTransitionIndex]();
  }
}

// scrollama event handlers
function handleStepEnter(response) {
  // update graphic based on step
  console.log(response.index);

  // update chart based on step
  stepEventsCenter[response.direction][response.index]();
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
  doubleDescentChart.resizeChart();

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
  // setup resize event
  if (window.innerWidth > 900) {
    window.addEventListener("resize", handleResize);
  }
  // prevent resize when height changes, width doesnt
}

// kick things off
init();
