<script>
  import { scatterData1, sigmoidCurve } from "../datasets.js";
  import { scaleLinear, scaleOrdinal } from "d3-scale";
  import { max, min, extent } from "d3-array";
  import { select, selectAll } from "d3-selection";
  import { transition } from "d3-transition";
  import { format } from "d3-format";
  import { line } from "d3-shape";
  import { Temperature, DecisionBoundary, Prediction } from "../data-store.js";

  let width = 500;
  let height = 500;
  const margin = { top: 50, right: 40, bottom: 50, left: 70 };

  const colors = ["#003181", "#ff9900"];
  const labels = ["Rainy Day", "Sunny Day"];
  const classSet = new Set(scatterData1.map((d) => d.Weather));

  const formatter = format(".1f");

  $: xScale = scaleLinear()
    .domain([20, 100])
    .range([margin.left, width - margin.right]);

  $: yScale = scaleLinear()
    .domain([
      min(scatterData1, (d) => d.Weather),
      max(scatterData1, (d) => d.Weather),
    ])
    .range([height - margin.bottom, margin.top]);

  $: colorScale = scaleOrdinal().domain(classSet).range(colors);

  // line generator
  $: sigmoidPath = line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y));

  $: sigmoidValue = (d) => sigmoidCurve[d]["y"];

  $: {
    if (sigmoidCurve[$Temperature - 20]["y"] > $DecisionBoundary) {
      $Prediction = "Sunny Day";
    } else {
      $Prediction = "Rainy Day";
    }
  }
</script>

<div id="scatter-chart" bind:offsetWidth={width} bind:offsetHeight={height}>
  <svg {width} height={height + margin.top + margin.bottom}>
    <!-- x ticks -->
    {#each xScale.ticks() as tick}
      <g transform={`translate(${xScale(tick)}, ${height - margin.bottom})`}>
        <!-- svelte-ignore component-name-lowercase -->
        <line
          class="grid-line"
          x1="0"
          x2="0"
          y1="0"
          y2={-height + margin.bottom + margin.top}
        />
        <text class="axis-text" y="15" text-anchor="middle" dy="5"
          >{tick}
        </text>
      </g>
    {/each}
    <!-- y ticks -->
    {#each yScale.ticks() as tick}
      <g transform={`translate(${margin.left}, ${yScale(tick)})`}>
        <!-- svelte-ignore component-name-lowercase -->
        <line
          class="grid-line"
          x1="0"
          x2={width - margin.left - margin.right}
          y1="0"
          y2="0"
        />
        <text
          class="axis-text"
          text-anchor="end"
          dx="-5"
          dominant-baseline="middle"
          >{formatter(tick)}
        </text>
      </g>
    {/each}

    <!-- axis lines -->
    <!-- svelte-ignore component-name-lowercase -->
    <line
      class="axis-line"
      x1={margin.left}
      x2={width - margin.right}
      y1={height - margin.bottom}
      y2={height - margin.bottom}
    />
    <!-- svelte-ignore component-name-lowercase -->
    <line
      class="axis-line"
      x1={margin.left}
      x2={margin.left}
      y1={height - margin.bottom}
      y2={margin.top}
    />

    <!-- points -->
    {#each scatterData1 as item}
      <circle
        class="scatter-circle"
        r="0"
        cx={xScale(item.Temperature)}
        cy={yScale(item.Weather)}
        fill={colorScale(item.Weather)}
        opacity="1"
      />
    {/each}

    <path class="sigmoid-line" d={sigmoidPath(sigmoidCurve)} stroke-width="0" />

    <!-- make x-element a function of x-axis -->
    <g transform={`translate(0, 0)`}>
      <circle
        class="example-circle"
        r="0"
        cx={xScale($Temperature)}
        cy={yScale(sigmoidValue($Temperature - 20))}
        fill={colorScale($Prediction)}
        stroke="var(--paper)"
        stroke-width="3"
        opacity="1"
      />
    </g>

    <!-- decision boundary -->
    <g
      transform={`translate(${margin.left}, ${yScale($DecisionBoundary) - 5})`}
    >
      <rect
        class="boundary-line"
        stroke="var(--squidink)"
        stroke-width="1.4"
        fill="var(--paper)"
        width={width - margin.right - margin.left}
        height={10}
        opacity={0}
      />
    </g>

    <!-- y-axis label -->
    <text
      class="axis-label"
      text-anchor="middle"
      transform={`translate(${25},${yScale(0.5)}) rotate(-90)`}
    >
      Probability
    </text>

    <!-- x-axis label -->
    <text
      class="axis-label"
      text-anchor="middle"
      x={xScale(63.6)}
      y={height - 10}
    >
      Temperature (Degrees Fahrenheit)
    </text>

    <!-- legend -->
    <g transform={`translate(${margin.left}, ${10})`}>
      {#each labels as Weather, i}
        <g transform={`translate(${i * 120} 0)`}>
          <circle class="legend-circle" r="0" fill={colorScale(i)} />
          <text
            class="legend-text"
            dominant-baseline="middle"
            x="20"
            font-size="0"
          >
            {labels[i]}
          </text>
        </g>
      {/each}
    </g>
  </svg>
</div>

<style>
  svg {
  }

  #scatter-chart {
    width: 100%;
    max-height: 98%;
  }

  .grid-line {
    fill: none;
    stroke: var(--squidink);
    stroke-dasharray: 4;
    stroke-opacity: 0.2;
  }

  .axis-line {
    fill: none;
    stroke: var(--squidink);
  }

  .axis-text {
    font-family: var(--font-heavy);
  }

  .axis-label {
    font-family: var(--font-heavy);
  }

  .legend-text {
    font-family: var(--font-heavy);
  }

  .sigmoid-line {
    fill: none;
    stroke: var(--squidink);
  }

  .arrow-holder {
    display: flex;
    paint-order: stroke fill;
    stroke: var(--paper);
    fill: black;
    font-family: var(--font-heavy);
    stroke-linejoin: round;
    stroke-width: 5px;
    pointer-events: none;
    font-size: 0;
  }

  .arrow-text {
    font-size: 13;
    text-anchor: start;
  }
</style>
