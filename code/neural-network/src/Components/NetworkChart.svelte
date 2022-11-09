<script>
  import { scaleLinear } from "d3-scale";
  import { format } from "d3-format";
  import { interpretationData } from "../datasets.js";
  import { max } from "d3-array";
  import { marginScroll } from "../store";
  import { curveNatural, line } from "d3-shape";

  // these don't matter, but make the stretching less obvious at load
  let height = 500;
  let width = 500;

  // label formatter
  const formatter = format("$,");

  const maxVal = max(interpretationData, (d) => d.sqft) + 25;

  interpretationData.sort((a, b) => b.y - a.y);

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

<div id="network-chart" bind:offsetWidth={width} bind:offsetHeight={height}>
  <svg {width} height={height + $marginScroll.top + $marginScroll.bottom}>
    <!-- axis lines -->
    <!-- x -->
    <!-- svelte-ignore component-name-lowercase -->
    <line
      class="axis-line"
      y1={height - $marginScroll.bottom}
      y2={height - $marginScroll.bottom}
      x1={$marginScroll.left}
      x2={width - $marginScroll.right}
      stroke="black"
      stroke-width="1"
    />
    <line
      class="axis-line"
      y1={$marginScroll.top}
      y2={$marginScroll.top}
      x1={$marginScroll.left}
      x2={width - $marginScroll.right}
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
    <line
      class="axis-line"
      y1={$marginScroll.top}
      y2={height - $marginScroll.bottom}
      x1={width - $marginScroll.right}
      x2={width - $marginScroll.right}
      stroke="black"
      stroke-width="1"
    />
  </svg>
</div>

<style>
  svg {
    border: 4px solid black;
    /* background-color: coral; */
  }
  #network-chart {
    width: 100%;
    max-height: 100%;
    height: 100%;
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
