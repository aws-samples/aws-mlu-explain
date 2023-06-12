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
    stepIndex,
    mobile,
    hideWeights,
  } from "../../store";
  import { fade, fly, draw } from "svelte/transition";
  import OutputNeuron from "./OutputNeuron.svelte";
  import { positionElements } from "../../utils";
  import NetworkRelu from "./NetworkRelu.svelte";

  onMount(() => {
    // render elements after drawn to canvas
    visible = true;
  });

  $: maxNumNeurons = max($network) + 1;

  let height = 500;
  let width = 500;
  // init to false so don't show drawing during rendering
  $: visible = false;

  $: nodeWidth = $mobile ? 42 : 72;
  $: nodeHeight = $mobile ? 26 : 36;
  $: wideNodeOffset = $mobile ? 12 : 0;

  $: xScale = scaleLinear()
    .domain([-1, $numLayers])
    .range([$marginScroll.left, width - $marginScroll.right]);

  $: yScale = scaleLinear()
    .domain([-1, maxNumNeurons])
    .range([height - $marginScroll.bottom, $marginScroll.top]);

  let activationOffset = 50;

  function getIndex(layer, prev, curr, networkInteractive) {
    let index = 0;
    for (let k = 0; k < layer - 1; k++) {
      index += networkInteractive[k] * networkInteractive[k + 1];
    }
    index += prev * networkInteractive[layer] + curr;
    return index;
  }

  const nodeBoost = 1.4;
</script>

<div id="network-chart" bind:offsetWidth={width} bind:offsetHeight={height}>
  <svg {width} height={height + $marginScroll.top + $marginScroll.bottom}>
    {#if visible}
      <!-- edges -->
      {#each Array($numLayers).fill(null) as i, layer}
        {#each positionElements($network[layer], maxNumNeurons) as yPosition, y}
          {#if layer > 0}
            {#each positionElements($network[layer - 1], maxNumNeurons) as prevYPosition, j}
              {@const index = getIndex(layer, j, y, $network)}

              <path
                in:draw|local={{ duration: 500 }}
                out:draw|local={{ duration: 400 }}
                d={`
                    M ${xScale(layer - 1)} ${yScale(prevYPosition)}
                    L ${xScale(layer)} ${yScale(yPosition)}
                  `}
                class="nn-edge"
                id={`nn-edge-${layer}-${yPosition}-${prevYPosition}-${$stepIndex}`}
              />
              <!-- weights -->
              {#if $stepIndex >= 1}
                {#key $stepIndex}
                  <text
                    in:fly|local={{ x: 0, duration: 300 }}
                    out:fade|local={{ duration: 300 }}
                    dx={0 * xScale(1)}
                    dy="0"
                    class="weight-text"
                  >
                    <textPath
                      href={`#nn-edge-${layer}-${yPosition}-${prevYPosition}-${$stepIndex}`}
                      startOffset="50%"
                      text-anchor="middle"
                      fill="#232F3E"
                      dominant-baseline="middle"
                      >{index < $hideWeights ? "w" : ""}</textPath
                    >
                  </text>
                {/key}
              {/if}
              <g>
                <text
                  class="moving-text-forward"
                  opacity="1"
                  alignment-baseline="middle"
                  >⬤
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
                </text></g
              >
            {/each}
          {/if}
        {/each}
      {/each}
      <!-- here is some bs text to add to this -->

      <!-- nodes -->
      {#each Array($numLayers).fill(null) as index, layer}
        {#each positionElements($network[layer], maxNumNeurons) as yPosition, j}
          {@const hLayer = layer < $numLayers - 1 && layer > 0}
          <g
            class="nn-g"
            transform={hLayer && $stepIndex > 0
              ? `translate(${xScale(layer) - nodeWidth / 2} ${
                  yScale(yPosition) - (nodeHeight * nodeBoost) / 2
                })`
              : `translate(${xScale(layer) - nodeWidth / 2} ${
                  yScale(yPosition) - (nodeHeight * 1) / 2
                })`}
          >
            {#if layer !== $numLayers - 1}
              <rect
                in:fly|local={{ x: -50, duration: 500 }}
                out:fade|local={{ duration: 300 }}
                class="nn-node {layer == 0
                  ? 'input'
                  : layer == $numLayers - 1
                  ? 'output'
                  : 'hidden'}"
                width={$labels[layer].length < 6
                  ? nodeWidth
                  : nodeWidth + wideNodeOffset}
                height={hLayer && $stepIndex > 0
                  ? nodeHeight * nodeBoost
                  : nodeHeight}
              />
              {#if hLayer && $stepIndex > 0}
                <NetworkRelu data={$labels[layer]} />
              {/if}
              <text
                in:fly|local={{ x: -50, duration: 500 }}
                out:fade|local={{ duration: 300 }}
                class="nn-text"
                text-anchor="middle"
                alignment-baseline="middle"
                dx={$labels[layer].length < 6
                  ? nodeWidth / 2
                  : (nodeWidth + wideNodeOffset) / 2}
                dy={hLayer && $stepIndex > 0
                  ? nodeHeight * nodeBoost - 8
                  : nodeHeight / 2}
                >{$labels[layer]}
                {#if layer === 0}
                  <tspan class="subscript" dy="4">{j === 0 ? 2 : 1}</tspan>
                {/if}</text
              >
            {/if}
            {#if $drawActivation && [1, $numLayers - 2].includes(layer)}
              <rect
                in:draw={{ duration: 1000 }}
                out:draw={{ duration: 300 }}
                class="activation-rect"
                width={nodeWidth + activationOffset}
                height={nodeHeight * nodeBoost + activationOffset}
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
                y={activationOffset + (nodeHeight * nodeBoost) / 2 + 12}
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
    <rect fill="#e5f7ff" x="0" y="0" width="15" height="15" />
    <!-- get path of entire network -->
    <text class="nn-text-bottom" x="2" y={height - 10}
      >*For simplicity, bias terms are not shown.</text
    >
  </svg>
</div>

<style>
  .weight-text {
    font-size: 10px;
    color: var(--darksquidink);
    stroke: var(--white);
    stroke-width: 3;
    paint-order: stroke fill;
    font-family: var(--font-main);
  }
  .moving-text-forward {
    font-size: 12px;
    color: red;
    text-anchor: middle;
    paint-order: stroke fill;
    stroke: var(--squidink);
    stroke-width: 4;
    text-anchor: middle;
    font-family: var(--font-mono);
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
    stroke-linejoin: round;
    paint-order: stroke fill;
    stroke-width: 4px;
    stroke: var(--white);
    letter-spacing: 1px;
  }

  .nn-text-bottom {
    font-size: 10px;
    transition: all 0.45s;
    stroke-linejoin: round;
    paint-order: stroke fill;
    stroke-width: 4px;
    stroke: var(--white);
    letter-spacing: 1px;
  }
  .nn-g {
    transition: all 0.45s;
  }
  .nn-edge {
    stroke: var(--squidink);
    stroke-width: 1.5;
    opacity: 0.95;
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
    .nn-text {
      font-size: 10px;
      transition: all 0.45s;
      stroke-linejoin: round;
      paint-order: stroke fill;
      stroke-width: 4px;
      stroke: var(--bg);
      letter-spacing: 1px;
    }
    .nn-text-bottom {
      font-size: 7px;
      transition: all 0.45s;
      stroke-linejoin: round;
      paint-order: stroke fill;
      stroke-width: 4px;
      stroke: var(--bg);
      letter-spacing: 1px;
    }
  }
  /* mobile */
  @media screen and (max-width: 750px) {
  }
</style>
