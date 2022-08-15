import { pointer, select, selectAll } from "d3-selection";
import { transition } from "d3-transition";
import { scaleLinear, scaleOrdinal } from "d3-scale";
import { bisect, extent, range } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import { drag } from "d3-drag";
import { format } from "d3-format";
// import { informationGainData, this.data } from "./data";

export class Scatter {
  constructor(opts) {
    const self = this;
    // selections
    this.container = opts.chartContainer;
    // this.linkedChart = opts.linkedChart;
    this.data = opts.data;

    this.MARGIN = { TOP: 15, BOTTOM: 20, LEFT: 25, RIGHT: 20 };
    // const containerSize = select(`#static-chart`)
    //   .node()
    //   .getBoundingClientRect();
    this.WIDTH = 1000 * 0.98 - this.MARGIN.LEFT - this.MARGIN.RIGHT;
    this.HEIGHT = 800 * 0.9 - this.MARGIN.TOP - this.MARGIN.BOTTOM;

    // incrementor for entropy
    this.counters = {
      positive: 3,
      negative: 3,
    };
    this.split = true;
    this.circleSize = 7;
    this.radius = 7;
    this.boundingOffset = 4;
    this.bc_radius = 56 - this.boundingOffset * 1.8;

    this.chartHeight = this.HEIGHT / 2;

    // this.entroypG = this.initChartSvg(this.container);
    this.scatterG = this.initChartSvg("#static-chart");
    [self.diameterMin, self.diameterMax] = extent(
      this.data,
      (d) => +d.Diameter
    );
    // pad extents to make room for circles
    self.diameterMin += 0.025;
    self.diameterMax -= 0.016;
    this.drawScatter();
    // this.addTooltips();
  }

  drawScatter() {
    const self = this;
    // set up svg

    // define scales
    // x-scale
    this.xScale = scaleLinear()
      .domain([0, 1.05])
      .range([this.MARGIN.LEFT, this.WIDTH - this.MARGIN.RIGHT]);

    // y-scale
    this.yScale = scaleLinear()
      .domain([0, 16])
      .range([this.HEIGHT - this.MARGIN.BOTTOM, this.MARGIN.TOP]);

    // color scale
    this.colorScale = scaleOrdinal()
      // .domain(extent(this.data, (d) => d.Family))
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
      .attr("transform", `translate(0, ${this.HEIGHT - this.MARGIN.BOTTOM})`);

    // add y-axis
    this.yAxis = this.scatterG
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

    // this.svg
    //   .append("text")
    //   .attr("class", "scatter-axis-text")
    //   .attr("x", -this.MARGIN.TOP - this.MARGIN.BOTTOM)
    //   .attr("y", this.MARGIN.LEFT / 4)
    //   .attr("text-anchor", "middle")
    //   .text("Height")
    //   .attr("transform", "rotate(-90)");

    this.circles = this.scatterG
      .selectAll("circle.ig-scatter-circle")
      .data(this.data)
      .enter()
      .append("circle")
      .attr("class", "ig-scatter-circle")
      .attr("r", this.circleSize)
      .attr("fill", (d) => this.colorScale(d.Family))
      .attr("cx", (d) => this.xScale(+d.Diameter))
      .attr("cy", (d) => this.yScale(+d.Height))
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .attr("fill-opacity", 1);

    // add tooltip line
    this.line = this.scatterG
      .append("line")
      .attr("id", "entropy-scatter-line")
      .attr("x1", this.xScale(0.444))
      .attr("x2", this.xScale(0.444))
      .attr("y1", 0)
      .attr("y1", this.HEIGHT)
      .attr("fill", "none")
      .style("pointer-events", "none");

    // add legend
    this.addLegend();
  }

  addTooltips() {
    const self = this;

    // Create a rect on top of the svg area: this rectangle recovers mouse position
    self.scatterG
      .append("rect")
      .style("fill", "none")
      .style("pointer-events", "all")
      .attr("width", this.WIDTH + this.MARGIN.LEFT + this.MARGIN.RIGHT)
      .attr("height", this.HEIGHT + this.MARGIN.TOP + this.MARGIN.BOTTOM)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseout", mouseout);

    // // What happens when the mouse move -> show the annotations at the right positions.
    function mouseover() {
      console.log("over");
      select("#ig-tooltip-ig").style("opacity", 1);
      select("#ig-tooltip-entLeft").style("opacity", 1);
      select("#ig-tooltip-entRight").style("opacity", 1);
    }

    function mousemove(event) {
      // recover coordinate we need

      var x0 = self.xScale.invert(pointer(event)[0]);
      var i = bisect(
        informationGainData.map((d) => d.Diameter),
        x0
      );
      let selectedData = informationGainData[i];
      select("#ig-tooltip-entLeft")
        .html(`${format(".3f")(selectedData.ent_left)}`)
        .attr("x", self.xScale(selectedData.Diameter))
        .attr("y", self.linkedChart.yScale(selectedData.ent_left));
      select("#ig-tooltip-entRight")
        .html(`${format(".3f")(selectedData.ent_right)}`)
        .attr("x", self.xScale(selectedData.Diameter))
        .attr("y", self.linkedChart.yScale(selectedData.ent_right));
      select("#ig-tooltip-ig")
        .html(`${format(".3f")(selectedData.ig)}`)
        .attr("x", self.xScale(selectedData.Diameter))
        .attr("y", self.linkedChart.yScale(selectedData.ig));

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
          .attr("x2", self.xScale(selectedData.Diameter)); //.attr("y1", d.y = event.y);
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
        .html(`${format(".3f")(informationGainData[125].ent_left)}`)
        .attr("x", self.xScale(informationGainData[125].Diameter))
        .attr("y", self.linkedChart.yScale(informationGainData[125].ent_left));
      select("#ig-tooltip-ig")
        .html(`${format(".3f")(informationGainData[125].ig)}`)
        .attr("x", self.xScale(informationGainData[125].Diameter))
        .attr("y", self.linkedChart.yScale(informationGainData[125].ig));
      select("#ig-tooltip-entRight")
        .html(`${format(".3f")(informationGainData[125].ent_right)}`)
        .attr("x", self.xScale(informationGainData[125].Diameter))
        .attr("y", self.linkedChart.yScale(informationGainData[125].ent_right));

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
    const that = this;
    const legendData = [...new Set(this.data.map((d) => d.Family))];

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
        i % 2 == 0 ? "dt-scatter-train" : "ig-scatter-circle"
      )
      .attr("cy", 5)
      .attr("cx", 1)
      .attr("stroke-width", 1)
      .attr("stroke", "rgb(245, 180, 178)")
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
  initChartSvg(div) {
    // draw svg
    this.svg = select(`${div}`)
      .append("svg")
      .attr("id", `${div}-svg`)
      .attr("width", this.WIDTH + this.MARGIN.LEFT + this.MARGIN.RIGHT)
      .attr("height", this.HEIGHT + this.MARGIN.TOP + this.MARGIN.BOTTOM)
      .style("outline", "1px solid black");

    // append g to svg
    const g = this.svg
      .append("g")
      .attr("id", `${div}-g`)
      .attr("transform", `translate(${this.MARGIN.LEFT}, ${this.MARGIN.TOP})`);

    return g;
  }
}
