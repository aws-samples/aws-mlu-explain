import { select, selectAll } from "d3-selection";
import { axisBottom, axisLeft } from "d3-axis";
import { scaleLinear, scaleOrdinal } from "d3-scale";
import { transition } from "d3-transition";

export class PertubedScatter {
  constructor(opts) {
    const that = this;
    // selections
    this.container = opts.chartContainer;
    this.data = opts.data;
    this.splitRects = opts.splitRects;

    // set circle size
    this.circleSize = 3.2;
    this.partitionRectOpacity = 0.9;

    // set constant SVG parameters
    this.MARGIN = { TOP: 60, BOTTOM: 20, LEFT: 20, RIGHT: 0 };
    const containerSize = select(`#${this.container}`)
      .node()
      .getBoundingClientRect();
    this.WIDTH = containerSize.width * 0.9;
    this.HEIGHT = containerSize.height * 0.9;

    // draw charts
    this.drawScatter();
    this.drawSplitRectangles();
  }

  // draw partition ('split') rectangles on scatter plot at given depth
  drawSplitRectangles() {
    const vis = this;
    const trans = transition().duration(500);
    // track currently selected depth

    // data join rects
    let rects = this.scatterG.selectAll("rect.partition").data(this.splitRects);

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
          .attr("opacity", vis.partitionRectOpacity)
          .attr("stroke", "black")
          .attr("stroke-width", 1)
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

    this.scatterG
      .selectAll("circle.dt-scatter-test")
      .data(this.data)
      .enter()
      .append("circle")
      .attr("class", "dt-scatter-test")
      .attr("r", this.circleSize)
      .attr("fill", (d) => this.colorScale(d.Family))
      .attr("cx", (d) => this.xScale(+d.Diameter))
      .attr("cy", (d) => this.yScale(+d.Height))
      .attr("stroke", "white")
      .attr("stroke-width", 0.3)
      .attr("fill-opacity", 0.9);
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
