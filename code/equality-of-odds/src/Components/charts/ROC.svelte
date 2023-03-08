<script>
  import { extent } from "d3-array";
  import { scaleLinear, scaleOrdinal } from "d3-scale";
  import { line, curveBasis } from "d3-shape";
  import { rocData } from "../../datasets";
  import { outerHeight, outerWidth, margin } from "../../store";

  $: width = $outerWidth - $margin.left - $margin.right;
  $: height = $outerHeight - $margin.top - $margin.bottom;

  // scales
  const colorScale = scaleOrdinal([0, 1], ["#ff9900", "#2074d5"]);

  $: xScale = scaleLinear()
    .domain(extent(rocData.map((d) => d.fpr)))
    .range([$margin.left, width - $margin.right]);

  $: yScale = scaleLinear()
    .domain(extent(rocData.map((d) => d.tpr)))
    .range([height - $margin.bottom, $margin.top]);

  let circleRadius = 5;
  let rectWidth = 8;

  // the path generator
  $: pathLine = line()
    .x((d) => xScale(d.fpr))
    .y((d) => yScale(d.tpr));
</script>

<div
  id="chart-holder"
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
    <!-- <path class="outer-path" d={pathLine(rocData)} />
    <path class="inner-path" d={pathLine(rocData)} /> -->
    {#each rocData as d}
      {#if d.group == "circle"}
        <circle cx={xScale(d.fpr)} cy={yScale(d.tpr)} r={circleRadius} />
      {:else}
        <rect
          x={xScale(d.fpr) - rectWidth / 2}
          y={yScale(d.tpr) - rectWidth / 2}
          width={rectWidth}
          height={rectWidth}
        />
      {/if}
    {/each}

    <!-- axis labels -->
    <text
      class="chart-title"
      y={$margin.top / 2}
      x={(width + $margin.left) / 2}
      text-anchor="middle">Comparing ROC Curves</text
    >
    <text
      class="axis-label"
      y={height + $margin.bottom + 10}
      x={(width + $margin.left) / 2}
      text-anchor="middle">False Positive Rate</text
    >
    <text
      class="axis-label"
      y={$margin.left / 2}
      x={-(height / 2)}
      text-anchor="middle"
      transform="rotate(-90)">True Positive Rate</text
    >
  </svg>
</div>

<style>
  .axis-label,
  .chart-title {
    font-size: 12px;
  }
  #chart-holder {
    height: 100%;
    width: 100%;
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
  }
  .axis-text {
    font-family: Arial;
    font-size: 12px;
  }
  circle {
    fill: var(--sky);
    stroke: var(--bg);
    stroke-width: 1;
  }
  rect {
    fill: var(--smile);
  }
</style>
