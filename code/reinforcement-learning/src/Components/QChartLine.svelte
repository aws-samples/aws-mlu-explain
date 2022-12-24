<script>
  import { line } from "d3-shape";
  import { scaleLinear } from "d3-scale";
  import { format } from "d3-format";
  import { lineQValues, lineRecordInterval } from "../data-store.js";

  //   props
  export let height = 500;
  export let width = 500;
  export let index = 0;

  const margin = {
    top: 8,
    bottom: 12,
    left: 16,
    right: 0,
  };

  // label formatter
  const formatter = format(".2d");

  //   get max value for x-axis
  $: xMax = $lineQValues[0]["episodeNumber"][$lineQValues[0]["episodeNumber"].length -1];

  // scales
  $: xScale = scaleLinear()
    .domain([0, xMax + 1])
    .range([margin.left, width - margin.right]);
  $: yScale = scaleLinear()
    .domain([-0.5, 8])
    .range([height - margin.bottom, margin.top]);

  $: pathLeftData = $lineQValues[index]["left"].map((val, i) => {
    return { x: $lineRecordInterval*(i), y: val };
  });

  $: pathRightData = $lineQValues[index]["right"].map((val, i) => {
    return { x: $lineRecordInterval*(i), y: val };
  });

  //   d3 line generator
  $: pathGenerator = line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y));

    $: tickModulo =
  $lineQValues[0]["episodeNumber"][$lineQValues[0]["episodeNumber"].length -1] > 400
      ? 150
      : $lineQValues[0]["episodeNumber"][$lineQValues[0]["episodeNumber"].length -1] > 100
      ? 50
      : 10;

</script>

<!-- x-ticks -->
{#each xScale.ticks() as tick}
  <g transform={`translate(${xScale(tick) + 0} ${height - margin.bottom})`}>
    <text class="axis-text" y="7" text-anchor="middle"
      >{tick % tickModulo == 0 ? formatter(tick) : ""}</text
    >
  </g>
{/each}

<!-- y-ticks -->
{#each yScale.ticks() as tick}
  <g transform={`translate(${margin.left - 5} ${yScale(tick) + 0})`}>
    <text
      class="axis-text"
      y="0"
      dx="1"
      text-anchor="end"
      dominant-baseline="middle">{tick % 2 == 0 ? formatter(tick) : ""}</text
    >
  </g>
  <!-- axis lines -->
  <!-- svelte-ignore component-name-lowercase -->
  <line
    class="axis-line"
    x1={margin.left}
    x2={margin.left}
    y1={margin.top}
    y2={height - margin.bottom}
    stroke="black"
  />
  <!-- svelte-ignore component-name-lowercase -->
  <line
    class="axis-line"
    x1={margin.left}
    x2={width - margin.right}
    y1={height - margin.bottom}
    y2={height - margin.bottom}
    stroke="black"
  />
{/each}

<!-- reactively draw lines -->
<path class="q-path pathLeft-line" d={pathGenerator(pathLeftData)} />
<path class="q-path pathRight-line" d={pathGenerator(pathRightData)} />

<style>
  .q-path {
    stroke-width: 2;
    fill: none;
  }
  .pathUp-line {
    stroke: coral;
    stroke: var(--anchor);
  }
  .pathDown-line {
    stroke: var(--sky);
  }
  .pathLeft-line {
    stroke: green;
    stroke: var(--magenta);
  }
  .pathRight-line {
    stroke: purple;
    stroke: var(--peach);
  }

  .axis-text {
    font-size: 0.4rem;
  }

  /* ipad */
  @media screen and (max-width: 950px) {
  }
  /* mobile */
  @media screen and (max-width: 750px) {
  }
</style>
