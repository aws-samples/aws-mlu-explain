import * as d3 from "d3";
import { barcodeData, realTrees } from "./data";
import { Tree } from "./Tree";

export class BarcodeGrid {
  constructor(opts) {
    this.chartContainer = opts.chartContainer;
    this.chartDims = d3
      .select(this.chartContainer)
      .node()
      .getBoundingClientRect();

    this.data = barcodeData;
    this.rfData = barcodeData[0];
    this.treeData = barcodeData.slice(1);

    // determine dimensions for charts (responsive)
    this.setDimensions();

    this.svg = d3
      .select(this.chartContainer)
      .append("svg")
      .attr("width", this.dimensions.width)
      .attr("height", this.dimensions.height)
      .attr("id", "barcode-grid");
    // this.drawBarcode();
    window.innerWidth < 768 ? this.drawBarcodeMobile() : this.drawBarcode();
    window.innerWidth < 768
      ? this.drawCirclePackMobile()
      : this.drawCirclePack();
    window.innerWidth < 768 ? this.drawBezierMobile() : this.drawBezier();
    window.innerWidth < 768 ? this.addTicksMobile() : this.addTicks();
    this.addInteractivity();
  }

  resizeChart() {
    d3.select("#barcode-grid").remove();
    this.chartDims = d3
      .select(this.chartContainer)
      .node()
      .getBoundingClientRect();

    // determine dimensions for charts (responsive)
    this.setDimensions();

    this.svg = d3
      .select(this.chartContainer)
      .append("svg")
      .attr("width", this.dimensions.width)
      .attr("height", this.dimensions.height)
      .attr("id", "barcode-grid");
    // this.drawBarcode();
    window.innerWidth < 768 ? this.drawBarcodeMobile() : this.drawBarcode();
    window.innerWidth < 768
      ? this.drawCirclePackMobile()
      : this.drawCirclePack();
    window.innerWidth < 768 ? this.drawBezierMobile() : this.drawBezier();
    window.innerWidth < 768 ? this.addTicksMobile() : this.addTicks();
    this.addInteractivity();
  }

  setDimensions() {
    if (window.innerWidth < 768) {
      this.dimensions = {
        width: this.chartDims.width,
        height: window.innerHeight * 1,
        treeMargin: {
          top: 40,
          bottom: 40,
          right: 10,
          left: 10,
        },
        barcodeMargin: {
          top: this.chartDims.width * 0.01,
          bottom: this.chartDims.width * 0.01,
          right: this.chartDims.width * 0.065,
          left: 10,
        },
      };
      this.chartGap = 1;
      this.width = this.dimensions.width;
      this.height = this.dimensions.height;
      this.treeHeight =
        this.dimensions.height * 0.6 -
        this.dimensions.treeMargin.top -
        this.dimensions.treeMargin.bottom;

      this.barcodeHeight =
        this.dimensions.height * 0.35 -
        this.dimensions.barcodeMargin.top -
        this.dimensions.barcodeMargin.bottom;

      this.barcodeWidth =
        this.dimensions.width -
        this.dimensions.barcodeMargin.right -
        this.dimensions.barcodeMargin.left * 2;
      this.treeWidth = this.barcodeWidth;

      this.barPadding = 0.001;
      this.packPadding = 0;
      this.dotRadius = 16;
      this.rectHover = 3;

      this.treeDotRadius = 5;
      this.dotYOffset = -this.dotRadius / 3.5;
    } else {
      this.dimensions = {
        width: this.chartDims.width,
        height: this.chartDims.height * 0.95,
        treeMargin: {
          top: this.chartDims.height * 0.1,
          bottom: 40,
          right: 10,
          left: 10,
        },
        barcodeMargin: {
          top: this.chartDims.width * 0.06,
          bottom: this.chartDims.width * 0.01,
          right: this.chartDims.width * 0.065,
          left: this.chartDims.width * 0.065,
        },
      };

      this.chartGap = 20;

      this.width = this.dimensions.width;
      this.height = this.dimensions.height;
      this.treeHeight =
        this.dimensions.height -
        this.dimensions.treeMargin.top -
        this.dimensions.treeMargin.bottom;

      this.barcodeHeight =
        this.dimensions.height -
        this.dimensions.barcodeMargin.top -
        this.dimensions.barcodeMargin.bottom;

      this.barcodeWidth =
        this.dimensions.width / 2 -
        this.dimensions.barcodeMargin.right -
        this.dimensions.barcodeMargin.left * 2;

      this.treeWidth = this.barcodeWidth * 1.75;

      this.barPadding = 0.5;
      this.packPadding = 0;
      this.dotRadius = 18;
      this.rectHover = 3;

      this.treeDotRadius = 5;
      this.dotYOffset = -this.dotRadius / 3.5;
    }
  }

