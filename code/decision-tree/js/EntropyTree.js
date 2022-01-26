import { select, selectAll } from "d3-selection";
import { tree, hierarchy, pack } from "d3-hierarchy";
import { linkVertical } from "d3-shape";
import { transition } from "d3-transition";
import { shuffle } from "d3-array";
import { entropyTreeData } from "./data";
import { scaleOrdinal } from "d3-scale";
import { annotation, annotationLabel } from "d3-svg-annotation";

const pathCurve = linkVertical()
  .x((d) => d.x)
  .y((d) => d.y);

const etMobile = window.innerWidth < 850;

export class EntropyTree {
  constructor(opts) {
    const that = this;
    // selections
    this.container = opts.chartContainer;
    this.data = opts.data;

    this.radius = etMobile ? 40 : 80;
    this.strokeWidth = etMobile ? 2 : 4;

    // set constant SVG parameters
    this.MARGIN = {
      TOP: etMobile ? this.radius * 3 : this.radius * 2,
      BOTTOM: etMobile ? this.radius * 1.5 : this.radius + 10,
      LEFT: etMobile ? 0 : this.radius + 40,
      RIGHT: etMobile ? 0 : this.radius + 60,
    };
    const containerSize = select(`#${this.container}`)
      .node()
      .getBoundingClientRect();
    this.WIDTH = etMobile ? containerSize.width : containerSize.width * 0.8;
    this.HEIGHT = containerSize.height * 0.99;

    this.classNames = ["apple", "cherry", "oak"];
    this.strokeColors = ["#74ADA9", "#7B3972", "#F9BC92"];
    this.levelHeight = this.HEIGHT / 4;
    // todo make radiys scale based on screen size

    // set up svg
    this.treeG = this.initChartSvg();

    // draw charts
    this.drawTree();
  }

  drawTree() {
    const self = this;
    // init tree
    this.tree = tree()
      .size([this.WIDTH, this.HEIGHT - this.MARGIN.TOP - this.MARGIN.BOTTOM])
      .separation(function (a, b) {
        return a.parent == b.parent ? 1 : 0.7;
      });

    // make data hiearchical
    this.root = hierarchy(this.data, (d) => d.children);

    // apply tree to hierachical data
    this.treeData = this.tree(this.root);

    // /////////////////////////
    // Map Data To Tree Elements
    // /////////////////////////
    this.nodes = this.treeData.descendants();

    this.nodes.forEach((d) => (d.y = d.depth * self.levelHeight));

    // slice because no links required for first node:
    this.links = this.treeData.links();

    this.colorScale = scaleOrdinal()
      .domain(["oak", "cherry", "apple"])
      .range(["#F9BC92", "#7B3972", "#74ADA9"]);

    this.drawDepth();
    this.drawPackedCircles();
  }

