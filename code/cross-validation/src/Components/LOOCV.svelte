<script>
  import { scaleLinear } from "d3-scale";
  import { marginStatic } from "../store.js";
  import { arrowPath } from "../arrowPath";
  import StackedRects from "./StackedRects.svelte";
  import katexify from "../katexify";

  let width = 500;
  let height = 500;
  const nSplits = 23;
  const numCol = 1;
  const numRects = 26;
  const arrowWidth = 36;
  $: xScale = scaleLinear().domain([-1, nSplits]).range([0, width]);
  $: yScale = scaleLinear().domain([-1, 1]).range([height, 0]);
  $: xDiff = width / ((nSplits + 1) * 4);
</script>

<h1 class="body-header">
  <span class="section-arrow">&gt; </span> Leave-One-Out Cross Validation (LOOCV)
</h1>
<p class="body-text">
  A special case of K-Fold Cross-Validation, <span class="bold"
    >Leave-One-Out Cross-Validation (LOOCV)</span
  >, occurs when we set {@html katexify(`k`, false)} equal to {@html katexify(
    `n`,
    false
  )}, the number of observations in our dataset. In Leave-One-Out
  Cross-Validation, our data is split into a training set containing
  all but one observations, and a validation set containing the remaining
  left-out observation. That is, the training set consists of {@html katexify(
    `n - 1`,
    false
  )} data points, and the validation set consists of just one individual data point:
</p>
<br />

<div id="cv-chart" bind:offsetWidth={width} bind:offsetHeight={height}>
  <svg {width} height={height + $marginStatic.top + $marginStatic.bottom}>
    <!-- legend -->
    <g class="g-tag" transform="translate({width / 2 - 102}, {0})">
      <rect x={0} y="3" fill="#003181" width="12" height="12" />
      <text class="legend-text" x={15} y="15">Train</text>
      <rect x={65} y="3" fill="#f46ebb" width="12" height="12" />
      <text class="legend-text" x={80} y="15">Validation</text>
      <rect x={170} y="3" fill="#ffad97" width="12" height="12" />
      <text class="legend-text" x={185} y="15">Test</text>
    </g>

    <!-- x-ticks -->
    {#each [...Array(nSplits).keys()] as tick}
      {#if tick === 1}
        <g transform="translate({xScale(tick) - xDiff}, {yScale(0)})">
          <path
            d={arrowPath}
            style={`transform: scale(.35)`}
            stroke="#232f3e"
            stroke-width={`${4 / 0.35}`}
            fill="#232f3e"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
      {:else if tick === 0}
        <StackedRects
          {height}
          {numCol}
          {numRects}
          x={xScale(tick) - xDiff}
          fillRule={() => {
            return "#232f3e";
          }}
        />
      {:else}
        <StackedRects
          {height}
          {numCol}
          {numRects}
          x={xScale(tick) - xDiff}
          fillRule={(d) => {
            if (d > 20) return "#ffad97";
            if (d === 24 - tick - 2) return "#f46ebb";
            return "#003181";
          }}
        />
      {/if}
    {/each}
  </svg>
</div>
<br /><br />
<p class="body-text">
  LOOCV carries all the same benefits mentioned previously, as well as some more
  that we'll discuss in the Bias-Variance tradeoff section below. While the
  large value of {@html katexify(`k`, false)} in LOOCV should minimize the variance
  in our estimate, it comes with a cost: the need to train a model {@html katexify(
    `n`,
    false
  )}
  times! This is expensive both in the amount of time it takes and the compute resources
  it requires. For this reason, it's rare to see LOOCV employed in the wild unless
  there is a specific structure of the model that makes this computation efficient
  (like ridge regression). A more conservative value of {@html katexify(
    `k`,
    false
  )} is more commonly used instead (e.g. {@html katexify(`k = 5`, false)} or {@html katexify(
    `k = 10`,
    false
  )}).
</p>

<style>
  .legend-text {
    font-family: var(--font-heavy);
  }

  #cv-chart {
    margin: auto;
    height: 48vh;
    width: 40%;
    margin: 1rem auto;
  }

  /* ipad */
  @media screen and (max-width: 950px) {
    #cv-chart {
      height: 55vh;
      width: 85%;
      margin: 1rem auto;
    }
  }
  /* mobile */
  @media screen and (max-width: 750px) {
    #cv-chart {
      height: 55vh;
      width: 95%;
      margin: 1rem auto;
    }
  }
</style>
