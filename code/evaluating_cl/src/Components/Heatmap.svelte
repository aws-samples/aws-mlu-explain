<script>
    import { f1Precision, f1Recall } from './data-store.js';
    import { scaleLinear, scaleSequential } from "d3-scale"
    import { extent } from "d3-array"
    import { interpolate } from "d3-interpolate"
    import { f1_data } from "./animals.js"
    import { select } from 'd3-selection';

    let height = 500;
    let width = 500;
    const buffer = 20;
    const axisPad = 25;
    const rectBuffer = 2

    let data = f1_data;

    $: rectWidth = width / 21 - rectBuffer;
    $: rectHeight = height / 21 - rectBuffer;

    let f1Extent = extent(data, d => +d.f1)
    let xExtent = extent(data, d => +d.precision)
    let yExtent = extent(data, d => +d.recall)

    let colorScale = scaleSequential(interpolate('#7e93ee', '#ff99ff')).domain(f1Extent)
    $: xScale = scaleLinear().domain(xExtent).range([buffer + axisPad, width - buffer -axisPad])
    $: yScale = scaleLinear().domain(yExtent).range([height - buffer - axisPad, buffer])


    function highlightPrecision() {
        const rect = select(this);
        $f1Precision = rect.attr('precision')
        $f1Recall = rect.attr('recall')
        rect.raise();
    }

</script>

<div 
    id='f1-chart'
    bind:offsetWidth={width}
    bind:offsetHeight={height}
    >
    <svg width={width} height={height}>
        <!-- rects -->
        {#each data as d, i}
                <rect
                    on:mouseover={highlightPrecision}
                    on:focus={highlightPrecision}
                    class='f1-rect'
                    width={rectWidth}
                    height={rectHeight}
                    x={xScale(d.precision)}
                    y={yScale(d.recall)}
                    fill={colorScale(d.f1)}
                    rx=2
                    ry=2
                    precision={d.precision}
                    recall={d.recall}
                ></rect>
        {/each}
          <!-- axis lines -->
          <line class='f1-axis-line' y1="-3" y2="{height - buffer}" x1="{buffer}" x2="{buffer}" stroke="black" stroke-width="2"></line>
          <line class='f1-axis-line' y1="{height - buffer}" y2="{height - buffer}" x1="{buffer}" x2="{width - buffer}" stroke="black" stroke-width="2"></line>

          
        <!-- x-ticks -->
        {#each xScale.ticks() as tick}
            <g transform={`translate(${xScale(tick)} ${height - buffer })`}>
                <line y1="-5" y2="0" stroke="black"></line>
                <text class='f1-axis-text' y="10" text-anchor="middle">{tick}</text>
            </g>
        {/each}
        <!-- y-ticks -->
        {#each yScale.ticks() as tick}
            <g transform={`translate(${buffer} ${yScale(tick)})`}>
                <line y1="-5" y2="0" stroke="black"></line>
                <text class='f1-axis-text' y="15" text-anchor="middle">{tick}</text>
            </g>
        {/each}

        <!-- axis labels -->
        <text class='f1-axis-text' y="{height}" x="{(width + buffer) / 2}" text-anchor="middle">Precision</text>
        <text class='f1-axis-text' y="{height / 2}" x="{(buffer)}" text-anchor="middle">Recall</text>


      
    </svg>
</div>


<style>
    #f1-chart {
        margin: auto;
        max-height: 100%;
        width: 70%;
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

    .f1-axis-line {
        opacity: .5;
    }

</style>