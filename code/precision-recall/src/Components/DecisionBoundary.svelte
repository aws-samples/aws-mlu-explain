<script>
  import { onMount } from "svelte";
  import { drag } from "d3-drag";

  import { getContext } from "svelte";
  import { select, selectAll } from "d3-selection";

  import { TP, FP, TN, FN, stage } from "./data-store.js";

  const { data, xScale, yScale, xRange, yRange } = getContext("LayerCake");

  let xPosition = $xScale.invert(($xRange[0] + $xRange[1]) / 2);

  onMount(() => {
    // attack drag event handlers to decision boundary
    select("g.decision-boundary-bar").call(
      drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)
    );

    // init decision boundary at halfway point
    updateCounts($xScale.invert(($xRange[0] + $xRange[1]) / 2));
  });

  // function to calculate confusion matrix metrics
  $: updateCounts = function (xPos) {
    // update global tracker
    xPosition = xPos;
    // get xposition of decision boundary
    let circs = selectAll("circle");
    let pos = circs.filter(function (d) {
      return select(this).attr("outcome") == "Positive";
    });
    let neg = circs.filter(function (d) {
      return select(this).attr("outcome") == "Negative";
    });
    $TP = pos
      .filter(function (d) {
        return $xScale.invert(select(this).attr("cx")) >= xPos;
      })
      .size();
    $FP = neg
      .filter(function (d) {
        return $xScale.invert(select(this).attr("cx")) >= xPos;
      })
      .size();
    $TN = neg
      .filter(function (d) {
        return $xScale.invert(select(this).attr("cx")) < xPos;
      })
      .size();
    $FN = pos
      .filter(function (d) {
        return $xScale.invert(select(this).attr("cx")) < xPos;
      })
      .size();
  };

  function dragstarted() {
    select("#dragme").remove();
    select("#dragline").remove();
  }

  function dragged(event, d) {
    // get scaled x-position
    let xPos = $xScale.invert(event.x);
    // ensure x-position in range
    if (xPos <= 0.005 || xPos >= 0.95) {
      // out of range, do nothing
    } else {
      // update decision boundary position
      select(this).raise().attr("transform", `translate(${event.x}, 16)`);
      // recalculate metrics
      updateCounts(xPos);
    }
  }

  function dragended(event, d) {}

  const arrows = [
    "M0.200275 13.2782C0.200275 12.4153 0.89983 11.7157 1.76278 11.7157H23.6378C24.5007 11.7157 25.2003 12.4153 25.2003 13.2782C25.2003 14.1411 24.5007 14.8407 23.6378 14.8407H1.76278C0.89983 14.8407 0.200275 14.1411 0.200275 13.2782Z",
    "M11.5954 1.23584C12.2056 0.62565 13.1949 0.62565 13.8051 1.23584L24.7426 12.1733C25.3528 12.7835 25.3528 13.7729 24.7426 14.3831L13.8051 25.3206C13.1949 25.9307 12.2056 25.9307 11.5954 25.3206C10.9852 24.7104 10.9852 23.721 11.5954 23.1108L21.4281 13.2782L11.5954 3.44555C10.9852 2.83536 10.9852 1.84604 11.5954 1.23584Z",
    "M 11.5954 1.23584 C 12.2056 0.62565 13.1949 0.62565 13.8051 1.23584 L 24.7426 12.1733 C 25.3528 12.7835 25.3528 13.7729 24.7426 14.3831 L 13.8051 25.3206 C 13.1949 25.9307 12.2056 25.9307 11.5954 25.3206 C 10.9852 24.7104 10.9852 23.721 11.5954 23.1108 L 21.4281 13.2782 L 11.5954 3.44555 C 10.9852 2.83536 10.9852 1.84604 11.5954 1.23584 Z",
  ];

  // Reactive function to track step value
  $: {
    let circs = selectAll("circle");
    let pos = circs.filter(function (d) {
      return select(this).attr("outcome") == "Positive";
    });
    let neg = circs.filter(function (d) {
      return select(this).attr("outcome") == "Negative";
    });
    // color based on stage
    if ($stage === "none") {
      circs.attr("opacity", 1).attr("stroke", "white");
    } else if ($stage === "precision") {
      // lighten everything to left of DB
      pos
        .filter(function (d) {
          return $xScale.invert(select(this).attr("cx")) >= xPosition;
        })
        .attr("opacity", 1)
        .attr("stroke", "#232F3E");
      neg
        .filter(function (d) {
          return $xScale.invert(select(this).attr("cx")) >= xPosition;
        })
        .attr("opacity", 1)
        .attr("stroke", "#232F3E");
      // show everything to right of db
      neg
        .filter(function (d) {
          return $xScale.invert(select(this).attr("cx")) < xPosition;
        })
        .attr("opacity", 0.5)
        .attr("stroke", "white");
      pos
        .filter(function (d) {
          return $xScale.invert(select(this).attr("cx")) < xPosition;
        })
        .attr("opacity", 0.5)
        .attr("stroke", "white");
    } else {
      pos.attr("opacity", 1).attr("stroke", "#232F3E");
      // recall: reduce all negative opacity
      neg
        .filter(function (d) {
          return $xScale.invert(select(this).attr("cx")) >= xPosition;
        })
        .attr("opacity", 0.5)
        .attr("stroke", "white");
      neg
        .filter(function (d) {
          return $xScale.invert(select(this).attr("cx")) < xPosition;
        })
        .attr("opacity", 0.5)
        .attr("stroke", "white");
    }
  }
