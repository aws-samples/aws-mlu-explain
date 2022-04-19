<script>
  import { forceSimulation, forceX, forceY, forceCollide } from "d3-force";
  import { scatterData } from "../datasets";
  import { scaleLinear } from "d3-scale";
  let height = 500;
  let width = 500;
  const margin = {
    top: 15,
    bottom: 25,
    left: 42,
    right: 20,
  };
  const r = 6;
  const xGet = (d) => d.x;
  const stroke = "black";
  const strokeWidth = 1;

  // scales
  $: xScale = scaleLinear().domain([0, 1]).range([0, 500]);
  // $: xScale = scaleLinear()
  //   .domain([-1, 10])
  //   .range([margin.left, width - margin.right]);

  //   import { getContext } from "svelte";
  //   import { forceSimulation, forceX, forceY, forceCollide } from "d3-force";
  //   const { data, xGet, height, zGet } = getContext("LayerCake");
  // console.log("scatterData", scatterData);
  const nodes = scatterData.map((d) => ({ ...d }));
  // const nodes2 = scatterData.map((d) => ({ ...d }));
  // console.log("nodes", nodes);
  // console.log("nodes2", nodes2);

  // $: nodes = scatterData.map((d) => {
  //   return {
  //     x: xScale(+d.x),
  //     y: d.y,
  //   };
  // });

  //   /** @type {Number} [r=4] – The circle radius size in pixels. */
  //   export let r = 6;
  //   /** @type {Number} [strokeWidth=1] – The circle's stroke width in pixels. */
  //   export let strokeWidth = 1;
  //   /** @type {String} [stroke='#fff'] – The circle's stroke color. */
  //   export let stroke = "#fff";
  //   /** @type {Number} [xStrength=0.95] – The value passed into the `.strength` method on `forceX`. See [the documentation](https://github.com/d3/d3-force#x_strength). */
  export let xStrength = 0.95;
  //   /** @type {Number} [yStrength=0.075] – The value passed into the `.strength` method on `forceY`. See [the documentation](https://github.com/d3/d3-force#y_strength). */
  export let yStrength = 0.075;
  //   /** @type {Function} [getTitle] — An accessor function to get the field on the data element to display as a hover label using a `<title>` tag. */
  //   export let getTitle = (d) => d.weight;
  $: simulation = forceSimulation(nodes)
    .force(
      "x",
      forceX()
        .x((d) => d.xVal)
        .strength(0.95)
    )
    .force(
      "y",
      forceY()
        .y(height / 2)
        .strength(yStrength)
    )
    .force("collide", forceCollide(r + 2))
    .stop();
  $: {
    for (
      let i = 0,
        // n = 120;
        // The REPL thinks there is an infinite loop with this next line but it's generally a better way to go
        n = Math.ceil(
          Math.log(simulation.alphaMin()) /
            Math.log(1 - simulation.alphaDecay())
        );
      i < n;
      ++i
    ) {
      simulation.tick();
    }
  }
</script>

<div id="beeswarm-chart" bind:offsetWidth={width} bind:offsetHeight={height}>
  <svg {width} height={height + margin.top + margin.bottom}>
    <g class="bee-group">
      {#each simulation.nodes() as node}
        <!-- <g class="node-g"> -->
        <circle
          class="node"
          outcome={node.outcome}
          fill={"red"}
          {stroke}
          stroke-width={strokeWidth}
          {r}
          cx={node.x}
          cy={node.y}
        />
        <!-- <text
            text-anchor="middle"
            x={node.x}
            y={node.y + r / 2}
            fill={node.outcome === "Positive" ? "white" : "white"}
          >
            {node.outcome === "Positive" ? "+" : "-"}
          </text> -->
        <!-- </g> -->
      {/each}
    </g>
  </svg>
</div>

<style>
  svg {
    border: 2px solid black;
  }

  #beeswarm-chart {
    margin: auto;
    width: 95%;
    max-height: 95%;
    /* max-height: 50%; */
    /* border: 3px solid skyblue; */
  }
</style>