  drawCirclePack() {
    const viz = this;
    // draw grid using scales
    // define container g
    this.treeGridG = this.svg
      .append("g")
      .attr("id", "tree-grid-g")
      .attr(
        "transform",
        `translate(${this.dimensions.treeMargin.left}, ${this.dimensions.treeMargin.top})`
      );

    //
    // Cirlce Pack
    //
    // 1. Make Flat Hierarchy
    const _root = { children: this.treeData }; // remove the first value from the dataset - which is an aggregate we don't need
    const flatNodeHeirarchy = d3.hierarchy(_root).sum((d) => 1);

    let pack = d3
      .pack()
      .size([this.treeWidth, this.treeHeight])
      .padding(this.packPadding);
    this.packedData = pack(flatNodeHeirarchy);
    this.enclosingCircle = d3.packEnclose(this.packedData);

    this.treeGridG
      .selectAll("circle.outer")
      .data([this.enclosingCircle])
      .join("circle")
      .attr("class", "outer")
      .attr("r", (d) => d.r)
      .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`)
      .attr("fill", "#f4e9d4")
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .style("pointer-events", "none")
      .style("stroke-dasharray", "4")
      .attr("stroke-opacity", 0.4);

    // add text path
    this.treeGridG
      .selectAll("g.enclosing-arc")
      .data([this.enclosingCircle])
      .enter()
      .append("g")
      .attr("class", "enclosing-arc")
      .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`)
      .append("path")
      .attr("class", "enclosing-arc-label")
      .attr("id", "enclosing-path-rf")
      .attr("d", (d, i) => `M ${0 - d.r},0 A ${d.r},${d.r} 1, 1,1 ${0 + d.r} 0`)
      .attr("stroke-width", 3)
      .attr("fill", "none")
      .style("pointer-events", "none")
      .raise();

    this.treeGridG
      .selectAll("text#rf-text")
      .data([this.enclosingCircle])
      .enter()
      .append("text")
      .attr("id", "rf-text")
      .attr("dy", -3)
      .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`)
      .append("textPath")
      .attr("startOffset", "50%")
      .attr("text-anchor", "middle")
      .attr("xlink:href", (d, i) => `#enclosing-path-rf`)
      .text((d, i) => "RANDOM FOREST");

