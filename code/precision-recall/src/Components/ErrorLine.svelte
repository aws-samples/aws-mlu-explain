<script>
    import { line, curveLinear, curveStep, curveCatmullRom } from 'd3-shape';
    import { scaleLinear } from "d3-scale";
    import { errorData } from "./datasets";
    import { format } from "d3-format";

    const formatter = format(".0%")
    const formatterX = format(".1f")

    let height = 500;
    let width = 500;

    const margin = {
        top: 15,
        bottom: 25,
        left: 42,
        right: 20
    }


    $: xScale = scaleLinear().domain([0, 14.4]).range([margin.left, width - margin.right])
    $: xScale2 = scaleLinear().domain([0, 1]).range([margin.left, width - margin.right])
    $: accuracyScale = scaleLinear().domain([0.0, 1]).range([height - margin.bottom, margin.top])
    $: precisionScale = scaleLinear().domain([0.0, 1]).range([height - margin.bottom, margin.top])
    $: recallScale = scaleLinear().domain([0.0, 1]).range([height - margin.bottom, margin.top])
    $: f1ScoreScale = scaleLinear().domain([0.0, 1]).range([height - margin.bottom, margin.top])


  
    $: accuracyPath = line()
      .x(d => xScale(d.thresh))
      .y(d => accuracyScale(d.accuracy))
      .curve(curveLinear);

    $: precisionPath = line()
      .x(d => xScale(d.thresh))
      .y(d => precisionScale(d.precision))
      .curve(curveLinear);

    $: recallPath = line()
      .x(d => xScale(d.thresh))
      .y(d => recallScale(d.recall))
      .curve(curveLinear);

    $: f1ScorePath = line()
      .x(d => xScale(d.thresh))
      .y(d => f1ScoreScale(d.f1_score))
      .curve(curveLinear);





  </script>


<h1 class='body-header'>The Tradeoff... Again</h1>
<p class='body-text'>
    To wrap everything up, let's look again at our cancer dataset again, this time from the lens of the tradeoff between the four different evaluation metrics
    we've discussed: <span class='bold'>accuracy</span>, <span class='bold'>precision</span>, <span class='bold'>recall</span>, and the <span class='bold'>F1-score</span>.
    To view this tradeoff explicitly, we'll plot each metric's score as a function of our classification threshold:
</p>
<br>
<div 
    id='error-chart'
    bind:offsetWidth={width}
    bind:offsetHeight={height}
