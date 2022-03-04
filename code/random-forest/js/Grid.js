import * as d3 from "d3";
import { Tree, generateTree } from "./Tree";

export class Grid {
  constructor(opts) {
    this.chartContainer = opts.chartContainer;
    this.nCell = 5;
    this.strokeWidth = 1;
    this.numTrees = this.nCell * this.nCell;
    this.maxDepth = opts.maxDepth;
    this.trees = [];
    this.size = Math.min(
      d3.select(this.chartContainer).node().getBoundingClientRect().height,
      d3.select(this.chartContainer).node().getBoundingClientRect().width
    );
    this.squareSize = this.size / (1.7 * this.nCell);
    this.initializeTrees();
    this.makeGrid();
    this.treesToDisplay = 0;
    this.drawTreesOnGrid(this.treesToDisplay);
  }
  initializeTrees() {
    let treeIndex = 0;
    for (treeIndex = 0; treeIndex < this.numTrees; treeIndex++) {
      this.trees.push(
        new Tree({
          root: generateTree(0, this.maxDepth),
          treeSize: this.squareSize * 1.2,
          strokeWidth: this.strokeWidth,
        })
      );
    }
  }
  makeGrid() {
    let sel = d3
      .select(this.chartContainer)
      .append("svg")
      .attr("class", "grid")
      .attr("width", this.size)
      .attr("height", this.size);

    const scale = d3
      .scaleLinear()
      .domain([0, this.nCell - 1])
      .range([0, this.size]);

    const join = sel.selectAll("circle").data(d3.range(this.numTrees));

    join
      .enter()
      .append("g")
      .attr("class", (d, i) => `grid-tree-${i}`)
      .attr("transform", (d, i) => {
        const nx = i % this.nCell;
        const n = Math.floor(i / this.nCell);
        return `translate(${(this.size / this.nCell) * nx},${
          (this.size / this.nCell) * n + this.size * 0.02
        })`;
      })
      .merge(join);
  }

  drawTreesOnGrid(numTreeToDisplay) {
    this.treesToDisplay = numTreeToDisplay;
    let sliceTrees = this.trees.slice(0, numTreeToDisplay);
    let sel = d3.select(this.chartContainer);
    let j = 0;
    for (j = numTreeToDisplay; j < this.numTrees; j++) {
      sliceTrees.push(null);
    }
    sel
      .selectAll("g")
      .data(sliceTrees)
      .each((d, i) => {
        sel.select(`g.grid-tree-${i}`).selectAll("g").remove();
        if (d != null) d.drawTree(sel.select(`g.grid-tree-${i}`));
      });
  }

  resizeChart() {
    // Below is computationally inefficient but creates a chart that positions correctly upon resizing.
    let vis = this;
    this.size = Math.min(
      d3.select(this.chartContainer).node().getBoundingClientRect().height,
      d3.select(this.chartContainer).node().getBoundingClientRect().width
    );
    this.squareSize = this.size / (1.7 * this.nCell);
    d3.select(vis.chartContainer).selectAll("svg.grid").remove();
    this.makeGrid();
    let i = 0;
    for (i = 0; i < this.numTrees; i++) {
      this.trees[i].treeSize = this.squareSize * 1.2;
      this.trees[i].d3Tree.size([this.squareSize * 1.2, this.squareSize * 1.2]);
      this.trees[i].root = d3.hierarchy(this.trees[i].root, (d) => d.children);
      this.trees[i].treeData = this.trees[i].d3Tree(this.trees[i].root);
    }
    this.drawTreesOnGrid(this.treesToDisplay);
  }
}
