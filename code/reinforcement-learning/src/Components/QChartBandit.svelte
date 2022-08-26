<script>
  import { line } from "d3-shape";
  import { scaleLinear } from "d3-scale";
  import { format } from "d3-format";
  import { banditQValues } from "../data-store.js";

  //   props
  export let width = 400;
  export let height = 400;
  export let index = 0;

  const margin = { top: 50, right: 40, bottom: 50, left: 70 };

  //   const colors = ["var(--cosmos)", "var(--sky)"];
  //   const labels = ["Tree A", "Tree B"];
  //   const classSet = new Set(twoOptionsData.map((d) => d.tree));

  // const formatter = format(".1f");
  // label formatter
  const formatter = format(".2d");

  //   get max value for x-axis
  $: xMax = $banditQValues[0]["left"].length;

  $: xScale = scaleLinear()
    .domain([0, xMax + 1])
    .range([margin.left, width - margin.right]);

  $: yScale = scaleLinear()
    .domain([-5, 5])
    .range([height - margin.bottom, margin.top]);

  //   $: colorScale = scaleOrdinal().domain(classSet).range(colors);

  //   const treeA_data = twoOptionsData.filter((d) => d.tree == "A");
  //   const treeB_data = twoOptionsData.filter((d) => d.tree == "B");

  $: pathLeftData = $banditQValues[index]["left"].map((val, i) => {
    return { x: i, y: val };
  });

  $: pathRightData = $banditQValues[index]["right"].map((val, i) => {
    return { x: i, y: val };
  });

  //   d3 line generator
  $: pathGenerator = line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y));

  //   $: qvalue_line_treeA = line()
  //     .x((d) => xScale(d.episode))
  //     .y((d) => yScale(d.qvalue))(treeA_data);

  //   $: qvalue_line_treeB = line()
  //     .x((d) => xScale(d.episode))
  //     .y((d) => yScale(d.qvalue))(treeB_data);
</script>

<!-- x-ticks -->
{#each xScale.ticks() as tick}
  <g transform={`translate(${xScale(tick) + 0} ${height - margin.bottom})`}>
    <text class="axis-text" y="7" text-anchor="middle"
      >{tick % 2 == 0 ? formatter(tick) : ""}</text
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
<path class="pathLeft-line" d={pathGenerator(pathLeftData)} />
<path class="pathRight-line" d={pathGenerator(pathRightData)} />

<!-- reactively draw circles -->
{#each pathLeftData as d}
  <circle class="pathLeft-circle" r="1.5" cx={xScale(d.x)} cy={yScale(d.y)} />
{/each}
{#each pathRightData as d}
  <circle class="pathRight-circle" r="1.5" cx={xScale(d.x)} cy={yScale(d.y)} />
{/each}

<style>

  /* #qvalue-chart {
    width: 400px;
    height: 400px;
    background-color: white;
    border: 1px solid black;
    margin: auto;
    margin-bottom: 0px;
  } */

  /* .grid-line {
    fill: none;
    stroke: var(--squidink);
    stroke-dasharray: 4;
    stroke-opacity: 0.2;
  } */

  .pathLeft-line {
      stroke: green;
      stroke-width: 1;
      fill: none;
    }
    .pathRight-line {
      stroke: purple;
      stroke-width: 1;
      fill: none;
    }
  
    .pathLeft-circle {
      fill: green;
    }
  
    .pathRight-circle {
      fill: purple;
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
    /* font-size: 12; */
  }
</style>
