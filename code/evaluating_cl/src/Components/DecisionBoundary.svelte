<!--
  @component
  Generates an SVG decision boundary. 
 -->
 <script>
    import { getContext } from 'svelte';
    import { draggable } from 'svelte-drag';
    import { select, selectAll } from "d3-selection";

    import { TP, FP, TN, FN } from './data-store.js';

    const { data, xScale, xRange, yRange } = getContext('LayerCake');
    // const nodes = $data.map((d) => ({ ...d }));
    // console.log('nodes', nodes)


    function updateCounts(e) {
        console.log('EEE', e)
        // get xposition of decision boundary
        const xPos = $xScale.invert(e.detail.offsetX);
        console.log('xPos', xPos)
        let circs = selectAll('circle')
        let pos = circs.filter(function(d) { return select(this).attr('animal') == 'Cow'})
        let neg = circs.filter(function(d) { return select(this).attr('animal') == 'Pig'})
        // let pos = circs.filter(function(d){ 
            // return $xScale.invert(select(this).attr('cx')) >= xPos
            //  cirlceX >= xPos 
        // })
             
        $TP = pos.filter(function(d) { return $xScale.invert(select(this).attr('cx')) >= xPos }).size();
        $FP = pos.filter(function(d) { return $xScale.invert(select(this).attr('cx')) < xPos }).size();
        $TN = neg.filter(function(d) { return $xScale.invert(select(this).attr('cx')) >= xPos }).size();
        $FN = neg.filter(function(d) { return $xScale.invert(select(this).attr('cx')) < xPos }).size();
        console.log('t', pos.size())
     
        // count positives to the left of line

        // count negatives to the right of line

        // count positives to the left of line
        $TN += 1
        // $xRange[0] + $xRange[1]) / 2
    }
    
  

        
    /** @type {String} [fill='#00bbff'] – The shape's fill color. This is technically optional because it comes with a default value but you'll likely want to replace it with your own color. */
    export let fill = '#232F3E';
  </script>
  
  <g class="bar" 
  use:draggable={{ axis: 'x', bounds: 'parent'}}
  on:svelte-drag:start={(e) => {
  }}
  on:svelte-drag={(e) => {
      updateCounts(e);
  }}
  on:svelte-drag:end={(e) => ''}
  >
      <rect
        class='decision-boundary-bar'
        data-id="decision-boundary-bar"
        x="{$xRange[0]}"
        y="0"
        height="{$yRange[0]}"
        width="{12}"
        stroke="whitesmoke"
        stroke-width="1"
        {fill}
      ></rect>
  </g>