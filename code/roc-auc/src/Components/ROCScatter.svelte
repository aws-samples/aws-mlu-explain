<script>
  import { area, curveStep, line } from "d3-shape";
  import { scaleLinear } from "d3-scale";
  import { rocData } from "../datasets.js";
  import { format } from "d3-format";

  const formatter = format(".1f");

  // these don't matter, but make the stretching less obvious at load
  let height = 500;
  let width = 500;
  // responsive margins
  const mobile = window.innerWidth <= 700;
  const margin = {
    top: mobile ? 20 : 20,
    bottom: mobile ? 10 : 25,
    left: mobile ? 0 : 50,
    right: mobile ? 0 : 40,
  };

  // scales
  $: xScale = scaleLinear()
    .domain([0.0, 1.0])
    .range([margin.left, width - margin.right]);
  $: rocScale = scaleLinear()
    .domain([0.0, 1.0])
    .range([height - margin.bottom, margin.top]);

  // line generator
  $: rocPath = line()
    .x((d) => xScale(d.fpr))
    .y((d) => rocScale(d.tpr));
  // .curve(curveStep);

  $: aucPath = area()
    .x((d) => xScale(d.fpr))
    .y1((d) => rocScale(d.tpr))
    .y0(rocScale(0));
  // .curve(curveStep);
</script>

<div id="roc-scatter-chart" bind:offsetWidth={width} bind:offsetHeight={height}>
  <svg {width} height={height + margin.top + margin.bottom}>
    <!-- x-ticks -->
    {#each xScale.ticks() as tick}
      <g transform={`translate(${xScale(tick) + 0} ${height - margin.bottom})`}>
        <!-- svelte-ignore component-name-lowercase -->
        <line
          class="y-axis-line"
          x1="0"
          x2="0"
          y1="0"
          y2={-height + margin.bottom + margin.top}
          stroke="black"
          stroke-dasharray="4"
        />
        <text class="error-axis-text" y="15" text-anchor="end">{tick}</text>
      </g>
    {/each}
    <!-- y-ticks -->
    {#each [0, 0.2, 0.4, 0.6, 0.8, 1.0] as tick}
      <g transform={`translate(${margin.left - 5} ${rocScale(tick) + 0})`}>
        <!-- svelte-ignore component-name-lowercase -->
        <line
          class="y-axis-line"
          x1="0"
          x2={width - margin.right - margin.left}
          y1="0"
          y2="0"
          stroke="black"
          stroke-dasharray="4"
        />
        <text
          class="error-axis-text"
          y="0"
          text-anchor="end"
          dominant-baseline="middle">{formatter(tick)}</text
        >
      </g>
    {/each}
    <!-- axis lines -->
    <!-- x -->
    <!-- svelte-ignore component-name-lowercase -->
    <line
      class="error-axis-line"
      y1={height - margin.bottom}
      y2={height - margin.bottom}
      x1={margin.left}
      x2={width}
      stroke="black"
      stroke-width="0"
    />
    <!-- y -->
    <!-- svelte-ignore component-name-lowercase -->
    <line
      class="error-axis-line"
      y1={margin.top}
      y2={height - margin.bottom}
      x1={margin.left}
      x2={margin.left}
      stroke="black"
      stroke-width="0"
    />

    <!-- our data -->
    <!-- <path class="outline-line" d={auc(rocData)} /> -->
    <path class="path-line" d={rocPath(rocData)} stroke="#9e1f63" />

    <!-- circles -->
    {#each rocData as d}
      <circle
        class="roc-circle"
        fill="#9e1f63"
        stroke-width="1.5"
        r="5.5"
        cx={xScale(d.fpr)}
        cy={rocScale(d.tpr)}
      />
    {/each}

    <!-- chart labels -->
    <text
      id="error-text-accuracy"
      class="error-text"
      y={rocScale(0.79)}
      x={xScale(9.2)}
      dominant-baseline="middle">Label</text
    >

    <!-- axis labels -->
    <text
      class="error-axis-label"
      y={height + margin.bottom}
      x={(width + margin.left) / 2}
      text-anchor="middle">FPR</text
    >
    <text
      class="error-axis-label"
      y={margin.left / 3}
      x={-(height / 2)}
      text-anchor="middle"
      transform="rotate(-90)">TPR</text
    >
  </svg>
</div>

<style>
  svg {
    /* border: 3px solid teal; */
  }

  #roc-scatter-chart {
    /* margin: auto; */
    width: 95%;
    max-height: 90%;
    padding-left: 3%;
    /* max-height: 50%; */
    /* border: 3px solid skyblue; */
  }

  .error-text {
    text-transform: uppercase;
    font-family: var(--font-heavy);
    stroke-linejoin: round;
    paint-order: stroke fill;
    stroke-width: 4.5px;
    pointer-events: none;
    stroke: #f1f3f3;
    font-size: 0.9rem;
    letter-spacing: 2px;
  }
  .error-axis-text {
    font-size: 0.9rem;
  }

  .y-axis-line {
    opacity: 0.2;
  }

  #error-text-accuracy {
    fill: #c9208a;
  }

  .error-axis-label {
    text-transform: uppercase;
    font-size: 1rem;
  }

  .path-line {
    fill: none;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 2;
  }

  .outline-line {
    fill: none;
    stroke: #f1f3f3;
    stroke-width: 10;
  }

  #random-roc-line {
    stroke-dasharray: 2;
  }

  /* ipad */
  @media screen and (max-width: 950px) {
    #error-chart {
      max-height: 55vh;
      width: 85%;
      margin: 1rem auto;
    }
    .error-axis-label {
      font-size: 0.8rem;
    }
    .error-axis-text {
      font-size: 0.8rem;
    }
    .error-text {
      stroke-width: 3.5px;
      stroke: #f1f3f3;
      font-size: 0.8rem;
      letter-spacing: 2px;
    }
    .path-line {
      stroke-width: 5;
    }
    .outline-line {
      stroke-width: 9;
    }
  }
  /* mobile */
  @media screen and (max-width: 750px) {
    #error-chart {
      max-height: 55vh;
      width: 95%;
      margin: 1rem auto;
    }

    .error-axis-label {
      font-size: 0.75rem;
    }
    .error-axis-text {
      font-size: 0.7rem;
    }
    .error-text {
      stroke-width: 3px;
      stroke: #f1f3f3;
      font-size: 0.7rem;
      letter-spacing: 1px;
    }
    .path-line {
      stroke-width: 4;
    }
    .outline-line {
      stroke-width: 7;
    }
  }
</style>
