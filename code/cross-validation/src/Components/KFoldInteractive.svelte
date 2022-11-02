<script>
  import { scaleLinear, scaleBand } from "d3-scale";
  import { marginGrid } from "../store.js";
  import StackedRects from "./StackedRects.svelte";
  import Scatterplot from "./Scatterplot.svelte";
  import { extent, mean, range } from "d3-array";
  import { regressionLinear } from "d3-regression";
  import { format } from "d3-format";
  import katexify from "../katexify";

  let width = 500;
  let height = 500;

  const formatter = format(".1f");

  const dimensions = {
    desktop: {
      2: { rows: 1, cols: 2 },
      3: { rows: 1, cols: 3 },
      4: { rows: 2, cols: 3 },
      5: { rows: 2, cols: 3 },
      6: { rows: 2, cols: 3 },
      7: { rows: 3, cols: 3 },
      8: { rows: 3, cols: 3 },
      9: { rows: 3, cols: 3 },
      10: { rows: 4, cols: 3 },
      11: { rows: 4, cols: 3 },
      12: { rows: 4, cols: 3 },
    },
    mobile: {
      2: { rows: 1, cols: 2 },
      3: { rows: 2, cols: 2 },
      4: { rows: 2, cols: 2 },
      5: { rows: 3, cols: 2 },
      6: { rows: 3, cols: 2 },
      7: { rows: 4, cols: 2 },
      8: { rows: 4, cols: 2 },
      9: { rows: 5, cols: 2 },
      10: { rows: 5, cols: 2 },
      11: { rows: 6, cols: 2 },
      12: { rows: 6, cols: 2 },
    },
  };
  $: window = width <= 400 ? "mobile" : "desktop";

  $: nSplits = 3;
  $: xScale = scaleBand()
    .domain(range(0, dimensions[window][nSplits].cols))
    .range([width * 0.2, width * 0.95]);
  $: yScale = scaleBand()
    .domain(range(-1, dimensions[window][nSplits].rows))
    .range([$marginGrid.bottom, height - $marginGrid.top])
    // .range([$marginGrid.bottom, height - $marginGrid.top])
    .padding(0.2);
  $: xDiff = Math.min(width * 0.04, 20);
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

<svelte:window bind:innerWidth={width} />

<h1 class="body-header">
  <span class="section-arrow">&gt; </span> See For Yourself
</h1>
<p class="body-text">
  To make K-Fold Cross-Validation more clear, let's see how it works directly.
  We'll assume that we’d like to use a simple linear regression model to predict
  some values of {@html katexify(`y`, false)} from some data {@html katexify(
    `x`,
    false
  )}. Drag the value of {@html katexify(`k`, false)} below to set the number of folds
  used in K-Fold Cross-Validation. Observe that each value of {@html katexify(
    `k`,
    false
  )} yields a new model trained and evaluated on different splits of the original
  dataset. (Note that the test data remains unchanged, as we use it only once, at
  the very end, to estimate our test Mean Square Error, or MSE):
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
  <svg {width} height={height + $marginGrid.top + $marginGrid.bottom}>
    <!-- legend -->
    <g class="g-tag" transform="translate({width / 2 - 102}, {0})">
      <rect x={0} y="0" fill={trainColor} width="12" height="12" />
      <text class="legend-text" x={15} y="12">Train</text>
      <rect x={65} y="0" fill={validationColor} width="12" height="12" />
      <text class="legend-text" x={80} y="12">Validation</text>
      <rect x={170} y="0" fill={testColor} width="12" height="12" />
      <text class="legend-text" x={185} y="12">Test</text>
    </g>

    {#each [...Array(nSplits).keys()] as tick}
      <StackedRects
        height={yScale.bandwidth()}
        margin={$marginGrid}
        {numCol}
        {numRects}
        x={xScale(tick % (width <= 400 ? 2 : 3))}
        y={yScale(Math.floor(tick / (width <= 400 ? 2 : 3))) -
          yScale.bandwidth() -
          xDiff * 0}
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
        label={`Val MSE: ${formatter(dataArray[tick]["mse"])}`}
        width={window === "mobile"
          ? yScale.bandwidth() * 0.5
          : yScale.bandwidth() * 0.9}
        height={yScale.bandwidth()}
        x={xScale(tick % (width <= 400 ? 2 : 3)) + xDiff * 3}
        y={yScale(Math.floor(tick / (width <= 400 ? 2 : 3))) -
          yScale.bandwidth()}
      />

      <!-- Error text -->
    {/each}
    <!-- Final accuracy text -->
    <text
      class="fold-error-text"
      id="average-fold-error-text"
      x={width / 2}
      y={30}
      text-anchor="middle">Estimated Test MSE: {formatter(errorMean)}</text
    >
  </svg>
</div>
<p class="body-text">
  Because each fold uses different data points for training and evaluating each
  model, each fold's model will be slightly different from the other. The final
  test MSE is evaluated by average performance on the test set across all of the
  folds in aggregate.
  <br /><br />
  In exploring the fit in the models above, you may have observed something interesting!
  The lines of best fit (and estimated test MSE) vary more for lower values of {@html katexify(
    `k`,
    false
  )}
  than for higher values of {@html katexify(`k`, false)}. This is a result of
  our old friend, the
  <a href="https://mlu-explain.github.io/bias-variance/"
    >Bias-Variance tradeoff</a
  >. Read on to learn how this tradeoff manifests in the context of K-Fold
  Cross-Validation.
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
  }

  #input-container {
    max-width: 600px;
    margin: 0 auto;
  }

  .fold-error-text {
    font-family: var(--font-heavy);
    font-size: 1rem;
    stroke-linejoin: round;
    paint-order: stroke fill;
    stroke: var(--black);
    stroke-width: 4px;
    fill: var(--anchor);
  }

  #average-fold-error-text {
    fill: var(--peach);
    font-size: 0.95rem;
  }

  /* ipad */
  @media screen and (max-width: 950px) {
    #cv-chart {
      max-height: 55vh;
      width: 85%;
      margin: 1rem auto;
    }

    .fold-error-text {
      font-size: 0.9rem;
    }

    #average-fold-error-text {
      font-size: 0.85rem;
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
