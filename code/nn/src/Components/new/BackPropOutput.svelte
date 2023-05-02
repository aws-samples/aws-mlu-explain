<script>
  import { scaleLinear } from "d3-scale";
  import { max } from "d3-array";
  import BackpropScattter from "./BackpropScatter.svelte";
  import { marginScroll, network, numLayers, stepIndex } from "../../store";
  import { positionElements } from "../../utils";

  $: maxNumNeurons = max($network) + 1;

  export let height;
  export let width;
  // init to false so don't show drawing during rendering

  const rectDim = 160;

  $: xScale = scaleLinear()
    .domain([-1, $numLayers])
    .range([$marginScroll.left, width - $marginScroll.right]);
  $: yScale = scaleLinear()
    .domain([-1, maxNumNeurons])
    .range([height - $marginScroll.bottom, $marginScroll.top]);

  // responsive dimensions for scatter plot
  $: scatterWidth = rectDim ? rectDim : xScale(1) - xScale(0);
  $: yVals = positionElements(3, maxNumNeurons);
  $: scatterHeight = 1 ? rectDim : yScale(yVals[0]) - yScale(yVals[1]);
</script>

<!-- scatterplot -->

<g tranform={`translate(-100, -100)`}>
  <BackpropScattter width={scatterWidth} height={scatterHeight} />
</g>

<style>
</style>
