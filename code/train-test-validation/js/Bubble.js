import { event, select, selectAll } from "d3-selection";
import { transition } from "d3-transition";
import { LogisticRegression } from "./LogisticRegression";
import { animals } from "./data";
import { trainColor, testColor, validationColor } from "./colors";
import { extent, max } from "d3-array";
import { keys } from "d3-collection";
import {
  forceSimulation,
  forceCenter,
  forceX,
  forceY,
  forceManyBody,
  forceCollide,
} from "d3-force";
import { polygonCentroid, polygonHull } from "d3-polygon";
import { line } from "d3-shape";
import { drag } from "d3-drag";
import { easeBackInOut } from "d3-ease";
import { format } from "d3-format";
import { scaleLinear, scaleOrdinal } from "d3-scale";

import {
  catNose,
  catHead,
  catEar,
  dogNose,
  dogHead,
  dogEar,
} from "./animalShapes";

export class Bubble {
  constructor(opts) {
    // set selections
    this.chartContainer = opts.chartContainer;
    this.table = opts.table;

    let windowWidth = window.innerWidth;

    // set SVG size parameters
    this.MARGIN = {
      TOP: window.innerHeight * 0,
      BOTTOM: window.innerHeight * 0,
      LEFT: window.innerWidth * 0,
      RIGHT: window.innerWidth * 0,
    };
    this.WIDTH =
      window.innerWidth < 950 ? windowWidth / 1.15 : windowWidth / 1.75;
    this.HEIGHT =
      window.innerWidth < 950
        ? window.innerHeight / 1.8
        : window.innerHeight / 1.95;

    // easy to track main groups here for different group filterings later
    this.mainGroups = ["train", "test", "validation"];
    this.showGroups = ["train"];

    this.currentGroup = "pretrain";
    // need to track which data
    this.current = "intro";

    // chart constants
    this.yGroupHeight = this.HEIGHT / 4.6;
    this.yLabelHeight = 45;

    this.iconScale = window.innerWidth >= 950 ? 0.3 : 0.26;
    this.collideRadius = window.innerWidth >= 950 ? 16 : 12.5;

    this.radius = 7;

    this.padding = 9;
    this.cluster_padding = 10;
    this.strength = 0.2;

    // create svg
    this.svg = select(this.chartContainer)
      .append("svg")
      .attr("id", `bubble-svg`)
      .attr("width", this.WIDTH + this.MARGIN.LEFT + this.MARGIN.RIGHT)
      .attr("height", this.HEIGHT + this.MARGIN.TOP + this.MARGIN.BOTTOM);

    // g container for bubble chart
    this.chartG = this.svg
      .append("g")
      .attr("id", `bubble-g`)
      .attr("transform", `translate(${this.MARGIN.LEFT}, ${this.MARGIN.TOP})`);

    // Load data.
    this.data = animals;

    this.X = animals.map((d) => {
      return {
        weight: d.weight,
        fluffiness: d.fluffiness,
      };
    });

    // instantiate model
    this.model = new LogisticRegression({
      iterations: 10000,
      learningRate: 0.00025,
      startFeature: "weight",
    });

    this.currentFeature = this.model.startFeature;

    this.fluffScaleX = scaleLinear()
      .domain(extent(this.data, (d) => +d.fluffiness))
      .range([50, this.WIDTH - 50]);

    this.weightScaleX = scaleLinear()
      .domain(extent(this.data, (d) => +d.weight))
      .range([50, this.WIDTH - 50]);

    this.fluffScaleY = scaleLinear()
      .domain(extent(this.data, (d) => +d.fluffiness))
      .range([50, this.HEIGHT - 100]);

    this.weightScaleY = scaleLinear()
      .domain(extent(this.data, (d) => +d.weight))
      .range([50, this.HEIGHT - 100]);

    this.colorScale = scaleOrdinal()
      .domain(["train", "test", "validation"])
      .range([trainColor, testColor, validationColor]);

    // set groups
    // Group coordinates and meta info (update in redraw func)
    this.groups = {
      intro: {
        x: this.WIDTH / 2,
        y: this.HEIGHT / 2,
        fullname: "Intro",
      },
      test: {
        x: this.WIDTH / 5.5,
        y: this.yGroupHeight,
        fullname: "Test",
      },
      train: {
        x: this.WIDTH / 2,
        y: this.yGroupHeight,
        fullname: "Train",
      },
      validation: {
        x: this.WIDTH / 1.2,
        y: this.yGroupHeight,
        fullname: "Validation",
      },
      offscreen: {
        x: this.WIDTH / 2,
        y: -400,
        fullname: "offscreen",
      },
    };

    this.lineSeparator = this.chartG
      .append("line")
      .attr("id", "line-x-dimension")
      .attr("stroke", "black")
      .style("stroke-width", 2)
      .style("pointer-events", "none")
      .attr("vector-effect", "non-scaling-stroke")
      .style("opacity", 0.4);

    this.formatData();
    this.addLabels();
  }

