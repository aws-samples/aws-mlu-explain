<script>
    y
</script>

<section id='f1-chart'>

   
    <svg>
        {#each data as d, i}
        <g transform={`translate(50, ${i*30})`}>
            <rect width={d.recall*3}
                height="10"
                fill="red"
                x="5"
                y="5"
                >
            </rect>
            <text 
                dominant-baseline="middle" 
                text-anchor='end'
                y="10"
                x="2"
                >{d.name}
            </text>
            <text
                x="{d.recall * 3 + 10}"
                dominant-baseline="middle" 
                y="10"
            >{d.recall}
        </text>
        </g>
        {/each}
    </svg>


</section>


<style>
    #f1-chart {
        margin: auto;
        max-width: 575px;
        padding: 2rem;
    }
    svg {
        border: 2px solid black;
        width: 100%;
    }
</style>