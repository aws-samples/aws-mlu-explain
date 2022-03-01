<script>
    import { scaleLinear, scaleSequential } from "d3-scale"
    import { extent } from "d3-array"
    import { interpolate } from "d3-interpolate"
    import { f1_data } from "./datasets.js"

    let height;
    let width;
    const buffer = 20;
    const axisPad = 25;

    let data = f1_data


    // let data = [
    //     {'precision': 4, 'recall': 6, 'name': 'jared'},
    //     {'precision': 1, 'recall': 16, 'name': 're'},
    //     {'precision': 5, 'recall': 4, 'name': 'bb'},
    //     {'precision': 2, 'recall': 9, 'name': 'bb'},
    //     {'precision': 14, 'recall': 16, 'name': 'jared'},
    //     {'precision': 11, 'recall': 6, 'name': 're'},
    //     {'precision': 15, 'recall': 14, 'name': 'bb'},
    //     {'precision': 12, 'recall': 19, 'name': 'bb'},
    // ];

    // colors
    // const colors = ['red', 'blue', 'green']
    // let names = new Set(data.map(d => d.name))
    // let colorScale = scaleOrdinal().domain(names).range(colors)

    $: rectSize = width / 25 - 2;

    let f1Extent = extent(data, d => +d.f1)
    let xExtent = extent(data, d => +d.precision)
    let yExtent = extent(data, d => +d.recall)

    let colorScale = scaleSequential(interpolate('#504bab', '#c9208a')).domain(f1Extent)
    $: xScale = scaleLinear().domain(xExtent).range([buffer + axisPad, width - buffer])
    $: yScale = scaleLinear().domain(yExtent).range([height - buffer - axisPad, buffer])

</script>

<section id="f1-chart-holder">
<div 
    id='f1-chart'
    bind:offsetWidth={width}
    bind:offsetHeight={height}
    >

   <!-- circles -->
    <svg width={width} height={height}>
        {#each data as d, i}
            <!-- <circle
                r={buffer/2}
                cx={xScale(d.precision)}
                cy={yScale(d.recall)}
                fill={colorScale(d.f1)}
                ></circle> -->
                <rect
                    class='f1-rect'
                    width={rectSize}
                    height={rectSize}
                    x={xScale(d.precision)}
                    y={yScale(d.recall)}
                    fill={colorScale(d.f1)}
                ></rect>
                    
        {/each}
    <!-- x-ticks -->
    {#each xScale.ticks() as tick}
        <g transform={`translate(${xScale(tick)} ${height - 20})`}>
            <line y1="-5" y2="0" stroke="black"></line>
            <text y="15" text-anchor="middle">{tick}</text>
        </g>
    {/each}
     <!-- y-ticks -->
     {#each yScale.ticks() as tick}
        <g transform={`translate(${10} ${yScale(tick)})`}>
            <line y1="-5" y2="0" stroke="black"></line>
            <text y="15" text-anchor="middle">{tick}</text>
        </g>
 {/each}
        
     
    </svg>


</div>
</section>


<style>
    #f1-chart-holder {
        padding: 2rem;
    }
     #f1-chart {
        margin: auto;
        max-width: 675px;
        width: 50%;
        height: 40vh;
    }

</style>