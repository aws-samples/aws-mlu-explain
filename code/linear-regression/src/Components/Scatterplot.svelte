<script>
  import { tweened } from "svelte/motion";
  import { cubicInOut } from "svelte/easing";
  import { line, curveNatural } from "d3-shape";
  import { select, selectAll } from "d3-selection";
  import { scaleLinear } from "d3-scale";
  import { format } from "d3-format";
  import { scatterData } from "../datasets.js";
  import { max } from "d3-array";
  import { marginScroll, sqft, coeff, intercept, lineType } from "../store.js";

  // set tweened store for line
  const dataset = tweened(
    scatterData.map((d) => {
      return { sqft: d.sqft, y: d[$lineType], price: d.price };
    }),
    {
      duration: 500,
      easing: cubicInOut,
    }
  );

  // update line reactively
  $: dataset.set(
    scatterData.map((d) => {
      return { sqft: d.sqft, y: d[$lineType], price: d.price };
    })
  );

  // these don't matter, but make the stretching less obvious at load
  let height = 500;
  let width = 500;

  // label formatter
  const formatter = format(".2r");

  export function hideResidualLines() {
    console.log("changing number");
    selectAll(".residual-line").attr("opacity", 0);
  }

  export function showResidualLines() {
    console.log("residuals");
    selectAll(".residual-line").attr("opacity", 1);
  }

  export function showAnnotationLines() {
    selectAll(".annotation-line").attr("opacity", 1);
  }

  export function hideAnnotationLines() {
    selectAll(".annotation-line").attr("opacity", 1);
  }

  // scales
  $: xScale = scaleLinear()
    .domain([0.0, 11])
    .range([$marginScroll.left, width - $marginScroll.right]);
  $: yScale = scaleLinear()
    .domain([0, 16])
    .range([height - $marginScroll.bottom, $marginScroll.top]);

  // line generator
  $: regressionPath = line()
    .x((d) => xScale(d.sqft))
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
        <text class="axis-text" y="15" text-anchor="middle"
          >{formatter(tick)}</text
        >
      </g>
    {/each}
    <!-- y-ticks -->
    {#each yScale.ticks() as tick}
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
      <!-- svelte-ignore component-name-lowercase -->
      <line
        class="residual-line"
        opacity="0"
        x1={xScale(d.sqft)}
        x2={xScale(d.sqft)}
        y1={yScale(d.price)}
        y2={yScale(d.y)}
        stroke="black"
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
        r="6.5"
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
      cy={$coeff === 25.65
        ? yScale($intercept + $coeff * Math.sqrt($sqft))
        : yScale($intercept + $coeff * $sqft)}
    />
    <!-- svelte-ignore component-name-lowercase -->
    <!-- vertical annotation line -->
    <line
      class="annotation-line"
      x1={xScale($sqft)}
      x2={xScale($sqft)}
      y1={$coeff === 25.65
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
      y1={$coeff === 25.65
        ? yScale($intercept + $coeff * Math.sqrt($sqft))
        : yScale($intercept + $coeff * $sqft)}
      y2={$coeff === 25.65
        ? yScale($intercept + $coeff * Math.sqrt($sqft))
        : yScale($intercept + $coeff * $sqft)}
      stroke="black"
      opacity="1"
    />
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
    stroke-width: 2.5;
    /* stroke-dasharray: 2, 2; */
  }

  .annotation-line {
    stroke-width: 0.5;
  }

  .axis-label {
    font-weight: bold;
  }

  .axis-text {
    font-size: 0.8rem;
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

  #highlight-text,
  #highlight-tspan {
    text-transform: uppercase;
    font-family: var(--font-heavy);
    stroke-linejoin: round;
    paint-order: stroke fill;
    stroke-width: 4.25px;
    pointer-events: none;
    stroke: #f1f3f3;
    font-size: 0.8rem;
  }
  .error-axis-text {
    font-size: 0.9rem;
  }

  .grid-line {
    opacity: 0.075;
  }

  #error-text-accuracy {
    fill: #c9208a;
  }

  .axis-label {
    text-transform: uppercase;
    font-size: 0.9rem;
  }

  .path-line {
    fill: none;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 4;
  }

  .outline-line {
    fill: none;
    stroke: #f1f3f3;
    stroke-width: 8;
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

    .path-line {
      stroke-width: 5;
    }
    .outline-line {
      stroke-width: 8;
    }
  }
  /* mobile */
  @media screen and (max-width: 750px) {
    .axis-label {
      font-size: 0.75rem;
    }
    .error-axis-text {
      font-size: 0.7rem;
    }
    .error-text,
    #highlight-text,
    #highlight-tspan {
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
