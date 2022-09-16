<script>
  import { tweened } from "svelte/motion";
  import { linear } from "svelte/easing";
  import { line } from "d3-shape";
  import { scaleLinear } from "d3-scale";
  import { format } from "d3-format";
  import { mseData } from "../datasets.js";
  import { max, min } from "d3-array";
  import {
    shuffleIteration,
    gdBias,
    gdWeight,
    gdErrors,
    gdIteration,
    gdError,
    gdWidth,
    gdHeight,
  } from "../store.js";
  import { onMount } from "svelte";

  // Fix for safari bug where offsetHeight/offsetWidth don't work half the time:
  onMount(() => {
    const desiredDimensions = document
      .getElementById("scatter-chart-gd")
      .getBoundingClientRect();
    $gdWidth = $gdWidth == 0 ? desiredDimensions.width : $gdWidth;
    $gdHeight = $gdHeight == 0 ? desiredDimensions.height : $gdHeight;
  });

  // set tweened store for line
  const dataset = tweened(
    mseData.map((d) => {
      return {
        sqft: d[`sqft${$shuffleIteration}`],
        y: $gdBias + $gdWeight * d[`sqft${$shuffleIteration}`],
        price: d[`price${$shuffleIteration}`],
      };
    }),
    {
      duration: 300,
      easing: linear,
    }
  );

  // update line reactively
  $: dataset.set(
    mseData.map((d) => {
      return {
        sqft: d[`sqft${$shuffleIteration}`],
        y: $gdBias + $gdWeight * d[`sqft${$shuffleIteration}`],
        price: d[`price${$shuffleIteration}`],
      };
    })
  );

  const margin = {
    top: 12,
    bottom: 3,
    left: 40,
    right: 30,
  };

  // label formatter
  const formatter = format(".2r");

  $: {
    $shuffleIteration;
    // recalculate error if changes
    let errors = mseData.map((d) => {
      return (
        (d[`price${$shuffleIteration}`] -
          ($gdWeight * d[`sqft${$shuffleIteration}`] + $gdBias)) **
        2
      );
    });
    $gdError = Number(errors.reduce((a, b) => a + b, 0)) / errors.length;
    $gdErrors = [
      ...$gdErrors,
      {
        iteration: $gdIteration,
        error: $gdError,
      },
    ];
    // console.log("error", $gdError);
  }

  $: {
    $gdBias;
    $gdWeight;
    $gdIteration += 1;
    // console.log("bias:", $gdBias, "weight:", $gdWeight, "error:", $gdError);
  }

  export function shuffleData() {
    $shuffleIteration = ($shuffleIteration + 1) % 10;
    dataset.set(
      mseData.map((d) => {
        return {
          sqft: d[`sqft${$shuffleIteration}`],
          y: $gdBias + $gdWeight * d[`sqft${$shuffleIteration}`],
          price: d[`price${$shuffleIteration}`],
        };
      })
    );
    // reset error plot
    $gdIteration = 0;
    $gdErrors = [{ iteration: 0, error: $gdError }];
    $gdBias = 1;
    $gdWeight = 0;
  }
  export function runGradientDescent(iterations) {
    const N = mseData.length;
    console.log("N", N);
    const learning_rate = 0.001;
    $gdIteration += iterations - 1;
    console.log("shuffleIteration", $shuffleIteration);
    //   for each iteration
    for (let index = 0; index < iterations; index++) {
      // update error and iterations

      // update the weight term
      let weightDifference = mseData.map((d) => {
        let yPred = $gdWeight * d[`sqft${$shuffleIteration}`] + $gdBias;
        return (
          d[`sqft${$shuffleIteration}`] *
          (d[`price${$shuffleIteration}`] - yPred)
        );
      });

      // update the bias term
      let biasDifference = mseData.map((d) => {
        let yPred = $gdWeight * d[`sqft${$shuffleIteration}`] + $gdBias;
        return d[`price${$shuffleIteration}`] - yPred;
      });

      let weightSum = weightDifference.reduce((a, b) => a + b, 0);
      let w_gradient = (-2 / N) * weightSum;
      const weight = $gdWeight - learning_rate * w_gradient;
      $gdWeight = weight;

      let biasSum = biasDifference.reduce((a, b) => a + b, 0);
      let b_gradient = (-2 / N) * biasSum;
      const bias = $gdBias - learning_rate * b_gradient;
      $gdBias = bias;

      // $gdError = biasSum / N;
    }
    console.log("bias:", $gdBias, "weight:", $gdWeight);
  }

  // scales
  $: xScale = scaleLinear()
    .domain([
      min($dataset, (d) => d.sqft) - 2,
      max($dataset, (d) => d.sqft) + 2,
    ])
    .range([margin.left, $gdWidth - margin.right]);
  $: yScale = scaleLinear()
    .domain([
      min($dataset, (d) => d.price) - 2,
      max($dataset, (d) => d.price) + 2,
    ])
    .range([$gdHeight - margin.bottom, margin.top]);

  // line generator
  $: regressionPath = line()
    .x((d) => xScale(d.sqft))
    .y((d) => yScale(d.y));
