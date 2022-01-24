import { select, selectAll, pointer } from "d3-selection";
import { transition } from "d3-transition";
import { scaleLinear, scaleOrdinal } from "d3-scale";
import { bisect, extent, range } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import { line, curveCatmullRom } from "d3-shape";
import { format } from "d3-format";
import { informationGainData, scatterData } from "./data";

const igMobile = window.innerWidth <= 850;

export class InformationGainLine {
  constructor(opts) {
    const self = this;
    // selections
    this.container = opts.chartContainer;

    // set size parameters for SVG
    this.MARGIN = { TOP: 15, BOTTOM: 20, LEFT: 25, RIGHT: 20 };
    const containerSize = select(`#${this.container}`)
      .node()
      .getBoundingClientRect();
    this.WIDTH =
      containerSize.width * 0.98 - this.MARGIN.LEFT - this.MARGIN.RIGHT;
    this.HEIGHT =
      containerSize.height * 0.9 - this.MARGIN.TOP - this.MARGIN.BOTTOM;

    // this.entroypG = this.initChartSvg(this.container);
    this.lineG = this.initChartSvg(this.container);
    this.data = informationGainData.sort(function (a, b) {
      return a.Diameter - b.Diameter;
    });

    // this.drawScatter();
    this.drawLines();
    this.addTooltips();
    this.addLegend();
  }

  drawLines() {
    const self = this;

    // define scales
    // x-scale
    // this.xScale = scaleLinear().domain([0, 1.05]).range([0, this.WIDTH]);
    this.xScale = scaleLinear()
      .domain([0, 1.05])
      .range([this.MARGIN.LEFT, this.WIDTH - this.MARGIN.RIGHT]);

    // y-scale
    // this.yScale = scaleLinear().domain([0, 1.15]).range([this.HEIGHT, 0]);
    this.yScale = scaleLinear()
      .domain([0, 1.15])
      .range([this.HEIGHT - this.MARGIN.BOTTOM, this.MARGIN.TOP]);

    // color scale
    this.colorScale = scaleOrdinal()
      // .domain(extent(scatterData, (d) => d.Family))
      .domain(["ent_left", "ent_right", "ig"])
      .range([
        "rgba(40, 128, 28, 0.95)",
        "rgba(22, 120, 115, 0.95)",
        "rgba(89, 13, 70, 0.95)",
      ]);

    this.classScale = scaleOrdinal()
      .domain(["ent_left", "ent_right", "ig"])
      .range(["entropy-left", "entropy-right", "ig-line-ig"]);

    // define axes
    const xAxisGeneratorLoess = axisBottom(this.xScale)
      .ticks(4)
      .tickSizeOuter(0);

    const yAxisGeneratorLoess = axisLeft(this.yScale).tickSizeOuter(0).ticks(4);

    // add x-axis
    this.xAxis = this.lineG
      .append("g")
      .attr("class", "axis")
      .attr("id", "dt-scatter-x-axis")
      .call(xAxisGeneratorLoess)
      .attr("transform", `translate(0, ${this.HEIGHT - this.MARGIN.BOTTOM})`);

    // add y-axis
    this.yAxis = this.lineG
      .append("g")
      .attr("class", "axis")
      .attr("id", "dt-scatter-y-axis")
      .call(yAxisGeneratorLoess)
      .attr("transform", `translate(${this.MARGIN.LEFT}, 0)`);

    // add text labels
    this.xLabel = this.svg
      .append("text")
      .attr("class", "scatter-axis-text")
      .attr("x", this.MARGIN.LEFT)
      .attr("y", this.HEIGHT + this.MARGIN.TOP + this.MARGIN.BOTTOM)
      .attr("text-anchor", "left")
      .text("Diameter");

    // draw lines
    // init line generator
    let lineGen = line()
      .x((d) => this.xScale(d.Diameter))
      .curve(curveCatmullRom.alpha(0.8));

    // draw train/test lines
    const stages = ["ent_left", "ent_right", "ig"];
    stages.map((stage) => {
      //  update line generator for given stage
      lineGen.y((d) => this.yScale(d[`${stage}`]));

      // draw outline line for given stage
      this.lineG
        .append("path")
        .attr("class", "outline-line")
        .attr("id", `outline-line-${stage}`)
        .attr("d", lineGen(informationGainData));

      // draw line for given stage
      this.lineG
        .append("path")
        .attr("class", (d) => `${self.classScale(stage)} ig-line`)
        .attr("id", `ig-line-${stage}`)
        .attr("d", lineGen(informationGainData));
    });

    // add tooltip line
    this.line = this.lineG
      .append("line")
      .attr("id", "ig-line")
      .attr("x1", this.xScale(0.444))
      .attr("x2", this.xScale(0.444))
      .attr("y1", 0)
      .attr("y1", this.HEIGHT)
      .attr("fill", "none")
      .style("pointer-events", "none");
  }

