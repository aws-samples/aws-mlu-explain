import * as d3 from "d3";
import { Bagging } from "./Bagging";
import { RandomForest } from "./RandomForest";
import { Vote } from "./Vote";

// Things that needs to happen when someone enters the article
// ensure refresh goes to top of page
window.onbeforeunload = () => window.scrollTo(0, 0);
window.onload = () => {
  vote.sectionNumber = 0; // If this number is 10, the test data is clickable!
};

const bagging = new Bagging({
  chartContainer: "#chart-rf",
});
const randomForest = new RandomForest({
  chartContainer: "#chart-rf",
  bag0: bagging.bag0,
  bag1: bagging.bag1,
  bag2: bagging.bag2,
});
const vote = new Vote({
  chartContainer: "#chart-rf",
  tree0: randomForest.tree0,
  tree1: randomForest.tree1,
  tree2: randomForest.tree2,
});
vote.hideTestData();
d3.selectAll(".subject").attr("fill-opacity", 0); //D3.annotation sets this to 0.1 and style sheet is unable to overwrite it
// ensure textPath hidden
d3.select("#clickme-text").attr("opacity", 0); // This is to make sure it hides in FireFox browser as well
// list of sections for intersection observer to track
const sectionsRF = d3.selectAll("section.rf-scrolly").nodes();

// reset state function
function resetFeatures() {
  d3.selectAll("g.features").attr("opacity", 0);
  // d3.selectAll("g.annotation-note").attr("opacity", 0);
  d3.selectAll("g.featannotation").attr("opacity", 0);
}

// options for intersection observer
const optionsRF = {
  threshold: 0.7,
};
// dict for target events
const target2eventRF = {
  0: () => {
    vote.sectionNumber = 0; // If this number is 10, the test data is clickable!
    d3.select(".testData").attr("opacity", 0); // hide test dataset
    resetFeatures();
    randomForest.removeFeatures();
    bagging.moveBack();
    vote.hideTestData();
    // ensure textPath hidden
    d3.select("#clickme-text").attr("opacity", 0);
  },
  1: () => {
    vote.sectionNumber = 1; // If this number is 10, the test data is clickable!
    d3.select(".testData").attr("opacity", 0); // hide test dataset
    resetFeatures();
    randomForest.removeFeatures();
    bagging.moveOut();
    vote.hideTestData();
    // ensure textPath hidden
    d3.select("#clickme-text").attr("opacity", 0);
  },
  2: () => {
    vote.sectionNumber = 2; // If this number is 10, the test data is clickable!
    d3.select(".testData").attr("opacity", 0); // hide test dataset
    bagging.removeData();
    randomForest.introduceFeatures();
    bagging.displayAllSamples(); //this is in case someone scrolls too fast, however, can be removed for performance
    randomForest.hideThreeTrees();
    randomForest.firstTreeBuildingReverse();
    vote.hideTestData();
    // ensure textPath hidden
    d3.select("#clickme-text").attr("opacity", 0);
  },
  3: () => {
    vote.sectionNumber = 3; // If this number is 10, the test data is clickable!
    d3.select(".testData").attr("opacity", 0); // hide test dataset
    bagging.removeTrainData();
    randomForest.removeLastTwoSamples();
    randomForest.hideThreeTrees();
    // tree building Step 1-1
    randomForest.firstTreeBuildingStep1_1();
    vote.hideTestData();
    // ensure textPath hidden
    d3.select("#clickme-text").attr("opacity", 0);
  },
  4: () => {
    vote.sectionNumber = 4; // If this number is 10, the test data is clickable!
    d3.select(".testData").attr("opacity", 0); // hide test dataset
    bagging.removeTrainData();
    randomForest.removeLastTwoSamples(); // Make sure Sample 1,2 are hidden
    randomForest.hideThreeTrees();
    // tree building Step 1-2
    randomForest.firstTreeBuildingStep1_2();
    vote.hideTestData();
    // ensure textPath hidden
    d3.select("#clickme-text").attr("opacity", 0);
    // kill legend
  },
  5: () => {
    vote.sectionNumber = 5; // If this number is 10, the test data is clickable!
    d3.select(".testData").attr("opacity", 0); // hide test dataset
    bagging.removeTrainData();
    randomForest.removeLastTwoSamples();
    randomForest.hideThreeTrees();
    // tree building Step 2
    randomForest.firstTreeBuildingStep2();
    vote.hideTestData();
    // ensure textPath hidden
    d3.select("#clickme-text").attr("opacity", 0);
  },
  6: () => {
    vote.sectionNumber = 6; // If this number is 10, the test data is clickable!
    d3.select(".testData").attr("opacity", 0); // hide test dataset
    bagging.removeTrainData(); // Hide the large polygon pack
    randomForest.removeLastTwoSamples(); // Make sure Sample 1,2 are hidden
    randomForest.firstTreeBuildingStep3();
    vote.hideTestData();
    // ensure textPath hidden
    d3.select("#clickme-text").attr("opacity", 0);
  },
  7: () => {
    vote.sectionNumber = 7; // If this number is 10, the test data is clickable!
    bagging.removeTrainData();
    resetFeatures();
    randomForest.removeFeatures();
    randomForest.showThreeTrees(); // Show all three trees
    vote.demoReverse(15, true); //reverse with the icon disappearing
    d3.select(".testData").attr("opacity", 0); // hide test dataset
    d3.select(".rfTree").selectAll(".route").attr("opacity", 0); // Make sure no decision path gets highlighted at this stage.
    // ensure textPath hidden
    d3.select("#clickme-text").attr("opacity", 0);
  },
  8: () => {
    d3.select(".treecircle0").attr("opacity", null);
    d3.select(".treecircle1").attr("opacity", null);
    d3.select(".treecircle2").attr("opacity", null);
    d3.select(".testData").attr("opacity", null); //Test dataset should be shown
    vote.sectionNumber = 8; // If this number is 10, the test data is clickable!
    randomForest.removeLastTwoSamples();
    bagging.removeTrainData();
    randomForest.removeSamples();
    vote.showTestData();
    randomForest.bringFeaturesBack();
    vote.reverseTraverse();
    vote.demoVote(15);
    vote.hideMajorityVote(15);
    // ensure textPath hidden
    d3.select("#clickme-text").attr("opacity", 0);
  },
  9: () => {
    d3.select(".testData").attr("opacity", null); //Test dataset should be shown
    randomForest.removeLastTwoSamples(); // Make sure Sample 1,2 are hidden
    vote.sectionNumber = 9; // If this number is 10, the test data is clickable!
    randomForest.removeLastTwoSamples();
    bagging.removeTrainData();
    vote.reverseTraverse();
    vote.showMajorityVote(15, 0);
    vote.hidePredictions();
    vote.hideDataBag();

    // ensure textPath hidden
    d3.select("#clickme-text").attr("opacity", 0);
  },
  10: () => {
    d3.select(".testData").attr("opacity", null); //Test dataset should be shown
    randomForest.removeLastTwoSamples(); // Make sure Sample 1,2 are hidden
    vote.sectionNumber = 10; // If this number is 10, the test data is clickable!
    bagging.removeTrainData();
    // ensure textPath hidden
    d3.select("#clickme-text").attr("opacity", 1);
    vote.showDataBag();
    vote.hideMajorityVote(15);
    vote.demoReverse(15, false); //reverse it without making it disappear
  },
  11: () => {},
};

