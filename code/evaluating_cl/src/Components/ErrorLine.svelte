<script>
    import { line, curveLinear, curveStep, curveCatmullRom } from 'd3-shape';
    import { scaleLinear } from "d3-scale";
    import { errorData } from "./datasets";
    import { format } from "d3-format";

    const formatter = format(".0%")

    let height = 500;
    let width = 500;
    $: mobile = window.innerWidth <= 700;
    const margin = { 
        top: mobile ? 40 : 50, 
        bottom: mobile ? 10 : 25, 
        left: mobile ? 0 : 80, 
        right: mobile ? 0 : 10 
    };


    $: xScale = scaleLinear().domain([0, 14.4]).range([margin.left, width - margin.right])
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
    we've discussed: <span class='bold'>accuracy</span>, <span class='bold'>precision</span>, <span class='bold'>recall</span>, and the <span class='bold'>f1-score</span>.
    To view this tradeoff explicitly, we'll plot each metric's score as a function of the decision boundary threshold:
</p>
<br>
<div 
    id='error-chart'
    bind:offsetWidth={width}
    bind:offsetHeight={height}
>
    <svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
        <!-- y-ticks -->
        {#each [0.2, 0.4, 0.6, 0.8, 1.0] as tick}
            <g transform={`translate(${margin.left - 5} ${accuracyScale(tick) + 0})`}>
                <!-- svelte-ignore component-name-lowercase -->
                <line class='y-axis-line' x1="0" x2="{width - margin.right - margin.left}" y1="0" y2="0" stroke="black"></line>
                <text class='f1-axis-text' y="0" text-anchor="end" dominant-baseline="middle">{formatter(tick)}</text>
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
        <text id='error-text-precision' class='error-text' y="{precisionScale(1)}" x="{xScale(12.35)}" dominant-baseline="middle">Precision</text>
        <text id='error-text-f1' class='error-text' y="{f1ScoreScale(0.39)}" x="{xScale(0.7)}" dominant-baseline="middle">F1-Score</text>
        <text id='error-text-accuracy' class='error-text' y="{accuracyScale(0.79)}" x="{xScale(9.2)}" dominant-baseline="middle">Accuracy</text>

        <!-- axis labels -->
        <text class='error-axis-label' y="{height + margin.bottom}" x="{(width + margin.left) / 2}" text-anchor="middle">Decision Boundary Threshold</text>
        <text class='error-axis-label' y="{margin.left / 3}" x="{-((height ) / 2)}" text-anchor="middle" transform="rotate(-90)">Score</text>
        <!-- <text class='error-axis-title' y="15" x="{(margin.left + 0 * margin.right)}">Evaluation Metric Tradeoffs (On The Cancer Dataset)</text> -->

        <!-- x-ticks -->
        {#each xScale.ticks() as tick}
            <g transform={`translate(${xScale(tick) + 0} ${height - margin.bottom})`}>
                <text class='f1-axis-text' y="15" text-anchor="end">{tick}</text>
            </g>
        {/each}
        
    </svg>

</div>
<br>
<br>
<p class='body-text'>
    Just to be clear, these values are exactly the same values we saw dragging our decision boundary left to right in the earlier scroll section of the article.
    But by plotting the values across all thresholds, the relation ship has become more clear ti eeverything together nicely.
</p>

  <style>
    .error-text {
        text-transform: uppercase;
        font-family: var(--font-heavy);
        stroke-linejoin: round;
        paint-order: stroke fill;
        stroke-width: 5px;
        pointer-events: none;
        stroke: #f1f3f3;
        font-size: 1.1rem;
        letter-spacing: 2px;
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

    .error-axis-title {
        text-transform: uppercase;
        font-size: 1.25rem;
    }

    .path-line {
      fill: none;
      stroke-linejoin: round;
      stroke-linecap: round;
      stroke-width: 8;
    }

    .outline-line {
        fill: none;
        stroke: #f1f3f3;
        stroke-width: 12;
    }

    svg {
        /* border: 2px solid red; */
    }

    #error-chart {
        margin: auto;
        max-height: 50vh;
        width: 55%;
        margin: 1rem auto;

    }

  </style>