<script>
  import { scaleLinear, scaleBand } from "d3-scale";
  import { margin } from "../store.js";
  import StackedRects from "./StackedRects.svelte";
  import Scatterplot from "./Scatterplot.svelte";

  let width = 500;
  let height = 500;
  $: nSplits = 4;
  $: xScale =
    nSplits < 8
      ? scaleLinear()
          .domain([-1, nSplits])
          .range([width * 0.2, width - width * 0.2])
      : scaleLinear().domain([-1, nSplits]).range([0, width]);
  // $: yScale = scaleLinear().domain([-1, 1]).range([height, 0]);
  $: yScale = scaleBand()
    .domain([-1, 0, 1, 2, 3, 4])
    .range([$margin.bottom, height - $margin.top])
    .padding(0.1);
  // $: xDiff = width / ((nSplits + 1) * 4);
  $: xDiff = 20;
  const numRects = 16;
  const testColor = "#ffad97";
  const trainColor = "#003181";
  const validationColor = "#f46ebb";

  // fill rule
  $: numCol = nSplits > 10 + 2 ? 1 : 2;
  $: numTest = 4;
  $: numValidation = (numRects - numTest) / nSplits;
  $: numTrain = numRects - numTest - numValidation;

  // $: console.log("nSplits: ", nSplits);
  // $: console.log("numtrain: ", numTrain);
  // $: console.log("numValidation: ", numValidation);
  // $: console.log("numTest: ", numTest);
  // $: console.log("sum: ", numTrain + numTest + numValidation);
</script>

<h1 class="body-header">
  <span class="section-arrow">&gt; </span> Try For Yourself
</h1>
<p class="body-text">
  To make the ideas behind Cross Validation more clear, we’ll see how the
  process works directly. Let’s assume that we’d like to use a one-dimensional
  linear regression model to predict the price of a house from its
  square-footage. Drag the value of k for yourself to set the number of folds.
  Observe that each fold results in a new data split alongside a newly trained
  model.
</p>
<br /><br />
<!-- <label> -->
<div id="input-container">
  <p id="input-label">K = {nSplits}</p>
  <input
    type="range"
    bind:value={nSplits}
    step="1"
    min="2"
    max={numRects - numTest}
  />
</div>
<!-- </label> -->
<div id="cv-chart" bind:offsetWidth={width} bind:offsetHeight={height}>
  <svg {width} height={height + $margin.top + $margin.bottom}>
    <!-- legend -->
    <g class="g-tag" transform="translate({width / 2 - 102}, {0})">
      <rect x={0} y="3" fill={trainColor} width="12" height="12" />
      <text class="legend-text" x={15} y="15">Train</text>
      <rect x={65} y="3" fill={validationColor} width="12" height="12" />
      <text class="legend-text" x={80} y="15">Validation</text>
      <rect x={170} y="3" fill={testColor} width="12" height="12" />
      <text class="legend-text" x={185} y="15">Test</text>
    </g>

    <!-- x-ticks -->
    {#each [...Array(nSplits).keys()] as tick}
      <!-- line to scatter plot -->
      <line
        class="axis-line"
        x1={xScale(tick) - 10}
        x2={xScale(tick) - 10}
        y1="0"
        y2={500}
        stroke="black"
        stroke-dasharray="4"
        opacity="0.08"
      />

      <StackedRects
        height={height / 4.5}
        {numCol}
        {numRects}
        x={xScale(tick) - xDiff}
        y={yScale(-1)}
        fillRule={(d) => {
          if (d >= numRects - numTest) return testColor;
          if (
            d >= numValidation * (nSplits - tick - 1) &&
            d < numValidation * (nSplits - tick - 1) + numValidation
          )
            return validationColor;
          return trainColor;
        }}
      />
      <!-- width={xScale(1) - xScale(0)} -->
      <!-- x={xScale(tick) - xDiff - (xScale(1) - xScale(0)) / 2} -->

      <!-- y={height / 3.5} -->
      <Scatterplot
        class="scatterplot"
        width={70}
        height={70}
        x={xScale(tick) - xDiff * 2}
        y={yScale(1)}
      />

      <!-- Error text -->
      <text class="fold-error-text" x={xScale(tick) - xDiff * 2} y={yScale(3)}
        >MAPE: 0.6%</text
      >

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
    <!-- Final accuracy text -->
    <text
      class="fold-error-text"
      id="average-fold-error-text"
      x="{width / 2},"
      y={yScale(4)}
      text-anchor="middle">Average Score: 0.85</text
    >
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
    /* outline: 2px solid black; */
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

  .fold-error-text {
    font-family: var(--font-heavy);
    font-size: 0.75rem;
    stroke-linejoin: round;
    paint-order: stroke fill;
    stroke: var(--white);
    stroke-width: 4px;
    fill: var(--magenta);
  }

  #average-fold-error-text {
    fill: var(--peach);
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
      width: 100%;
      margin: 1rem auto;
    }
  }
</style>
