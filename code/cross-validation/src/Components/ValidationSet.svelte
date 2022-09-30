<script>
  import { scaleLinear, scaleBand } from "d3-scale";
  import { margin } from "../store.js";
  import { arrowPath } from "../arrowPath";
  import StackedRects from "./StackedRects.svelte";

  let width = 500;
  let height = 500;
  const nSplits = 3;
  $: xScale = scaleLinear().domain([-1, nSplits]).range([0, width]);
  $: yScale = scaleLinear().domain([-1, 1]).range([height, 0]);
  $: xDiff = width / ((nSplits + 1) * 4);

  let dataLabel = [{ label: "Data", y: 10, dy: -6.5 }];
  let validationLabels = [
    { label: "Train", y: 5, dy: 0 },
    { label: "Validation", y: 13, dy: 6.5 },
    { label: "Test", y: 18, dy: 0 },
  ];
</script>

<h1 class="body-header">
  <span class="section-arrow">&gt; </span> Our Previous Approach
</h1>
<p class="body-text">
  In a <a href="https://mlu-explain.github.io/train-test-validation"
    >previous article</a
  >, we described a standard technique for solving this problem:
  <span class="bold">The Validation Set Approach</span>. Recall this involved
  randomly splitting our data into three mutually exclusive sets:
</p>
<br />
<ul class="body-text">
  <li>
    <span class="bold">The Training Set</span> is used to learn the model parameters.
  </li>
  <li>
    <span class="bold">The Validation Set</span> is used to select which model or
    set of hyperparameters you’d like to use.
  </li>

  <li>
    <span class="bold">The Test Set</span> is used to evaluate how your model will
    perform on unseen data.
  </li>
</ul>
<br />
<div id="cv-chart" bind:offsetWidth={width} bind:offsetHeight={height}>
  <svg {width} height={height + $margin.top + $margin.bottom}>
    <!-- x-ticks -->
    {#each [...Array(nSplits).keys()] as tick}
      {#if tick === 1}
        <!-- <text text-anchor="middle" x={xScale(tick)} y={yScale(0)}>hey</text> -->
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
          x={xScale(tick) - xDiff}
          fillRule={() => {
            return "#232f3e";
          }}
          labels={dataLabel}
        />
      {:else}
        <StackedRects
          {height}
          x={xScale(tick) - xDiff}
          fillRule={(i) =>
            i < 45 ? "#003181" : i < 75 ? "#f46ebb" : "#ffad97"}
          labels={validationLabels}
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
  The Validation Set Approach is still widely used, especially when resource
  constraints prohibit alternatives that require resampling (like cross
  validation). But the approach is perfect! The obvious issues is that our
  estimate of the test error can be highly variable depending on which
  particular observations are included in the training set and which are
  included in the validation set. That is, how do we know that the 30% we
  selected is the best way to split the data? What if we’d used a different
  split instead? Another issue is that this approach tends to overestimate the
  test error for models fit on our entire dataset. This is because more training
  data usually means better accuracy, but the validation set approach reserves a
  decent-sized chunk of data for validation and testing (and not training). If
  only there was a better resampling method for assessing how the results of a
  statistical analysis will generalize to an independent data set...
</p>

<style>
  svg {
    /* border: 1px solid black; */
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
