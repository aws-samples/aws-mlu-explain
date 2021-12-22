import { select, selectAll } from "d3-selection";

// list of sections for intersection observer to track
const sections = selectAll("section.side-scroll").nodes();
console.log("sections", sections);

// options for intersection observer
const options = {
  threshold: 0.7,
};

// dict for target events
const target2event = {
  0: () => {
    console.log("side step", 0);
    select("#svg-side-scroll").style("background", "skyblue");
  },
  1: () => {
    console.log("side step", 1);
    select("#svg-side-scroll").style("background", "coral");
  },

  2: () => {
    console.log("side step", 2);
    select("#svg-side-scroll").style("background", "teal");
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
