<script>
  import { tweened } from "svelte/motion";
  import { linear } from "svelte/easing";
  import { line, curveNatural } from "d3-shape";
  import { selectAll } from "d3-selection";
  import { scaleLinear } from "d3-scale";
  import { format } from "d3-format";
  import { interpretationData } from "../datasets.js";
  import { max } from "d3-array";
  import {
    showRegressionLine,
    showResiduals,
    marginScroll,
    sqft,
    coeff,
    intercept,
    showHighlight,
  } from "../store.js";

  // these don't matter, but make the stretching less obvious at load
  let height = 500;
  let width = 500;

  // label formatter
  const formatter = format("$,");

  export function showAnnotationLines() {
    selectAll(".annotation-line").attr("opacity", 0.5);
  }

  export function hideAnnotationLines() {
    selectAll(".annotation-line").attr("opacity", 0);
  }

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

  $: xScale = scaleLinear()
    .domain([0, maxVal])
    .range([$marginScroll.left, width - $marginScroll.right]);
  $: yScale = scaleLinear()
    .domain([0, max(interpretationData, (d) => d.price)])
    .range([height - $marginScroll.bottom, $marginScroll.top]);

  // line generator
  $: regressionPath = line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y))
    .curve(curveNatural);
</script>

<div id="scatter-chart" bind:offsetWidth={width} bind:offsetHeight={height}>
  <svg {width} height={height + $marginScroll.top + $marginScroll.bottom}>
    <!-- x-ticks -->
    {#each xScale.ticks() as tick}
      <g
        transform={`translate(${xScale(tick) + 0} ${
          height - $marginScroll.bottom
        })`}
      >
        <!-- svelte-ignore component-name-lowercase -->
        <line
          class="grid-line"
          x1="0"
          x2="0"
          y1="0"
          y2={-height + $marginScroll.bottom + $marginScroll.top}
          stroke="black"
          stroke-dasharray="4"
        />
        <text class="axis-text" y="15" text-anchor="middle">{tick}</text>
      </g>
    {/each}

    <!-- y-ticks -->
    {#each yScale.ticks() as tick, i}
      <g transform={`translate(${$marginScroll.left - 5} ${yScale(tick) + 0})`}>
        <!-- svelte-ignore component-name-lowercase -->
        <line
          class="grid-line"
          x1={5}
          x2={width - $marginScroll.right}
          y1="0"
          y2="0"
          stroke="black"
          stroke-dasharray="4"
        />
        {#if i % 2 === 0}
          <text
            class="axis-text"
            y="0"
            text-anchor="end"
            dominant-baseline="middle">{formatter(tick)}</text
          >
        {/if}
      </g>
    {/each}
    <!-- axis lines -->
    <!-- x -->
    <!-- svelte-ignore component-name-lowercase -->
    <line
      class="axis-line"
      y1={height - $marginScroll.bottom}
      y2={height - $marginScroll.bottom}
      x1={$marginScroll.left}
      x2={width}
      stroke="black"
      stroke-width="1"
    />
    <!-- y -->
    <!-- svelte-ignore component-name-lowercase -->
    <line
      class="axis-line"
      y1={$marginScroll.top}
      y2={height - $marginScroll.bottom}
      x1={$marginScroll.left}
      x2={$marginScroll.left}
      stroke="black"
      stroke-width="1"
    />
    <!-- axis labels -->
    <text
      class="axis-label"
      y={height + $marginScroll.bottom}
      x={(width + $marginScroll.left) / 2}
      text-anchor="middle">Size of House (sqft)</text
    >
    <text
      class="axis-label"
      y={$marginScroll.left / 4.8}
      x={-(height / 2)}
      text-anchor="middle"
      transform="rotate(-90)">Housing Price ($)</text
    >

    <!-- chart data mappings -->
    <!-- Residuals -->
    {#each $dataset as d}
      {#if $showResiduals}
        <!-- svelte-ignore component-name-lowercase -->
        <line
          class="residual-line"
          x1={xScale(d.sqft)}
          x2={xScale(d.sqft)}
          y1={yScale(d.price)}
          y2={yScale(d.y)}
        />
      {/if}
    {/each}

    {#if $showRegressionLine}
      <!-- draw regression line -->
      <path class="regression-line" d={regressionPath($regressionLine)} />
    {/if}
    <!-- draw circles -->
    {#each $dataset as d}
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

    <!-- highlight annotations -->
    <circle
      class="highlight-circle"
      r="7.5"
      fill="none"
      stroke="black"
      opacity="0"
      cx={xScale($sqft)}
      cy={$coeff === 0.097
        ? yScale($intercept + $coeff * Math.sqrt($sqft))
        : yScale($intercept + $coeff * $sqft)}
    />
    <!-- svelte-ignore component-name-lowercase -->
    <!-- vertical annotation line -->
    <line
      class="annotation-line"
      x1={xScale($sqft)}
      x2={xScale($sqft)}
      y1={$coeff === 0.097
        ? yScale($intercept + $coeff * Math.sqrt($sqft))
        : yScale($intercept + $coeff * $sqft)}
      y2={yScale(0)}
      stroke="black"
      opacity="0"
    />

    <!-- svelte-ignore component-name-lowercase -->
    <!-- horizontal annotation line -->
    <line
      class="annotation-line"
      x1={xScale(0)}
      x2={xScale($sqft)}
      y1={$coeff === 0.097
        ? yScale($intercept + $coeff * Math.sqrt($sqft))
        : yScale($intercept + $coeff * $sqft)}
      y2={$coeff === 0.097
        ? yScale($intercept + $coeff * Math.sqrt($sqft))
        : yScale($intercept + $coeff * $sqft)}
      stroke="black"
      opacity="0"
    />
    <!-- hihglight text -->
    {#if $showHighlight}
      <text
        class="highlight-text"
        text-anchor="middle"
        y={yScale($intercept + $coeff * $sqft) + 16}
        x={xScale($sqft)}>Sqft: {$sqft}</text
      >
      <text
        class="highlight-text"
        text-anchor="middle"
        y={yScale($intercept + $coeff * $sqft)}
        x={xScale($sqft)}>Price: {formatter($intercept + $coeff * $sqft)}</text
      >
    {/if}
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

  .residual-line {
    stroke: var(--cosmos);
    stroke-width: 1.8;
    opacity: 0.5;
  }

  .annotation-line {
    stroke-width: 1.5;
  }

  .highlight-text {
    text-transform: uppercase;
    font-family: var(--font-mono);
    stroke-linejoin: round;
    paint-order: stroke fill;
    stroke-width: 4px;
    pointer-events: none;
    stroke: var(--squidink);
    font-size: 0.8rem;
    letter-spacing: 2px;
    fill: white;
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
