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
    bpbind,
    bpWeights,
    mobile,
  } from "../../store";
  import { fade, fly, draw } from "svelte/transition";
  import BackPropOutput from "./BackPropOutput.svelte";
  import { positionElements } from "../../utils";
  import NetworkRelu from "./NetworkRelu.svelte";

  const nodeBoost = 1.4;

  onMount(() => {
    // render elements after drawn to canvas
    visible = true;
  });

  $: maxNumNeurons = max($networkBp) + 1;

  let height = 100;
  let width = 100;
  // init to false so don't show drawing during rendering
  $: visible = false;

  $: nodeWidth = $mobile ? 42 : 72;
  $: nodeHeight = $mobile ? 26 : 36;
  $: wideNodeOffset = $mobile ? 12 : 0;

  $: xScale = scaleLinear()
    .domain([-1, $numLayersBp])
    .range([$marginScroll.left, width - $marginScroll.right]);
  $: yScale = scaleLinear()
    .domain([-1, maxNumNeurons])
    .range([height - $marginScroll.bottom, $marginScroll.top]);

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
                    dominant-baseline="middle">{index < 6 ? "w" : ""}</textPath
                  >
                </text>
              {/key}
              <!-- forward -->
              <g>
                <text
                  class="moving-text-bp"
                  opacity="1"
                  alignment-baseline="middle"
                  >⬤

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
                </text></g
              >

              <!-- backward -->
              <g>
                <text
                  class="moving-text-bp"
                  opacity="1"
                  alignment-baseline="middle"
                  >⬤

                  <!-- backward pass -->
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
                  <!-- end backward pass -->
                </text></g
              >
            {/each}
          {/if}
        {/each}
      {/each}
      <!-- here is some bs text to add to this -->

      <!-- nodes -->
      {#each Array($numLayersBp).fill(null) as index, layer}
        {#each positionElements($networkBp[layer], maxNumNeurons) as yPosition}
          {@const hLayer = layer < $numLayersBp - 1 && layer > 0}
          <g
            class="nn-g"
            transform={hLayer
              ? `translate(${xScale(layer) - nodeWidth / 2} ${
                  yScale(yPosition) - (nodeHeight * nodeBoost) / 2
                })`
              : `translate(${xScale(layer) - nodeWidth / 2} ${
                  yScale(yPosition) - (nodeHeight * 1) / 2
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
                width={$labelsBp[layer].length < 6
                  ? nodeWidth
                  : nodeWidth + wideNodeOffset}
                height={hLayer ? nodeHeight * nodeBoost : nodeHeight}
              />
              {#if hLayer}
                <NetworkRelu data={$labelsBp[layer]} />
              {/if}
              <text
                in:fly|local={{ x: -50, duration: 500 }}
                out:fade|local={{ duration: 300 }}
                class="nn-text"
                text-anchor="middle"
                alignment-baseline="middle"
                dx={$labelsBp[layer].length < 6
                  ? nodeWidth / 2
                  : (nodeWidth + wideNodeOffset) / 2}
                dy={hLayer ? nodeHeight * nodeBoost - 8 : nodeHeight / 2}
                >{$labelsBp[layer]}
                {#if layer === 0}
                  <tspan class="subscript" dy="4"
                    >{Math.abs(yPosition - 2.5)}</tspan
                  >
                {/if}
              </text>
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
          <BackPropOutput {width} {height} />
        </g>
      {/each}
      <!-- cover up text in non chrome browsers -->
      <rect fill="var(--darksquidink)" x="0" y="0" width="15" height="15" />
    {/if}
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
  .moving-text-bp {
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
    stroke-width: 4px;
    stroke: var(--bg);
    letter-spacing: 1px;
  }
  .nn-g {
    transition: all 0.45s;
  }
  .nn-edgebp {
    stroke: var(--stone);
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
    stroke: var(--squidink);
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
    .nn-text {
      font-size: 10px;
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
