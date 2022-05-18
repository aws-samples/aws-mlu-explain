<script>
  import { onMount } from "svelte";
  import { drag } from "d3-drag";

  import { getContext } from "svelte";
  import { select, selectAll } from "d3-selection";
  import { transition } from "d3-transition";

  import { TP, FP, TN, FN, TPR, FPR, xPoss, radius } from "../data-store.js";

  const { xScale, xRange, yRange } = getContext("LayerCake");

  let xPosition = $xScale.invert($xRange[0]);

  onMount(() => {
    // attack drag event handlers to decision boundary
    select("g.decision-boundary-bar").call(
      drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)
    );
  });

  // function to calculate confusion matrix metrics
  $: updateCounts = function (xPos) {
    // update global tracker
    xPosition = xPos;
    // get xposition of decision boundary
    let circs = selectAll("circle");
    let pos = circs.filter(function (d) {
      return select(this).attr("outcome") == "1";
    });
    let neg = circs.filter(function (d) {
      return select(this).attr("outcome") == "0";
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

    $TPR = $TP / ($TP + $FN);
    $FPR = $FP / ($FP + $TN);
  };

  function dragstarted() {
    select("#dragme").remove();
    select("#dragline").remove();
  }

  function dragged(event, d) {
    selectAll(".roc-circle").attr("r", $radius);
    // get scaled x-position
    let xPos = $xScale.invert(event.x);
    // ensure x-position in range
    if (xPos <= 0.0 || xPos >= 0.99) {
      // out of range, do nothing
    } else {
      // update decision boundary position
      select("g.decision-boundary-bar")
        .raise()
        .attr("transform", `translate(${event.x}, 10)`);
      // recalculate metrics
      updateCounts(xPos);
    }
  }

  function dragended(event, d) {}

  function moveBoundary(newPosition) {
    let xPosition = $xScale(newPosition);
    select("g.decision-boundary-bar").attr(
      "transform",
      `translate(${xPosition}, 10)`
    );
    // recalculate metrics
    updateCounts(newPosition);
  }

  $: {
    moveBoundary($xPoss);
  }

  const arrows = [
    "M0.200275 13.2782C0.200275 12.4153 0.89983 11.7157 1.76278 11.7157H23.6378C24.5007 11.7157 25.2003 12.4153 25.2003 13.2782C25.2003 14.1411 24.5007 14.8407 23.6378 14.8407H1.76278C0.89983 14.8407 0.200275 14.1411 0.200275 13.2782Z",
    "M11.5954 1.23584C12.2056 0.62565 13.1949 0.62565 13.8051 1.23584L24.7426 12.1733C25.3528 12.7835 25.3528 13.7729 24.7426 14.3831L13.8051 25.3206C13.1949 25.9307 12.2056 25.9307 11.5954 25.3206C10.9852 24.7104 10.9852 23.721 11.5954 23.1108L21.4281 13.2782L11.5954 3.44555C10.9852 2.83536 10.9852 1.84604 11.5954 1.23584Z",
    "M 11.5954 1.23584 C 12.2056 0.62565 13.1949 0.62565 13.8051 1.23584 L 24.7426 12.1733 C 25.3528 12.7835 25.3528 13.7729 24.7426 14.3831 L 13.8051 25.3206 C 13.1949 25.9307 12.2056 25.9307 11.5954 25.3206 C 10.9852 24.7104 10.9852 23.721 11.5954 23.1108 L 21.4281 13.2782 L 11.5954 3.44555 C 10.9852 2.83536 10.9852 1.84604 11.5954 1.23584 Z",
  ];
</script>

<!-- decision boundary -->
<g class="bar">
  <g
    class="decision-boundary-bar"
    data-id="decision-boundary-bar"
    transform="translate({($xRange[0] + $xRange[0]) / 2},{10})"
  >
    <rect
      height={$yRange[0] - 2}
      width={9}
      stroke="whitesmoke"
      stroke-width="1.4"
      fill="#232F3E"
    />

    <!-- right arrow -->
    <g class="arrow-holder" transform={`translate(12 ${$yRange[0] - 20})`}>
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
        dominant-baseline="middle">Plane</text
      >
      <g transform="translate(52 -4.5)">
        {#each arrows as arrow}
          <path
            d={arrow}
            style={`transform: rotate(0deg) scale(0.8)`}
            stroke="#c9208a"
            stroke-width="3"
            fill="#c9208a"
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
        x="0"
        y="13"
        font-size="13"
        text-anchor="start"
        dominant-baseline="middle">Cloud</text
      >
      <g transform={`translate(-20 16)`}>
        {#each arrows as arrow}
          <path
            d={arrow}
            style={`transform: rotate(-180deg) scale(0.8)`}
            stroke="#7cd1ea"
            stroke-width="3"
            fill="#7cd1ea"
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
</style>
