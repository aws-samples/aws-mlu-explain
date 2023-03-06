<script>
  import { draw } from "svelte/transition";
  import { extent } from "d3-array";
  import { scaleLinear } from "d3-scale";
  import { line, curveBasis } from "d3-shape";

  // props
  let data = [
    { age: 0, temp: 30 },
    { age: 1, temp: 40 },
    { age: 2, temp: 50 },
    { age: 3, temp: 65 },
    { age: 4, temp: 75 },
    { age: 5, temp: 76 },
    { age: 6, temp: 77 },
    { age: 7, temp: 200 },
  ];

  let height;
  let width;
  let margin = {
    top: 45,
    left: 55,
    bottom: 15,
    right: 15,
  };
  // scales
  $: xScale = scaleLinear()
    .domain(extent(data.map((d) => d.age)))
    .range([margin.left, width - margin.right]);

  $: yScale = scaleLinear()
    .domain(extent(data.map((d) => d.temp)))
    .range([height - margin.bottom, margin.top]);

  // the path generator
  $: pathLine = line()
    .x((d) => xScale(d.age))
    .y((d) => yScale(d.temp));
</script>

<div id="chart-holder" bind:offsetWidth={width} bind:offsetHeight={height}>
  <svg {width} height={height + margin.top + margin.bottom}>
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
    <path
      class="outer-path"
      transition:draw={{ duration: 2000 }}
      d={pathLine(data)}
    />
    <path
      class="inner-path"
      transition:draw={{ duration: 2000 }}
      d={pathLine(data)}
    />
    {#each data as d}
      <circle cx={xScale(d.age)} cy={yScale(d.temp)} r="10" />
    {/each}

    <!-- axis labels -->
    <text
      class="roc-axis-label"
      y={margin.top / 2}
      x={(width + margin.left) / 2}
      text-anchor="middle">Basic Chart Title</text
    >
    <text
      class="roc-axis-label"
      y={height + margin.top}
      x={(width + margin.left) / 2}
      text-anchor="middle">X-Axis Title</text
    >
    <text
      class="roc-axis-label"
      y={margin.right}
      x={-(height / 2)}
      text-anchor="middle"
      transform="rotate(-90)">Y-Axis Title</text
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
  .inner-path {
    stroke: black;
    stroke-width: 1;
    fill: none;
    stroke-linecap: round;
  }
  .outer-path {
    stroke: black;
    stroke-width: 3;
    fill: none;
    stroke-linecap: round;
  }
</style>
