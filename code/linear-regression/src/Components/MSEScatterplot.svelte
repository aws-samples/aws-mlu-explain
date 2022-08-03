<script>
  import { tweened } from "svelte/motion";
  import { linear } from "svelte/easing";
  import { line } from "d3-shape";
  import { scaleLinear } from "d3-scale";
  import { format } from "d3-format";
  import { mseData } from "../datasets.js";
  import { max, min } from "d3-array";
  import {
    absError,
    shuffleIteration,
    mseBias,
    mseWeight,
    mseErrors,
    mseIteration,
    mseError,
    rSquared,
    RSS,
    TSS,
  } from "../store.js";

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

  // these don't matter, but make the stretching less obvious at load
  let height = 500;
  let width = 500;

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
    console.log("y mean:", yMean);
    // calculate TSS
    let tssErrors = mseData.map((d) => {
      return (d[`price${$shuffleIteration}`] - yMean) ** 2;
    });
    $TSS = Number(tssErrors.reduce((a, b) => a + b, 0));
    console.log("TSS:", $TSS);

    // calculate RSS
    $RSS = Number(errors.reduce((a, b) => a + b, 0));
    console.log("RSS:", $RSS);
    // calculate r-squared
    $rSquared = 1 - $RSS / $TSS;
    console.log("R-Squared:", $rSquared);

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

    // calculate MAE
    let absErrors = mseData.map((d) => {
      return Number(
        Math.abs(
          d[`price${$shuffleIteration}`] -
            ($mseWeight * d[`sqft${$shuffleIteration}`] + $mseBias)
        )
      );
    });
    $absError = Number(absErrors.reduce((a, b) => a + b, 0)) / errors.length;
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
      // min(mseData, (d) => d[`sqft${$shuffleIteration}`]) - 2,
      // max(mseData, (d) => d[`sqft${$shuffleIteration}`]) + 2,
    ])
    // .domain([0, 11])
    .range([margin.left, width - margin.right]);
  $: yScale = scaleLinear()
    .domain([
      min($dataset, (d) => d.price) - 2,
      max($dataset, (d) => d.price) + 2,
      // min(mseData, (d) => d[`price${$shuffleIteration}`]),
      // max(mseData, (d) => d[`price${$shuffleIteration}`]) + 2,
    ])
    // .domain([-1, 16])
    .range([height - margin.bottom, margin.top]);

  // line generator
  $: regressionPath = line()
    .x((d) => xScale(d.sqft))
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
          dominant-baseline="middle">{formatter(tick)}</text
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

  .residual-rect {
    stroke: none;
    fill: var(--cosmos);
    fill-opacity: 0.15;
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
