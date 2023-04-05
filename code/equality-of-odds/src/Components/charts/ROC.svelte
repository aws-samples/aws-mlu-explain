<script>
  import { extent } from "d3-array";
  import { scaleLinear, scaleOrdinal } from "d3-scale";
  import { line } from "d3-shape";
  import { rocData } from "../../datasets";
  import { rocHeight, rocWidth, margin } from "../../store";
  import { swoopAnnotation } from "../../swoopAnnotation.js";

  $: width = $rocWidth - $margin.left - $margin.right;
  $: height = $rocHeight - $margin.top - $margin.bottom;

  // scales
  const colorScale = scaleOrdinal([0, 1]);

  $: xScale = scaleLinear()
    .domain([0,1])
    .range([$margin.left, width - $margin.right]);

  $: yScale = scaleLinear()
    .domain([0,1])
    .range([height - $margin.bottom, $margin.top]);

  let circleRadius = 5;
  let rectWidth = 8;

  // the path generator
  $: pathLine = line()
    .x((d) => xScale(d.fpr))
    .y((d) => yScale(d.tpr));

  const circleData = rocData.filter((d) => d.group === "circle");
  const triangleData = rocData.filter((d) => d.group === "triangle");

  const circleDataReversed = [...circleData].reverse();

  $: fullPath = `${pathLine(triangleData)} L ${xScale(
    circleDataReversed[0]["fpr"]
  )},${yScale(circleDataReversed[0]["tpr"])} ${pathLine(circleDataReversed)} Z`;

  const circleData1 = rocData
    .filter((d) => d.fpr <= 0.15)
    .filter((d) => d.group === "circle");
  const triangleData1 = rocData
    .filter((d) => d.fpr <= 0.15)
    .filter((d) => d.group === "triangle");

  const circleData1Reversed = [...circleData1].reverse();

  $: fullPath1 = `${pathLine(triangleData1)} L ${xScale(
    circleData1Reversed[0]["fpr"]
  )},${yScale(circleData1Reversed[0]["tpr"])} ${pathLine(
    circleData1Reversed
  )} `;
  $: annotation1 = [
    [xScale(0.22), yScale(0.35)],
    [xScale(0.24), yScale(0.4)],
    [xScale(0.1625), yScale(0.745)],
  ];
  // $: annotation2 = [
  //   [xScale(0.38), yScale(0.69)],
  //   [xScale(0.4), yScale(0.8)],
  //   [xScale(0.3), yScale(0.85)],
  // ];

  $: annotationSwoop1 = swoopAnnotation(annotation1);
  // $: annotationSwoop2 = swoopAnnotation(annotation2);
</script>

<div
  id="roc-holder"
  bind:offsetWidth={$rocWidth}
  bind:offsetHeight={$rocHeight}
