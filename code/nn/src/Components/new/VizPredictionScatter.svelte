<script>
  import { max, min } from "d3-array";
  import { format } from "d3-format";
  import { hexbin } from "d3-hexbin";
  import { scaleLinear, scaleOrdinal } from "d3-scale";
  import { draw } from "svelte/transition";
  import { expoInOut, circOut } from "svelte/easing";
  import { animationDuration, hexPreds, hexVals } from "../../store";
  import { circles, moons } from "../../datasets";

  // props
  export let nnModel;
  export let data = circles;

  console.log("model!", nnModel);

  const hexbinRadius = 5;

  let outerHeight = 300;
  let outerWidth = 300;

  let margin = {
    top: 25,
    bottom: 5,
    left: 20,
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

  $: hexbins = hexbin()
    .radius(hexbinRadius)
    .extent([
      [0, 0],
      [width - margin.left - margin.right, height - margin.top - margin.bottom],
    ]);

  // (xScale.invert(h.x - margin.left), yScale.invert(h.y - margin.top)
  // $: console.log("centers", hexbins(hexbins.centers()));

  $: hexBins = hexbins(hexbins.centers()).map((h) => {
    return [xScale.invert(h.x + margin.left), yScale.invert(h.y + margin.top)];
  });

  $: $hexVals = [...hexBins];

  $: console.log("hexPreds", $hexPreds);
</script>

<div
  id="nn-prediction-container"
  bind:offsetWidth={outerWidth}
  bind:offsetHeight={outerHeight}
>
  <svg width={outerWidth} height={outerHeight}>
    <clipPath id="clip-nn">
      <rect
        width={width - margin.left - margin.right}
        height={height - margin.top - margin.bottom}
      />
    </clipPath>

    <!-- data points -->
    <!-- hex background todo: add clip-path="url(#clip)" -->
    <g
      clip-path="url(#clip-nn)"
      transform={`translate(${margin.left} ${margin.top})`}
    >
      <!-- hexbins -->
      {#each hexbins(hexbins.centers()) as h, i}
        <path
          in:draw={{ duration: 500 }}
          out:draw={{ duration: 0 }}
          class="hex-cell"
          d={`M${h.x},${h.y}${hexbins.hexagon()}`}
          fill={colorScale($hexPreds[i])}
          stroke={colorScale($hexPreds[i])}
        />
      {/each}
    </g>

    {#each data as d}
      <circle
        cx={xScale(d.x1)}
        cy={yScale(d.x2)}
        r="5"
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

    <text
      class="axis-label"
      y={margin.left / 2}
      x={-(height / 2)}
      text-anchor="middle"
      transform="rotate(-90)">Input 2</text
    >
    <text
      class="axis-label"
      y={height + margin.bottom + 11}
      x={(width + margin.left) / 2}
      text-anchor="middle">Input 1</text
    >
  </svg>
</div>

<style>
  circle {
    stroke: var(--bg);
    stroke-width: 2px;
  }

  .axis-label,
  .chart-title {
    font-size: 10px;
  }
  #nn-prediction-container {
    height: 100%;
    width: 100%;
  }
  .axis-line {
    stroke-width: 3;
    stroke: black;
    fill: none;
  }
  .hex-cell {
    /* stroke-width: 1;
    opacity: 0.4; */
  }
</style>
