<script>
  import { scaleLinear } from "d3-scale";
  import { margin } from "../store.js";
  import { arrowPath } from "../arrowPath";
  import StackedRects from "./StackedRects.svelte";

  let width = 500;
  let height = 500;
  const nSplits = 23;
  const numCol = 1;
  const numRects = 26;
  $: xScale = scaleLinear().domain([-1, nSplits]).range([0, width]);
  $: yScale = scaleLinear().domain([-1, 1]).range([height, 0]);
  $: xDiff = width / ((nSplits + 1) * 4);

  let validationLabels = [
    { label: "Train", y: 5 },
    { label: "Validation", y: 13 },
    { label: "Test", y: 18 },
  ];
</script>

<h1 class="body-header">
  <span class="section-arrow">&gt; </span> Leave-One-Out Cross-Validation (LOOCV)
</h1>
<p class="body-text">
  A special case of k-fold cross-validation, called *leave one out cv*, occurs
  when we set k equal to n, the number of observations in our dataset. In
  leave-one-out cross-validation, our data is repeatedly split into a training
  set containing all but one observations, and a validation set containing the
  remaining left out observation. That is, the training set consists of n-1
  observations, and the validation set consists of just one individual
  observation:
</p>
<br />

<div id="cv-chart" bind:offsetWidth={width} bind:offsetHeight={height}>
  <svg {width} height={height + $margin.top + $margin.bottom}>
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
        <!-- <text text-anchor="middle" x={xScale(tick)} y={yScale(0)}>hey</text> -->
        <g
          transform="translate({xScale(tick) - xDiff - 7}, {yScale(0) - xDiff})"
        >
          <path
            d={arrowPath}
            style={`transform: scale(0.8)`}
            stroke="#232f3e"
            stroke-width="3"
            fill="#232f3e"
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

      <!-- x-ticks -->
      <!-- {#each xScale.ticks() as tick}
        <g transform={`translate(${xScale(tick)} ${height - $margin.bottom})`}>
          <line
            class="axis-line"
            x1="0"
            x2="0"
            y1="0"
            y2={-height + $margin.bottom + $margin.top}
            stroke="black"
            stroke-dasharray="4"
          />
        </g>
      {/each} -->
    {/each}
    <!-- title -->
    <!-- <text class="title-text" x="0" y={$margin.top} text-anchor="middle"
        >Validation Set Approach</text
      > -->
  </svg>
</div>
<br /><br />
<p class="body-text">
  LOOCV carries all the same benefits mentioned previously, as well as some more
  we'll discuss in the Bias Variance tradeoff section below (though these may be
  contentioius!). However, large value of k used in LOOCV carries some
  additional costs, namely that it requires re-training our data <span
    class="bold">many</span
  >
  times (once for every data point!). This is expensive both in the amount of resources
  it requires, as well as the time it takes to wait for your model to train on so
  many iterations. For this reason, it's rare to see LOOCV employed in the wild,
  (especially for large-scale models), and a more conservative value of k is often
  used (e.g. k = 5 or k = 10).
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
