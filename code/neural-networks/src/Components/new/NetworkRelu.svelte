<script>
  import { draw } from "svelte/transition";
  import { scaleLinear } from "d3-scale";
  import { line, curveBasis } from "d3-shape";
  import { mobile } from "../../store";
  import { tweened } from "svelte/motion";
  import { cubicOut, linear } from "svelte/easing";

  export let data = "linear";

  const linearData = [
    { x: -4.0, y: -1.0 },
    { x: -3.724137931, y: -0.862 },
    { x: -3.4482758621, y: -0.724 },
    { x: -3.1724137931, y: -0.586 },
    { x: -2.8965517241, y: -0.448 },
    { x: -2.6206896552, y: -0.31 },
    { x: -2.3448275862, y: -0.172 },
    { x: -2.0689655172, y: -0.034 },
    { x: -1.7931034483, y: 0.103 },
    { x: -1.5172413793, y: 0.241 },
    { x: -1.2413793103, y: 0.379 },
    { x: -0.9655172414, y: 0.517 },
    { x: -0.6896551724, y: 0.655 },
    { x: -0.4137931034, y: 0.793 },
    { x: -0.1379310345, y: 0.931 },
    { x: 0.1379310345, y: 1.069 },
    { x: 0.4137931034, y: 1.207 },
    { x: 0.6896551724, y: 1.345 },
    { x: 0.9655172414, y: 1.483 },
    { x: 1.2413793103, y: 1.621 },
    { x: 1.5172413793, y: 1.759 },
    { x: 1.7931034483, y: 1.897 },
    { x: 2.0689655172, y: 2.034 },
    { x: 2.3448275862, y: 2.172 },
    { x: 2.6206896552, y: 2.31 },
    { x: 2.8965517241, y: 2.448 },
    { x: 3.1724137931, y: 2.586 },
    { x: 3.4482758621, y: 2.724 },
    { x: 3.724137931, y: 2.862 },
    { x: 4.0, y: 3.0 },
  ];

  const reluData = [
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

  const sigmoidData = [
    { x: -12.0, y: 0.0 },
    { x: -11.1724137931, y: 0.0 },
    { x: -10.3448275862, y: 0.0 },
    { x: -9.5172413793, y: 0.0 },
    { x: -8.6896551724, y: 0.0 },
    { x: -7.8620689655, y: 0.0 },
    { x: -7.0344827586, y: 0.001 },
    { x: -6.2068965517, y: 0.002 },
    { x: -5.3793103448, y: 0.005 },
    { x: -4.5517241379, y: 0.01 },
    { x: -3.724137931, y: 0.024 },
    { x: -2.8965517241, y: 0.052 },
    { x: -2.0689655172, y: 0.112 },
    { x: -1.2413793103, y: 0.224 },
    { x: -0.4137931034, y: 0.398 },
    { x: 0.4137931034, y: 0.602 },
    { x: 1.2413793103, y: 0.776 },
    { x: 2.0689655172, y: 0.888 },
    { x: 2.8965517241, y: 0.948 },
    { x: 3.724137931, y: 0.976 },
    { x: 4.5517241379, y: 0.99 },
    { x: 5.3793103448, y: 0.995 },
    { x: 6.2068965517, y: 0.998 },
    { x: 7.0344827586, y: 0.999 },
    { x: 7.8620689655, y: 1.0 },
    { x: 8.6896551724, y: 1.0 },
    { x: 9.5172413793, y: 1.0 },
    { x: 10.3448275862, y: 1.0 },
    { x: 11.1724137931, y: 1.0 },
    { x: 12.0, y: 1.0 },
  ];

  const stepData = [
    { x: -4.0, y: -1 },
    { x: -3.724137931, y: -1 },
    { x: -3.4482758621, y: -1 },
    { x: -3.1724137931, y: -1 },
    { x: -2.8965517241, y: -1 },
    { x: -2.6206896552, y: -1 },
    { x: -2.3448275862, y: -1 },
    { x: -2.0689655172, y: -1 },
    { x: -1.7931034483, y: -1 },
    { x: -1.5172413793, y: -1 },
    { x: -1.2413793103, y: -1 },
    { x: -0.9655172414, y: -1 },
    { x: -0.6896551724, y: -1 },
    { x: -0.4137931034, y: -1 },
    { x: -0.1379310345, y: -1 },
    { x: -0.1379310345, y: 1 },
    { x: 0.4137931034, y: 1 },
    { x: 0.6896551724, y: 1 },
    { x: 0.9655172414, y: 1 },
    { x: 1.2413793103, y: 1 },
    { x: 1.5172413793, y: 1 },
    { x: 1.7931034483, y: 1 },
    { x: 2.0689655172, y: 1 },
    { x: 2.3448275862, y: 1 },
    { x: 2.6206896552, y: 1 },
    { x: 2.8965517241, y: 1 },
    { x: 3.1724137931, y: 1 },
    { x: 3.4482758621, y: 1 },
    { x: 3.724137931, y: 1 },
    { x: 4.0, y: 1 },
  ];

  // Initialize the tweened store with startingData
  const dataset = tweened(sigmoidData, {
    duration: 500,
    easing: linear,
  });

  $: xDomain = [-4, 4];
  $: yDomain = [-1, 3];

  function updateData(data) {
    if (data === "linear") {
      xDomain = [-4, 4];
      yDomain = [-1, 3];
      dataset.set(linearData);
    }
    if (data === "sigmoid") {
      xDomain = [-12, 12];
      yDomain = [-0.1, 1.1];
      dataset.set(sigmoidData);
    }
    if (data === "step") {
      xDomain = [-4, 4];
      yDomain = [-1.7, 1.7];
      dataset.set(stepData);
    }
    if (data === "reLu") {
      xDomain = [-4, 4];
      yDomain = [-0.5, 4.5];
      dataset.set(reluData);
    }
  }

  $: updateData(data);

  $: width = $mobile ? 42 : 72;
  $: height = width / 1.6;
  $: margin = $mobile
    ? { top: 9, bottom: 9, left: 9, right: 9 }
    : { top: 12, bottom: 5, left: 6, right: 6 };

  // scales
  $: xScale = scaleLinear()
    .domain(xDomain)
    .range([margin.left, width - margin.right]);

  $: yScale = scaleLinear()
    .domain(yDomain)
    .range([height - margin.top, margin.bottom]);

  // the path generator
  $: pathLine = line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y));
</script>

<path
  class="activation-path-outer"
  transition:draw={{ duration: 500 }}
  d={pathLine($dataset)}
/>
<path
  class="activation-path-inner"
  transition:draw={{ duration: 500 }}
  d={pathLine($dataset)}
/>

<style>
  .activation-path-outer {
    stroke: var(--white);
    stroke-width: 6;
    fill: none;
    stroke-linecap: round;
  }

  .activation-path-inner {
    stroke: var(--darksquidink);
    stroke-width: 2;
    fill: none;
    stroke-linecap: round;
  }
</style>
