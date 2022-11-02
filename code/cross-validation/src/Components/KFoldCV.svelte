<script>
  import { scaleLinear } from "d3-scale";
  import { marginStatic } from "../store.js";
  import { arrowPath } from "../arrowPath";
  import StackedRects from "./StackedRects.svelte";
  import katexify from "../katexify";

  let width = 500;
  let height = 500;
  const nSplits = 6;
  const arrowWidth = 36;
  $: xScale = scaleLinear().domain([-1, nSplits]).range([0, width]);
  $: yScale = scaleLinear().domain([-1, 1]).range([height, 0]);
  $: xDiff = width / ((nSplits + 1) * 4);
</script>

<h1 class="body-header">
  <span class="section-arrow">&gt; </span> K-Fold Cross-Validation
</h1>
<p class="body-text">
  Rather than worrying about which split of data to use for training versus
  validation, we'll use them all in turn. Our strategy will be to iteratively
  use different portions of our data to train and validate our model. The exact
  process is actually quite simple: We'll randomly split our dataset into {@html katexify(
    `k`,
    false
  )}
  sets, or folds, of equal size. One fold will be reserved as the validation set
  (or "hold-out set") and the remaining {@html katexify(`k - 1`, false)} folds will
  be used as the training set. The training set will fit our model's parameters,
  and the validation set will be used for evaluation. This process will be repeated
  on our data {@html katexify(`k`, false)} times, using a different fold for the
  validation set at each iteration. At the end of the procedure, we'll take the average
  of the validation sets' scores and use it as our model's estimated performance.
  This process is known as
  <span class="bold">K-Fold Cross-Validation</span>, and requires re-fitting our
  model {@html katexify(`k`, false)} times (once for each fold).
</p>
<br />
<p class="body-text">
  Below we show the process for {@html katexify(`k = 4`, false)} folds of our data.
  Note that the test data always remains untouched (after all, it's the final hold-out
  set), but the distribution of training and validation sets differs at every fold:
</p>
<br />

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
            stroke="#232f3e"
            stroke-width="8"
            fill="#232f3e"
            stroke-linecap="round"
            stroke-linejoin="round"
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
    {/each}
  </svg>
</div>
<br /><br />
<p class="body-text">
  If you think this looks familiar, you're on the right track! It's just the 
  validation set applied {@html katexify(`k`, false)} times - only using different
  splits of training/validation data each time. But this simple extension to the
  validation approach is very effective at overcoming its shortcomings. The main
  benefit is that, because we train our model on multiple subsets of our data and
  take the average of the evaluation scores on those subsets, our evaluation estimates
  from K-Fold Cross-Validation will have lower variance than will the evaluation
  estimates from the validation set approach. Additionally, K-Fold Cross-Validation
  looks at more data during training. In the validation set approach, only one sample
  of the data is used for the training set, and it's possible that some information
  just wasn't included in that sample. With K-Fold Cross-Validation, the whole ensemble
  uses all of the data, so every data point will get included in the training of
  a model, and the evaluation of that model will then be factored into the final
  evaluation estimate. Finally, it's worth stating the obvious fact that test error
  estimates are more accurate when more data is used in the training set. Even for
  modest values of {@html katexify(`k`, false)} in K-Fold Cross-Validation (e.g.
  {@html katexify(`k = 5`, false)}), the training set comprises 80 percent of
  our data, so the approach typically doesn't overestimate the test error as
  much as the validation set approach could for small training set sizes.
  <br /><br />
  While K-Fold Cross-Validation has a lot of obvious benefits, it does come with
  a cost: the need to train and evaluate a model multiple times (once for each fold).
</p>

<style>
  .legend-text {
    font-family: var(--font-heavy);
  }
  #cv-chart {
    margin: auto;
    max-height: 50vh;
    width: 40%;
    margin: 1rem auto;
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
