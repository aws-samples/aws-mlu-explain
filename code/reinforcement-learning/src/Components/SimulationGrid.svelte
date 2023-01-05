<script>
  import { onMount } from "svelte";
  import { extent } from "d3-array";
  import { scaleLinear } from "d3-scale";
  import { line, curveBasis } from "d3-shape";
  import { select } from "d3-selection";
  import {
    arrow,
    mluRobot,
    bananaOne,
    bananaThree,
    cactus,
  } from "../assets.js";
  import {
    margin,
    gridWidth,
    gridHeight,
    gridRobot,
    gridRobotPath,
    gridQValues,
    lowRewardGrid,
    highRewardGrid,
    negRewardGrid,
    gridStatIndex,
  } from "../data-store.js";

  let numX = 4;
  let numY = 4;

  $: robotWidth = 20;
  $: robotHeight = 20;

  $: arrowBox = { height: 0, width: 0, x: 105, y: 0 };
  $: rewardBox = { height: 0, width: 0, x: 0, y: 0 };
  $: rewardBox3 = { height: 30, width: 0, x: 0, y: 0 };
  $: cactusBox = { height: 0, width: 0, x: 0, y: 0 };

  onMount(() => {
    const robotBGSize = select("#agent-g").node().getBoundingClientRect();
    robotWidth = robotBGSize.width;
    robotHeight = robotBGSize.height;

    rewardBox = select("#reward-1").node().getBoundingClientRect();
    rewardBox3 = select("#reward-3").node().getBoundingClientRect();
    cactusBox = select("#cactus").node().getBoundingClientRect();
    arrowBox = select("path.arrow-up").node().getBoundingClientRect();
  });

  const directionMap = { up: 180, down: 0, left: 90, right: 270 };

  let data = [];
  // make dataset of [{x: 0, y: 0}, {x: 0, y: 1}, ..., {x: 3, y: 3}]
  for (let xVal = 0; xVal < numX; xVal++) {
    for (let yVal = 0; yVal < numY; yVal++) {
      data.push({ x: xVal, y: yVal });
    }
  }

  $: cellWidth = $gridWidth / numX;
  $: cellHeight = $gridHeight / numY;

  // const startRobotPointX = $gridRobot.x;
  // const startRobotPointY = $gridRobot.y;

  // offset directions for rotated arrows
  $: directionOffset = {
    up: { x: arrowBox.width / 2 + 5, y: -cellWidth / 6 },
    down: { x: -arrowBox.width / 2 - 5, y: cellWidth / 6 },
    right: { x: cellWidth / 6, y: arrowBox.width / 2 + 5 },
    left: { x: -cellWidth / 6, y: -arrowBox.width / 2 - 5 },
  };

  // scales
  $: xScale = scaleLinear().domain([0, numX]).range([0, $gridWidth]);
  $: yScale = scaleLinear().domain([0, numY]).range([0, $gridHeight]);

  // line generator
  $: agentLine = line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y));

  $: {
  }

  $: rewardArray = [
    $lowRewardGrid[$gridStatIndex],
    $highRewardGrid[$gridStatIndex],
    $negRewardGrid[$gridStatIndex],
  ];
</script>

