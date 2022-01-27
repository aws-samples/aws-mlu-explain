import { select, selectAll } from "d3-selection";
import { DecisionTree } from "./DecisionTree";
import { PerturbedDecisionTree } from "./PerturbedDecisionTree";
import { PertubedScatter } from "./PertubedScatter";
import { Scatter } from "./Scatter";
import { dataPerturbed, treeData } from "./data";
import { EntropyBubble } from "./EntropyBubble";
import { InformationGainScatter } from "./InformationGainScatter";
import { EntropyTree } from "./EntropyTree";
import { InformationGainLine } from "./InformationGainLine";

// init decision tree
const decisionTree = new DecisionTree({
  chartContainer: "chart",
  data: treeData,
});

// init scatter
const scatter = new Scatter({
  chartContainer: "chart2",
});

const entropyBubble = new EntropyBubble({
  chartContainer: "entropy-chart",
});

const informationGainLine = new InformationGainLine({
  chartContainer: "entropy-chart-ig",
});

const informationGainScatter = new InformationGainScatter({
  chartContainer: "entropy-chart-scatter",
  linkedChart: informationGainLine,
});

const entropyTree = new EntropyTree({
  chartContainer: "entropy-chart-tree",
  data: treeData,
});

// list of sections for intersection observer to track
const sections = selectAll("section").nodes();

// options for intersection observer
const options = {
  threshold: 0.7,
};

// dict for target events
const target2event = {
  0: () => {},
  1: () => {
    decisionTree.drawDepth(1);
    scatter.drawSplitRectangles(1);
  },

  2: () => {
    decisionTree.drawDepth(2);
    scatter.drawSplitRectangles(2);
  },

  3: () => {
    decisionTree.drawDepth(3);
    scatter.drawSplitRectangles(3);
  },

  4: () => {
    decisionTree.drawDepth(4);
    scatter.drawSplitRectangles(4);
  },

  5: () => {
    decisionTree.drawDepth(4);
  },

  6: () => {
    decisionTree.drawDepth(4);
  },

  7: () => {
    decisionTree.drawDepth(4);
  },
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

sections.forEach((section) => {
  observer.observe(section);
});

// perturbed trees
const numTrees = 8;
for (let i = 0; i < numTrees; i++) {
  const ithTreeData = dataPerturbed[`data_${i}`];
  new PerturbedDecisionTree({
    chartContainer: `tree-${i}`,
    data: ithTreeData["treeData"],
    maxDepth: ithTreeData["maxDepth"],
    sampleNumber: i,
  });
  select(`#tree-${i}`).style("outline", "0px");

  new PertubedScatter({
    chartContainer: `scatter-${i}`,
    data: ithTreeData["scatterData"],
    splitRects: ithTreeData["splitRects"],
  });
}

// generic window resize listener event
const resize = (window.onresize = () => {
  entropyTree.resizeChart();
});
window.addEventListener("resize", resize);
