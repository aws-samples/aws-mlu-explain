<!-- Credit to LayerCake for the source logic. Enhanced for multi-dimensionality. https://layercake.graphics/example/CirclePackForce -->
<!--
  @component
  Generates an SVG force simulation using [d3-force](https://github.com/d3/d3-force). The values here are defaults which you will likely have to customize because every force simulation is different. This technique comes from @plmrry.
 -->
 <script>
  import { getContext } from 'svelte';
  import {scale, draw} from 'svelte/transition'
	import { quintIn, quintOut } from 'svelte/easing';
  import {
    forceSimulation,
    forceX,
    forceY,
    forceCollide,
  } from 'd3-force';
import { range } from 'd3-array';
import { updateData } from './utils';

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

  /** @type {Number} [datasetSize=50] - n, or the number of observations in the dataset size */
  export let datasetSize = 50;

  /** @type {Number} [radius=10] - A default value for circle radii when the foldscount isn't interactive */
  export let radius;

  /** @type {Boolean} [interactive=false] - logic to help change the behavior of the circles */
  export let interactive = false;

  /* --------------------------------------------
  * Make a copy because the simulation will alter the objects
  */

let nodes = [];
let scaleInTransition = {
  duration: 100,
  easing: quintIn,
  opacity: .8
}
let scaleOutTransition = {
  duration: 200, 
  easing: quintOut,
  opacity: .8
}

$: circleRadius = (radius || 40/foldsCount)
$: data = updateData(foldsCount,datasetSize)
$: simulation = forceSimulation(data)

 $: {
   simulation.on("tick", () => {
    nodes = simulation.nodes()  
  })
}
  
  /* ----------------------------------------------
  * When variables change, set forces and restart the simulation
  */
 
 $: {
   simulation
  //  .force('center',forceCenter([200, 200]))
  //  .force('charge', forceManyBody().strength(manyBodyStrength))
   .force('collision', forceCollide().radius((circleRadius) * .95))
   .force('x', forceX().x(d => $xScale(d.fold)).strength(xStrength))
   .force('y', forceY().y(d => $yScale(d.subFold)).strength(yStrength))
   .alpha(.8)
  //  .restart()
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
      {`${foldsCount <= 10 ? 'fold ' : ''}${tick + 1}`}
    </text>
{/each}
{#each range(1,foldsCount+1,1) as highlight}
<circle
  in:draw="{{
    duration: 1000,
    delay: interactive ? 1000 : (highlight * 2000) / foldsCount
    }}"
  out:scale="{scaleOutTransition}"
  class='highlightCircle'
  r={($xScale.range()[1]/foldsCount)/3}
  cx={$xScale(highlight)}
  cy={$yScale(highlight)}
  stroke={$zScale('validate')}
  stroke-width={circleRadius * .2}
  fill='none'
/>
{/each}
  {#each nodes as point}
    <circle
    in:scale="{scaleInTransition}"
    out:scale="{scaleOutTransition}"
      class='node'
      r={circleRadius}
      fill={$zGet(point) || nodeColor}
      stroke={ nodeStroke }
      stroke-width={circleRadius * .1}
      cx='{point.x}'
      cy='{point.y}'
      />
      {/each}
<style>
  .node {
    shape-rendering:"geometricPrecision";
    stroke-opacity:1;
    fill-opacity:.8
  }
</style>