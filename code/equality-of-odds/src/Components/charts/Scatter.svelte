<script>
  import { min, max } from "d3-array";
  import { scaleLinear, scaleOrdinal } from "d3-scale";
  import { scatterData } from "../../datasets";
  import { outerHeight, outerWidth, margin } from "../../store";
  import DecisionBoundary from "./DecisionBoundary.svelte";

  $: width = $outerWidth - $margin.left - $margin.right;
  $: height = $outerHeight - $margin.top - $margin.bottom;

  // scales
  $: xScale = scaleLinear()
    .domain([0, 1])
    .range([$margin.left, width - $margin.right]);

  $: yScale = scaleLinear()
    .domain([
      min(scatterData, (d) => d.yPos) * 1.07,
      max(scatterData, (d) => d.yPos) * 1.04,
    ])
    .range([height - $margin.bottom, $margin.top]);

  const colorScale = scaleOrdinal([0, 1], ["#ff9900", "#2074d5"]);

  let circleRadius = 5;
  let rectWidth = 8;
</script>

<div
  id="scatter-holder"
  bind:offsetWidth={$outerWidth}
  bind:offsetHeight={$outerHeight}
>
  <svg width={$outerWidth} height={$outerHeight}>
    <!-- x axis line -->
    <line
      class="axis-line"
      x1={$margin.left}
      x2={width - $margin.right}
      y1={height - $margin.bottom}
      y2={height - $margin.bottom}
    />
    <!-- y axis line -->
    <!-- <line
      class="axis-line"
      x1={$margin.left}
      x2={$margin.left}
      y1={$margin.top}
      y2={height - $margin.bottom}
    /> -->
    <!-- x-ticks for grid -->
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
    <!-- y-ticks for grid -->
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
      </g>
    {/each}
    {#each scatterData as d}
      <g
        class="data-point1"
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
          <!-- <rect
            x={xScale(d.xPos) - rectWidth / 2}
            y={yScale(d.yPos) - rectWidth / 2}
            width={rectWidth}
            height={rectWidth}
            fill={colorScale(d.label)}
          /> -->
          <polygon
            points={`${xScale(d.xPos)},${yScale(d.yPos) - rectWidth / 2} ${
              xScale(d.xPos) - rectWidth / 1.5
            },${yScale(d.yPos) + rectWidth / 1.5} ${
              xScale(d.xPos) + rectWidth / 1.5
            },${yScale(d.yPos) + rectWidth / 1.5}`}
            fill={colorScale(d.label)}
          />
        {/if}
      </g>
    {/each}

    <DecisionBoundary />

    <text
      class="axis-label"
      y={height + $margin.bottom + 10}
      x={(width + $margin.left) / 2}
      text-anchor="middle">Probability Threshold</text
    >
  </svg>
</div>

<style>
  #scatter-holder {
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
  polygon {
    stroke: var(--bg);
    stroke-width: 0.5;
  }
</style>
