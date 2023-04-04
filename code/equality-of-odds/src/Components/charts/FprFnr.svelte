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
    <!-- legend -->
    <g transform={`translate(${$margin.left}, ${$margin.top / 2 + 7})`}>
      <!-- circle -->
      <circle cx="0" r="6" fill="var(--squidink)" />
      <text x="12" y="5.5">Group</text>
      <text x="59" y="5.5">:</text>
      <path
        d="M70 1L105 1"
        stroke-dasharray="9, 3"
        stroke="var(--squidink)"
        stroke-width="4"
      />
      <!-- triangle -->
      <polygon points="122 5, 134 5, 128 -6" fill="var(--squidink)" />
      <text x="138" y="5.5">Group</text>
      <text x="185" y="5.5">:</text>
      <path d="M195 1L232 1" stroke="var(--squidink)" stroke-width="4" />
    </g>
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
          x="-4"
          y="0"
          text-anchor="end"
          dominant-baseline="middle">{tick}</text
        >
      </g>
    {/each}

    <!-- plotting data -->
    <path class="path-line-outer" d={fnrlinePath(circleData)} />
    <path class="path-line-outer" d={fnrlinePath(triangleData)} />
    <path class="path-line-outer" d={fprlinePath(circleData)} />
    <path class="path-line-outer" d={fprlinePath(triangleData)} />

    <path class="fnr circle path-line" d={fnrlinePath(circleData)} />
    <path class="fnr triangle path-line" d={fnrlinePath(triangleData)} />
    <path class="fpr circle path-line" d={fprlinePath(circleData)} />
    <path class="fpr triangle path-line" d={fprlinePath(triangleData)} />

    <!-- Title -->
    <text y={$margin.top / 2 - 15} x={$margin.left} text-anchor="start">
      <tspan>Comparing </tspan>
      <tspan class="title-rate fnr">FNR </tspan>
      <tspan>and </tspan>
      <tspan class="title-rate fpr">FPR </tspan>
      <tspan>by Probability Threshold</tspan>
    </text>

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
  .title-rate {
    stroke-linejoin: round;
    paint-order: stroke fill;
    stroke-width: 6.4px;
    pointer-events: none;
    letter-spacing: 1px;
    text-transform: uppercase;
    fill: var(--white);
  }
  .circle {
    stroke-dasharray: 10, 10;
  }
  .fnr {
    stroke: var(--accept);
  }
  .fpr {
    stroke: var(--reject);
  }
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
  .path-line-outer {
    fill: none;

    stroke-width: 8;
    stroke: var(--bg);
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
    stroke: var(--reject);
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
