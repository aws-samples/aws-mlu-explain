<script>
  import { max, min } from "d3-array";
  import { format } from "d3-format";
  import { scaleLinear, scaleOrdinal } from "d3-scale";
  import { circles } from "../../datasets";

  // props
  let data = circles;

  let outerHeight = 300;
  let outerWidth = 300;

  let margin = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  const formatter = format(".0%");

  $: width = outerWidth - margin.left - margin.right;
  $: height = outerHeight - margin.top - margin.bottom;

  $: xScale = scaleLinear()
    .domain([
      1.1 * min(data.map((d) => d.x1)),
      max(data.map((d) => d.x1)) * 1.1,
    ])
    .range([margin.left, width - margin.right]);

  $: yScale = scaleLinear()
    .domain([
      1.1 * min(data.map((d) => d.x2)),
      max(data.map((d) => d.x2)) * 1.1,
    ])
    .range([height - margin.bottom, margin.top]);

  const colorScale = scaleOrdinal()
    .domain([-1, 1])
    .range(["#f46ebb", "#2074d5"]);
</script>

<div
  id="dataset-icon-container"
  bind:offsetWidth={outerWidth}
  bind:offsetHeight={outerHeight}
>
  <svg width={outerWidth} height={outerHeight}>
    <!-- data points -->

    {#each data as d}
      <circle
        cx={xScale(d.x1)}
        cy={yScale(d.x2)}
        r="2"
        fill={colorScale(d.y)}
      />
    {/each}

    <!-- axis labels -->
    <text
      class="chart-title"
      y={margin.top / 2}
      x={(width + margin.left) / 2}
      text-anchor="middle">Classification Task</text
    >
  </svg>
</div>

<style>
  #dataset-icon-container {
    outline: 1px solid black;
  }
  circle {
    stroke: var(--bg);
    stroke-width: 2px;
  }

  .axis-label,
  .chart-title {
    font-size: 10px;
  }
  #dataset-icon-container {
    height: 100%;
    width: 100%;
  }
</style>