  drawPackedCircles() {
    const self = this;
    const packedDataArray = [];

    this.treeG.selectAll("g.tree-node").each(function (dG, i) {
      const cell = select(this)
        .append("g")
        .attr(
          "transform",
          `translate(${dG.x - self.radius}, ${dG.y - self.radius})`
        );
      //   make new array of data
      let currData = entropyTreeData[i];

      const nAppleArr = [...Array(+currData["nApple"]).keys()].map(() => {
        return { category: "apple" };
      });
      const nOakArr = [...Array(+currData["nOak"]).keys()].map(() => {
        return { category: "oak" };
      });
      const nCherryArr = [...Array(+currData["nCherry"]).keys()].map(() => {
        return { category: "cherry" };
      });
      const newData = shuffle([...nAppleArr, ...nOakArr, ...nCherryArr]);

      let root = { children: newData };
      let hierarchyData = hierarchy(root).sum((d) => 1);
      // second, create pack representation of data
      let packed = (data) =>
        pack()
          .size([self.radius * 2, self.radius * 2])
          .radius(() => (etMobile ? 5 : 7))
          .padding(etMobile ? 2 : 3)(data);

      const packedData = packed(hierarchyData);
      packedDataArray.push({
        packedData: packedData,
        x: dG.x,
        y: dG.y,
      });

      const treePacks = cell
        .append("g")
        .attr("class", "circle-packer")
        .selectAll("circle.point")
        .data(packedData.descendants())
        .join("circle")
        .attr("class", "point")
        .attr("r", (d) => d.r)
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("fill", (d) => {
          if (d.depth === 0) {
            return "rgb(251, 151, 148)";
          } else {
            return self.colorScale(d.data.category);
          }
        })
        .attr("stroke", (d) => {
          if (d.depth === 0) {
            return "white";
          } else {
            return "white";
          }
        })
        .attr("stroke-width", (d) => {
          if (d.depth === 0) {
            return 3;
          } else {
            return 1;
          }
        });

      // add annotation text
      cell
        .selectAll("text.ttt")
        .data(packedData.descendants())
        .join("text")
        .attr("class", "ttt")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("stroke-width", (d) => {
          return "name" in self.nodes[i].data ? "3px" : "8px";
        })
        .attr("stroke", (d) => {
          return "name" in self.nodes[i].data
            ? "#232f3e"
            : self.strokeColors[+self.nodes[i].data.class];
        })
        .attr("dy", (d) => {
          if (d.depth === 0) {
            return d.y - d.r - 10;
          }
        })
        .attr("dx", (d) => d.x)
        .text((d) => {
          if (d.depth === 0) {
            return "name" in self.nodes[i].data
              ? self.nodes[i].data.name
              : self.classNames[+self.nodes[i].data.class];
          } else {
            return "";
          }
        });
      // add entropy text
      cell
        .selectAll("text.entropy-values")
        .data(packedData.descendants())
        .join("text")
        .attr("class", "entropy-values")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("dy", (d) => {
          if (d.depth === 0) {
            return d.y + d.r + 12;
          }
        })
        .attr("dx", (d) => d.x)
        .text((d) => {
          if (d.depth === 0) {
            return `Entropy: ${self.nodes[i].data.entropy}`;
          }
        });
    });

    const annotations = [
      {
        type: annotationLabel,
        note: {
          label:
            "For a sample of three equally-sized classes, the original data set has the maximum possible entropy value: log2(3) = 1.585.",
          wrap: 230,
        },
        connector: {
          end: "none", // 'dot' also available
          endScale: 0.15,
        },
        x: packedDataArray[0]["x"],
        y:
          packedDataArray[0]["y"] +
          self.radius +
          packedDataArray[0]["packedData"]["y"], // margin top
        dy: etMobile ? 150 : -1,
        dx: etMobile ? -60 : -180,
      },
      {
        type: annotationLabel,
        note: {
          label:
            "Our first leaf node successfully separates out all Oak samples, at the cost of bringing along two Apple data points.",
          //   bgPadding: 20,
          wrap: 200,
        },
        connector: {
          end: "none", // 'dot' also available
          endScale: 0.15,
        },
        x: packedDataArray[2]["x"] + self.MARGIN.LEFT,
        y: packedDataArray[2]["y"] + self.MARGIN.TOP, // margin top
        dy: etMobile ? 120 : -120,
        dx: etMobile ? -70 : 100,
      },
      {
        type: annotationLabel,
        note: {
          label: etMobile
            ? ""
            : "Each decision node, including those above and below this one, is selected using information gain, a function of the tree's entropy at the current and prior depth.",
          title: "Leaf Nodes",
          wrap: 220,
        },
        connector: {
          end: "dot", // 'dot' also available
          endScale: 0.5,
        },
        x: packedDataArray[1]["x"] + self.MARGIN.LEFT,
        y: packedDataArray[1]["y"] + self.MARGIN.TOP, // margin top
        dy: etMobile ? 0 : -5,
        dx: etMobile ? 0 : -220,
      },
      {
        type: annotationLabel,
        note: {
          label:
            "The second leaf node partitions off a large number of Cherry trees, at the cost of misclassifying one Apple tree.", //   bgPadding: 20,
          title: "Leaf Nodes",
          wrap: 220,
        },
        connector: {
          end: "dot", // 'dot' also available
          endScale: 0.5,
        },
        x: packedDataArray[3]["x"] + self.MARGIN.LEFT,
        y: packedDataArray[3]["y"] + self.MARGIN.TOP, // margin top
        dy: etMobile ? 110 : -120,
        dx: etMobile ? 90 : -80,
      },
      {
        type: annotationLabel,
        note: {
          label: etMobile
            ? ""
            : "Our third, and final, decision node attempts to partition the remaining Apple and Cherry data points.",
          title: "Leaf Nodes",
          wrap: 220,
        },
        connector: {
          end: "dot", // 'dot' also available
          endScale: 0.5,
        },
        x: packedDataArray[5]["x"] + self.MARGIN.LEFT,
        y: packedDataArray[5]["y"] + self.MARGIN.TOP,
        dy: etMobile ? 0 : -1,
        dx: etMobile ? 0 : -220,
      },
      {
        type: annotationLabel,
        note: {
          label: etMobile
            ? ""
            : "We could further attempt to partition the remaining points, but going too deep will overfit our model, so we decide to stop here.",
          title: "Leaf Nodes",
          wrap: 220,
        },
        connector: {
          end: "dot", // 'dot' also available
          endScale: 0.5,
        },
        x: packedDataArray[7]["x"] + self.MARGIN.LEFT,
        y: packedDataArray[7]["y"] + self.MARGIN.TOP,
        dy: etMobile ? 0 : -50,
        dx: etMobile ? 0 : -120,
      },

      {
        type: annotationLabel,
        note: {
          label:
            "While not always successful, a Decision Tree does its best to partition data at the leaf nodes into groups as 'pure' as possible, as seen here and below.",
          title: "Leaf Nodes",
          wrap: 220,
        },
        connector: {
          end: "dot", // 'dot' also available
          endScale: 0.5,
        },
        x: packedDataArray[6]["x"] + self.MARGIN.LEFT,
        y: packedDataArray[6]["y"] + self.MARGIN.TOP,
        dy: etMobile ? 120 : 120,
        dx: etMobile ? -80 : 0,
      },
      {
        type: annotationLabel,
        note: {
          label: etMobile
            ? ""
            : "At this stage, our data is well-partitioned, but we can try going deeper if we want to separate the classes even further.",
          title: "Leaf Nodes",
          wrap: 220,
        },
        connector: {
          end: "dot", // 'dot' also available
          endScale: 0.5,
        },
        x: packedDataArray[4]["x"] + self.MARGIN.LEFT,
        y: packedDataArray[4]["y"] + self.MARGIN.TOP, // margin top
        dy: etMobile ? 0 : -5,
        dx: etMobile ? 0 : self.WIDTH / 4,
      },
    ].map(function (d) {
      d.color = "grey";
      return d;
    });

    const makeAnnotations = annotation()
      //   .editMode(true)
      .type(annotationLabel)
      .annotations(annotations);

    select(`svg#${this.container}-svg`)
      .append("g")
      .attr("class", "annotation-group-entropy")
      .call(makeAnnotations);

    selectAll(".annotation-group-entropy").lower();
    selectAll("path.link").lower();
  }

