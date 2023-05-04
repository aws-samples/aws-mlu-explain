<script>
  import { onMount } from "svelte";
  import { scaleLinear } from "d3-scale";
  import { max } from "d3-array";
  import {
    labelsBp,
    marginScroll,
    networkBp,
    numLayersBp,
    showSubScript,
    stepIndexBp,
    bpStage,
    bpbind,
    bpPlayAnimation,
    bpWeights,
  } from "../../store";
  import { fade, fly, draw } from "svelte/transition";
  import BackPropOutput from "./BackPropOutput.svelte";
  import { positionElements } from "../../utils";
  import { logistic, perceptron } from "../../outputModelWeights";

  onMount(() => {
    // render elements after drawn to canvas
    visible = true;
  });

  $: maxNumNeurons = max($networkBp) + 1;

  let height = 100;
  let width = 100;
  // init to false so don't show drawing during rendering
  $: visible = false;

  let nodeWidth = 12 * 1.33 * 4.5;
  let nodeHeight = 12 * 3;

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
  }

  function getIndex(layer, prev, curr, networkInteractive) {
    let index = 0;
    for (let k = 0; k < layer - 1; k++) {
      index += networkInteractive[k] * networkInteractive[k + 1];
    }
    index += prev * networkInteractive[layer] + curr;
    return index;
  }
</script>

<div
  bind:this={$bpbind}
  id="networkBp-chart"
  bind:offsetWidth={width}
  bind:offsetHeight={height}
>
  <svg {width} height={height + $marginScroll.top + $marginScroll.bottom}>
    {#if visible}
      <!-- edges -->
      {#each Array($numLayersBp).fill(null) as layer, i}
        {#each positionElements($networkBp[i], maxNumNeurons) as yPosition, y}
          {#if i > 0}
            {#each positionElements($networkBp[i - 1], maxNumNeurons) as prevYPosition, j}
              {@const index = getIndex(i, j, y, $networkBp)}
              <path
                in:draw|local={{ duration: 500 }}
                out:draw|local={{ duration: 400 }}
                d={`
                    M ${xScale(i - 1)} ${yScale(prevYPosition)}
                    L ${xScale(i)} ${yScale(yPosition)}
                  `}
                class="nn-edgebp"
                id={`nn-edgebp-${i}-${yPosition}-${prevYPosition}-${$stepIndexBp}`}
                stroke-width={$bpWeights[index]}
              />
              <!-- weights -->
              <!-- {#if $stepIndexBp >= 1} -->
              {#key $stepIndexBp}
                <text
                  in:fly|local={{ x: 0, duration: 300 }}
                  out:fade|local={{ duration: 300 }}
                  dx={0 * xScale(1)}
                  dy="0"
                  class="weight-text"
                >
                  <textPath
                    href={`#nn-edgebp-${i}-${yPosition}-${prevYPosition}-${$stepIndexBp}`}
                    startOffset="50%"
                    text-anchor="middle"
                    fill="#232F3E"
                    dominant-baseline="middle">w</textPath
                  >
                </text>
              {/key}
              <!-- {/if} -->
              <!-- forward -->
              <g>
                <!-- {#if animationBegin} -->
                <circle class="moving-circlebp" opacity="0">
                  <set
                    attributeName="opacity"
                    to="1"
                    begin={`animatePathForwardBp${i}.begin`}
                  />
                  <set
                    attributeName="opacity"
                    to="0"
                    begin={`animatePathForwardBp${i}.end`}
                  />
                </circle>
                <!-- {#if $stepIndexBp >= 1}
                  <text
                    class="moving-textbp"
                    opacity="0"
                    alignment-baseline="middle"
                    >{updateNeuron(i, j)}
                    <set attributeName="opacity" to="1" begin="{i}s" />
                    <set attributeName="opacity" to="0" begin="{0}s" /></text
                  >
                {/if} -->

                <!-- forward pass -->
                <!-- `animateMotion#animatePathForwardBp0` -->
                <!-- {#if $bpStage == 0} -->
                <animateMotion
                  id={`animatePathForwardBp${i}`}
                  begin={i === 1 ? `0` : `animatePathForwardBp${i - 1}.end`}
                  dur=".5s"
                  restart="whenNotActive"
                  path={`
                      M ${xScale(i - 1)} ${yScale(prevYPosition)}
                      L ${xScale(i)} ${yScale(yPosition)}
                    `}
                />
                <!-- {/if} -->
                <!-- end forward pass -->
              </g>

              <!-- backward -->
              <!-- {#if $stepIndexBp == 2} -->
              <g>
                <!-- {#if animationBegin} -->
                <circle class="moving-circlebp" opacity="0">
                  <set
                    attributeName="opacity"
                    to="1"
                    begin={`animatePathBackward${i}.begin`}
                  />
                  <set
                    attributeName="opacity"
                    to="0"
                    begin={`animatePathBackward${i}.end`}
                  />
                </circle>

                <!-- backward pass -->
                <!-- {#if $bpStage == 2} -->
                <animateMotion
                  id={`animatePathBackward${i}`}
                  begin={`animatePathBackward${i + 1}.end`}
                  dur=".5s"
                  restart="whenNotActive"
                  path={`
                         M ${xScale(i)} ${yScale(yPosition)}
                         L ${xScale(i - 1)} ${yScale(prevYPosition)}
                       `}
                />
                <!-- {/if} -->
                <!-- end backward pass -->
              </g>
              <!-- {/if} -->
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
                >{$labelsBp[layer]}
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
      {#each positionElements($networkBp[$numLayersBp - 1], maxNumNeurons) as yPosition}
        <g
          class="nn-g"
          transform={`translate(${
            xScale($numLayersBp - 1) - nodeWidth / 2
          } ${yScale(yPosition)})`}
        >
          {("e", console.log(xScale($numLayersBp - 1) - nodeWidth / 2))}
          <BackPropOutput {width} {height} />
        </g>
      {/each}
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

  svg {
    border: 4px solid var(--stone);
    border-radius: 5;
    transition: all 0.45s;
  }

  .subscript {
    font-size: 8px;
    transition: all 0.45s;
  }
  .nn-text {
    font-size: 12px;
    transition: all 0.45s;
    stroke-linejoin: round;
    paint-order: stroke fill;
    stroke-width: 2px;
    stroke: var(--bg);
    letter-spacing: 1px;
  }
  .nn-g {
    transition: all 0.45s;
  }
  .nn-edgebp {
    stroke: var(--stone);
    /* stroke-width: 1.5; */
    /* stroke-dasharray: 5; */
    opacity: 0.95;
    /* animation: dash 30s infinite linear; */
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

  #networkBp-chart {
    width: 100%;
    max-height: 100%;
    max-height: var(--max-viz-height);
    height: 100%;
    background: conic-gradient(
        from 90deg at 1px 1px,
        var(--darksquidink) 90deg,
        #f1f3f31b 0
      )
      0 0/20px 20px;
  }

  /* ipad */
  @media screen and (max-width: 950px) {
  }
  /* mobile */
  @media screen and (max-width: 750px) {
  }
</style>
