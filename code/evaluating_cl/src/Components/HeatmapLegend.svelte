<script>
    import { onMount } from 'svelte';
    import { f1Precision, f1Recall } from './data-store.js';
    import { scaleLinear, scaleOrdinal } from "d3-scale"
    import { extent } from "d3-array"
    import { f1_data } from "./datasets.js"
    import { select } from 'd3-selection';
    import { format } from "d3-format";
    import { stack } from "d3-shape"

    const formatter = format(".2f") 

    let height = 500;
    let width = 500;
    const rectBuffer = 1;
    $: rectHeight = height / 21 - rectBuffer;

    $: mobile = window.innerWidth <= 700;

    const margin = { 
        top: mobile ? 40 : 30, 
        bottom: mobile ? 10 : 30, 
        left: mobile ? 0 : 50, 
        right: mobile ? 0 : 10 
    };


    let data = [0, 0.05, 0.1, 0.15, .2, 0.25, .3, 0.35,  .4, 0.45, .5, 0.55, .6, 0.65, .7, 0.75, .8, 0.85, .9, 0.95, 1];
    let colorScale = scaleLinear().domain([0, .33, .66, 1]).range([ '#504bab', '#7e93ee', '#ff99ff','#c9208a'])
    $: yScale = scaleLinear().domain([0, 1]).range([height - margin.top, margin.bottom])


    const tickValues = [0, .25, .5, .75, 1.0]
</script>

<div 
    id='f1-legend'
    bind:offsetWidth={width}
    bind:offsetHeight={height}
    >
    <svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
        <!-- rects -->
        {#each data as d, i}
                <rect
                    class='f1-legend-rect'
                    width={15}
                    height={rectHeight}
                    x={0}
                    y={yScale(d)}
                    fill={colorScale(d)}
                    rx=1
                    ry=1
                ></rect>
        {/each}
        <!-- add legend -->

        <!-- y -->
        <!-- <line class='f1-legend-line' y1="{margin.top}" y2="{height - rectHeight + rectBuffer*2}" x1="{10}" x2="{10}" stroke="black" stroke-width="2"></line> -->
        <!-- y-ticks -->
        {#each [-0.01, .25, .5, .75, 1.01] as tick, i}
        <g transform={`translate(${30} ${yScale(tick)})`}> 
                <text class='f1-axis-text' y="{rectHeight/2}" dominant-baseline="middle" text-anchor="middle">
                    {formatter(tickValues[i])}
                    <!-- {formatter(tick)} -->
                </text>
            </g>
        {/each}





      
    </svg>
</div>


<style>
    svg {
        /* border: 1px solid red; */
    }
    #f1-legend {
        margin: auto;
        max-height: 95%;
        width: 80%;
    }

    .f1-rect:hover {
        stroke: black;
        stroke-width: 3;
    }

    .f1-axis-text {
        font-family: var(--font-heavy);
        stroke-linejoin: round;
        fill: black;
        paint-order: stroke fill;
        stroke-width: 4px;
        pointer-events: none;
        stroke: white;
        font-size: .75rem;
    }

    .f1-axis-label, .f1-axis-title {
        font-family: var(--font-heavy);
        stroke-linejoin: round;
        fill: black;
        paint-order: stroke fill;
        stroke-width: 2px;
        pointer-events: none;
        stroke: white;
        font-size: 1.2rem;
    }

    .f1-axis-title {
        font-size: 1.3rem;
    }

    @media screen and (max-width: 768px) {
        #f1-legend {
            width: 90%;
        }
  }

</style>