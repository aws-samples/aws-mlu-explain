<script>
  import { scatterData, sigmoidCurve } from "../datasets.js";
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
  const classSet = new Set(scatterData.map((d) => d.Weather));

  const formatter = format(".1f");

  const arrows = [
    "M0.200275 13.2782C0.200275 12.4153 0.89983 11.7157 1.76278 11.7157H23.6378C24.5007 11.7157 25.2003 12.4153 25.2003 13.2782C25.2003 14.1411 24.5007 14.8407 23.6378 14.8407H1.76278C0.89983 14.8407 0.200275 14.1411 0.200275 13.2782Z",
    "M11.5954 1.23584C12.2056 0.62565 13.1949 0.62565 13.8051 1.23584L24.7426 12.1733C25.3528 12.7835 25.3528 13.7729 24.7426 14.3831L13.8051 25.3206C13.1949 25.9307 12.2056 25.9307 11.5954 25.3206C10.9852 24.7104 10.9852 23.721 11.5954 23.1108L21.4281 13.2782L11.5954 3.44555C10.9852 2.83536 10.9852 1.84604 11.5954 1.23584Z",
    "M 11.5954 1.23584 C 12.2056 0.62565 13.1949 0.62565 13.8051 1.23584 L 24.7426 12.1733 C 25.3528 12.7835 25.3528 13.7729 24.7426 14.3831 L 13.8051 25.3206 C 13.1949 25.9307 12.2056 25.9307 11.5954 25.3206 C 10.9852 24.7104 10.9852 23.721 11.5954 23.1108 L 21.4281 13.2782 L 11.5954 3.44555 C 10.9852 2.83536 10.9852 1.84604 11.5954 1.23584 Z",
  ];

  $: xScale = scaleLinear()
    .domain([20, 100])
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

  $: sigmoidValue = (d) => sigmoidCurve[d]["y"];

  $: {
    if (sigmoidCurve[$Temperature - 20]["y"] > $DecisionBoundary) {
      $Prediction = "Sunny Day";
    } else {
      $Prediction = "Rainy Day";
    }
  }

  export function hidePoints() {
    selectAll(".scatter-circle").transition().delay(1000).attr("r", 0);
    selectAll(".legend-circle").transition().delay(1000).attr("r", 0);
    selectAll(".legend-text").transition().delay(1000).attr("font-size", 0);
  }

  export function showPoints() {
    selectAll(".scatter-circle").transition().delay(1000).attr("r", 5);
    selectAll(".legend-circle").transition().delay(1000).attr("r", 5);
    selectAll(".legend-text").transition().delay(1000).attr("font-size", 16);
  }

  export function hideCurve() {
    selectAll(".sigmoid-line").transition().delay(1000).attr("stroke-width", 0);
  }

  export function showCurve() {
    selectAll(".sigmoid-line").transition().delay(1000).attr("stroke-width", 5);
  }

  export function hideBoundary() {
    selectAll(".boundary-line").transition().delay(1000).attr("opacity", 0);
    selectAll(".arrow-text").transition().delay(1000).attr("font-size", 0);
    selectAll(".bottom-arrow").transition().delay(1000).attr("fill", "none");
    selectAll(".top-arrow").transition().delay(1000).attr("fill", "none");
    selectAll(".bottom-arrow")
      .transition()
      .delay(1000)
      .attr("stroke-width", "0");
    selectAll(".top-arrow").transition().delay(1000).attr("stroke-width", "0");
    selectAll(".bottom-arrow").transition().delay(1000).attr("stroke", "none");
    selectAll(".top-arrow").transition().delay(1000).attr("stroke", "none");
  }

  export function showBoundary() {
    selectAll(".boundary-line").transition().delay(1000).attr("opacity", 1);
    selectAll(".arrow-text").transition().delay(1000).attr("font-size", 13);
    selectAll(".bottom-arrow")
      .transition()
      .delay(1000)
      .attr("fill", "var(--anchor)");
    selectAll(".top-arrow")
      .transition()
      .delay(1000)
      .attr("fill", "var(--smile");
    selectAll(".bottom-arrow")
      .transition()
      .delay(1000)
      .attr("stroke", "var(--anchor)");
    selectAll(".top-arrow")
      .transition()
      .delay(1000)
      .attr("stroke", "var(--smile");
    selectAll(".bottom-arrow").transition().delay(1000).attr("stroke-width", 3);
    selectAll(".top-arrow").transition().delay(1000).attr("stroke-width", 3);
  }

  export function hideExample() {
    selectAll(".example-circle").transition().delay(1000).attr("r", 0);
  }

  export function showExample() {
    selectAll(".example-circle").transition().delay(1000).attr("r", 13);
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
    {#each scatterData as item}
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

    <!-- bottom arrow -->
    <g
      class="arrow-holder"
      transform={`translate(${margin.left + 50} ${
        yScale($DecisionBoundary) + 15
      })`}
    >
      <text class="arrow-text" x="-14" y="0" dominant-baseline="middle"
        >Predict</text
      >
      <text class="arrow-text" x="-14" y="13" dominant-baseline="middle"
        >Rainy</text
      >
      <g transform="translate(-20 -8)">
        {#each arrows as arrow}
          <path
            class="bottom-arrow"
            d={arrow}
            style={`transform: rotate(90deg) scale(0.8)`}
            stroke-width="0"
            fill="none"
            stroke="none"
          />
        {/each}
      </g>
    </g>
    <!-- top arrow -->
    <g
      class="arrow-holder"
      transform={`translate(${margin.left + 50} ${
        yScale($DecisionBoundary) - 25
      })`}
    >
      <text class="arrow-text" x="-14" y="0" dominant-baseline="middle"
        >Predict</text
      >
      <text class="arrow-text" x="-14" y="10" dominant-baseline="middle"
        >Sunny</text
      >
      <g transform={`translate(-40 16)`}>
        {#each arrows as arrow}
          <path
            class="top-arrow"
            d={arrow}
            style={`transform: rotate(-90deg) scale(0.8)`}
            stroke-width="0"
            fill="none"
            stroke="none"
          />
        {/each}
      </g>
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