<svg width={$gridWidth} height={$gridHeight}>
  {#each [..."".padEnd(numX)].map((_, i) => i + 1) as tick}
    <g
      transform={`translate(${xScale(tick) + 0} ${
        $gridHeight - $margin.bottom
      })`}
    >
      <!-- svelte-ignore component-name-lowercase -->
      <line
        class="grid-line"
        x1="0"
        x2="0"
        y1="0"
        y2={-$gridHeight + $margin.bottom + $margin.top}
      />
      <text class="auc-axis-text" y="15" text-anchor="middle">{tick}</text>
    </g>
    <g transform={`translate(${$margin.left} ${yScale(tick) + 0})`}>
      <!-- svelte-ignore component-name-lowercase -->
      <line
        class="grid-line"
        x1="0"
        x2={$gridWidth - $margin.right - $margin.left}
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

  <!-- make grid here -->
  {#each $gridQValues as d, i}
    <!-- don't draw arrows for banana state -->
    <g
      transform="translate({xScale(Math.floor(i / numY)) +
        cellWidth / 2}, {yScale(i % numY) + cellHeight / 2})"
    >
      {#if rewardArray.some((r) => r.length == [Math.floor(i / numY), i % numY].length && r.every((value, index) => [Math.floor(i / numY), i % numY][index] == value))}
        {console.log("skip")}
      {:else}
        {#each ["up", "down", "left", "right"] as arrowDirection}
          <g
            transform="translate({directionOffset[arrowDirection][
              'x'
            ]}, {directionOffset[arrowDirection]['y']})"
          >
            <!-- arrows -->
            {#each arrow as ar}
              <path
                d={ar}
                class={`arrow-${arrowDirection} arrow`}
                stroke-width={0}
                transform={`rotate(${directionMap[arrowDirection]}) scale(0.05)`}
                opacity={d.maxDirection[d.maxDirection.length - 1] ==
                arrowDirection
                  ? 1
                  : d[`${arrowDirection}Weight`][d.maxDirection.length - 1]}
              />
            {/each}
          </g>
        {/each}
      {/if}
    </g>
  {/each}

  <!-- path to reward -->
  <path class="agent-line-outline" d={agentLine($gridRobotPath)} />
  <path class="agent-line" d={agentLine($gridRobotPath)} />

  <!-- bananas rewards-->
  <!-- single banana -->
  <g
    id="reward-1"
    transform="translate({xScale($lowRewardGrid[$gridStatIndex][0])}, {yScale(
      $lowRewardGrid[$gridStatIndex][1]
    ) +
      rewardBox.height / 2 -
      7.5})"
  >
    {#each bananaOne as b}
      <path class="bananaPath" d={b} transform="scale(0.13)" />
    {/each}
  </g>

  <!-- three bananas -->
  <g
    id="reward-3"
    transform="translate({xScale($highRewardGrid[$gridStatIndex][0])}, {yScale(
      $highRewardGrid[$gridStatIndex][1]
    ) +
      rewardBox3.height / 2 -
      7.5})"
  >
    {#each bananaThree as b}
      <path class="bananaPath" d={b} style="transform: scale(0.13)" />
    {/each}
  </g>

  <!-- cactus rewards -->
  <g
    id="cactus"
    transform="translate({xScale($negRewardGrid[$gridStatIndex][0]) +
      10}, {yScale($negRewardGrid[$gridStatIndex][1]) +
      cactusBox.height / 2 -
      12.5})"
  >
    {#each cactus as c}
      <path class="cactusPath" d={c} style="transform: scale(0.13)" />
    {/each}
  </g>

  <g
    id="agent-g"
    transform="translate({xScale($gridRobot.x) - robotWidth / 2}, {yScale(
      $gridRobot.y
    ) -
      robotHeight / 2})"
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
    margin: 20px;
  }

  .arrow-up {
    fill: var(--sky);
  }
  .arrow-down {
    fill: var(--anchor);
  }
  .arrow-right {
    fill: var(--peach);
  }
  .arrow-left {
    fill: var(--magenta);
  }

  .agent-rect {
    fill: var(--bg);
  }

  .grid-line {
    stroke-width: 0.5;
    stroke: black;
  }
  path.agent-line-outline {
    fill: none;
    stroke-width: 9;
    stroke: var(--darksquidink);
  }
  path.agent-line {
    fill: none;
    stroke-width: 5.5;
    stroke: var(--mustardyellow);
  }

  .bananaPath {
    stroke-width: 20;
    stroke: var(--darksquidink);
    fill: var(--mustardyellow);
  }
  .cactusPath {
    stroke: var(--darksquidink);
    stroke-width: 20;
    fill: #5fa141;
  }
</style>
