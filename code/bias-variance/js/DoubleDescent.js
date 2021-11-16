// import * as d3 from "d3";
import { select } from "d3-selection";
import { axisBottom, axisLeft } from "d3-axis";
import { scaleLinear } from "d3-scale";
import { line, curveCatmullRom } from "d3-shape";
import { ddTrainTest, ddUShape } from "./dataFiles";

export class DoubleDescent {
  constructor(opts) {
    // set selections
    this.ddContainer = opts.ddContainer;

    // set constant SVG parameters
    this.MARGIN =
      window.innerWidth <= 600
        ? { TOP: 30, BOTTOM: 40, LEFT: 20, RIGHT: 35 }
        : { TOP: 30, BOTTOM: 40, LEFT: 35, RIGHT: 40 };
    this.WIDTH =
      window.innerWidth <= 600
        ? window.innerWidth * 0.65
        : window.innerWidth * 0.45;
    this.HEIGHT =
      window.innerWidth <= 600
        ? window.innerHeight * 0.3
        : window.innerHeight * 0.35;

    // create svg
    this.svg = select(`#${this.ddContainer}`)
      .append("svg")
      .attr("id", `dd-svg`)
      .attr("width", this.WIDTH + this.MARGIN.LEFT + this.MARGIN.RIGHT)
      .attr("height", this.HEIGHT + this.MARGIN.TOP + this.MARGIN.BOTTOM)
      .style("background-color", "");
    // g container for double descent (dd)
    this.ddG = this.svg
      .append("g")
      .attr("id", `dd-g`)
      .attr("transform", `translate(${this.MARGIN.LEFT}, ${this.MARGIN.TOP})`);

    // add clip-path to limit U-line height
    this.ddG
      .append("clipPath")
      .attr("id", "dd-clip")
      .append("rect")
      .attr("x", 0)
      .attr("y", 10)
      .attr("width", this.WIDTH + this.MARGIN.LEFT + this.MARGIN.RIGHT)
      .attr("height", this.HEIGHT + this.MARGIN.TOP + this.MARGIN.BOTTOM);

    // draw axes
    this.drawAxes();

    // draw  lines
    this.drawDoubleDescentLines();

    // draw title
    // this.addTitle();

    // add text annotations to chart
    this.addAnnotations();
  }

  drawAxes() {
    // define scales
    this.xScale = scaleLinear().domain([0.5, 21]).range([0, this.WIDTH]);
    this.yScale = scaleLinear().domain([0, 34]).range([this.HEIGHT, 0]);

    // define axes
    const xAxisGeneratorLoess = axisBottom(this.xScale)
      .tickSizeOuter(0)
      .ticks(4);
    const yAxisGeneratorLoess = axisLeft(this.yScale).tickSizeOuter(0).ticks(4);

    // draw x-axis
    const xAxis = this.ddG
      .append("g")
      .attr("class", "axis")
      .attr("id", "dd-x-axis")
      .call(xAxisGeneratorLoess)
      .attr("transform", `translate(0, ${this.HEIGHT})`);

    // draw y-axis
    const yAxis = this.ddG
      .append("g")
      .attr("class", "axis")
      .attr("id", "dd-y-axis")
      .call(yAxisGeneratorLoess);

    // add labels to axes
    this.svg
      .append("text")
      .attr("class", "dd-axis-text")
      .attr("x", this.WIDTH / 2 + this.MARGIN.RIGHT)
      .attr("y", this.HEIGHT + this.MARGIN.TOP + this.MARGIN.BOTTOM / 2)
      .text("Model Complexity")
      .attr("text-anchor", "middle");
    this.svg
      .append("text")
      .attr("class", "dd-axis-text")
      .attr("y", this.MARGIN.LEFT / 1.4)
      .attr("x", -(this.HEIGHT / 2 + this.MARGIN.TOP))
      .attr("dy", ".05em")
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("Error");

    //   #efefef
    // add arrow for x-axis
    this.svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead-right")
      .attr("refX", 5)
      .attr("refY", 4.7)
      .attr("markerWidth", 16)
      .attr("markerHeight", 13)
      .append("path")
      .attr("d", "M 0 0 L 5 5 L 0 10")
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("fill", "none");

    // add arrow to x-axis
    this.svg
      .select("#dd-x-axis path.domain")
      .attr("marker-end", "url(#arrowhead-right)");

    // add arrow for y-axis
    this.svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead-up")
      .attr("refX", 5)
      .attr("refY", 4.7)
      .attr("markerWidth", 16)
      .attr("markerHeight", 23)
      .append("path")
      .attr("d", "M 10 10 L 5 5 L 0 10")
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("fill", "none");

    this.svg
      .select("#dd-y-axis path.domain")
      .attr("marker-end", "url(#arrowhead-up)");
  }

  drawDoubleDescentLines() {
    // init line generator
    let lineGen = line()
      .x((d) => this.xScale(d.x))
      .curve(curveCatmullRom.alpha(0.8));

    // draw train/test lines
    const stages = ["train", "test"];
    stages.map((stage) => {
      //  update line generator for given stage
      lineGen.y((d) => this.yScale(d[`y_${stage}`]));

      // draw line for given stage
      this.ddG
        .append("path")
        .attr("class", "dd-line")
        .attr("id", `dd-line-${stage}`)
        .attr("d", lineGen(ddTrainTest));
    });

    // draw U-shape line
    lineGen.y((d) => this.yScale(d.y_u));
    this.ddG
      .append("path")
      .attr("clip-path", "url(#dd-clip)")
      .attr("class", "dd-line")
      .attr("id", `dd-line-u`)
      .attr("d", lineGen(ddUShape));
  }

  addTitle() {
    // add title to plot
    this.svg
      .append("text")
      .attr("id", "dd-title")
      .attr("x", this.MARGIN.LEFT)
      .attr("y", this.MARGIN.TOP / 1.5)
      .attr("text-anchor", "left")
      .text("The Double Descent Phenomena")
      .style("font-weight", "bold");
  }

  addAnnotations() {
    // add text annotations to chart
    // train label & circle
    this.ddG
      .attr("class", "dd-text")
      .append("text")
      .attr("x", this.xScale(19.25))
      .attr("y", this.yScale(0.8))
      .attr("dx", window.innerWidth <= 600 ? 2.5 : 0)
      .text("Train Error");
    this.ddG
      .append("circle")
      .attr("class", "dd-circle")
      .attr("id", "dd-circle-train")
      .attr("cx", this.xScale(19))
      .attr("cy", this.yScale(1.2))
      .attr("r", 5);

    // test label
    this.ddG
      .attr("class", "dd-text")
      .append("text")
      .attr("x", this.xScale(19.25))
      .attr("y", this.yScale(2.4))
      .attr("dx", window.innerWidth <= 600 ? 2.5 : 0)
      .text("Test Error");
    this.ddG
      .append("circle")
      .attr("class", "dd-circle")
      .attr("id", "dd-circle-test")
      .attr("cx", this.xScale(19))
      .attr("cy", this.yScale(2.3))
      .attr("r", 5);

    // U label
    this.ddG
      .attr("class", "dd-text")
      .append("text")
      .attr("x", this.xScale(9.8))
      .attr("y", this.yScale(30.25))
      .text("Expected Test Error");
  }
}
