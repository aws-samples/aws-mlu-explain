<script>
  import { extent } from "d3-array";
  import { scaleLinear, scaleOrdinal } from "d3-scale";
  import { line } from "d3-shape";
  import { rocData } from "../../datasets";
  import { rocHeight, rocWidth, margin } from "../../store";

  $: width = $rocWidth - $margin.left - $margin.right;
  $: height = $rocHeight - $margin.top - $margin.bottom;

  // scales
  const colorScale = scaleOrdinal([0, 1], ["#ff9900", "#2074d5"]);

  function removeThresholdAndDuplicates(data) {
    let seen = new Set();
    return data
      .map(({ fpr, tpr, group }) => ({ fpr, tpr, group }))
      .filter((item) => {
        const key = JSON.stringify(item);
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      });
  }

  const newData = removeThresholdAndDuplicates(rocData);

  $: xScale = scaleLinear()
    .domain(extent(newData.map((d) => d.fpr)))
    .range([$margin.left, width - $margin.right]);

  $: yScale = scaleLinear()
    .domain(extent(newData.map((d) => d.tpr)))
    .range([height - $margin.bottom, $margin.top]);

  let circleRadius = 5;
  let rectWidth = 8;

  // the path generator
  $: pathLine = line()
    .x((d) => xScale(d.fpr))
    .y((d) => yScale(d.tpr));

  const circleData = newData.filter((d) => d.group === "circle");
  const triangleData = newData.filter((d) => d.group === "triangle");

  const circleDataReversed = [...circleData].reverse();

  $: fullPath = `${pathLine(triangleData)} L ${xScale(
    circleDataReversed[0]["fpr"]
  )},${yScale(circleDataReversed[0]["tpr"])} ${pathLine(circleDataReversed)} Z`;

  const circleData1 = newData
    .filter((d) => d.fpr > 0.13)
    .filter((d) => d.group === "circle");
  const triangleData1 = newData
    .filter((d) => d.fpr > 0.13)
    .filter((d) => d.group === "triangle");

  const circleData1Reversed = [...circleData1].reverse();

  $: fullPath1 = `${pathLine(triangleData1)} L ${xScale(
    circleData1Reversed[0]["fpr"]
  )},${yScale(circleData1Reversed[0]["tpr"])} ${pathLine(
    circleData1Reversed
  )} `;

  const circleData2 = newData
    .filter((d) => d.fpr > 0.3)
    .filter((d) => d.group === "circle");
  const triangleData2 = newData
    .filter((d) => d.fpr > 0.3)
    .filter((d) => d.group === "triangle");

  const circleData2Reversed = [...circleData2].reverse();

  $: fullPath2 = `${pathLine(triangleData2)} L ${xScale(
    circleData2Reversed[0]["fpr"]
  )},${yScale(circleData2Reversed[0]["tpr"])} ${pathLine(
    circleData2Reversed
  )} `;
</script>

<div
  id="roc-holder"
  bind:offsetWidth={$rocWidth}
  bind:offsetHeight={$rocHeight}
>
  <svg width={$rocWidth} height={$rocHeight}>
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
    {console.log("FP", fullPath)}
    <path class="sky" d={fullPath} />
    <path class="smile" d={fullPath1} />
    <path class="sky" d={fullPath2} />
    <path
      class="triangle-path"
      d={pathLine(newData.filter((d) => d.group == "triangle"))}
    />
    <path
      class="circle-path"
      d={pathLine(newData.filter((d) => d.group == "circle"))}
    />
    {#each newData as d}
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
  .sky {
    fill: var(--sky);
    opacity: 1;
    stroke: none;
  }
  .smile {
    fill: var(--smile);
    opacity: 1;
    stroke: none;
  }
  .circle-path {
    fill: none;
    stroke: var(--smile);
  }
  .triangle-path {
    fill: none;
    stroke: var(--sky);
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
    stroke: var(--sky);
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
    fill: var(--smile);
  }
  polygon {
    stroke: var(--bg);
    stroke-width: 0.5;
    fill: var(--sky);
  }
</style>
