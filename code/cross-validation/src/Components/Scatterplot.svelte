<script>
  import { scaleLinear } from "d3-scale";
  // import { margin } from "../store";

  //   props
  export let height = 500;
  export let width;
  export let x = 0;
  export let y = 300;

  const margin = {
    top: 10,
    bottom: 10,
    left: 0,
    right: 0,
  };

  //   scale
  $: xScale = scaleLinear()
    .domain([-1, 1])
    .range([margin.left, width - margin.right]);
  $: yScale = scaleLinear()
    .domain([0, 1])
    .range([height - margin.bottom, margin.top]);
</script>

<!-- Stacked Rectangles -->
<g transform="translate({x}, {y})">
  <!-- x-ticks -->
  {#each xScale.ticks() as tick}
    <g transform={`translate(${xScale(tick)} ${height})`}>
      <line
        class="axis-line"
        x1={0}
        x2={0}
        y1="0"
        y2={10}
        stroke="black"
        stroke-dasharray="4"
      />
      <!-- <text class="axis-text" y="0" text-anchor="end">{tick}</text> -->
    </g>
  {/each}
  <!-- y-ticks -->
  {#each [0, 0.2, 0.4, 0.6, 0.8, 1.0] as tick}
    <g transform={`translate(${0} ${yScale(tick) + 0})`}>
      <!-- svelte-ignore component-name-lowercase -->
      <line
        class="y-axis-line"
        x1="0"
        x2={3}
        y1="0"
        y2="0"
        stroke="black"
        stroke-dasharray="4"
      />
      <!-- <text class="axis-text" y="0" text-anchor="end" dominant-baseline="middle"
        >{tick}</text
      > -->
    </g>
  {/each}
  <!-- axis lines -->
  <!-- x -->
  <line
    class="axis-line"
    x1={margin.left}
    x2={width - margin.right}
    y1={height}
    y2={height}
    stroke="black"
  />
  <!-- y -->
  <line
    class="axis-line"
    x1={margin.left}
    x2={margin.left}
    y1={0}
    y2={height}
    stroke="black"
  />
</g>

<style>
  .axis-text {
    font-size: 0.5rem;
  }
</style>
