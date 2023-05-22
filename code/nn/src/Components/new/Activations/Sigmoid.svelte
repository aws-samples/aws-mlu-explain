<script>
  import { draw } from "svelte/transition";
  import { scaleLinear } from "d3-scale";
  import { line, curveBasis } from "d3-shape";
  import { mobile } from "../../../store";

  // props
  export let show = true;

  let data = [
    { x: -4.0, y: 0.018 },
    { x: -3.724137931, y: 0.024 },
    { x: -3.4482758621, y: 0.031 },
    { x: -3.1724137931, y: 0.04 },
    { x: -2.8965517241, y: 0.052 },
    { x: -2.6206896552, y: 0.068 },
    { x: -2.3448275862, y: 0.087 },
    { x: -2.0689655172, y: 0.112 },
    { x: -1.7931034483, y: 0.143 },
    { x: -1.5172413793, y: 0.18 },
    { x: -1.2413793103, y: 0.224 },
    { x: -0.9655172414, y: 0.276 },
    { x: -0.6896551724, y: 0.334 },
    { x: -0.4137931034, y: 0.398 },
    { x: -0.1379310345, y: 0.466 },
    { x: 0.1379310345, y: 0.534 },
    { x: 0.4137931034, y: 0.602 },
    { x: 0.6896551724, y: 0.666 },
    { x: 0.9655172414, y: 0.724 },
    { x: 1.2413793103, y: 0.776 },
    { x: 1.5172413793, y: 0.82 },
    { x: 1.7931034483, y: 0.857 },
    { x: 2.0689655172, y: 0.888 },
    { x: 2.3448275862, y: 0.913 },
    { x: 2.6206896552, y: 0.932 },
    { x: 2.8965517241, y: 0.948 },
    { x: 3.1724137931, y: 0.96 },
    { x: 3.4482758621, y: 0.969 },
    { x: 3.724137931, y: 0.976 },
    { x: 4.0, y: 0.982 },
  ];

  $: width = $mobile ? 50 : 70;
  $: height = width;
  $: padding = $mobile ? 5 : 10;

  const xDomain = [-4, 4];
  const yDomain = [0, 1];

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
