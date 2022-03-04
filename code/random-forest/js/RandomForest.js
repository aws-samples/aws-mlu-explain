import * as d3 from "d3";
import { RFTree0, RFTree4, RFTree5, featureLabelsData } from "./data";
import { Tree } from "./Tree";
import * as annotation from "d3-svg-annotation";

export class RandomForest {
  constructor(opts) {
    this.chartContainer = opts.chartContainer;
    const chartContainerProperties = d3
      .select(this.chartContainer)
      .node()
      .getBoundingClientRect();
    this.height = chartContainerProperties.height;
    this.width = chartContainerProperties.width;
    this.size = Math.min(this.height, this.width);
    this.paddingScale = d3.scaleSqrt().domain([0, 1000]).range([0, 100]);
    // Bag0-2 holds sample 1-3 from Bagging.js
    this.bag0 = opts.bag0;
    this.bag1 = opts.bag1;
    this.bag2 = opts.bag2;
    this.TreeSize = (Math.min(this.height, this.width) - 20) / 3.2; //20 is the padding between trees
    this.strokeWidth = 1;
    this.tree0 = new Tree({
      root: RFTree4,
      treeSize: this.TreeSize,
      strokeWidth: this.strokeWidth,
    });
    this.tree1 = new Tree({
      root: RFTree0,
      treeSize: this.TreeSize,
      strokeWidth: this.strokeWidth,
    });
    this.tree2 = new Tree({
      root: RFTree5,
      treeSize: this.TreeSize,
      strokeWidth: this.strokeWidth,
    });
    this.rfgroupelement = d3
      .select(this.chartContainer)
      .append("g")
      .attr("class", "rfTree");
    this.featuregroupelement = d3
      .select(this.chartContainer)
      .append("g")
      .attr("class", "mainfeatures");
    this.treebuildingelement = d3
      .select(this.chartContainer)
      .append("g")
      .attr("class", "treebuilding")
      .attr("opacity", 0);
    window.innerWidth > 600
      ? this.drawFeatures()
      : this.drawFeaturesForSmallScreen();
    window.innerWidth > 600
      ? (this.textWrapLength = 150)
      : (this.textWrapLength = 50);
    this.drawTrees();
    this.buildaTree();
  }
  drawFeatures() {
    const vis = this;
    const rectangleHeight = (Math.min(vis.height, vis.width) / 10) * 0.8;
    const featureLabels = featureLabelsData;
    const featureContainers = [];
    const features = this.featuregroupelement
      .append("g")
      .attr("class", "features");
    //g element for four features
    Array.from({ length: 4 }).map((d, i) => {
      featureContainers[i] = features
        .append("g")
        .attr("class", `feature${i}`)
        .attr(
          "transform",
          `translate(0,${i * (Math.min(vis.height, vis.width) / 10)})`
        );
    });
    //add primitive shapes for features
    Array.from({ length: 4 }).map((d, i) => {
      featureContainers[i]
        .append("rect")
        .attr("class", `featureIcon${i}`)
        .attr("fill", featureLabels[i].color)
        .attr("x", 0) // fix the relative position
        .attr("height", rectangleHeight)
        .attr("width", rectangleHeight)
        .attr("rx", rectangleHeight / 5)
        .attr("ry", rectangleHeight / 5);
      featureContainers[i]
        .append("text")
        .attr("fill", "white")
        .attr("x", rectangleHeight / 2)
        .attr(
          "y",
          Math.min(vis.height, vis.width) / 10 -
            rectangleHeight +
            rectangleHeight / 2.4
        )
        .attr("font-size", `${rectangleHeight / 2}px`)
        .attr("text-anchor", "middle")
        .text(featureLabels[i].label);
      featureContainers[i]
        .append("text")
        .attr("fill", "#232f3e")
        .attr("x", rectangleHeight * 1.3)
        .attr(
          "y",
          Math.min(vis.height, vis.width) / 10 -
            rectangleHeight +
            rectangleHeight / 2.4
        )
        .attr("font-size", `${rectangleHeight / 2}px`)
        .attr("text-anchor", "left")
        .text(featureLabels[i].text);
    });
    const type = annotation.annotationCustomType(annotation.annotationLabel, {
      className: "featureintrotext",
      note: { align: "top" },
    });
    const featureElement = vis.featuregroupelement
      .node()
      .getBoundingClientRect();
    const annotations = [
      {
        note: {
          label: "At each split, only a subset of these will be considered.",
          title: "Features :)",
          wrap: this.width / 2.5,
        },
        dx: featureElement.width * 1.5,
        dy: vis.height / 2,
        subject: {
          width: featureElement.width + 4,
          height: featureElement.height + 4,
        },
      },
    ];

    const makeAnnotations = annotation
      .annotation()
      .textWrap(this.textWrapLength)
      .notePadding(15)
      .type(type)
      .annotations(annotations);

    this.featuregroupelement
      .append("g")
      .attr("class", "featannotation")
      .call(makeAnnotations);
    this.featuregroupelement.select(".features").attr("opacity", 0);
    this.featuregroupelement.select(".featannotation").attr("opacity", 0);
  }
  drawFeaturesForSmallScreen() {
    const vis = this;
    const rectangleHeight = (Math.min(vis.height, vis.width) / 10) * 0.8;
    const featureLabels = featureLabelsData;
    const featureContainers = [];
    const features = this.featuregroupelement
      .append("g")
      .attr("class", "features")
      .attr("transform", `translate(0,${vis.height / 2})`);
    // Define the text for the tooltip
    let text = d3
      .select("#chart-rf")
      .append("text")
      .attr("class", "tooltip")
      .attr("opacity", 0);
    //g element for four features
    Array.from({ length: 4 }).map((d, i) => {
      featureContainers[i] = features
        .append("g")
        .attr("class", `feature${i}`)
        .attr(
          "transform",
          `translate(0,${i * (Math.min(vis.height, vis.width) / 10)})`
        );
    });
    //add primitive shapes for features
    Array.from({ length: 4 }).map((d, i) => {
      featureContainers[i]
        .append("rect")
        .attr("class", `featureIcon${i}`)
        .attr("fill", featureLabels[i].color)
        .attr("x", 0) // fix the relative position
        .attr("height", rectangleHeight)
        .attr("width", rectangleHeight)
        .attr("rx", rectangleHeight / 5)
        .attr("ry", rectangleHeight / 5)
        .on("mouseover", function (d) {
          text
            .attr("opacity", 0.9)
            .text(featureLabels[i].text)
            .attr("x", d.offsetX)
            .attr("y", d.offsetY);
        })
        .on("mouseout", function (d) {
          text.attr("opacity", 0);
        });
      featureContainers[i]
        .append("text")
        .attr("fill", "white")
        .attr("x", rectangleHeight / 2)
        .attr(
          "y",
          Math.min(vis.height, vis.width) / 10 -
            rectangleHeight +
            rectangleHeight / 2.4
        )
        .attr("font-size", `${rectangleHeight / 2}px`)
        .attr("text-anchor", "middle")
        .text(featureLabels[i].label)
        .on("mouseover", function (d) {
          text
            .attr("opacity", 0.9)
            .text(featureLabels[i].text)
            .attr("x", d.offsetX)
            .attr("y", d.offsetY);
        })
        .on("mouseout", function (d) {
          text.attr("opacity", 0);
        });
    });
    const type = annotation.annotationCustomType(annotation.annotationLabel, {
      className: "featureintrotext",
      note: { align: "middle" },
    });
    const featureElement = vis.featuregroupelement
      .node()
      .getBoundingClientRect();
    const annotations = [
      {
        note: {
          label: "At each split, only a subset of these will be considered.",
          title: "Features",
          wrap: 50,
        },
        dx: this.width / 1.8,
        dy: this.height / 2.5,
        subject: {
          width: featureElement.width + 4,
          height: featureElement.height + 4,
        },
      },
    ];

    const makeAnnotations = annotation
      .annotation()
      //.editMode(true)
      .textWrap(this.textWrapLength)
      .notePadding(15)
      .type(type)
      .annotations(annotations);

    this.featuregroupelement
      .append("g")
      .attr("class", "featannotation")
      .call(makeAnnotations);
    this.featuregroupelement.select(".features").attr("opacity", 0);
    this.featuregroupelement.select(".featannotation").attr("opacity", 0);
  }
  drawTrees() {
    const vis = this;
    const padding = (vis.width - 3 * vis.TreeSize * 1.2) / 2.1;
    const treePositions = [
      padding,
      vis.width / 2 - (vis.TreeSize * 1.2) / 2,
      vis.width - vis.TreeSize * 1.2 - padding,
    ];
    //There are three trees
    Array.from({ length: 3 }).map((d, i) => {
      this.rfgroupelement
        .append("g")
        .attr("class", `tree${i}`)
        .attr("transform", `translate(${treePositions[i]},${vis.height / 2})`);
    });
    this.tree0.drawTreeWithText(d3.select(".tree0"));
    this.tree1.drawTreeWithText(d3.select(".tree1"));
    this.tree2.drawTreeWithText(d3.select(".tree2"));
    this.rfgroupelement.attr("opacity", 0);
  }
  buildaTree() {
    const vis = this;
    this.buildTree0 = new Tree({
      root: RFTree4,
      treeSize: Math.min(this.height, this.width) / 2 / 1.2,
      strokeWidth: this.strokeWidth,
    });
    vis.treebuildingelement
      .append("g")
      .attr("class", "buildaTree")
      .attr("transform", `translate(${vis.width / 2},${vis.height / 4})`);
    this.buildTree0.drawTreeWithSplit(d3.select("g.buildaTree"));
    //Annotation
    const type = annotation.annotationCustomType(annotation.annotationLabel, {
      className: "featureintrotext",
      note: { align: "middle" },
    });
    const annotations = [
      {
        note: {
          label: "These three features are considered for the best split.",
          title: "First Split",
        },
        dx: vis.width / 4,
        dy: vis.height / 8,
      },
    ];

    const makeAnnotations = annotation
      .annotation()
      .textWrap(this.textWrapLength)
      .notePadding(15)
      .type(type)
      .annotations(annotations);

    const container = d3
      .select("g.buildaTree")
      .append("g")
      .attr("class", "splitannotation")
      .attr("opacity", 0)
      .call(makeAnnotations);
  }

