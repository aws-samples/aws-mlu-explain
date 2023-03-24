<script>
  import { onMount } from "svelte";
  import { scaleLinear } from "d3-scale";
  import { max } from "d3-array";
  import {
    networkInteractive,
    numLayersInteractive,
    playAnimation,
    animationDuration,
    ggg,
    points,
  } from "../../store";
  import { fade, fly, draw } from "svelte/transition";

  function positionElements(numElements, maxNumNeurons) {
    const interval = (maxNumNeurons - 1 - numElements + 1) / 2;

    // Create an array of positions for each element
    const positions = [];
    for (let i = 0; i < numElements; i++) {
      positions.push(interval + i);
    }
    return positions;
  }

  const marginScroll = {
    top: 3,
    bottom: 3,
    left: 0,
    right: 0,
  };

  const labels = ["input", "function", "function", "output"];

  let docEl;
  onMount(() => {
    // render elements after drawn to canvas
    visible = true;
    docEl = document;
  });

  // these don't matter, but make the stretching less obvious at load
  $: maxNumNeurons = max($networkInteractive) - 1;

  let height;
  let width;
  // init to false so don't show drawing during rendering
  $: visible = true;

  //   let nodeWidth = 76;
  //   let nodeHeight = 40;

  let nodeWidth = 12 * 1.33 * 4;
  let nodeHeight = 12 * 2;

  $: xScale = scaleLinear()
    .domain([-1, $numLayersInteractive])
    .range([marginScroll.left, width - marginScroll.right]);
  $: yScale = scaleLinear()
    .domain([-1, maxNumNeurons])
    .range([height - marginScroll.bottom, marginScroll.top]);
</script>

<div
  bind:this={$ggg}
  id="network-chart"
  bind:offsetWidth={width}
  bind:offsetHeight={height}
