<script>
  import { scaleLinear, scaleOrdinal } from "d3-scale";
  import { hexbin } from "d3-hexbin";
  import { onMount, onDestroy } from "svelte";
  import { scatterData } from "../datasets";

  import {
    labels,
    marginScroll,
    network,
    numLayers,
    stepIndex,
  } from "../store";
  import { line } from "d3-shape";
  import { fade, fly, draw } from "svelte/transition";
  import { logistic, perceptron } from "../outputModelWeights";

  export let height;
  export let width;

  const margin = 5;
  const hexbinRadius = 5;

  // here
  let x = 0;
  let y = 0;

  const delay = 4000; // 4 seconds
  const interval = 1000; // 1 second

  function generateRandomPosition() {
    x = Math.floor(Math.random() * 17) - 4; // generates a random integer between -4 and 12
    y = Math.floor(Math.random() * 17) - 4;
  }

  let intervalId;
  // here

  // init to false so don't show drawing during rendering
  $: visible = false;

  $: xScale = scaleLinear()
    .domain([-4, 12])
    .range([margin, width - margin]);
  $: yScale = scaleLinear()
    .domain([-4, 12])
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
  $: scatterCondition = ![1, 10].includes($stepIndex);

  $: model = $stepIndex < 5 ? logistic : perceptron;

  // ml models

  console.log(logistic(3, 4));
  onMount(() => {});

  let delayFinished = false;

  let timeoutId = setTimeout(() => {
    generateRandomPosition(); // generate initial position
    delayFinished = true;
    let intervalId = setInterval(generateRandomPosition, interval);
    onDestroy(() => {
      clearInterval(intervalId);
    });
  }, delay);
  onDestroy(() => {
    clearInterval(intervalId);
  });
</script>

<!-- scatterplot -->
{#if scatterCondition}
  <g clip-path="url(#clip)" transform={`translate(0 ${-height / 2})`}>
    <!-- hexbins -->
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
  <!-- circles -->
  {#each scatterData as d, i}
    <circle
      in:fly={{ x: -50, duration: 500 }}
      out:fade={{ duration: 200 }}
      cx={xScale(d.x)}
      cy={yScale(d.y)}
      r="4"
      fill={colorScale(d.label)}
      stroke={colorScale(d.label)}
    />
  {/each}
  {#if delayFinished}
    <circle class="prediction-circle" cx={xScale(x)} cy={yScale(y)} r="10" />
  {/if}
  <!-- {#each yScale.ticks() as tick}
    <text x="10" y={yScale(tick)}>{tick}</text>
  {/each}
  {#each xScale.ticks() as tick}
    <text y={100} x={xScale(tick)}>{tick}</text>
  {/each} -->
{/if}

<style>
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
    transition: all 1s;
  }

  /* .output {
      fill: var(--bananayellow);
    } */
</style>
