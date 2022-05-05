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

  let foldsCount = 50;
  let datasetSize = 50;
  let radius = 4;
  let manyBodyStrength = 0.1;
  let xStrength = 1;
  let yStrength = 1;
</script>

<h1 class="body-header">Leave-One-Out Cross-Validation (LOOCV)</h1>
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
  <div>
    <p x={margin.left + width / 2} y={"0"} class="error-axis-label">
      {foldsCount} folds, n: {datasetSize}
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
          {foldsCount}
          {radius}
          {datasetSize}
          nodeStroke="none"
        />
      </Svg>
    </LayerCake>
  </div>
</div>
<br /><br />
<p class="body-text">
  LOOCV carries all the same benefits mentioned above. But it’s extreme value of
  k carries some additional costs, most notably those related to resource-use.
  This is expensive both resource-wise and time-wise, doubly so when the model
  is large and time-consuming to fit. However, all hope is not lost! [JC - do we
  want this last sentence? Seems like a leftover fragment.] For linear models,
  not the case for linear models which have a closed-form solution pg 203).
  <br /><br />
  Up to this point, we’ve talked about k-folds cross-validation in the general sense,
  along with its two most-extreme cases: LOOCV (k-folds with k = n) and the Validation
  Set Approach (k-folds with k = 2). Given the multitude of options for selecting
  k, how do we select the best value?
</p>

<style>
  #cv-chart {
    margin: auto;
    height: 48vh;
    width: 40%;
    margin: 1rem auto;
  }

  #chart-container {
    margin: auto;
    height: 48vh;
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
