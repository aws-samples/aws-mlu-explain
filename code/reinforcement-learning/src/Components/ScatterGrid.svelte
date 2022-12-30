<script>
  import { scaleLinear } from "d3-scale";
  import QChartGrid from "./QChartGrid.svelte";
  import { gridHeight, gridWidth } from "../data-store";

  export let numX = 4;
  export let numY = 4;

  let data = [];
  for (let xVal = 0; xVal < numX; xVal++) {
    for (let yVal = 0; yVal < numY; yVal++) {
      data.push({ x: xVal, y: yVal });
    }
  }

  $: cellWidth = $gridWidth / numX;
  $: cellHeight = $gridHeight / numY;

  // // scales
  $: xScale = scaleLinear().domain([0, numX]).range([0, $gridWidth]);

  $: yScale = scaleLinear().domain([0, numY]).range([0, $gridHeight]);
</script>

<svg width={$gridWidth} height={$gridHeight}>
  {#each data as d, i}
    <g transform="translate({xScale(d.x)}, {yScale(d.y)})">
      <QChartGrid index={i} width={cellWidth} height={cellHeight} />
    </g>
  {/each}
</svg>

<style>
  svg {
    border: 4px solid black;
  }
</style>
