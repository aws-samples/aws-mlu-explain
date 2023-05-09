<script>
  import { scaleLinear, scaleOrdinal } from "d3-scale";
  import { hexbin } from "d3-hexbin";
  import { onMount, onDestroy } from "svelte";
  import { scatterData } from "../../datasets";
  import { min, max } from "d3-array";
  import ScatterRegression from "./ScatterRegression.svelte";
  import {
    labels,
    marginScroll,
    network,
    numLayers,
    stepIndex,
  } from "../../store";
  import { line } from "d3-shape";
  import { fade, fly, draw } from "svelte/transition";
  import { logistic, perceptron } from "../../outputModelWeights";
  import { cubicOut, linear } from "svelte/easing";
  import { tweened } from "svelte/motion";

  export let height = 160;
  export let width = 160;

  const margin = 5;
  const hexbinRadius = 5;

  console.log("sd", scatterData);

  // here
  let x = 0;
  let y = 0;

  const delay = 4000; // 4 seconds
  const interval = 1000; // 1 second

  // function generateRandomPosition() {
  //   x = Math.floor(Math.random() * 17) - 4; // generates a random integer between -4 and 12
  //   y = Math.floor(Math.random() * 17) - 4;
  // }

  let intervalId;
  // here

  // init to false so don't show drawing during rendering
  $: visible = false;

  $: xScale = scaleLinear()
    .domain([-1.5, 2.5])
    // .domain([
    //   1.1 * min(scatterData, (d) => d.x1),
    //   1.1 * max(scatterData, (d) => d.x1),
    // ])
    .range([margin, width - margin]);
  $: yScale = scaleLinear()
    .domain([0.25, 2.25])
    // .domain([
    //   1.1 * min(scatterData, (d) => d.x2),
    //   1.1 * max(scatterData, (d) => d.x2),
    // ])
    .range([height / 2 - margin, -height / 2 + margin]);

  const colorScale = scaleOrdinal()
    .domain([0, 1])
    .range(["#f46ebb", "#2074d5"]);

  $: hexbins = hexbin()
    .radius(hexbinRadius)
    .extent([
      [0, 0],
      [width, height],
    ]);

  // responsive dimensions for scatter plot
  $: scatterCondition = ![0, 1].includes($stepIndex);

  $: model = $stepIndex < 5 ? logistic : perceptron;

  // ml models

  console.log(logistic(3, 4));

  onMount(() => {});

  let delayFinished = false;

  let timeoutId = setTimeout(() => {
    //   generateRandomPosition(); // generate initial position
    //   delayFinished = true;
    //   let intervalId = setInterval(generateRandomPosition, interval);
    // }, delay);
    // onDestroy(() => {
    //   clearInterval(intervalId);
  });

  // regression stuff

  const slope = 1;
  const intercept = 2;
  let data = [
    { x1: -1.6, x2: -1.55, y: 1.0 },
    { x1: -1.43, x2: -1.38, y: 0.0 },
    { x1: -1.26, x2: -1.21, y: 0.0 },
    { x1: -1.09, x2: -1.04, y: 0.0 },
    { x1: -0.92, x2: -0.87, y: 0.0 },
    { x1: -0.75, x2: -0.7, y: 1.0 },
    { x1: -0.58, x2: -0.53, y: 0.0 },
    { x1: -0.41, x2: -0.36, y: 1.0 },
    { x1: -0.24, x2: -0.19, y: 1.0 },
    { x1: -0.07, x2: -0.02, y: 1.0 },
    { x1: 0.1, x2: 0.15, y: 1.0 },
    { x1: 0.27, x2: 0.32, y: 1.0 },
    { x1: 0.44, x2: 0.49, y: 1.0 },
    { x1: 0.61, x2: 0.66, y: 1.0 },
    { x1: 0.78, x2: 0.83, y: 0.0 },
    { x1: 0.95, x2: 1.0, y: 0.0 },
    { x1: 1.12, x2: 1.17, y: 0.0 },
    { x1: 1.29, x2: 1.34, y: 1.0 },
    { x1: 1.46, x2: 1.51, y: 0.0 },
    { x1: 1.63, x2: 1.68, y: 0.0 },
    { x1: 1.8, x2: 1.85, y: 0.0 },
    { x1: 1.97, x2: 2.02, y: 1.0 },
    { x1: 2.14, x2: 2.19, y: 1.0 },
    { x1: 2.31, x2: 2.36, y: 1.0 },
    { x1: 2.4, x2: 2.45, y: 0.0 },
  ];
  $: xScaleRegression = scaleLinear()
    .domain([1, 15])
    .range([margin, width - margin]);

  $: yScaleRegression = scaleLinear()
    .domain([0, 17])
    .range([height - margin, margin]);

  // the path generator
  $: pathLine = line()
    .x((d) => xScale(d.x1))
    .y((d) => yScale(d.x1 * slope + intercept));

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

  // tween stuff
  const maxLength = Math.max(scatterData.length, data.length);

  const startingData = Array(maxLength)
    .fill(null)
    .map((_, i) => {
      return {
        x1: data[i]?.x1 ?? 0.3,
        x2: data[i]?.x2 ?? 0,
        y: data[i]?.y ?? 1,
      };
    });

  console.log("startingData", startingData);
  // Initialize the tweened store with startingData
  const dataset = tweened(startingData, {
    duration: 500,
    easing: linear,
  });

  let isScatterData = true;

  console.log("dataset", $dataset);
  // Create a function to update the tween
  function updateTween() {
    if (isScatterData) {
      // Map data to the desired format
      const mappedData = Array(maxLength)
        .fill(null)
        .map((_, i) => {
          return {
            x1: data[i]?.x1 ?? 0,
            x2: data[i]?.x2 ?? 0,
            y: data[i]?.y ?? 1, // Use existing 'y' values or default to 1
          };
        });

      // Update the tween
      dataset.set(mappedData);
    } else {
      // Reset the tween to the original scatterData with maxLength
      const resetData = Array(maxLength)
        .fill(null)
        .map((_, i) => {
          return {
            x1: scatterData[i]?.x1 ?? 0,
            x2: scatterData[i]?.x2 ?? 0,
            y: scatterData[i]?.y ?? 1,
          };
        });

      dataset.set(resetData);
    }

    // // Toggle isScatterData
    // isScatterData = !isScatterData;
  }

  $: {
    if ($stepIndex == 2) {
      isScatterData = true;
      updateTween();
    } else {
      isScatterData = false;
      updateTween();
    }
  }

  // Clean up the tween when the component is destroyed
  onDestroy(() => {
    dataset.stop();
  });
