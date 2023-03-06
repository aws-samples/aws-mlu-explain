<script>
  import { draw } from "svelte/transition";
  import { scaleLinear } from "d3-scale";
  import { line, curveBasis } from "d3-shape";

  // props
  export let show = true;

  let data = [
    { x: -4.0, y: -0.999 },
    { x: -3.724137931, y: -0.999 },
    { x: -3.4482758621, y: -0.998 },
    { x: -3.1724137931, y: -0.996 },
    { x: -2.8965517241, y: -0.994 },
    { x: -2.6206896552, y: -0.989 },
    { x: -2.3448275862, y: -0.982 },
    { x: -2.0689655172, y: -0.969 },
    { x: -1.7931034483, y: -0.946 },
    { x: -1.5172413793, y: -0.908 },
    { x: -1.2413793103, y: -0.846 },
    { x: -0.9655172414, y: -0.747 },
    { x: -0.6896551724, y: -0.598 },
    { x: -0.4137931034, y: -0.392 },
    { x: -0.1379310345, y: -0.137 },
    { x: 0.1379310345, y: 0.137 },
    { x: 0.4137931034, y: 0.392 },
    { x: 0.6896551724, y: 0.598 },
    { x: 0.9655172414, y: 0.747 },
    { x: 1.2413793103, y: 0.846 },
    { x: 1.5172413793, y: 0.908 },
    { x: 1.7931034483, y: 0.946 },
    { x: 2.0689655172, y: 0.969 },
    { x: 2.3448275862, y: 0.982 },
    { x: 2.6206896552, y: 0.989 },
    { x: 2.8965517241, y: 0.994 },
    { x: 3.1724137931, y: 0.996 },
    { x: 3.4482758621, y: 0.998 },
    { x: 3.724137931, y: 0.999 },
    { x: 4.0, y: 0.999 },
  ];

  let width = 80;
  let height = width;
  const padding = 10;

  const xDomain = [-4, 4];
  const yDomain = [-1, 1];

  // scales
  $: xScale = scaleLinear()
    .domain(xDomain)
    .range([padding, width - padding]);

  $: yScale = scaleLinear()
    .domain(yDomain)
    .range([height - padding, padding]);

  // the path generator
  $: pathLine = line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y))
    .curve(curveBasis);
</script>

<div id="relu-chart">
  <svg {width} {height}>
    {#if show}
      <path
        class="activation-path"
        transition:draw={{ duration: 1000 }}
        d={pathLine(data)}
      />
    {/if}
  </svg>
</div>

<style>
  #relu-chart {
    /* width: 100px;
      max-height: 100%;
      height: 100%; */
    margin: auto;
    background: conic-gradient(
        from 90deg at 1px 1px,
        #0000 90deg,
        rgba(0, 0, 0, 0.05) 0
      )
      0 0/20px 20px;
  }

  svg {
    /* border: 1px solid black; */
  }
  .activation-path {
    stroke: black;
    stroke-width: 2;
    fill: none;
    stroke-linecap: round;
  }
</style>
