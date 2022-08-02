<script>
  import { tweened } from "svelte/motion";
  import { linear } from "svelte/easing";
  import { line } from "d3-shape";
  import { scaleLinear } from "d3-scale";
  import { format } from "d3-format";
  import { cfData } from "../datasets.js";
  import { max, min } from "d3-array";
  import { fade, fly } from "svelte/transition";
  import { leastSquares } from "../utils";

  import { cfBias, cfWeight, cfCircles } from "../store.js";

  const margin = {
    top: 50,
    bottom: 3,
    left: 40,
    right: 30,
  };

  // these don't matter, but make the stretching less obvious at load
  let height = 500;
  let width = 500;

  // label formatter
  const formatter = format(".2r");

  // scales
  $: xScale = scaleLinear()
    .domain([0, 100])
    .range([margin.left, width - margin.right]);
  $: yScale = scaleLinear()
    .domain([0, 100])
    .range([height - margin.bottom, margin.top]);

  //   import { elasticOut } from "svelte/easing";

  //   function showCircle(node, { duration }) {
  //     return {
  //       duration,
  //       css: (t) => {
  //         const eased = elasticOut(t);
  //         return `transform: scale(${eased}); r: 10;`;
  //       },
  //     };
  //   }

  //   in:showCircle={{ duration: 500 }}
  //         out:fade
  function handleClick(event) {
    const circle = {
      cx: event.offsetX,
      cy: event.offsetY,
    };
    // console.log(event);

    $cfCircles = $cfCircles.concat(circle);

    // update slope and weight:
    // make array of x values
    const xVals = $cfCircles.map((d) => xScale.invert(d.cx));
    const yVals = $cfCircles.map((d) => yScale.invert(d.cy));
    const vals = leastSquares(xVals, yVals);
    // console.log("estimates", vals);
    $cfWeight = vals[0];
    $cfBias = vals[1];
  }

  // set tweened store for line
  const lineData = tweened(
    [
      {
        x: 0,
        y: 0,
      },
      {
        x: 0,
        y: 0,
      },
    ],
    {
      duration: 200,
      easing: linear,
    }
  );

  // update line reactively
  $: lineData.set([
    {
      x: 0,
      y: $cfBias + $cfWeight * 0,
    },
    {
      x: 105,
      y: $cfBias + $cfWeight * 105,
    },
  ]);

  //   $: console.log("lineData", $lineData);

  //   // line generator
  $: regressionPath = line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y));
</script>

<div id="scatter-chart" bind:offsetWidth={width} bind:offsetHeight={height}>
  <svg
    on:click={handleClick}
    {width}
    height={height + margin.top + margin.bottom}
  >
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

    <!-- draw regression line -->
    {#if $cfCircles.length > 1}
      <path class="regression-line" d={regressionPath($lineData)} />
    {/if}
    <!-- draw circles -->
    {#each $cfCircles as d}
      <circle
        class="regression-circle"
        fill="#c9208a"
        stroke="black"
        stroke-width="1.5"
        r="4.5"
        cx={d.cx}
        cy={d.cy}
      />
    {/each}
    <text class="chart-title" y={margin.top / 2} x={margin.left}
      >Live Least-Squares Estimates</text
    >
    <text class="chart-subtitle" y={margin.top - 5} x={margin.left}
      >Click To Add Circles And Update The Estimates</text
    >

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

  .regression-line {
    stroke: var(--squidink);
    stroke-width: 3.5;
    fill: red;
  }

  .chart-title {
    font-size: 0.9rem;
  }
  .chart-subtitle {
    font-size: 0.75rem;
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

  /* ipad */
  @media screen and (max-width: 950px) {
  }
  /* mobile */
  @media screen and (max-width: 750px) {
  }
</style>
