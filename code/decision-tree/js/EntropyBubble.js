import { select, selectAll } from "d3-selection";
import { transition } from "d3-transition";
import { scaleLinear, scaleOrdinal } from "d3-scale";
import { max, range } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import { line } from "d3-shape";
import { format } from "d3-format";
import {
  forceCollide,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from "d3-force";

function entropy(data) {
  // track data length (used a couple times)
  const n = data.length;
  // empty data has entropy of zero
  if (n <= 1) {
    return 0;
  }
  // init counter
  const counts = {};
  // count occurrences of elements in data
  for (const d of data) {
    counts[d] = counts[d] ? counts[d] + 1 : 1;
  }
  // start entropy at 0
  let entropyValue = 0;
  // loop through data and calculate entropy
  Object.keys(counts).forEach((c) => {
    // get relative frequency of item
    const prob = counts[c] / n;
    // if > 0, tally entropy
    if (prob > 0) {
      entropyValue -= prob * Math.log2(prob);
    }
  });
  return entropyValue;
}

function prob(data) {
  // track data length (used a couple times)
  const n = data.length;
  // empty data has entropy of zero
  if (n < 1) {
    return 0.5;
  }
  // init counter
  const counts = {};
  // count occurrences of elements in data
  for (const d of data) {
    counts[d] = counts[d] ? counts[d] + 1 : 1;
  }
  //  ensure value for class so no NaN
  counts["positive"] = counts["positive"] ? counts["positive"] : 0;
  return counts["positive"] / n;
}

function distance([x1, y1], [x2, y2]) {
  Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

const mmobile = window.innerWidth <= 850;

export class EntropyBubble {
  constructor(opts) {
    const self = this;
    // selections
    this.container = opts.chartContainer;

    // set size parameters for SVG
    this.MARGIN = {
      TOP: 0,
      BOTTOM: 0,
      LEFT: 0,
      RIGHT: 0,
    };
    const containerSize = select(`#${this.container}`)
      .node()
      .getBoundingClientRect();
    this.WIDTH = containerSize.width * 0.98;
    this.HEIGHT = containerSize.height * 0.9;

    // incrementor for entropy
    this.counters = {
      positive: 3,
      negative: 3,
    };
    this.split = true;
    this.numCirclesPerGroup = 25;
    this.radius = mmobile ? 4.5 : 7;
    this.boundingOffset = mmobile ? 2 : 4;
    this.bc_radius = 56 - this.boundingOffset * 1.8;

    this.nodes = Array.from(
      { length: this.numCirclesPerGroup * 2 },
      (_, i) => ({
        idx: i % this.numCirclesPerGroup,
        value: i % 2 === 0 ? "negative" : "positive",
      })
    );
    this.chartHeight = this.HEIGHT / 2;

    this.entroypG = this.initChartSvg(this.container);
    this.addScales();
    this.drawEntropyLine();
    this.addButtons();
    // draw bounding circle
    this.entroypG
      .append("circle")
      .attr("id", "bounding-circle")
      .attr("cx", this.positionXScale(5))
      .attr("cy", this.chartHeight)
      .style("fill", "none")
      .style("stroke", "white")
      .style("stroke-width", 1.4)
      .attr("fill-opacity", 0.4);

    this.simulation = forceSimulation(self.nodes)
      .force("charge", forceManyBody().strength(-2))
      .force(
        "x",
        forceX((d, i) =>
          d.value === "positive"
            ? self.positions.positive.x
            : self.positions.negative.x
        ).strength(0.055)
      )
      .force("y", forceY().strength(0.05).y(self.chartHeight))
      .force("collide", forceCollide().radius(self.radius + 1))
      .alphaDecay(0)
      .on("tick", ticked);

    this.node = this.entroypG
      .append("g")
      .selectAll("circle")
      .data(self.nodes)
      .join("circle")
      .attr("r", self.radius)
      .attr("fill", (d) => self.colorScale(d.value))
      .attr("stroke", "white");

    // add center labels
    this.centerLabelsGroup = this.entroypG.append("g");

    this.centerLabels = this.centerLabelsGroup
      .selectAll(".center-label")
      .data(["Entropy: ", "# Positive Class: ", "# Negative Class: "])
      .join("text")
      .attr("class", "center-label")
      .attr("id", (d, i) => `entropy-label-${i}`)
      .text((d) => d)
      .attr("x", this.WIDTH / 2 - 0)
      .attr("y", (d, i) => i * 20 + 30)
      .attr("text-anchor", "middle");

    function ticked() {
      // reposition nodes
      self.node
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", (d) => self.radius);
    }

    // initialize with values tallied
    for (const value of ["positive", "negative"]) {
      self.node
        .filter((d) => d.value === value)
        .each((d) => {
          if (d.idx < max([self.counters[value], 0])) {
            d.group = "center";
          } else {
            d.group = "non-center";
          }
        });
    }
    updateNodePositions();

    // moveNodes();
    selectAll("rect.entropy-button-rect").on("click", moveNodes);

    function updateNodePositions() {
      // tally entropy
      let posArr = Array.from({ length: self.counters["positive"] }).map(
        () => "positive"
      );
      let negArr = Array.from({ length: self.counters["negative"] }).map(
        () => "negative"
      );
      let entropyArr = posArr.concat(negArr);
      let currentProbability = prob(entropyArr);

      // update bounding circle based on length of entropyArr
      const n = entropyArr.length;

      // update center labels values
      selectAll("text.center-label").text((d, i) => {
        if (i === 0) {
          return `Entropy: ${format(".3f")(entropy(entropyArr))}`;
        } else if (i === 1) {
          return `# Positive Class:  ${self.counters["positive"]}`;
        } else {
          return `# Negative Class:  ${self.counters["negative"]}`;
        }
      });

      self.positions.center.x = self.xScale(currentProbability);
      self.updatedYPos = self.yScale(entropy(entropyArr));
      select("#bounding-circle")
        .style("stroke-width", () => (entropyArr.length > 0 ? 1.4 : 0))
        .transition()
        .attr("cx", self.xScale(currentProbability))
        .attr("cy", self.updatedYPos)
        .attr("r", (d) => self.boundingCircleScale(entropyArr.length));

      // re-run force simulation
      self.simulation
        .force(
          "x",
          forceX((d, i) => {
            if (d.group === "center") {
              return self.positions.center.x;
            }
            return d.value === "positive"
              ? self.positions.positive.x
              : self.positions.negative.x;
          }).strength(0.055)
        )
        .force(
          "y",
          forceY((d, i) => {
            if (d.group !== "center") {
              return self.chartHeight;
            }
            return self.updatedYPos;
          }).strength(0.055)
        )

        .force("bound-inner-dots", () => {
          self.node
            .filter((d) => d.group === "center")
            .each((d) => {
              // once node is inside the bounding circle (plus some padding to account for collide radius)
              // assign data to mark, so we can then bound it in the following force
              if (
                distance([d.x, d.y], [self.WIDTH / 2, self.updatedYPos]) <
                self.bc_radius + self.boundingOffset
              ) {
                d.isBounded = true;
                const theta = Math.atan(
                  (node.y - self.updatedYPos) / (node.x - self.WIDTH / 2)
                );
                node.x =
                  self.WIDTH / 2 +
                  self.bc_radius *
                    Math.cos(theta) *
                    (node.x < self.WIDTH / 2 ? -1 : 1);
                node.y =
                  self.updatedYPos +
                  self.bc_radius *
                    Math.sin(theta) *
                    (node.x < self.WIDTH / 2 ? -1 : 1);
              }
            });
        })
        .on("tick", ticked);
      self.simulation.alpha(1).restart();
    }

    function moveNodes() {
      // resolve current button Id
      const buttonId = this.id;
      // resolve if positive or negative button
      const positiveOrNegative = buttonId.split("-")[0];
      // resolve if adding or removing
      const addOrRemove = buttonId.split("-")[1];

      // increment counter for given stage
      if (addOrRemove === "add") {
        if (self.counters[positiveOrNegative] < self.numCirclesPerGroup - 1) {
          self.counters[positiveOrNegative]++;
        }
      } else {
        if (self.counters[positiveOrNegative] > 0) {
          // prevent negative counts
          self.counters[positiveOrNegative]--;
        }
      }

      // update data assignment (so can track previous state assignments)
      // how to add force AFTER simulation
      self.node
        .filter((d) => d.value === positiveOrNegative)
        .each((d) => {
          if (d.idx < max([self.counters[positiveOrNegative], 0])) {
            d.group = "center";
          } else {
            d.group = "non-center";
          }
        });
      updateNodePositions();
    }

    // moveNodes();
  }

  addButtons() {
    // // add buttons to svg as rects
    const borderMarginX = mmobile ? 8 : 12;
    const borderMarginY = mmobile ? 3 : 5;
    const self = this;
    this.buttonData = [
      { class: "positive", stage: "add", label: "Add" },
      { class: "positive", stage: "remove", label: "Remove" },
      { class: "negative", stage: "add", label: "Add" },
      { class: "negative", stage: "remove", label: "Remove" },
    ];

    this.entroypG
      .selectAll(".entropy-button-text")
      .data(this.buttonData)
      .join("text")
      .attr("class", "entropy-button-text")
      .attr("text-anchor", "middle")
      .attr("x", (d) =>
        d.class === "positive"
          ? self.positionXScale(0)
          : self.positionXScale(10)
      )
      .attr("y", (d) =>
        d.stage === "add" ? self.positionYScale(9.5) : self.positionYScale(11)
      )
      .text((d) => d.label);

    // add bbox elements to data
    // note, this has to be done after
    // adding text to dom, so we can
    // get correct bbox of text elements
    this.entroypG
      .selectAll(".entropy-button-text")
      .join(this.buttonData)
      .each(function (d) {
        d.bbox = this.getBBox();
      });

    // add box around text to mimic button
    this.entroypG
      .selectAll(".entropy-button-rect")
      .data(this.buttonData)
      .join("rect")
      .attr("class", "entropy-button-rect")
      .attr("id", (d) => `${d.class}-${d.stage}`)
      .attr("text-anchor", "middle")
      // .attr("x", (d) => this.groups[d.name].x - d.bbox.width * 0.5)
      .attr("x", (d) =>
        d.class === "positive"
          ? self.positionXScale(10) - d.bbox.width * 0.5
          : self.positionXScale(0) - d.bbox.width * 0.5
      )
      .attr("y", (d) =>
        d.stage === "add" ? self.positionYScale(9.5) : self.positionYScale(11)
      )
      .attr("width", (d) => d.bbox.width + 2 * borderMarginX)
      .attr("height", (d) => d.bbox.height + 2 * borderMarginY)
      .attr("transform", function (d) {
        return `translate(-${borderMarginX}, -${d.bbox.height * 0.8 + borderMarginY})`;
      })
      // .attr("visibility", "hidden")
      .attr("stroke", (d) => "white");

    // raise text over box
    this.entroypG.selectAll("text.entropy-button-text").raise();
  }

  drawEntropyLine() {
    const self = this;
    // loop and create permutations of samples for self.numCirclesPerGroup
    let permutations = [];
    let data = [];

    for (let i = 0; i <= self.numCirclesPerGroup; ++i) {
      let j = self.numCirclesPerGroup - i;
      // add i positive cases
      let positiveSamples = new Array(j).fill("positive");
      // append j negative cases
      let negativeSamples = new Array(i).fill("negative");

      let permutation = positiveSamples.concat(negativeSamples);
      // append to permutations array
      permutations.push(permutation);
      // create data for plot
      data.push({
        entropy: entropy(permutation),
        x: prob(permutation),
      });
    }

    // Create entropy plot
    const padding = 50;

    const areaGradient = this.svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "areaGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    areaGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "rgb(188, 111, 177)")
      .attr("stop-opacity", 0.76);
    areaGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "white")
      .attr("stop-opacity", 0);

    this.xScale = scaleLinear()
      .domain([0, 1])
      .range([this.positionXScale(2), this.positionXScale(8)]);
    // .range([padding, this.WIDTH - padding])6

    this.yScale = scaleLinear()
      .domain([0, 1])
      .range([this.HEIGHT - padding, padding * 3]);

    // add axes
    // x
    this.entroypG
      .append("g")
      .attr("id", "entropy-x-axis")
      .attr("transform", `translate(${0}, ${this.HEIGHT - padding})`)
      .call(
        axisBottom(this.xScale)
          .tickFormat((x) => `${format(".0%")(x)}`)
          .ticks(5)
      );
    // y
    this.entroypG
      .append("g")
      .attr("id", "entropy-y-axis")
      .attr("transform", `translate(${self.positionXScale(2)}, 0)`)
      .call(
        axisLeft(this.yScale)
          .tickSize(-self.positionXScale(9) + self.positionXScale(3))
          .tickSizeOuter(0)
          .ticks(4)
      );
    // draw line
    this.entroypG
      .append("path")
      .datum(data)
      .style("fill", "url(#areaGradient)")
      .attr("stroke", "rgb(188, 111, 177)")
      .attr("stroke-width", 6)
      .attr(
        "d",
        line()
          .x((d) => this.xScale(d.x))
          .y((d) => this.yScale(d.entropy))
      );

    // // add title
    this.entroypG
      .append("text")
      .attr("class", "entropy-x-axis")
      .text(`Proportion of Positive Class`)
      .attr("x", this.WIDTH / 2)
      .attr("y", this.HEIGHT - padding + 40)
      .attr("text-anchor", "middle");

    this.entroypG
      .append("text")
      .text(mmobile ? "Negative" : "Negative Class")
      .attr("x", self.positionXScale(0))
      .attr("y", self.positionYScale(4))
      .attr("text-anchor", "middle")
      .attr("class", "entropy-class-label");

    this.entroypG
      .append("text")
      .text(mmobile ? "Positive" : "Positive Class")
      .attr("x", self.positionXScale(10))
      .attr("y", self.positionYScale(4))
      .attr("text-anchor", "middle")
      .attr("class", "entropy-class-label");
  }

  // initialize svg and params for chart
  initChartSvg(div) {
    // draw svg
    this.svg = select(`#${div}`)
      .append("svg")
      .attr("id", `${div}-svg`)
      .attr("width", this.WIDTH + this.MARGIN.LEFT + this.MARGIN.RIGHT)
      .attr("height", this.HEIGHT + this.MARGIN.TOP + this.MARGIN.BOTTOM)
      .style("background-color", "rgba(0,0,0,0");

    // append g to svg
    const g = this.svg
      .append("g")
      .attr("id", `${div}-g`)
      .attr("transform", `translate(${this.MARGIN.LEFT}, ${this.MARGIN.TOP})`);

    return g;
  }

  addScales() {
    const self = this;
    const nSplits = 12;
    const nYSplits = 15;
    this.positionXScale = scaleLinear()
      .domain([-1, nSplits - 1])
      .range([this.MARGIN.LEFT, this.WIDTH - this.MARGIN.RIGHT]);

    this.positionYScale = scaleLinear()
      .domain([-1, nYSplits - 1])
      .range([0, this.HEIGHT]);

    this.boundingCircleScale = scaleLinear()
      .domain(range(0, self.numCirclesPerGroup * 2 + 20))
      .range(mmobile ? range(5.95, 7) : range(20, 22.5));

    this.colorScale = scaleOrdinal()
      .domain(["positive", "negative"])
      .range(["teal", "deeppink"]);

    this.positions = {
      negative: {
        x: this.positionXScale(0),
        y: this.positionYScale(4),
      },
      positive: {
        x: this.positionXScale(nSplits - 2),
        y: this.positionYScale(4),
      },
      center: {
        x: this.positionXScale(nSplits / 2),
        y: this.positionYScale(4),
      },
    };
  }
}