let observerRF = new IntersectionObserver(trackScrollRF, optionsRF);

function trackScrollRF(entries) {
  entries.forEach((entry) => {
    // check if visible or not
    if (entry.isIntersecting) {
      // resolve stage in graph
      const entryIndex = entry.target.getAttribute("data-index");
      if (entryIndex in target2eventRF) {
        target2eventRF[entryIndex]();
      }
    }
  });
}
const resize = (window.onresize = () => {
  // Resizing RF scrolly section takes some time. If the user resizes
  // in the RF scrolly section, it will scroll to the top of this section.
  // Otherwise, resize doesn't scroll as other things are quick to resize.
  const rfSection = document.getElementById("random-forest");
  if (
    rfSection.getBoundingClientRect().y < 0 && // this means the reader is past the beginning of the rf scrolly section
    document.getElementById("barcode").getBoundingClientRect().y > 200 // this means the viewer didn't get to the barcode section.
  ) {
    rfSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }
  bagging.resize();
  setTimeout(function () {
    (randomForest.bag0 = bagging.bag0),
      (randomForest.bag1 = bagging.bag1),
      (randomForest.bag2 = bagging.bag2),
      randomForest.resize();
  }, 1500);
  setTimeout(function () {
    vote.resize(randomForest.tree0, randomForest.tree1, randomForest.tree2);
    d3.select("#clickme-text").attr("opacity", 0);
    d3.select(".treecircle0").attr("opacity", 0);
    d3.select(".treecircle1").attr("opacity", 0);
    d3.select(".treecircle2").attr("opacity", 0);
  }, 3000);
});
window.addEventListener("resize", resize);

sectionsRF.forEach((section) => {
  observerRF.observe(section);
});