>
  <svg {width} height={height + marginScroll.top + marginScroll.bottom}>
    {#if visible}
      <!-- edges -->
      {#each Array($numLayersInteractive).fill(null) as i, layer}
        {#each positionElements($networkInteractive[layer], maxNumNeurons) as yPosition}
          {#if layer > 0}
            {#each positionElements($networkInteractive[layer - 1], maxNumNeurons) as prevYPosition, j}
              <path
                in:draw|local={{ duration: 500 }}
                out:draw|local={{ duration: 400 }}
                d={`
                        M ${xScale(layer - 1)} ${yScale(prevYPosition)}
                        L ${xScale(layer)} ${yScale(yPosition)}
                      `}
                class="nn-edge"
              />
              {#key $networkInteractive}
                <text
                  in:fly|local={{ x: 0, duration: 300 }}
                  out:fade|local={{ duration: 300 }}
                  dx={0 * xScale(1)}
                  dy="0"
                  class="weight-text"
                >
                  <textPath
                    href={`#nn-edgebp-${layer}-${yPosition}-${prevYPosition}-${$networkInteractive}`}
                    startOffset="50%"
                    text-anchor="middle"
                    fill="#232F3E"
                    dominant-baseline="middle">w</textPath
                  >
                </text>
              {/key}
              <!-- {#if $playAnimation} -->
              <!-- forward-pass -->
              {#each $points as p}
                <g transform={`translate(0, 0)`}>
                  <circle
                    opacity="0"
                    id={`circle${layer}${p}`}
                    class="moving-circle"
                  >
                    <set
                      attributeName="opacity"
                      to="1"
                      begin={`animatePath${layer}${p}.begin`}
                    />
                    <set
                      attributeName="opacity"
                      to="0"
                      begin={`animatePath${layer}${p}.end`}
                    />
                  </circle>
                  <text
                    opacity="0"
                    class="moving-text"
                    alignment-baseline="middle"
                    >{`layer`}
                    <set
                      attributeName="opacity"
                      to="1"
                      begin={`animatePath${layer}${p}.begin`}
                    />
                    <set
                      attributeName="opacity"
                      to="0"
                      begin={`animatePath${layer}${p}.end`}
                    />
                  </text>
                  <animateMotion
                    id={`animatePath${layer}${p}`}
                    dur={$animationDuration}
                    begin={layer === 1
                      ? `${0 + 0.1 * p}`
                      : `animatePath${layer - 1}${p}.end`}
                    restart="whenNotActive"
                    path={`
                          M ${xScale(layer - 1)} ${yScale(prevYPosition)}
                          L ${xScale(layer)} ${yScale(yPosition)}
                        `}
                  />
                </g>
              {/each}
              {#each $points as p}
                <g>
                  <circle
                    r="20"
                    opacity="0"
                    id={`circle${layer}${p}`}
                    class="moving-circle-back"
                  >
                    <set
                      attributeName="opacity"
                      to="1"
                      begin={`animatePathBack${layer}${p}.begin`}
                    />
                    <set
                      attributeName="opacity"
                      to="0"
                      begin={`animatePathBack${layer}${p}.end`}
                    />
                  </circle>
                  <text
                    opacity="0"
                    class="moving-text"
                    alignment-baseline="middle"
                    >{layer},{j}
                    <set
                      attributeName="opacity"
                      to="1"
                      begin={`animatePathBack${layer}${p}.begin`}
                    />
                    <set
                      attributeName="opacity"
                      to="0"
                      begin={`animatePathBack${layer}${p}.end`}
                    />
                  </text>
                  <animateMotion
                    id={`animatePathBack${layer}${p}`}
                    begin={layer === $numLayersInteractive - 1
                      ? `animatePath${$numLayersInteractive - 1}${p}.end`
                      : `animatePathBack${layer + 1}${p}.end`}
                    dur={$animationDuration}
                    restart="whenNotActive"
                    path={`
                            M ${xScale(layer)} ${yScale(yPosition)}
                            L ${xScale(layer - 1)} ${yScale(prevYPosition)}
                          `}
                  />
                </g>
              {/each}
              <!-- {/if} -->
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
            <!-- {#if layer !== $numLayersInteractive - 1} -->
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
              >{labels[layer]}
            </text>
            <!-- {/if} -->
          </g>
        {/each}
      {/each}

      <!-- manually draw final layer here, so it updates smoothly -->
      <!-- {#each positionElements($networkInteractive[$numLayersInteractive - 1], maxNumNeurons) as yPosition}
            <g
              class="nn-g"
              transform={`translate(${
                xScale($numLayersInteractive - 1) - nodeWidth / 2
              } ${yScale(yPosition)})`}
            >
              <OutputNeuron {width} {height} />
            </g>
          {/each} -->
    {/if}
  </svg>
</div>

<style>
  .moving-text {
    font-size: 21px;
    /* font-weight: bold; */
    color: black;
    text-anchor: middle;
    paint-order: stroke fill;
    stroke: white;
    stroke-width: 4;
    text-anchor: middle;
    font-family: Arial;
  }
  .moving-circle {
    stroke: black;
    stroke-width: 4;
    fill: rgba(138, 255, 80, 0.5);
    transition: r 1s;
    r: 25;
  }

  .moving-circle-back {
    stroke: black;
    stroke-width: 4;
    fill: rgba(255, 80, 83, 0.5);
    r: 25;
  }

  svg {
    border-radius: 5;
    transition: all 0.45s;
    height: 100%;
    /* background-color: rgb(255, 164, 209); */
    background-color: rgba(0, 0, 0, 0);
    /* border: 1px solid red; */
  }
  .nn-text {
    font-size: 12px;
    text-transform: uppercase;
    transition: all 0.45s;
    font-weight: bold;
  }
  .nn-g {
    transition: all 0.45s;
  }
  .nn-edge {
    stroke: black;
    stroke-width: 2.5;
    stroke-dasharray: 5;
    opacity: 0.95;
    animation: dash 30s infinite linear;
    transition: all 0.45s;
  }

  @keyframes dash {
    from {
      stroke-dashoffset: 1000;
    }
  }
  .input {
    fill: skyblue;
    stroke: skyblue;
  }
  .hidden {
    fill: var(--offpink);
    stroke: var(--offpink);
  }
  .output {
    fill: yellow;
    stroke: yellow;
  }

  .nn-node {
    stroke: black;
    fill: var(--paper);
    stroke-width: 4.5;
    fill-opacity: 0.95;
    transition: all 0.45s;
  }

  #network-chart {
    width: 100%;
    max-height: 100%;
    height: 100%;
  }
</style>