  drawDepth() {
    const self = this;

    // filter links to desired depth
    let link = this.g.selectAll("path.link").data(this.links);

    let linkEnter = link
      .join("path")
      .attr("class", "link")
      .attr("d", pathCurve)
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", self.strokeWidth / 4);

    // draw circles
    let node = this.g
      .selectAll("g.node")
      .data(this.nodes)
      .attr("transform", (d) => `translate(${d.x}, ${d.y})`);

    let treeNodes = node.join((enter) => {
      // init g's to hold everything
      const enterNode = enter.append("g").attr("class", "tree-node");
    });

    selectAll("g.node").raise();
  }

  // initialize svg and params for chart
  initChartSvg() {
    this.svg = select(`#${this.container}`)
      .append("svg")
      .attr("id", `${this.container}-svg`)
      .attr("width", this.WIDTH + this.MARGIN.LEFT + this.MARGIN.RIGHT)
      .attr("height", this.HEIGHT + this.MARGIN.TOP + this.MARGIN.BOTTOM);

    this.g = this.svg
      .append("g")
      .attr("id", `${this.container}-g`)
      .attr("transform", `translate(${this.MARGIN.LEFT}, ${this.MARGIN.TOP})`);

    return this.g;
  }

  resizeChart() {
    this.radius = 80;
    this.strokeWidth = 4;

    // set constant SVG parameters
    this.MARGIN = {
      TOP: this.radius * 2,
      BOTTOM: this.radius + 10,
      LEFT: 12,
      RIGHT: 12,
    };
    const containerSize = select(`#${this.container}`)
      .node()
      .getBoundingClientRect();
    this.WIDTH = containerSize.width * 0.85;

    selectAll(`svg#${this.container}-svg`).remove();

    // set up svg
    this.treeG = this.initChartSvg(this.container);

    // draw charts
    this.drawTree();
  }
}
