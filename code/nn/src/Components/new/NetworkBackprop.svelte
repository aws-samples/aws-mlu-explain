<script>
  import { onMount } from "svelte";
  import { scaleLinear } from "d3-scale";
  import { max } from "d3-array";
  import {
    labels,
    marginScroll,
    networkBp,
    numLayersBp,
    showSubScript,
    stepIndexBp,
    bpStage,
  } from "../../store";
  import { line } from "d3-shape";
  import { fade, fly, draw } from "svelte/transition";
  import OutputNeuron from "./OutputNeuron.svelte";
  import { positionElements } from "../../utils";
  import { logistic, perceptron } from "../../outputModelWeights";

  onMount(() => {
    // render elements after drawn to canvas
    visible = true;
  });

  // these don't matter, but make the stretching less obvious at load
  //   export let networkBp = [2, 5, 2];
  //   $: numLayersBp = $numLayersBp;
  $: maxNumNeurons = max($networkBp) + 1;

  $: console.log("tony5 ");

  let height = 100;
  let width = 100;
  // init to false so don't show drawing during rendering
  $: visible = false;

  let nodeWidth = 12 * 1.33 * 4;
  let nodeHeight = 12 * 2;

  $: xScale = scaleLinear()
    .domain([-1, $numLayersBp])
    .range([$marginScroll.left, width - $marginScroll.right]);
  $: yScale = scaleLinear()
    .domain([-1, maxNumNeurons])
    .range([height - $marginScroll.bottom, $marginScroll.top]);

  $: nnWeights = [
    [1, 0.2, 1, 1, 1], // layer 1
    [1, 0.2, 1, 1, 1], // layer 1
    [0.4, 1, 1, 1, 1], // layer 1
    [1, 1, 1, 1, 1], // layer 1
    [1, 1, 1, 1, 1], // layer 1
    [1, 1, 1, 1, 1], // layer 1
    [1, 1, 1, 1, 1], // layer 1
  ];

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

<div id="networkBp-chart" bind:offsetWidth={width} bind:offsetHeight={height}>
  <svg {width} height={height + $marginScroll.top + $marginScroll.bottom}>
    {#if visible}
      <!-- edges -->
      {#each Array($numLayersBp).fill(null) as i, layer}
        {#each positionElements($networkBp[layer], maxNumNeurons) as yPosition}
          {#if layer > 0}
            {#each positionElements($networkBp[layer - 1], maxNumNeurons) as prevYPosition, j}
              <path
                in:draw|local={{ duration: 500 }}
                out:draw|local={{ duration: 400 }}
                d={`
                    M ${xScale(layer - 1)} ${yScale(prevYPosition)}
                    L ${xScale(layer)} ${yScale(yPosition)}
                  `}
                class="nn-edgebp"
                id={`nn-edgebp-${layer}-${yPosition}-${prevYPosition}-${$stepIndexBp}`}
              />
              <!-- weights -->
              {#if $stepIndexBp >= 1}
                {#key $stepIndexBp}
                  <text
                    in:fly|local={{ x: 0, duration: 300 }}
                    out:fade|local={{ duration: 300 }}
                    dx={0 * xScale(1)}
                    dy="0"
                    class="weight-text"
                  >
                    <textPath
                      href={`#nn-edgebp-${layer}-${yPosition}-${prevYPosition}-${$stepIndexBp}`}
                      startOffset="50%"
                      text-anchor="middle"
                      fill="#232F3E"
                      dominant-baseline="middle">w</textPath
                    >
                  </text>
                {/key}
              {/if}
              <g>
                <!-- {#if animationBegin} -->
                <circle class="moving-circlebp" opacity="0">
                  <set attributeName="opacity" to="1" begin="{layer}s" />
                  <set attributeName="opacity" to="0" begin="{0}s" />
                </circle>
                {#if $stepIndexBp >= 1}
                  <text
                    class="moving-textbp"
                    opacity="0"
                    alignment-baseline="middle"
                    >{updateNeuron(layer, j)}
                    <set attributeName="opacity" to="1" begin="{layer}s" />
                    <set attributeName="opacity" to="0" begin="{0}s" /></text
                  >
                {/if}
                <!-- {/if} -->
                <!-- backward pass -->
                {#if $bpStage == 1}
                  <animateMotion
                    id={`animatePathForward${layer}`}
                    begin="{layer}s"
                    dur="1s"
                    repeatCount="indefinite"
                    path={`
                      M ${xScale(layer)} ${yScale(yPosition)}
                      L ${xScale(layer - 1)} ${yScale(prevYPosition)}
                    `}
                  />
                {/if}
                <!-- end backward pass -->
                <!-- forward pass -->
                {#if $bpStage == 0}
                  <animateMotion
                    id={`animatePathForward${layer}`}
                    begin="{layer}s"
                    dur="1s"
                    repeatCount="indefinite"
                    path={`
                      M ${xScale(layer - 1)} ${yScale(prevYPosition)}
                      L ${xScale(layer)} ${yScale(yPosition)}
                    `}
                  />
                {/if}
                <!-- end forward pass -->
              </g>
            {/each}
          {/if}
        {/each}
      {/each}
      <!-- here is some bs text to add to this -->

      <!-- nodes -->
      {#each Array($numLayersBp).fill(null) as index, layer}
        {#each positionElements($networkBp[layer], maxNumNeurons) as yPosition}
          <g
            class="nn-g"
            transform={`translate(${xScale(layer) - nodeWidth / 2} ${
              yScale(yPosition) - nodeHeight / 2
            })`}
          >
            {#if layer !== $numLayersBp - 1}
              <!-- {@const nodWidth =
                $labels[layer].length == 1 ? 24 : $labels[layer].length * 11} -->
              <rect
                in:fly|local={{ x: -50, duration: 500 }}
                out:fade|local={{ duration: 300 }}
                class="nn-node {layer == 0
                  ? 'input'
                  : layer == $numLayersBp - 1
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
          </g>
        {/each}
      {/each}

      <!-- manually draw final layer here, so it updates smoothly -->
      <!-- {#each positionElements($networkBp[$numLayersBp - 1], maxNumNeurons) as yPosition}
        <g
          class="nn-g"
          transform={`translate(${
            xScale($numLayersBp - 1) - nodeWidth / 2
          } ${yScale(yPosition)})`}
        > -->
      <!-- <OutputNeuron {width} {height} /> -->
      <!-- </g>
      {/each} -->
    {/if}

    <!-- animate line -->

    <!-- get path of entire networkBp -->
  </svg>
</div>

<style>
  .weight-text {
    font-size: 10px;
    color: black;
    stroke: white;
    stroke-width: 2;
    paint-order: stroke fill;
    font-family: var(--font-main);
  }
  .moving-textbp {
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
  .moving-circlebp {
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
  .nn-edgebp {
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
  #networkBp-chart {
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