  formatData() {
    // track class state for closures
    const self = this;
    // Force to increment nodes to groups.

    // Create node data.
    this.nodes = this.data.map((d) => {
      return {
        id: "node" + d.id,
        fluffiness: d.fluffiness,
        weight: d.weight,
        animal: d.animal,
        class: d.class,
        x: self.WIDTH / 2 + Math.random(),
        y: self.HEIGHT / 2 + Math.random(),
        r: self.radius,
        group: d.class,
        stages: d.class,
      };
    });

    this.labelData = keys(this.groups).map(function (d) {
      return {
        name: d,
      };
    });

    //  draw
    this.addAnmials();
    this.runForce();
    this.drawHull();
  }

  moveCenter() {
    const self = this;

    // Forces
    this.simulation
      .force("center", null)
      .force("x", (d) => forceX(d.x))
      .force("y", (d) => forceY(d.y))
      .force("charge", forceManyBody())
      .force("collide", forceCollide(this.collideRadius))
      .alpha(0.02)
      .alphaDecay(0)
      .on("tick", ticked);

    // get bounding box info for animals (for hull padding)
    const petDims = select("path.animal-head").node().getBBox();

    function ticked(d) {
      // determine how to nudge nodes during force
      const l = 0.1 * self.strength;
      self.nodes.forEach(function (d, i) {
        if (!self.showGroups.includes(d.group)) {
          d.vx -= (d.x - self.groups["offscreen"].x) * l;
          d.vy -= (d.y - self.groups["offscreen"].y) * l;
        } else {
          d.vx -= (d.x - self.groups["intro"].x) * l;
          d.vy -= (d.y - self.groups["intro"].y) * l;
        }
      });

      // this is required for nodes to position based on above
      self.bubbles.attr("transform", (d) => `translate(${d.x}, ${d.y})`);

      // hull constants
      const padding = 20;
      const inverseIconScale = 0.25;

      // init centroid for polygon
      let hullCentroid;
      let hullMinY;
      // update hull path
      self.hullPath.attr("d", (g) => {
        // init arr to store box coords around each pet centroid
        let petCoords = [];

        // loop nodes in view to generate centroid
        self.nodes
          .filter((d) => self.showGroups.includes(d.group))
          .map((d) => {
            // get centroids of each animal
            const centeredX = d.x + petDims.width * inverseIconScale;
            const centeredy = d.y + petDims.height * inverseIconScale;

            // store square points around centroid
            petCoords.push([centeredX - padding, centeredy - padding]);
            petCoords.push([centeredX - padding, centeredy + padding]);
            petCoords.push([centeredX + padding, centeredy - padding]);
            petCoords.push([centeredX + padding, centeredy + padding]);
          });

        // get convexHull data
        self.convexHullData = polygonHull(petCoords);

        // need to force closed hull (else gap exists)
        self.convexHullData.push(self.convexHullData[0]);
        hullMinY = max(self.convexHullData, (d) => d[1]);
        // track hull centroid
        hullCentroid = polygonCentroid(self.convexHullData);

        // generate svg path of convex hull
        return line()(self.convexHullData);
      });
      // update position of hull text
      self.hullText
        .attr("opacity", 1)
        .attr("x", hullCentroid[0])
        .attr("y", hullMinY)
        .attr("dy", "1.5rem");
    }
  }

  runForce() {
    const self = this;

    // Forces
    this.simulation = forceSimulation(this.nodes)
      .force("x", (d) => forceX(d.x))
      .force("y", (d) => forceY(d.y))
      .force("charge", forceManyBody())
      .force("center", forceCenter(this.WIDTH / 2, this.HEIGHT / 2))
      .force("collide", forceCollide(this.collideRadius))
      .alpha(0.09)
      .alphaDecay(0);

    function ticked() {
      // determine how to nudge nodes during force
      if (self.current === "intro") {
        const l = 0.1 * self.strength;
        self.nodes.forEach(function (d, i) {
          d.vx -= (d.x - self.groups["intro"].x) * l;
          d.vy -= (d.y - self.groups["intro"].y) * l;
        });
      } else if (self.current === "groups") {
        const l = 0.1 * self.strength;
        self.nodes.forEach(function (d, i) {
          d.vx -= (d.x - self.groups[d.group].x) * l;
          d.vy -= (d.y - self.groups[d.group].y) * l;
        });
      } else if (self.current === "bee") {
        const l = 0.1 * self.strength;
        self.nodes.forEach(function (d, i) {
          d.vx -= self.fluffScaleX(d.fluffiness) * l;
          d.vy -= (d.y - self.HEIGHT / 2) * l;
        });
      }

      // this is required for nodes to position based on above
      self.bubbles.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
    }

    // Adjust position of circles.
    this.simulation.on("tick", ticked);

    // x is fluff, weight is y

    // set up drag
    this.drag = (simulation) => {
      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }
      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
        if (self.currentGroup === "pretrain") {
          d.fx = null;
          d.fy = null;
        } else {
          let scale =
            self.currentFeature === "weight"
              ? self.weightScaleX
              : self.fluffScaleX;
          // update current nodes value of selected feature(s)
          const currentNode = select(this)._groups[0][0].__data__;
          if (self.currentFeature === "both") {
            // update x pos
            currentNode["fluffiness"] = self.fluffScaleX.invert(event.x);
            // update y pos
            currentNode["weight"] = self.weightScaleY.invert(event.y);
          } else {
            currentNode[self.currentFeature] = scale.invert(event.x);
          }

          // update decision boundary (if not train data point)
          const moveBoundary = currentNode["group"] === "train" ? true : false;
          self.updateDecisionBoundary(self.currentFeature, moveBoundary);
        }
      }

