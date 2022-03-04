import * as d3 from "d3";
import { transition } from "d3";
import { circles, sample1, sample2, sample3 } from "./data";
import {
  pentagonIn,
  pentagonOut,
  stopIn,
  stopOut,
  triangleIn,
  triangleOut,
} from "./roadSigns";
import textures from "textures";

export class Bagging {
  constructor(opts) {
    this.chartContainer = opts.chartContainer;
    this.numSamples = 3;
    this.dataCenter; //This is for drawing the largest circle.
    this.sampleSize = 15;
    d3.select(this.chartContainer)
      .append("g")
      .attr("class", "baggingAnimation"); //Add a g element to contain the animation
    this.sizingChart(); //This makes sure the dimension is working correctly
    this.drawInitialCircles(); //This is to ensure that the elements are created only once
  }
  sizingChart() {
    const chartContainerProperties = d3
      .select(this.chartContainer)
      .node()
      .getBoundingClientRect();
    this.height = chartContainerProperties.height;
    this.width = chartContainerProperties.width;
    this.size = Math.min(this.height, this.width);
    this.root = d3
      .selectAll(".baggingAnimation")
      .attr("transform", `translate(${this.width / 2}, ${this.height / 3})`);
    // The below are bags for samples.
    this.dataPrep(); //This preps this.data and this.samples.
  }
  dataPrep() {
    const rScale = d3 // scale function for the radius of the data points
      .scaleLinear()
      .domain([0, 16])
      .range([0, this.size / 50]);
    const data = circles; //This is the original dataset to draw samples
    const dataCopy = JSON.parse(JSON.stringify(data));
    dataCopy.map((d) => {
      d.r = rScale(d.r);
    }); //Scale before packing.
    this.packData = d3.packSiblings(dataCopy); //This is the dataset that has packing information
    this.dataCenter = d3.packEnclose(this.packData);
    this.drawBag(this.dataCenter, 0, 0);
    this.samples = []; //This holds the samples
    this.sampleIDs = []; //This holds the ID for samples to attach icons/shapes.
    this.originalPositions = []; //this holds the original position of the samples.
    this.sampleIDs.push(sample1);
    this.sampleIDs.push(sample2);
    this.sampleIDs.push(sample3);
    this.packSamples = []; //This holds the packed samples
    this.sampleLocation = [true, true, true]; // True = the samples are in the big bag.
    for (let sampleNumber = 0; sampleNumber < this.numSamples; sampleNumber++) {
      this.originalPositions[sampleNumber] = [];
      this.samples[sampleNumber] = [];
      this.sampleIDs[sampleNumber].map((i) =>
        this.samples[sampleNumber].push(this.packData[i])
      );
      this.packSamples[sampleNumber] = d3.packSiblings(
        JSON.parse(JSON.stringify(this.samples[sampleNumber]))
      );
    }
    this.sampleCenters = new Array(this.numSamples);
    for (let i = 0; i < this.numSamples; i++) {
      this.sampleCenters[i] = d3.packEnclose(
        JSON.parse(JSON.stringify(this.packSamples[i]))
      );
    }
  }
  resize() {
    d3.select(this.chartContainer).selectAll(".baggingAnimation").remove();
    d3.select(this.chartContainer)
      .append("g")
      .attr("class", "baggingAnimation"); //Add a g element to contain the animation
    this.sizingChart(); //This makes sure the dimension is working correctly
    this.drawInitialCircles(); //This is to ensure that the elements are created only once
  }
  drawCircle = (data, i) => {
    this.root
      .append("circle")
      .attr("class", `movingCircle${i}`)
      .attr("cx", data.x)
      .attr("cy", data.y)
      .attr("r", 0)
      .attr("fill", "#f0f");
  };
  drawShape = (data, i, id) => {
    let container = this.bag0;
    if (i === 1) container = this.bag1;
    else if (i === 2) container = this.bag2;
    if (id % 5 == 0) {
      //Octogon
      this.originalPositions[i].push(
        `translate(${data.x - data.r},${data.y - data.r})`
      );
      let icon = container
        .append("g")
        .attr("class", `movingCircle${i}`)
        .attr("id", id)
        .attr("transform", `translate(${data.x - data.r},${data.y - data.r})`)
        .attr("opacity", 0);
      icon = icon
        .append("svg")
        .attr("height", `${2 * data.r}`)
        .attr("width", `${2 * data.r}`)
        .attr("viewBox", `0 0 512 512`);
      icon.append("path").attr("d", stopOut).attr("fill", "white");
      icon.append("path").attr("d", stopIn).attr("fill", "red");
    } else if (id % 5 == 1) {
      // Circles
      this.originalPositions[i].push(`translate(${data.x},${data.y})`);
      let icon = container
        .append("g")
        .attr("class", `movingCircle${i}`)
        .attr("id", "circleSign")
        .attr("opacity", 0)
        .attr("transform", `translate(${data.x},${data.y})`);
      icon
        .append("circle")
        //.attr("cx", data.x)
        //.attr("cy", data.y)
        .attr("r", data.r)
        .attr("fill", "#E24C4B");
      icon
        .append("circle")
        //.attr("cx", data.x)
        //.attr("cy", data.y)
        .attr("r", data.r * 0.7)
        .attr("fill", "white");
    } else if (id % 5 == 2) {
      // Rhombus
      this.originalPositions[i].push(
        `translate(${data.x - data.r},${data.y - data.r})`
      );

      let icon = container
        .append("g")
        .attr("class", `movingCircle${i}`)
        .attr("id", id)
        .attr("transform", `translate(${data.x - data.r},${data.y - data.r})`)
        .attr("opacity", 0);

      icon = icon
        .append("svg")
        .attr("height", `${2 * data.r}`)
        .attr("width", `${2 * data.r}`)
        .attr("viewBox", `0 0 60 60`);

      icon
        .append("rect")
        .attr("fill", "#e6d93c")
        .attr("height", "42.19")
        .attr("rx", "3")
        .attr("ry", "3")
        .attr("transform", "matrix(.707 .707 -.707 .707 30.002 -12.425)")
        .attr("width", "42.19")
        .attr("x", "8.905")
        .attr("y", "8.908")
        .attr("stroke", "black")
        .attr("stroke-width", "3");
    } else if (id % 5 == 3) {
      // triangle
      this.originalPositions[i].push(
        `translate(${data.x - data.r},${data.y - data.r})`
      );

      let icon = container
        .append("g")
        .attr("class", `movingCircle${i}`)
        .attr("id", id)
        .attr("transform", `translate(${data.x - data.r},${data.y - data.r})`)
        .attr("opacity", 0);
      icon = icon
        .append("svg")
        .attr("height", `${data.r + data.r / 1.732}`) // 1.732 = root (3)
        .attr("width", `${2 * data.r}`)
        .attr("viewBox", `0 -26 512.03432 512`);
      icon.append("path").attr("d", triangleOut).attr("fill", "red");
      icon.append("path").attr("d", triangleIn).attr("fill", "white");
    } else {
      //Pentagon
      this.originalPositions[i].push(
        `translate(${data.x - data.r},${data.y - data.r})`
      );

      let icon = container
        .append("g")
        .attr("class", `movingCircle${i}`)
        .attr("id", id)
        .attr("transform", `translate(${data.x - data.r},${data.y - data.r})`)
        .attr("opacity", 0);
      icon = icon
        .append("svg")
        .attr("height", `${data.r + data.r / 1.41}`) // 1.41 = root (2)
        .attr("width", `${2 * data.r}`)
        .attr("viewBox", `0 0 64 64`);
      icon.append("path").attr("d", pentagonOut).attr("fill", "black");
      icon.append("path").attr("d", pentagonIn).attr("fill", "#a3d6e3");
    }
  };
  drawStaticCircle = (data, i) => {
    if (i % 5 == 0) {
      //Octogon
      let icon = this.bigbag
        .append("g")
        .attr("class", "stop")
        .attr("transform", `translate(${data.x - data.r},${data.y - data.r})`);
      icon = icon
        .append("svg")
        .attr("height", `${2 * data.r}`)
        .attr("width", `${2 * data.r}`)
        .attr("viewBox", `0 0 512 512`);
      icon.append("path").attr("d", stopOut).attr("fill", "white");
      icon.append("path").attr("d", stopIn).attr("fill", "red");
    } else if (i % 5 == 1) {
      // Circles
      let icon = this.bigbag
        .append("g")
        .attr("class", "circle")
        .attr("transform", `translate(${data.x},${data.y})`);
      icon
        .append("circle")
        //.attr("cx", data.x)
        //.attr("cy", data.y)
        .attr("r", data.r)
        .attr("fill", "#E24C4B");
      icon
        .append("circle")
        //.attr("cx", data.x)
        //.attr("cy", data.y)
        .attr("r", data.r * 0.7)
        .attr("fill", "white");
    } else if (i % 5 == 2) {
      // Rhombus
      let icon = this.bigbag
        .append("g")
        .attr("class", "rhombus")
        .attr("transform", `translate(${data.x - data.r},${data.y - data.r})`);

      icon = icon
        .append("svg")
        .attr("height", `${2 * data.r}`)
        .attr("width", `${2 * data.r}`)
        .attr("viewBox", `0 0 60 60`);

      icon
        .append("rect")
        .attr("fill", "#e6d93c")
        .attr("height", "42.19")
        .attr("rx", "3")
        .attr("ry", "3")
        .attr("transform", "matrix(.707 .707 -.707 .707 30.002 -12.425)")
        .attr("width", "42.19")
        .attr("x", "8.905")
        .attr("y", "8.908")
        .attr("stroke", "black")
        .attr("stroke-width", "3");
    } else if (i % 5 == 3) {
      // triangle
      let icon = this.bigbag
        .append("g")
        .attr("class", "triangle")
        .attr("transform", `translate(${data.x - data.r},${data.y - data.r})`);
      icon = icon
        .append("svg")
        .attr("height", `${data.r + data.r / 1.732}`) // 1.732 = root (3)
        .attr("width", `${2 * data.r}`)
        .attr("viewBox", `0 -26 512.03432 512`);
      icon.append("path").attr("d", triangleOut).attr("fill", "red");
      icon.append("path").attr("d", triangleIn).attr("fill", "white");
    } else {
      //Pentagon
      let icon = this.bigbag
        .append("g")
        .attr("class", "pentagon")
        .attr("transform", `translate(${data.x - data.r},${data.y - data.r})`);
      icon = icon
        .append("svg")
        .attr("height", `${data.r + data.r / 1.41}`) // 1.41 = root (2)
        .attr("width", `${2 * data.r}`)
        .attr("viewBox", `0 0 64 64`);
      icon.append("path").attr("d", pentagonOut).attr("fill", "black");
      icon.append("path").attr("d", pentagonIn).attr("fill", "#a3d6e3");
    }
  };
  drawBag = (data, xshift, yshift) => {
    const bagTexture = textures
      .paths()
      .d("woven")
      .lighter()
      //.shapeRendering("crispEdges")
      //.size(5)
      .stroke("#847c5c")
      .background("#69455e");
    this.root.call(bagTexture);

    this.root
      .append("circle")
      .attr("class", "bigBag")
      .attr("cx", data.x + xshift)
      .attr("cy", data.y + yshift)
      .attr("r", data.r * 1.1) // The enclosing circle is slightly bigger
      .attr("fill", bagTexture.url());
  };
  drawSmallBag = (data, xshift, yshift, index) => {
    let container = this.bag0;
    if (index === 1) container = this.bag1;
    else if (index === 2) container = this.bag2;
    container
      .append("circle")
      .attr("class", `smallBag${index}`)
      .attr("cx", data.x + xshift)
      .attr("cy", data.y + yshift)
      .attr("r", 0)
      .attr("fill", "grey");
    container
      .append("text")
      .text(`Sample ${index + 1}`)
      .attr("class", `smallBagText${index}`)
      .attr("x", data.x + xshift) //change these numbers into scale
      .attr("y", data.y + yshift - this.size / 8)
      .attr("font-size", "0px")
      .style("text-anchor", "middle")
      .attr("font-color", "black");
  };
  // This methods generates all the sample circles but with radius zero so does not show up.
  // This is to ensure that the backward scroll does not generate new elements, instead, just updates
  // the existing elements.
  drawInitialCircles() {
    this.bigbag = this.root.append("g").attr("id", "bigBag");
    this.packData.map((d, i) => this.drawStaticCircle(d, i));
    this.bag0 = this.root.append("g").attr("id", "bag0");
    this.bag1 = this.root.append("g").attr("id", "bag1");
    this.bag2 = this.root.append("g").attr("id", "bag2");
    this.sampleCenters.map((center, j) =>
      this.drawSmallBag(
        center,
        // This only works for this.numSamples = 3
        center.x + (j - 1) * (this.width / (this.numSamples + 2)),
        center.y + this.size / 2,
        j
      )
    );
    this.samples.map((sample, j) =>
      sample.map((d, id) => this.drawShape(d, j, this.sampleIDs[j][id]))
    );
  }
  moveSamplesBack(sampleNumber) {
    let vis = this;
    let j = parseInt(sampleNumber);
    d3.selectAll(`.movingCircle${j}`)
      .data(vis.samples[j])
      .transition()
      .delay(() => sampleNumber * 100)
      .duration(700)
      .attr("transform", (d, i) => `${vis.originalPositions[j][i]}`)
      .transition()
      .duration(0)
      .attr("opacity", 0);
    d3.selectAll(`.smallBag${j}`)
      .data(vis.sampleCenters[j])
      .exit()
      .attr("r", 0);

    d3.selectAll(`.smallBagText${j}`)
      .data(vis.sampleCenters[j])
      .exit()
      .style("font-size", "0px");
    this.sampleLocation[j] = true; //Location: at the top
  }
  moveSamplesOut(sampleNumber) {
    let vis = this;
    let j = parseInt(sampleNumber);
    this.root.selectAll(".bigBag").attr("opacity", 1);
    this.bigbag.transition().attr("opacity", 1);
    this.bag0.transition().attr("transform", null);
    this.bag1.transition().attr("transform", null);
    this.bag2.transition().attr("transform", null);
    d3.selectAll(`.smallBag${j}`)
      .data(vis.sampleCenters[j])
      .exit()
      .attr("r", vis.sampleCenters[j].r * 1.1);
    d3.selectAll(`.smallBagText${j}`)
      .data(vis.sampleCenters[j])
      .exit()
      .style("font-size", () =>
        window.innerWidth > 600 ? `${this.width / 40}` : `${this.width / 25}`
      );
    if (vis.sampleLocation[j] === true) {
      const selection = d3.selectAll(`.movingCircle${j}`);
      const ids = selection._groups[0];
      selection
        .data(vis.packSamples[j])
        .attr("opacity", 1)
        .transition()
        .delay(() => sampleNumber * 200)
        .duration(700)
        .attr("transform", (d, i) =>
          ids[i].getAttribute("id") === "circleSign"
            ? `translate(${
                d.x + (j - 1) * (vis.width / (vis.numSamples + 2))
              }, ${d.y + vis.size / 2})`
            : `translate(${
                d.x - d.r + (j - 1) * (vis.width / (vis.numSamples + 2))
              }, ${d.y - d.r + vis.size / 2})`
        );
      this.sampleLocation[j] = false; //Location: at the bottom
    }
  }
  moveBack() {
    this.moveSamplesBack(0);
    this.moveSamplesBack(1);
    this.moveSamplesBack(2);
  }
  moveOut() {
    this.moveSamplesOut(0);
    this.moveSamplesOut(1);
    this.moveSamplesOut(2);
  }
  displayAllSamples() {
    // In case there isnt' enough time for bagging animation, still show the samples
    Array.from({ length: 3 }).map((d, i) =>
      d3.selectAll(`.movingCircle${i}`).attr("opacity", 1)
    );
  }
  removeData() {
    this.root.selectAll(".bigBag").transition().attr("opacity", 0);
    this.bigbag.transition().attr("opacity", 0);
    //TODO "-" doesn't work so well if the container is very tall.
    this.bag0
      .transition()
      .attr("transform", `translate(-${this.width / 15},-${this.height / 2})`);
    this.bag1
      .transition()
      .attr("transform", `translate(0,-${this.height / 2})`);
    this.bag2
      .transition()
      .attr("transform", `translate(${this.width / 15},-${this.height / 2})`);
  }
  removeTrainData() {
    this.root.selectAll(".bigBag").transition().attr("opacity", 0);
    this.bigbag.transition().attr("opacity", 0);
  }
}
