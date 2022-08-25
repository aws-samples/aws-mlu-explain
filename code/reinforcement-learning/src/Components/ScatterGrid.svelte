<script>
  import { scaleLinear } from "d3-scale";
  import QChartGrid from "./QChartGrid.svelte";

  export let numX = 4;
  export let numY = 4;

  let data = [];
  for (let xVal = 0; xVal < numX; xVal++) {
    for (let yVal = 0; yVal < numY; yVal++) {
      data.push({ x: xVal, y: yVal });
    }
  }

  let width = 400;
  let height = 400;

  let cellWidth = width / numX;
  let cellHeight = height / numY;

  // // scales
  $: xScale = scaleLinear().domain([0, numX]).range([0, width]);

  $: yScale = scaleLinear().domain([0, numY]).range([0, height]);
</script>

<svg {width} {height}>
  {#each data as d, i}
    <g transform="translate({xScale(d.x)}, {yScale(d.y)})">
      <QChartGrid index={i} width={cellWidth - 12} height={cellHeight - 6} />
    </g>
  {/each}
</svg>

<style>
  svg {
    border: 4px solid black;
    background-color: white;
  }
</style>