      return drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    };
    self.bubbles.call(self.drag(self.simulation));
  }

  drawDecisionBoundary() {
    let scale =
      this.currentFeature === "weight" ? this.weightScaleX : this.fluffScaleX;

    this.decisionBoundaryLine
      .style("opacity", 1)
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", this.HEIGHT / 5)
      .attr("y2", this.HEIGHT / 2 + (this.HEIGHT / 2 - this.HEIGHT / 5))
      .transition()
      .duration(1200)
      .ease(easeBackInOut)
      .attr("x1", scale(this.model.decisionBoundary))
      .attr("x2", scale(this.model.decisionBoundary))
      .attr("y1", this.HEIGHT / 5)
      .attr("y2", this.HEIGHT / 2 + (this.HEIGHT / 2 - this.HEIGHT / 5));

    this.updateDecisionBoundary(this.currentFeature, true);
  }

  // conditionally color animals by train/test/valiation group
  colorAnimals(display) {
    // determine if coloring animals or not
    const colorApplication =
      display === "on" ? (d) => this.colorScale(d.group) : "black";

    // class selectors for animal paths to color
    const animalClasses = [
      ".animal-ear",
      ".animal-head",
      ".animal-nose",
      ".animal-eye1",
      ".animal-eye2",
      ".animal-eye3",
      ".animal-eye4",
    ];

    // color animal paths as desired
    animalClasses.forEach((d) => {
      selectAll(d).attr("fill", colorApplication);
    });
  }

  addAnmials() {
    // need to track outer class' scope
    const self = this;

    // g to hold nodes
    this.bubbleG = this.svg.append("g").selectAll(".bubble-g").data(this.nodes);

    // g for each animal
    this.bubbles = this.bubbleG
      .enter()
      .append("g")
      .attr("class", "bubble-animal")
      .attr("group", (d) => d.class);

    // append animal svg to each animal g
    // note - in the func below, track the bubble's index (i) as well,
    // otherwise blinking will happen randomly across each individual eye,
    // not pairs of eyes.  (handled in eyeAnimations func)
    selectAll(".bubble-animal").each(function (d, i) {
      // get current animal name
      const animal = d.animal;

      // draw animal's ears
      select(this)
        .append("path")
        .attr("d", animal === "cat" ? catEar : dogEar)
        .attr("class", "animal-ear")
        .attr(
          "transform",
          `translate(-12,0) scale(${self.iconScale}, ${self.iconScale})`
        );

      // draw animal's head
      select(this)
        .append("path")
        .attr("d", animal === "cat" ? catHead : dogHead)
        .attr("class", "animal-head")
        .attr(
          "transform",
          `translate(-12,0) scale(${self.iconScale}, ${self.iconScale})`
        );

      // draw animal's nose
      select(this)
        .append("path")
        .attr("d", animal === "cat" ? catNose : dogNose)
        .attr("class", "animal-nose")
        .attr(
          "transform",
          `translate(-12,0) scale(${self.iconScale}, ${self.iconScale})`
        );

      // draw animal's cat's right eye
      select(this)
        .append("circle")
        .attr("cx", 66.599)
        .attr("cy", 49.639)
        .attr("r", 4.397)
        .attr("class", (d) => eyeAnimations(i))
        .attr(
          "transform",
          `translate(-12,0) scale(${self.iconScale}, ${self.iconScale})`
        );

      // draw animal's left eye
      select(this)
        .append("circle")
        .attr("cx", 35.735)
        .attr("cy", 49.639)
        .attr("r", 4.397)
        .attr("class", (d) => eyeAnimations(i))
        .attr(
          "transform",
          `translate(-12,0) scale(${self.iconScale}, ${self.iconScale})`
        );
    });
  }

  // add text labels and rect backgrounds to svg
  addLabels() {
    // margins for background rectangles
    const borderMarginX = 12;
    const borderMarginY = 5;
    const self = this;

    // add text
    this.labels = this.svg
      .selectAll(".bubble-label")
      .data(this.labelData.filter((d) => self.mainGroups.includes(d.name)))
      .join("text")
      .attr("class", "bubble-label")
      .attr("text-anchor", "middle")
      .attr("x", (d) => this.groups[d.name].x)
      .attr("y", (d) => this.yLabelHeight)
      .text((d) => this.groups[d.name].fullname)
      .attr("visibility", "hidden");

    // add bbox elements to data
    // note, this has to be done after
    // adding text to dom, so we can
    // get correct bbox of text elements
    this.svg
      .selectAll(".bubble-label")
      .join(this.labelData)
      .each(function (d) {
        d.bbox = this.getBBox();
      });

    // add background rects to labels
    this.labelsRect = this.svg
      .selectAll(".bubble-rect")
      .data(this.labelData.filter((d) => self.mainGroups.includes(d.name)))
      .join("rect")
      .attr("class", "bubble-rect")
      .attr("text-anchor", "middle")
      .attr("x", (d) => this.groups[d.name].x - d.bbox.width * 0.5)
      .attr("y", (d) => this.yLabelHeight)
      .attr("width", (d) => d.bbox.width + 2 * borderMarginX)
      .attr("height", (d) => d.bbox.height + 2 * borderMarginY)
      .attr("transform", function (d) {
        return `translate(-${borderMarginX}, -${d.bbox.height * 0.8 + borderMarginY})`;
      })
      .attr("visibility", "hidden")
      .attr("stroke", (d) => self.colorScale(d.name));

    // ensure text in front of background rects
    this.svg.selectAll(".bubble-label").raise();

    this.decisionBoundaryLine = this.chartG
      .append("line")
      .attr("id", "line-decision-boundary")
      .attr("stroke", "black")
      .style("stroke-width", 8)
      .style("pointer-events", "none")
      .attr("vector-effect", "non-scaling-stroke");
    // .style("opacity", 0);
  }

  drawHull() {
    this.hullG = this.svg.append("g").attr("id", "hull-g");

    this.hullPath = this.hullG
      .append("path")
      .attr("id", "hull-path")
      .style("stroke", "black")
      .style("fill", "none")
      .style("stroke-width", 5)
      .style("pointer-events", "none")
      .style("stroke-linejoin", "round");

    // append text to hull
    this.hullText = this.hullG
      .append("text")
      .attr("id", "hull-text")
      .text("Majority Vote: Cat")
      .attr("text-anchor", "middle")
      .attr("opacity", 0);

    // append background rect for hull text
    this.hullRect = this.hullG
      .append("rect")
      .attr("text-anchor", "middle")
      .attr("width", (d) => 50 + 2 * 12)
      .attr("height", (d) => 20 + 2 * 5)
      .attr("transform", function (d) {
        return `translate(-${12}, -${20 * 0.8 + 5})`;
      })
      .attr("visibility", "hidden")
      .attr("stroke", "black");
  }

  drawAxesLabels(feature) {
    // remove existing axes
    selectAll(".axes-text").remove();
    if (feature === "neither") {
      return;
    } else if (feature === "both") {
      // draw x
      this.svg
        .append("text")
        .attr("class", "axes-text")
        .attr("id", "x-axis-text")
        .text("Fluffiness")
        .attr("x", this.WIDTH / 2)
        .attr("y", this.HEIGHT * 0.95)
        .attr("text-anchor", "middle");

      this.svg
        .append("text")
        .attr("class", "axes-text")
        .attr("id", "y-axis-text")

        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", 0 - this.HEIGHT / 2)
        .attr("dy", "1rem")
        .style("text-anchor", "middle")
        .text("Weight");
    } else {
      // draw x
      const upperCaseFeature = feature === "weight" ? "Weight" : "Fluffiness";
      this.svg
        .append("text")
        .attr("class", "axes-text")
        .text(upperCaseFeature)
        .attr("x", this.WIDTH / 2)
        .attr("y", this.HEIGHT * 0.95)
        .attr("text-anchor", "middle");
    }
  }

  // color nodes

  // make decision bondary visible

  updateDecisionBoundary(feature, move) {
    // store feature to state of class
    this.currentFeature = feature;

    if (move === true) {
      if (feature === "both") {
        select("#hull-g").style("opacity", 0);
        const decisionLine = (x, weights) => {
          return -1 * (weights[1] / weights[2]) * x - weights[0] / weights[2];
        };

        this.model.fit(feature, this.nodes);
        this.moveScatter();
        const [dvX1, dvX2] = extent(this.data, (d) => +d.fluffiness);
        const y1 = decisionLine(dvX1, this.model.weights);
        const y2 = decisionLine(dvX2, this.model.weights);

        this.lineSeparator.style("opacity", 0);
        this.decisionBoundaryLine.style("opacity", 1);

        this.decisionBoundaryLine
          .transition()
          .duration(1200)
          .ease(easeBackInOut)
          .attr("x1", this.fluffScaleX(dvX1))
          .attr("x2", this.fluffScaleX(dvX2))
          .attr("y1", this.weightScaleY(y1))
          .attr("y2", this.weightScaleY(y2));
      } else if (feature === "neither") {
        select("#hull-g").style("opacity", 1);

        // this.moveBack();
        this.hideLines();
        this.moveCenter();
      } else {
        select("#hull-g").style("opacity", 0);

        // redraw lines
        this.showLines();
        // retrain model for the given feature
        this.model.fit(feature, this.nodes);
        let scale = feature === "weight" ? this.weightScaleX : this.fluffScaleX;
        // move nodes to correct position
        this.moveBee();

        // redraw horizontal line
        this.decisionBoundaryLine
          .attr("opacity", 1)
          .transition()
          .duration(1200)
          .ease(easeBackInOut)
          .attr("y1", this.HEIGHT / 5)
          .attr("y2", this.HEIGHT / 2 + (this.HEIGHT / 2 - this.HEIGHT / 5))
          .attr("x1", scale(this.model.decisionBoundary))
          .attr("x2", scale(this.model.decisionBoundary))
          .attr("y1", this.HEIGHT / 5)
          .attr("y2", this.HEIGHT / 2 + (this.HEIGHT / 2 - this.HEIGHT / 5));

        this.lineSeparator.style("opacity", 1);
      }
    } else {
      if (feature === "both") {
        select("#hull-g").style("opacity", 0);
        this.moveScatter();
      } else if (feature === "neither") {
        // this.moveBack();
        this.hideLines();
        this.moveCenter();
      } else {
        select("#hull-g").style("opacity", 0);
        this.moveBee();
      }
    }

    this.calculatePerformance();
  }

  calculatePerformance() {
    const self = this;
    // this.model.calculatePerformance(this.currentFeature);

    // init metrics to track
    const performance = {
      dataset: "",
      accuracy: 0,
      "cat right": 0,
      "cat wrong": 0,
      "dog right": 0,
      "dog wrong": 0,
    };
    performance["dataset"] = this.currentGroup;
    performance["feature"] = this.currentFeature;

    const modelWeights = this.model.weights;
    let z;
    // determine equation (depends on # of features)
    if (this.currentFeature === "both") {
      // if both, use both weights in equation
      z = (d) => {
        return (
          modelWeights[0] +
          modelWeights[1] * d["fluffiness"] +
          modelWeights[2] * d["weight"]
        );
      };
    } else if (this.currentFeature === "neither") {
      z = (d) => {
        // assign as all cats
        return -1;
      };
    } else {
      z = (d) => modelWeights[0] + modelWeights[1] * d[self.currentFeature];
    }

    // filter by group
    const filteredNodes = this.nodes.filter(
      (d) => d.class === this.currentGroup
    );

    filteredNodes.forEach((d) => {
      const zOutput = z(d);
      // use sign of z to determine class
      const pred = zOutput <= 0 ? "cat" : "dog";
      // assign predicted class to data
      d.pred = pred;

      // update performance metrics
      if (d.pred === d.animal) {
        performance["accuracy"] += 1;
        if (d.animal === "cat") {
          performance["cat right"] += 1;
        } else {
          performance["dog right"] += 1;
        }
      } else {
        if (d.animal === "cat") {
          performance["cat wrong"] += 1;
        } else {
          performance["dog wrong"] += 1;
        }
      }
    });

    // track performance metrics
    performance["accuracy"] /= filteredNodes.length;
    performance["accuracy"] = format(".1%")(performance["accuracy"]);

    if (["test", "validation"].includes(this.currentGroup)) {
      this.table.updateTable(performance);
    }

    return performance;
  }

  moveNodes() {
    const self = this;

    this.simulation
      .force("center", null)
      .force("x", (d) => forceX(d.x))
      .force("y", (d) => forceY(d.y))
      .force("charge", forceManyBody())
      .force("collide", forceCollide(this.collideRadius))
      .alpha(0.09)
      .alphaDecay(0);

    self.current = "groups";

    function ticked() {
      // determine how to nudge nodes during force
      if (self.current === "intro") {
        const l = 0.1 * self.strength;
        self.nodes.forEach(function (d, i) {
          d.vx -= (d.x - self.groups["intro"].x) * l;
          d.vy -= (d.y - self.groups["intro"].y) * l;
        });
      } else if (self.current === "groups") {
        const l = 0.1 * self.strength;
        self.nodes.forEach(function (d, i) {
          d.vx -= (d.x - self.groups[d.group].x) * l;
          d.vy -= (d.y - self.groups[d.group].y) * l;
        });
      }

      // this is required for nodes to position based on above
      self.bubbles.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
    }

    // Adjust position of circles.
    this.simulation.on("tick", ticked);
  }

  hideNonTrainAnimals() {
    const trans = transition().duration(1200);
    // hide animal bodies
    this.bubbles
      .filter((d) => d.group !== "train")
      .selectAll("path")
      .transition(trans)
      .attr("transform", "scale(0,0)");

    // hide animal eyes
    this.bubbles
      .filter((d) => d.group !== "train")
      .selectAll("circle")
      .transition(trans)
      .attr("transform", "scale(0,0)");
  }

  hideNonValidationAnimals() {
    const trans = transition();
    // hide animal bodies
    this.bubbles
      .filter((d) => d.group !== "validation")
      .selectAll("path")
      .transition(trans)
      .attr("transform", "scale(0,0)");

    // hide animal eyes
    this.bubbles
      .filter((d) => d.group !== "validation")
      .selectAll("circle")
      .transition(trans)
      .attr("transform", "scale(0,0)");

    // hide non validation labels
    // re-position labels
    this.labels
      .filter((d, i) => [0, 1].includes(i))
      .transition(trans)
      .attr("y", -this.HEIGHT / 5);
    this.labelsRect
      .filter((d, i) => [0, 1].includes(i))
      .transition(trans)
      .attr("y", -this.HEIGHT / 5);
  }

  hideLines() {
    this.lineSeparator.transition().attr("x2", 0);
    this.lineSeparator.lower();

    this.decisionBoundaryLine.style("opacity", 0);
  }

  showLines() {
    this.lineSeparator.transition().attr("x2", this.WIDTH);
    this.lineSeparator.lower();

    this.decisionBoundaryLine.style("opacity", 1);
  }

  drawHorizontalLine() {
    if (
      this.currentFeature === "weight" ||
      this.currentFeature === "fluffiness"
    ) {
      if (this.lineSeparator.attr("x2") < this.WIDTH) {
        this.lineSeparator
          .attr("x1", 0)
          .attr("y1", 10 + this.HEIGHT / 2)
          .attr("x2", 0)
          .attr("y2", 10 + this.HEIGHT / 2)
          .transition()
          .attr("x2", this.WIDTH);

        this.lineSeparator.lower();
      }
    }
  }

  addValidationData() {
    // show animal bodies
    this.bubbles
      .filter((d) => d.group !== "test")
      .selectAll("path")
      .transition()
      .attr("transform", `scale(${this.iconScale}, ${this.iconScale})`);

    // show animal eyes
    this.bubbles
      .filter((d) => d.group !== "test")
      .selectAll("circle")
      .transition()
      .attr("transform", `scale(${this.iconScale}, ${this.iconScale})`);

    // hide non test labels
    // re-position labels
    this.labels
      .filter((d, i) => [0, 2].includes(i))
      .transition()
      .attr("y", (d) => this.yLabelHeight);

    this.labelsRect
      .filter((d, i) => [0, 2].includes(i))
      .transition()
      .attr("y", (d) => this.yLabelHeight);
  }

  showAnimals() {
    const self = this;
    this.nonShowGroups = this.mainGroups.filter(
      (x) => !this.showGroups.includes(x)
    );
    // show animal bodies
    this.bubbles
      .filter((d) => self.showGroups.includes(d.group))
      .selectAll("path")
      .attr("opacity", 1)
      .transition()
      .attr("transform", `scale(${this.iconScale}, ${this.iconScale})`);

    // show animal eyes
    this.bubbles
      .filter((d) => self.showGroups.includes(d.group))
      .selectAll("circle")
      .attr("opacity", 1)
      .transition()
      .attr("transform", `scale(${this.iconScale}, ${this.iconScale})`);

    // hide animal bodies
    this.bubbles
      .filter((d) => self.nonShowGroups.includes(d.group))
      .selectAll("path")
      .transition()
      .attr("transform", `scale(${this.iconScale}, ${this.iconScale})`)
      .transition();
    // .attr("opacity", 0);

    // hide animal eyes
    this.bubbles
      .filter((d) => self.nonShowGroups.includes(d.group))
      .selectAll("circle")
      .transition()
      .attr("transform", `scale(${this.iconScale}, ${this.iconScale})`)
      .transition();
    // .attr("opacity", 0);
  }

  showNonTrainAnimals() {
    const nonTrainSelector = (d) => d.group !== "train";
    // show animal bodies
    this.bubbles
      .filter(nonTrainSelector)
      .selectAll("path")
      .transition()
      .attr("transform", `scale(${this.iconScale}, ${this.iconScale})`);

    // show animal eyes
    this.bubbles
      .filter(nonTrainSelector)
      .selectAll("circle")
      .transition()
      .attr("transform", `scale(${this.iconScale}, ${this.iconScale})`);
  }

  showLabels(subset) {
    // resolve which subset of labels to show
    const labelSubset = subset === "all" ? [0, 1, 2] : [1];

    // set shared transition state
    const trans = transition().duration(1200);

    this.labels
      .filter((d, i) => labelSubset.includes(i))
      .transition(trans)
      .attr("visibility", "visible")
      .attr("y", (d) => this.yLabelHeight);
    this.labelsRect
      .filter((d, i) => labelSubset.includes(i))
      .transition(trans)
      .attr("visibility", "visible")
      .attr("y", (d) => this.yLabelHeight);
  }

  hideLabels(subset) {
    // resolve which subset of labels to hide
    const labelSubset = subset === "all" ? [0, 1, 2] : [0, 2];

    // set shared transition state
    const trans = transition().duration(1200);

    // hide labels
    this.labels
      .filter((d, i) => labelSubset.includes(i))
      .transition(trans)
      .attr("y", -this.HEIGHT / 5);
    this.labelsRect
      .filter((d, i) => labelSubset.includes(i))
      .transition(trans)
      .attr("y", -this.HEIGHT / 5);
  }

  updateDataPosition() {
    // if feature is both, add validation data to scatter plot
    if (this.currentFeature === "both") {
      this.moveScatter();
    } else if (this.currentFeature === "neither") {
      this.moveCenter();
    } else {
      this.moveBee();
      // show one dimension data for given feature
    }
    this.updateDecisionBoundary(this.currentFeature, true);
  }

  trackCurrentGroups(group) {
    const self = this;
    this.currentGroup = group;
    // need to track which data groups are shown, so can easily cycle between in update funcs
    if (group === "train") {
      this.showGroups = ["train"];
    } else if (group === "validation") {
      this.showGroups = ["train", "validation"];
    } else if (group === "test") {
      this.showGroups = ["train", "test", "validation"];
    }
    this.nonShowGroups = this.mainGroups.filter(
      (x) => !self.showGroups.includes(x)
    );
  }

  // moveScatter always uses both features, so only needs group
  moveScatter() {
    const self = this;

    this.simulation
      .alpha(0.012)
      .force("center", null)
      .force("collide", forceCollide(self.collideRadius))
      .force(
        "x",
        forceX((d) => {
          if (self.showGroups.includes(d.group)) {
            return self.fluffScaleX(d["fluffiness"]);
          } else {
            return d.x;
          }
        }).strength(2)
      )
      .force(
        "y",
        forceY((d) => {
          if (self.showGroups.includes(d.group)) {
            return self.weightScaleY(d["weight"]);
          } else {
            return d.y;
          }
        }).strength(4)
      )
      .on("tick", changeNetwork);

    function changeNetwork() {
      self.bubbles
        .filter((d) => self.showGroups.includes(d.group))
        .attr("transform", (d) => `translate(${d.x}, ${d.y})`);

      self.bubbles
        .filter((d) => self.nonShowGroups.includes(d.group))
        .attr("transform", function (d) {
          const l = 0.01 * self.strength;
          self.nodes
            .filter((d) => self.nonShowGroups.includes(d.group))
            .forEach(function (d, i) {
              d.vx -= (d.x - self.groups["offscreen"].x) * l;
              d.vy -= (d.y - self.groups["offscreen"].y) * l;
            });
          return `translate(${d.x}, ${d.y})`;
        });
    }
  }

  moveBee() {
    const self = this;

    // handle case where feature is neither, and reset to fluffiness (need for scroll up 3)
    if (this.currentFeature === "neither") {
      this.currentFeature = "weight";
    }
    // determine scale for x-axis
    let scale =
      this.currentFeature === "weight" ? this.weightScaleX : this.fluffScaleX;

    this.simulation
      .alpha(0.012)
      .force("center", null)
      .force("collide", forceCollide(14))
      .force(
        "x",
        forceX((d) => {
          if (self.showGroups.includes(d.group)) {
            return scale(d[this.currentFeature]);
          } else {
            return d.x;
          }
        }).strength(2)
      )
      .force("y", forceY(self.HEIGHT / 2).strength(4))
      .on("tick", changeNetwork);

    function changeNetwork() {
      self.bubbles
        .filter((d) => self.showGroups.includes(d.group))
        .attr("transform", (d) => `translate(${d.x}, ${d.y})`);

      self.bubbles
        .filter((d) => self.nonShowGroups.includes(d.group))
        .attr("transform", function (d) {
          const l = 0.01 * self.strength;
          self.nodes
            .filter((d) => self.nonShowGroups.includes(d.group))
            .forEach(function (d, i) {
              d.vx -= (d.x - self.groups["offscreen"].x) * l;
              d.vy -= (d.y - self.groups["offscreen"].y) * l;
            });

          return `translate(${d.x}, ${d.y})`;
        });
    }
  }

  // move nodes to intro
  moveBack() {
    // intro step
    this.current = "intro";

    // hide train, test, validation text boxes
    this.labels.attr("visibility", "hidden");
    this.labelsRect.attr("visibility", "hidden");
  }

  addLegend() {
    const that = this;
    const legendData = ["Train Error", "Test Error"];

    const nodeWidth = (d) => d.getBBox().width;

    const legend = this.textSvg
      .append("g")
      .attr("class", "dd-legend")
      .attr("transform", "translate(0,30)");

    const lg = legend.selectAll("g").data(legendData).enter().append("g");

    const legendCircle = lg
      .append("rect")
      .attr("width", 9.5)
      .attr("height", 8.5)
      .attr("id", (d, i) => (i % 2 == 0 ? "dd-circle-train" : "dd-circle-test"))
      .attr("x", 0)
      .attr("y", 1)
      .attr("stroke-width", 0);

    lg.append("text")
      .attr("class", "dd-legend-text")
      .style("font-size", "14px")
      .attr("x", 11.5)
      .attr("y", 10)
      .text((d) => d);

    let offset = 0;

    lg.attr("transform", function (d) {
      let x = offset;
      offset += nodeWidth(this) + 10;
      return `translate(${x}, ${0})`;
    });
  }

  redraw() {
    // aaaa
    const windowWidth = window.innerWidth;
    const self = this;
    // Extract the width and height self was computed by CSS.
    this.MARGIN = {
      TOP: window.innerHeight * 0,
      BOTTOM: window.innerHeight * 0,
      LEFT: window.innerWidth * 0,
      RIGHT: window.innerWidth * 0,
    };
    this.WIDTH =
      window.innerWidth < 950 ? windowWidth / 1.15 : windowWidth / 1.75;
    this.HEIGHT =
      window.innerWidth < 950
        ? window.innerHeight / 1.8
        : window.innerHeight / 1.95;

    // Use the extracted size to set the size of an SVG element.
    this.svg
      .attr("width", this.WIDTH + this.MARGIN.LEFT + this.MARGIN.RIGHT)
      .attr("height", this.HEIGHT + this.MARGIN.TOP + this.MARGIN.BOTTOM);

    // reset group locations
    this.groups = {
      intro: {
        x: this.WIDTH / 2,
        y: this.HEIGHT / 2,
        fullname: "Intro",
      },
      test: {
        x: this.WIDTH / 5.5,
        y: this.yGroupHeight,
        fullname: "Test",
      },
      train: {
        x: this.WIDTH / 2,
        y: this.yGroupHeight,
        fullname: "Train",
      },
      validation: {
        x: this.WIDTH / 1.2,
        y: this.yGroupHeight,
        fullname: "Validation",
      },
      offscreen: {
        x: this.WIDTH / 2,
        y: -window.innerHeight * 0.8,
        fullname: "offscreen",
      },
    }; // end group

    // update scales
    this.fluffScaleX.range([50, this.WIDTH - 50]);

    this.weightScaleX.range([50, this.WIDTH - 50]);

    this.fluffScaleY.range([50, this.HEIGHT - 100]);

    this.weightScaleY.range([50, this.HEIGHT - 100]);

    // adjust animals to shown feature if later step
    if (this.currentGroup !== "pretrain") {
      // update decision boundary (if not train data point)
      self.updateDecisionBoundary(self.currentFeature, true);

      // move labels
      select("#x-axis-text")
        .transition()
        .attr("x", this.WIDTH / 2)
        .attr("y", this.HEIGHT * 0.95);

      select("#y-axis-text")
        .transition()
        .attr("x", 0 - this.HEIGHT / 2);
    }
    // change each node to new position
    // re-position labels
    this.labels.transition().attr("x", (d) => this.groups[d.name].x);
    this.labelsRect
      .transition()
      .attr("x", (d) => this.groups[d.name].x - d.bbox.width * 0.5);
  }
}

function eyeAnimations(i) {
  if (i % 5 === 0) {
    return "animal-eye1";
  } else if (i % 3 === 0) {
    return "animal-eye2";
  } else if (i % 2 === 0) {
    return "animal-eye3";
  } else {
    return "animal-eye4";
  }
}
