<script>
  import { scatterData1, sigmoidCurve } from "../datasets.js";
  import { scaleLinear, scaleOrdinal } from "d3-scale";
  import { max, min, extent, mean } from "d3-array";
  import { transition } from "d3-transition";
  import { Temperature, DecisionBoundary, Prediction } from "../data-store.js";
  // new
  import { tweened } from "svelte/motion";
  import { linear } from "svelte/easing";
  import { line, curveNatural } from "d3-shape";
  import { select, selectAll } from "d3-selection";
  import { format } from "d3-format";
  import { interpretationData } from "../datasets.js";
  import {
    showRegressionLine,
    showResiduals,
    sqft,
    coeff,
    intercept,
  } from "../store.js";
  import { draw } from "svelte/transition";

  let width = 500;
  let height = 500;
  const margin = { top: 50, right: 40, bottom: 50, left: 90 };

  export function hideResidualLines() {
    // selectAll(".residual-line").attr("opacity", 0);
  }

  export function showResidualLines() {
    // selectAll(".residual-line").attr("opacity", 1);
  }

  export function showAnnotationLines() {
    selectAll(".annotation-line").attr("opacity", 0.5);
  }

  export function hideAnnotationLines() {
    selectAll(".annotation-line").attr("opacity", 0);
  }

  const formatter = format(".1f");

  $: xScale = scaleLinear()
    .domain([0, 750])
    .range([margin.left, width - margin.right]);

  $: yScale = scaleLinear()
    .domain([
      min(interpretationData, (d) => d.price),
      max(interpretationData, (d) => d.price),
    ])
    .range([height - margin.bottom, margin.top]);

  const maxVal = max(interpretationData, (d) => d.sqft) + 25;

  const dataset = tweened(
    interpretationData.map((d) => {
      return {
        sqft: d.sqft,
        y: d.sqft * $coeff + $intercept,
        price: d.price,
      };
    }),
    {
      duration: 500,
      easing: linear,
    }
  );

  $: dataset.set(
    interpretationData.map((d) => {
      return {
        sqft: d.sqft,
        y: d.sqft * $coeff + $intercept,
        price: d.price,
      };
    })
  );

  const regressionLine = tweened(
    [
      { x: 0, y: 0 * $coeff + $intercept },
      { x: 400, y: 400 * $coeff + $intercept },
      { x: maxVal, y: maxVal * $coeff + $intercept },
    ],
    {
      duration: 500,
      easing: linear,
    }
  );

  $: regressionLine.set([
    { x: 0, y: 0 * $coeff + $intercept },
    { x: 400, y: 400 * $coeff + $intercept },
    { x: maxVal, y: maxVal * $coeff + $intercept },
  ]);

  $dataset.sort((a, b) => b.y - a.y);

  $: {
    console.log(
      "max value",
      max($regressionLine, (d) => d.y)
    );
  }

  $: xScale = scaleLinear()
    .domain([0, maxVal])
    .range([margin.left, width - margin.right]);
  $: yScale = scaleLinear()
    .domain([-10, max(interpretationData, (d) => d.price)])
    .range([height - margin.bottom, margin.top]);

  // line generator
  $: regressionPath = line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y))
    .curve(curveNatural);
</script>

