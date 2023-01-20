<script>
  import { scaleLinear } from "d3-scale";
  import { max } from "d3-array";
  import {
    drawActivation,
    labels,
    marginScroll,
    showLayerLine,
    showSubScript,
  } from "../store";
  import {
    numLayersInteractive,
    networkInteractive,
  } from "../playground-store";
  import { line } from "d3-shape";
  import { fade, fly, draw } from "svelte/transition";

  // these don't matter, but make the stretching less obvious at load
  //   export let network = [2, 5, 2];
  //   $: numLayersInteractive = $numLayersInteractive;
  $: maxNumNeurons = max($networkInteractive) + 1;

  let height;
  let width;
  // init to false so don't show drawing during rendering

  let nodeWidth = 70;
  let nodeHeight = 40;

  function positionElements(numElements, maxNumNeurons) {
    const interval = (maxNumNeurons - 1 - numElements + 1) / 2;

    // Create an array of positions for each element
    const positions = [];
    for (let i = 0; i < numElements; i++) {
      positions.push(interval + i);
    }
    return positions;
  }

  $: xScale = scaleLinear()
    .domain([-1, $numLayersInteractive])
    .range([$marginScroll.left, width - $marginScroll.right]);
  $: yScale = scaleLinear()
    .domain([-1, maxNumNeurons])
    .range([height - $marginScroll.bottom, $marginScroll.top]);
</script>

<div id="neural-network" bind:offsetWidth={width} bind:offsetHeight={height}>
  <svg {width} height={height + $marginScroll.top + $marginScroll.bottom}>
    <!-- edges -->
    {#each Array($numLayersInteractive).fill(null) as i, layer}
      {#each positionElements($networkInteractive[layer], maxNumNeurons) as yPosition}
        {#if layer > 0}
          {#each positionElements($networkInteractive[layer - 1], maxNumNeurons) as prevYPosition}
            <line
              in:draw|local={{ duration: 500 }}
              out:draw|local={{ duration: 400 }}
              x1={xScale(layer - 1)}
              y1={yScale(prevYPosition)}
              x2={xScale(layer)}
              y2={yScale(yPosition)}
              class="nn-edge"
            />
          {/each}
        {/if}
      {/each}
    {/each}
    <!-- here is some bs text to add to this -->

    <!-- nodes -->
    {#each Array($numLayersInteractive).fill(null) as index, layer}
      {#each positionElements($networkInteractive[layer], maxNumNeurons) as yPosition}
        <g
          class="nn-g"
          transform={`translate(${xScale(layer) - nodeWidth / 2} ${
            yScale(yPosition) - nodeHeight / 2
          })`}
        >
          <rect
            in:fly|local={{ x: -50, duration: 500 }}
            out:fade|local={{ duration: 300 }}
            class="nn-node {layer == 0
              ? 'input'
              : layer == $numLayersInteractive - 1
              ? 'output'
              : 'hidden'}"
            width={nodeWidth}
            height={nodeHeight}
          />
          <text
            in:fly|local={{ x: -50, duration: 500 }}
            out:fade|local={{ duration: 300 }}
            class="nn-text"
            text-anchor="middle"
            alignment-baseline="middle"
            dx={nodeWidth / 2}
            dy={nodeHeight / 2}
            >{layer == 0
              ? $labels[0]
              : layer == $numLayersInteractive - 1
              ? $labels[2]
              : $labels[1]}
            {#if layer === 0 && $showSubScript}
              <tspan class="subscript" dy="4">{Math.abs(yPosition - 2.5)}</tspan
              >
            {/if}</text
          >
        </g>
      {/each}
    {/each}

    <!-- get path of entire network -->
  </svg>
</div>

<style>
  svg {
    /* border: 4px solid var(--stone); */
    border-radius: 5;
    transition: all 0.45s;
  }
  .layer-underline {
    stroke-width: 2.5;
    stroke-dasharray: 0;
    fill: none;
    transition: all 0.45s;
  }

  .subscript {
    font-size: 0.6rem;
    transition: all 0.45s;
  }
  .nn-text {
    font-size: 0.8rem;
    transition: all 0.45s;
  }
  .nn-g {
    transition: all 0.45s;
  }
  .nn-edge {
    stroke: var(--squidink);
    stroke-width: 1.5;
    stroke-dasharray: 5;
    stroke-dasharray: 0;
    opacity: 0.95;
    /* animation: dash 18s infinite linear; */
    transition: all 0.45s;
  }
  .input {
    fill: var(--rind);
    stroke: var(--rind);
  }
  .hidden {
    fill: var(--magenta);
    stroke: var(--magenta);
  }
  .output {
    fill: var(--bananayellow);
    stroke: var(--bananayellow);
  }

  @keyframes dash {
    from {
      stroke-dashoffset: 1000;
    }
  }
  .nn-node {
    stroke: var(--darksquidink);
    stroke-width: 2.5;
    fill-opacity: 1;
    transition: all 0.45s;
  }
  .activation-rect {
    stroke: var(--darksquidink);
    stroke-width: 4;
    /* stroke-dasharray: 15; */
    fill: none;
    transition: all 0.45s;
  }
  #neural-network {
    width: 100%;
    max-height: 80vh;
    height: 100%;
  }

  .regression-circle {
    fill: var(--primary);
    stroke-width: 0;
  }

  .regression-line {
    stroke: var(--squidink);
    stroke-width: 3.5;
    fill: none;
  }

  .residual-line {
    stroke: var(--cosmos);
    stroke-width: 1.8;
    opacity: 0.5;
  }

  .annotation-line {
    stroke-width: 1.5;
  }

  .highlight-text {
    text-transform: uppercase;
    font-family: var(--font-mono);
    stroke-linejoin: round;
    paint-order: stroke fill;
    stroke-width: 4px;
    pointer-events: none;
    stroke: var(--squidink);
    font-size: 0.8rem;
    letter-spacing: 2px;
    fill: white;
  }

  .axis-label {
    font-weight: bold;
  }

  .axis-text {
    font-size: 0.8rem;
  }

  .grid-line {
    opacity: 0.075;
  }

  .axis-label {
    text-transform: uppercase;
    font-size: 0.9rem;
  }

  /* ipad */
  @media screen and (max-width: 950px) {
    .axis-label {
      font-size: 0.8rem;
    }
  }
  /* mobile */
  @media screen and (max-width: 750px) {
    .axis-label {
      font-size: 0.75rem;
    }
  }
</style>
