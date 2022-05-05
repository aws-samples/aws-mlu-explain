<script>
  import { scalePoint, scaleOrdinal } from "d3-scale";
  import { range } from "d3-array";
  import { LayerCake, Svg } from "layercake";
  import ForcePackCircles from "../../scripts/forcePackCircles.svelte";

  // these don't matter, but make the stretching less obvious at load
  let height = 500;
  let width = 500;
  // responsive margins
  const mobile = window.innerWidth <= 700;
  const margin = {
    top: mobile ? 40 : 50,
    bottom: mobile ? 10 : 25,
    left: mobile ? 0 : 80,
    right: mobile ? 0 : 10,
  };

  const xKey = "fold";
  const yKey = "subFold";
  const zKey = "category";

  let foldsCount = 2;
  let datasetSize = 100;
  let manyBodyStrength = -1;
  let xStrength = 0.5;
  let yStrength = 0.1;
  let interactive = true;
</script>

<h1 class="body-header">Try For Yourself</h1>
<p class="body-text">
  To k-folds cross-validation more clear, we’ll see how the process works
  directly. Let’s assume that we’d like to use a one-dimensional linear
  regression model to predict the price of a house from its square-footage. Drag
  the value of k for yourself to set the number of folds. Observe that each fold
  results in a new data split alongside a newly trained model.
</p>

<div id="cv-chart" bind:offsetWidth={width} bind:offsetHeight={height}>
  <div>
    <input
      type="range"
      min="2"
      max="10"
      step="1"
      id="foldsCountSelector"
      bind:value={foldsCount}
    />
    <p x={"20"} y={"0"} class="error-axis-label">
      {foldsCount} folds
    </p>
  </div>
  <div id="chart-container" bind:offsetWidth={width} bind:offsetHeight={height}>
    <LayerCake
      x={xKey}
      y={yKey}
      z={zKey}
      xScale={scalePoint()}
      xDomain={range(0, foldsCount + 2, 1)}
      xRange={[0, width - margin.right]}
      yScale={scalePoint()}
      yDomain={range(0, foldsCount + 2, 1)}
      yRange={[height - margin.bottom, margin.top]}
      zScale={scaleOrdinal()}
      zDomain={["test", "train", "validate"]}
      zRange={["limegreen", "darkslateblue", "hotpink"]}
    >
      <Svg>
        <ForcePackCircles
          {manyBodyStrength}
          {xStrength}
          {yStrength}
          bind:foldsCount
          {datasetSize}
          {interactive}
          nodeStroke="#000"
        />
      </Svg>
    </LayerCake>
  </div>
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
  #cv-chart {
    margin: auto;
    height: 58vh;
    width: 40%;
    margin: 1rem auto;
  }

  #chart-container {
    margin: auto;
    height: 58vh;
    width: 100%;
    margin: 1rem auto;
  }

  /* ipad */
  @media screen and (max-width: 950px) {
    #cv-chart {
      height: 55vh;
      width: 85%;
      margin: 1rem auto;
    }
    #chart-container {
      margin: auto;
      height: 48vh;
      width: 100%;
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
    #chart-container {
      margin: auto;
      height: 48vh;
      width: 100%;
      margin: 1rem auto;
    }
  }
</style>
