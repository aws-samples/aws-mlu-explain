<script>
  import { tweened } from "svelte/motion";
  import { linear } from "svelte/easing";
  import { line } from "d3-shape";
  import { scaleLinear } from "d3-scale";
  import { format } from "d3-format";
  import { scatterData } from "../datasets.js";
  import { max, min } from "d3-array";
  import {
    gdBias,
    gdWeight,
    gdErrors,
    gdIteration,
    gdError,
  } from "../data-store.js";

  const sigmoidEq = (d) => 1 / (1 + Math.exp(-d));

  // set tweened store for line
  const dataset = tweened(
    scatterData.map((d) => {
      return {
        Temperature: d.Temperature,
        y: sigmoidEq($gdBias + $gdWeight * d.Temperature),
        Weather: d.Weather,
      };
    }),
    {
      duration: 200,
      easing: linear,
    }
  );

  // update line reactively
  $: {
    dataset.set(
      scatterData.map((d) => {
        return {
          Temperature: d.Temperature,
          y: sigmoidEq($gdBias + $gdWeight * d.Temperature),
          Weather: d.Weather,
        };
      })
    );
    console.log($dataset)

    $dataset.sort((a, b) => b.Temperature - a.Temperature)
    console.log($dataset)

  }

  const margin = {
    top: 12,
    bottom: 3,
    left: 40,
    right: 30,
  };

  // these don't matter, but make the stretching less obvious at load
  let height = 500;
  let width = 500;

  // label formatter
  const formatter_x = format(".0f");
  const formatter_y = format(".1f");

  $: {
    $gdIteration += 1;
    // recalculate error if changes
    let errors = scatterData.map((d) => {
      return (d.Weather - sigmoidEq($gdWeight * d.Temperature + $gdBias)) ** 2;
    });
    $gdError = Number(errors.reduce((a, b) => a + b, 0));
    $gdErrors = [
      ...$gdErrors,
      {
        iteration: $gdIteration,
        error: $gdError,
      },
    ];
  }

  $: {
    $gdBias;
    $gdWeight;
    $gdIteration += 1;

    console.log($dataset);
  }

  export function runGradientDescent(iterations) {
    const N = scatterData.length;
    const learning_rate = 0.001;

    //   for each iteration
    for (let index = 0; index < iterations; index++) {
      // update error and iterations
      $gdIteration += 1;

      let biasDifference = scatterData.map((d) => {
        return d.Weather - sigmoidEq($gdWeight * d.Temperature + $gdBias);
      });
      let biasSum = Number(
        biasDifference.reduce((a, b) => a + b, 0).toFixed(4)
      );
      $gdError = biasSum;
      let b_gradient = (-2 / N) * biasSum;
      const bias = $gdBias + learning_rate * b_gradient;
      $gdBias = Number(bias.toFixed(4));

      // update the bias term
      let weightDifference = scatterData.map((d) => {
        return (
          d.Temperature *
          (d.Weather - sigmoidEq($gdWeight * d.Temperature + $gdBias))
        );
      });
      let weightSum = Number(
        weightDifference.reduce((a, b) => a + b, 0).toFixed(4)
      );
      let w_gradient = (-2 / N) * weightSum;
      const weight = $gdWeight - learning_rate * w_gradient;
      $gdWeight = Number(weight.toFixed(4));
    }
  }

  // scales
  $: xScale = scaleLinear()
    .domain([20, 100])
    .range([margin.left, width - margin.right]);
  $: yScale = scaleLinear()
    .domain([
      min(scatterData, (d) => d.Weather),
      max(scatterData, (d) => d.Weather),
    ])
    .range([height - margin.bottom, margin.top]);

  // line generator
  $: regressionPath = line()
    .x((d) => xScale(d.Temperature))
    .y((d) => yScale(d.y));
</script>

<div id="scatter-chart" bind:offsetWidth={width} bind:offsetHeight={height}>
  <svg {width} height={height + margin.top + margin.bottom}>
    <!-- x-ticks -->
    {#each xScale.ticks() as tick}
      <g transform={`translate(${xScale(tick) + 0} ${height - margin.bottom})`}>
        <!-- svelte-ignore component-name-lowercase -->
        <line
          class="grid-line"
          x1="0"
          x2="0"
          y1="0"
          y2={-height + margin.bottom + margin.top}
          stroke="black"
          stroke-dasharray="4"
        />
        <text class="axis-text" y="15" text-anchor="middle"
          >{formatter_x(tick)}</text
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
          x2={width - margin.right}
          y1="0"
          y2="0"
          stroke="black"
          stroke-dasharray="4"
        />
        <text
          class="axis-text"
          y="0"
          text-anchor="end"
          dominant-baseline="middle">{formatter_y(tick)}</text
        >
      </g>
    {/each}
    <!-- axis lines -->
    <!-- x -->
    <!-- svelte-ignore component-name-lowercase -->
    <line
      class="axis-line"
      y1={height - margin.bottom}
      y2={height - margin.bottom}
      x1={margin.left}
      x2={width}
      stroke="black"
      stroke-width="1"
    />
    <!-- y -->
    <!-- svelte-ignore component-name-lowercase -->
    <line
      class="axis-line"
      y1={margin.top}
      y2={height - margin.bottom}
      x1={margin.left}
      x2={margin.left}
      stroke="black"
      stroke-width="1"
    />
    <!-- axis labels
      <text
        class="axis-label"
        y={height + margin.bottom}
        x={(width + margin.left) / 2}
        text-anchor="middle">Size of House (sqft)</text
      >
      <text
        class="axis-label"
        y={margin.left / 4.8}
        x={-(height / 2)}
        text-anchor="middle"
        transform="rotate(-90)">Housing Price ($)</text
      > -->

    <!-- chart data mappings -->

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
        cx={xScale(d.Temperature)}
        cy={yScale(d.Weather)}
      />
    {/each}
  </svg>
</div>

<style>
  #scatter-chart {
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

  .axis-label {
    font-weight: bold;
  }

  .axis-text {
    font-size: 0.7rem;
  }

  .error-text {
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

  .grid-line {
    opacity: 0.075;
  }

  .axis-label {
    text-transform: uppercase;
    font-size: 0.7rem;
  }

  .path-line {
    fill: none;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 4;
  }

  /* ipad */
  @media screen and (max-width: 950px) {
    .axis-label {
      font-size: 0.8rem;
    }
    .error-axis-text {
      font-size: 0.8rem;
    }
    .error-text {
      stroke-width: 3.5px;
      stroke: #f1f3f3;
      font-size: 0.8rem;
      letter-spacing: 2px;
    }
  }
  /* mobile */
  @media screen and (max-width: 750px) {
    .axis-label {
      font-size: 0.75rem;
    }
  }
</style>
