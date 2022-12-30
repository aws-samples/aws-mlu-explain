<script>
  import { onMount } from "svelte";
  import { scaleLinear } from "d3-scale";
  import { select } from "d3-selection";
  import { mluRobot, arrow, bananaOne, bananaThree } from "../assets.js";
  import {
    banditWidth,
    banditHeight,
    bananaScale,
    arrowScale,
    robotScale,
  } from "../data-store.js";

  let numX = 9;
  let numY = 2;
  $: arrowBox = { height: 0, width: 0, x: 105, y: 0 };
  $: arrowBox2 = { height: 0, width: 0, x: 105, y: 0 };
  $: rewardBox = { height: 0, width: 0, x: 0, y: 0 };
  $: rewardBox3 = { height: 30, width: 0, x: 0, y: 0 };

  $: robotWidth = 20;
  $: robotHeight = 20;

  const directionXPos = {
    left: 2,
    right: 6,
  };
  const directionMap = {
    left: 90,
    right: 270,
  };

  onMount(() => {
    const robotBGSize = select("#agent-g-bandit")
      .node()
      .getBoundingClientRect();
    robotWidth = robotBGSize.width;
    robotHeight = robotBGSize.height;

    rewardBox = select("#reward-1-bandit").node().getBoundingClientRect();
    rewardBox3 = select("#reward-3-bandit").node().getBoundingClientRect();
    arrowBox = select("path.arrow-left").node().getBoundingClientRect();
    arrowBox2 = select("path.arrow-right").node().getBoundingClientRect();
  });

  // scales
  $: xScale = scaleLinear().domain([-1, numX]).range([0, $banditWidth]);
  $: yScale = scaleLinear().domain([-1, numY]).range([0, $banditHeight]);
</script>

<svg width={$banditWidth} height={$banditHeight}>
  {#each [...Array(numX).keys()] as tick}
    <g transform="translate({xScale(tick)}, {yScale(0)})">
      <!-- <rect x="0" y="0" width="10" height="100" fill="red" /> -->
      <!-- three bananas -->
    </g>
  {/each}
  <!-- bananas (1) -->
  <g
    id="reward-1-bandit"
    transform="translate({xScale(0) - rewardBox.width}, {yScale(0) -
      rewardBox.height / 2 -
      7.5})"
  >
    {#each bananaOne as b}
      <path class="bananaPath" d={b} style="transform: scale({$bananaScale})" />
    {/each}
  </g>
  <!-- bananas (3) -->
  <g
    id="reward-3-bandit"
    transform="translate({xScale(numX - 1) -
      rewardBox3.width / 2 -
      10}, {yScale(0) - rewardBox3.height / 2 - 7.5})"
  >
    <!-- <rect width={rewardBox3.width} height={rewardBox3.height} fill="red" /> -->
    {#each bananaThree as b}
      <path class="bananaPath" d={b} style="transform: scale({$bananaScale})" />
    {/each}
  </g>

  <!-- left arrow -->
  <g
    transform="translate({xScale(directionXPos['left']) +
      arrowBox.height / 2 +
      5.5}, {yScale(0) - arrowBox.width / 2 - 5})"
  >
    {#each arrow as ar}
      <path
        d={ar}
        class={`arrow-${"left"} arrow`}
        stroke-width={0}
        transform={`rotate(${directionMap["left"]}) scale(${$arrowScale})`}
      />
    {/each}
  </g>
  <!-- right arrow -->
  <g
    transform="translate({xScale(directionXPos['right']) -
      arrowBox.height / 2}, {yScale(0) + arrowBox.width / 2 + 5})"
  >
    {#each arrow as ar}
      <path
        d={ar}
        class={`arrow-${"right"} arrow`}
        stroke-width={0}
        transform={`rotate(${directionMap["right"]}) scale(${$arrowScale})`}
      />
    {/each}
  </g>
  <!-- mlu robot -->
  <g
    id="agent-g-bandit"
    transform="translate({xScale(4) - robotWidth / 2 + 5}, {yScale(0) -
      robotHeight / 2})"
  >
    <path
      d={mluRobot}
      style="transform: scale(0.22)"
      stroke="white"
      stroke-width="1"
      fill="black"
    />
  </g>
</svg>

<style>
  svg {
    /* border: 4px solid black; */
    /* background-color: white; */
    margin: 20px;
  }

  .agent-rect {
    fill: white;
  }

  .arrow-right {
    fill: var(--peach);
  }
  .arrow-left {
    fill: var(--magenta);
  }

  .grid-line {
    stroke-width: 0.5;
    stroke: black;
  }
  path.agent-line {
    fill: none;
    stroke: coral;
  }
  .bananaPath {
    stroke-width: 20;
    stroke: var(--darksquidink);
    fill: var(--mustardyellow);
  }
</style>