<div id="scatter-chart" bind:offsetWidth={width} bind:offsetHeight={height}>
  <svg {width} height={height + margin.top + margin.bottom}>
    <!-- x ticks -->
    {#each xScale.ticks() as tick}
      <g transform={`translate(${xScale(tick)}, ${height - margin.bottom})`}>
        <!-- svelte-ignore component-name-lowercase -->
        <line
          class="grid-line"
          x1="0"
          x2="0"
          y1="0"
          y2={-height + margin.bottom + margin.top}
        />
        <text class="axis-text" y="15" text-anchor="middle" dy="5"
          >{tick}
        </text>
      </g>
    {/each}
    <!-- y ticks -->
    {#each yScale.ticks() as tick}
      <g transform={`translate(${margin.left}, ${yScale(tick)})`}>
        <!-- svelte-ignore component-name-lowercase -->
        <line
          class="grid-line"
          x1="0"
          x2={width - margin.left - margin.right}
          y1="0"
          y2="0"
        />
        <text
          class="axis-text"
          text-anchor="end"
          dx="-5"
          dominant-baseline="middle"
          >{formatter(tick)}
        </text>
      </g>
    {/each}

    <!-- axis lines -->
    <!-- svelte-ignore component-name-lowercase -->
    <line
      class="axis-line"
      x1={margin.left}
      x2={width - margin.right}
      y1={height - margin.bottom}
      y2={height - margin.bottom}
    />
    <!-- svelte-ignore component-name-lowercase -->
    <line
      class="axis-line"
      x1={margin.left}
      x2={margin.left}
      y1={height - margin.bottom}
      y2={margin.top}
    />

    <!-- points -->
    {#each interpretationData as d}
      <circle
        class="regression-circle"
        fill="#c9208a"
        stroke="black"
        stroke-width="1.5"
        r="5.5"
        cx={xScale(d.sqft)}
        cy={yScale(d.price)}
      />
    {/each}

    {#if $showRegressionLine}
      <!-- draw regression line -->
      <path class="regression-line" d={regressionPath($regressionLine)} />
    {/if}

    <!-- decision boundary -->
    <g
      transform={`translate(${margin.left}, ${yScale($DecisionBoundary) - 5})`}
    >
      <rect
        class="boundary-line"
        stroke="var(--squidink)"
        stroke-width="1.4"
        fill="var(--paper)"
        width={width - margin.right - margin.left}
        height={10}
        opacity={0}
      />
    </g>

    <!-- y-axis label -->
    <text
      class="axis-label"
      text-anchor="middle"
      transform={`translate(${25},${yScale(300000)}) rotate(-90)`}
    >
      House Price ($)
    </text>

    <!-- x-axis label -->
    <text
      class="axis-label"
      text-anchor="middle"
      x={xScale(350)}
      y={height - 10}
    >
      Size of House (sqft)
    </text>
  </svg>
</div>

<style>
  #scatter-chart {
    width: 100%;
    max-height: 98%;
  }

  .grid-line {
    fill: none;
    stroke: var(--squidink);
    stroke-dasharray: 4;
    stroke-opacity: 0.2;
  }

  .axis-line {
    fill: none;
    stroke: var(--squidink);
  }

  .axis-text {
    font-family: var(--font-heavy);
  }

  .axis-label {
    font-family: var(--font-heavy);
  }

  .legend-text {
    font-family: var(--font-heavy);
  }

  .arrow-holder {
    display: flex;
    paint-order: stroke fill;
    stroke: var(--paper);
    fill: black;
    font-family: var(--font-heavy);
    stroke-linejoin: round;
    stroke-width: 5px;
    pointer-events: none;
    font-size: 0;
  }

  .arrow-text {
    font-size: 13;
    text-anchor: start;
  }

  /* new */
  .regression-circle {
    fill: var(--primary);
    stroke-width: 0;
  }

  .regression-line {
    stroke: var(--squidink);
    stroke-width: 3.5;
    fill: none;
  }

  .residual-line {
    stroke: var(--cosmos);
    stroke-width: 1.8;
    opacity: 0.5;
  }

  .annotation-line {
    stroke-width: 1.5;
  }

  .axis-label {
    font-weight: bold;
  }

  .axis-text {
    font-size: 0.8rem;
  }

  .grid-line {
    opacity: 0.075;
  }

  .axis-label {
    text-transform: uppercase;
    font-size: 0.9rem;
  }

  /* ipad */
  @media screen and (max-width: 950px) {
    .axis-label {
      font-size: 0.8rem;
    }
  }
  /* mobile */
  @media screen and (max-width: 750px) {
    .axis-label {
      font-size: 0.75rem;
    }
  }
</style>
