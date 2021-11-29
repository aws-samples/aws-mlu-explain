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

const stepHPercentage = 1.1;
const offsetTriggerFromTop = 0.65;

// initialize the scrollama
const scroller = scrollama();

// draw double descent chart
const ddModel = new DoubleDescent({
  ddContainer: chart1Container,
});

// step events for chart
const stepEventsCenter = {
  down: {
    0: () => {
      ddModel.drawTransition0Down();
    },
    1: () => {
      ddModel.drawTransition1Down();
    },
    2: () => {
      ddModel.drawTransition2Down();
    },
    3: () => {
      ddModel.drawTransition3Down();
    },
    4: () => {
      ddModel.drawTransition4Down();
    },
    5: () => {
      ddModel.drawTransition5Down();
    },
  },
  up: {
    0: () => {
      ddModel.drawTransition0Up();
    },
    1: () => {
      ddModel.drawTransition1Up();
    },
    2: () => {
      ddModel.drawTransition2Up();
    },
    3: () => {
      ddModel.drawTransition3Up();
    },
    4: () => {
      ddModel.drawTransition4Up();
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
  ddModel.resizeChart();
}

// scrollama event handlers
function handleStepEnter(response) {
  // update graphic based on step
  figure.select("p").text(response.index + 1);

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
