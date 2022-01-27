import { select, selectAll } from "d3-selection";
import { tree, hierarchy } from "d3-hierarchy";
import { linkVertical } from "d3-shape";
import { transition } from "d3-transition";

const pathCurve = linkVertical()
  .x((d) => d.x)
  .y((d) => d.y);

const mm = window.innerWidth < 850;

export class DecisionTree {
  constructor(opts) {
    const that = this;
    // selections
    this.container = opts.chartContainer;
    this.data = opts.data;

    // set constant SVG parameters
    this.MARGIN = {
      TOP: mm ? 25 : 30,
      BOTTOM: mm ? 0 : 10,
      LEFT: mm ? 0 : 25,
      RIGHT: mm ? 5 : 25,
    };
    const containerSize = select(`#${this.container}`)
      .node()
      .getBoundingClientRect();
    this.WIDTH = containerSize.width * 0.97;
    this.HEIGHT = containerSize.height * 0.97;

    this.depth = 3;
    this.classNames = ["apple", "cherry", "oak"];
    this.strokeColors = ["#74ADA9", "#7B3972", "#F9BC92"];
    this.levelHeight = this.HEIGHT / 4.5;
    // todo make radius scale based on screen size

    // set up svg
    this.treeG = this.initChartSvg(this.container);

    // draw charts
    this.drawTree();
  }

  drawTree() {
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
    // slice because no links required for first node:
    this.links = this.treeData.links();

    this.drawDepth(0);
  }

  drawDepth(depth) {
    const viz = this;
    const trans = transition().duration(500);

    // track currently selected depth
    let depthFilter = (d) => d.depth <= depth;

    // normalize height (y value) at each depth
    this.nodes.forEach((d) => (d.y = d.depth * viz.levelHeight));
    //     append splits if they occur, otherwise dont
    const splitNodes = this.nodes.filter(
      (d) => d.depth === depth && "name" in d.data
    );

    // filter links to desired depth
    let link = this.g
      .selectAll("path.link")
      .data(this.links.filter((d) => d.source.depth < depth));

    let linkEnter = link
      .join("path")
      .attr("class", "link")
      .transition(trans)
      .attr("d", pathCurve)
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.58)
      .attr("stroke-width", mm ? 3 : 6);

    // draw circles
    let node = this.g.selectAll("g.node").data(this.nodes.filter(depthFilter));

    let treeNodes = node.join(
      (enter) => {
        const enterNode = enter.append("g").attr("class", "node");

        // add circle
        enterNode
          .append("circle")
          .attr("cx", (d) => d.x)
          .attr("cy", (d) => d.y)
          .attr("r", 0)
          .transition(trans)
          .attr("r", (d) => {
            return "name" in d.data ? (mm ? 6 : 10) : 0;
          })
          .style("fill", "rgba(.5, .5, .5, 1");

        //  add text
        enterNode
          .append("text")
          .attr("class", "dt-text")
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "middle")
          .attr("x", (d) => d.x)
          .attr("y", (d) => d.y)
          .attr("stroke-width", (d) => {
            return "name" in d.data ? "0px" : "5px";
          })
          .attr("stroke", (d) => viz.strokeColors[+d.data.class])
          // .attr("opacity", depth === 0 ? 0 : 1)
          .text((d) => {
            return "name" in d.data
              ? d.data.name
              : viz.classNames[+d.data.class];
          });
      },
      (update) => {
        const updateNode = update;
        // update circle size
        updateNode
          .selectAll("circle")
          .transition(trans)
          .attr("r", (d) => {
            return "name" in d.data ? (mm ? 6 : 10) : 0;
          });
        updateNode.selectAll("text").attr("opacity", 1);
      },
      (exit) => {
        const exitNode = exit;
        // remove circle
        exitNode
          .selectAll("circle")
          .transition(trans)
          .attr("fill", "red")
          .attr("r", 0);
        // remove text
        exitNode.selectAll("text").attr("opacity", 0);
      }
    );

    selectAll("g.node").raise();
  }

  // initialize svg and params for chart
  initChartSvg(stage) {
    this.svg = select(`#${stage}`)
      .append("svg")
      .attr("id", `${stage}-svg`)
      .attr("width", this.WIDTH + this.MARGIN.LEFT + this.MARGIN.RIGHT)
      .attr("height", this.HEIGHT + this.MARGIN.TOP + this.MARGIN.BOTTOM);

    this.g = this.svg
      .append("g")
      .attr("id", `${stage}-g`)
      .attr("transform", `translate(${this.MARGIN.LEFT}, ${this.MARGIN.TOP})`);

    return this.g;
  }
}
