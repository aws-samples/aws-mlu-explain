<script>
  import { curveStep, line } from "d3-shape";
  import { select } from "d3-selection";
  import { scaleLinear } from "d3-scale";
  import { format } from "d3-format";
  import { marginScroll, TPR, FPR, rocCircles, radius } from "../data-store.js";
  import { onMount } from "svelte";

  onMount(() => {
    $TPR = 1.0;
    $FPR = 0.975;
  });

  function highlightText(value) {
    select(".highlight-circle")
      .style("opacity", 1)
      .attr("cx", xScale(value.fpr))
      .attr("cy", rocScale(value.tpr))
      .attr("fill", "#c9208a")
      .raise();

    select("#highlight-text")
      .style("opacity", 1)
      .attr("x", xScale(value.fpr))
      .attr("y", rocScale(value.tpr))
      .raise();

    select("#highlight-tspan")
      .style("opacity", 1)
      .attr("x", xScale(value.fpr))
      .attr("y", rocScale(value.tpr))
      .raise();
  }

  const formatter = format(".1f");
  const formatter2 = format(".2f");

  const dd = $rocCircles;

  // these don't matter, but make the stretching less obvious at load
  let height = 500;
  let width = 500;

  // scales
  $: xScale = scaleLinear()
    .domain([0.0, 1.0])
    .range([$marginScroll.left, width - $marginScroll.right]);
  $: rocScale = scaleLinear()
    .domain([0.0, 1.0])
    .range([height - $marginScroll.bottom, $marginScroll.top]);

  // line generator
  $: rocPath = line()
    .x((d) => xScale(d.fpr))
    .y((d) => rocScale(d.tpr))
    .curve(curveStep);

  // add circles to track
  function addCircle(value) {
    const ids = $rocCircles.map((o) => o.id);
    const filtered1 = $rocCircles.filter(
      ({ id, tpr, fpr }, index) => !ids.includes(id, index + 1)
    );
    const filtered = filtered1.filter(({ id, tpr, fpr }, index) => tpr != null);
    const filtered2 = [...filtered, value];
    $rocCircles = filtered2
      .sort((a, b) => b.tpr - a.tpr)
      .sort((a, b) => b.fpr - a.fpr);
    highlightText(value);
  }

  $: {
    if (!isNaN($TPR) && !isNaN($FPR)) {
      addCircle({ id: "" + $FPR + $TPR, tpr: $TPR, fpr: $FPR });
    }
  }
</script>

