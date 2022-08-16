<script>
    import { onMount } from "svelte";
    import { extent } from "d3-array";
    import { scaleLinear } from "d3-scale";
    import { line, curveBasis } from "d3-shape";
    import { select } from "d3-selection";
    import { arrows  } from "../assets.js";
    import { margin, agent, agentPath } from "../data-store.js";
    import QValuePlot from "./QPlot.svelte";

  
    export let numX = 3;
    export let numY = 3;
  
  
    let data = [];
    // make dataset of [{x: 0, y: 0}, {x: 0, y: 1}, ..., {x: 3, y: 3}]
    for (let xVal = 0; xVal < numX; xVal++) {
      for (let yVal = 0; yVal < numY; yVal++) {
        data.push({ x: xVal, y: yVal });
      }
    }
  
    const width = 400;
    const height = 400;
  
    const cellWidth = width / numX;
    const cellHeight = height / numY;
  
    // scales
    $: xScale = scaleLinear().domain([0, numX]).range([0, width]);
  
    $: yScale = scaleLinear().domain([0, numY]).range([0, height]);
  
    // line generator
    $: agentLine = line()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y));
  </script>
  
  <svg {width} {height}>
  
    <!-- make arrows	 -->
    {#each data as d}
      <g
        transform="translate({xScale(d.x) + cellWidth / 2 - 5}, {yScale(d.y) +
          cellHeight / 2 -
          5})"
      >
      <!-- data={dataset[x][y]} -->
        <QValuePlot/>
      </g>
    {/each}
  
  </svg>
  
  <style>
    svg {
      border: 4px solid black;
      background-color: white;
    }
  
    .agent-rect {
      fill: white;
    }
  
    .grid-line {
      stroke-width: 0.5;
      stroke: black;
    }
    path.agent-line {
      fill: none;
      stroke: coral;
    }
  </style>
  