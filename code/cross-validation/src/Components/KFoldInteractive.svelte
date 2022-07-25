<script>
  import { scaleLinear, scaleBand } from "d3-scale";
  import { margin } from "../store.js";
  import { arrowPath } from "../arrowPath";
  import StackedRects from "./StackedRects.svelte";

  let width = 500;
  let height = 500;
  $: nSplits = 6;
  $: xScale =
    nSplits < 10
      ? scaleLinear()
          .domain([-1, nSplits])
          .range([width * 0.2, width - width * 0.2])
      : scaleLinear().domain([-1, nSplits]).range([0, width]);
  $: yScale = scaleLinear().domain([-1, 1]).range([height, 0]);
  $: xDiff = width / ((nSplits + 1) * 4);
  const numRects = 16;

  // fill rule
  $: numCol = nSplits > 11 + 2 ? 1 : 2;
  $: numTest = 4;
  $: numValidation = Math.floor((numRects - numTest) / nSplits);
  $: numTrain = numRects - numTest - numValidation;

  $: fillRule = (d) => {
    // train colors
    if (d > numTrain) {
      return "#ffad97";
    } else if (d > numValidation) {
      return "#f46ebb";
    }
    // validation colors
    // if (d === numRects - nSplits - 2) return "#f46ebb";
    // test colors
    return "#003181";
  };
</script>

<h1 class="body-header">
  <span class="section-arrow">&gt; </span> Try For Yourself
</h1>
<p class="body-text">
  To k-folds cross-validation more clear, we’ll see how the process works
  directly. Let’s assume that we’d like to use a one-dimensional linear
  regression model to predict the price of a house from its square-footage. Drag
  the value of k for yourself to set the number of folds. Observe that each fold
  results in a new data split alongside a newly trained model.
</p>
<br /><br />
<!-- <label> -->
<div id="input-container">
  <p id="input-label">K = {nSplits - 2}</p>
  <input type="range" bind:value={nSplits} min="3" max="18" />
</div>
<!-- </label> -->
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
        <g transform="translate({xScale(tick) - xDiff}, {height / 6 - xDiff})">
          <path
            d={arrowPath}
            style={`transform: scale(0.07)`}
            stroke="#232f3e"
            stroke-width="3"
            fill="#232f3e"
          />
        </g>
      {:else if tick === 0}
        <StackedRects
          height={height / 2.75}
          {numCol}
          {numRects}
          x={xScale(tick) - xDiff}
          fillRule={() => {
            return "#232f3e";
          }}
        />
      {:else}
        <!-- {console.log("tick", (tick - 2)} -->
        <!-- fillRule={fillRule(d, tick)} -->
        <!-- fillRule={(d) => {
          if (d > 59) return "#ffad97";
          if (d >= 15 * (tick - 2) && d < 15 * (tick - 2) + 15)
            return "#f46ebb";
          return "#003181";
        }} -->

        <StackedRects
          height={height / 2.75}
          {numCol}
          {numRects}
          x={xScale(tick) - xDiff}
          {fillRule}
        />
      {/if}

      <!-- x-ticks -->
      {#each xScale.ticks() as tick}
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
      {/each}
    {/each}
    <!-- title -->
    <!-- <text class="title-text" x="0" y={$margin.top} text-anchor="middle"
      >Validation Set Approach</text
    > -->
  </svg>
</div>
<br />
<br />
<p class="body-text">
  When exploring the fit models above, you may have observed something
  interesting! The lines of best fit across our folds vary more for lower values
  of k than for higher values of k. This is a result of our old friend, the bias
  variance tradeoff (https://mlu-explain.github.io/bias-variance/). Read on to
  learn more!
</p>

<style>
  svg {
    /* border: 1px solid black; */
  }

  #input-label {
    font-family: var(--font-heavy);
    font-size: 1.2rem;
  }

  .legend-text {
    font-family: var(--font-heavy);
  }

  #cv-chart {
    margin: auto;
    max-height: 80vh;
    width: 90%;
    margin: 1rem auto;
    max-width: 1600px;
    /* border: 2px solid black; */
  }

  #input-container {
    max-width: 600px;
    margin: 0 auto;
  }

  /* ipad */
  @media screen and (max-width: 950px) {
    #cv-chart {
      max-height: 55vh;
      width: 85%;
      margin: 1rem auto;
    }
  }
  /* mobile */
  @media screen and (max-width: 750px) {
    ul {
      font-size: 18px;
      max-width: 80%;
    }
    #cv-chart {
      max-height: 55vh;
      width: 95%;
      margin: 1rem auto;
    }
  }
</style>
