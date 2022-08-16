<script>
  import { lineWorldData } from "../datasets.js";
  import { scaleLinear, scaleOrdinal } from "d3-scale";
  import { max, min, extent } from "d3-array";
  import { select, selectAll } from "d3-selection";
  import { transition } from "d3-transition";
  import { format } from "d3-format";
  import { line } from "d3-shape";
  import { insert_hydration_dev } from "svelte/internal";

  let width = 500;
  let height = 500;
  const margin = { top: 50, right: 40, bottom: 50, left: 70 };

  const colors = ["var(--cosmos)", "var(--sky)"];
  const labels = ["Tree A", "Tree B"];
  const classSet = new Set(lineWorldData.map((d) => d.action));
  // const stateSet = new Set(lineWorldData.map((d) => d.state));

  let stateSet = [0, 1, 2, 3, 4, 5, 6, 7];

  let left_data_state = "";
  let right_data_state = "";

  let qvalue_line_left = "";
  let qvalue_line_right = "";

  const formatter = format(".1f");

  const arrows = [
    "M0.200275 13.2782C0.200275 12.4153 0.89983 11.7157 1.76278 11.7157H23.6378C24.5007 11.7157 25.2003 12.4153 25.2003 13.2782C25.2003 14.1411 24.5007 14.8407 23.6378 14.8407H1.76278C0.89983 14.8407 0.200275 14.1411 0.200275 13.2782Z",
    "M11.5954 1.23584C12.2056 0.62565 13.1949 0.62565 13.8051 1.23584L24.7426 12.1733C25.3528 12.7835 25.3528 13.7729 24.7426 14.3831L13.8051 25.3206C13.1949 25.9307 12.2056 25.9307 11.5954 25.3206C10.9852 24.7104 10.9852 23.721 11.5954 23.1108L21.4281 13.2782L11.5954 3.44555C10.9852 2.83536 10.9852 1.84604 11.5954 1.23584Z",
    "M 11.5954 1.23584 C 12.2056 0.62565 13.1949 0.62565 13.8051 1.23584 L 24.7426 12.1733 C 25.3528 12.7835 25.3528 13.7729 24.7426 14.3831 L 13.8051 25.3206 C 13.1949 25.9307 12.2056 25.9307 11.5954 25.3206 C 10.9852 24.7104 10.9852 23.721 11.5954 23.1108 L 21.4281 13.2782 L 11.5954 3.44555 C 10.9852 2.83536 10.9852 1.84604 11.5954 1.23584 Z",
  ];

  $: xScale = scaleLinear()
    .domain([0, 75])
    .range([margin.left, width - margin.right]);

  $: yScale = scaleLinear()
    //   .domain([
    //     min(scatterData, (d) => d.Weather),
    //     max(scatterData, (d) => d.Weather),
    //   ])
    .domain([0, 10])
    .range([height - margin.bottom, margin.top]);

  $: colorScale = scaleOrdinal().domain(classSet).range(colors);

  const left_data = lineWorldData.filter((d) => d.action == "Left");
  const right_data = lineWorldData.filter((d) => d.action == "Right");

  //   const left_data_1 = lineWorldData.filter((d) => d.action == "Left" && d.state == "0");
  //   const right_data_1 = lineWorldData.filter((d) => d.action == "Right"  && d.state == "0");

  //   console.log(left_data_1)

  //   $: qvalue_line_left = line()
  //     .x((d) => xScale(d.episode))
  //     .y((d) => yScale(d.qvalue))(left_data);

  //   $: qvalue_line_right = line()
  //     .x((d) => xScale(d.episode))
  //     .y((d) => yScale(d.qvalue))(right_data);
</script>

<!-- {#each stateSet as state} -->
  {(() => {
    let state = 0;
    const left_data_state = left_data.filter((d) => d.state == state);
    const right_data_state = right_data.filter((d) => d.state == state);

    let qvalue_line_left = line()
      .x((d) => xScale(d.episode))
      .y((d) => yScale(d.qvalue))(left_data_state);

    let qvalue_line_right = line()
      .x((d) => xScale(d.episode))
      .y((d) => yScale(d.qvalue))(right_data_state);

    return ""; // return empty string so Svelte does not print it
  })()}

  <div id="qvalue-chart" bind:offsetWidth={width} bind:offsetHeight={height}>
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
      {#each left_data_state as item}
        <circle
          class="scatter-circle"
          r="5"
          cx={xScale(item.episode)}
          cy={yScale(item.qvalue)}
          fill={colorScale(item.action)}
          opacity="1"
        />
      {/each}
      {#each right_data_state as item}
        <circle
          class="scatter-circle"
          r="5"
          cx={xScale(item.episode)}
          cy={yScale(item.qvalue)}
          fill={colorScale(item.action)}
          opacity="1"
        />
      {/each}

      <path
        class="qvalue-line"
        d={qvalue_line_left}
        stroke-width="2"
        stroke={colorScale("Left")}
      />
      <path
        class="qvalue-line"
        d={qvalue_line_right}
        stroke-width="2"
        stroke={colorScale("Right")}
      />

      <!-- <text
        class="qvalue-line-label"
        d={qvalue_line_left}
        fill={colorScale("Left")}
        x={xScale(qvalue_line_left[qvalue_line_left.length - 1].episode) + 10}
        y={200}>Left</text
      > -->

      <!-- <text
        class="qvalue-line-label"
        d={qvalue_line_right}
        fill={colorScale("Right")}
        x={xScale(qvalue_line_right[qvalue_line_right.length - 1].episode) + 10}
        y={yScale(qvalue_line_right[qvalue_line_right.length - 1].qvalue) + 5}
        >Right</text
      > -->

      <!-- y-axis label -->
      <text
        class="axis-label"
        text-anchor="middle"
        transform={`translate(${40},${yScale(5)}) rotate(-90)`}
      >
        Q-Value
      </text>

      <!-- x-axis label -->
      <text
        class="axis-label"
        text-anchor="middle"
        x={width / 2}
        y={height - 10}
      >
        Episode
      </text>
    </svg>
  </div>
<!-- {/each} -->

<style>
  svg {
    width: 400px;
    height: 400px;
    border: 2px solid black;
  }

  #qvalue-chart {
    width: 400px;
    height: 400px;
    background-color: white;
    border: 1px solid black;
    margin: auto;
    margin-bottom: 0px;
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
    font-size: 8px;
  }

  .axis-label {
    font-family: var(--font-heavy);
    font-size: 8px;
  }

  .legend-text {
    font-family: var(--font-heavy);
  }

  .qvalue-line {
    fill: none;
  }

  .qvalue-line-label {
    display: flex;
    paint-order: stroke fill;
    stroke: var(--paper);
    /* fill: black; */
    font-family: var(--font-heavy);
    stroke-linejoin: round;
    stroke-width: 10px;
    /* pointer-events: none; */
    font-size: 10px;
  }
</style>
