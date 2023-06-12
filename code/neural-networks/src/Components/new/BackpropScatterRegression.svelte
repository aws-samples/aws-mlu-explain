<script>
  import { extent } from "d3-array";
  import { draw } from "svelte/transition";
  import { scaleLinear } from "d3-scale";
  import { line, curveBasis } from "d3-shape";
  import { drawErrorLine, drawErrorCircle, bpSlope } from "../../store";
  import { cubicOut } from "svelte/easing";

  let intercept = 2;

  let data = [
    { x: 1.3, y: 0 },
    { x: 1.9, y: 1.43 },
    { x: 2.2, y: 5.4 },
    { x: 4, y: 8.71 },
    { x: 6, y: 10.57 },
    { x: 7, y: 6.32 },
    { x: 8, y: 12.26 },
    { x: 10, y: 6.5 },
    { x: 12, y: 12.7 },
    { x: 12, y: 16.12 },
    { x: 14, y: 15.01 },
  ];

  export let height = 200;
  export let width = 200;
  let margin = {
    top: 0,
    left: 0,
    bottom: 0,
    right: 20,
  };
  // scales
  $: xScale = scaleLinear()
    .domain([1, 15])
    .range([margin.left, width - margin.right]);

  $: yScale = scaleLinear()
    .domain([0, 17])
    .range([height - margin.bottom, margin.top]);

  // the path generator
  $: pathLine = line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.x * $bpSlope + intercept));

  let drawErrorBackprop = true;

  function radiusTransition(node, { duration = 300, from = 0, to = 8 }) {
    const diff = to - from;
    const easing = cubicOut;

    return {
      duration,
      css: (t) => {
        const eased_t = easing(t);
        const r = from + eased_t * diff;
        return `r: ${r};`;
      },
    };
  }
</script>

<g class="nn-g" transform={`translate(${0} ${-height / 2})`}>
  <rect id="bg-rect" {width} {height} />
  <line
    class="axis-line"
    x1={margin.left}
    x2={width - margin.right}
    y1={height}
    y2={height}
  />
  <line
    class="axis-line"
    x1={margin.left}
    x2={margin.left}
    y1={margin.top}
    y2={height}
  />
  <!-- x-ticks -->
  {#each xScale.ticks() as tick}
    <g transform={`translate(${xScale(tick) + 0} ${height + margin.bottom})`}>
      <line
        class="axis-tick"
        x1="0"
        x2="0"
        y1={-margin.bottom}
        y2={-height + margin.bottom * 2}
      />
    </g>
  {/each}
  <!-- y-ticks -->
  {#each yScale.ticks() as tick}
    <g transform={`translate(${margin.left - 5} ${yScale(tick) + 0})`}>
      <line
        class="axis-tick"
        x1={4}
        x2={width - margin.right - margin.left}
        y1="0"
        y2="0"
      />
    </g>
  {/each}
  <path
    class="outer-path"
    d={pathLine(data.map((d) => ({ x: d.x, y: d.x * $bpSlope + intercept })))}
  />
  <path
    class="inner-path"
    d={pathLine(data.map((d) => ({ x: d.x, y: d.x * $bpSlope + intercept })))}
  />

  {#if $drawErrorLine}
    {#each data as d, i}
      {#if i > 0}
        <path
          transition:draw={{ duration: 1000 }}
          class="error-line"
          d={`M${xScale(d.x)} ${yScale(d.x * $bpSlope + intercept)} L${xScale(
            d.x
          )} ${yScale(d.y)}`}
        />
      {/if}
    {/each}
    <text
      x={xScale(11)}
      y={(yScale(6.5) + yScale(10 * $bpSlope + intercept)) / 2}
      class="bp-error-text">ERROR</text
    >
  {/if}

  {#each data as d, i}
    {#if i > 0}
      <circle class="dot" cx={xScale(d.x)} cy={yScale(d.y)} r="3" />
    {/if}
  {/each}

  <!-- draw error line -->
  {#if $drawErrorCircle}
    {#each data as d, i}
      {#if i > 0}
        <circle
          id="bpErrorCircle"
          cx={xScale(d.x)}
          cy={yScale(d.x * $bpSlope + intercept)}
          r="6"
          fill="var(--bg)"
          stroke="red"
          transition:radiusTransition={{ duration: 300, from: 0, to: 8 }}
        />
      {/if}
    {/each}
  {/if}
</g>

<style>
  .error-line {
    stroke: red;
    fill: none;
    stroke-width: 3;
    transition: all 1s;
  }
  .bp-error-text {
    paint-order: stroke fill;
    stroke-width: 4;
    stroke: red;
    fill: white;
    stroke-linecap: round;
    font-size: 12px;
    font-family: var(--font-heavy);
  }
  * {
    color: white;
  }
  #bg-rect {
    fill: var(--darksquidink);
  }
  .axis-line {
    stroke-width: 3;
    stroke: white;
    fill: none;
  }
  .axis-tick {
    stroke-width: 1;
    stroke: var(--white);
    fill: none;
    opacity: 0.05;
  }
  .axis-text {
    font-family: Arial;
    font-size: 12px;
    fill: var(--white);
  }
  circle {
    transition: all 1s;
  }
  circle.dot {
    fill: var(--magenta);
    stroke: var(--bg);
    stroke-width: 2;
    opacity: 0.85;
  }
  .inner-path {
    stroke: yellow;
    stroke-width: 4;
    fill: none;
    transition: all 1s;
    stroke-linecap: round;
  }
  .outer-path {
    stroke: var(--squidink);
    stroke-width: 9;
    fill: none;
    transition: all 1s;
    stroke-linecap: round;
  }
</style>
