<script>
  import { line } from "d3-shape";
  import { scaleLinear } from "d3-scale";
  import { format } from "d3-format";
  import { gridQValues } from "../data-store.js";

  //   props
  export let height = 500;
  export let width = 500;
  export let index = 0;

  const margin = {
    top: 8,
    bottom: 12,
    left: 16,
    right: 0,
  };

  // label formatter
  const formatter = format(".2d");

  //   get max value for x-axis
  $: xMax = $gridQValues[0]["redValue"].length;

  // scales
  $: xScale = scaleLinear()
    .domain([0, xMax + 1])
    .range([margin.left, width - margin.right]);
  $: yScale = scaleLinear()
    .domain([0, 8])
    .range([height - margin.bottom, margin.top]);

  // susbet data for line charts
  $: pathAData = $gridQValues[index]["redValue"].map((val, i) => {
    return { x: i, y: val };
  });

  $: pathBData = $gridQValues[index]["blueValue"].map((val, i) => {
    return { x: i, y: val };
  });

  //   d3 line generator
  $: pathGenerator = line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y));
</script>

<!-- x-ticks -->
{#each xScale.ticks() as tick}
  <g transform={`translate(${xScale(tick) + 0} ${height - margin.bottom})`}>
    <text class="axis-text" y="7" text-anchor="middle"
      >{tick % 2 == 0 ? formatter(tick) : ""}</text
    >
  </g>
{/each}
<!-- y-ticks -->
{#each yScale.ticks() as tick}
  <g transform={`translate(${margin.left - 5} ${yScale(tick) + 0})`}>
    <text
      class="axis-text"
      y="0"
      dx="1"
      text-anchor="end"
      dominant-baseline="middle">{tick % 2 == 0 ? formatter(tick) : ""}</text
    >
  </g>
  <!-- axis lines -->
  <!-- svelte-ignore component-name-lowercase -->
  <line
    class="axis-line"
    x1={margin.left}
    x2={margin.left}
    y1={margin.top}
    y2={height - margin.bottom}
    stroke="black"
  />
  <!-- svelte-ignore component-name-lowercase -->
  <line
    class="axis-line"
    x1={margin.left}
    x2={width - margin.right}
    y1={height - margin.bottom}
    y2={height - margin.bottom}
    stroke="black"
  />
{/each}

<!-- reactively draw lines -->
<path class="pathA-line" d={pathGenerator(pathAData)} />
<path class="pathB-line" d={pathGenerator(pathBData)} />

<!-- reactively draw circles -->
{#each pathAData as d}
  <circle class="pathA-circle" r="1.5" cx={xScale(d.x)} cy={yScale(d.y)} />
{/each}
{#each pathBData as d}
  <circle class="pathB-circle" r="1.5" cx={xScale(d.x)} cy={yScale(d.y)} />
{/each}

<style>
  .pathA-line {
    stroke: coral;
    stroke-width: 1;
    fill: none;
  }
  .pathB-line {
    stroke: skyblue;
    stroke-width: 1;
    fill: none;
  }

  .pathA-circle {
    fill: coral;
  }

  .pathB-circle {
    fill: skyblue;
  }

  .axis-text {
    font-size: 0.4rem;
  }

  /* ipad */
  @media screen and (max-width: 950px) {
  }
  /* mobile */
  @media screen and (max-width: 750px) {
  }
</style>
