<script>
  import { max } from "d3-array";
  import Scatterplot from "./Scatterplot.svelte";
  import { labels, network, numLayers, stepIndex, mobile } from "../../store";
  import { fade, fly } from "svelte/transition";
  import { positionElements } from "../../utils";

  $: maxNumNeurons = max($network) + 1;

  // let nodeWidth = 12 * 1.33 * 4.5;
  // let nodeHeight = 12 * 3;
  // let rectDim = 160;
  $: nodeWidth = $mobile ? 42 : 72;
  $: nodeHeight = $mobile ? 22 : 36;
  $: rectDim = $mobile ? 100 : 160;

  $: scatterCondition = ![0, 1].includes($stepIndex);
  $: manyNodesCondition = [6, 7, 8].includes($stepIndex);

  $: scatterWidth = scatterCondition
    ? manyNodesCondition
      ? rectDim * 0.88
      : rectDim
    : nodeWidth;

  $: scatterHeight = scatterCondition
    ? manyNodesCondition
      ? rectDim * 0.88
      : rectDim
    : nodeHeight;

  $: backgroundColor = scatterCondition ? "white" : "#ffe135";
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
  >{$labels[$numLayers - 1]}
</text>

<!-- scatterplot -->
<Scatterplot width={scatterWidth} height={scatterHeight} />

<style>
  .nn-node {
    stroke: var(--darksquidink);
    stroke-width: 2.5;
    fill-opacity: 1;
    transition: all 0.45s;
  }

  .nn-text {
    font-size: 12px;
    transition: all 0.45s;
    stroke-linejoin: round;
    paint-order: stroke fill;
    stroke-width: 4px;
    stroke: var(--white);
    letter-spacing: 1px;
  }
</style>
