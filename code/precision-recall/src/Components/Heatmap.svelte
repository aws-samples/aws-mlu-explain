<script>
  import { f1Precision, f1Recall } from "./data-store.js";
  import { scaleLinear } from "d3-scale";
  import { extent } from "d3-array";
  import { f1_data } from "./datasets.js";
  import { select } from "d3-selection";
  import { format } from "d3-format";

  const formatter = format(".1f");

  let height = 500;
  let width = 500;
  $: mobile = window.innerWidth <= 700;
  const margin = {
    top: mobile ? 40 : 30,
    bottom: mobile ? 10 : 30,
    left: mobile ? 0 : 50,
    right: mobile ? 0 : 10,
  };

  const rectBuffer = 2;

  let data = f1_data;
  $: f1Score = format(".2f")(
    (2 * parseFloat($f1Precision) * parseFloat($f1Recall)) /
      (parseFloat($f1Precision) + parseFloat($f1Recall))
  );

  $: rectWidth = width / 21 - rectBuffer;
  $: rectHeight = height / 21 - rectBuffer;

  let xExtent = extent(data, (d) => +d.precision);
  let yExtent = extent(data, (d) => +d.recall);

  let colorScale = scaleLinear()
    .domain([0, 0.33, 0.66, 1])
    .range(["#504bab", "#7e93ee", "#ff99ff", "#c9208a"]);
  $: xScale = scaleLinear()
    .domain(xExtent)
    .range([margin.left, width - margin.right]);
  $: yScale = scaleLinear()
    .domain(yExtent)
    .range([height - margin.top, margin.bottom]);

  function highlightPrecision() {
    const rect = select(this);
    $f1Precision = rect.attr("precision");
    $f1Recall = rect.attr("recall");
    rect.raise();
  }
</script>

<div id="f1-chart" bind:offsetWidth={width} bind:offsetHeight={height}>
  <svg
    width={width + margin.left + margin.right}
    height={height + margin.top + margin.bottom}
  >
    <!-- rects -->
    {#each data as d, i}
      <rect
        on:mouseover={highlightPrecision}
        on:focus={highlightPrecision}
        class="f1-rect"
        width={rectWidth}
        height={rectHeight}
        x={xScale(d.precision)}
        y={yScale(d.recall)}
        fill={colorScale(d.f1)}
        rx="3"
        ry="3"
        precision={d.precision}
        recall={d.recall}
      />
    {/each}
    <!-- axis lines -->
    <!-- x -->
    <!-- <line class='f1-axis-line' y1="{height}" y2="{height}" x1="{margin.left}" x2="{width }" stroke="black" stroke-width="2"></line> -->
    <!-- y -->
    <!-- <line class='f1-axis-line' y1="-3" y2="{height}" x1="{margin.left}" x2="{margin.left}" stroke="black" stroke-width="2"></line> -->

    <!-- x-ticks -->
    {#each xScale.ticks() as tick}
      <g transform={`translate(${xScale(tick) + rectWidth} ${height})`}>
        <text class="f1-axis-text" y="5" text-anchor="end"
          >{formatter(tick)}</text
        >
      </g>
    {/each}
    <!-- y-ticks -->
    {#each yScale.ticks() as tick}
      <g
        transform={`translate(${margin.left - 5} ${yScale(tick) + rectWidth})`}
      >
        <text class="f1-axis-text" y="-10" text-anchor="end"
          >{formatter(tick)}</text
        >
      </g>
    {/each}

    <!-- axis labels -->
    <text
      class="f1-axis-label"
      y={height + margin.bottom}
      x={(width + margin.left) / 2}
      text-anchor="middle">Precision</text
    >
    <text
      class="f1-axis-label"
      y={margin.left / 3}
      x={-(height / 2)}
      text-anchor="middle"
      transform="rotate(-90)">Recall</text
    >
    <text
      class="f1-axis-title"
      y={margin.top / 2}
      x={margin.left + rectWidth + margin.right}
      text-anchor="middle">F1-Score: {f1Score}</text
    >
  </svg>
</div>

<style>
  #f1-chart {
    margin: auto;
    max-height: 95%;
    width: 80%;
  }

  .f1-rect:hover {
    stroke: black;
    stroke-width: 3;
  }

  .f1-axis-text {
    font-family: var(--font-heavy);
    stroke-linejoin: round;
    fill: black;
    paint-order: stroke fill;
    stroke-width: 4px;
    pointer-events: none;
    stroke: white;
    font-size: 0.75rem;
  }

  .f1-axis-label,
  .f1-axis-title {
    font-family: var(--font-heavy);
    stroke-linejoin: round;
    fill: black;
    paint-order: stroke fill;
    stroke-width: 2px;
    pointer-events: none;
    stroke: white;
    font-size: 1.2rem;
  }

  .f1-axis-title {
    font-size: 1.3rem;
  }

  @media screen and (max-width: 768px) {
    #f1-chart {
      width: 90%;
    }
  }
</style>
