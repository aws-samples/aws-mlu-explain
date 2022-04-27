<!-- Credit to LayerCake for the source logic. Enhanced for multi-dimensionality. https://layercake.graphics/example/CirclePackForce -->
<!--
  @component
  Generates an SVG force simulation using [d3-force](https://github.com/d3/d3-force). The values here are defaults which you will likely have to customize because every force simulation is different. This technique comes from @plmrry.
 -->
 <script>
  import { getContext } from 'svelte';
  import {
    forceSimulation,
    forceX,
    forceY,
    forceManyBody,
    forceCollide,
  } from 'd3-force';
import { range } from 'd3-array';
import { updateData } from './utils';
import {kFoldsData} from '../scripts/store.js'

  const { width, height, xScale, yScale, zScale, xGet, yGet, zGet } = getContext('LayerCake');

  /** @type {Number} [manyBodyStrength=5] - The value passed into the `.strength` method on `forceManyBody`, which is used as the `'charge'` property on the simulation. See [the documentation](https://github.com/d3/d3-force#manyBody_strength) for more. */
  export let manyBodyStrength = 5;

  /** @type {Number} [xStrength=0.1] - The value passed into the `.strength` method on `forceX`, which is used as the `'x'` property on the simulation. See [the documentation](https://github.com/d3/d3-force#x_strength) for more. */
  export let xStrength = 0.1;

  /** @type {Number} [yStrength=0.1] - The value passed into the `.strength` method on `forceY`, which is used as the `'y'` property on the simulation. See [the documentation](https://github.com/d3/d3-force#y_strength) for more. */
  export let yStrength = 0.1;

  /** @type {String} [nodeColor] Set a color manually otherwise it will default to the `zScale`. */
  export let nodeColor = undefined;

  /** @type {String} [nodeStroke='#fff'] - The circle's stroke color. */
  export let nodeStroke = '#fff';

  /** @type {Number} [nodeStrokeWidth=1] - The circle's stroke width, in pixels. */
  export let nodeStrokeWidth = 1;
  
  /** @type {Number} [foldsCount=2] - The number of folds to apply to the data. */
  export let foldsCount = 5;

  /* --------------------------------------------
  * Make a copy because the simulation will alter the objects
  */

// $kFoldsData = updateData(foldsCount)
 
 let simulation = forceSimulation($kFoldsData)
 
 let nodes = []

 $:{
   $kFoldsData = updateData(foldsCount)
   simulation = forceSimulation($kFoldsData)
 }

 $: {
   simulation.on("tick", () => {
    nodes = simulation.nodes()  
  })
}
simulation = forceSimulation($kFoldsData)
  
  /* ----------------------------------------------
  * When variables change, set forces and restart the simulation
  */
 
 $: {
   simulation
   .force('charge', forceManyBody().strength(manyBodyStrength))
   .force('collision', forceCollide().radius((30/foldsCount) * .9))
   .force('x', forceX().x(d => $xScale(d.fold)).strength(xStrength))
   .force('y', forceY().y(d => $yScale(d.subFold)).strength(yStrength))
   .alpha(1)
   .restart()
  }

</script>
{#each range(0,foldsCount,1) as tick}
  <!-- svelte-ignore component-name-lowercase -->
    <text 
      x={$xScale(tick + 1)}
      y={$height}
      class="error-axis-text" 
      text-anchor="middle"
    >
      {`fold ${tick + 1}`}
    </text>
{/each}
  {#each nodes as point}
    <circle
      class='node'
      r={30/foldsCount}
      fill={nodeColor || $zGet(point)}
      stroke={nodeStroke}
      stroke-width={nodeStrokeWidth}
      cx='{point.x}'
      cy='{point.y}'
    />
  {/each}