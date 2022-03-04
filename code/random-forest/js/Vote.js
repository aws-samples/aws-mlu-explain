import * as d3 from "d3";
import { testData } from "./data";
import {
  pentagonIn,
  pentagonOut,
  stopIn,
  stopOut,
  triangleIn,
  triangleOut,
} from "./roadSigns";
//TODO: Data ID85 is changed to a stop sign for a clearer demo. Check the prediction for trees1~3,6,7.
export class Vote {
  constructor(opts) {
    this.iconOpacity = 1;
    this.chartContainer = opts.chartContainer;
    this.tree0 = opts.tree0;
    this.tree1 = opts.tree1;
    this.tree2 = opts.tree2;
    this.trees = [this.tree0, this.tree1, this.tree2];
    const chartContainerProperties = d3
      .select(this.chartContainer)
      .node()
      .getBoundingClientRect();
    this.height = chartContainerProperties.height;
    this.width = chartContainerProperties.width;
    //this.size = Math.min(this.height, this.width);
    this.testTranslationX = this.width / 2;
    this.testTranslationY = this.height / 4 + 10;
    this.testData = testData;
    const dataCopy = JSON.parse(JSON.stringify(testData));
    const testDataScale = d3
      .scalePow()
      .exponent(2)
      .domain([0, 1000])
      .range([0.3, 2]);
    dataCopy.map((d, i) => {
      (d.r = d.scaledP * testDataScale(this.width)), (d.index = i);
    });
    this.packData = d3.packSiblings(dataCopy); //This is the dataset that has packing information
    this.dataCenter = d3.packEnclose(this.packData);
    this.predictions = []; // predictions from three trees
    this.majorityVote = []; // Final votes
    this.moved = false;
    this.traversed = []; //Stack to keep track of data points that traversed the path.
    this.sectionNumber = 0; // Keeps track of which step in the scrolly section we are in.
    this.makeDataset();
    this.makeBallot();
    this.vote();
  }
  makeBallot() {
    const vis = this;
    this.textVotes = ["", "", "", "Majority:"]; //Empty spaces for the predictions
    d3.select(vis.chartContainer)
      .append("g")
      .attr("class", "voteTexts")
      .attr("width", vis.width)
      .attr("height", vis.height / 10)
      .attr("transform", `translate(${vis.width / 2},${vis.height * 0.9})`)
      .attr("opacity", 0)
      .selectAll("text")
      .data(this.textVotes)
      .enter()
      .append("text")
      .text((d) => d)
      .attr("class", "voteText")
      .attr("id", (d, i) => `t${i}`)
      .attr("font-size", (d, i) => (i < 3 ? "1rem" : "1.2rem"))
      .attr("text-anchor", "middle")
      .attr("transform", (d, i) => {
        if (i < 3) {
          return `translate(${vis.width * 0.25 * (i - 1)},0)`;
        } else {
          return `translate(${vis.width * 0.25 * (i - 3)},${
            vis.height * 0.07
          })`;
        }
      })
      .attr("opacity", 0);
  }
  makeDataset() {
    this.paths = [];
    let vis = this;
    // add big enclosing circle;
    // draw circle (potentially erase)
    d3.select(vis.chartContainer)
      .append("circle")
      .attr("opacity", 0)
      .attr("class", "bigTestDataCircle")
      .attr(
        "transform",
        `translate(${vis.testTranslationX},${vis.testTranslationY})`
      )
      .attr("r", vis.dataCenter.r * 1.1)
      .attr("cx", vis.dataCenter.x)
      .attr("cy", vis.dataCenter.y)
      .attr("fill", "none")
      //.attr("fill-opacity",0.5)
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .style("pointer-events", "none")
      .style("stroke-dasharray", "4")
      .attr("stroke-opacity", 0.4);

    // add text as arc around testData circle
    // note, to accound for weird scrolling, first destroy this before constructing
    d3.select(vis.chartContainer).select("g.enclosing-arc").remove();
    // add enclosing arc
    d3.select(vis.chartContainer)
      .append("g")
      .attr("class", "enclosing-arc")
      .attr(
        "transform",
        `translate(${vis.dataCenter.x + 1 + vis.testTranslationX},${
          vis.dataCenter.y + 1 + vis.testTranslationY
        })`
      )
      .append("path")
      .attr("class", "enclosing-arc-label-clickme")
      .attr("id", "enclosing-path-clickme")
      .attr(
        "d",
        `M ${0 - vis.dataCenter.r * 1.1},0 A ${vis.dataCenter.r * 1.1},${
          vis.dataCenter.r * 1.1
        } 1, 1,1 ${0 + vis.dataCenter.r * 1.1} 0`
      )
      .attr("fill", "none")
      // .attr("opacity", 0)
      .raise();
    // add text along arc
    d3.select(vis.chartContainer)
      .append("text")
      .attr("id", "clickme-text")
      .attr("dy", -10)
      .attr(
        "transform",
        (d) =>
          `translate(${vis.dataCenter.x + 1 + vis.testTranslationX},${
            vis.dataCenter.y + 1 + vis.testTranslationY
          })`
      )
      .append("textPath")
      .attr("startOffset", "50%")
      .attr("text-anchor", "middle")
      .attr("xlink:href", `#enclosing-path-clickme`)
      .text("Click the Sign!");
    //.attr("opacity", 0);

    //
    // Add Icons!
    //
    // We need the location of the three trees:
    let tree0Location = this.tree0.treeElement
      .attr("transform")
      .split("(")[1]
      .split(`)`)[0]
      .split(",");
    let tree1Location = this.tree1.treeElement
      .attr("transform")
      .split("(")[1]
      .split(`)`)[0]
      .split(",");
    let tree2Location = this.tree2.treeElement
      .attr("transform")
      .split("(")[1]
      .split(`)`)[0]
      .split(",");
    this.treeLocations = [tree0Location, tree1Location, tree2Location];
    this.testDataVis = d3
      .select(vis.chartContainer)
      .append("g")
      .attr("class", "testData")
      .attr("opacity", 0);

    this.packData.map((d, i) => {
      this.drawIcon(d, d["Number of Sides"], vis.testDataVis);
    });
    const oldOpacity = vis.iconOpacity;
    vis.iconOpacity = 0;
    Array.from({ length: 3 }).map((d, i) => {
      this.paths[i] = [];
      this.predictions[i] = [];
      const dataContainer = d3
        .select(vis.chartContainer)
        .append("g")
        .attr("class", `treecircle${i}`);

      this.packData.map((d, i) => {
        this.drawIcon(d, d["Number of Sides"], dataContainer).on(
          "click",
          function (d) {
            if (vis.sectionNumber === 10) {
              // remove annotation that says 'click me!'
              d3.select(".click-annotation-group").remove();
              // display all 3 circles of selected class
              const currdCircleId = this.getAttribute("id");

              d3.select(".treecircle0")
                .selectAll(`#${currdCircleId}`)
                .attr("opacity", 1);
              d3.select(".treecircle1")
                .selectAll(`#${currdCircleId}`)
                .attr("opacity", 1);
              d3.select(".treecircle2")
                .selectAll(`#${currdCircleId}`)
                .attr("opacity", 1);

              // have data points traverse trees
              vis.traversed.push(i);
              Array.from({ length: 3 }).map((j, k) => {
                d3.select(vis.chartContainer)
                  .select(".voteTexts")
                  .select(`#t${k}`)
                  .text("");
                vis.followOnePath(
                  vis.packData[i],
                  vis.paths[k][i],
                  vis.trees[k],
                  k // Tree index
                );
              });
              vis.showMajorityVote(i, 2000);
            }
          }
        );
      });
      // finally, make the paths!!
      vis.iconOpacity = oldOpacity;
      testData.map((d) => vis.paths[i].push(vis.makePath(vis.trees[i], d, i)));
    });
  }
  // i is the number of sides
  drawIcon(data, i, container) {
    let vis = this;
    let icon = container;
    if (i == 8) {
      //Octogon
      icon = container
        .append("g")
        .attr("class", "stop")
        .attr("opacity", vis.iconOpacity)
        .attr("id", (d) => `c${data.id}`)
        .attr(
          "transform",
          `translate(${vis.testTranslationX + data.x - data.r},${
            vis.testTranslationY + data.y - data.r
          })`
        );
      let iconProperties = icon
        .append("svg")
        .attr("height", `${2 * data.r}`)
        .attr("width", `${2 * data.r}`)
        .attr("viewBox", `0 0 512 512`);
      iconProperties.append("path").attr("d", stopOut).attr("fill", "white");
      iconProperties.append("path").attr("d", stopIn).attr("fill", "red");
    } else if (i == 2) {
      // Circles
      icon = container
        .append("g")
        .attr("class", "circlesign")
        .attr("opacity", vis.iconOpacity)
        .attr("id", (d) => `c${data.id}`)
        .attr(
          "transform",
          `translate(${vis.testTranslationX + data.x},${
            vis.testTranslationY + data.y
          })`
        );
      icon.append("circle").attr("r", data.r).attr("fill", "#E24C4B");
      icon
        .append("circle")
        .attr("r", data.r * 0.7)
        .attr("fill", "white");
      icon.attr("opacity", vis.iconOpacity);
    } else if (i == 4) {
      // Rhombus
      icon = container
        .append("g")
        .attr("class", "rhombus")
        .attr("id", (d) => `c${data.id}`)
        .attr("opacity", vis.iconOpacity)
        .attr(
          "transform",
          `translate(${vis.testTranslationX + data.x - data.r},${
            vis.testTranslationY + data.y - data.r
          })`
        );

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
    } else if (i == 3) {
      // triangle
      icon = container
        .append("g")
        .attr("class", "triangle")
        .attr("id", (d) => `c${data.id}`)
        .attr("opacity", vis.iconOpacity)
        .attr(
          "transform",
          `translate(${vis.testTranslationX + data.x - data.r},${
            vis.testTranslationY + data.y - data.r
          })`
        );
      let iconProperties = icon
        .append("svg")
        .attr("height", `${data.r + data.r / 1.732}`) // 1.732 = root (3)
        .attr("width", `${2 * data.r}`)
        .attr("viewBox", `0 -26 512.03432 512`);
      iconProperties.append("path").attr("d", triangleOut).attr("fill", "red");
      iconProperties.append("path").attr("d", triangleIn).attr("fill", "white");
    } else {
      //Pentagon
      icon = container
        .append("g")
        .attr("class", "pentagon")
        .attr("id", (d) => `c${data.id}`)
        .attr("opacity", vis.iconOpacity)
        .attr(
          "transform",
          `translate(${vis.testTranslationX + data.x - data.r},${
            vis.testTranslationY + data.y - data.r
          })`
        );
      let iconProperties = icon
        .append("svg")
        .attr("height", `${data.r + data.r / 1.41}`) // 1.41 = root (2)
        .attr("width", `${2 * data.r}`)
        .attr("viewBox", `0 0 64 64`);
      iconProperties
        .append("path")
        .attr("d", pentagonOut)
        .attr("fill", "black");
      iconProperties
        .append("path")
        .attr("d", pentagonIn)
        .attr("fill", "#a3d6e3");
    }
    return icon;
  }
  makePath(tree, dataPoint, treeindex) {
    let path = [];
    let root = tree.root;
    while (root.children != null) {
      let feature = `${root.data.name}`;
      let creteria = dataPoint[feature] <= root.data.value;
      creteria
        ? path.push(`${root.data.id}-0`)
        : path.push(`${root.data.id}-1`);
      root = creteria ? root.children[0] : root.children[1];
      if (root.children == null) {
        this.predictions[treeindex].push(root.data.class == 0 ? "No" : "Yes");
      }
    }
    const currentTree = tree.treeElement;
    let pathString = "";
    path.map((d, i) => {
      pathString =
        pathString +
        " " +
        currentTree
          .select(".tree-link-g")
          .selectAll("path")
          .filter(function () {
            return d3.select(this).attr("order") == path[i];
          })
          .node()
          .getAttribute("d");
    });

    return currentTree
      .select(".tree-link-g")
      .append("path")
      .attr("class", "route")
      .attr("id", dataPoint.id)
      .attr("opacity", 0)
      .attr("fill", "none")
      .attr("stroke", "#FC6DE5")
      .attr("stroke-width", 3)
      .attr("d", pathString);
  }
  vote() {
    let prediction = 0;
    let i = 0;
    let j = 0;
    let dataLength = this.testData.length;
    for (i = 0; i < dataLength; i++) {
      let prediction = 0;
      for (j = 0; j < 3; j++) {
        if (this.predictions[j][i] === "Yes") prediction++;
      }
      prediction > 1
        ? this.majorityVote.push("Yes")
        : this.majorityVote.push("No");
    }
  }
  showMajorityVote(index, delayTime) {
    d3.select(this.chartContainer)
      .select("text#t3")
      .text(`Majority: ${this.majorityVote[index]}`)
      .transition()
      .delay(delayTime)
      .attr("opacity", 1);
  }
  hidePredictions(index) {
    d3.select(this.chartContainer)
      .select("text#t0")
      .transition()
      .attr("opacity", 0);
    d3.select(this.chartContainer)
      .select("text#t1")
      .transition()
      .attr("opacity", 0);
    d3.select(this.chartContainer)
      .select("text#t2")
      .transition()
      .attr("opacity", 0);
  }
  hideMajorityVote() {
    d3.select(this.chartContainer)
      .select("text#t3")
      .transition()
      .attr("opacity", 0);
  }
  /*Follows path for a spefic data point*/
  followOnePath(dataPoint, path, tree, treeindex) {
    const vis = this;
    d3.select(".testData")
      .selectAll("g")
      .data(this.packData)
      .transition()
      .filter((d, i) => d.id != dataPoint.id)
      .attr("opacity", (d, i) => {
        if (!vis.traversed.includes(d.index)) {
          return vis.iconOpacity / 2;
        } else return 0;
      });
    this.moved = true;
    let polygonCentering = 0; // keeps track of adjustment for non-circles
    if (dataPoint["Number of Sides"] != 2) polygonCentering = dataPoint.r;
    let initialtime = 0; //keeps track of the first time this method is called
    let l = path.node().getTotalLength();
    let svg = d3
      .select(`.treecircle${treeindex}`)
      .selectAll(`g#c${dataPoint.id}`)
      .attr("opacity", vis.iconOpacity * 0.7);
    path.attr("opacity", 1);
    this.hideMajorityVote(dataPoint.index);
    svg
      .transition()
      .on("start", () =>
        // Hide the icon in the test dataset pack
        d3
          .select(".testData")
          .select(`#c${dataPoint.id}`)
          .transition()
          .attr("opacity", 0)
      )
      .attr(
        "transform",
        `translate(${
          path.node().getPointAtLength(0).x +
          parseInt(vis.treeLocations[treeindex][0]) -
          polygonCentering
        },
      ${
        path.node().getPointAtLength(0).y +
        parseInt(vis.treeLocations[treeindex][1]) -
        polygonCentering
      })`
      )
      .transition()
      .on("end", () => {
        //d3.select(".testData")
        initialtime = performance.now();
        start();
      });

    function start() {
      let time = (performance.now() - initialtime) / 10;
      // we run this annimation until time reaches the length.
      if (time < l) {
        svg.attr(
          "transform",
          `translate(${
            path.node().getPointAtLength(time).x +
            parseInt(vis.treeLocations[treeindex][0]) -
            polygonCentering
          },
      ${
        path.node().getPointAtLength(time).y +
        parseInt(vis.treeLocations[treeindex][1]) -
        polygonCentering
      })`
        );
        window.requestAnimationFrame(start);
      } else {
        svg.transition().attr(
          "transform",
          `translate(${
            path.node().getPointAtLength(l).x +
            parseInt(vis.treeLocations[treeindex][0]) -
            polygonCentering
          },
          ${
            path.node().getPointAtLength(l).y +
            parseInt(vis.treeLocations[treeindex][1]) -
            polygonCentering
          })`
        );

        path.transition().attr("opacity", 0);
        d3.select(vis.chartContainer)
          .select(".voteTexts")
          .select(`#t${treeindex}`)
          .text(`${vis.predictions[treeindex][dataPoint.index]}`)
          .transition()
          .duration(1000)
          .delay(200)
          .attr("opacity", 1)
          .on("end", () => {
            svg.transition().attr("opacity", 0);
          });
        d3.select(".testData")
          .selectAll("g")
          .data(vis.packData)
          .filter((d, i) => d.id != dataPoint.id)
          .transition()
          .delay(500)
          .attr("opacity", (d, i) => {
            if (!vis.traversed.includes(d.index)) return vis.iconOpacity;
            else return 0;
          });
      }
    }
  }
  unfollowPath(dataPoint, path, tree, treeindex, delayindex, demo) {
    const vis = this;
    let polygonCentering = 0; // keeps track of adjustment for non-circles
    if (dataPoint["Number of Sides"] != 2) polygonCentering = dataPoint.r;
    d3.select(vis.chartContainer)
      .select(".voteTexts")
      .select(`#t${treeindex}`)
      .text(`${vis.predictions[treeindex][dataPoint.index]}`)
      .transition()
      .duration(1000)
      .attr("opacity", 0); //hide texts
    const currentTree = tree.treeElement;
    let initialtime = 0; //keeps track of the first time this method is called
    let l = path.node().getTotalLength();
    let svg = d3
      .select(`.treecircle${treeindex}`)
      .selectAll(`#c${dataPoint.id}`);
    svg
      .transition()
      .delay(delayindex * 50)
      .attr(
        "transform",
        `translate(${
          path.node().getPointAtLength(l).x +
          parseInt(vis.treeLocations[treeindex][0]) -
          polygonCentering
        },
      ${
        path.node().getPointAtLength(l).y +
        parseInt(vis.treeLocations[treeindex][1]) -
        polygonCentering
      })`
      )
      .attr("opacity", 1)
      .transition()
      //.delay(delayindex*50)
      .on("end", () => {
        initialtime = performance.now();
        start();
      })
      .on("start", () => {
        if (demo) d3.select(".testData").selectAll("g").attr("opacity", 0);
      });

    function start() {
      let time = (performance.now() - initialtime) / 6;
      // we run this annimation until time reaches the length.
      if (time < l) {
        svg.attr(
          "transform",
          `translate(${
            path.node().getPointAtLength(l - time).x +
            parseInt(vis.treeLocations[treeindex][0]) -
            polygonCentering
          },
        ${
          path.node().getPointAtLength(l - time).y +
          parseInt(vis.treeLocations[treeindex][1]) -
          polygonCentering
        })`
        );

        window.requestAnimationFrame(start);
      } else {
        if (!demo) {
          svg
            .attr(
              "transform",
              `translate(${
                path.node().getPointAtLength(0).x +
                parseInt(vis.treeLocations[treeindex][0]) -
                polygonCentering
              },
          ${
            path.node().getPointAtLength(0).y +
            parseInt(vis.treeLocations[treeindex][1]) -
            polygonCentering
          })`
            )
            .transition()
            .attr(
              "transform",
              `translate(${
                dataPoint.x - polygonCentering + vis.testTranslationX
              },
          ${dataPoint.y - polygonCentering + vis.testTranslationY})`
            )
            .transition()
            .attr("opacity", 0);
          d3.select(".testData")
            .select(`#c${dataPoint.id}`)
            .attr("opacity", () => (demo ? 0 : vis.iconOpacity));
        } else {
          vis.hideTestData();
          svg
            .attr(
              "transform",
              `translate(${
                path.node().getPointAtLength(0).x +
                parseInt(vis.treeLocations[treeindex][0]) -
                polygonCentering
              },
          ${
            path.node().getPointAtLength(0).y +
            parseInt(vis.treeLocations[treeindex][1]) -
            polygonCentering
          })`
            )
            .transition()
            .attr("opacity", 0)
            .attr(
              "transform",
              `translate(${
                dataPoint.x - polygonCentering + vis.testTranslationX
              },
          ${dataPoint.y - polygonCentering + vis.testTranslationY})`
            );

          d3.select(".testData").select(`#c${dataPoint.id}`).attr("opacity", 0);
        }
      }
    }
  }
  showTestData() {
    let vis = this;
    d3.select(vis.chartContainer)
      .select(".testData")
      .selectAll("g")
      .attr("opacity", vis.iconOpacity);
    const svg = d3.select(vis.chartContainer);
    //svg.select(".treecircle0").attr("opacity", vis.iconOpacity);
    //svg.select(".treecircle1").attr("opacity", vis.iconOpacity);
    //svg.select(".treecircle2").attr("opacity", vis.iconOpacity);
    svg.select(".voteTexts").attr("opacity", 1);
  }
  hideTestData() {
    const svg = d3.select(this.chartContainer);
    svg.select(".testData").selectAll("g").attr("opacity", 0);
    svg.select(".treecircle0").selectAll("g").attr("opacity", 0);
    svg.select(".treecircle1").selectAll("g").attr("opacity", 0);
    svg.select(".treecircle2").selectAll("g").attr("opacity", 0);
    svg.select(".voteTexts").attr("opacity", 0);
  }

