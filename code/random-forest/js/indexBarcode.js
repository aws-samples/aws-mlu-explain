import { BarcodeGrid } from "./BarcodeGrid";
import { CantorChartCircles } from "./CantorChartCircles";
import { CantorChartTrees } from "./CantorChartTrees";

const barcodeGrid = new BarcodeGrid({
  chartContainer: "#barcode-chart",
  maxDepth: 7,
});
const cantorChartTrees = new CantorChartTrees({
  chartContainer: "#cantor-treegrid",
});
const cantorChartCircles = new CantorChartCircles({
  CantorChartTrees: cantorChartTrees,
  chartContainer: "#cantor-scatter",
  nrows: 10,
  ncols: window.innerWidth < 600 ? 10 : 29,
});
const resize = (window.onresize = () => {
  barcodeGrid.resizeChart();
  cantorChartTrees.resizeChart();
  cantorChartCircles.resizeChart();
});
window.addEventListener("resize", resize);