<div id="roc-scatter-chart" bind:offsetWidth={width} bind:offsetHeight={height}>
  <svg {width} height={height + $marginScroll.top + $marginScroll.bottom}>
    <!-- x-ticks -->
    {#each xScale.ticks() as tick}
      <g
        transform={`translate(${xScale(tick) + 0} ${
          height - $marginScroll.bottom
        })`}
      >
        <!-- svelte-ignore component-name-lowercase -->
        <line
          class="y-axis-line"
          x1="0"
          x2="0"
          y1="0"
          y2={-height + $marginScroll.bottom + $marginScroll.top}
          stroke="black"
          stroke-dasharray="4"
        />
        <text class="error-axis-text" y="15" text-anchor="middle">{tick}</text>
      </g>
    {/each}
    <!-- y-ticks -->
    {#each [0, 0.2, 0.4, 0.6, 0.8, 1.0] as tick}
      <g
        transform={`translate(${$marginScroll.left - 5} ${rocScale(tick) + 0})`}
      >
        <!-- svelte-ignore component-name-lowercase -->
        <line
          class="y-axis-line"
          x1="0"
          x2={width - $marginScroll.right - $marginScroll.left}
          y1="0"
          y2="0"
          stroke="black"
          stroke-dasharray="4"
        />
        <text
          class="error-axis-text"
          y="0"
          text-anchor="end"
          dominant-baseline="middle">{formatter(tick)}</text
        >
      </g>
    {/each}
    <!-- axis lines -->
    <!-- x -->
    <!-- svelte-ignore component-name-lowercase -->
    <line
      class="error-axis-line"
      y1={height - $marginScroll.bottom}
      y2={height - $marginScroll.bottom}
      x1={$marginScroll.left}
      x2={width}
      stroke="black"
      stroke-width="0"
    />
    <!-- y -->
    <!-- svelte-ignore component-name-lowercase -->
    <line
      class="error-axis-line"
      y1={$marginScroll.top}
      y2={height - $marginScroll.bottom}
      x1={$marginScroll.left}
      x2={$marginScroll.left}
      stroke="black"
      stroke-width="0"
    />

    <!-- our data -->
    <!-- <path class="outline-line" d={auc(rocData)} /> -->
    <path class="outline-line" d={rocPath($rocCircles)} stroke="#9e1f63" />
    <path class="path-line" d={rocPath($rocCircles)} stroke="#9e1f63" />

    <!-- Newly Added Circles -->
    {#each $rocCircles as d}
      <circle
        class="roc-circle"
        fill="#9e1f63"
        stroke="#fff"
        stroke-width="1.5"
        cx={xScale(d.fpr)}
        cy={rocScale(d.tpr)}
        r={$radius}
        tpr={d.tpr}
        fpr={d.fpr}
      />
    {/each}
    <!-- {#each $rocCircles as d} -->
    <text id="highlight-text" text-anchor="middle" opacity="0" x="0" y="0"
      >{@html `TPR: ${formatter2($TPR)}`}<tspan id="highlight-tspan" dy="16"
        >{@html `FPR: ${formatter2($FPR)}`}</tspan
      ></text
    >
    <!-- {/each} -->

    <!-- chart labels -->
    <text
      id="error-text-accuracy"
      class="error-text"
      y={rocScale(0.79)}
      x={xScale(9.2)}
      dominant-baseline="middle">Label</text
    >

    <!-- axis labels -->
    <text
      class="roc-axis-label"
      y={height + $marginScroll.bottom}
      x={(width + $marginScroll.left) / 2}
      text-anchor="middle">False Positive Rate</text
    >
    <text
      class="roc-axis-label"
      y={$marginScroll.left / 3}
      x={-(height / 2)}
      text-anchor="middle"
      transform="rotate(-90)">True Positive Rate</text
    >

    <!-- highlight circle -->
    <circle
      class="highlight-circle"
      fill="#c9208a"
      stroke="black"
      stroke-width="1.5"
      r="7.5"
      cx="0"
      cy="0"
      opacity="0"
    />
  </svg>
</div>

<style>
  #roc-scatter-chart {
    width: 100%;
    max-height: 98%;
  }

  .error-text {
    text-transform: uppercase;
    font-family: var(--font-heavy);
    stroke-linejoin: round;
    paint-order: stroke fill;
    stroke-width: 4.5px;
    pointer-events: none;
    stroke: #f1f3f3;
    font-size: 0.9rem;
    letter-spacing: 2px;
  }

  #highlight-text,
  #highlight-tspan {
    text-transform: uppercase;
    font-family: var(--font-heavy);
    stroke-linejoin: round;
    paint-order: stroke fill;
    stroke-width: 4.25px;
    pointer-events: none;
    stroke: #f1f3f3;
    font-size: 0.8rem;
  }
  .error-axis-text {
    font-size: 0.9rem;
  }

  .y-axis-line {
    opacity: 0.2;
  }

  #error-text-accuracy {
    fill: #c9208a;
  }

  .roc-axis-label {
    text-transform: uppercase;
    font-size: 0.9rem;
  }

  .path-line {
    fill: none;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 4;
  }

  .outline-line {
    fill: none;
    stroke: #f1f3f3;
    stroke-width: 8;
  }

  /* ipad */
  @media screen and (max-width: 950px) {
    .roc-axis-label {
      font-size: 0.8rem;
    }
    .error-axis-text {
      font-size: 0.8rem;
    }
    .error-text {
      stroke-width: 3.5px;
      stroke: #f1f3f3;
      font-size: 0.8rem;
      letter-spacing: 2px;
    }

    .path-line {
      stroke-width: 5;
    }
    .outline-line {
      stroke-width: 8;
    }
  }
  /* mobile */
  @media screen and (max-width: 750px) {
    .roc-axis-label {
      font-size: 0.75rem;
    }
    .error-axis-text {
      font-size: 0.7rem;
    }
    .error-text,
    #highlight-text,
    #highlight-tspan {
      stroke-width: 3px;
      stroke: #f1f3f3;
      font-size: 0.7rem;
      letter-spacing: 1px;
    }

    .path-line {
      stroke-width: 4;
    }
    .outline-line {
      stroke-width: 7;
    }
  }
</style>
