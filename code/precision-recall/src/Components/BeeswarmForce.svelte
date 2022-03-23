<!--
	@component
	Generates an SVG Beeswarm chart using a [d3-force simulation](https://github.com/d3/d3-force).
 -->
<script>
  import { getContext } from "svelte";
  import { forceSimulation, forceX, forceY, forceCollide } from "d3-force";

  const { data, xGet, height, zGet } = getContext("LayerCake");

  const nodes = $data.map((d) => ({ ...d }));

  /** @type {Number} [r=4] – The circle radius size in pixels. */
  export let r = 6;

  /** @type {Number} [strokeWidth=1] – The circle's stroke width in pixels. */
  export let strokeWidth = 1;

  /** @type {String} [stroke='#fff'] – The circle's stroke color. */
  export let stroke = "#fff";

  /** @type {Number} [xStrength=0.95] – The value passed into the `.strength` method on `forceX`. See [the documentation](https://github.com/d3/d3-force#x_strength). */
  export let xStrength = 0.95;

  /** @type {Number} [yStrength=0.075] – The value passed into the `.strength` method on `forceY`. See [the documentation](https://github.com/d3/d3-force#y_strength). */
  export let yStrength = 0.075;

  /** @type {Function} [getTitle] — An accessor function to get the field on the data element to display as a hover label using a `<title>` tag. */
  export let getTitle = (d) => d.weight;

  $: simulation = forceSimulation(nodes)
    .force(
      "x",
      forceX()
        .x((d) => $xGet(d))
        .strength(xStrength)
    )
    .force(
      "y",
      forceY()
        .y($height / 2)
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

<g class="bee-group">
  {#each simulation.nodes() as node}
    <g class="node-g">
      <circle
        class="node"
        outcome={node.outcome}
        fill={$zGet(node)}
        {stroke}
        stroke-width={strokeWidth}
        {r}
        cx={node.x}
        cy={node.y}
      />
      <text
        text-anchor="middle"
        x={node.x}
        y={node.y + r / 2}
        fill={node.outcome === "Positive" ? "white" : "white"}
      >
        {node.outcome === "Positive" ? "+" : "-"}
      </text>
    </g>
  {/each}
</g>