</script>

<!-- add 'Drag Me!' annotation -->
<line
  id="dragline"
  x1={($xRange[0] + $xRange[1]) / 2 + 10}
  x2={($xRange[0] + $xRange[1]) / 2 + 40}
  y1="36"
  y2="30"
  stroke-width="1.4"
  stroke="#c9208a"
/>
<text
  id="dragme"
  x={($xRange[0] + $xRange[1]) / 2 + 20}
  y="30"
  font-size="13"
  text-anchor="start"
  dominant-baseline="middle">Drag The Line!</text
>

<!-- decision boundary -->
<g class="bar">
  <g
    class="decision-boundary-bar"
    data-id="decision-boundary-bar"
    transform="translate({($xRange[0] + $xRange[1]) / 2},{16})"
  >
    <rect
      height={$yRange[0] - 2}
      width={12}
      stroke="whitesmoke"
      stroke-width="1.4"
      fill="#232F3E"
    />

    <!-- right arrow -->
    <g class="arrow-holder" transform={`translate(15 ${$yRange[0] - 20})`}>
      <text
        x="0"
        y="0"
        font-size="13"
        text-anchor="start"
        dominant-baseline="middle">Classify</text
      >
      <text
        x="0"
        y="13"
        font-size="13"
        text-anchor="start"
        dominant-baseline="middle">Positive</text
      >
      <g transform="translate(54 -4.5)">
        {#each arrows as arrow}
          <path
            d={arrow}
            style={`transform: rotate(0deg) scale(0.8)`}
            stroke="#ff99ff"
            stroke-width="3"
            fill="#ff99ff"
          />
        {/each}
      </g>
    </g>
    <!-- left arrow -->
    <g class="arrow-holder" transform={`translate(-45 ${$yRange[0] - 20})`}>
      <text
        x="-14"
        y="0"
        font-size="13"
        text-anchor="start"
        dominant-baseline="middle">Classify</text
      >
      <text
        x="-14"
        y="13"
        font-size="13"
        text-anchor="start"
        dominant-baseline="middle">Negative</text
      >
      <g transform={`translate(-21 16)`}>
        {#each arrows as arrow}
          <path
            d={arrow}
            style={`transform: rotate(-180deg) scale(0.8)`}
            stroke="#7e93ee"
            stroke-width="3"
            fill="#7e93ee"
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
  }

  #dragme {
    font-family: var(--font-heavy);
    stroke-linejoin: round;
    fill: #c9208a;
    paint-order: stroke fill;
    stroke-width: 4.4px;
    pointer-events: none;
    stroke: white;
    font-size: 0.75rem;
  }
</style>
