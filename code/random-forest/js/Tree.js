import * as d3 from "d3";

// This function generates a random tree.
export function generateTree(idx, num) {
  if (num === 1) {
    return { id: idx, children: [] };
  } else {
    let split = 1 + Math.floor((num - 1) * Math.random());
    return {
      id: idx + split,
      children: [
        generateTree(idx, split),
        generateTree(idx + split + 1, num - split),
      ],
    };
  }
}

export class Tree {
  constructor(opts) {
    this.root = opts.root;
    this.strokeWidth = opts.strokeWidth;
    this.treeSize = opts.treeSize;
    this.d3Tree = d3.tree().size([this.treeSize * 1.2, this.treeSize * 1]);
    this.root = d3.hierarchy(this.root, (d) => d.children);
    this.treeData = this.d3Tree(this.root);
  }

  // This method draws a simple tree in desinated g element
  drawTree(svgLocation) {
    let rScale = d3.scaleSequential().domain([0, 1]).range([0, 4]);
    // draw links
    const cell = svgLocation;
    const treePaths = cell
      .append("g")
      .attr("class", "tree-link-g")
      .selectAll("path")
      .data(this.treeData.links())
      .join("path")
      .attr(
        "d",
        d3
          .linkVertical()
          .x((d) => d.x)
          .y((d) => d.y)
      )
      .attr("class", "link")
      .attr("fill", "#354848")
      .attr("stroke", "#354848")
      .attr("stroke-width", 0.75 * this.strokeWidth);

    // draw nodes
    const treeNodes = cell
      .append("g")
      .attr("class", "tree-node-g")
      .selectAll("rect")
      .data(this.treeData.descendants());
    const rectSize = rScale(this.treeSize / 29);
    const treeCircles = treeNodes
      .join("rect")
      .attr("fill", "rgb(206, 56, 116)")
      .attr("height", rectSize)
      .attr("width", rectSize)
      .attr("rx", 1)
      .attr("ry", 1)
      .attr("x", (d) => d.x - rectSize / 2)
      .attr("y", (d) => d.y - rectSize / 2)
      .attr("stroke", "#354848")
      .attr("stroke-width", this.strokeWidth / 2);
  }
  // This method draws a tree in desinated g element with the colors for RF scrolly.
  drawTreeWithText(svgLocation) {
    // draw links
    const cell = svgLocation;
    this.treeElement = svgLocation;
    const treePaths = cell
      .append("g")
      .attr("class", "tree-link-g")
      .selectAll("path")
      .data(this.treeData.links())
      .join("path")
      .attr(
        "d",
        d3
          .linkVertical()
          .x((d) => d.x)
          .y((d) => d.y)
      )
      .attr("id", (d, i) => `link${i}`)
      .attr("feature", (d) => d.source.data.name)
      .attr("boundary", (d) => d.source.data.value)
      .attr("order", (d, i) => `${d.source.data.id}-${i % 2}`)
      .attr("opacity", 0)
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "#354848")
      .attr("stroke-width", this.strokeWidth);

    // draw nodes
    const treeNodes = cell
      .append("g")
      .attr("class", "tree-node-g")
      .selectAll("rect")
      .data(this.treeData.descendants());
    const rectHeight = this.treeSize / 10;
    const rectWidth = (d) => ("name" in d ? rectHeight : 0);
    let classNames = ["No", "Yes"];
    if (window.innerWidth < 600) classNames = ["N", "Y"];
    let fontSize = `${this.treeSize / 15}px`;
    if (window.innerWidth < 600) fontSize = `${this.treeSize / 7}px`;
    const textAccessor = (d) => ("name" in d ? "" : classNames[d.class]);
    const treeCircles = treeNodes
      .join("rect")
      .attr("class", "nodes")
      .attr("opacity", 0)
      .attr("fill", (d) => d.data.color)
      .attr("rx", 2)
      .attr("ry", 2)
      .attr("x", (d) => d.x - rectWidth(d.data) / 2)
      .attr("y", (d) => d.y)
      .attr("height", rectHeight)
      .attr("width", (d) => rectWidth(d.data))
      .attr("stroke", "#232f3e")
      .attr("stroke-width", this.strokeWidth / 2);