    const leaf = this.treeGridG
      .selectAll("g.circlepack-leaf")
      .data(this.packedData.leaves())
      .enter()
      .append("g")
      .attr("class", "circlepack-leaf")
      .attr("tree-index", (d, i) => i)
      .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`)
      .append("path")
      .attr("class", "tree-arc-label")
      .attr("id", (d, i) => "tree-arc-" + i)
      // use arc-path from here: https://www.visualcinnamon.com/2015/09/placing-text-on-arcs/
      // M start-x, start-y A radius-x, radius-y, x-axis-rotation,
      // large-arc-flag, sweep-flag, end-x, end-y
      .attr("d", (d, i) => `M ${0 - d.r},0 A ${d.r},${d.r} 1, 1,1 ${0 + d.r} 0`)
      .attr("stroke-width", 3)
      .attr("fill", "rgba(1, .4, .3, .1")
      .raise();

    this.treeGridG
      .selectAll("text.tree-text")
      .data(this.packedData.leaves())
      .enter()
      .append("text")
      .attr("class", "tree-text")
      .attr("id", (d, i) => `tree-text-${i}`)
      .attr("dy", -3)
      .attr("opacity", 0)
      .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`)
      .append("textPath")
      .attr("startOffset", "10%")
      .attr("xlink:href", (d, i) => `#tree-arc-${i}`)
      .text((d, i) => `Decision Tree ${i + 1}`);

    //
    // end circle pack
    //
  }

  drawCirclePackMobile() {
    const viz = this;
    // draw grid using scales
    // define container g
    this.treeGridG = this.svg
      .append("g")
      .attr("id", "tree-grid-g")
      .attr(
        "transform",
        `translate(${this.dimensions.treeMargin.left}, ${this.dimensions.treeMargin.top})`
      );

    //
    // Cirlce Pack
    //
    // 1. Make Flat Hierarchy
    const _root = { children: this.treeData }; // remove the first value from the dataset - which is an aggregate we don't need
    const flatNodeHeirarchy = d3.hierarchy(_root).sum((d) => 1);

    let pack = d3
      .pack()
      .size([this.treeWidth, this.treeHeight])
      .padding(this.packPadding);
    this.packedData = pack(flatNodeHeirarchy);
    this.enclosingCircle = d3.packEnclose(this.packedData);

    this.treeGridG
      .selectAll("circle.outer")
      .data([this.enclosingCircle])
      .join("circle")
      .attr("class", "outer")
      .attr("r", (d) => d.r)
      .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`)
      .attr("fill", "#f4e9d4")
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .style("pointer-events", "none")
      .style("stroke-dasharray", "4")
      .attr("stroke-opacity", 0.4);

    // add text path
    this.treeGridG
      .selectAll("g.enclosing-arc")
      .data([this.enclosingCircle])
      .enter()
      .append("g")
      .attr("class", "enclosing-arc")
      .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`)
      .append("path")
      .attr("class", "enclosing-arc-label")
      .attr("id", "enclosing-path-rf")
      .attr("d", (d, i) => `M ${0 - d.r},0 A ${d.r},${d.r} 1, 1,1 ${0 + d.r} 0`)
      .attr("stroke-width", 3)
      .attr("fill", "none")
      .style("pointer-events", "none")
      .raise();

    this.treeGridG
      .selectAll("text#rf-text")
      .data([this.enclosingCircle])
      .enter()
      .append("text")
      .attr("id", "rf-text")
      .attr("dy", -3)
      .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`)
      .append("textPath")
      .attr("startOffset", "50%")
      .attr("text-anchor", "middle")
      .attr("xlink:href", (d, i) => `#enclosing-path-rf`)
      .text((d, i) => "RANDOM FOREST");

    const leaf = this.treeGridG
      .selectAll("g.circlepack-leaf")
      .data(this.packedData.leaves())
      .enter()
      .append("g")
      .attr("class", "circlepack-leaf")
      .attr("tree-index", (d, i) => i)
      .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`)
      .append("path")
      .attr("class", "tree-arc-label")
      .attr("id", (d, i) => "tree-arc-" + i)
      // use arc-path from here: https://www.visualcinnamon.com/2015/09/placing-text-on-arcs/
      // M start-x, start-y A radius-x, radius-y, x-axis-rotation,
      // large-arc-flag, sweep-flag, end-x, end-y
      .attr("d", (d, i) => `M ${0 - d.r},0 A ${d.r},${d.r} 1, 1,1 ${0 + d.r} 0`)
      .attr("stroke-width", 3)
      .attr("fill", "rgba(1, .4, .3, .1")
      .raise();

    this.treeGridG
      .selectAll("text.tree-text")
      .data(this.packedData.leaves())
      .enter()
      .append("text")
      .attr("class", "tree-text")
      .attr("id", (d, i) => `tree-text-${i}`)
      .attr("dy", -3)
      .attr("opacity", 0)
      .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`)
      .append("textPath")
      .attr("startOffset", "10%")
      .attr("xlink:href", (d, i) => `#tree-arc-${i}`)
      .text((d, i) => `Decision Tree ${i + 1}`);

    //
    // end circle pack
    //
  }

  drawBezier() {
    const viz = this;
    // manually draw connections between tree and associated dots
    // loop through each grid point
    // each tree should only map to one barcode data, so subset barcode data

    const featNames = Object.keys(barcodeData[0]);

    // add rf paths
    featNames.map((feat, ii) => {
      const currFeature = feat; //"accuracy";
      const currentTree = this.rfData;

      const x0 = viz.enclosingCircle.x + 1;
      const y0 = viz.enclosingCircle.y + 1;
      const x =
        viz.xScale(currentTree[currFeature]) +
        this.treeWidth +
        this.chartGap -
        this.dimensions.treeMargin.left +
        this.dimensions.barcodeMargin.left / 2;
      const y =
        viz.yScale(currFeature) +
        (-this.dimensions.treeMargin.top + this.dimensions.barcodeMargin.top) +
        this.dotRadius / 2;

      const cpx1 = Math.abs(x - x0) / 3.0 + x0;
      const cpy1 = 1.2 * (y - y0) + y0;
      const cpx2 = (Math.abs(x - x0) / 3.0) * 2 + x0;
      const cpy2 = 1.3 * (y - y0) + y0;
      const path = d3.path();
      // start at initial points
      path.moveTo(x0, y0);
      // draw bezier curve
      path.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x, y);
      // add bezier curve path to dom
      this.treeGridG
        .append("path")
        .attr("class", `path-tree-rf`)
        .attr("d", path)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("opacity", 0.5)
        .style("pointer-events", "none")
        .lower();
    });

    // add trees
    this.treeGridG.selectAll("g.circlepack-leaf").each(function (d, i) {
      const cell = d3.select(this).append("g");

      // add big circle
      cell
        .append("circle")
        .attr("class", "big-circle")
        .attr("r", (d) => d.r)
        .attr("fill", "#f4e9d4")
        .attr("stroke", "red")
        .style("stroke-dasharray", "4")
        .attr("stroke-opacity", 0.4)
        .attr("fill-opacity", 1);

      //
      // Add trees from the real data
      //
      const size = cell.select(".big-circle").attr("r"); //Know the size of the circle.
      //Make a new Tree class object
      const treeClass = new Tree({
        root: realTrees[i],
        treeSize: (size * 2) / 1.41 / 1.2, //1.41 is sqrt 2 to fix encolosed rectangle problem, /1.2 is to be compatible with Tree class
        strokeWidth: 1.5,
      });
      // Then add an element to the hold tree
      const treeLocation = cell
        .append("g")
        .attr("class", "tree")
        .attr("transform", `translate(-${size / 1.41},-${size / 1.41})`);
      //This draws trees for the barcode chart.
      treeClass.drawBarcodeTree(treeLocation);
    });

    // for each tree, loop through all features and plot
    this.packedData.leaves().map((gridPoint, i) => {
      featNames.map((feat, ii) => {
        const currFeature = feat; //"accuracy";
        const currentTree = viz.treeData[i];

        const x0 = gridPoint.x + 1;
        const y0 = gridPoint.y + 1;

        const x =
          viz.xScale(currentTree[currFeature]) +
          this.treeWidth +
          this.chartGap -
          this.dimensions.treeMargin.left +
          this.dimensions.barcodeMargin.left / 2;
        const y =
          viz.yScale(currFeature) +
          (-this.dimensions.treeMargin.top +
            this.dimensions.barcodeMargin.top) +
          this.dotRadius / 2;

        const cpx1 = Math.abs(x - x0) / 3.0 + x0;
        const cpy1 =
          i == 1 || i == 3 ? 0.5 * (y - y0) + y0 : 1.3 * (y - y0) + y0;
        const cpx2 = (Math.abs(x - x0) / 3.0) * 2 + x0;
        const cpy2 = 1.3 * (y - y0) + y0;
        const path = d3.path();
        // start at initial points
        path.moveTo(x0, y0);
        // draw bezier curve
        path.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x, y);
        // add bezier curve path to dom
        this.treeGridG
          .append("path")
          .attr("class", `path-tree-${i}`)
          .attr("d", path)
          .attr("fill", "none")
          .attr("stroke", "black")
          .attr("stroke-width", 2)
          .attr("opacity", 0.0)
          .style("pointer-events", "none");
      });
    });
  }

  drawBezierMobile() {
    const viz = this;
    // manually draw connections between tree and associated dots
    // loop through each grid point
    // each tree should only map to one barcode data, so subset barcode data

    const featNames = Object.keys(barcodeData[0]);

    // add rf paths
    featNames.map((feat, ii) => {
      const currFeature = feat; //"accuracy";
      const currentTree = this.rfData;

      const x0 = viz.enclosingCircle.x + 1;
      const y0 = viz.enclosingCircle.y + 1;
      const x =
        viz.xScale(currentTree[currFeature]) +
        this.treeWidth +
        this.chartGap -
        this.dimensions.treeMargin.left +
        this.dimensions.barcodeMargin.left / 2;
      const y =
        viz.yScale(currFeature) +
        (-this.dimensions.treeMargin.top + this.dimensions.barcodeMargin.top) +
        this.dotRadius / 2;

      const cpx1 = Math.abs(x - x0) / 3.0 + x0;
      const cpy1 = 1.2 * (y - y0) + y0;
      const cpx2 = (Math.abs(x - x0) / 3.0) * 2 + x0;
      const cpy2 = 1.3 * (y - y0) + y0;
      const path = d3.path();
    });

    // add trees
    this.treeGridG.selectAll("g.circlepack-leaf").each(function (d, i) {
      const cell = d3.select(this).append("g");

      // add big circle
      cell
        .append("circle")
        .attr("class", "big-circle")
        .attr("r", (d) => d.r)
        .attr("fill", "#f4e9d4")
        .attr("stroke", "red")
        .style("stroke-dasharray", "4")
        .attr("stroke-opacity", 0.4)
        .attr("fill-opacity", 1);

      //
      // Add trees from the real data
      //
      const size = cell.select(".big-circle").attr("r"); //Know the size of the circle.
      //Make a new Tree class object
      const treeClass = new Tree({
        root: realTrees[i],
        treeSize: (size * 2) / 1.41 / 1.2, //1.41 is sqrt 2 to fix encolosed rectangle problem, /1.2 is to be compatible with Tree class
        strokeWidth: 1.5,
      });
      // Then add an element to the hold tree
      const treeLocation = cell
        .append("g")
        .attr("class", "tree")
        .attr("transform", `translate(-${size / 1.41},-${size / 1.41})`);
      //This draws trees for the barcode chart.
      treeClass.drawBarcodeTree(treeLocation);
    });

    // for each tree, loop through all features and plot
    this.packedData.leaves().map((gridPoint, i) => {
      featNames.map((feat, ii) => {
        const currFeature = feat; //"accuracy";
        const currentTree = viz.treeData[i];

        const x0 = gridPoint.x + 1;
        const y0 = gridPoint.y + 1;

        const x =
          viz.xScale(currentTree[currFeature]) +
          this.treeWidth +
          this.chartGap -
          this.dimensions.treeMargin.left +
          this.dimensions.barcodeMargin.left / 2;
        const y =
          viz.yScale(currFeature) +
          (-this.dimensions.treeMargin.top +
            this.dimensions.barcodeMargin.top) +
          this.dotRadius / 2;

        const cpx1 = Math.abs(x - x0) / 3.0 + x0;
        const cpy1 =
          i == 1 || i == 3 ? 0.5 * (y - y0) + y0 : 1.3 * (y - y0) + y0;
        const cpx2 = (Math.abs(x - x0) / 3.0) * 2 + x0;
        const cpy2 = 1.3 * (y - y0) + y0;
        const path = d3.path();
      });
    });
  }

  addInteractivity() {
    const viz = this;
    d3.selectAll("g.circlepack-leaf").on("mouseover", function (d, i) {
      // log selected element's index
      const treeIndex = d3.select(this).attr("tree-index");
      // add stroke around selected circle
      d3.select(this).select("circle").attr("stroke-width", 2);
      // raise current circle
      d3.select(this).raise();
      // display tree's title
      d3.select(`#tree-text-${treeIndex}`).attr("opacity", 1).raise();
      // hide random forest title
      d3.select("#rf-text").style("opacity", 0);
      d3.selectAll(".rf-circle-text").style("opacity", 0);
      // make outer enclosing circle transparent
      d3.select("circle.outer").attr("fill-opacity", 0);
      // show paths to desired metric dots
      d3.selectAll(`path.path-tree-${treeIndex}`).attr("opacity", 0.5);
      // make desired metric dots larger
      d3.selectAll(`rect[tree-index='${treeIndex}']`)
        .transition()
        .attr("opacity", 1)
        .attr("width", viz.dotRadius / 2 + viz.rectHover)
        .attr("height", viz.dotRadius + viz.rectHover)
        .attr("stroke", "#f4e9d4")
        .attr("stroke-width", 2);

      d3.selectAll(`rect[tree-index='${treeIndex}']`).each((d) => {
        d3.select(this.parentNode).raise();
      });

      d3.selectAll(`text[tree-index='${treeIndex}']`).style("opacity", 1);
      d3.selectAll("text.bar-circle-text")
        .filter(function () {
          return d3.select(this).attr("tree-index") != treeIndex;
        })
        .style("opacity", 0);
      // shrink undesired metric dots
      d3.selectAll("rect.bar-circle")
        .filter(function () {
          return d3.select(this).attr("tree-index") != treeIndex;
        })
        .transition()
        .attr("opacity", 0.35)
        .attr("stroke-width", "0")
        .attr("width", viz.dotRadius / 2)
        .attr("height", viz.dotRadius);

      // hide other packed trees
      d3.selectAll("g.circlepack-leaf")
        .filter(function () {
          return d3.select(this).attr("tree-index") != treeIndex;
        })
        .attr("opacity", 0.3)
        .lower();
      // make rf circle normal
      d3.selectAll("rect.bar-circle-rf")
        .transition()
        .attr("opacity", 0.3)
        .attr("stroke-width", "0")
        .attr("width", viz.dotRadius / 2)
        .attr("height", viz.dotRadius);

      // hide paths from random forest to metric dots
      d3.selectAll("path.path-tree-rf").attr("opacity", 0);
      // reduce size of outer random forest circle stroke
      d3.select("circle.outer").attr("stroke-width", 1);
    });
    d3.selectAll("g.circlepack-leaf").on("mouseout", function (d, i) {
      const treeIndex = d3.select(this).attr("tree-index");
      // hide all decision tree paths to metric dots
      d3.selectAll(`path.path-tree-${treeIndex}`).attr("opacity", 0);

      // hide all decision treetree texts
      d3.selectAll(".tree-text").attr("opacity", 0);

      // unhide random forest text
      d3.select("#rf-text").style("opacity", 1);
      d3.selectAll(".rf-circle-text").style("opacity", 1);

      // hide all DT text
      d3.selectAll(".bar-circle-text").style("opacity", 0);

      // size all metric dots back to normal
      d3.selectAll(`rect.bar-circle`)
        .transition()
        .attr("width", viz.dotRadius / 2)
        .attr("height", viz.dotRadius)
        .attr("opacity", 0.7)
        .attr("stroke", "#f4e9d4")
        .attr("stroke-width", 2);

      // unhide all packed decision trees
      d3.selectAll("g.circlepack-leaf").attr("opacity", 1).raise();
      // show larger rf tree circle
      d3.selectAll("rect.bar-circle-rf")
        .transition()
        .attr("opacity", 1)
        .attr("stroke", "#f4e9d4")
        .attr("stroke-width", 2)
        .attr("width", viz.dotRadius / 2 + viz.rectHover)
        .attr("height", viz.dotRadius + viz.rectHover);
      // show larger rf paths to metric dots
      d3.selectAll("path.path-tree-rf").attr("opacity", 0.5).lower();

      // make rf stroke-width larger
      d3.select("circle.outer").attr("stroke-width", 3);
      // resize all decision tree packed circle strokes to normal
      d3.selectAll("g.circlepack-leaf")
        .select("circle")
        .attr("stroke-width", 1);
      // make outer circle not transparent to hide paths
      d3.select("circle.outer").attr("fill-opacity", 1);
    });
  }
  drawBarcode() {
    // define mappings for color and featur names
    const feature2Color = {
      accuracy: "#232f3e",
      feature1: "#e99f46",
      feature2: "#005da3",
      feature3: "#ce3874",
      feature4: "#feeca9",
    };
    const feature2Name = {
      accuracy: "Accuracy",
      feature1: "Number of Sides",
      feature2: "Number of Colors Used",
      feature3: "Text or Symbol",
      feature4: "Size",
    };

    // define container g
    this.barcodeG = this.svg
      .append("g")
      .attr("id", "barcode-g")
      .attr(
        "transform",
        `translate(${
          this.chartGap +
          this.dimensions.barcodeMargin.left +
          this.dimensions.width / 2
        }, ${this.dimensions.barcodeMargin.top})`
      );

    // define scales
    this.xScale = d3.scaleLinear().domain([0, 1]).range([0, this.barcodeWidth]);

    this.yScale = d3
      .scaleBand()
      .domain(Object.keys(this.data[0]))
      .range([0, this.barcodeHeight])
      .padding(this.barPadding);

    // draw initial rects
    this.bars = this.barcodeG
      .selectAll("g.barcode-bar-g")
      .data(Object.keys(this.data[0]))
      .join("g")
      .attr("id", (d) => `bar-${d}`);

    this.rects = this.bars
      .append("rect")
      .classed("outlined", true)
      .attr("x", 0)
      .attr("y", (d) => this.yScale(d))
      .attr("height", 10)
      .attr("width", this.xScale(1))
      .attr("stroke", "black")
      .attr("fill", (d) => feature2Color[d]);

    this.barText = this.bars
      .append("text")
      .attr("class", "bar-text")
      .text((d) => feature2Name[d])
      .attr("x", this.xScale(0))
      .attr("y", (d) => this.yScale(d) - this.yScale.bandwidth() * 0.6);
  }

  drawBarcodeMobile() {
    // reset dimensions for mobile

    // define mappings for color and featur names
    const feature2Color = {
      accuracy: "#232f3e",
      feature1: "#e99f46",
      feature2: "#005da3",
      feature3: "#ce3874",
      feature4: "#feeca9",
    };
    const feature2Name = {
      accuracy: "Accuracy",
      feature1: "Number of Sides",
      feature2: "Number of Colors Used",
      feature3: "Text or Symbol",
      feature4: "Size",
    };

    // define container g
    this.barcodeG = this.svg
      .append("g")
      .attr("id", "barcode-g")
      .attr(
        "transform",
        `translate(${this.dimensions.barcodeMargin.left},
           ${
             //  this.dimensions.barcodeMargin.top +
             this.treeHeight +
             this.chartGap +
             this.dimensions.treeMargin.top +
             this.dimensions.treeMargin.bottom
           })`
      );

    // define scales
    this.xScale = d3.scaleLinear().domain([0, 1]).range([0, this.barcodeWidth]);
    // .nice();

    this.yScale = d3
      .scaleBand()
      .domain(Object.keys(this.data[0]))
      .range([
        0,
        this.barcodeHeight +
          this.dimensions.barcodeMargin.bottom +
          this.dimensions.treeMargin.top,
      ])
      .padding(this.barPadding);

    // draw initial rects
    this.bars = this.barcodeG
      .selectAll("g.barcode-bar-g")
      .data(Object.keys(this.data[0]))
      .join("g")
      .attr("id", (d) => `bar-${d}`);

    this.rects = this.bars
      .append("rect")
      .classed("outlined", true)
      .attr("x", 0)
      .attr("y", (d) => this.yScale(d))
      .attr("height", 10)
      .attr("width", this.xScale(1))
      .attr("stroke", "black")
      .attr("fill", (d) => feature2Color[d]);

    this.barText = this.bars
      .append("text")
      .attr("class", "bar-text")
      .text((d) => feature2Name[d])
      .attr("x", this.xScale(0))
      .attr("y", (d) => this.yScale(d) - this.yScale.bandwidth() * 0.2);
  }

  addTicksMobile() {
    const viz = this;
    // const feat = `bar-${feature}`;

    // loop through the features of each tree and draw a dot
    this.treeData.forEach((tree, i) => {
      // loop through each key, value in tree obj
      for (const [feature, value] of Object.entries(tree)) {
        // identify bar to draw circle on
        const feat = `bar-${feature}`;

        const valueG = d3
          .selectAll(`#${feat}`)
          .append("g")
          .attr("class", "bar-g-rf")
          .attr(
            "transform",
            `translate(${this.xScale(value)}, ${this.yScale(feature)})`
          );

        // draw circle for given feature value
        valueG
          .append("rect")
          .attr("class", "bar-circle")
          .attr("tree-index", i)
          .attr("fill", "black")
          .attr("stroke", "#f4e9d4")
          .attr("stroke-width", 2)
          .attr("width", viz.dotRadius / 2)
          .attr("height", viz.dotRadius)
          .attr("opacity", 1)
          .attr("y", this.dotYOffset);

        // draw text above circles
        valueG
          .append("text")
          .attr("class", "bar-circle-text")
          .attr("tree-index", i)
          .attr("dx", 0)
          .attr("dy", this.dotRadius + viz.rectHover * 4) // mobile
          .attr("text-anchor", "left")
          .text(d3.format(".0%")(value))
          .style("opacity", 0);
      }
    });
    // loop through the features of each tree and draw a dot alongside its value
    [this.rfData].forEach((tree, i) => {
      // loop through each key, value in tree obj
      for (const [feature, value] of Object.entries(tree)) {
        // identify bar to draw circle on
        const feat = `bar-${feature}`;

        const valueG = d3
          .selectAll(`#${feat}`)
          .append("g")
          .attr("class", "bar-g-rf")
          .attr(
            "transform",
            `translate(${this.xScale(value)}, ${this.yScale(feature)})`
          );

        // draw circle for given feature value
        valueG
          .append("rect")
          .attr("class", "bar-circle-rf")
          .attr("fill", "red")
          .attr("stroke", "#f4e9d4")
          .attr("stroke-width", 2)
          .attr("width", viz.dotRadius / 2 + viz.rectHover)
          .attr("height", viz.dotRadius + viz.rectHover)
          .attr("opacity", 1)
          .attr("y", this.dotYOffset);

        // draw text above circles
        valueG
          .append("text")
          .attr("class", "rf-circle-text")
          .attr("dx", 0)
          .attr("dy", this.dotRadius + viz.rectHover * 4) // mobile
          .attr("text-anchor", "left")
          .text(d3.format(".0%")(value));
      }
    });
  }

  // addTicks(feature, value) {
  addTicks() {
    const viz = this;
    // const feat = `bar-${feature}`;

    // loop through the features of each tree and draw a dot
    this.treeData.forEach((tree, i) => {
      // loop through each key, value in tree obj
      for (const [feature, value] of Object.entries(tree)) {
        // identify bar to draw circle on
        const feat = `bar-${feature}`;

        const valueG = d3
          .selectAll(`#${feat}`)
          .append("g")
          .attr("class", "bar-g-rf")
          .attr(
            "transform",
            `translate(${this.xScale(value)}, ${this.yScale(feature)})`
          );

        // draw circle for given feature value
        valueG
          .append("rect")
          .attr("class", "bar-circle")
          .attr("tree-index", i)
          .attr("fill", "black")
          .attr("stroke", "#f4e9d4")
          .attr("stroke-width", 2)
          .attr("width", viz.dotRadius / 2)
          .attr("height", viz.dotRadius)
          .attr("opacity", 1)
          .attr("y", this.dotYOffset);

        // draw text above circles
        valueG
          .append("text")
          .attr("class", "bar-circle-text")
          .attr("tree-index", i)
          .attr("dx", 0)
          .attr("dy", -this.dotRadius / 1.8) // mobile
          .attr("text-anchor", "left")
          .text(d3.format(".0%")(value))
          .style("opacity", 0);
      }
    });
    // loop through the features of each tree and draw a dot alongside its value
    [this.rfData].forEach((tree, i) => {
      // loop through each key, value in tree obj
      for (const [feature, value] of Object.entries(tree)) {
        // identify bar to draw circle on
        const feat = `bar-${feature}`;

        const valueG = d3
          .selectAll(`#${feat}`)
          .append("g")
          .attr("class", "bar-g-rf")
          .attr(
            "transform",
            `translate(${this.xScale(value)}, ${this.yScale(feature)})`
          );

        // draw circle for given feature value
        valueG
          .append("rect")
          .attr("class", "bar-circle-rf")
          .attr("fill", "red")
          .attr("stroke", "#f4e9d4")
          .attr("stroke-width", 2)
          .attr("width", viz.dotRadius / 2 + viz.rectHover)
          .attr("height", viz.dotRadius + viz.rectHover)
          .attr("opacity", 1)
          .attr("y", this.dotYOffset);

        // draw text above circles
        valueG
          .append("text")
          .attr("class", "rf-circle-text")
          .attr("dx", 0)
          .attr("dy", -this.dotRadius / 1.8) // mobile
          .attr("text-anchor", "left")
          .text(d3.format(".0%")(value));
      }
    });
  }

  resizeChart1() {
    let vis = this;
    this.size = Math.min(
      d3.select(this.chartContainer).node().getBoundingClientRect().height,
      d3.select(this.chartContainer).node().getBoundingClientRect().width
    );
    this.squareSize = this.size / (1.7 * this.nCell);
    d3.select(vis.chartContainer).selectAll("svg#barcode-grid").remove();
    this.makeGrid();
    let i = 0;
  }
}