</script>

<div
  id="scatter-chart-gd"
  bind:offsetWidth={$gdWidth}
  bind:offsetHeight={$gdHeight}
>
  <svg width={$gdWidth} height={$gdHeight + margin.top + margin.bottom}>
    <!-- x-ticks -->
    {#each xScale.ticks() as tick}
      <g
        transform={`translate(${xScale(tick) + 0} ${
          $gdHeight - margin.bottom
        })`}
      >
        <!-- svelte-ignore component-name-lowercase -->
        <line
          class="grid-line"
          x1="0"
          x2="0"
          y1="0"
          y2={-$gdHeight + margin.bottom + margin.top}
          stroke="black"
          stroke-dasharray="4"
        />
        <text class="axis-text" y="15" text-anchor="middle"
          >{formatter(tick)}</text
        >
      </g>
    {/each}
    <!-- y-ticks -->
    {#each yScale.ticks() as tick}
      <g transform={`translate(${margin.left - 5} ${yScale(tick) + 0})`}>
        <!-- svelte-ignore component-name-lowercase -->
        <line
          class="grid-line"
          x1={5}
          x2={$gdWidth - margin.right}
          y1="0"
          y2="0"
          stroke="black"
          stroke-dasharray="4"
        />
        <text
          class="axis-text"
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
      class="axis-line"
      y1={$gdHeight - margin.bottom}
      y2={$gdHeight - margin.bottom}
      x1={margin.left}
      x2={$gdWidth}
      stroke="black"
      stroke-width="1"
    />
    <!-- y -->
    <!-- svelte-ignore component-name-lowercase -->
    <line
      class="axis-line"
      y1={margin.top}
      y2={$gdHeight - margin.bottom}
      x1={margin.left}
      x2={margin.left}
      stroke="black"
      stroke-width="1"
    />

    <!-- draw regression line -->
    <path class="regression-line" d={regressionPath($dataset)} />

    <!-- draw circles -->
    {#each $dataset as d}
      <circle
        class="regression-circle"
        fill="#c9208a"
        stroke="black"
        stroke-width="1.5"
        r="4.5"
        cx={xScale(d.sqft)}
        cy={yScale(d.price)}
      />
    {/each}
  </svg>
</div>

<style>
  #scatter-chart-gd {
    width: 100%;
    max-height: 98%;
  }

  .regression-circle {
    fill: var(--primary);
    stroke-width: 0;
  }

  .regression-line {
    stroke: var(--squidink);
    stroke-width: 3.5;
    fill: none;
  }

  .axis-text {
    font-size: 0.7rem;
  }

  .grid-line {
    opacity: 0.075;
  }
</style>