>
  <svg width={$rocWidth} height={$rocHeight}>
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
          x="-4"
          y="0"
          text-anchor="end"
          dominant-baseline="middle">{tick}</text
        >
      </g>
    {/each}
    <path class="accept" d={fullPath} />
    <path class="reject" d={fullPath1} />
    <path
      class="triangle-path"
      d={pathLine(rocData.filter((d) => d.group == "triangle"))}
    />
    <path
      class="circle-path"
      d={pathLine(rocData.filter((d) => d.group == "circle"))}
    />
    {#each rocData as d}
      {#if d.tpr != 1}
        {#if d.group == "circle"}
          <circle cx={xScale(d.fpr)} cy={yScale(d.tpr)} r={circleRadius} />
        {:else}
          <polygon
            points={`${xScale(d.fpr)},${yScale(d.tpr) - rectWidth / 2} ${
              xScale(d.fpr) - rectWidth / 1.5
            },${yScale(d.tpr) + rectWidth / 1.5} ${
              xScale(d.fpr) + rectWidth / 1.5
            },${yScale(d.tpr) + rectWidth / 1.5}`}
            fill={colorScale(d.label)}
          />
        {/if}
      {/if}
    {/each}

    <!-- Title -->

    <text y={$margin.top / 2} x={$margin.left} text-anchor="start">
      <tspan>Comparing </tspan>
      <tspan class="title-rate fnr">TPR </tspan>
      <tspan>and </tspan>
      <tspan class="title-rate fpr">FPR </tspan>
      <tspan>per group</tspan>
    </text>
    <!-- y axis labels -->

    <text
      class="axis-label"
      y={height + $margin.bottom + 10}
      x={(width + $margin.left) / 2}
      text-anchor="middle">False Positive Rate</text
    >
    <!-- x axis labels -->
    <text
      class="axis-label"
      y={$margin.left / 2}
      x={-(height / 2)}
      text-anchor="middle"
      transform="rotate(-90)">True Positive Rate</text
    >

    <!-- Add annotations with arrows and text -->
    <!-- Annotation 1 -->
    <!-- A rx ry x-axis-rotation large-arc-flag sweep-flag x y -->
    <path
      class="annotation-path"
      d={annotationSwoop1}
      fill="none"
      stroke="black"
      stroke-width="2"
      marker-end="url(#arrow)"
    />
    <text
      class="annotation-text"
      x={annotation1[0][0]}
      y={annotation1[0][1]}
      dx="-24"
      text-anchor="start"
      dominant-baseline="middle"
    >
      <tspan>At this point, </tspan>
      <tspan class="title-rate fpr"> TPR </tspan>
      <tspan>and</tspan>
      <tspan class="title-rate fnr"> FNR </tspan>
      <tspan>of both groups match and EO is satisfied. </tspan>
    </text>

    <!-- Annotation 2 -->
    <!-- <path
      class="annotation-path"
      d={annotationSwoop2}
      fill="none"
      stroke="black"
      stroke-width="2"
      marker-end="url(#arrow)"
    />

    <text
      class="annotation-text"
      x={annotation2[0][0]}
      y={annotation2[0][1]}
      dx="-24"
      text-anchor="start"
      dominant-baseline="middle"
    >
      <tspan>In this region, </tspan>
      <tspan class="title-rate fnr"> FNR </tspan>
      <tspan>dominates </tspan>
    </text> -->

    <!-- Add arrow marker -->
    <defs>
      <marker
        id="arrow"
        viewBox="0 0 10 10"
        refX="5"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>
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

  .fnr {
    stroke: var(--accept);
  }
  .fpr {
    stroke: var(--reject);
  }
  .annotation-path {
    stroke-dasharray: 4;
    fill: none;
    stroke: var(--squidink);
  }
  .annotation-text {
    font-size: 12px;
    color: var(--squidink);
    stroke: var(--white);
    stroke-width: 4;
    stroke-linecap: round;
    paint-order: stroke fill;
  }
  .reject {
    fill: var(--reject);
    opacity: 1;
    stroke: none;
  }
  .accept {
    fill: var(--accept);
    opacity: 1;
    stroke: none;
  }
  .circle-path {
    fill: none;
    stroke: var(--accept);
    stroke-width: 4;
  }
  .triangle-path {
    fill: none;
    stroke: var(--reject);
    stroke-width: 4;
  }
  .axis-label,
  .chart-title {
    font-size: 12px;
  }
  #roc-holder {
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
    stroke: var(--reject);
    fill: none;
    opacity: 0.175;
  }
  .axis-text {
    font-family: Arial;
    font-size: 12px;
  }
  circle {
    stroke: var(--bg);
    stroke-width: 1;
    fill: var(--accept);
  }
  polygon {
    stroke: var(--bg);
    stroke-width: 0.5;
    fill: var(--reject);
  }
  @media screen and (max-width: 1000px) {
    .annotation-text {
      font-size: 9px;
      stroke-width: 3;
    }
  }
</style>
