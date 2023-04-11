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
    networkInteractiveWeights,
    loopCount,
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

  $: labels = [
    "input",
    ...Array($numLayersInteractive - 2).fill("reLu"),
    "output",
  ];

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

  let nodeWidth = 12 * 1.33 * 4.5;
  let nodeHeight = 12 * 3;

  $: xScale = scaleLinear()
    .domain([-1, $numLayersInteractive])
    .range([marginScroll.left, width - marginScroll.right]);
  $: yScale = scaleLinear()
    .domain([-1, maxNumNeurons])
    .range([height - marginScroll.bottom, marginScroll.top]);

  function add(layer) {
    if ($networkInteractive[layer] < 3) {
      let newNN = [...$networkInteractive];
      newNN[layer] += 1;
      $networkInteractive = [...newNN];
    }
  }
  function subtract(layer) {
    if ($networkInteractive[layer] === 1) {
      if ($numLayersInteractive > 3) {
        const secondToLastLayerIndex = $numLayersInteractive - 2;
        let newNN = [...$networkInteractive];
        newNN.splice(secondToLastLayerIndex, 1);
        $networkInteractive = [...newNN];
      }
    }
    if ($networkInteractive[layer] > 1) {
      let newNN = [...$networkInteractive];
      newNN[layer] -= 1;
      $networkInteractive = [...newNN];
    }
  }

  function getWeightIndex(layer, prevIndex, currIndex, networkInteractive) {
    let index = 0;
    for (let i = 0; i < layer - 1; i++) {
      index += networkInteractive[i] * networkInteractive[i + 1];
    }
    index += prevIndex * networkInteractive[layer - 1] + currIndex;
    console.log("index", Math.abs(Math.ceil(index)));
    return Math.abs(Math.ceil(index));
  }

  let counter = 0;

  function incrementCounter() {
    counter++;
    console.log("counter", counter);
  }
</script>

<div
  bind:this={$ggg}
  id="network-chart-interactive"
  bind:offsetWidth={width}
  bind:offsetHeight={height}
>
  <!-- layer -->
  <svg {width} height={height + marginScroll.top + marginScroll.bottom}>
    {#if visible}
      <!-- edges -->
      {#each Array($numLayersInteractive).fill(null) as i, layer}
        {#each positionElements($networkInteractive[layer], maxNumNeurons) as yPosition}
          {#if layer > 0}
            {#each positionElements($networkInteractive[layer - 1], maxNumNeurons) as prevYPosition, j}
              {incrementCounter()}
              {console.log("counter", counter)}
              <path
                in:draw|local={{ duration: 500 }}
                out:draw|local={{ duration: 400 }}
                d={`
                        M ${xScale(layer - 1)} ${yScale(prevYPosition)}
                        L ${xScale(layer)} ${yScale(yPosition)}
                      `}
                class="nn-edge-int"
                id={`nn-edge-int-${layer}-${yPosition}-${prevYPosition}`}
              />
              {#key $numLayersInteractive}
                <text
                  in:fly|local={{ x: 0, duration: 300 }}
                  out:fade|local={{ duration: 0 }}
                  dx={0 * xScale(1)}
                  dy="0"
                  class="weight-text-int"
                >
                  <textPath
                    href={`#nn-edge-int-${layer}-${yPosition}-${prevYPosition}`}
                    startOffset="50%"
                    text-anchor="middle"
                    fill="#232F3E"
                    dominant-baseline="middle">{`${prevYPosition}`}</textPath
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
                  >
                    {5}

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
            {#if layer !== $numLayersInteractive - 1}
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
            {/if}
          </g>
        {/each}
      {/each}

      <!-- buttons -->
      <!-- nodes -->
      {#each Array($numLayersInteractive).fill(null) as index, layer}
        {#each positionElements($networkInteractive[layer], maxNumNeurons) as yPosition}
          {#if layer !== 0 && layer != $numLayersInteractive - 1}
            <g
              class="nn-button-g"
              transform={`translate(${xScale(layer) - nodeWidth / 2} ${
                yScale(maxNumNeurons) - nodeHeight / 2
              })`}
            >
              <foreignObject x={0} y={nodeHeight} width={nodeWidth} height="40">
                <div
                  xmlns="http://www.w3.org/1999/xhtml"
                  class="button-container"
                >
                  <button on:click={() => add(layer)} class="button-plus"
                    >+</button
                  >
                  <button on:click={() => subtract(layer)} class="button-minus"
                    >-</button
                  >
                </div>
              </foreignObject>
            </g>
          {/if}
        {/each}
      {/each}

      <!-- manually draw final layer here, so it updates smoothly -->
      {#each positionElements($networkInteractive[$numLayersInteractive - 1], maxNumNeurons) as yPosition}
        <g
          class="nn-g"
          transform={`translate(${
            xScale($numLayersInteractive - 1) - nodeWidth / 2
          } ${yScale(yPosition) - nodeHeight / 2})`}
        >
          <rect
            in:fly|local={{ x: -50, duration: 500 }}
            out:fade|local={{ duration: 300 }}
            class="nn-node output"
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
            >{labels[$numLayersInteractive - 1]}
          </text>
        </g>
      {/each}
    {/if}
  </svg>
</div>

<style>
  .button-container {
    display: flex;
    justify-content: space-between;
  }

  button:hover {
    background-color: var(--darksquidink); /* Green */
    border: 1px solid var(--darksquidink);
    color: var(--white);
  }

  .button-plus,
  .button-minus {
    background-color: var(--bb);
    border: 1px solid var(--squidink);
    color: var(--squidink);
    padding: 5px 10px;
    font-size: 14px;
    cursor: pointer;
  }
  .weight-text-int {
    font-size: 15px;
    color: black;
    stroke: white;
    stroke-width: 5px;
    paint-order: stroke fill;
    font-family: var(--font-main);
  }
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
    background-color: rgba(0, 0, 0, 0);
  }
  .nn-text {
    font-size: 12px;
    /* text-transform: uppercase; */
    transition: all 0.45s;
    font-weight: bold;
  }
  .nn-g {
    transition: all 0.45s;
  }
  .nn-edge-int {
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
    fill: var(--magenta);
    stroke: var(--magenta);
  }
  .output {
    fill: yellow;
    stroke: yellow;
  }

  .nn-node {
    stroke: var(--squidink);
    stroke-width: 0.5;
    fill-opacity: 0.95;
    transition: all 0.45s;
  }

  #network-chart-interactive {
    width: 100%;
    max-height: 100%;
    height: 100%;
  }
</style>
