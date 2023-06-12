<script>
  import { extent } from "d3-array";
  import { draw } from "svelte/transition";
  import { scaleLinear } from "d3-scale";
  import { line, curveBasis } from "d3-shape";
  import { cubicOut } from "svelte/easing";

  export let height = 200;
  export let width = 200;
  let margin = {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  };

  const slope = 1;
  const intercept = 2;

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
    .y((d) => yScale(d.x * slope + intercept));

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
    d={pathLine(data.map((d) => ({ x: d.x, y: d.x * slope + intercept })))}
  />
  <path
    class="inner-path"
    d={pathLine(data.map((d) => ({ x: d.x, y: d.x * slope + intercept })))}
  />

  {#each data as d, i}
    {#if i > 0}
      <circle
        class="dot"
        cx={xScale(d.x)}
        cy={yScale(d.y)}
        r="3"
        transition:radiusTransition={{ duration: 300, from: 0, to: 8 }}
      />
    {/if}
  {/each}
</g>

<style>
  #bg-rect {
    fill: var(--bg);
    border: 2px solid var(--squidink);
  }

  .axis-tick {
    stroke: var(--squidink);
    stroke-width: 1;
    fill: none;
    opacity: 0.05;
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
    stroke: var(--bananayellow);
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
