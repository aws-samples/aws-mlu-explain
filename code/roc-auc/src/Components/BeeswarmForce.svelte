<!--
	@component
	Generates an SVG Beeswarm chart using a [d3-force simulation](https://github.com/d3/d3-force).
 -->
<script>
  import { getContext } from "svelte";
  import { forceSimulation, forceX, forceY, forceCollide } from "d3-force";
  import {
    planeBody,
    planeWingLeft,
    planeWingRight,
    planeRotar,
    cloudPath,
  } from "../iconPaths";
  import { collision, iconScale } from "../data-store.js";

  const { data, xGet, xScale, height, zGet } = getContext("LayerCake");

  const nodes = $data.map((d) => ({ ...d }));

  /** @type {Number} [r=4] – The circle radius size in pixels. */
  export let r = 7;

  /** @type {Number} [strokeWidth=1] – The circle's stroke width in pixels. */
  export let strokeWidth = 1;

  /** @type {String} [stroke='#fff'] – The circle's stroke color. */
  export let stroke = "#fff";

  /** @type {Number} [xStrength=0.95] – The value passed into the `.strength` method on `forceX`. See [the documentation](https://github.com/d3/d3-force#x_strength). */
  export let xStrength = 0.95;

  /** @type {Number} [yStrength=0.075] – The value passed into the `.strength` method on `forceY`. See [the documentation](https://github.com/d3/d3-force#y_strength). */
  export let yStrength = 0.075;

  // const cloudPath = `m558.77 267.66c-2.4492-60.551-52.5-109.02-113.57-109.02-7.0859 0-14.176 0.61328-21.086 1.9258-28.613-33.426-71.398-53.375-115.32-53.375-72.363 0-134.05 50.664-148.4 121.19-51.891 8.9219-90.391 54.246-90.391 107.18v8.3984c0 59.938 48.824 108.76 108.85 108.76h357.18c51.801 0 93.977-42.176 93.977-93.977-0.003906-43.223-29.668-80.758-71.23-91.082z`;
  const offsetX = 0;
  const offsetY = 0;

  const planePath2 = `m140.56 299.6c1.1211 1.1211 2.2383 1.6797 2.8008 1.6797 24.078 13.441 48.16 27.441 72.238 40.879 2.2383 1.1211 3.3594 2.8008 3.9219 5.6016 0.55859 8.3984 1.1211 16.801 2.2383 25.762 1.1211 18.48 2.2383 36.398 3.9219 54.32 0 2.2383 0.55859 3.9219 1.1211 6.7188 7.2812-4.4805 14-8.3984 20.16-12.32 1.1211-0.55859 1.6797-2.2383 1.6797-3.9219 2.2383-20.719 5.0391-41.441 7.2812-62.16 0-1.6797 1.6797-3.9219 2.8008-5.0391 11.199-7.2812 22.398-14.559 33.602-21.281 14.559-9.5195 29.68-18.48 44.238-28 3.9219-2.8008 6.7188-1.6797 7.8398 2.8008 3.9219 19.602 7.8398 39.199 11.762 58.801 6.7188 34.16 13.441 68.32 20.16 101.92 0.55859 3.9219 1.1211 3.9219 4.4805 2.2383 9.5195-5.6016 19.602-11.199 29.121-16.238 8.3984-4.4805 8.3984-4.4805 8.9609-14 1.1211-26.32 2.2383-52.641 2.8008-79.52 1.6797-36.398 2.8008-72.801 4.4805-109.2 0-2.2383 1.1211-4.4805 2.8008-5.6016 15.121-9.5195 29.68-18.48 44.801-28 16.238-10.078 32.48-20.16 48.16-30.801 8.3984-5.6016 15.121-12.879 18.48-22.398 4.4805-12.879-1.1211-24.641-12.879-28-3.9219-1.1211-7.8398-1.1211-11.762-1.1211-11.199 0.55859-21.281 4.4805-30.801 10.641-28.57 19.035-56.57 36.957-85.129 54.875-1.6797 1.1211-3.9219 1.1211-5.6016 0.55859-30.238-12.879-59.922-25.199-89.602-38.078-29.68-12.879-59.922-25.199-89.602-38.078-2.2383-1.1211-3.9219-0.55859-5.6016 0.55859-7.8398 5.6016-15.68 10.641-23.52 16.238-3.9219 2.8008-8.3984 6.1602-12.879 8.9609 1.1211 1.1211 2.2383 1.6797 2.8008 2.8008 5.0391 3.9219 10.641 7.8398 15.68 11.762 38.641 28.559 77.281 56.559 115.36 85.121 5.0391 3.9219 5.0391 6.1602 0 9.5195-25.199 16.238-50.398 31.922-75.602 48.16-3.3594 2.2383-6.1602 2.2383-9.5195 1.1211-16.801-6.1602-34.16-11.199-50.961-17.922-6.1602-2.2383-11.762-2.8008-16.801 2.2383-2.8008 2.8008-6.7188 4.4805-10.078 6.7188-1.1133 0.003906-2.2344 0.5625-3.3555 1.6836z`;

  const planePath = `m619.85 214.74c0.050782-33.195-102.47-60.727-235.13-65.004-3.4141-35.895-9.3789-68.66-18.395-96.035-4.9453 0.14062-9.9805 0.23047-15.176 0.23047h-0.93359c-3.7812 0-9.5312-0.0625-16.09-0.25781-9.1094 27.344-15.164 60.094-18.691 95.961-132.67 3.9023-235.26 31.113-235.3 64.293-0.074219 32.922 100.84 60.289 232 64.934 2.0312 60.781 8.3086 121.98 16.637 174.63-61.305 9.7656-86.223 60.969-17.91 61.051l29.301 0.042969c1.3477 6.1211 2.7031 12.078 4.0938 17.672 3.3828 14.262 8.0742 15.223 10.504 0l0.027343-0.027344c1.3945-5.6016 2.7656-11.531 4.1211-17.617l29.047 0.054687c68.176 0.066407 43.598-51.012-17.477-61.059 8.4844-52.633 14.953-113.84 17.152-174.64 131.17-4.2422 232.18-31.305 232.22-64.23zm-95.082-35.809c19.719 0 35.637 16.012 35.633 35.695-0.039063 19.719-16.039 35.688-35.734 35.648-19.75-0.035157-35.688-16.012-35.648-35.734 0.007813-19.715 16.035-35.664 35.75-35.609zm-350.31 70.84c-19.75-0.003906-35.672-16.023-35.672-35.734 0.0625-19.738 16.031-35.648 35.789-35.617 19.68 0.011719 35.598 16.023 35.598 35.734-0.003906 19.66-16.02 35.637-35.715 35.617z`;
  $: simulation = forceSimulation(nodes)
    .force(
      "x",
      forceX()
        .x((d) => $xScale(d.xVal))
        .strength(xStrength)
    )
    .force(
      "y",
      forceY()
        .y($height / 2)
        .strength(yStrength)
    )
    .force("collide", forceCollide($collision))
    // .force("collide", forceCollide(r + 1.5))
    .stop();

  $: {
    for (let i = 0, n = 400; i < n; ++i) {
      simulation.tick();
    }
  }
</script>

<g class="bee-group">
  {#each simulation.nodes() as node}
    <circle
      class="node"
      outcome={node.yVal}
      fill={$zGet(node)}
      {stroke}
      stroke-width={strokeWidth}
      {r}
      opacity="0"
      cx={node.x}
      cy={node.y}
    />

    {#if node.yVal === 0}
      <!-- render cloud -->
      <path
        fill={"#7cd1ea"}
        stroke="white"
        stroke-width="20"
        d={cloudPath}
        transform={`translate(${node.x - 12} ${
          node.y - 12
        }) scale(${$iconScale})`}
      />
    {:else}
      <!-- render plane -->
      <path
        fill={"#c9208a"}
        stroke="white"
        stroke-width="8"
        d={planeWingLeft}
        transform={`translate(${node.x - 10} ${
          node.y - 14
        }) scale(${$iconScale})`}
      />
      <path
        fill={"#c9208a"}
        stroke="white"
        stroke-width="8"
        d={planeWingRight}
        transform={`translate(${node.x - 10} ${
          node.y - 14
        }) scale(${$iconScale})`}
      />
      <path
        fill={"#c9208a"}
        stroke="white"
        stroke-width="4"
        d={planeRotar}
        transform={`translate(${node.x - 10} ${
          node.y - 14
        }) scale(${$iconScale})`}
      />
      <path
        fill={"#c9208a"}
        stroke="white"
        stroke-width="8"
        d={planeBody}
        transform={`translate(${node.x - 10} ${
          node.y - 14
        }) scale(${$iconScale})`}
      />
    {/if}
  {/each}
</g>
