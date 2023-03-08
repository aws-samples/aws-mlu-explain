<script>
  import { extent } from "d3-array";
  import { scaleLinear, scaleOrdinal } from "d3-scale";
  import { line, curveBasis } from "d3-shape";
  import { scatterData } from "../../datasets";
  import { outerHeight, outerWidth, margin } from "../../store";
  import DecisionBoundary2 from "./DecisionBoundary2.svelte";

  $: width = $outerWidth - $margin.left - $margin.right;
  $: height = $outerHeight - $margin.top - $margin.bottom;

  // scales
  $: xScale = scaleLinear()
    .domain(extent(scatterData.map((d) => d.xPos)))
    .range([$margin.left, width - $margin.right]);

  $: yScale = scaleLinear()
    .domain(extent(scatterData.map((d) => d.yPos)))
    .range([height - $margin.bottom, $margin.top]);

  const colorScale = scaleOrdinal([0, 1], ["#ff9900", "#2074d5"]);

  let circleRadius = 5;
  let rectWidth = 8;
</script>

<div
  id="chart-holder2"
  bind:offsetWidth={$outerWidth}
  bind:offsetHeight={$outerHeight}
>
  <svg width={$outerWidth} height={$outerHeight}>
    <line
      class="axis-line"
      x1={$margin.left}
      x2={width - $margin.right}
      y1={height - $margin.bottom}
      y2={height - $margin.bottom}
    />
    <line
      class="axis-line"
      x1={$margin.left}
      x2={$margin.left}
      y1={$margin.top}
      y2={height - $margin.bottom}
    />
    <!-- x-ticks -->
    {#each xScale.ticks() as tick}
      <g
        transform={`translate(${xScale(tick) + 0} ${height - $margin.bottom})`}
      >
        <line
          class="axis-tick"
          x1="0"
          x2="0"
          y1={0}
          y2={-height + $margin.bottom + $margin.top}
          stroke="var(--squidink)"
          stroke-dasharray="4"
        />
        <text class="axis-text" y="15" text-anchor="middle">{tick}</text>
      </g>
    {/each}
    <!-- y-ticks -->
    {#each yScale.ticks() as tick}
      <g transform={`translate(${$margin.left} ${yScale(tick) + 0})`}>
        <line
          class="axis-tick"
          x1={0}
          x2={width - $margin.right - $margin.left}
          y1="0"
          y2="0"
          stroke="var(--squidink)"
          stroke-dasharray="4"
        />
        <text
          class="axis-text"
          x="-2"
          y="0"
          text-anchor="end"
          dominant-baseline="middle">{tick}</text
        >
      </g>
    {/each}
    {#each scatterData as d}
      <g
        class="data-point"
        label={d.label}
        group={d.group}
        x={d.xPos}
        y={d.yPos}
      >
        {#if d.group == "circle"}
          <circle
            cx={xScale(d.xPos)}
            cy={yScale(d.yPos)}
            r={circleRadius}
            fill={colorScale(d.label)}
          />
        {:else}
          <rect
            x={xScale(d.xPos) - rectWidth / 2}
            y={yScale(d.yPos) - rectWidth / 2}
            width={rectWidth}
            height={rectWidth}
            fill={colorScale(d.label)}
          />
        {/if}
      </g>
    {/each}

    <DecisionBoundary2 />

    <!-- axis labels -->
    <text
      class="chart-title"
      y={$margin.top / 2}
      x={(width + $margin.left) / 2}
      text-anchor="middle">Basic Chart Title</text
    >
    <text
      class="axis-label"
      y={height + $margin.bottom + 10}
      x={(width + $margin.left) / 2}
      text-anchor="middle">X-Axis Label</text
    >
    <text
      class="axis-label"
      y={$margin.left / 2}
      x={-(height / 2)}
      text-anchor="middle"
      transform="rotate(-90)">Y-Axis Label</text
    >
  </svg>
</div>

<style>
  #chart-holder2 {
    height: 100%;
    width: 100%;
  }

  .axis-label,
  .chart-title {
    font-size: 12px;
  }
  .axis-line {
    stroke-width: 3;
    stroke: var(--squidink);
    fill: none;
  }
  .axis-tick {
    stroke-width: 1;
    stroke: var(--sky);
    fill: none;
    opacity: 0.175;
    font-size: 12px;
  }
  .axis-text {
    font-family: Arial;
    font-size: 12px;
  }
  circle {
    stroke: var(--bg);
    stroke-width: 1;
  }
  rect {
  }
</style>