  addTooltips() {
    const self = this;

    // Create the text that travels along the curve of chart
    self.igText = self.lineG
      .append("g")
      .append("text")
      .style("opacity", 1)
      .attr("class", "ig-tooltip-text")
      .attr("id", "ig-tooltip-ig")
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle")
      .html(`${format(".3f")(self.data[125].ent_left)}`)
      .attr("x", self.xScale(self.data[125].Diameter))
      .attr("y", self.yScale(self.data[125].ent_left));
    self.entTextL = self.lineG
      .append("g")
      .append("text")
      .style("opacity", 1)
      .attr("class", "ig-tooltip-text")
      .attr("id", "ig-tooltip-entLeft")
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle")
      .html(`${format(".3f")(self.data[125].ig)}`)
      .attr("x", self.xScale(self.data[125].Diameter))
      .attr("y", self.yScale(self.data[125].ig));
    self.entTextR = self.lineG
      .append("g")
      .append("text")
      .style("opacity", 1)
      .attr("class", "ig-tooltip-text")
      .attr("id", "ig-tooltip-entRight")
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle")
      .html(`${format(".3f")(self.data[125].ent_right)}`)
      .attr("x", self.xScale(self.data[125].Diameter))
      .attr("y", self.yScale(self.data[125].ent_right));

    // Create a rect on top of the svg area: this rectangle recovers mouse position
    self.lineG
      .append("rect")
      .style("fill", "none")
      .style("pointer-events", "all")
      .attr("width", this.WIDTH + this.MARGIN.LEFT + this.MARGIN.RIGHT)
      .attr("height", this.HEIGHT + this.MARGIN.TOP + this.MARGIN.BOTTOM)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseout", mouseout);

    [self.diameterMin, self.diameterMax] = extent(
      scatterData,
      (d) => +d.Diameter
    );
    // pad extents to make room for circles
    self.diameterMin += 0.025;
    self.diameterMax -= 0.016;

    // // What happens when the mouse move -> show the annotations at the right positions.
    function mouseover() {
      self.igText.style("opacity", 1);
      self.entTextL.style("opacity", 1);
      self.entTextR.style("opacity", 1);
    }

    function mousemove(event) {
      // recover coordinate we need
      var x0 = self.xScale.invert(pointer(event)[0]);
      var i = bisect(
        self.data.map((d) => d.Diameter),
        x0
      );
      let selectedData = self.data[i];
      self.entTextL
        .html(`${format(".3f")(selectedData.ent_left)}`)
        .attr("x", self.xScale(selectedData.Diameter))
        .attr("y", self.yScale(selectedData.ent_left));
      self.entTextR
        .html(`${format(".3f")(selectedData.ent_right)}`)
        .attr("x", self.xScale(selectedData.Diameter))
        .attr("y", self.yScale(selectedData.ent_right));
      self.igText
        .html(`${format(".3f")(selectedData.ig)}`)
        .attr("x", self.xScale(selectedData.Diameter))
        .attr("y", self.yScale(selectedData.ig));

      // update top chart
      if (x0 < self.diameterMin) {
        select("#entropy-scatter-line")
          .raise()
          .attr("x1", self.xScale(self.diameterMin))
          .attr("x2", self.xScale(self.diameterMin));
        select("#ig-line")
          .raise()
          .attr("x1", self.xScale(self.diameterMin))
          .attr("x2", self.xScale(self.diameterMin));
      } else if (x0 >= self.diameterMax) {
        select("#entropy-scatter-line")
          .raise()
          .attr("x1", self.xScale(self.diameterMax))
          .attr("x2", self.xScale(self.diameterMax));
        select("#ig-line")
          .raise()
          .attr("x1", self.xScale(self.diameterMax))
          .attr("x2", self.xScale(self.diameterMax));
      } else {
        select("#entropy-scatter-line")
          .raise()
          .attr("x1", self.xScale(selectedData.Diameter))
          .attr("x2", self.xScale(selectedData.Diameter));
        select("#ig-line")
          .raise()
          .attr("x1", self.xScale(selectedData.Diameter))
          .attr("x2", self.xScale(selectedData.Diameter));
      }

      // color circles
      select(`#entropy-chart-scatter-svg`)
        .selectAll("circle.ig-scatter-circle")
        .each(function (d) {
          select(this).attr("stroke-width", 2);
          if (d.Diameter < self.diameterMin) {
            select(this)
              .classed("entropy-right", false)
              .attr("class", "entropy-left ig-scatter-circle");
          } else if (d.Diameter >= self.diameterMax) {
            select(this)
              .classed("entropy-left", false)
              .attr("class", "entropy-right ig-scatter-circle");
          } else if (d.Diameter <= x0) {
            select(this)
              .classed("entropy-right", false)
              .attr("class", "entropy-left ig-scatter-circle");
          } else {
            select(this)
              .classed("entropy-left", false)
              .attr("class", "entropy-right ig-scatter-circle");
          }
        });
      select(`#entropy-chart-scatter-svg`).select(".dt-scatter-legend").raise();
      select(`#entropy-chart-ig-svg`).select(".dt-scatter-legend").raise();
    }
    function mouseout() {
      // reset horizontal tooltip line positions to max ig
      select("#entropy-scatter-line")
        .raise()
        .attr("x1", self.xScale(0.444))
        .attr("x2", self.xScale(0.444));
      select("#ig-line")
        .raise()
        .attr("x1", self.xScale(0.444))
        .attr("x2", self.xScale(0.444));
      // reset tooltip numbers to max ig
      select("#ig-tooltip-entLeft")
        .html(`${format(".3f")(self.data[125].ent_left)}`)
        .attr("x", self.xScale(self.data[125].Diameter))
        .attr("y", self.yScale(self.data[125].ent_left));
      select("#ig-tooltip-ig")
        .html(`${format(".3f")(self.data[125].ig)}`)
        .attr("x", self.xScale(self.data[125].Diameter))
        .attr("y", self.yScale(self.data[125].ig));
      select("#ig-tooltip-entRight")
        .html(`${format(".3f")(self.data[125].ent_right)}`)
        .attr("x", self.xScale(self.data[125].Diameter))
        .attr("y", self.yScale(self.data[125].ent_right));

      // recolor circles
      select(`#entropy-chart-scatter-svg`)
        .selectAll("circle.ig-scatter-circle")
        .each(function (d) {
          select(this).attr("stroke-width", 2);
          if (d.Diameter < self.diameterMin) {
            select(this)
              .classed("entropy-right", false)
              .attr("class", "entropy-left ig-scatter-circle");
          } else if (d.Diameter >= self.diameterMax) {
            select(this)
              .classed("entropy-left", false)
              .attr("class", "entropy-right ig-scatter-circle");
          } else if (d.Diameter <= 0.444) {
            select(this)
              .classed("entropy-right", false)
              .attr("class", "entropy-left ig-scatter-circle");
          } else {
            select(this)
              .classed("entropy-left", false)
              .attr("class", "entropy-right ig-scatter-circle");
          }
        });
    }
  }

