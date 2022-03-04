import * as d3 from "d3";
import { realTrees, testData } from "./data";
import { Tree } from "./Tree";

export class CantorChartTrees {
  constructor(opts) {
    this.treeGridContainer = opts.chartContainer;
    this.numData = 29; //29 test data points to show
    this.treeGridDims = d3 // holds buttons
      .select(this.treeGridContainer)
      .node()
      .getBoundingClientRect();
    this.drawTrees();
  }

  drawTrees() {
    const vis = this;
    this.trees = [];
    this.predictions = []; // predictions from 9 trees
    const gridData = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
    ];
    const height = this.treeGridDims.height;
    const width = this.treeGridDims.width;
    const size = (Math.min(height, width) / 3) * 0.9;
    const margin = size;
    vis.xScale = d3
      .scalePoint()
      .domain([0, 1, 2])
      .range([0, width - margin])
      .padding(0.1);
    vis.yScale = d3
      .scalePoint()
      .domain([0, 1, 2])
      .range([0, height - margin])
      .padding(0.1);
    const sel = d3
      .select(vis.treeGridContainer)
      .append("svg")
      .attr("id", "cantorTree-grid")
      .attr("height", height)
      .attr("width", width);

    // create g tags to append to (in grid shape)
    const join = sel
      .selectAll("g.grid")
      .data(gridData)
      .enter()
      .append("g")
      .attr("class", "grid")
      .attr("id", (d, i) => `t${i}`)
      .attr("transform", (d, i) => {
        return `translate(${vis.xScale(d.x)}, ${vis.yScale(d.y)})`;
      });

    // e.g., add trees to each g
    sel.selectAll("g.grid").each(function (d, i) {
      const treeLocation = d3.select(this).append("g");
      const treeClass = new Tree({
        root: realTrees[i],
        treeSize: size / 1.2, //1.2 is to be compatible with Tree class
        strokeWidth: 1.5,
      });
      treeClass.drawBarcodeTree(treeLocation);
      vis.trees.push(treeClass);
    });
    this.paths = [];

    Array.from({ length: 9 }).map((d, i) => {
      this.paths[i] = [];
      this.predictions[i] = [];
      testData.map((d) => vis.paths[i].push(vis.makePath(vis.trees[i], d, i)));
    });
  }
  makePath(tree, dataPoint, treeindex) {
    let path = [];
    let root = tree.root;
    while (root.children != null) {
      let feature = `${root.data.name}`;
      let creteria = dataPoint[feature] <= root.data.value;
      creteria
        ? path.push(`${root.data.id}-0`)
        : path.push(`${root.data.id}-1`);
      root = creteria ? root.children[0] : root.children[1];
      if (root.children == null) {
        this.predictions[treeindex].push(root.data.class == 0 ? "No" : "Yes");
      }
    }
    const currentTree = tree.treeElement;
    let pathString = "";
    path.map((d, i) => {
      pathString =
        pathString +
        " " +
        currentTree
          .select(".tree-link-g")
          .selectAll("path")
          .filter(function () {
            return d3.select(this).attr("order") == path[i];
          })
          .node()
          .getAttribute("d");
    });

    return currentTree
      .select(".tree-link-g")
      .append("path")
      .attr("class", "route")
      .attr("id", `p${dataPoint.id}`)
      .attr("opacity", 0)
      .attr("fill", "none")
      .attr("stroke", "#eaff47")
      .attr("stroke-width", 3)
      .attr("d", pathString);
  }
  // Followed the same method in BarcodeGrid.js
  resizeChart() {
    let vis = this;
    d3.selectAll("svg#cantorTree-grid").remove();

    this.treeGridDims = d3
      .select(this.treeGridContainer)
      .node()
      .getBoundingClientRect();
    this.drawTrees();
  }
  highlightPath(rf, j, pathid) {
    let vis = this;
    if (rf) {
      d3.select(vis.treeGridContainer)
        .selectAll(`#${pathid}`)
        .attr("opacity", 1);
    } else {
      d3.select(vis.treeGridContainer)
        .select(`#t${j}`)
        .selectAll(`#${pathid}`)
        .attr("opacity", 1);
    }
  }
  dehighlightPath() {
    // hide all paths
    d3.select(this.treeGridContainer)
      .selectAll("path.route")
      .attr("opacity", 0);
  }
}
