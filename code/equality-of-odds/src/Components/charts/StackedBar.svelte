<script>
  import { max } from "d3-array";
  import { format } from "d3-format";
  import { scaleLinear, scaleOrdinal, scaleBand } from "d3-scale";
  import { stackedData } from "../../store";
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

  const color = scaleOrdinal().range(["var(--reject)", "var(--accept)"]);

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

  const fontSize = 9;
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
    {#each $stackedData.map((d) => d.xVal) as tick, i}
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
        <text y="15" text-anchor="middle">
          <!-- Circles -->
          {#if i < 2}
            <tspan font-size="19" dy="1" alignment-baseline="center">
              &#x25CF;</tspan
            >
            <!-- Triangles -->
          {:else}
            <tspan font-size="11" dy="0" alignment-baseline="center">
              &#x25B2;</tspan
            >
          {/if}
          <!-- Description first bar -->
          {#if i == 0}
            <tspan
              class="axis-text"
              font-size="12"
              dy="-1"
              dx="-5"
              alignment-baseline="center"
            >
              Truth</tspan
            >
            <!-- Description second bar -->
          {:else if i == 1}
            <tspan
              class="axis-text"
              font-size="12"
              dy="-1"
              dx="-5"
              alignment-baseline="center"
            >
              Prediction</tspan
            >
            <!-- Description third bar -->
          {:else if i == 2}
            <tspan
              class="axis-text"
              font-size="12"
              dy=".4"
              dx="0.5"
              alignment-baseline="center"
            >
              Truth</tspan
            >
            <!-- Description fourth bar -->
          {:else if i == 3}
            <tspan
              class="axis-text"
              font-size="12"
              dy=".4"
              dx="0.5"
              alignment-baseline="center"
            >
              Prediction</tspan
            >
          {/if}
        </text>
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
            fill-opacity={d.data.xVal.includes("Predict") ? "0.35" : "0.8"}
            width={xScale.bandwidth()}
          />
        {/each}
      </g>
    {/each}

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
  .axis-label {
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
    stroke: var(--reject);
    fill: none;
    opacity: 0.175;
    font-size: 9px;
  }
  .axis-text {
    font-family: Arial;
    font-size: 12px;
  }
</style>
