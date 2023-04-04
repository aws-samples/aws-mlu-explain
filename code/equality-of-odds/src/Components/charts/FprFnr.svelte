<script>
  import { extent } from "d3-array";
  import { line, curveStep } from "d3-shape";
  import { scaleLinear, scaleOrdinal } from "d3-scale";
  import { fnrfprWidth, fnrfprHeight, margin } from "../../store";
  import { fnrfprData } from "../../datasets";

  $: width = $fnrfprWidth - $margin.left - $margin.right;
  $: height = $fnrfprHeight - $margin.top - $margin.bottom;

  // scales
  $: xScale = scaleLinear()
    .domain(extent(fnrfprData.map((d) => d.threshold)))
    .range([$margin.left, width - $margin.right]);

  $: yScale = scaleLinear()
    .domain([0.0, 1.0])
    .range([height - $margin.bottom, $margin.top]);

  const colorScale = scaleOrdinal([0, 1], ["#ff9900", "#2074d5"]);

  let circleRadius = 5;
  let rectWidth = 8;

  const circleData = fnrfprData.filter((d) => d.group === "circle");
  const triangleData = fnrfprData.filter((d) => d.group === "triangle");

  // line generator
  $: fprlinePath = line()
    .x((d) => xScale(d.threshold))
    .y((d) => yScale(d.fpr))
    .curve(curveStep);

  $: fnrlinePath = line()
    .x((d) => xScale(d.threshold))
    .y((d) => yScale(d.fnr))
    .curve(curveStep);
</script>

<div
  id="chart-holder"
  bind:offsetWidth={$fnrfprWidth}
  bind:offsetHeight={$fnrfprHeight}
>
  <svg width={$fnrfprWidth} height={$fnrfprHeight}>
    <!-- x axis line -->
    <line
      class="axis-line"
      x1={$margin.left}
      x2={width - $margin.right}
      y1={height - $margin.bottom}
      y2={height - $margin.bottom}
    />
    <!-- y axis line -->
    <line
      class="axis-line"
      x1={$margin.left}
      x2={$margin.left}
      y1={$margin.top}
      y2={height - $margin.bottom}
    />
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
        <!-- numbers next to ticks -->
        <text
          class="axis-text"
          x="-2"
          y="0"
          text-anchor="end"
          dominant-baseline="middle">{tick}</text
        >
      </g>
    {/each}

    <!-- plotting data -->
    <path
      id="fnr-line"
      class="path-line"
      d={fnrlinePath(circleData)}
      stroke="var(--seablue)"
    />
    <path
      id="fnr-line"
      class="path-line"
      d={fnrlinePath(triangleData)}
      stroke="var(--cosmos)"
    />
    <path
      id="fpr-line"
      class="path-line"
      d={fprlinePath(circleData)}
      stroke="var(--seablue)"
      stroke-dasharray="10,10"
    />
    <path
      id="fpr-line"
      class="path-line"
      d={fprlinePath(triangleData)}
      stroke="var(--cosmos)"
      stroke-dasharray="10,10"
    />

    <!-- {#each fnrfprData as d}
      <g
        class="data-point2"
        group={d.group}
        x={d.threshold}
        y={d.fpr}
      >
        {#if d.group == "circle"}
          <circle
            cx={xScale(d.threshold)}
            cy={yScale(d.fpr)}
            r={circleRadius}
            fill="var(--sky)"
          />
        {:else}
          <polygon
            points={`${xScale(d.threshold)},${yScale(d.fpr) - rectWidth / 2} ${
              xScale(d.threshold) - rectWidth / 1.5
            },${yScale(d.fpr) + rectWidth / 1.5} ${
              xScale(d.threshold) + rectWidth / 1.5
            },${yScale(d.fpr) + rectWidth / 1.5}`}
          />
        {/if}
      </g>
    {/each} -->

    <!-- y axis label -->
    <text
      class="axis-label"
      y={$margin.left / 2}
      x={-(height / 2)}
      text-anchor="middle"
      transform="rotate(-90)">False Negative Rate</text
    >
    <!-- x axis label -->
    <text
      class="axis-label"
      y={height + $margin.bottom + 10}
      x={(width + $margin.left) / 2}
      text-anchor="middle">Probability Threshold</text
    >
  </svg>
</div>

<style>
  #chart-holder {
    height: 100%;
    width: 100%;
  }
  .path-line {
    fill: none;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 4;
  }
  .axis-label {
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
