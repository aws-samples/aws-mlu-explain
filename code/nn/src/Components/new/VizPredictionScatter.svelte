<script>
  import { draw } from "svelte/transition";
  import { extent } from "d3-array";
  import { hexbin } from "d3-hexbin";

  import { scaleLinear, scaleOrdinal } from "d3-scale";
  import { line, curveBasis } from "d3-shape";
  import { circles } from "../../datasets";

  // props
  let data = circles;

  const hexbinRadius = 5;

  let height;
  let width;
  let margin = {
    top: 45,
    left: 15,
    bottom: 15,
    right: 15,
  };

  const colorScale = scaleOrdinal()
    .domain([0, 1])
    .range(["#f46ebb", "#2074d5"]);

  $: hexbins = hexbin()
    .radius(hexbinRadius)
    .extent([
      [0, 0],
      [width - margin.right - margin.left, height - margin.top],
    ]);

  // scales
  $: xScale = scaleLinear()
    .domain(extent(data.map((d) => d.x1)))
    .range([margin.left, width - margin.right]);

  $: yScale = scaleLinear()
    .domain(extent(data.map((d) => d.x2)))
    .range([height - margin.bottom, margin.top]);
</script>

<div id="chart-holder" bind:offsetWidth={width} bind:offsetHeight={height}>
  <svg {width} height={height + margin.top + margin.bottom}>
    <clipPath id="clip-nn">
      <rect
        stroke="red"
        stroke-width="5"
        width={width - margin.left}
        {height}
      />
    </clipPath>
    <rect stroke="red" stroke-width="5" width={width - margin.left} {height} />
    <line
      class="axis-line"
      x1={margin.left}
      x2={width - margin.right}
      y1={height}
      y2={height}
    />
    <line
      class="axis-line"
      x1={margin.left}
      x2={margin.left}
      y1={margin.top}
      y2={height}
    />
    <!-- x-ticks -->
    {#each xScale.ticks() as tick}
      <g transform={`translate(${xScale(tick) + 0} ${height + margin.bottom})`}>
        <line
          class="axis-tick"
          x1="0"
          x2="0"
          y1={-margin.bottom}
          y2={-height + margin.bottom * 2}
          stroke="black"
          stroke-dasharray="4"
        />
        <text class="axis-text" y="0" text-anchor="middle">{tick}</text>
      </g>
    {/each}
    <!-- y-ticks -->
    {#each yScale.ticks() as tick}
      <g transform={`translate(${margin.left - 5} ${yScale(tick) + 0})`}>
        <line
          class="axis-tick"
          x1={4}
          x2={width - margin.right - margin.left}
          y1="0"
          y2="0"
          stroke="black"
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

    <!-- hex background todo: add clip-path="url(#clip)" -->
    <g
      clip-path="url(#clip-nn)"
      transform={`translate(${margin.left} ${margin.top})`}
    >
      <!-- hexbins -->
      {#each hexbins(hexbins.centers()) as h}
        <path
          in:draw={{ duration: 500 }}
          out:draw={{ duration: 0 }}
          class="hex-cell"
          d={`M${h.x},${h.y}${hexbins.hexagon()}`}
        />
      {/each}
    </g>

    {#each data as d}
      <circle cx={xScale(d.x1)} cy={yScale(d.x2)} r="5" />
    {/each}

    <!-- axis labels -->
    <text
      class="roc-axis-label"
      y={margin.top / 2}
      x={(width + margin.left) / 2}
      text-anchor="middle">Data</text
    >
  </svg>
</div>

<style>
  #chart-holder {
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
    stroke: black;
    fill: none;
    opacity: 0.25;
  }
  .axis-text {
    font-family: Arial;
    font-size: 12px;
  }
  circle {
    fill: yellow;
    stroke: black;
    stroke-width: 2;
  }
</style>
