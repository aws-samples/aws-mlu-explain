<script>
  import { tweened } from "svelte/motion";
  import { linear } from "svelte/easing";
  import { line } from "d3-shape";
  import { scaleLinear } from "d3-scale";
  import { format } from "d3-format";
  import { gradientDescentData } from "../datasets.js";
  import { max, min, extent } from "d3-array";
  import { sqft, gdBias, gdWeight, gdErrors, gdError } from "../store.js";

  // label formatter
  const formatter = format(".3f");

  const margin = {
    top: 12,
    bottom: 18,
    left: 40,
    right: 30,
  };

  // these don't matter, but make the stretching less obvious at load
  let height = 500;
  let width = 500;

  // scales
  $: xScale = scaleLinear()
    // .domain([0.0, max(dataset, (d) => d.sqft)])
    .domain([
      0,
      max($gdErrors, (d) => d.iteration) +
        0.6 * max($gdErrors, (d) => d.iteration),
    ])
    .range([margin.left, width - margin.right]);
  $: yScale = scaleLinear()
    .domain([0, $gdError < 200 ? 300 : $gdError + $gdError * 0.3])
    .range([height - margin.bottom, margin.top]);

  // line generator
  $: errorPath = line()
    .x((d) => xScale(d.iteration))
    .y((d) => yScale(d.error));
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
        <text class="axis-text" y="15" text-anchor="middle">{tick}</text>
      </g>
    {/each}
    <!-- y-ticks -->
    {#each yScale.ticks() as tick, i}
      {#if i % 2 === 0}
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
            dominant-baseline="middle">{tick}</text
          >
        </g>
      {/if}
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
    <!-- axis labels -->
    <text
      class="axis-label"
      y={height + margin.bottom - 5}
      x={(width + margin.left) / 2}
      text-anchor="middle">Iterations</text
    >
    <text
      class="axis-label"
      y={margin.left / 4.8}
      x={-(height / 2)}
      text-anchor="middle"
      transform="rotate(-90)">Error (MSE)</text
    >

    <!-- chart data mappings -->

    <!-- draw regression line -->
    <path class="error-line" d={errorPath($gdErrors)} />

    <!-- draw circles -->
    <circle
      class="regression-circle"
      fill="#c9208a"
      stroke="black"
      stroke-width="1.5"
      r="4.5"
      cx={xScale($gdErrors[$gdErrors.length - 1].iteration)}
      cy={yScale($gdErrors[$gdErrors.length - 1].error)}
    />
    <text
      class="error-text"
      x={xScale($gdErrors[$gdErrors.length - 1].iteration)}
      y={yScale($gdErrors[$gdErrors.length - 1].error)}
      >{formatter($gdError)}</text
    >
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

  .error-line {
    stroke: var(--cosmos);
    stroke-width: 2;
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
    font-family: var(--font-mono);
    stroke-linejoin: round;
    paint-order: stroke fill;
    stroke-width: 4px;
    pointer-events: none;
    stroke: #f1f3f3;
    font-size: 0.8rem;
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
