<script>
  import { onMount } from "svelte";
  import { scaleLinear } from "d3-scale";
  import { max } from "d3-array";
  import BackpropScattter from "./BackpropScatter.svelte";
  import {
    drawActivation,
    labelsBp,
    marginScroll,
    network,
    numLayers,
    showLayerLine,
    showSubScript,
    stepIndex,
    show,
  } from "../../store";
  import { line } from "d3-shape";
  import { fade, fly, draw } from "svelte/transition";
  import { positionElements } from "../../utils";

  $: maxNumNeurons = max($network) + 1;

  export let height;
  export let width;
  // init to false so don't show drawing during rendering
  $: visible = false;

  //   let nodeWidth = 70;
  //   let nodeHeight = 40;
  let nodeWidth = 12 * 1.33 * 4;
  let nodeHeight = 12 * 2;

  $: xScale = scaleLinear()
    .domain([-1, $numLayers])
    .range([$marginScroll.left, width - $marginScroll.right]);
  $: yScale = scaleLinear()
    .domain([-1, maxNumNeurons])
    .range([height - $marginScroll.bottom, $marginScroll.top]);

  $: scatterCondition = ![0, 1, 2].includes($stepIndex);
  $: console.log("stepindex,condition", $stepIndex, scatterCondition);

  // responsive dimensions for scatter plot
  $: scatterWidth = scatterCondition ? xScale(1) - xScale(0) : nodeWidth;
  //   $: scatterWidth = scatterCondition ? 160 : nodeWidth;
  $: yVals = positionElements(3, maxNumNeurons);
  $: scatterHeight = scatterCondition
    ? yScale(yVals[0]) - yScale(yVals[2])
    : nodeHeight;
  //   $: scatterHeight = scatterCondition ? 150 : nodeHeight;

  $: backgroundColor = scatterCondition ? "#f1f3f3" : "#ffe135";
  $: textYOffset = scatterCondition ? scatterHeight / 2 + 10 : 0;
</script>

<!-- background rect and label -->
<clipPath id="clip">
  <rect width={scatterWidth} height={scatterHeight} />
</clipPath>
<rect
  in:fly|local={{ x: -50, duration: 500 }}
  out:fade|local={{ duration: 0 }}
  class="nn-node"
  stroke-width="2.5"
  fill={backgroundColor}
  width={scatterWidth}
  height={scatterHeight}
  y={-scatterHeight / 2}
/>
<text
  in:fly|local={{ x: -50, duration: 500 }}
  out:fade|local={{ duration: 300 }}
  class="nn-text"
  text-anchor="middle"
  alignment-baseline="middle"
  dx={scatterWidth / 2}
  y={textYOffset}
  >{$labelsBp[$numLayers - 1]}
</text>

<!-- scatterplot -->

<BackpropScattter width={scatterWidth} height={scatterHeight} />

<style>
  .nn-node {
    stroke: var(--darksquidink);
    stroke-width: 2.5;
    fill-opacity: 1;
    transition: all 0.45s;
  }

  .nn-text {
    font-size: 0.8rem;
    transition: 0.45s ease;
  }

  .active {
    fill-opacity: 0;
  }

  /* .output {
        fill: var(--bananayellow);
      } */
</style>