  addLegend() {
    const self = this;
    const legendData = ["Entropy Left", "Information Gain", "Entropy Right"];
    const classScale = scaleOrdinal()
      .domain(["Entropy Left", "Information Gain", "Entropy Right"])
      .range(["entropy-left-circle", "ig-circle", "entropy-right-circle"]);
    const nodeWidth = (d) => d.getBBox().width;

    const legend = this.lineG
      .append("g")
      .attr("class", "dt-scatter-legend")
      .attr("transform", "translate(0,0)");

    const lg = legend.selectAll("g").data(legendData).enter().append("g");

    const legendCircle = lg
      .append("rect")
      .attr("width", 12)
      .attr("height", 7)
      .attr("y", 3)
      .attr("x", 1)
      .attr("stroke-width", 2)
      .attr("stroke", "rgb(197, 146, 189)")
      .attr("class", (d, i) => `${classScale(d)}`);
    lg.append("text")
      .attr("x", 15.5)
      .attr("y", 10)
      .attr("fill", "white")
      .style("color", "white")
      .text((d) => d);

    let offset = 0;
    let mobileOffset = igMobile ? 8 : 25;

    lg.attr("transform", function (d) {
      let x = offset;
      offset += nodeWidth(this) + mobileOffset;
      return `translate(${x}, ${0})`;
    });

    legend.attr("transform", function () {
      return `translate(${
        (self.WIDTH - nodeWidth(this)) / 2
      }, ${-self.MARGIN.TOP / 2})`;
    });
  }

  // initialize svg and params for chart
  initChartSvg(div) {
    // draw svg
    this.svg = select(`#${div}`)
      .append("svg")
      .attr("id", `${div}-svg`)
      .attr("width", this.WIDTH + this.MARGIN.LEFT + this.MARGIN.RIGHT)
      .attr("height", this.HEIGHT + this.MARGIN.TOP + this.MARGIN.BOTTOM);
    // .style("outline", "1px solid black");

    // append g to svg
    const g = this.svg
      .append("g")
      .attr("id", `${div}-g`)
      .attr("transform", `translate(${this.MARGIN.LEFT}, ${this.MARGIN.TOP})`);

    return g;
  }
}
