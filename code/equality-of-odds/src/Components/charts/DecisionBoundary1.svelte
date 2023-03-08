<script>
  import { onMount } from "svelte";
  import { drag } from "d3-drag";
  import { select, selectAll } from "d3-selection";
  import { extent } from "d3-array";
  import { scaleLinear, scaleOrdinal } from "d3-scale";
  import { scatterData } from "../../datasets";
  import {
    outerHeight,
    outerWidth,
    rectPos,
    margin,
    stackedData,
    wronglyAccepted,
    wronglyRejected,
  } from "../../store";
  import { arrows } from "../../assets";

  $: width = $outerWidth - $margin.left - $margin.right;
  $: height = $outerHeight - $margin.top - $margin.bottom;

  // scales
  $: xScale = scaleLinear()
    .domain(extent(scatterData.map((d) => d.xPos)))
    .range([$margin.left, width - $margin.right]);

  $: yScale = scaleLinear()
    .domain(extent(scatterData.map((d) => d.yPos)))
    .range([height - $margin.bottom, $margin.top]);

  $rectPos = $outerWidth / 2;

  const dbSize = 10;

  onMount(() => {
    // attack drag event handlers to decision boundary
    select("g.decision-boundary-bar1").call(
      drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)
    );
    $rectPos = xScale(0.45) + $margin.left + $margin.right;
  });

  function dragstarted() {
    select("#dragme").remove();
    select("#dragline").remove();
  }

  function dragged(event, d) {
    // get scaled x-position
    // xPos on our scale
    const xPos = xScale.invert(event.x);
    // ensure x-position in range
    if (xPos <= 0.0 || xPos >= 0.99) {
      console.log("out!");
    } else {
      $rectPos = event.x;
      select("g.decision-boundary-bar1")
        .raise()
        .attr("transform", `translate(${event.x}, ${$margin.top})`);
      // recalculate metrics
      updateStackedRect(xPos);
    }
  }

  function dragended(event, d) {
    console.log("end");
  }

  $: updateStackedRect = function (xPos) {
    let els = selectAll("g.data-point1");
    let accepted = els.filter(function (d) {
      return select(this).attr("label") == 1;
    });
    let rejected = els.filter(function (d) {
      return select(this).attr("label") == 0;
    });

    //   A (right side)
    //   accepted correct
    //   accepted wrong
    const correctAccepted = accepted
      .filter(function (d) {
        return select(this).attr("x") >= xPos;
      })
      .size();

    const wrongAccepted = rejected
      .filter(function (d) {
        return select(this).attr("x") >= xPos;
      })
      .size();

    //   B (left side)
    //   rejected correct
    //   rejected wrong
    const correctRejected = rejected
      .filter(function (d) {
        return select(this).attr("x") <= xPos;
      })
      .size();

    const wrongRejected = accepted
      .filter(function (d) {
        return select(this).attr("x") <= xPos;
      })
      .size();

    //  UPDATE REACTIVE STATE:
    // update for labels in scatter
    $wronglyAccepted = wrongAccepted;
    $wronglyRejected = wrongRejected;

    // Update the underylying dataset
    stackedData.set([
      {
        xVal: "A",
        Accepted: 70,
        Declined: 60,
      },
      {
        xVal: "A Predicted",
        Accepted: correctAccepted,
        Declined: wrongAccepted,
      },
      { xVal: "B", Accepted: 33, Declined: 97 },
      {
        xVal: "B Predicted",
        Accepted: correctRejected,
        Declined: wrongRejected,
      },
    ]);
  };
</script>

<!-- left rect -->
<rect
  class="decision-boundary-rect"
  height={height - $margin.bottom - $margin.top}
  width={$rectPos - $margin.left - $margin.right + dbSize}
  x={$margin.left}
  fill="#ff9900"
  fill-opacity="0.15"
  y={$margin.top}
/>
<!-- right rect -->
<rect
  class="decision-boundary-rect"
  height={height - $margin.bottom - $margin.top}
  width={$outerWidth - $rectPos - $margin.right - $margin.left - dbSize}
  x={$rectPos}
  fill="#2074d5"
  fill-opacity="0.15"
  y={$margin.top}
/>

<!-- decision boundary -->
<g class="bar1">
  <g
    class="decision-boundary-bar1"
    data-id="decision-boundary-bar1"
    transform="translate({$rectPos},{$margin.top})"
  >
    <rect
      height={height - $margin.bottom - $margin.top}
      width={dbSize}
      fill="#232F3E"
    />
    <!-- right arrow -->
    <g class="arrow-holder" transform={`translate(14 ${10})`}>
      <text
        class="decision-boundary-text"
        x="0"
        y="0"
        font-size="13"
        text-anchor="start"
        dominant-baseline="middle">Classify</text
      >
      <text
        class="decision-boundary-text"
        x="0"
        y="13"
        font-size="13"
        text-anchor="start"
        dominant-baseline="middle">Accepted</text
      >
      <g transform="translate(52 -3)">
        {#each arrows as arrow}
          <path
            d={arrow}
            style={`transform: rotate(0deg) scale(0.5)`}
            stroke="#2074d5"
            stroke-width="2"
            fill="#2074d5"
          />
        {/each}
      </g>
    </g>
    <!-- left arrow -->
    <g class="arrow-holder" transform={`translate(-43 ${10})`}>
      <text
        class="decision-boundary-text"
        x="-14"
        y="0"
        font-size="13"
        text-anchor="start"
        dominant-baseline="middle">Classify</text
      >
      <text
        class="decision-boundary-text"
        x="-14"
        y="13"
        font-size="13"
        text-anchor="start"
        dominant-baseline="middle">Rejected</text
      >
      <g transform={`translate(-16 11)`}>
        {#each arrows as arrow}
          <path
            d={arrow}
            style={`transform: rotate(-180deg) scale(0.5)`}
            stroke="#ff9900"
            stroke-width="2"
            fill="#ff9900"
          />
        {/each}
      </g>
    </g>
  </g>
</g>

<style>
  .decision-boundary-rect {
    pointer-events: none;
  }
  .decision-boundary-text {
    font-family: var(--font-light);
    text-transform: uppercase;
    stroke-linejoin: round;
    paint-order: stroke fill;
    stroke-width: 3px;
    font-size: 12px;
    stroke: var(--bg);
  }
  .bar,
  .decision-boundary-bar1 {
    cursor: pointer;
  }
  .arrow-holder {
    display: flex;
  }
</style>
