import { select, selectAll } from "d3-selection";
import { axisBottom, axisLeft } from "d3-axis";
import { scaleLinear, scaleOrdinal } from "d3-scale";
import { transition } from "d3-transition";
import { scatterData, splitRects } from "./data";

const mb = window.innerWidth < 850;

export class Scatter {
  constructor(opts) {
    const that = this;
    // selections
    this.container = opts.chartContainer;

    // set circle size
    this.circleSize = mb ? 3 : 6;
    this.partitionRectOpacity = 0.9;

    // set constant SVG parameters
    this.MARGIN = {
      TOP: mb ? 50 : 60,
      BOTTOM: 40,
      LEFT: mb ? 35 : 45,
      RIGHT: mb ? 0 : 10,
    };
    const containerSize = select(`#${this.container}`)
      .node()
      .getBoundingClientRect();
    this.WIDTH = containerSize.width * 0.98 - 35;
    this.HEIGHT = containerSize.height * 0.95;
    this.splitData = splitRects;

    // draw charts
    this.drawScatter();
  }

  // draw partition ('split') rectangles on scatter plot at given depth
  drawSplitRectangles(depth) {
    const vis = this;
    const trans = transition().duration(500);
    // track currently selected depth
    let depthFilter = (d) => d.depth <= depth;

    // data join rects
    let rects = this.scatterG
      .selectAll("rect.partition")
      .data(this.splitData.filter(depthFilter));

    let rectPartitions = rects.join(
      (enter) => {
        enter
          .append("rect")
          .attr("class", "partition")
          .attr("partition_num", (d) => d.depth)
          .attr("x", (d) => vis.xScale(d.x1))
          .attr("y", (d) => vis.yScale(d.y1))
          .attr("width", (d) => vis.xScale(d.x2) - vis.xScale(d.x1))
          .attr("height", (d) => vis.yScale(d.y2) - vis.yScale(d.y1))
          .attr("fill", (d) => vis.colorScale(d.prediction))
          .attr("opacity", 0)
          .transition(trans)

          .attr("opacity", vis.partitionRectOpacity)
          .attr("stroke", "black")
          .attr("stroke-width", mb ? 1 : 2)
          .style("border-radius", "10px");
      },
      (update) => {},
      (exit) => {
        exit.remove();
      }
    );

    selectAll("circle.dt-scatter-test").raise();
  }

  drawScatter() {
    // set up svg
    this.scatterG = this.initChartSvg(this.container);

    // define scales
    // x-scale
    this.xScale = scaleLinear().domain([0, 1.3]).range([0, this.WIDTH]);

    // y-scale
    this.yScale = scaleLinear().domain([0, 16]).range([this.HEIGHT, 0]);

    // color scale
    this.colorScale = scaleOrdinal()
      .domain(["oak", "cherry", "apple"])
      .range(["#F9BC92", "#7B3972", "#74ADA9"]);

    // define axes
    const xAxisGeneratorLoess = axisBottom(this.xScale)
      .ticks(4)
      .tickSizeOuter(0);

    const yAxisGeneratorLoess = axisLeft(this.yScale).tickSizeOuter(0);

    // add x-axis
    this.xAxis = this.scatterG
      .append("g")
      .attr("class", "axis")
      .attr("id", "dt-scatter-x-axis")
      .call(xAxisGeneratorLoess)
      .attr("transform", `translate(0, ${this.HEIGHT})`);

    // add y-axis
    this.yAxis = this.scatterG
      .append("g")
      .attr("class", "axis")
      .attr("id", "dt-scatter-y-axis")
      .call(yAxisGeneratorLoess);

    // add text labels
    this.xLabel = this.svg
      .append("text")
      .attr("class", "scatter-axis-text")
      .attr(
        "x",
        mb
          ? (this.WIDTH + this.MARGIN.LEFT + this.MARGIN.RIGHT) / 2
          : this.MARGIN.LEFT
      )
      .attr("y", this.HEIGHT + this.MARGIN.TOP + this.MARGIN.BOTTOM / 1.2)
      .attr("text-anchor", mb ? "middle" : "left")
      .text("Diameter");

    this.svg
      .append("text")
      .attr("class", "scatter-axis-text")
      .attr(
        "x",
        mb
          ? -(this.MARGIN.BOTTOM + this.HEIGHT + this.MARGIN.TOP) / 2
          : -this.MARGIN.TOP
      )
      .attr("y", this.MARGIN.LEFT / 3.5)
      .attr("text-anchor", mb ? "middle" : "end")
      .text("Height")
      .attr("transform", "rotate(-90)");

    this.scatterG
      .selectAll("circle.dt-scatter-test")
      .data(scatterData)
      .enter()
      .append("circle")
      .attr("class", "dt-scatter-test")
      .attr("r", this.circleSize)
      .attr("fill", (d) => this.colorScale(d.Family))
      .attr("cx", (d) => this.xScale(+d.Diameter))
      .attr("cy", (d) => this.yScale(+d.Height))
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .attr("fill-opacity", 1);

    // add legend
    this.addLegend();
  }

  addLegend() {
    const that = this;
    const legendData = [...new Set(scatterData.map((d) => d.Family))];

    const nodeWidth = (d) => d.getBBox().width;

    const legend = this.scatterG
      .append("g")
      .attr("class", "dt-scatter-legend")
      .attr("transform", "translate(0,0)");

    const lg = legend.selectAll("g").data(legendData).enter().append("g");

    const legendCircle = lg
      .append("circle")
      .attr("r", 5.5)
      .attr("id", (d, i) =>
        i % 2 == 0 ? "dt-scatter-train" : "dt-scatter-test"
      )
      .attr("cy", 5)
      .attr("cx", 1)
      .attr("stroke-width", 1)
      .attr("stroke", "black")
      .attr("fill", (d) => this.colorScale(d));
    lg.append("text")
      .attr("x", 11.5)
      .attr("y", 10)
      .text((d) => d);

    let offset = 0;

    lg.attr("transform", function (d) {
      let x = offset;
      offset += nodeWidth(this) + 10;
      return `translate(${x}, ${0})`;
    });

    legend.attr("transform", function () {
      return `translate(${
        (that.WIDTH - nodeWidth(this)) / 2
      }, ${-that.MARGIN.TOP / 2})`;
    });
  }

  // initialize svg and params for chart
  initChartSvg(stage) {
    this.svg = select(`#${stage}`)
      .append("svg")
      .attr("id", `${stage}-svg`)
      .attr("width", this.WIDTH + this.MARGIN.LEFT + this.MARGIN.RIGHT)
      .attr("height", this.HEIGHT + this.MARGIN.TOP + this.MARGIN.BOTTOM)
      .style("background-color", "rgba(0,0,0,0");

    const g = this.svg
      .append("g")
      .attr("id", `${stage}-g`)
      .attr("transform", `translate(${this.MARGIN.LEFT}, ${this.MARGIN.TOP})`);

    return g;
  }
}