  demoVote(index) {
    //this.traversed.push(index);
    this.moved = true;
    Array.from({ length: 3 }).map((d, i) => {
      this.followOnePath(
        this.packData[index],
        this.paths[i][index],
        this.trees[i],
        i // Tree index
      );
    });
  }
  demoReverse(index, transparent) {
    if (this.moved) {
      Array.from({ length: 3 }).map((j, k) => {
        this.unfollowPath(
          this.packData[index],
          this.paths[k][index],
          this.trees[k],
          k,
          0,
          transparent
        );
      });
      this.moved = false;
    }
  }
  reverseTraverse() {
    while (this.traversed.length != 0) {
      Array.from({ length: 3 }).map((j, k) => {
        this.unfollowPath(
          this.packData[this.traversed[this.traversed.length - 1]],
          this.paths[k][this.traversed[this.traversed.length - 1]],
          this.trees[k],
          k,
          0,
          false
        );
      });
      this.traversed.pop();
    }
  }

  initAnnotations() {
    const vis = this;
    const c85 = this.packData.filter((d) => d.id === 85)[0];

    // .attr("transform", `translate(${vis.testTranslationX},${vis.testTranslationY})`)
    //   .attr("r", vis.dataCenter.r * 1.1)
    //   .attr("cx", vis.dataCenter.x)
    //   .attr("cy", vis.dataCenter.y)
    // draw annotation for 'click on data!' portion (last scroll step)
    const annotations = [
      {
        type: annotationCalloutCircle,
        note: {
          bgPadding: 20,
          // title: "Click Me!",
          label: "Click data to classify!",
          wrap: 0,
        },
        subject: {
          radius: vis.dataCenter.r + 3, //c85.r,
          radiusPadding: 0,
        },
        x: vis.dataCenter.x + vis.testTranslationX, //c85.x + vis.testTranslationX,
        y: vis.dataCenter.y + vis.testTranslationY, //c85.y + vis.testTranslationY, // margin top
        dy: -vis.dataCenter.r * 1.4, //c85.r * 2,
        dx: 0, //-vis.width * 0.05,
      },
    ].map(function (d) {
      d.color = "grey";
      return d;
    });

    // init annotations
    const makeAnnotations = annotation()
      //   .editMode(true)
      .type(annotationCalloutCircle)
      .annotations(annotations);

    // add g to svg and append annotations to it
    d3.select("#chart-rf")
      .append("g")
      .attr("class", "click-annotation-group")
      .call(makeAnnotations);
  }
  showDataBag() {
    const vis = this;
    d3.select(this.chartContainer)
      .select("circle.bigTestDataCircle")
      .attr("opacity", 1)
      .attr("stroke", "black")
      .attr("stroke-width", 3)
      .attr("opacity", 1);
  }
  hideDataBag() {
    d3.select(this.chartContainer)
      .select("circle.bigTestDataCircle")
      .attr("opacity", 0);
  }
  resize(tree0, tree1, tree2) {
    const vis = this;
    this.tree0 = tree0;
    this.tree1 = tree1;
    this.tree2 = tree2;
    this.trees = [this.tree0, this.tree1, this.tree2];
    const sel = d3.select(vis.chartContainer);
    sel.select(".voteTexts").remove();
    sel.select(".bigTestDataCircle").remove();
    sel.select(".enclosing-arc").remove();
    sel.select("#clickme-text").remove();
    sel.select(".testData").remove();
    sel.select(".treecircle0").remove();
    sel.select(".treecircle1").remove();
    sel.select(".treecircle2").remove();
    const testDataScale = d3
      .scalePow()
      .exponent(2)
      .domain([0, 1000])
      .range([0.3, 2]);
    const chartContainerProperties = d3
      .select(this.chartContainer)
      .node()
      .getBoundingClientRect();
    this.height = chartContainerProperties.height;
    this.width = chartContainerProperties.width;
    //this.size = Math.min(this.height, this.width);
    this.testTranslationX = this.width / 2;
    this.testTranslationY = this.height / 4 + 10;
    const dataCopy = JSON.parse(JSON.stringify(testData));
    dataCopy.map((d, i) => {
      (d.r = d.scaledP * testDataScale(this.width)), (d.index = i);
    });
    this.packData = d3.packSiblings(dataCopy); //This is the dataset that has packing information
    this.dataCenter = d3.packEnclose(this.packData);
    this.makeDataset();
    this.makeBallot();
    this.vote();
    /*
    const newChartContainerProperties = d3
      .select(this.chartContainer)
      .node()
      .getBoundingClientRect();

    //const newWidth = newChartContainerProperties.width;
    const newSize = newChartContainerProperties.width;
    const newHeight = this.height * (newSize / this.width);
    d3.selectAll(".testData").attr(
      "transform",
      `scale(${newSize / this.width},${newSize / this.width}) translate(0,${
        newChartContainerProperties.height - newHeight
      }) `
    );
    d3.selectAll(".voteTexts").attr(
      "transform",
      `translate(${newChartContainerProperties.width/2},${
        newChartContainerProperties.height *.9
      })`
    );
    d3.selectAll(".treecircle0").attr(
      "transform",
      `scale(${newSize / this.width},${newSize / this.width}) translate(0,${
        newChartContainerProperties.height - newHeight
      })`
    );
    d3.selectAll(".treecircle1").attr(
      "transform",
      `scale(${newSize / this.width},${newSize / this.width}) translate(0,${
        newChartContainerProperties.height - newHeight
      })`
    );
    d3.selectAll(".treecircle2").attr(
      "transform",
      `scale(${newSize / this.width},${newSize / this.width}) translate(0,${
        newChartContainerProperties.height - newHeight
      })`
    );
    */
  }