    const treeText = treeNodes
      .join("text")
      .attr("text-anchor", "middle")
      .attr("class", "nodetexts")
      .attr("alignment-baseline", "middle")
      .attr("transform", (d) => `translate(${d.x},${d.y + this.treeSize / 20})`)
      .attr("font-size", fontSize)
      .attr("fill", "black")
      .attr("opacity", 0)
      .text((d) => textAccessor(d.data));
  }
  //For bar-code, "yes" "no" is removed b/c it's impossible to read!!
  drawBarcodeTree(svgLocation) {
    // draw links
    const cell = svgLocation;
    this.treeElement = svgLocation;
    const treePaths = cell
      .append("g")
      .attr("class", "tree-link-g")
      .selectAll("path")
      .data(this.treeData.links())
      .join("path")
      .attr(
        "d",
        d3
          .linkVertical()
          .x((d) => d.x)
          .y((d) => d.y)
      )
      .attr("id", (d, i) => `link${i}`)
      .attr("feature", (d) => d.source.data.name)
      .attr("boundary", (d) => d.source.data.value)
      .attr("order", (d, i) => `${d.source.data.id}-${i % 2}`)
      .attr("opacity", 1)
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "#354848")
      .attr("stroke-width", this.strokeWidth);

    // draw nodes
    const treeNodes = cell
      .append("g")
      .attr("class", "tree-node-g")
      .selectAll("rect")
      .data(this.treeData.descendants());
    const rectHeight = this.treeSize / 8;
    const rectWidth = (d) => ("name" in d ? rectHeight : 0);
    const classNames = ["N", "Y"];
    const fontSize = `0.6rem`;
    const textAccessor = (d) => ("name" in d ? "" : classNames[d.class]);
    const treeCircles = treeNodes
      .join("rect")
      .attr("class", "nodes")
      .attr("opacity", 1)
      .attr("fill", (d) => d.data.color)
      .attr("rx", 2)
      .attr("ry", 2)
      .attr("x", (d) => d.x - rectWidth(d.data) / 2)
      .attr("y", (d) => d.y)
      .attr("height", rectHeight)
      .attr("width", (d) => rectWidth(d.data))
      .attr("stroke", "#232f3e")
      .attr("stroke-width", this.strokeWidth);

    const treeText = treeNodes
      .join("text")
      .attr("text-anchor", "middle")
      .attr("class", "nodetexts")
      .attr("alignment-baseline", "middle")
      .attr("transform", (d) => `translate(${d.x},${d.y + this.treeSize / 10})`)
      .attr("font-size", fontSize)
      .attr("fill", "#232f3e")
      .attr("opacity", 1)
      .text((d) => textAccessor(d.data));
  }
  // This method draws a tree in desinated g element with the colors for RF scrolly tree building.
  drawTreeWithSplit(svgLocation) {
    const color1 = ["#feeca9", "#005da3", "#ce3874"]; //S, C, T
    const color1ID = [false, true, false]; //false = unselected feature, true = selected feature
    const color2 = ["#feeca9", "#e99f46", "#ce3874"]; //S, N, T
    const color2ID = [false, false, true]; //ID for color1
    const colors = [color1, color2];
    // draw links
    const cell = svgLocation;
    const treePaths = cell
      .append("g")
      .attr("class", "tree-link-g")
      .selectAll("path")
      .data(this.treeData.links())
      .join("path")
      .attr(
        "d",
        d3
          .linkVertical()
          .x((d) => d.x)
          .y((d) => d.y)
      )
      .attr("class", (d, i) => (i < 4 ? `link-${i}` : "splitlink"))
      .attr("fill", "none")
      .attr("stroke", "#354848")
      .attr("stroke-width", this.strokeWidth)
      .attr("opacity", 0);

    // draw nodes
    const treeNodes = cell
      .append("g")
      .attr("class", "tree-node-g-split")
      .selectAll("rect")
      .data(this.treeData.descendants());

    const rectHeight = this.treeSize / 10;
    const rectWidth = (d) => ("name" in d ? rectHeight : 0);
    let classNames = ["No", "Yes"];
    if (window.innerWidth < 600) classNames = ["N", "Y"];
    let fontSize = `${this.treeSize / 15}px`;
    if (window.innerWidth < 600) fontSize = `${this.treeSize / 10}px`;
    const textAccessor = (d) => ("name" in d ? "" : classNames[d.class]);
    const splitNode = (d) => ("split" in d ? true : false);
    const splitnodeLocations = [];
    const treeCircles = treeNodes
      .join("rect")
      .attr("fill", (d) => d.data.color)
      .attr("rx", 2)
      .attr("ry", 2)
      //Below, for the nodes that shows the split, we store the location information to use it later.
      .attr("id", (d, i) => {
        if (splitNode(d.data)) {
          splitnodeLocations.push([d.x, d.y]);
          return `split${i}`;
        } else return "rest";
      })
      .attr("x", (d) => d.x - rectWidth(d.data) / 2)
      .attr("y", (d) => d.y)
      .attr("height", rectHeight)
      .attr("width", (d) => rectWidth(d.data))
      .attr("stroke", "#232f3e")
      .attr("stroke-width", this.strokeWidth)
      .attr("opacity", 0);
    const addSplitNodes = d3
      .select("g.tree-node-g-split")
      .append("g")
      .selectAll("rect")
      .data(Array.from({ length: 6 })); //There are 6 features to show for the split

    addSplitNodes
      .join("rect")
      .attr("fill", (d, i) => colors[Math.floor(i / 3)][i % 3])
      .attr("class", (d, i) => `splitnode${Math.floor(i / 3)}`)
      .attr("rx", 2)
      .attr("ry", 2)
      .attr(
        "x",
        (d, i) =>
          splitnodeLocations[Math.floor(i / 3)][0] -
          1.5 * rectHeight +
          (i % 3) * rectHeight
      )
      .attr("y", (d, i) => splitnodeLocations[Math.floor(i / 3)][1])
      .attr("height", rectHeight)
      .attr("width", rectHeight)
      .attr("stroke", "#232f3e")
      .attr("stroke-width", this.strokeWidth)
      .attr("opacity", 0);
    const treeText = treeNodes
      .join("text")
      .attr("text-anchor", "middle")
      .attr("class", "splitnodetexts")
      .attr("alignment-baseline", "middle")
      .attr("transform", (d) => `translate(${d.x},${d.y + this.treeSize / 20})`)
      .attr("font-size", fontSize)
      .attr("fill", "black")
      .attr("opacity", 0)
      .text((d) => textAccessor(d.data));
  }
}
