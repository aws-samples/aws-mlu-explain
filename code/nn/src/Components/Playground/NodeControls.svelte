<script>
  import { scaleLinear } from "d3-scale";
  import { max } from "d3-array";
  import {
    drawActivation,
    labels,
    marginScroll,
    showLayerLine,
    showSubScript,
  } from "../../store";
  import {
    numLayersInteractive,
    networkInteractive,
  } from "../../playground-store";
  import { fade, fly, draw } from "svelte/transition";

  $: maxNumNeurons = max($networkInteractive) + 1;

  let height;
  let width;
  // init to false so don't show drawing during rendering

  let nodeWidth = 65;
  let nodeHeight = 40;

  $: xScale = scaleLinear()
    .domain([-1, $numLayersInteractive])
    .range([$marginScroll.left, width - $marginScroll.right]);
  $: yScale = scaleLinear()
    .domain([-1, maxNumNeurons])
    .range([height - $marginScroll.bottom, $marginScroll.top]);

  function buttonClick() {
    const parentG = this.parentNode;
    const layerIndex = parentG.getAttribute("layer");
    const rectVal = this.getAttribute("val");
    const numNodes = $networkInteractive[layerIndex];
    // add case
    if (rectVal === "+") {
      if (numNodes >= 4) {
        return;
      } else {
        let newNN = [...$networkInteractive];
        newNN[layerIndex] += 1;
        $networkInteractive = [...newNN];
      }
    }
    // minus case
    if (rectVal === "-") {
      if (numNodes === 1) {
        return;
      } else {
        let newNN = [...$networkInteractive];
        newNN[layerIndex] -= 1;
        $networkInteractive = [...newNN];
      }
    }
  }

  function rectMouseOver() {
    const parentG = this.parentNode;
    const rectVal = this.getAttribute("val");
    const textElements = parentG.querySelectorAll("text");
    textElements.forEach((textElement) => {
      if (textElement.textContent === rectVal) {
        textElement.style.fill = "white";
      }
    });
    this.style.fill = "#232f3e";
  }

  function rectMouseOut() {
    const parentG = this.parentNode;
    const rectVal = this.getAttribute("val");
    const textElements = parentG.querySelectorAll("text");
    textElements.forEach((textElement) => {
      if (textElement.textContent === rectVal) {
        textElement.style.fill = "#232f3e";
      }
    });
    this.style.fill = "#f1f3f3";
  }
</script>

<!-- add/subtract node controls -->
{#each Array($numLayersInteractive).fill(null) as index, layer}
  {#if layer !== 0}
    <g
      class="nn-g"
      transform={`translate(${xScale(layer) - nodeWidth / 2} ${yScale(
        maxNumNeurons
      )})`}
      {layer}
    >
      <rect
        on:mouseover={rectMouseOver}
        on:mouseout={rectMouseOut}
        on:click={buttonClick}
        x="-5"
        val="+"
        class="neuron-rect"
        width={nodeWidth / 2}
        height={nodeHeight / 1.5}
      />

      <text
        class="neuron-button"
        text-anchor="middle"
        alignment-baseline="middle"
        dx={nodeWidth / 4 - 5}
        dy={nodeHeight / 3 + 2.5}>+</text
      >
      <rect
        on:mouseover={rectMouseOver}
        on:mouseout={rectMouseOut}
        on:click={buttonClick}
        val="-"
        class="neuron-rect"
        x={nodeWidth / 2 + 5}
        width={nodeWidth / 2}
        height={nodeHeight / 1.5}
      />
      <text
        class="neuron-button"
        text-anchor="middle"
        alignment-baseline="middle"
        x={nodeWidth / 2 + 5}
        dx={nodeWidth / 4}
        dy={nodeHeight / 3}>-</text
      >
    </g>
  {/if}
{/each}

<style>
  .neuron-rect {
    fill: var(--bg);
    stroke: var(--darksquidink);
    stroke-width: 2;
    transition: all 0.45s;
    cursor: pointer;
  }

  .neuron-button {
    font-size: 1.4rem;
    pointer-events: none;
    user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    -webkit-touch-callout: none;
    -o-user-select: none;
    -moz-user-select: none;
    transition: all 0.45s;
  }
</style>
