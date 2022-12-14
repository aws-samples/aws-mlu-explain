<script>
  import { scaleLinear } from "d3-scale";
  import QChartBandit from "./QChartBandit.svelte";

  export let numX = 1;
  export let numY = 1;

  let data = [];
  for (let xVal = 0; xVal < numX; xVal++) {
    for (let yVal = 0; yVal < numY; yVal++) {
      data.push({ x: xVal, y: yVal });
    }
  }

  let width = 300;
  let height = 350;

  let cellWidth = width / numX;
  let cellHeight = height / numY;

  // // scales
  $: xScale = scaleLinear().domain([0, numX]).range([0, width]);
  $: yScale = scaleLinear().domain([0, numY]).range([0, height]);
</script>

<svg {width} {height}>
  <QChartBandit />
</svg>

<style>
  svg {
    /* border: 4px solid black; */
    /* background-color: white; */
    margin: 20px;
  }
</style>
