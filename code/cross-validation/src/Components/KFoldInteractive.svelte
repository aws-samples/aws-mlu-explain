<script>
  import { scaleLinear, scaleBand } from "d3-scale";
  import { margin } from "../store.js";
  import StackedRects from "./StackedRects.svelte";
  import Scatterplot from "./Scatterplot.svelte";
  import { extent, mean } from "d3-array";
  import { regressionLinear } from "d3-regression";
  import { format } from "d3-format";

  let width = 500;
  let height = 500;

  // label formatter
  const formatter = format(".1f");

  $: nSplits = 4;
  $: xScale =
    nSplits < 7
      ? scaleLinear()
          .domain([-1, nSplits])
          .range([width * 0.1, width - width * 0.1])
      : scaleLinear().domain([-1, nSplits]).range([0, width]);
  $: yScale = scaleBand()
    .domain([-1, 0, 1, 2, 3, 4])
    .range([$margin.bottom, height - $margin.top])
    .padding(0.1);
  $: xDiff = 20;
  const numRects = 16;
  const testColor = "#ffad97";
  const trainColor = "#003181";
  const validationColor = "#f46ebb";

  const dataLinear = [
    { x: 10, y: 24 },
    { x: 13, y: 4 },
    { x: 11, y: 4 },
    { x: 9, y: 23 },
    { x: 8, y: 8 },
    { x: 2, y: 10 },
    { x: 11, y: 3 },
    { x: 6, y: 6 },
    { x: 5, y: 8 },
    { x: 4, y: 12 },
    { x: 12, y: 20 },
    { x: 9, y: 4 },
    { x: 6, y: 9 },
    { x: 1, y: 14 },
    { x: 1, y: 14 },
    { x: 4, y: 15 },
  ];

  // fill rule
  $: numCol = nSplits > 10 + 2 ? 1 : 2;
  $: numTest = 4;
  $: numValidation = (numRects - numTest) / nSplits;
  $: numTrain = numRects - numTest - numValidation;

  const linearRegression = regressionLinear()
    .x((d) => d.x)
    .y((d) => d.y)
    .domain(extent(dataLinear, (d) => d.x));

  // instead of iterating over ticks, need to iterate over ticks and create data at higher
  // level component (here), so state can be passed down.KFoldInteractive

  // iterate through [...Array(nSplits).keys()] as tick
  // for each iteration: create
  // dataset with labels
  // regression dataset
  // end
  // then:
  // loop through that data in each block
  $: console.log("WIDTH", width / 2);
  $: errorMean = 0;
  $: dataArray = [];
  $: splits = [...Array(nSplits).keys()];
  $: {
    dataArray = [];
    for (const tick of splits) {
      // for each slice of data, calculate regression stuff
      const splitData = dataLinear.map((data, i) => {
        // circle color to match train/test/val split
        const color =
          i >= numRects - numTest
            ? testColor
            : i >= numValidation * (nSplits - tick - 1) &&
              i < numValidation * (nSplits - tick - 1) + numValidation
            ? validationColor
            : trainColor;
        return { x: data.x, y: data.y, color: color };
      });
      const trainData = splitData.filter((d) => d.color === trainColor);
      const regressionData = linearRegression(trainData);

      // calculate MSE
      const validationData = splitData.filter(
        (d) => d.color === validationColor
      );
      const slope = regressionData["b"];
      const intercept = regressionData["a"];
      const n = validationData.length;
      // calculate squared errors (validation - predicted validation)
      const squaredErrors = validationData.map((d, i) => {
        const yPred = slope * d.x + intercept;
        const y = d.y;
        const difference = (y - yPred) ** 2;
        return difference;
      });
      // average over squared errors
      const meanSquaredError = squaredErrors.reduce((a, b) => a + b) / n;
      console.log("errors", meanSquaredError);

      const dataSet = {
        scatterData: splitData,
        regressionData: regressionData,
        mse: meanSquaredError,
      };

      dataArray = [...dataArray, dataSet];
    }

    // calculate average error across datasets
    errorMean = mean(dataArray, (d) => d.mse);
  }
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
      <!-- <line
        class="axis-line"
        x1={xScale(tick) - 10}
        x2={xScale(tick) - 10}
        y1="0"
        y2={500}
        stroke="black"
        stroke-dasharray="4"
        opacity="0.08"
      /> -->

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

      <Scatterplot
        data={dataArray[tick]["scatterData"]}
        regressionData={dataArray[tick]["regressionData"]}
        width={85}
        height={85}
        x={xScale(tick) - xDiff * 2}
        y={yScale(1)}
      />

      <!-- Error text -->
      <text class="fold-error-text" x={xScale(tick) - xDiff * 2} y={yScale(3)}
        >Val MSE: {formatter(dataArray[tick]["mse"])}</text
      >
    {/each}
    <!-- Final accuracy text -->
    <text
      class="fold-error-text"
      id="average-fold-error-text"
      x={width / 2}
      y={yScale(4)}
      text-anchor="middle">Estimated Test MSE: {formatter(errorMean)}</text
    >
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
    font-size: 0.7rem;
    stroke-linejoin: round;
    paint-order: stroke fill;
    stroke: var(--white);
    stroke-width: 4px;
    fill: var(--magenta);
  }

  #average-fold-error-text {
    fill: var(--peach);
    font-size: 0.8rem;
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
    #cv-chart {
      max-height: 55vh;
      width: 100%;
      margin: 1rem auto;
    }
  }
</style>
