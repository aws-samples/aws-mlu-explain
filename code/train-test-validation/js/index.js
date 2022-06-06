import { Bubble } from "./Bubble";
import { Table } from "./Table";
import { select, selectAll } from "d3-selection";

// list of sections for intersectin observer to track
const sections = selectAll("section").nodes();

// add table to dom
const table = new Table({
  tableContainer: "#table",
});

const bubbleChart = new Bubble({
  chartContainer: "#chart",
  table: table,
});

// options for intersection observer
const options = {
  threshold: 0.7,
};

// dict for function calls
const target2event = {
  0: () => {
    // intro
    selectAll(".axes-text").remove();

    bubbleChart.showGroups = ["train", "test", "validation"];
    bubbleChart.showAnimals();
    bubbleChart.currentGroup = "pretrain";
    bubbleChart.currentFeature = "weight";
    bubbleChart.moveBack();
    bubbleChart.colorAnimals("off");
    bubbleChart.hideLabels("all");
  },
  1: () => {
    // the split
    selectAll(".axes-text").remove();

    bubbleChart.currentGroup = "pretrain";
    bubbleChart.currentFeature = "weight";
    bubbleChart.moveNodes();
    bubbleChart.colorAnimals("on");
    bubbleChart.nonShowGroups = ["train", "test", "validation"];
    bubbleChart.showAnimals();
    bubbleChart.showLabels("all");
  },
  2: () => {
    // train set
    // stuff to do to ensure refresh works
    bubbleChart.colorAnimals("on");
    selectAll(".axes-text").remove();
    bubbleChart.nonShowGroups = ["test", "validation"];
    // reset weight button to be active
    selectAll("button.button").classed("active", false);
    select(`button[value="weight"`).classed("active", true);
    bubbleChart.currentFeature = "weight";
    select(".button-container").style("opacity", 0);
    bubbleChart.trackCurrentGroups("train");
    bubbleChart.showGroups = ["train"];
    bubbleChart.showAnimals();
    bubbleChart.moveNodes();
    bubbleChart.hideNonTrainAnimals();
    bubbleChart.hideLines();
    bubbleChart.hideLabels("train");
    bubbleChart.showLabels("train");
    bubbleChart.currentGroup = "pretrain";
    select("#hull-g").style("opacity", 0);
  },
  3: () => {
    // model
    bubbleChart.nonShowGroups = ["test", "validation"];
    // stuff to do to ensure refresh works
    bubbleChart.colorAnimals("on");
    selectAll(".axes-text").remove();
    select(".button-container").style("opacity", 1);

    selectAll("button.button").classed("active", false);
    select(`button[value="weight"`).classed("active", true);

    select("#hull-g").style("opacity", 0);
    bubbleChart.showGroups = ["train"];
    bubbleChart.showAnimals();
    bubbleChart.currentGroup = "train";
    bubbleChart.currentFeature = "weight";
    bubbleChart.trackCurrentGroups("train");

    bubbleChart.hideNonTrainAnimals();
    bubbleChart.moveBee();
    bubbleChart.drawHorizontalLine();
    bubbleChart.drawDecisionBoundary();
    bubbleChart.hideLabels("all");
    bubbleChart.drawAxesLabels("weight");
    // remove table if exists
    select("#data-table").remove();
  },
  4: () => {
    // validation set
    bubbleChart.nonShowGroups = ["test"];
    // stuff to do to ensure refresh works
    bubbleChart.drawHorizontalLine();
    select(".button-container").style("opacity", 1);
    bubbleChart.trackCurrentGroups("validation");
    bubbleChart.colorAnimals("on");

    bubbleChart.showAnimals();
    bubbleChart.table.drawTable();
    bubbleChart.updateDataPosition();
    bubbleChart.calculatePerformance();
  },
  5: () => {
    // test set
    bubbleChart.nonShowGroups = [];
    // stuff to do to ensure refresh works
    bubbleChart.colorAnimals("on");
    bubbleChart.drawHorizontalLine();
    select(".button-container").style("opacity", 1);

    bubbleChart.trackCurrentGroups("test");
    // show validation data
    bubbleChart.showAnimals();
    // if table doesn't exist, draw it and calculate perf
    // (useful if refresh on this step)
    if (!document.getElementById("data-table")) {
      bubbleChart.table.drawTable();
    }
    bubbleChart.updateDataPosition();
    bubbleChart.calculatePerformance();
  },
  6: () => {
    // test set
    bubbleChart.nonShowGroups = [];

    // stuff to do to ensure refresh works
    bubbleChart.colorAnimals("on");
    bubbleChart.drawHorizontalLine();
    select(".button-container").style("opacity", 1);

    bubbleChart.trackCurrentGroups("test");
    // show validation data
    bubbleChart.showAnimals();
    // if table doesn't exist, draw it and calculate perf
    // (useful if refresh on this step)
    if (!document.getElementById("data-table")) {
      bubbleChart.table.drawTable();
    }
    bubbleChart.updateDataPosition();
    bubbleChart.calculatePerformance();
  }, // fin
};

let observer = new IntersectionObserver(navCheck, options);
let previousY = 0;
let previousRatio = 0;

function navCheck(entries) {
  entries.forEach((entry) => {
    const currentRatio = entry.intersectionRatio;

    previousRatio = currentRatio;

    const className = entry.target.className;

    const activeAnchor = select(`[data-page=${className}]`);

    // check if visible or not
    if (entry.isIntersecting) {
      // resolve stage in graph
      const target = entry.target.className;
      const entryIndex = entry.target.getAttribute("data-index");

      if (entryIndex in target2event) {
        target2event[entryIndex]();
      }
      selectAll("a").classed("selected", false);

      activeAnchor.classed("selected", true);
    }
  });
}

sections.forEach((section) => {
  observer.observe(section);
});

function redraw() {
  // resize chart
  bubbleChart.redraw();
}

// Draw for the first time to initialize.
redraw();

// Redraw based on the new size whenever the browser window is resized.
window.addEventListener("resize", redraw);

selectAll("button.button").on("click", function (d) {
  let currentFeature;
  // get value of clicked button

  // update button colors
  selectAll("button.button").classed("active", false);
  select(this).classed("active", true);
  currentFeature = select(this).attr("value");

  // track current feature
  bubbleChart.currentFeature = currentFeature;
  bubbleChart.drawAxesLabels(currentFeature);
  // update decision boundary for current feature
  bubbleChart.updateDecisionBoundary(currentFeature, true);
});
