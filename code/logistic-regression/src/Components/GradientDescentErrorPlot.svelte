<script>
  import { tweened } from "svelte/motion";
  import { linear } from "svelte/easing";
  import { line } from "d3-shape";
  import { scaleLinear } from "d3-scale";
  import { format } from "d3-format";
  import { scatterData } from "../datasets.js";
  import { max, min, extent } from "d3-array";
  import { gdBias, gdWeight, gdErrors, gdError } from "../data-store.js";

  // label formatter
  const formatter = format(".2f");

  const margin = { top: 30, right: 30, bottom: 30, left: 50 };

  // these don't matter, but make the stretching less obvious at load
  let height = 500;
  let width = 500;

  // scales
  $: xScale = scaleLinear()
    .domain([
      0,
      max($gdErrors, (d) => d.iteration) +
        0.6 * max($gdErrors, (d) => d.iteration),
    ])
    .range([margin.left, width - margin.right]);
  $: yScale = scaleLinear()
    .domain([0, max($gdErrors, (d) => d.error)])
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
          dominant-baseline="middle">{tick}</text
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
    <!-- axis labels -->

    <!-- y-axis label -->
    <text
      class="axis-label"
      text-anchor="middle"
      transform={`translate(${15},${height / 2}) rotate(-90)`}
    >
      Error (Log-Loss)
    </text>

    <!-- x-axis label -->
    <text
      class="axis-label"
      text-anchor="middle"
      x={(width + margin.left) / 2}
      y={height}
    >
      Iterations
    </text>

    <!-- chart data mappings -->

    <!-- draw regression line -->
    <path class="error-line" d={errorPath($gdErrors)} />

    <!-- draw circles -->
    <circle
      class="error-circle"
      fill="var(--secondary)"
      stroke-width="1.5"
      r="4.5"
      cx={xScale($gdErrors[$gdErrors.length - 1].iteration)}
      cy={yScale($gdErrors[$gdErrors.length - 1].error)}
    />
    <text
      class="error-text"
      x={xScale($gdErrors[$gdErrors.length - 1].iteration) + 5}
      y={$gdError > 100
        ? yScale($gdErrors[$gdErrors.length - 1].error)
        : yScale($gdErrors[$gdErrors.length - 1].error)}
    >
      {$gdError == 10000 ? "> 10000" : formatter($gdError)}
    </text>
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
    font-size: 0.7rem;
    font-family: var(--font-heavy);
  }

  .axis-text {
    font-family: var(--font-heavy);
    font-size: 0.7rem;
  }

  .axis-label {
    font-weight: bold;
  }

  .legend-text {
    font-family: var(--font-heavy);
  }

  .error-text {
    /* font-family: var(--font-mono); */
    stroke-linejoin: round;
    paint-order: stroke fill;
    stroke-width: 4px;
    pointer-events: none;
    stroke: var(--paper);
    font-size: 0.8rem;
    letter-spacing: 2px;
  }

  .grid-line {
    opacity: 0.075;
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