>
    <svg width={width} height={height + margin.top + margin.bottom}>
        <!-- y-ticks -->
        {#each [0.2, 0.4, 0.6, 0.8, 1.0] as tick}
            <g transform={`translate(${margin.left - 5} ${accuracyScale(tick) + 0})`}>
                <!-- svelte-ignore component-name-lowercase -->
                <line class='y-axis-line' x1="0" x2="{width - margin.right - margin.left}" y1="0" y2="0" stroke="black"></line>
                <text class='error-axis-text' y="0" text-anchor="end" dominant-baseline="middle">{formatter(tick)}</text>
            </g>
        {/each}
        <!-- axis lines -->
        <!-- x -->
        <!-- svelte-ignore component-name-lowercase -->
        <line class='error-axis-line' y1="{height - margin.bottom}" y2="{height - margin.bottom}" x1="{margin.left}" x2="{width }" stroke="black" stroke-width="2"></line>
        <!-- y -->
        <!-- svelte-ignore component-name-lowercase -->
        <line class='error-axis-line' y1="{margin.top}" y2="{height - margin.bottom}" x1="{margin.left}" x2="{margin.left}" stroke="black" stroke-width="2"></line>

        <path class='outline-line' d='{accuracyPath(errorData)}' ></path>
        <path class='path-line' d='{accuracyPath(errorData)}' stroke='#c9208a'></path>
        <path class='outline-line' d='{precisionPath(errorData)}' ></path>
        <path class='path-line' d='{precisionPath(errorData)}' stroke='#ab00d6'></path>
        <path class='outline-line' d='{recallPath(errorData)}' ></path>
        <path class='path-line' d='{recallPath(errorData)}' stroke='#7cd1ea'></path>
        <path class='outline-line' d='{f1ScorePath(errorData)}' ></path>
        <path class='path-line' d='{f1ScorePath(errorData)}' stroke='#005276'></path>


        <!-- chart labels -->
        <text id='error-text-recall' class='error-text' y="{recallScale(1)}" x="{xScale(0.3)}" dominant-baseline="middle">Recall</text>
        <text id='error-text-precision' class='error-text' y="{precisionScale(1)}" x="{xScale(12.25)}" dominant-baseline="middle">Precision</text>
        <text id='error-text-f1' class='error-text' y="{f1ScoreScale(0.39)}" x="{xScale(0.6)}" dominant-baseline="middle">F1-Score</text>
        <text id='error-text-accuracy' class='error-text' y="{accuracyScale(0.79)}" x="{xScale(9.2)}" dominant-baseline="middle">Accuracy</text>

        <!-- axis labels -->
        <text class='error-axis-label' y="{height + margin.bottom}" x="{(width + margin.left) / 2}" text-anchor="middle">Decision Boundary Threshold</text>
        <!-- <text class='error-axis-label' y="{margin.left / 3}" x="{-((height ) / 2)}" text-anchor="middle" transform="rotate(-90)">Score</text> -->

        <!-- x-ticks -->
        {#each xScale2.ticks() as tick}
            <g transform={`translate(${xScale2(tick) + 0} ${height - margin.bottom})`}>
                <text class='error-axis-text' y="15" text-anchor="end">{formatterX(tick)}</text>
            </g>
        {/each}
        
    </svg>

</div>
<br>
<br>
<p class='body-text'>
    The tradeoff between Precision and Recall is alive and well. For our data and classifier, 
    lower classification thresholds yield perfect recall at the cost of low precision. However, as we increase the classification
    threshold, this relationship changes, and precision will eventually dominate recall. 
    As expected, the F1-Score is maximixed when both Precision and Recall perform well relatively close to each other, and is low otherwise.
     Accuracy is also its highest at the maximum point for the F1-Score, but note that it barely changes thereafter.
     It's performance is effectively the same as if it just did majority vote, indicating that accuracy is indeed a poor evaluation metric 
     for the problem at hand. 
</p>

  <style>
    .error-text {
        text-transform: uppercase;
        font-family: var(--font-heavy);
        stroke-linejoin: round;
        paint-order: stroke fill;
        stroke-width: 4px;
        pointer-events: none;
        stroke: #f1f3f3;
        font-size: 12px;
        letter-spacing: 2px;
    }

    .error-axis-text, .error-axis-label {
        font-size: 14px;
        fill: var(--squid-ink);
    }

    .y-axis-line {
        opacity: .2;
    }

    #error-text-accuracy {
        fill: #c9208a;
    }

    #error-text-recall {
        fill: #7cd1ea;
    }

    #error-text-precision {
        fill: #ab00d6;
    }

    #error-text-f1 {
        fill: #005276;
    }

    .error-axis-label {
        text-transform: uppercase;
    }

    .path-line {
      fill: none;
      stroke-linejoin: round;
      stroke-linecap: round;
      stroke-width: 5.5;
    }

    .outline-line {
        fill: none;
        stroke: #f1f3f3;
        stroke-width: 9;
    }


    #error-chart {
        margin: auto;
        max-height: 50vh;
        width: 55%;
        margin: 1rem auto;
    }

    /* tablet */
    @media screen and (max-width: 950px) {
        #error-chart {
            width: 85%;
            max-height: 55vh;
        }
       .error-text {
           font-size: 13px;
       }
    }
    /* mobile */
    @media screen and (max-width: 768px) {
        #error-chart {
            width: 85%;
            max-height: 55vh;
        }
       .error-text {
           font-size: 10px;
           stroke-width: 2px;
           letter-spacing: 1px;
       }
       .path-line {
            stroke-width: 3;
        }
        .outline-line {
            stroke-width: 6;
        }
        .error-axis-text {
            font-size: .6rem;
        }
    }


  </style>