  introduceFeatures() {
    this.bag0.attr("opacity", 1);
    this.bag1.attr("opacity", 1);
    this.bag2.attr("opacity", 1);
    this.featuregroupelement.attr("opacity", 1).attr("transform", null);
    this.featuregroupelement
      .select(".features")
      .transition()
      .attr("opacity", 1);
    this.featuregroupelement
      .select(".featannotation")
      .transition()
      .delay(200)
      .attr("opacity", 1);
    d3.selectAll("text.annotation-note-label")
      .attr("opacity", 1)
      .style("stroke-width", 1);
    d3.select("g.treebuilding").attr("opacity", 0);
  }
  firstTreeBuildingStep1_1() {
    const vis = this;
    //Undo second step
    d3.selectAll("rect.splitnode1").attr("opacity", 0);
    d3.selectAll("rect#split1").attr("opacity", 0);
    d3.select("path.link-2").attr("opacity", 0);
    d3.select("path.link-3").attr("opacity", 0);
    //this.annimationloop = true;
    d3.select("g.splitannotation").transition().delay(200).attr("opacity", 1);
    this.rfgroupelement.attr("opacity", 0);
    this.bag1.attr("opacity", 0);
    this.bag2.attr("opacity", 0);
    d3.select("path.link-0").attr("opacity", 0);
    d3.select("path.link-1").attr("opacity", 0);
    //Undo second step
    d3.selectAll("rect.splitnode1").attr("opacity", 0);
    d3.selectAll("rect#split1").attr("opacity", 0);
    d3.selectAll("rect.splitnode1").attr("opacity", 0);
    d3.select("path.link-2").attr("opacity", 0);
    d3.select("path.link-3").attr("opacity", 0);
    this.featuregroupelement
      .select(".featannotation")
      .transition()
      .attr("opacity", 0);
    this.featuregroupelement.select(".features").attr("opacity", 1);
    this.featuregroupelement
      .transition()
      .attr("transform", `translate(0,${this.height / 10}) scale(0.8,0.8)`);
    d3.select("g.treebuilding").attr("opacity", 1);
    d3.selectAll("rect.splitnode0").attr("opacity", 1);
    d3.selectAll("rect#split0").transition().attr("opacity", 1);
    // Hide the rest of the tree
    d3.selectAll("path.splitlink").transition().attr("opacity", 0);
    d3.selectAll("text.splitnodetexts").transition().attr("opacity", 0);
    d3.selectAll("rect#rest").attr("opacity", 0);
  }
  firstTreeBuildingStep1_2() {
    //Undo second step
    d3.selectAll("rect.splitnode1").attr("opacity", 0);
    d3.selectAll("rect#split1").attr("opacity", 0);
    d3.select("path.link-2").attr("opacity", 0);
    d3.select("path.link-3").attr("opacity", 0);
    //Feature picked
    d3.selectAll("rect.splitnode0").transition().attr("opacity", 0);
    d3.select("path.link-0").transition().delay(500).attr("opacity", 1);
    d3.select("path.link-1").transition().delay(700).attr("opacity", 1);
    d3.select("g.splitannotation").transition().delay(200).attr("opacity", 0);
    // Hide the rest of the tree
    d3.selectAll("path.splitlink").transition().attr("opacity", 0);
    d3.selectAll("text.splitnodetexts").transition().attr("opacity", 0);
    d3.selectAll("rect#rest").attr("opacity", 0);
  }
  firstTreeBuildingStep2() {
    this.annimationloop = false;
    this.reverseAnnimationLoop = false;
    // Hide the rest of the tree
    d3.selectAll("path.splitlink").transition().attr("opacity", 0);
    d3.selectAll("text.splitnodetexts").transition().attr("opacity", 0);
    d3.selectAll("rect#rest").attr("opacity", 0);
    // Hide the three rects from the step 1
    d3.selectAll("rect.splitnode0").attr("opacity", 0);
    // Show the two edges
    d3.select("path.link-0").attr("opacity", 1);
    d3.select("path.link-1").attr("opacity", 1);
    // The rest should be hidden
    d3.select("path.link-2").attr("opacity", 0);
    d3.select("path.link-3").attr("opacity", 0);
    d3.selectAll("rect#rest").attr("opacity", 0);
    d3.selectAll("path.splitlink").attr("opacity", 0);
    d3.selectAll("text.splitnodetexts").attr("opacity", 0);
    d3.selectAll("rect.splitnode1").attr("opacity", 1);
    d3.selectAll("rect#split1").transition().attr("opacity", 1);
    d3.selectAll("rect.splitnode1").transition().delay(300).attr("opacity", 0);
    d3.select("path.link-2").transition().delay(300).attr("opacity", 1);
    d3.select("path.link-3").transition().delay(500).attr("opacity", 1);
  }
  firstTreeBuildingStep3() {
    this.annimationloop = false;
    this.reverseAnnimationLoop = false;
    Array.from({ length: 3 }).map((d, i) => {
      const tree = ".tree" + i;
      this.rfgroupelement
        .select(tree)
        .selectAll("path.link")
        .attr("opacity", 0);
      this.rfgroupelement
        .select(tree)
        .selectAll("rect.nodes")
        .attr("opacity", 0);
      this.rfgroupelement
        .select(tree)
        .selectAll("text.nodetexts")
        .attr("opacity", 0);
    });

    d3.select("g.treebuilding").attr("opacity", 1);
    d3.selectAll("rect.splitnode1").attr("opacity", 0);
    d3.selectAll("rect#split1").attr("opacity", 1);
    d3.select("path.link-2").attr("opacity", 1);
    d3.select("path.link-3").attr("opacity", 1);
    this.rfgroupelement.attr("opacity", 0);
    this.bag1.attr("opacity", 0);
    this.bag2.attr("opacity", 0);
    this.featuregroupelement.select(".features").attr("opacity", 1);
    d3.selectAll("rect#rest").transition().attr("opacity", 1);
    d3.selectAll("path.splitlink").transition().attr("opacity", 1);
    d3.selectAll("text.splitnodetexts").transition().attr("opacity", 1);
  }
  firstTreeBuildingReverse() {
    d3.select("g.splitannotation").attr("opacity", 0);
  }
  removeFeatures() {
    let vis = this;
    d3.select("g.treebuilding").attr("opacity", 0);
    d3.select("g.features")
      .attr("opacity", 0)
      .attr(
        "transform",
        `translate(${vis.paddingScale(vis.width)},${vis.height / 2})`
      );
    this.featuregroupelement.attr("opacity", 0);
  }
  bringFeaturesBack() {
    let vis = this;
    this.featuregroupelement.attr("opacity", 1);
    d3.select("g.treebuilding").attr("opacity", 0); // Don't need the big trees anymore.
    d3.select("g.features")
      .attr("opacity", 1)
      .attr(
        "transform",
        `scale(0.7,0.7) translate(${vis.paddingScale(vis.width) + 10},${
          vis.height / 10
        })`
      );
    this.featuregroupelement.select("g.featannotation").attr("opacity", 0);
  }

