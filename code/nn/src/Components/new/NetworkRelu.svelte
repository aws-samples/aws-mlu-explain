<script>
  import { draw } from "svelte/transition";
  import { scaleLinear } from "d3-scale";
  import { line, curveBasis } from "d3-shape";
  import { mobile } from "../../store";

  let data = [
    { x: -4.0, y: 0.0 },
    { x: -3.724137931, y: 0.0 },
    { x: -3.4482758621, y: 0.0 },
    { x: -3.1724137931, y: 0.0 },
    { x: -2.8965517241, y: 0.0 },
    { x: -2.6206896552, y: 0.0 },
    { x: -2.3448275862, y: 0.0 },
    { x: -2.0689655172, y: 0.0 },
    { x: -1.7931034483, y: 0.0 },
    { x: -1.5172413793, y: 0.0 },
    { x: -1.2413793103, y: 0.0 },
    { x: -0.9655172414, y: 0.0 },
    { x: -0.6896551724, y: 0.0 },
    { x: -0.4137931034, y: 0.0 },
    { x: -0.1379310345, y: 0.0 },
    { x: 0.1379310345, y: 0.138 },
    { x: 0.4137931034, y: 0.414 },
    { x: 0.6896551724, y: 0.69 },
    { x: 0.9655172414, y: 0.966 },
    { x: 1.2413793103, y: 1.241 },
    { x: 1.5172413793, y: 1.517 },
    { x: 1.7931034483, y: 1.793 },
    { x: 2.0689655172, y: 2.069 },
    { x: 2.3448275862, y: 2.345 },
    { x: 2.6206896552, y: 2.621 },
    { x: 2.8965517241, y: 2.897 },
    { x: 3.1724137931, y: 3.172 },
    { x: 3.4482758621, y: 3.448 },
    { x: 3.724137931, y: 3.724 },
    { x: 4.0, y: 4.0 },
  ];

  $: width = $mobile ? 42 : 72;
  $: height = width / 1.3;
  $: padding = $mobile ? 5 : 10;

  const xDomain = [-4, 4];
  const yDomain = [-1, 3];

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

<path
  class="activation-path-outer"
  transition:draw={{ duration: 1000 }}
  d={pathLine(data)}
/>
<path
  class="activation-path-inner"
  transition:draw={{ duration: 1000 }}
  d={pathLine(data)}
/>

<style>
  .activation-path-outer {
    stroke: var(--white);
    stroke-width: 4;
    fill: none;
  }

  .activation-path-inner {
    stroke: var(--darksquidink);
    stroke-width: 2;
    fill: none;
  }
</style>
