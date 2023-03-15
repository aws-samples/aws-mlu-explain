<script>
  import { max } from "d3-array";
  import { format } from "d3-format";
  import { scaleLinear, scaleOrdinal, scaleBand } from "d3-scale";
  import { unigramCounts } from "../../store";

  $: barData = Object.keys($unigramCounts).map((key) => {
    return { word: key, count: $unigramCounts[key] };
  });

  const formatter = format(".0%");
  let outerHeight = 300;
  let outerWidth = 300;

  let margin = {
    top: 55,
    bottom: 30,
    left: 75,
    right: 10,
  };

  $: width = outerWidth - margin.left - margin.right;
  $: height = outerHeight - margin.top - margin.bottom;

  $: xScale = scaleBand()
    .rangeRound([margin.left, width - margin.right])
    .padding(0.1)
    .domain(barData.map((d) => d.word));

  $: yScale = scaleLinear()
    .rangeRound([height - margin.bottom, margin.top])
    .domain([0, max(barData, (d) => d.count)]);
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
    {#each barData.map((d) => d.word) as tick}
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
    {#each barData as d}
      <rect
        x={xScale(d.word)}
        y={yScale(d.count)}
        height={height - margin.bottom - yScale(d.count)}
        fill={"red"}
        fill-opacity="0.55"
        width={xScale.bandwidth()}
      />
    {/each}

    <!-- axis labels -->
    <text
      class="chart-title"
      y={margin.top / 2}
      x={(width + margin.left) / 2}
      text-anchor="middle">Word Distributions</text
    >
    <text
      class="chart-title"
      y={margin.top / 2 + 15}
      x={(width + margin.left) / 2}
      text-anchor="middle"
    >
      Proportionally More Individuals Accepted From Group B</text
    >
    <text
      class="axis-label"
      y={margin.left / 2}
      x={-(height / 2)}
      text-anchor="middle"
      transform="rotate(-90)">Y-Axis Label</text
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
    stroke: black;
    fill: none;
  }
  .axis-tick {
    stroke-width: 1;
    stroke: blue;
    fill: none;
    opacity: 0.175;
    font-size: 9px;
  }
  .axis-text {
    font-family: Arial;
    font-size: 12px;
  }
</style>
