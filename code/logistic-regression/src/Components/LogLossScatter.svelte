<script>
  import { logLossY0, logLossY1 } from "../datasets.js";
  import { scaleLinear, scaleOrdinal } from "d3-scale";
  import { max, min, extent } from "d3-array";
  import { select, selectAll } from "d3-selection";
  import { transition } from "d3-transition";
  import { format } from "d3-format";
  import { line } from "d3-shape";
  import { llProbability, yVal } from "../data-store.js";

  let width = 500;
  let height = 500;
  const margin = { top: 50, right: 40, bottom: 50, left: 70 };

  const colors = ["#003181", "#ff9900"];
  const labels = ["y=0", "y=1"];

  const formatter = format(".1f");
  const formatter_loss = format(".2f");

  const arrows = [
    "M0.200275 13.2782C0.200275 12.4153 0.89983 11.7157 1.76278 11.7157H23.6378C24.5007 11.7157 25.2003 12.4153 25.2003 13.2782C25.2003 14.1411 24.5007 14.8407 23.6378 14.8407H1.76278C0.89983 14.8407 0.200275 14.1411 0.200275 13.2782Z",
    "M11.5954 1.23584C12.2056 0.62565 13.1949 0.62565 13.8051 1.23584L24.7426 12.1733C25.3528 12.7835 25.3528 13.7729 24.7426 14.3831L13.8051 25.3206C13.1949 25.9307 12.2056 25.9307 11.5954 25.3206C10.9852 24.7104 10.9852 23.721 11.5954 23.1108L21.4281 13.2782L11.5954 3.44555C10.9852 2.83536 10.9852 1.84604 11.5954 1.23584Z",
    "M 11.5954 1.23584 C 12.2056 0.62565 13.1949 0.62565 13.8051 1.23584 L 24.7426 12.1733 C 25.3528 12.7835 25.3528 13.7729 24.7426 14.3831 L 13.8051 25.3206 C 13.1949 25.9307 12.2056 25.9307 11.5954 25.3206 C 10.9852 24.7104 10.9852 23.721 11.5954 23.1108 L 21.4281 13.2782 L 11.5954 3.44555 C 10.9852 2.83536 10.9852 1.84604 11.5954 1.23584 Z",
  ];

  $: xScale = scaleLinear()
    .domain([0, 1])
    .range([margin.left, width - margin.right]);

  $: yScale = scaleLinear()
    .domain([0, 5])
    .range([height - margin.bottom, margin.top]);

  $: colorScale = scaleOrdinal().domain([0, 1]).range(colors);

  // line generator
  $: lossPath = line()
    .x((d) => xScale(d.Probability))
    .y((d) => yScale(d.LogLoss));

  $: lossValueY0 = (d) => logLossY0[d]["LogLoss"];
  $: lossValueY1 = (d) => logLossY1[d]["LogLoss"];

</script>

<div id="loss-chart" bind:offsetWidth={width} bind:offsetHeight={height}>
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
          >{formatter(d)}
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

    <path
      id="loss-line-0"
      class="loss-line"
      d={lossPath(logLossY0)}
      stroke-width="3"
      stroke={colorScale(0)}
    />

    <path
      id="loss-line-1"
      class="loss-line"
      d={lossPath(logLossY1)}
      stroke-width="3"
      stroke={colorScale(1)}
    />

    <g transform={`translate(0, 0)`}>
      <circle
        class="example-circle"
        r="10"
        cx={xScale($llProbability)}
        cy={$yVal
          ? yScale(-Math.log(1 - $llProbability))
          : yScale(-Math.log($llProbability))}
        fill="var(--sky)"
        opacity="1"
      />
    </g>

    <g
      class="arrow-holder"
      transform={`translate(${margin.left + 55} ${margin.top + 7})`}
    >
      <g transform={`translate(-40 16)`}>
        {#each arrows as arrow}
          <path
            class="y1-arrow"
            d={arrow}
            style={`transform: rotate(-90deg) scale(0.8)`}
            stroke="#ff9900"
            fill="#ff9900"
          />
        {/each}
        <text 
          class="arrow-text" 
          x="25" 
          y="0" 
          dominant-baseline="middle">To Infinity</text>
      </g>
    </g>

    <g
      class="arrow-holder"
      transform={`translate(${width - 35} ${margin.top + 7})`}
    >
      <g transform={`translate(-40 16)`}>
        {#each arrows as arrow}
          <path
            class="y0-arrow"
            d={arrow}
            style={`transform: rotate(-90deg) scale(0.8)`}
            stroke="#003181"
            fill="#003181"
          />
        {/each}
        <text 
          class="arrow-text" 
          x="-70" 
          y="0" 
          dominant-baseline="middle">To Infinity</text>
      </g>
    </g>

    <!-- y-axis label -->
    <text
      class="axis-label"
      text-anchor="middle"
      transform={`translate(${25},${yScale(2.5)}) rotate(-90)`}
    >
      Log-Loss
    </text>

    <!-- x-axis label -->
    <text
      class="axis-label"
      text-anchor="middle"
      x={xScale(0.5)}
      y={height - 10}
    >
      Predicted Probability
    </text>

    <!-- legend -->
    <g transform={`translate(${margin.left + 5}, ${20})`}>
      {#each labels as label, i}
        <g transform={`translate(${i * 75} 0)`}>
          <!-- svelte-ignore component-name-lowercase -->
          <line
            x1="-5"
            y1="0"
            x2="15"
            y2="0"
            class="legend-line"
            stroke-width="3"
            stroke={colorScale(i)}
          />
          <text class="legend-text" dominant-baseline="middle" x="20">
            {labels[i]}
          </text>
        </g>
      {/each}
    </g>

    <text
      class="loss-text"
      x={xScale($llProbability) + 10}
      y={$yVal
        ? yScale(-Math.log(1 - $llProbability))
        : yScale(-Math.log($llProbability))}
      >{formatter_loss(
        $yVal ? -Math.log(1 - $llProbability) : -Math.log($llProbability)
      )}</text
    >
  </svg>
</div>

<style>
  svg {
  }

  #loss-chart {
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

  .legend-line {
    fill: none;
  }

  .loss-line {
    fill: none;
  }

  .arrow-holder {
    display: flex;
    paint-order: stroke fill;
    stroke: var(--paper);
    fill: black;
    stroke-linejoin: round;
    stroke-width: 5px;
    pointer-events: none;
  }

  .arrow-text {
    font-family: var(--font-heavy);
    font-size: 14px;
    text-anchor: start;
  }

  .loss-text {
    stroke-linejoin: round;
    paint-order: stroke fill;
    stroke-width: 4px;
    pointer-events: none;
    stroke: var(--paper);
    font-size: 0.8rem;
    letter-spacing: 2px;
  }
</style>
