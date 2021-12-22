import { select, selectAll } from "d3-selection";

// list of sections for intersection observer to track
const sectionsCenter = selectAll("section.Center-scroll").nodes();
console.log("sections c", sectionsCenter);

// options for intersection observer
const optionsCenter = {
  threshold: 0.7,
};

// dict for target events
const target2eventCenter = {
  0: () => {
    console.log("center step", 0);
    select("#svg-center-scroll").style("background", "skyblue");
  },
  1: () => {
    console.log("center step", 1);
    select("#svg-center-scroll").style("background", "coral");
  },

  2: () => {
    console.log("center step", 2);
    select("#svg-center-scroll").style("background", "teal");
  },
};

let observerCenter = new IntersectionObserver(trackScrollCenter, optionsCenter);

function trackScrollCenter(entries) {
  entries.forEach((entry) => {
    // check if visible or not
    if (entry.isIntersecting) {
      // resolve stage in graph
      const entryIndex = entry.target.getAttribute("data-index");
      if (entryIndex in target2eventCenter) {
        target2eventCenter[entryIndex]();
      }
    }
  });
}

sectionsCenter.forEach((section) => {
  observerCenter.observe(section);
});
