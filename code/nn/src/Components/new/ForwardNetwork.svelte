<script>
  import { onMount } from "svelte";
  import { scaleLinear } from "d3-scale";
  import { max } from "d3-array";
  import {
    drawActivation,
    labels,
    marginScroll,
    network,
    numLayers,
    showLayerLine,
    showSubScript,
  } from "../../store";
  import { line } from "d3-shape";
  import { fade, fly, draw } from "svelte/transition";

  onMount(() => {
    // render elements after drawn to canvas
    visible = true;
  });

  // these don't matter, but make the stretching less obvious at load
  //   export let network = [2, 5, 2];
  //   $: numLayers = $numLayers;
  $: maxNumNeurons = max($network) + 1;

  let height;
  let width;
  // init to false so don't show drawing during rendering
  $: visible = false;

  let nodeWidth = 50;
  let nodeHeight = 30;

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
    .domain([-1, $numLayers])
    .range([$marginScroll.left, width - $marginScroll.right]);
  $: yScale = scaleLinear()
    .domain([-1, maxNumNeurons])
    .range([height - $marginScroll.bottom, $marginScroll.top]);

  function setLayer(layer) {
    layer == 0 ? "input" : layer == $numLayers - 1 ? "output" : "hidden";
  }

  // {#each Array($numLayers).fill(null) as index, layer}
  // {#each positionElements($network[layer], maxNumNeurons) as yPosition}

  $: pathData = [];

  $: {
    console.log("yessir", $numLayers);
    for (const layer of Array($numLayers).fill(null).entries()) {
      // store data in pathData object
      console.log("layer", layer);
      let neuron = { layer: layer, num: $numLayers };
      pathData.push(neuron);
      console.log("update?");
    }
    console.log("pd", pathData);
  }

  $: layersArray = [];
  $: {
    for (let i = 0; i < $numLayers; i++) {
      const layer = i;
      for (let yPosition of positionElements($network[layer], maxNumNeurons)) {
        for (let prevYPosition of positionElements(
          $network[layer - 1],
          maxNumNeurons
        )) {
          layersArray.push({ layer, yPosition, prevYPosition });
        }
      }
    }
  }

  // $: {
  //   for (const [index, layer] of Array($numLayers).fill(null).entries()) {
  //     for (const yPosition of positionElements(
  //       $network[layer],
  //       maxNumNeurons
  //     )) {
  //       // store data in pathData object
  //       let neuron = { layer: layer, yPosition: yPosition, num: $numLayers };
  //       pathData = [...pathData, neuron];
  //       console.log("update?");
  //     }
  //   }
  // }

  $: console.log("update", layersArray, $numLayers);

  // d3 line stuff
  $: pathLine = line()
    .x((d) => xScale(d))
    .y((d) => yScale(d));
</script>

<div id="network-chart" bind:offsetWidth={width} bind:offsetHeight={height}>
  <svg {width} height={height + $marginScroll.top + $marginScroll.bottom}>
    {#if visible}
      <!-- edges -->
      {#each Array($numLayers).fill(null) as i, layer}
        {#each positionElements($network[layer], maxNumNeurons) as yPosition}
          {#if layer > 0}
            {#each positionElements($network[layer - 1], maxNumNeurons) as prevYPosition}
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
      {#each Array($numLayers).fill(null) as index, layer}
        {#each positionElements($network[layer], maxNumNeurons) as yPosition}
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
                : layer == $numLayers - 1
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
                : layer == $numLayers - 1
                ? $labels[2]
                : $labels[1]}
              {#if layer === 0 && $showSubScript}
                <tspan class="subscript" dy="4"
                  >{Math.abs(yPosition - 2.5)}</tspan
                >
              {/if}</text
            >
          </g>
        {/each}
      {/each}

      <!--  <g>
          <rect
            in:fly|local={{ x: -50, duration: 500 }}
            out:fade|local={{ duration: 500 }}
            class="nn-node {layer == 0
              ? 'input'
              : layer == $numLayers - 1
              ? 'output'
              : 'hidden'}"
            width={nodeWidth}
            height={nodeHeight}
            x={xScale(layer) - nodeWidth / 2}
            y={yScale(yPosition) - nodeHeight / 2}
          />
          <text
            in:fly|local={{ x: -50, duration: 500 }}
            out:fade|local={{ duration: 500 }}
            class="nn-text"
            x={xScale(layer)}
            y={yScale(yPosition)}
            text-anchor="middle"
            alignment-baseline="middle"
            >{layer == 0
              ? $labels[0]
              : layer == $numLayers - 1
              ? $labels[2]
              : $labels[1]}
            {#if layer === 0 && $showSubScript}
              <tspan class="subscript" dy="4">{Math.abs(yPosition - 2.5)}</tspan>
            {/if}</text
          >
          </g> -->
      <!-- layer labels -->
      {#if $showLayerLine}
        {#each [0, 1, $numLayers - 1] as layer, index}
          <text
            in:fly={{ x: -50, duration: 500 }}
            out:fade={{ duration: 200 }}
            class="nn-text"
            x={xScale(layer) - nodeWidth / 2}
            y={yScale(maxNumNeurons - 1) - nodeHeight / 2}
            text-anchor="start"
            alignment-baseline="middle"
            >{layer == 0
              ? "input layer"
              : layer == $numLayers - 1
              ? "output layer"
              : "hidden layers"}
          </text>
          {#if layer === 1}
            <line
              in:draw={{ duration: 1000 }}
              out:draw={{ duration: 400 }}
              x1={xScale(layer) - nodeWidth / 2}
              y1={yScale(maxNumNeurons - 1) - nodeHeight / 2 + 7}
              x2={xScale($numLayers - 1) - nodeWidth / 2 - 15}
              y2={yScale(maxNumNeurons - 1) - nodeHeight / 2 + 7}
              class="layer-underline hidden"
            />
          {:else}
            <line
              in:draw|local={{ duration: 1000 }}
              out:draw|local={{ duration: 400 }}
              x1={xScale(layer) - nodeWidth / 2}
              y1={yScale(maxNumNeurons - 1) - nodeHeight / 2 + 7}
              x2={xScale(layer + 1) - nodeWidth / 2 - 15}
              y2={yScale(maxNumNeurons - 1) - nodeHeight / 2 + 7}
              class="layer-underline {layer == 0
                ? 'input'
                : layer == $numLayers - 1
                ? 'output'
                : 'hidden'}"
            />
          {/if}
        {/each}
      {/if}

      {#if $drawActivation}
        <rect
          in:draw={{ duration: 1000 }}
          out:draw={{ duration: 400 }}
          class="activation-rect"
          width={nodeWidth * 1.5}
          height={nodeHeight * 2}
          x={xScale(1) - (nodeWidth * 1.5) / 2}
          y={yScale(2) - nodeHeight / 8}
        />
        <text
          in:fly|local={{ duration: 500 }}
          out:fade|local={{ duration: 200 }}
          class="nn-text"
          x={xScale(1) - (nodeWidth * 1.5) / 2}
          y={yScale(2) - 20}
          text-anchor="start"
          alignment-baseline="middle">Artifical Neuron</text
        >
      {/if}
    {/if}

    <!-- get path of entire network -->
  </svg>
</div>

<style>
  svg {
    border: 4px solid var(--stone);
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
    opacity: 0.95;
    animation: dash 18s infinite linear;
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
  #network-chart {
    width: 100%;
    max-height: 100%;
    height: 100%;
    background: conic-gradient(
        from 90deg at 1px 1px,
        #0000 90deg,
        rgba(0, 0, 0, 0.05) 0
      )
      0 0/20px 20px;
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