  showThreeTrees() {
    this.bag0.attr("opacity", 1);
    this.bag1.transition().attr("opacity", 1);
    this.bag2.transition().delay(100).attr("opacity", 1);
    this.rfgroupelement.attr("opacity", 1);
    Array.from({ length: 3 }).map((d, i) => {
      const tree = ".tree" + i;
      this.rfgroupelement
        .select(tree)
        .selectAll("path.link")
        .transition()
        .delay((d, i) => i * 100)
        .attr("opacity", 1);
      this.rfgroupelement
        .select(tree)
        .selectAll("rect.nodes")
        .transition()
        .delay((d, i) => i * 100)
        .attr("opacity", 1);

      this.rfgroupelement
        .select(tree)
        .selectAll("text.nodetexts")
        .transition()
        .delay((d, i) => i * 100)
        .attr("opacity", 1);
    });
  }
  hideThreeTrees() {
    this.rfgroupelement.attr("opacity", 0);
  }
  removeSamples() {
    this.bag0.attr("opacity", 0);
    this.bag1.attr("opacity", 0);
    this.bag2.attr("opacity", 0);
  }
  removeLastTwoSamples() {
    this.bag2.attr("opacity", 0);
    this.bag1.attr("opacity", 0);
  }
  resize() {
    d3.select("text.tooltip").remove();
    d3.select(this.chartContainer).select(".rfTree").remove();
    d3.select(this.chartContainer).select(".mainfeatures").remove();
    d3.select(this.chartContainer).select(".treebuilding").remove();
    this.rfgroupelement = d3
      .select(this.chartContainer)
      .append("g")
      .attr("class", "rfTree");
    this.featuregroupelement = d3
      .select(this.chartContainer)
      .append("g")
      .attr("class", "mainfeatures");
    this.treebuildingelement = d3
      .select(this.chartContainer)
      .append("g")
      .attr("class", "treebuilding")
      .attr("opacity", 0);
    const vis = this;
    const chartContainerProperties = d3
      .select(vis.chartContainer)
      .node()
      .getBoundingClientRect();
    this.height = chartContainerProperties.height;
    this.width = chartContainerProperties.width;
    this.size = Math.min(this.height, this.width);
    // Bag0-2 holds sample 1-3 from Bagging.js
    this.TreeSize = (Math.min(this.height, this.width) - 20) / 3.2; //20 is the padding between trees
    this.tree0 = new Tree({
      root: RFTree4,
      treeSize: this.TreeSize,
      strokeWidth: this.strokeWidth,
    });
    this.tree1 = new Tree({
      root: RFTree0,
      treeSize: this.TreeSize,
      strokeWidth: this.strokeWidth,
    });
    this.tree2 = new Tree({
      root: RFTree5,
      treeSize: this.TreeSize,
      strokeWidth: this.strokeWidth,
    });
    window.innerWidth > 600
      ? this.drawFeatures()
      : this.drawFeaturesForSmallScreen();
    window.innerWidth > 600
      ? (this.textWrapLength = 200)
      : (this.textWrapLength = 30);
    this.drawTrees();
    this.buildaTree();
  }
}
