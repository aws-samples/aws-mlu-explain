<script>
  import { scaleLinear } from "d3-scale";
  import { margin } from "../store.js";
  import { arrowPath } from "../arrowPath";
  import StackedRects from "./StackedRects.svelte";

  let width = 500;
  let height = 500;
  const nSplits = 6;
  $: xScale = scaleLinear().domain([-1, nSplits]).range([0, width]);
  $: yScale = scaleLinear().domain([-1, 1]).range([height, 0]);
  $: xDiff = width / ((nSplits + 1) * 4);
</script>

<h1 class="body-header">
  <span class="section-arrow">&gt; </span> K-Folds Cross-Validation
</h1>
<p class="body-text">
  Rather than worrying about which split of data to use for training versus
  validation, we’ll use them all in turn. Our strategy will be to iterativelyuse
  different portions of our data to test and train our model. The exact process
  is actually quite simple: We’ll randomly split our dataset into k sets, or
  "folds", of equal size. One fold will be reserved for the validation set (or
  "holdout set") and the remaining k - 1 folds will be used for the training
  set. The training folds will fit our models parameters, and the validation
  fold will be used for evaluation. This process will be repeated on our data k
  times, using a different fold for the validation set at each iteration. At the
  end of the procedure, we'll take the average the validation set scores and
  take that as our as our model's estimated performance. This process is known
  as <span class="bold">k-folds cross validation</span>, and requires re-fitting
  our data k times (once for each fold).
</p>
<br />
<p class="body-text">
  Below we show the process for K=4 folds of our data. Note that the test data
  always remains untouched (after all, it's the final hold out set), but the
  distribution of training and validation sets differs at every fold:
</p>
<br />

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
        <g transform="translate({xScale(tick) - xDiff}, {yScale(0) - xDiff})">
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
          numCol="3"
          numRects={66}
          x={xScale(tick) - xDiff}
          fillRule={() => {
            return "#232f3e";
          }}
        />
      {:else}
        <StackedRects
          {height}
          numCol="3"
          numRects={66}
          x={xScale(tick) - xDiff}
          fillRule={(d) => {
            if (d > 59) return "#ffad97";
            if (d >= 15 * (3 - (tick - 2)) && d < 15 * (3 - (tick - 2)) + 15)
              return "#f46ebb";
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
  If you think this looks familiar, you're on the right track: it's basically
  the validation set applied k times - just with different splits of
  training/validation data each time. But this simple extension to the
  validation approach is very effective at overcoming the shortcomings of the
  validation set approach. To be clear, it does come with a cost: the need to
  train our data multiple times (once for each fold). Still, the method is
  widely used, as the benefits outweight the cost in many scenarios. Because we
  train our model on multiple instances of our data and take the average of
  their evaluation scores, our evaluation estimates have lower variance.
  Additionally, each fold itself uses more data than previously, so test error
  estimates are more accurate. Even for modest values (e.g. k = 5), our training
  set comprises 80 percent of our data. (Compare that with the validation set
  approach, where our model is typically trained on around only 50-60 percent of
  the original dataset.) This means that the K-fold approach typically doesn’t
  overestimate the test error as much as the validation set approach does.
</p>

<style>
  svg {
    /* border: 1px solid black; */
  }

  .legend-text {
    font-family: var(--font-heavy);
  }
  #cv-chart {
    margin: auto;
    max-height: 50vh;
    width: 40%;
    margin: 1rem auto;
    /* border: 2px solid black; */
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
      width: 95%;
      margin: 1rem auto;
    }
  }
</style>
