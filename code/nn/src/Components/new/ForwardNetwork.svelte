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
    stepIndex,
  } from "../../store";
  import { line } from "d3-shape";
  import { fade, fly, draw } from "svelte/transition";
  import { drawPath } from "../../animations";
  import OutputNeuron from "./OutputNeuron.svelte";
  import { positionElements } from "../../utils";
  import { logistic, perceptron } from "../../outputModelWeights";

  onMount(() => {
    // render elements after drawn to canvas
    visible = true;
  });

  // these don't matter, but make the stretching less obvious at load
  //   export let network = [2, 5, 2];
  //   $: numLayers = $numLayers;
  $: maxNumNeurons = max($network) + 1;

  $: console.log("index", $stepIndex);

  let height;
  let width;
  // init to false so don't show drawing during rendering
  $: visible = false;

  let nodeWidth = 12 * 1.33 * 4;
  let nodeHeight = 12 * 2;

  $: xScale = scaleLinear()
    .domain([-1, $numLayers])
    .range([$marginScroll.left, width - $marginScroll.right]);
  $: yScale = scaleLinear()
    .domain([-1, maxNumNeurons])
    .range([height - $marginScroll.bottom, $marginScroll.top]);

  $: pathLine = line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y))
    .curve();

  let activationOffset = 50;

  let animationBegin = false;
  $: layerValue = 4;

  $: nnWeights = [
    [1, 0.2, 1, 1, 1], // layer 1
    [1, 0.2, 1, 1, 1], // layer 1
    [0.4, 1, 1, 1, 1], // layer 1
    [1, 1, 1, 1, 1], // layer 1
    [1, 1, 1, 1, 1], // layer 1
    [1, 1, 1, 1, 1], // layer 1
    [1, 1, 1, 1, 1], // layer 1
  ];

  let input1 = 2;
  let input2 = 4;
  let inputs = [2, 4];
  let weights = [10, 10];
  inputs.reverse();

  // define model
  let currentModel = perceptron;

  function updateNeuron(layer, yPosition) {
    // return `${layer}\n${yPosition}`;
    if (layer === 1) {
      return inputs[yPosition];
    }
    if (layer === 2) {
      let weightedSum = 0;
      for (let i = 0; i < inputs.length; i++) {
        const product = inputs[i] * weights[i];
        weightedSum += product;
      }
      return weightedSum;
    }
    if (layer === 3) {
      return currentModel(inputs[0], inputs[1]);
    }
    return nnWeights[layer][yPosition];
    // if layer == 1

    // if .layer == 2
    // ...
    // layer is
  }
</script>

<div id="network-chart" bind:offsetWidth={width} bind:offsetHeight={height}>
  <svg {width} height={height + $marginScroll.top + $marginScroll.bottom}>
    {#if visible}
      <!-- edges -->
      {#each Array($numLayers).fill(null) as i, layer}
        {#each positionElements($network[layer], maxNumNeurons) as yPosition}
          {#if layer > 0}
            {#each positionElements($network[layer - 1], maxNumNeurons) as prevYPosition, j}
              {console.log("layer", layer, "i", i, "yPosition", yPosition)}
              <path
                in:draw|local={{ duration: 500 }}
                out:draw|local={{ duration: 400 }}
                d={`
                    M ${xScale(layer - 1)} ${yScale(prevYPosition)}
                    L ${xScale(layer)} ${yScale(yPosition)}
                  `}
                class="nn-edge"
              />
              <g>
                <!-- {#if animationBegin} -->
                <circle class="moving-circle" />
                <text class="moving-text" alignment-baseline="middle"
                  >{updateNeuron(layer, j)}</text
                >
                <!-- {/if} -->
                <animateMotion
                  begin="{layer}s"
                  dur="1s"
                  repeatCount="indefinite"
                  path={`
                      M ${xScale(layer - 1)} ${yScale(prevYPosition)}
                      L ${xScale(layer)} ${yScale(yPosition)}
                    `}
                  onbegin="document.querySelector('circle').setAttribute('fill', 'black');"
                />
              </g>
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
            {#if layer !== $numLayers - 1}
              <!-- {@const nodWidth =
                $labels[layer].length == 1 ? 24 : $labels[layer].length * 11} -->
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
                >{$labels[layer]}
                {#if layer === 0 && $showSubScript}
                  <tspan class="subscript" dy="4"
                    >{Math.abs(yPosition - 2.5)}</tspan
                  >
                {/if}</text
              >
            {/if}
            {#if $drawActivation && [1, $numLayers - 2].includes(layer)}
              <rect
                in:draw={{ duration: 1000 }}
                out:draw={{ duration: 300 }}
                class="activation-rect"
                width={nodeWidth + activationOffset}
                height={nodeHeight + activationOffset}
                x={-activationOffset / 2}
                y={-activationOffset / 2}
              />
              <text
                in:fly|local={{ duration: 500 }}
                out:fade|local={{ duration: 200 }}
                class="nn-text"
                text-anchor="start"
                alignment-baseline="middle"
                x={-activationOffset / 2}
                y={activationOffset + nodeHeight / 2 + 12}
                >Artifical Neuron</text
              >
            {/if}
          </g>
        {/each}
      {/each}

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

      <!-- manually draw final layer here, so it updates smoothly -->
      {#each positionElements($network[$numLayers - 1], maxNumNeurons) as yPosition}
        <g
          class="nn-g"
          transform={`translate(${
            xScale($numLayers - 1) - nodeWidth / 2
          } ${yScale(yPosition)})`}
        >
          <OutputNeuron {width} {height} />
        </g>
      {/each}
    {/if}

    <!-- animate line -->

    <!-- get path of entire network -->
  </svg>
</div>

<style>
  .moving-text {
    font-size: 10px;
    /* font-weight: bold; */
    color: black;
    text-anchor: middle;
    paint-order: stroke fill;
    stroke: white;
    stroke-width: 4;
    text-anchor: middle;
    font-family: var(--font-mono);
  }
  .moving-circle {
    stroke: var(--squidink);
    stroke-width: 2;
    fill: var(--paper);
    r: 10;
  }
  .pp {
    stroke: black;
    stroke-width: 3;
    fill: none;
    /* opacity: 0; */
  }
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
    font-size: 8px;
    transition: all 0.45s;
  }
  .nn-text {
    font-size: 12px;
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
    animation: dash 30s infinite linear;
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
    fill-opacity: 0.95;
    transition: all 0.45s;
  }
  .activation-rect {
    stroke: var(--squidink);
    stroke-width: 5;
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
