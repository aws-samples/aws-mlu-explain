<script>
  import { scaleLinear } from "d3-scale";
  import { format } from "d3-format";

  const formatter = format(".2f");

  let height = 500;
  let width = 500;
  const rectBuffer = 1;
  $: rectHeight = height / 21 - rectBuffer;
  $: mobile = window.innerWidth <= 700;

  const margin = {
    top: mobile ? 40 : 30,
    bottom: mobile ? 10 : 30,
    left: mobile ? 0 : 30,
    right: mobile ? 0 : 10,
  };

  let data = [
    0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65,
    0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1,
  ];
  let colorScale = scaleLinear()
    .domain([0, 0.33, 0.66, 1])
    .range(["#504bab", "#7e93ee", "#ff99ff", "#c9208a"]);
  $: yScale = scaleLinear()
    .domain([0, 1])
    .range([height - margin.top, margin.bottom]);

  const tickValues = [0, 0.25, 0.5, 0.75, 1.0];
</script>

<div id="f1-legend" bind:offsetWidth={width} bind:offsetHeight={height}>
  <svg
    width={width + margin.left + margin.right}
    height={height + margin.top + margin.bottom}
  >
    <!-- rects -->
    {#each data as d, i}
      <rect
        class="f1-legend-rect"
        width={15}
        height={rectHeight}
        x={0}
        y={yScale(d)}
        fill={colorScale(d)}
        rx="1"
        ry="1"
      />
    {/each}

    <!-- y-ticks -->
    {#each [-0.01, 0.25, 0.5, 0.75, 1.01] as tick, i}
      <g transform={`translate(${30} ${yScale(tick)})`}>
        <text
          class="f1-axis-text"
          y={rectHeight / 2}
          dominant-baseline="middle"
          text-anchor="middle"
        >
          {formatter(tickValues[i])}
        </text>
      </g>
    {/each}
  </svg>
</div>

<style>
  #f1-legend {
    margin: auto;
    max-height: 95%;
    width: 75%;
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

  @media screen and (max-width: 768px) {
    #f1-legend {
      width: 75%;
    }
  }
</style>
