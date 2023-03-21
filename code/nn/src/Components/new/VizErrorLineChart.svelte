<script>
  import { draw } from "svelte/transition";
  import { extent } from "d3-array";
  import { scaleLinear } from "d3-scale";
  import { line } from "d3-shape";

  // props
  let data = [
    { age: 0, temp: 30 },
    { age: 1, temp: 40 },
    { age: 2, temp: 50 },
    { age: 3, temp: 65 },
    { age: 4, temp: 75 },
    { age: 5, temp: 76 },
    { age: 6, temp: 77 },
    { age: 7, temp: 78 },
  ];

  let height = 100;
  let width = 100;
  let margin = {
    top: 5,
    left: 5,
    bottom: 5,
    right: 5,
  };
  // scales
  $: xScale = scaleLinear()
    .domain(extent(data.map((d) => d.age)))
    .range([margin.left, width - margin.right]);

  $: yScale = scaleLinear()
    .domain(extent(data.map((d) => d.temp)))
    .range([margin.top, height - margin.bottom]);

  // the path generator
  $: pathLine = line()
    .x((d) => xScale(d.age))
    .y((d) => yScale(d.temp));
</script>

<div id="error-chart" bind:offsetWidth={width} bind:offsetHeight={height}>
  <svg {width} height={height + margin.top + margin.bottom}>
    <line class="axis-line" x1="0" x2={width} y1={height} y2={height} />
    <line class="axis-line" x1="0" x2={0} y1={0} y2={height} />
    {#each xScale.ticks() as xTick}
      <text class="error-axis-text" x={xScale(xTick)} y={height}>
        {xTick}
      </text>
    {/each}
    <path
      class="outer-path"
      transition:draw={{ duration: 2000 }}
      d={pathLine(data)}
    />
    <path
      class="inner-path"
      transition:draw={{ duration: 2000 }}
      d={pathLine(data)}
    />
    {#each data as d}
      <circle cx={xScale(d.age)} cy={yScale(d.temp)} r="3" />
    {/each}
  </svg>
</div>

<style>
  #error-chart {
    height: 100%;
    width: 100%;
  }
  .axis-line {
    stroke-width: 4.5;
    stroke: black;
    fill: none;
  }
  .error-axis-text {
    font-family: Arial;
    font-size: 7px;
  }
  circle {
    fill: yellow;
    stroke: black;
    stroke-width: 2;
  }
  .inner-path {
    stroke: black;
    stroke-width: 1;
    fill: none;
    stroke-linecap: round;
  }
  .outer-path {
    stroke: black;
    stroke-width: 3;
    fill: none;
    stroke-linecap: round;
  }
</style>
