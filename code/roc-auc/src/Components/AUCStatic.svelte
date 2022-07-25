<script>
  import { area, curveStep, line } from "d3-shape";
  import { scaleLinear } from "d3-scale";
  import { rocData } from "../datasets.js";
  import { format } from "d3-format";
  import { margin } from "../data-store.js";

  const formatter = format(".1f");

  // these don't matter, but make the stretching less obvious at load
  let height = 500;
  let width = 500;

  // scales
  $: xScale = scaleLinear()
    .domain([0.0, 1.0])
    .range([$margin.left, width - $margin.right]);
  $: rocScale = scaleLinear()
    .domain([0.0, 1.0])
    .range([height - $margin.bottom, $margin.top]);

  // line generator
  $: rocPath = line()
    .x((d) => xScale(d.fpr))
    .y((d) => rocScale(d.tpr))
    .curve(curveStep);

  $: aucPath = area()
    .x((d) => xScale(d.fpr))
    .y1((d) => rocScale(d.tpr))
    .y0(rocScale(0))
    .curve(curveStep);
</script>

<section>
  <h1 class="body-header">AUC: Area Under the Curve</h1>
  <p class="body-text">
    AUC (sometimes written AUROC) is just the area underneath the entire ROC
    curve. Think integration from calculus. AUC provides us with a nice, single
    measure of performance for our classifiers, independent of the exact
    classification threshold chosen. This allows us to compare models to each
    other without even looking at their ROC curves (though visualizing the
    performance of your models is never a bad idea!).

    <br /><br />AUC ranges in value from 0 to 1, with higher numbers indicating
    better performance. A perfect classifier will have an AUC of 1, while a
    perfectly random classifier an AUC of 0.5. A model that always predicts that
    a negative sample is more likely to have a positive label than a positive
    sample will have AUC of 0, indicating severe failure on the modeling side.
    Scores in the range [0.5, 1] imply good performance, while anything under
    0.5 indicates very poor performance.
    <br /><br />
    At 0.73, our model's AUC isn't too shabby:
  </p>

  <div id="auc-chart" bind:offsetWidth={width} bind:offsetHeight={height}>
    <svg {width} height={height + $margin.top + $margin.bottom}>
      <!-- x-ticks -->
      {#each xScale.ticks() as tick}
        <g
          transform={`translate(${xScale(tick) + 0} ${
            height - $margin.bottom
          })`}
        >
          <!-- svelte-ignore component-name-lowercase -->
          <line
            class="y-axis-line"
            x1="0"
            x2="0"
            y1="0"
            y2={-height + $margin.bottom + $margin.top}
            stroke="black"
            stroke-dasharray="4"
          />
          <text class="auc-axis-text" y="15" text-anchor="middle">{tick}</text>
        </g>
      {/each}
      <!-- y-ticks -->
      {#each [0, 0.2, 0.4, 0.6, 0.8, 1.0] as tick}
        <g transform={`translate(${$margin.left - 5} ${rocScale(tick) + 0})`}>
          <!-- svelte-ignore component-name-lowercase -->
          <line
            class="y-axis-line"
            x1="0"
            x2={width - $margin.right - $margin.left}
            y1="0"
            y2="0"
            stroke="black"
            stroke-dasharray="4"
          />
          <text
            class="auc-axis-text"
            y="0"
            text-anchor="end"
            dominant-baseline="middle">{formatter(tick)}</text
          >
        </g>
      {/each}
      <!-- axis lines -->
      <!-- x -->
      <!-- svelte-ignore component-name-lowercase -->
      <line
        class="error-axis-line"
        y1={height - $margin.bottom}
        y2={height - $margin.bottom}
        x1={$margin.left}
        x2={width}
        stroke="black"
        stroke-width="2"
      />
      <!-- y -->
      <!-- svelte-ignore component-name-lowercase -->
      <line
        class="error-axis-line"
        y1={$margin.top}
        y2={height - $margin.bottom}
        x1={$margin.left}
        x2={$margin.left}
        stroke="black"
        stroke-width="2"
      />

      <!-- our data -->
      <path class="outline-line" d={rocPath(rocData)} />
      <path class="path-line" d={rocPath(rocData)} stroke="#9e1f63" />
      <path
        class="path-area"
        d={aucPath(rocData)}
        fill="#7cd1ea"
        fill-opacity="0.4"
      />

      <!-- chart labels -->
      <text
        id="auc-text-accuracy"
        class="auc-text"
        y={rocScale(0.79)}
        x={xScale(9.2)}
        dominant-baseline="middle">Label</text
      >

      <!-- axis labels -->
      <text
        class="auc-axis-label"
        y={$margin.top / 2}
        x={(width + $margin.left) / 2}
        text-anchor="middle">Area Under The (ROC) Curve</text
      >
      <text
        class="auc-axis-label"
        y={height + $margin.bottom}
        x={(width + $margin.left) / 2}
        text-anchor="middle">False Positive Rate</text
      >
      <text
        class="auc-axis-label"
        y={15}
        x={-(height / 2)}
        text-anchor="middle"
        transform="rotate(-90)">True Positive Rate</text
      >

      <!--  Our AUC annotation -->
      <text
        class="annotation"
        transform={`translate(${xScale(0.5)},${rocScale(0.55)}) `}
        text-anchor="middle"
        fill="#9e1f63"
        alignment-baseline="middle"
      >
        OUR AUC: 0.73
      </text>
    </svg>
  </div>
  <br /><br />
  <p class="body-text">
    It may be surprising given how ad-hoc the metric appears, but AUC has a
    deeper-than-expected interpretation. Actually, multiple interpretations
    exist, but we prefer the probabilistic interpretation:

    <br /><br />
    <i
      >The AUC is the probability that the model will rank a randomly chosen
      positive example more highly than a randomly chosen negative example.
    </i>
    <br /><br />
    In other words, if you were to randomly select an observation belonging to the
    positive class and an observation belonging to the negative class, the AUC tells
    us the probability that the model will assign a higher score to the positive
    class. This interpretation helps qualify the AUC: A model that always predicts
    that a negative sample is more likely to have a positive label than a positive
    sample will have AUC of 0. If the predicted probabilities are random, it will
    be 0.5. Finally if the model always predicts a positive sample is more likely
    to have a positive label than a negative sample, then it will have an AUC of
    1. This strategy also provides a very easy method to estimate the AUC: simply
    tally up the proportion of correctly ranked positive-negative pairs! And what's
    even cooler, it has been shown that this method of estimating the AUC is equivalent
    to a popular nonparametric statistical test: the Wilcoxon-Mann-Whitney test (see
    Mason and Graham in the resources to learn more).
  </p>
</section>

<style>
  #auc-chart {
    margin: auto;
    max-height: 48vh;
    width: 50%;
    margin: 1rem auto;
  }

  .annotation {
    font-family: var(--font-heavy);
    stroke-linejoin: round;
    paint-order: stroke fill;
    stroke-width: 4.4px;
    pointer-events: none;
    stroke: #f1f3f3;
    font-size: 1rem;
    letter-spacing: 1px;
    opacity: 1;
  }

  .auc-text {
    text-transform: uppercase;
    font-family: var(--font-heavy);
    stroke-linejoin: round;
    paint-order: stroke fill;
    stroke-width: 4.5px;
    pointer-events: none;
    stroke: #f1f3f3;
    font-size: 0.9rem;
    letter-spacing: 2px;
  }
  .auc-axis-text {
    font-size: 0.9rem;
  }

  .y-axis-line {
    opacity: 0.15;
  }

  #auc-text-accuracy {
    fill: #c9208a;
  }

  .auc-axis-label {
    text-transform: uppercase;
    font-size: 1rem;
  }

  .path-line {
    fill: none;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 6;
  }

  .outline-line {
    fill: none;
    stroke: #f1f3f3;
    stroke-width: 10;
  }

  #random-roc-line {
    stroke-dasharray: 2;
  }

  /* ipad */
  @media screen and (max-width: 950px) {
    #auc-chart {
      max-height: 55vh;
      width: 85%;
      margin: 1rem auto;
    }
    .auc-axis-label {
      font-size: 1rem;
    }
    .auc-axis-text {
      font-size: 1rem;
    }
    .auc-text {
      stroke-width: 3.5px;
      stroke: #f1f3f3;
      font-size: 0.8rem;
      letter-spacing: 2px;
    }
    .path-line {
      stroke-width: 5;
    }
    .outline-line {
      stroke-width: 9;
    }
  }
  /* mobile */
  @media screen and (max-width: 750px) {
    #auc-chart {
      max-height: 55vh;
      width: 95%;
      margin: 1rem auto;
    }

    .auc-axis-label {
      font-size: 0.9rem;
    }
    .auc-axis-text {
      font-size: 0.8rem;
    }
    .auc-text {
      stroke-width: 3px;
      stroke: #f1f3f3;
      font-size: 0.7rem;
      letter-spacing: 1px;
    }
    .path-line {
      stroke-width: 4;
    }
    .outline-line {
      stroke-width: 7;
    }
  }
</style>
