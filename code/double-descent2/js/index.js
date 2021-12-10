import { Scatter } from "./Scatter";
import { DeltaChart } from "./DeltaChart";

// some charts require different values: handle for loop here
const yMins = [-0.1, -0.1, -6, -6, -600, -0.1];
const yMaxs = [25.1, 25.1, 25.1, 25.1, 1250, 25.1];
const pts = [[], [], [2.5], [1.25, 2.5, 3.75, 4.5], [1.99, 2.5, 3.75, 4.5], []];

// loop over and draw each of the 7 static charts
[1, 2, 3, 4, 5, 6].map((_, i) => {
  let index = i + 1;
  // draw line for desired index
  let scatterPlot = new Scatter({
    container: `#chart${index}`,
    lineIndex: `line${index}`,
    yMin: yMins[i],
    yMax: yMaxs[i],
    pts: pts[i],
  });
});

// draw animated line chart
const animatedScatterPlot = new Scatter({
  container: `#animation-chart`,
  lineIndex: `line4`,
  yMin: -50.1,
  yMax: 125.1,
  pts: [1.9, 2.5, 3.75, 4.5],
});
// kick off chart animation (will loop infinitely)
animatedScatterPlot.animate();

// draw delta chart
new DeltaChart({
  container: "#delta-chart",
});
