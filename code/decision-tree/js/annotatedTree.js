import { select } from "d3-selection";
import { tree, hierarchy } from "d3-hierarchy";
import { linkVertical } from "d3-shape";
import { annotation, annotationLabel } from "d3-svg-annotation";

// selectors
const treeSelection = "#intro-tree-chart";
let mobile = window.innerWidth <= 700;

const dims = select(treeSelection).node().getBoundingClientRect();

const radius = mobile ? 8 : 12;
// func to generate tree data
function generateTree(idx, num) {
  if (num === 1) {
    return { id: idx, children: [] };
  } else {
    let split = 1 + Math.floor((num - 1) * 0.52);
    return {
      id: idx + split,
      children: [
        generateTree(idx, split),
        generateTree(idx + split + 1, num - split),
      ],
    };
  }
}

// generate a random tree
const treeDataset = generateTree(0, 3);

// draw tree
let height = mobile ? 350 : 400;
let width = mobile ? dims.width * 0.98 : dims.width * 0.9;
const margin = {
  top: window.innerWidth <= 650 ? 30 : 30,
  bottom: 0,
  left: mobile ? 10 : width * 0.14,
  right: 0,
};
// define svg
const svg = select(treeSelection)
  .append("svg")
  .attr("id", "annotated-tree")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", `${0} ${0} ${width} ${height}`);
// .style("outline", "1px solid red");

// append g for framing
const g = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const treeWidth = mobile ? width * 0.99 : width * 0.58;
const treeHeight = mobile ? height - 50 : height - 100;

// init tree
const treePlot = mobile
  ? tree()
      // .nodeSize([50, 50])
      .size([treeWidth, treeHeight])
      .separation(function (a, b) {
        return a.parent == b.parent ? 1 : 1.25;
      })
  : tree().size([treeWidth, treeHeight]);

// make data hiearchical
const root = hierarchy(treeDataset, (d) => d.children);

// apply tree to hierachical data
const treeData = treePlot(root);

const path = linkVertical()
  .x((d) => d.x)
  .y((d) => d.y);

// draw links
const treePaths = g
  .append("g")
  .attr("class", "tree-link-g")
  .selectAll("path")
  .data(treeData.links())
  .join("path")
  .attr("d", path)
  .attr("class", "link")
  .attr("fill", "none")
  .attr("stroke", "#555")
  .attr("stroke-opacity", 0.58)
  .attr("stroke-width", radius / 2);

const nodeData = treeData.descendants();

// draw nodes
const treeNodes = g
  .append("g")
  .attr("class", "tree-node-g")
  .selectAll("circle")
  .data(nodeData);

const treeCircles = treeNodes
  .join("circle")
  .attr("fill", "black")
  .attr("r", radius)
  .attr("cx", (d) => d.x)
  .attr("cy", (d) => d.y)
  .attr("stroke", "#555")
  .attr("stroke-width", 1);

const annotations = [
  {
    type: annotationLabel,
    note: {
      label: "The top-most node in a tree",
      title: "Root Node",
      wrap: 100,
    },
    connector: {
      end: "dot",
      endScale: 0.5,
    },
    x: nodeData[0]["x"] + margin.left,
    y: nodeData[0]["y"] + margin.top,
    dy: 0,
    dx: -width / 5,
  },
  {
    type: annotationLabel,
    note: {
      label: "Represent choices to be made",
      title: "Decision Nodes",
      //   wrap: 90,
    },
    connector: {
      end: "dot",
      endScale: 0.5,
    },
    x: nodeData[1]["x"] + margin.left,
    y: nodeData[1]["y"] + margin.top,
    dy: 0,
    dx: mobile ? -10 : -width / 4.4,
  },
  {
    type: annotationLabel,
    note: {
      label: "Indicate a final outcome",
      title: "Leaf Nodes",
      //   wrap: 90,
    },
    connector: {
      end: "dot",
      endScale: 0.5,
    },
    x: nodeData[4]["x"] + margin.left,
    y: nodeData[4]["y"] + margin.top,
    dy: -1,
    dx: mobile ? 5 : width / 5,
  },
].map(function (d) {
  d.color = "grey";
  return d;
});

const makeAnnotations = annotation()
  //   .editMode(true)
  .type(annotationLabel)
  .annotations(annotations);

select("#annotated-tree")
  .append("g")
  .attr("class", "annotation-group")
  .call(makeAnnotations);
