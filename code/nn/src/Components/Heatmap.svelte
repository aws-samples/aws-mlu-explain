<script>
  import { min, max } from "d3-array";
  import { scaleLinear } from "d3-scale";
  import { line } from "d3-shape";
  import { lossData } from "../playground-store";

  let paths;
  let lineColors = ["hotpink", "skyblue"];
  let numLines = lineColors.length;

  let totalWidth = 100;
  let totalHeight = 100;
  let margin = { top: 2, right: 0, bottom: 2, left: 2 };

  $: width = totalWidth - margin.left - margin.right;
  $: height = totalHeight - margin.top - margin.bottom;

  $: minY = min([
    min($lossData, (d) => d.trainLoss),
    min($lossData, (d) => d.testLoss),
  ]);
  $: maxY = max([
    max($lossData, (d) => d.trainLoss),
    max($lossData, (d) => d.testLoss),
  ]);

  // scales
  $: xScale = scaleLinear().domain([0, $lossData.length]).range([0, width]);

  $: yScale = scaleLinear().domain([minY, maxY]).range([height, 0]);

  $: pathTrain = line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.trainLoss));

  $: pathTest = line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.testLoss));

  console.log("made it");
  $: {
    console.log("data!", $lossData);
  }
</script>

<div
  id="linechart"
  bind:offsetWidth={totalWidth}
  bind:offsetHeight={totalHeight}
>
  <svg>
    <path d={pathTrain($lossData)} class="path-train-loss" />
    <path d={pathTest($lossData)} class="path-test-loss" />
  </svg>
</div>

<style>
  #linechart {
    position: absolute;
    top: 0;
    right: 0;
    width: 50%;
    height: 100px;
  }

  svg {
    width: 100%;
    height: 100%;
    border: 1px solid black;
  }
  .path-train-loss {
    stroke: skyblue;
  }
  .path-test-loss {
    stroke: hotpink;
  }
  path {
    stroke-width: 1.5;
    fill: none;
    stroke-linecap: round;
  }
</style>
