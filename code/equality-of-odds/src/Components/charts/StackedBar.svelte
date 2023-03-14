<script>
  import { max } from "d3-array";
  import { format } from "d3-format";
  import { scaleLinear, scaleOrdinal, scaleBand } from "d3-scale";
  import {
    stackedData,
    wrongly_accepted_A,
    wrongly_accepted_B,
    wrongly_rejected_A,
    wrongly_rejected_B,
  } from "../../store";
  import { stack, stackOrderNone, stackOffsetNone } from "d3-shape";

  let outerHeight = 300;
  let outerWidth = 300;

  let margin = {
    top: 55,
    bottom: 10,
    left: 75,
    right: 10,
  };

  const formatter = format(".0%");

  $: width = outerWidth - margin.left - margin.right;
  $: height = outerHeight - margin.top - margin.bottom;

  const color = scaleOrdinal().range(["#2074d5", "#ff9900"]);

  $: xScale = scaleBand()
    .rangeRound([margin.left, width - margin.right])
    .padding(0.1)
    .domain($stackedData.map((d) => d.xVal));

  $: yScale = scaleLinear()
    .rangeRound([height - margin.bottom, margin.top])
    .domain([0, max($stackedData, (d) => d.Accepted + d.Declined)]);

  const dStack = stack()
    .keys(["Accepted", "Declined"])
    .order(stackOrderNone)
    .offset(stackOffsetNone);

  $: series = dStack($stackedData);
</script>

<div
  id="stackedrect-holder"
  bind:offsetWidth={outerWidth}
  bind:offsetHeight={outerHeight}
>
  <svg width={outerWidth} height={outerHeight}>
    <line
      class="axis-line"
      x1={margin.left}
      x2={width - margin.right}
      y1={height - margin.bottom}
      y2={height - margin.bottom}
    />
    <line
      class="axis-line"
      x1={margin.left}
      x2={margin.left}
      y1={margin.top}
      y2={height - margin.bottom}
    />
    <!-- x-ticks -->
    {#each $stackedData.map((d) => d.xVal) as tick}
      <g
        transform={`translate(${xScale(tick) + xScale.bandwidth() / 2} ${
          height - margin.bottom
        })`}
      >
        <line
          class="axis-tick"
          x1="0"
          x2="0"
          y1={0}
          y2={-height + margin.bottom + margin.top}
          stroke="var(--squidink)"
          stroke-dasharray="4"
        />
        <text class="axis-text" y="15" text-anchor="middle">{tick}</text>
      </g>
    {/each}

    <!-- y-ticks -->
    {#each yScale.ticks() as tick}
      <g transform={`translate(${margin.left} ${yScale(tick) + 0})`}>
        <line
          class="axis-tick"
          x1={0}
          x2={width - margin.right - margin.left}
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
    <!-- stacked rects -->
    {#each series as serie}
      <g class="series">
        {#each serie as d}
          <rect
            x={xScale(d.data.xVal)}
            y={yScale(d[1])}
            height={yScale(d[0]) - yScale(d[1])}
            fill={color(serie.key)}
            fill-opacity="0.55"
            width={xScale.bandwidth()}
          />
        {/each}
      </g>
    {/each}

    <!-- axis labels -->
    <text
      class="chart-title"
      y={margin.top / 3}
      x={(width + margin.left) / 2}
      text-anchor="middle"
      >{formatter($wrongly_rejected_A / ($wrongly_rejected_A + 30))} wrongly rejected in group "circles"
      {formatter($wrongly_rejected_B / ($wrongly_rejected_B + 10))} wrongly rejected in group "squares";
      <br /></text
    >
    <text
      class="chart-title"
      y={margin.top / 3 + 20}
      x={(width + margin.left) / 2}
      text-anchor="middle"
      >{formatter($wrongly_accepted_A / ($wrongly_accepted_A + 20))} wrongly accepted in group "circles"
      {formatter($wrongly_accepted_B / ($wrongly_accepted_B+15))} wrongly accepted in group "squares";
    </text>
    <text
      class="chart-title"
      y={margin.top / 3 + 40}
      x={(width + margin.left) / 2}
      text-anchor="middle"
    >
      Proportionally More individuals in group "cirlces"</text
    >
    <text
      class="axis-label"
      y={margin.left / 2}
      x={-(height / 2)}
      text-anchor="middle"
      transform="rotate(-90)">Count of Outcomes</text
    >
  </svg>
</div>

<style>
  .axis-label,
  .chart-title {
    font-size: 12px;
  }
  #stackedrect-holder {
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
    font-size: 9px;
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
</style>
