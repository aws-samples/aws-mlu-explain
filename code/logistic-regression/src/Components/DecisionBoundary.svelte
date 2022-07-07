<script>
  import { onMount } from "svelte";
  import { drag } from "d3-drag";
  import { getContext } from "svelte";
  import { select, selectAll } from "d3-selection";
  import { yPoss } from "../data-store.js";

  const { xScale, yScale, xRange, yRange } = getContext("LayerCake");
  const margin = { top: 50, right: 40, bottom: 50, left: 70 };

  let yPosition = $yScale.invert($yRange[0]);
//   console.log(yPosition);

  onMount(() => {
    // attack drag event handlers to decision boundary
    select("g.decision-boundary-bar").call(
      drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)
    );
  });

  $: update = function (yPos) {
    // update global tracker
    yPosition = yPos;
  };

  function dragstarted() {
    select("#dragme").remove();
    select("#dragline").remove();
  }

  function dragged(event, d) {
    // get scaled y-position
    let yPos = $yScale.invert(event.y);
    console.log(yPos);

    // ensure y-position in range
    // if (yPos <= 0.005 || yPos >= 0.95) {
      // out of range, do nothing
    // } else {
      // update decision boundary position
      select("g.decision-boundary-bar")
        .raise()
        .attr("transform", `translate(${margin.left}, ${event.y})`);
      update(yPos);
      console.log("here");
    // }
  }

  function dragended(event, d) {}

  function moveBoundary(newPosition) {
    let yPosition = $yScale(newPosition);
    select("g.decision-boundary-bar").attr(
      "transform",
      `translate(10, ${yPosition})`
    );
    update(newPosition);

  }

  $: {
    moveBoundary($yPoss);
  }

  const arrows = [
    "M0.200275 13.2782C0.200275 12.4153 0.89983 11.7157 1.76278 11.7157H23.6378C24.5007 11.7157 25.2003 12.4153 25.2003 13.2782C25.2003 14.1411 24.5007 14.8407 23.6378 14.8407H1.76278C0.89983 14.8407 0.200275 14.1411 0.200275 13.2782Z",
    "M11.5954 1.23584C12.2056 0.62565 13.1949 0.62565 13.8051 1.23584L24.7426 12.1733C25.3528 12.7835 25.3528 13.7729 24.7426 14.3831L13.8051 25.3206C13.1949 25.9307 12.2056 25.9307 11.5954 25.3206C10.9852 24.7104 10.9852 23.721 11.5954 23.1108L21.4281 13.2782L11.5954 3.44555C10.9852 2.83536 10.9852 1.84604 11.5954 1.23584Z",
    "M 11.5954 1.23584 C 12.2056 0.62565 13.1949 0.62565 13.8051 1.23584 L 24.7426 12.1733 C 25.3528 12.7835 25.3528 13.7729 24.7426 14.3831 L 13.8051 25.3206 C 13.1949 25.9307 12.2056 25.9307 11.5954 25.3206 C 10.9852 24.7104 10.9852 23.721 11.5954 23.1108 L 21.4281 13.2782 L 11.5954 3.44555 C 10.9852 2.83536 10.9852 1.84604 11.5954 1.23584 Z",
  ];

</script>

<!-- add 'Drag Me!' annotation -->
<line
  x1={$xRange[0] - 125}
  x2={$xRange[1]}
  y1={($yRange[0] + $yRange[1]) / 2 + 10}
  y2={($yRange[0] + $yRange[1]) / 2 + 10}
  stroke-width="1.4"
/>

<text
  id="dragme"
  x={$xRange[1] - 125}
  y={($yRange[0] + $yRange[1]) / 2 + 20}
  font-size="15"
  text-anchor="start"
  dominant-baseline="middle">Drag The Line!</text
>

<!-- decision boundary -->
<g class="bar">
  <!-- <g
    class="decision-boundary-bar"
    data-id="decision-boundary-bar"
    transform="translate({margin.left}, {120})"
  > -->
  <g
    class="decision-boundary-bar"
    data-id="decision-boundary-bar"
    transform="translate({margin.left}, {$yRange[0] / 2 - 5})"
  >
    <rect
      height={10}
      width={$xRange[1] - margin.left - margin.right}
      stroke="whitesmoke"
      stroke-width="1.4"
      fill="#2074d5"
      opacity="1"
    />

    <!-- bottom arrow -->
    <g class="arrow-holder" transform={`translate(60 ${$yRange[1] + 20})`}>
      <text
        x="-14"
        y="0"
        font-size="13"
        text-anchor="start"
        dominant-baseline="middle">Predict</text
      >
      <text
        x="-14"
        y="13"
        font-size="13"
        text-anchor="start"
        dominant-baseline="middle">Rainy</text
      >
      <g transform="translate(-20 -8)">
        {#each arrows as arrow}
          <path
            d={arrow}
            style={`transform: rotate(90deg) scale(0.8)`}
            stroke="#003181"
            stroke-width="3"
            fill="#003181"
          />
        {/each}
      </g>
    </g>
    <!-- top arrow -->
    <g class="arrow-holder" transform={`translate(60 ${$yRange[1] - 20})`}>
      <text
        x="-14"
        y="0"
        font-size="13"
        text-anchor="start"
        dominant-baseline="middle">Predict</text
      >
      <text
        x="-14"
        y="13"
        font-size="13"
        text-anchor="start"
        dominant-baseline="middle">Rainless</text
      >
      <g transform={`translate(-40 16)`}>
        {#each arrows as arrow}
          <path
            d={arrow}
            style={`transform: rotate(-90deg) scale(0.8)`}
            stroke="#ff9900"
            stroke-width="3"
            fill="#ff9900"
          />
        {/each}
      </g>
    </g>
  </g>
</g>

<style>
  .bar,
  .decision-boundary-bar {
    cursor: pointer;
  }
  .arrow-holder {
    display: flex;
    paint-order: stroke fill;
    stroke: white;
    fill: black;
    font-family: var(--font-heavy);
    stroke-linejoin: round;
    stroke-width: 4.4px;
    pointer-events: none;
    font-size: 0.75rem;
  }
  #dragme {
    font-family: var(--font-heavy);
    stroke-linejoin: round;
    fill: #2074d5;
    paint-order: stroke fill;
    stroke-width: 4.4px;
    pointer-events: none;
    stroke: white;
    font-size: 0.75rem;
  }
</style>
