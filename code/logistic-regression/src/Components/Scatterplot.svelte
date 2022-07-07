<script>
  import { scatterData, sigmoidCurve } from "../datasets.js";
  import { scaleLinear, scaleOrdinal } from "d3-scale";
  import { max, min, extent } from "d3-array";
  import { select, selectAll } from "d3-selection";
  import { transition } from "d3-transition";
  import { line } from "d3-shape";


  let width = 500;
  let height = 500;
  const margin = { top: 50, right: 40, bottom: 50, left: 70 };

  const colors = ["#ff9900", "#003181"];
  const labels = ["Rainy Day", "Rainless Day"];
  const classSet = new Set(scatterData.map((d) => d.Weather));

  async function loadData() {
    let weather = new Set(scatterData.map((d) => d.Weather));

    return {
      data: scatterData,
      xScale,
      yScale,
      Weather: Array.from(weather),
    };
  }

  $: xScale = scaleLinear()
    .domain([
      20, 100,
      // min(scatterData, (d) => +d.Temperature),
      // max(scatterData, (d) => +d.Temperature),
    ])
    .range([margin.left, width - margin.right]);

  $: yScale = scaleLinear()
    .domain([
      min(scatterData, (d) => d.Weather),
      max(scatterData, (d) => d.Weather),
    ])
    .range([height - margin.bottom, margin.top]);

  $: colorScale = scaleOrdinal().domain(classSet).range(colors);

  // line generator
  $: sigmoidPath = line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y));

  let data = loadData();

  export function hidePoints() {
    selectAll(".scatter-circle").transition().delay(500).attr("r", 0);
  }

  export function showPoints() {
    selectAll(".scatter-circle").transition().delay(500).attr("r", 5);
  }

  export function hideCurve() {
    selectAll(".sigmoid-line").transition().delay(500).attr("stroke-width", 0);
  }

  export function showCurve() {
    selectAll(".sigmoid-line").transition().delay(500).attr("stroke-width", 5);
  }

  export function hideBoundary() {
    selectAll(".boundary-line").transition().delay(500).attr("stroke-width", 0);
  }

  export function showBoundary() {
    selectAll(".boundary-line").transition().delay(500).attr("stroke-width", 10);
  }
</script>

<div id="scatter-chart" bind:offsetWidth={width} bind:offsetHeight={height}>
  {#await data then scatterData}
    <svg {width} height={height + margin.top + margin.bottom}>
      <!-- x ticks -->
      {#each xScale.ticks() as d}
        <g transform={`translate(${xScale(d)}, ${height - margin.bottom})`}>
          <!-- svelte-ignore component-name-lowercase -->
          <line
            class="grid-line"
            x1="0"
            x2="0"
            y1="0"
            y2={-height + margin.bottom + margin.top}
          />
          <text class="axis-text" y="15" text-anchor="middle" dy="5">{d} </text>
        </g>
      {/each}
      <!-- y ticks -->
      {#each yScale.ticks() as d}
        <g transform={`translate(${margin.left}, ${yScale(d)})`}>
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
            >{d}
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
      {#each scatterData.data as item}
        <circle
          class="scatter-circle"
          r="0"
          cx={xScale(item.Temperature)}
          cy={yScale(item.Weather)}
          fill={colorScale(item.Weather)}
          opacity="0.9"
        />
      {/each}

      <path
        class="sigmoid-line"
        d={sigmoidPath(sigmoidCurve)}
        stroke="black"
        stroke-width="0"
      />

      <!-- svelte-ignore component-name-lowercase -->
      <!-- <line
        class="boundary-line"
        stroke="#f1f3f3"
        x1={margin.left}
        x2={width - margin.right}
        y1={yScale(0.5)}
        y2={yScale(0.5)}
        stroke-width="0"
      /> -->

      <!-- y-axis label -->
      <text
        text-anchor="middle"
        transform={`translate(${25},${yScale(0.5)}) rotate(-90)`}
      >
        Weather
      </text>

      <!-- x-axis label -->
      <text text-anchor="middle" x={xScale(63.6)} y={height - 10}>
        Temperature (Degrees Fahrenheit)
      </text>

      <!-- legend -->
      <g transform={`translate(${margin.left}, ${20})`}>
        {#each labels as Weather, i}
          <g transform={`translate(${i * 110} 0)`}>
            <circle r="5" fill={colorScale(i)} />
            <text dominant-baseline="middle" x="20">
              {labels[i]}
            </text>
          </g>
        {/each}
      </g>
    </svg>
  {/await}
</div>

<style>
  svg {
    /* background-color: blue; */
  }

  #scatter-chart {
    width: 100%;
    max-height: 98%;
  }

  .grid-line {
    fill: none;
    stroke: black;
    stroke-dasharray: 4;
    stroke-opacity: 0.2;
  }

  .axis-line {
    fill: none;
    stroke: black;
  }

  .sigmoid-line {
    fill: none;
    stroke: black;
    /* stroke-opacity: 0; */
    /* stroke-width: 0; */
  }


  /* .charts-container {
    position: sticky;
    top: 10%;
    display: grid;
    width: 50%;
    grid-template-columns: 100%;
    grid-row-gap: 2rem;
    grid-column-gap: 0rem;
    grid-template-rows: repeat(2, 1fr);
    height: 85vh;
    border: 3px solid black;
  } */
</style>
