import * as d3 from "d3";
import { Grid } from "./Grid.js";
import { Scatter } from "./Scatter.js";

let numTreeslider = "#numSlider";
let probSlider = "#probSlider";
const treeGrid = new Grid({
  chartContainer: "#gridOfTrees",
  maxDepth: 5,
});

const scatterPlot = new Scatter({
  chartContainer: "#scatter",
});

// list of sections for intersection observer to track
const sectionsCondurcet = d3.selectAll("section.condurcet-scrolly").nodes();

// options for intersection observer
const options = {
  threshold: 0.7,
};
d3.select("#chart-wrapper-condurcet").style("opacity", 1);
// dict for target events
const target2event = {
  0: () => {
    d3.select("#numSlider").property("value", "1");
    treeGrid.drawTreesOnGrid(1);
    scatterPlot.drawDots(1);
    d3.select("#numTrees-value").html(`# of Trees: 1`);
    // ensure sliders hidden
    d3.selectAll("#numSlider").style("opacity", 0);
    d3.selectAll("#probSlider").style("opacity", 0);
  },
  1: () => {
    d3.select("#numSlider").property("value", "3");
    treeGrid.drawTreesOnGrid(3);
    scatterPlot.drawDots(2);
    d3.select("#numTrees-value").html(`# of Trees: 3`);
    // ensure sliders hidden
    d3.selectAll("#numSlider").style("opacity", 0);
    d3.selectAll("#probSlider").style("opacity", 0);
  },
  2: () => {
    d3.select("#numSlider").property("value", "11");
    treeGrid.drawTreesOnGrid(11);
    scatterPlot.drawDots(6);
    d3.select("#numTrees-value").html(`# of Trees: 11`);
    // ensure sliders hidden
    d3.selectAll("#numSlider").style("opacity", 0);
    d3.selectAll("#probSlider").style("opacity", 0);
  },
  3: () => {
    treeGrid.drawTreesOnGrid(25);
    scatterPlot.drawDots(Math.floor(25 / 2) + 1);
    d3.select("#numSlider").property("value", "25");
    d3.select("#numTrees-value").html(`# of Trees: 25`);
    // show sliders
    d3.selectAll("#numSlider").style("opacity", 1);
    d3.selectAll("#probSlider").style("opacity", 1);
  },
  4: () => {},
};

let observer = new IntersectionObserver(trackScroll, options);

function trackScroll(entries) {
  entries.forEach((entry) => {
    // check if visible or not
    if (entry.isIntersecting) {
      // resolve stage in graph
      const entryIndex = entry.target.getAttribute("data-index");
      if (entryIndex in target2event) {
        target2event[entryIndex]();
      }
    }
  });
}

sectionsCondurcet.forEach((section) => {
  observer.observe(section);
});

// Handle Condurcet input slider events
d3.select(numTreeslider).on("input", function (d) {
  let val = d3.select(this).property("value");
  treeGrid.drawTreesOnGrid(val);
  scatterPlot.drawDots(Math.floor(val / 2) + 1);
  d3.select("#numTrees-value").html(`# of Trees: ${val}`);
});
d3.select(probSlider).on("input", function (d) {
  let val = d3.select(this).property("value");
  scatterPlot.circleUpdate(val);
  scatterPlot.drawDots(
    Math.ceil(d3.select(numTreeslider).property("value") / 2)
  );

  d3.select("#probability-value").html(
    `Tree Accuracy: ${d3.format(".0%")(val)}`
  );
});
// generic window resize listener event
// don't trigger for mobile
const resize = (window.onresize = () => {
  if (window.innerWidth >= 1000) {
    scatterPlot.resizeChart();
    treeGrid.resizeChart();
  }
});
window.addEventListener("resize", resize);