  /*Every data points will follow the path, used for the previous design only, might be useful for decision tree*/
  /*
  followPath(dataPoint, path, tree, treeindex, delayindex) {
    const vis = this;
    const currentTree = tree.treeElement;
    let initialtime = 0; //keeps track of the first time this method is called
    let l = path.node().getTotalLength();
    let svg = d3
      .select(`.treecircle${treeindex}`)
      .selectAll(`circle#c${dataPoint.id}`);
    svg
      .transition()
      .delay(delayindex * 50)
      .attr("cx", path.node().getPointAtLength(0).x)
      .attr("cy", path.node().getPointAtLength(0).y)
      .attr("transform", currentTree.attr("transform"))
      .transition()
      .on("end", () => {
        initialtime = performance.now();
        start();
      });

    function start() {
      let time = (performance.now() - initialtime) / 7;
      // we run this annimation until time reaches the length.
      if (time < l) {
        svg
          .attr("cx", path.node().getPointAtLength(time).x)
          .attr("cy", path.node().getPointAtLength(time).y);
        window.requestAnimationFrame(start);
      } else {
        svg
          .attr("cx", path.node().getPointAtLength(l).x)
          .attr("cy", path.node().getPointAtLength(l).y);
      }
    }
  }
    // Not needed for the new design
  reverseDataAnnimation() {
    if (this.moved) {
      let i = 0;
      let j = 0;
      for (i = 0; i < 3; i++) {
        for (j = 0; j < this.testData.length; j++) {
          this.unfollowPath(
            this.packData[j],
            this.paths[i][j],
            this.trees[i],
            i,
            j
          );
        }
      }
    }
    this.moved = false;
  }
    // Don't need this method anymore due to design change
  dataAnnimation() {
    let vis = this;
    this.moved = true;
    let i = 0;
    let j = 0;
    for (i = 0; i < 3; i++) {
      for (j = 0; j < this.testData.length; j++) {
        this.followPath(
          this.packData[j],
          this.paths[i][j],
          this.trees[i],
          i, // Tree index
          j //delay Index
        );
      }
    }
  }
  */
}
