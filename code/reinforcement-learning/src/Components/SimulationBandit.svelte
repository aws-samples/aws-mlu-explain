<script>
  import { onMount } from "svelte";
  import { extent } from "d3-array";
  import { scaleLinear } from "d3-scale";
  import { line, curveBasis } from "d3-shape";
  import { select } from "d3-selection";
  import { arrows, mluRobot, bananas } from "../assets.js";
  import { margin, banditRobot, banditQValues } from "../data-store.js";
  import { log } from "mathjs";

  export let numX = 1;
  export let numY = 1;

  $: robotWidth = 20;
  $: robotHeight = 20;

  onMount(() => {
    const robotBGSize = select("#agent-g").node().getBBox();
    robotWidth = robotBGSize.width;
    robotHeight = robotBGSize.height;
  });

  const directionMap = { left: 180, right: 0 };
  const colorMap = { left: "green", right: "purple" };

  const width = 600;
  const height = 200;

  const cellWidth = width / numX;
  const cellHeight = height / numY;

  // scales
  $: xScale = scaleLinear().domain([0, numX]).range([0, width]);
  $: yScale = scaleLinear().domain([0, numY]).range([0, height]);
</script>

<svg {width} {height}>
  {#each [..."".padEnd(numX)].map((_, i) => i + 1) as tick}
    <g transform={`translate(${xScale(tick) + 0} ${height - $margin.bottom})`}>
      <!-- svelte-ignore component-name-lowercase -->
      <line
        class="grid-line"
        x1="0"
        x2="0"
        y1="0"
        y2={-height + $margin.bottom + $margin.top}
      />
      <text class="auc-axis-text" y="15" text-anchor="middle">{tick}</text>
    </g>
    <g transform={`translate(${$margin.left} ${yScale(tick) + 0})`}>
      <!-- svelte-ignore component-name-lowercase -->
      <line
        class="grid-line"
        x1="0"
        x2={width - $margin.right - $margin.left}
        y1="0"
        y2="0"
      />
      <text
        class="auc-axis-text"
        y="0"
        text-anchor="end"
        dominant-baseline="middle">{tick}</text
      >
    </g>
  {/each}

  <g id="banana">
    {#each bananas as banana}
      <path
        d={banana}
        style="transform: scale(0.25)"
        stroke="white"
        stroke-width="1"
        fill="black"
      />
    {/each}
</g>

    <g
      id="agent-g"
      transform="translate({xScale($banditRobot.x) - robotWidth / 2}, {yScale(
        $banditRobot.y
      )})"
    >
      <rect class="agent-rect" width={robotWidth} height={robotHeight} />
      <path
        d={mluRobot}
        style="transform: scale(0.1)"
        stroke="white"
        stroke-width="1"
        fill="black"
      />
    </g>
 </svg
>

<style>
  svg {
    border: 4px solid black;
    background-color: white;
    margin: 20px;
  }

  .agent-rect {
    fill: white;
  }

  .grid-line {
    stroke-width: 0.5;
    stroke: black;
  }
  path.agent-line {
    fill: none;
    stroke: coral;
  }
</style>
