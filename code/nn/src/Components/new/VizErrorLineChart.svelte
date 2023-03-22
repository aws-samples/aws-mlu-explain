<script>
  import { max, min } from "d3-array";
  import { format } from "d3-format";
  import { scaleLinear } from "d3-scale";
  import { draw } from "svelte/transition";
  import { expoInOut, circOut } from "svelte/easing";

  let points = [{ x: 0, y: 0 }];

  const initialCount = points.length;

  let outerHeight = 300;
  let outerWidth = 300;

  let margin = {
    top: 25,
    bottom: 5,
    left: 35,
    right: 0,
  };

  const formatter = format(".0%");

  $: width = outerWidth - margin.left - margin.right;
  $: height = outerHeight - margin.top - margin.bottom;

  $: xScale = scaleLinear()
    .rangeRound([margin.left, width - margin.right])
    .domain([
      0,
      max(points, (d) => d.x) * 1.5 < 5 ? 5 : max(points, (d) => d.x) * 1.3,
    ]);

  $: yScale = scaleLinear()
    .rangeRound([height - margin.bottom, margin.top])
    .domain([0, 100]);

  $: path = `M${xScale(points[0].x)},${yScale(points[0].y)}
	${points
    .slice(1, initialCount)
    .map((p) => `L${xScale(p.x)},${yScale(p.y)}`)
    .join(" ")}`;

  $: console.log("path", path);
  function addPoint() {
    const randomPoint = {
      x: points.length,
      y: 10 + Math.floor(Math.random() * 20),
    };
    points = [...points, randomPoint];
  }
</script>

<!-- <button on:click={addPoint}> Add Point </button> -->
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
    {#each xScale.ticks() as tick}
      {#if tick % 1 == 0}
        <g transform={`translate(${xScale(tick)} ${height - margin.bottom})`}>
          <line
            class="axis-tick"
            x1="0"
            x2="0"
            y1={0}
            y2={-height + margin.bottom + margin.top}
            stroke="var(--squidink)"
            stroke-dasharray="4"
          />
          <text class="axis-text" y="10" text-anchor="middle">{tick}</text>
        </g>
      {/if}
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

    <path
      transition:draw={{
        duration: points.length * 300,
        delay: 300,
        easing: expoInOut,
      }}
      d={path}
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    {#each points.slice(initialCount) as point, i}
      <path
        transition:draw={{ duration: 500, delay: 0 }}
        d={`M${xScale(points[initialCount - 1 + i].x)},${yScale(
          points[initialCount - 1 + i].y
        )} L${xScale(point.x)},${yScale(point.y)}`}
      />
    {/each}

    {#each points as point}
      <circle cx={xScale(point.x)} cy={yScale(point.y)} />
    {/each}

    <!-- axis labels -->
    <text
      class="chart-title"
      y={margin.top / 2}
      x={(width + margin.left) / 2}
      text-anchor="middle">Model Accuracy</text
    >

    <text
      class="axis-label"
      y={margin.left / 2}
      x={-(height / 2)}
      text-anchor="middle"
      transform="rotate(-90)">Accuracy (%)</text
    >
    <text
      class="axis-label"
      y={height + margin.bottom + 11}
      x={(width + margin.left) / 2}
      text-anchor="middle">Epoch #</text
    >
  </svg>
</div>

<style>
  path {
    fill: none;
    stroke: black;
    stroke-width: 3;
  }
  circle {
    stroke: #888;
    stroke-width: 2px;
    fill: aliceblue;
    r: 5;
  }

  .axis-label,
  .chart-title {
    font-size: 10px;
  }
  #stackedrect-holder {
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
    stroke: blue;
    fill: none;
    opacity: 0.175;
    font-size: 8px;
  }
  .axis-text {
    font-family: Arial;
    font-size: 9px;
  }
</style>
