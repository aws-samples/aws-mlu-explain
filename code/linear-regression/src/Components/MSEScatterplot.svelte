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
    mseBias,
    mseWeight,
    mseErrors,
    mseIteration,
    mseError,
    rSquared,
    RSS,
    TSS,
    mseWidth,
    mseHeight,
  } from "../store.js";
  import { onMount } from "svelte";

  // Fix for safari bug where offsetHeight/offsetWidth don't work half the time:
  onMount(() => {
    const desiredDimensions = document
      .getElementById("scatter-chart-mse")
      .getBoundingClientRect();
    $mseWidth = $mseWidth == 0 ? desiredDimensions.width : $mseWidth;
    $mseHeight = $mseHeight == 0 ? desiredDimensions.height : $mseHeight;
  });

  // set tweened store for line
  const dataset = tweened(
    mseData.map((d) => {
      return {
        sqft: d[`sqft${$shuffleIteration}`],
        y: $mseBias + $mseWeight * d[`sqft${$shuffleIteration}`],
        price: d[`price${$shuffleIteration}`],
      };
    }),
    {
      duration: 200,
      easing: linear,
    }
  );

  // update line reactively
  $: dataset.set(
    mseData.map((d) => {
      return {
        sqft: d[`sqft${$shuffleIteration}`],
        y: $mseBias + $mseWeight * d[`sqft${$shuffleIteration}`],
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

  // reactively update shuffle iterations and calculate errors
  $: {
    $shuffleIteration;
    $mseIteration += 1;

    // calculate array of squared errors
    let errors = mseData.map((d) => {
      return (
        (d[`price${$shuffleIteration}`] -
          ($mseWeight * d[`sqft${$shuffleIteration}`] + $mseBias)) **
        2
      );
    });

    // calculate mean of y (for TSS in r-squared)
    let y = mseData.map((d) => d[`price${$shuffleIteration}`]);
    let yMean = y.reduce((a, b) => a + b) / y.length;
    // calculate TSS
    let tssErrors = mseData.map((d) => {
      return (d[`price${$shuffleIteration}`] - yMean) ** 2;
    });
    $TSS = Number(tssErrors.reduce((a, b) => a + b, 0));

    // calculate RSS
    $RSS = Number(errors.reduce((a, b) => a + b, 0));
    // calculate r-squared
    $rSquared = 1 - $RSS / $TSS;

    // calculate MSE
    $mseError = $RSS / errors.length;

    // track MSE Errors for gradient plot
    $mseErrors = [
      ...$mseErrors,
      {
        iteration: $mseIteration,
        error: $mseError,
      },
    ];
  }

  $: {
    $mseBias;
    $mseWeight;
    $mseIteration += 1;
  }

  export function shuffleData() {
    $shuffleIteration = ($shuffleIteration + 1) % 10;
    dataset.set(
      mseData.map((d) => {
        return {
          sqft: d[`sqft${$shuffleIteration}`],
          y: $mseBias + $mseWeight * d[`sqft${$shuffleIteration}`],
          price: d[`price${$shuffleIteration}`],
        };
      })
    );
    // reset error plot
    $mseIteration = 0;
    $mseErrors = [{ iteration: 1, error: $mseError }];
  }

  // scales
  $: xScale = scaleLinear()
    .domain([
      min($dataset, (d) => d.sqft) - 2,
      max($dataset, (d) => d.sqft) + 2,
    ])
    .range([margin.left, $mseWidth - margin.right]);
  $: yScale = scaleLinear()
    .domain([
      min($dataset, (d) => d.price) - 2,
      max($dataset, (d) => d.price) + 2,
    ])
    .range([$mseHeight - margin.bottom, margin.top]);

  // line generator
  $: regressionPath = line()
    .x((d) => xScale(d.sqft))
    .y((d) => yScale(d.y));

  $: {
    // console.log("mse width:", width, "mse height:", height);
  }
</script>

<div
  id="scatter-chart-mse"
  bind:offsetWidth={$mseWidth}
  bind:offsetHeight={$mseHeight}
>
  <svg width={$mseWidth} height={$mseHeight + margin.top + margin.bottom}>
    <!-- x-ticks -->
    {#each xScale.ticks() as tick}
      <g
        transform={`translate(${xScale(tick) + 0} ${
          $mseHeight - margin.bottom
        })`}
      >
        <!-- svelte-ignore component-name-lowercase -->
        <line
          class="grid-line"
          x1="0"
          x2="0"
          y1="0"
          y2={-$mseHeight + margin.bottom + margin.top}
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
          x2={$mseWidth - margin.right}
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
      y1={$mseHeight - margin.bottom}
      y2={$mseHeight - margin.bottom}
      x1={margin.left}
      x2={$mseWidth}
      stroke="black"
      stroke-width="1"
    />
    <!-- y -->
    <!-- svelte-ignore component-name-lowercase -->
    <line
      class="axis-line"
      y1={margin.top}
      y2={$mseHeight - margin.bottom}
      x1={margin.left}
      x2={margin.left}
      stroke="black"
      stroke-width="1"
    />

    <!-- chart data mappings -->
    <!-- Residuals -->
    {#each $dataset as d}
      <!-- svelte-ignore component-name-lowercase -->
      <rect
        class="residual-rect"
        x={d.price > d.y
          ? xScale(d.sqft) - Number(Math.abs(yScale(d.y) - yScale(d.price)))
          : xScale(d.sqft)}
        y={d.price > d.y ? yScale(d.price) : yScale(d.y)}
        height={Number(Math.abs(yScale(d.y) - yScale(d.price)))}
        width={Number(Math.abs(yScale(d.y) - yScale(d.price)))}
      />
    {/each}
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
  #scatter-chart-mse {
    width: 100%;
    height: 98%;
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

  .residual-rect {
    stroke: none;
    fill: var(--cosmos);
    fill-opacity: 0.15;
  }

  .axis-text {
    font-size: 0.7rem;
  }

  .grid-line {
    opacity: 0.075;
  }
</style>