</script>

<!-- scatterplot -->
{#if scatterCondition}
  <!-- {#if $stepIndex === 2} -->
  <!-- <ScatterRegression {width} {height} /> -->
  <g clip-path="url(#clip)" transform={`translate(0 ${-height / 2})`}>
    <!-- <rect {width} {height} fill="red" /> -->

    {#each $dataset as d, i}
      {#if i > 0}
        <circle
          class="dot"
          cx={xScale(d.x1)}
          cy={yScale(d.x2)}
          r="3"
          fill={colorScale(d.y)}
          in:draw={{ duration: 500 }}
          out:draw={{ duration: 0 }}
        />
      {/if}
    {/each}

    <!-- draw for reg -->
    <path
      in:draw={{ duration: 500 }}
      out:draw={{ duration: 0 }}
      class="outer-path"
      d={pathLine($dataset)}
    />
    <path
      in:draw={{ duration: 500 }}
      out:draw={{ duration: 0 }}
      class="inner-path"
      d={pathLine($dataset)}
    />
    <!-- end reg -->

    <!-- draw for hex -->
    <!-- {#each hexbins(hexbins.centers()) as h}
      <path
        in:draw={{ duration: 500 }}
        out:draw={{ duration: 0 }}
        class="hex-cell"
        d={`M${h.x},${h.y}${hexbins.hexagon()}`}
        fill={colorScale(
          model(xScale.invert(h.x), yScale.invert(h.y - height / 2))
        )}
        stroke={colorScale(
          model(xScale.invert(h.x), yScale.invert(h.y - height / 2))
        )}
      />
    {/each} -->
    <!-- end hex -->
  </g>
{:else}
  <!-- <g clip-path="url(#clip)" transform={`translate(0 ${-height / 2})`}>
      {#each hexbins(hexbins.centers()) as h}
        <path
          in:draw={{ duration: 500 }}
          out:draw={{ duration: 0 }}
          class="hex-cell"
          d={`M${h.x},${h.y}${hexbins.hexagon()}`}
          fill={colorScale(
            model(xScale.invert(h.x), yScale.invert(h.y - height / 2))
          )}
          stroke={colorScale(
            model(xScale.invert(h.x), yScale.invert(h.y - height / 2))
          )}
        />
      {/each}
    </g>
    {#each scatterData as d, i}
      <circle
        in:fly={{ x: -50, duration: 500 }}
        out:fade={{ duration: 200 }}
        cx={xScale(d.x1)}
        cy={yScale(d.x2)}
        r="4"
        fill={colorScale(d.y)}
      />
    {/each} -->
  <!-- {#if delayFinished}
    <circle class="prediction-circle" cx={xScale(x)} cy={yScale(y)} r="10" />
  {/if} -->
  <!-- {/if} -->
{/if}

<style>
  /* reg */
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
  /* class */
  .prediction-circle {
    stroke: var(--squidink);
    stroke-width: 2;
    fill: var(--paper);
    r: 5;
  }
  .hex-cell {
    /* fill: none; */
    /* stroke: rgba(0, 0, 0, 0.0344); */
    stroke-width: 0;
    opacity: 0.4;
    /* transition: all 1s; */
  }
  circle {
    stroke: var(--bg);
  }
</style>
