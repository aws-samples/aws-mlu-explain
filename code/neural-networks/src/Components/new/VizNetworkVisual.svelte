<script>
  import { onMount } from "svelte";
  import { scaleLinear } from "d3-scale";
  import { max, extent } from "d3-array";
  import {
    networkInteractive,
    numLayersInteractive,
    animationDuration,
    ggg,
    points,
    networkInteractiveWeights,
    showText,
    mobile,
  } from "../../store";
  import { fade, fly, draw } from "svelte/transition";
  import { format } from "d3-format";
  import { instantiateWeights } from "./weights";
  import NetworkRelu from "./NetworkRelu.svelte";

  const nodeBoost = 1.4;

  $: maxEdgeSize = $mobile ? 10 : 15;
  $: minCircleRadius = $mobile ? 5 : 15;
  $: maxCircleRadius = $mobile ? 15 : 25;

  $: weightEdgeScale = scaleLinear()
    .domain([-1, 0, 1])
    .range([maxEdgeSize, 0.2, maxEdgeSize]);
  $: gradEdgeScale = scaleLinear()
    .domain(extent($networkInteractiveWeights, (d) => d.grad))
    .range([minCircleRadius, maxCircleRadius]);

  const wFormat = format("0.3f");
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
    "X",
    ...Array($numLayersInteractive - 2).fill("reLu"),
    "sigmoid",
  ];

  let docEl;
  onMount(() => {
    // render elements after drawn to canvas
    visible = true;
    docEl = document;
  });

  // these don't matter, but make the stretching less obvious at load
  $: maxNumNeurons = max($networkInteractive) - 1;

  $: height = 500;
  $: width = 500;
  // init to false so don't show drawing during rendering
  $: visible = true;

  $: nodeWidth = $mobile ? 34 : 72;
  $: nodeHeight = $mobile ? 20 : 36;
  $: wideNodeOffset = $mobile ? 12 : 0;

  $: xScale = !$mobile
    ? scaleLinear()
        .domain([-1, $numLayersInteractive])
        .range([marginScroll.left, width - marginScroll.right])
    : scaleLinear()
        .domain([0, $numLayersInteractive])
        .range([
          marginScroll.left + nodeWidth / 2 + 4,
          width - marginScroll.right,
        ]);
  $: yScale = scaleLinear()
    .domain([-1, maxNumNeurons])
    .range([height - marginScroll.bottom, marginScroll.top]);

  function add(layer) {
    if ($networkInteractive[layer] < 10) {
      // resetCounter();
      let newNN = [...$networkInteractive];
      newNN[layer] += 1;
      $networkInteractive = [...newNN];
      // prevent text from showing since no initial values
      $showText = false;
      instantiateWeights();
      // instead - just instantiate weights directly to zero
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
      // prevent text from showing since no initial values
      $showText = false;
      instantiateWeights();
    }
    if ($networkInteractive[layer] > 1) {
      let newNN = [...$networkInteractive];
      newNN[layer] -= 1;
      $networkInteractive = [...newNN];
      // prevent text from showing since no initial values
      $showText = false;
      instantiateWeights();
    }
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
  bind:this={$ggg}
  id="network-chart-interactive"
  bind:offsetWidth={width}
  bind:offsetHeight={height}
>
  <!-- layer -->
  <svg {width} height={height + marginScroll.top + marginScroll.bottom}>
    {#if visible}
      <!-- edges -->
      {#each Array($numLayersInteractive).fill(null) as layer, i}
        {#each positionElements($networkInteractive[i], maxNumNeurons) as yPosition, y}
          {#if i > 0}
            {#each positionElements($networkInteractive[i - 1], maxNumNeurons) as prevYPosition, j}
              {@const index = getIndex(i, j, y, $networkInteractive)}
              <path
                in:draw|local={{ duration: 500 }}
                out:draw|local={{ duration: 400 }}
                d={`
                        M ${xScale(i - 1)} ${yScale(prevYPosition)}
                        L ${xScale(i)} ${yScale(yPosition)}
                      `}
                stroke-width={$showText
                  ? weightEdgeScale($networkInteractiveWeights[index]["data"])
                  : 0.5}
                class="nn-edge-int"
                class:animate-dash={$showText}
                id={`nn-edge-int-${i}-${yPosition}-${prevYPosition}`}
              />
              {#key `${$numLayersInteractive}-${$networkInteractive}`}
                {#if $showText}
                  <text
                    in:fly|local={{ x: 50, duration: 500 }}
                    out:fade|local={{ duration: 0 }}
                  >
                    <textPath
                      href={`#nn-edge-int-${i}-${yPosition}-${prevYPosition}`}
                      class="weight-text-int"
                      startOffset="50%"
                      text-anchor="middle"
                      dominant-baseline="middle"
                      >{wFormat(
                        $networkInteractiveWeights[index]["data"]
                      )}</textPath
                    >
                  </text>
                {/if}
              {/key}

              <!-- forward-pass -->
              {#each $points as p}
                <g transform={`translate(0, 0)`}>
                  <text
                    opacity="1"
                    class="moving-text"
                    alignment-baseline="middle"
                  >
                    ⬤
                  </text>
                  <animateMotion
                    id={`animatePath${i}${p}`}
                    dur={$animationDuration / 2}
                    begin={i === 1
                      ? `${0 + 0.1 * p}`
                      : `animatePath${i - 1}${p}.end`}
                    restart="whenNotActive"
                    path={`
                          M ${xScale(i - 1)} ${yScale(prevYPosition)}
                          L ${xScale(i)} ${yScale(yPosition)}
                        `}
                  />
                </g>
              {/each}
              {#each $points as p}
                <g>
                  <circle
                    r={gradEdgeScale($networkInteractiveWeights[index]["grad"])}
                    opacity="0"
                    id={`circle${i}${p}`}
                    class="moving-circle-back"
                  >
                    <set
                      attributeName="opacity"
                      to="1"
                      begin={`animatePathBack${i}${p}.begin`}
                    />
                    <set
                      attributeName="opacity"
                      to="0"
                      begin={`animatePathBack${i}${p}.end`}
                    />
                  </circle>
                  <text
                    opacity="0"
                    class="moving-text"
                    alignment-baseline="middle"
                    >{wFormat($networkInteractiveWeights[index]["grad"])}
                    <set
                      attributeName="opacity"
                      to="1"
                      begin={`animatePathBack${i}${p}.begin`}
                    />
                    <set
                      attributeName="opacity"
                      to="0"
                      begin={`animatePathBack${i}${p}.end`}
                    />
                  </text>
                  <animateMotion
                    id={`animatePathBack${i}${p}`}
                    begin={i === $numLayersInteractive - 1
                      ? `animatePath${$numLayersInteractive - 1}${p}.end`
                      : `animatePathBack${i + 1}${p}.end`}
                    dur={$animationDuration}
                    restart="whenNotActive"
                    path={`
                            M ${xScale(i)} ${yScale(yPosition)}
                            L ${xScale(i - 1)} ${yScale(prevYPosition)}
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
          {@const hLayer = layer < $numLayersInteractive - 1 && layer > 0}
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
                height={hLayer ? nodeHeight * nodeBoost : nodeHeight}
              />
              {#if hLayer}
                <NetworkRelu data="reLu" />
              {/if}
              <text
                in:fly|local={{ x: -50, duration: 500 }}
                out:fade|local={{ duration: 300 }}
                class="nn-text"
                text-anchor="middle"
                alignment-baseline="middle"
                dx={nodeWidth / 2}
                dy={hLayer ? nodeHeight * nodeBoost - 8 : nodeHeight / 2}
                >{labels[layer]}
                <tspan class="subscript" dy="4">{Math.abs(yPosition - 2)}</tspan
                >
              </text>
            {/if}
          </g>
        {/each}
      {/each}

      <!-- buttons -->
      {#each Array($numLayersInteractive).fill(null) as index, layer}
        {#each positionElements($networkInteractive[layer], maxNumNeurons) as yPosition}
          {#if layer !== 0 && layer != $numLayersInteractive - 1}
            <g
              class="nn-button-g"
              transform={`translate(${xScale(layer) - nodeWidth / 2} ${
                yScale(maxNumNeurons) - nodeHeight / 2
              })`}
            >
              <foreignObject
                x={0}
                y={nodeHeight}
                width={$mobile ? nodeWidth + 2 : nodeWidth}
                height="30"
              >
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
            width={labels[$numLayersInteractive - 1] == "sigmoid"
              ? nodeWidth + wideNodeOffset
              : nodeWidth}
            height={nodeHeight * nodeBoost}
          />
          <NetworkRelu data={"sigmoid"} />
          <text
            in:fly|local={{ x: -50, duration: 500 }}
            out:fade|local={{ duration: 300 }}
            class="nn-text"
            text-anchor="middle"
            alignment-baseline="middle"
            dx={labels[$numLayersInteractive - 1] == "sigmoid"
              ? (nodeWidth + wideNodeOffset) / 2
              : nodeWidth / 2}
            dy={nodeHeight * nodeBoost - 8}
            >{labels[$numLayersInteractive - 1]}
          </text>
        </g>
      {/each}

      <rect
        fill={$mobile ? "#e5f7ff" : "#f3fbff"}
        x="0"
        y="0"
        width="30"
        height="30"
      />
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
    background-color: var(--white);
    border: 1px solid var(--squidink);
    color: var(--squidink);
    padding: 5px 10px;
    font-size: 14px;
    cursor: pointer;
    z-index: 999;
  }
  .weight-text-int {
    font-size: 15px;
    font-family: var(--font-main);
    stroke-linejoin: round;
    paint-order: stroke fill;
    stroke-width: 4.4px;
    stroke: var(--squidink);
    fill: var(--white);
  }
  .moving-text {
    font-size: 21px;
    /* font-weight: bold; */
    color: var(--darksquidink);
    text-anchor: middle;
    paint-order: stroke fill;
    stroke: white;
    stroke-width: 4;
    text-anchor: middle;
    font-family: var(--font-main);
  }

  .moving-circle-back {
    stroke: var(--squidink);
    stroke-width: 1;
    fill: rgba(255, 80, 83, 0.5);
  }

  svg {
    border-radius: 5;
    transition: all 0.45s;
    height: 100%;
    background-color: rgba(0, 0, 0, 0);
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
  .nn-edge-int {
    stroke: var(--darksquidink);
    opacity: 0.95;
    transition: all 0.45s;
  }

  @keyframes dash {
    from {
      stroke-dashoffset: 1000;
    }
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

  @media only screen and (max-width: 950px) {
    .moving-text {
      font-size: 8px;
      color: var(--darksquidink);
      stroke: white;
      stroke-width: 2px;
      font-family: var(--font-main);
    }

    .weight-text-int {
      font-size: 8px;
      stroke-width: 2px;
    }

    .nn-text {
      font-size: 8px;
      transition: all 0.45s;
      stroke-linejoin: round;
      paint-order: stroke fill;
      stroke-width: 0px;
      stroke: var(--bg);
      letter-spacing: 1px;
    }

    .button-plus,
    .button-minus {
      padding: 3px 6px;
      font-size: 8px;
      cursor: pointer;
    }
  }
</style>
