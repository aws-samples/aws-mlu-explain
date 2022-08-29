<script>
  import { onMount } from "svelte";
  import { extent } from "d3-array";
  import { scaleLinear } from "d3-scale";
  import { line, curveBasis } from "d3-shape";
  import { select } from "d3-selection";
  import { arrows, mluRobot, bananas } from "../assets.js";
  import { margin, gridRobot, gridRobotPath, gridQValues } from "../data-store.js";
  import { log } from "mathjs";

  export let numX = 3;
  export let numY = 3;

  $: robotWidth = 20;
  $: robotHeight = 20;

  onMount(() => {
    const robotBGSize = select("#agent-g").node().getBBox();
    robotWidth = robotBGSize.width;
    robotHeight = robotBGSize.height;
  });


  const directionMap = { up: 270, down: 90, left: 180, right: 0};
  const colorMap = { up: "coral", down: "skyblue", left: "green", right: "purple" };


  let data = [];
  // make dataset of [{x: 0, y: 0}, {x: 0, y: 1}, ..., {x: 3, y: 3}]
  for (let xVal = 0; xVal < numX; xVal++) {
    for (let yVal = 0; yVal < numY; yVal++) {
      data.push({ x: xVal, y: yVal });
    }
  }

  const width = 400;
  const height = 400;

  const cellWidth = width / numX;
  const cellHeight = height / numY;

  // scales
  $: xScale = scaleLinear().domain([0, numX]).range([0, width]);
  $: yScale = scaleLinear().domain([0, numY]).range([0, height]);

  // line generator
  $: agentLine = line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y));
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

  <!-- make arrows	 -->
  {#each $gridQValues as d, i}
    <g
      transform="translate({xScale(Math.floor(i / numY)) + cellWidth / 2 - 5}, {yScale(i % numY) +
        cellHeight / 2 -
        5})"
    >
      {#each arrows as arrow}
        <path
          d={arrow}
          style={`transform: rotate(${directionMap[d.maxDirection[d.maxDirection.length - 1]]}deg) scale(0.5)`}
          stroke-width="2"
          stroke={colorMap[d.maxDirection[d.maxDirection.length - 1]]}
          fill={colorMap[d.maxDirection[d.maxDirection.length - 1]]}
        />
      {/each}
    </g>
  {/each}
  <path class="agent-line" d={agentLine($gridRobotPath)} />

  <g
    id="agent-g"
    transform="translate({xScale($gridRobot.x) - 15}, {yScale($gridRobot.y) - 15})"
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
</svg>

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
