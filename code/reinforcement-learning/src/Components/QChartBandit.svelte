<script>
  import { line } from "d3-shape";
  import { scaleLinear } from "d3-scale";
  import { format } from "d3-format";
  import { banditQValues } from "../data-store.js";

  //   props
  let width = 300;
  let height = 260;
  let index = 0;

  const margin = { top: 10, right: 40, bottom: 40, left: 40 };
  const formatter = format(".2d");

  //   get max value for x-axis
  $: xMax = $banditQValues[0]["left"].length;

  $: xScale = scaleLinear()
    .domain([0, xMax + 1])
    .range([margin.left, width - margin.right]);

  $: yScale = scaleLinear()
    .domain([-2, 5])
    .range([height - margin.bottom, margin.top]);

  $: pathLeftData = $banditQValues[index]["left"].map((val, i) => {
    return { x: i, y: val };
  });

  $: pathRightData = $banditQValues[index]["right"].map((val, i) => {
    return { x: i, y: val };
  });

  $: pathGenerator = line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y));
</script>

<svg {width} {height}>
  <!-- reactively draw lines -->
  <path class="pathLeft-line path" d={pathGenerator(pathLeftData)} />
  <path class="pathRight-line path" d={pathGenerator(pathRightData)} />

  <!-- x-ticks -->
  {#each xScale.ticks() as tick}
    <g transform={`translate(${xScale(tick) + 0} ${height - margin.bottom})`}>
      <text class="axis-text" y="17" text-anchor="middle"
        >{tick % 2 == 0 ? formatter(tick) : ""}</text
      >
    </g>
  {/each}

  <!-- axis labels -->
  <text
    class="bandit-axis-label"
    y={height - 7}
    x={width / 2}
    text-anchor="middle">Number of Episodes</text
  >
  <text
    class="bandit-axis-label"
    y={margin.left / 3}
    x={-yScale(1)}
    text-anchor="middle"
    transform="rotate(-90)">Q-Value</text
  >

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
</svg>

<style>
  .bandit-axis-label {
    font-family: var(--font-heavy);
  }

  .axis-line {
    fill: none;
    stroke: var(--squidink);
  }

  .axis-text {
    font-family: var(--font-heavy);
  }

  .pathLeft-line {
    stroke: var(--magenta);
  }
  .pathRight-line {
    stroke: var(--peach);
  }

  .path {
    stroke-width: 4;
  }
</style>
