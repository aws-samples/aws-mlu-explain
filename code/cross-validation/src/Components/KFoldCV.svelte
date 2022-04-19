<script>
  import { scaleLinear, scalePoint, scaleOrdinal } from "d3-scale";
  import { range } from "d3-array";
  import { LayerCake, Svg, Html } from 'layercake';
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

  const xKey = 'fold'
  const yKey = 'subFold'
  const zKey = 'category'

  let foldsCount = 5
  let manyBodyStrength = 2;
  let xStrength = 0.2
  let yStrength = 0.2

  // $: data = range(0,(foldsCount*100),1).map((f)=>{
  //   const fold = Math.floor(f/100) + 1
  //   const subFold = (f % (foldsCount)) + 1
  //   const category = () => {
  //     if (fold === subFold) { return "validate" } else {return 'train'}
  //   }
  //     return {
  //       category:category(),
  //       fold,
  //       subFold
  //   }
  // })


</script>
<h1 class="body-header">K-Folds Cross-Validation</h1>
<p class="body-text">
  Rather than worrying about which split of data to use for training versus
  validation, we’ll use them all in turn. Our strategy will be to iteratively
  use different portions of our data to test and train our model. The
  exact process is actually quite simple: We’ll randomly split our dataset into
  k sets, or folds, of equal size, reserving one fold for the validation set
  (often called the holdout set) and the remaining k - 1 folds for the training
  set. The training folds will fit our models parameters, and the validation
  fold will be used for evaluation. This process will be repeated on our data k
  times, using a different fold for the validation set at each iteration. This
  process is known as *k-folds cross validation*, and requires re-fitting our
  data k times (once for each fold):
</p>
<br />

<br />

<div id="error-chart" bind:offsetWidth={width} bind:offsetHeight={height}>
  <div>
    <input 
      type="range"
      min="2"
      max="10"
      step="1"
      id="foldsCountSelector" 
      bind:value={foldsCount}
    />
    <p 
    x={"20"}
    y={"0"}
    class="error-axis-label"> 
    {foldsCount} folds
  </p>
</div>
  <div id="chart-container" bind:offsetWidth={width} bind:offsetHeight={height}>

    <LayerCake
      x={xKey}
      y={yKey}
      z={zKey}
      xScale={scalePoint()}
      xDomain={range(1,foldsCount+1,1)}
      xRange={[margin.left, width - margin.right]}
      yScale={scalePoint()}
      yDomain={range(0,foldsCount+1,1)}
      yRange={[height - margin.bottom, margin.top]}
      zScale={scaleOrdinal()}
      zDomain={['test','train','validate']}
      zRange={['limegreen','darkslateblue','hotpink']}
    >
    <Svg>
      <ForcePackCircles
      {manyBodyStrength}
      {xStrength}
      {yStrength}
      bind:foldsCount={foldsCount}
      nodeStroke="#000"
      />
    </Svg>
  </LayerCake>
</div>

</div>
<br /><br />
<p class="body-text">
  This simple extension to the validation approach is very effective at
  overcoming the shortcomings of the validation set approach. Because we train
  our model on multiple instances of our data and take the average of their
  evaluation scores, our evaluation estimates have lower variance. Additionally,
  each fold itself uses more data than previously, so test error estimates are
  more accurate. Even for modest values (e.g. k = 5), our training set comprises
  80% of our data. Compare that with the validation set approach, where our
  model is typically trained on around only 50-60 percent of the original
  dataset. This means that the K-fold approach typically doesn’t overestimate
  the test error as much as the validation set approach does.
</p>

<style>
  #error-chart {
    margin: auto;
    max-height: 48vh;
    width: 40%;
    margin: 1rem auto;
  }
  #chart-container {
    margin: auto;
    min-height: 48vh;
    width: 100%;
    margin: 1rem auto;
  }

  .error-axis-label {
    text-transform: uppercase;
    font-size: 1rem;
  }


  /* ipad */
  @media screen and (max-width: 950px) {
    #error-chart {
      max-height: 55vh;
      width: 85%;
      margin: 1rem auto;
    }
    .error-axis-label {
      font-size: 0.8rem;
    }
  }
  /* mobile */
  @media screen and (max-width: 750px) {
    #error-chart {
      max-height: 55vh;
      width: 95%;
      margin: 1rem auto;
    }

    .error-axis-label {
      font-size: 0.75rem;
    }
  }
</style>
