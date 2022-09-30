<script>
  import { scaleLinear } from "d3-scale";
  import { extent } from "d3-array";

  //   props
  export let data;
  export let height = 500;
  export let width;
  export let x = 0;
  export let y = 300;
  export let regressionData;

  const margin = {
    top: 10,
    bottom: 10,
    left: 0,
    right: 0,
  };

  const radius = 6;

  //   scale
  $: xScale = scaleLinear()
    .domain(extent(data, (d) => d.x))
    .range([margin.left, width - margin.right]);
  $: yScale = scaleLinear()
    .domain(extent(data, (d) => d.y))
    .range([height - margin.bottom, margin.top]);
</script>

<!-- Stacked Rectangles -->
<g transform="translate({x}, {y})">
  <!-- circles -->
  {#each data as d}
    <!-- add validation error line -->
    {#if d.color === "#f46ebb"}
      <line
        class="error-line"
        x1={xScale(d.x)}
        x2={xScale(d.x)}
        y1={yScale(d.y)}
        y2={yScale(d.x * regressionData["a"] + regressionData["b"])}
      />
    {/if}
    <!-- draw rects for each data point -->
    <rect
      x={xScale(d.x) - radius / 2}
      y={yScale(d.y) - radius / 2}
      fill={d.color}
      width={radius}
      height={radius}
    />
  {/each}

  <line
    class="regression-line"
    x1={xScale(regressionData[0][0])}
    x2={xScale(regressionData[1][0])}
    y1={yScale(regressionData[0][1])}
    y2={yScale(regressionData[1][1])}
  />

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
  .regression-line {
    fill: none;
    stroke: black;
    stroke-width: 2;
  }
  .error-line {
    fill: none;
    stroke: red;
    stroke-width: 1;
    stroke-dasharray: 2, 2;
  }
</style>
