<script>
    import { line, curveStep} from 'd3-shape';
    import { scaleLinear } from "d3-scale";
    import { errorData } from "../datasets.js";
    import { format } from "d3-format";

    const formatter = format(".0%")

    // these don't matter, but make the stretching less obvious at load
    let height = 500;
    let width = 500;
    // responsive margins
    const mobile = window.innerWidth <= 700;
    const margin = { 
        top: mobile ? 40 : 50, 
        bottom: mobile ? 10 : 25, 
        left: mobile ? 0 : 80, 
        right: mobile ? 0 : 10 
    };

    // scales
    $: xScale = scaleLinear().domain([0, 14.4]).range([margin.left, width - margin.right])
    $: accuracyScale = scaleLinear().domain([0.0, 1]).range([height - margin.bottom, margin.top])

    // line generator
    $: accuracyPath = line()
      .x(d => xScale(d.thresh))
      .y(d => accuracyScale(d.accuracy))
      .curve(curveStep);

  </script>

<h1 class='body-header'>When Is Curvy Better?</h1>
<p class='body-text'>
    The value in the ROC Curve is it’s ability to show us these tradeoffs. In this manner, we can observe how our model does overall,
     as well as as a means of comparison. A perfect classifier will always hug along the outer-left edge of our . ‘Perfect’ here meaning 
     we predict no False Positives. Anything under this curve is worse than random guessing, so basically worthless for any classification task. 
  </p>


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



        <!-- chart labels -->
        <text id='error-text-accuracy' class='error-text' y="{accuracyScale(0.79)}" x="{xScale(9.2)}" dominant-baseline="middle">Label</text>

        <!-- axis labels -->
        <text class='error-axis-label' y="{height + margin.bottom}" x="{(width + margin.left) / 2}" text-anchor="middle">X-Axis</text>
        <text class='error-axis-label' y="{margin.left / 3}" x="{-((height ) / 2)}" text-anchor="middle" transform="rotate(-90)">Y-Axis</text>

        <!-- x-ticks -->
        {#each xScale.ticks() as tick}
            <g transform={`translate(${xScale(tick) + 0} ${height - margin.bottom})`}>
                <text class='error-axis-text' y="15" text-anchor="end">{tick}</text>
            </g>
        {/each}
        
    </svg>

</div>
<br><br>
<p class='body-text'>
    Our model shows something that hangs somewhere between perfect and random. Indeed, this is the kind of result you’d expect to get in the real-world. 
    Obtaining a perfect 
    or exactly random result likely indicates a problem. In the former case, overfitting. In the latter, reassess the appropriateness of the problem. (reword).
</p>


  <style>
      #error-chart {
        margin: auto;
        max-height: 55vh;
        width: 58%;
        margin: 1rem auto;
    }

    .error-text {
        text-transform: uppercase;
        font-family: var(--font-heavy);
        stroke-linejoin: round;
        paint-order: stroke fill;
        stroke-width: 4.5px;
        pointer-events: none;
        stroke: #f1f3f3;
        font-size: .9rem;
        letter-spacing: 2px;
    }
    .error-axis-text {
        font-size: .9rem;
    }

    .y-axis-line {
        opacity: .2;
    }

    #error-text-accuracy {
        fill: #c9208a;
    }

    .error-axis-label {
        text-transform: uppercase;
        font-size: 1rem;
    }

    .path-line {
      fill: none;
      stroke-linejoin: round;
      stroke-linecap: round;
      stroke-width: 6;
    }

    .outline-line {
        fill: none;
        stroke: #f1f3f3;
        stroke-width: 10;
    }

    /* ipad */
    @media screen and (max-width: 950px) {
        #error-chart {
            max-height: 55vh;
            width: 85%;
            margin: 1rem auto;
        }
        .error-axis-label {
            font-size: .8rem;
        }
        .error-axis-text {
        font-size: .8rem;
    }
        .error-text {
            stroke-width: 3.5px;
            stroke: #f1f3f3;
            font-size: 0.8rem;
            letter-spacing: 2px;
        }
        .path-line {
        stroke-width: 5;
        }
        .outline-line {
            stroke-width: 9;
        }
    }
    /* mobile */
    @media screen and (max-width: 750px) {
        #error-chart {
            max-height: 55vh;
            width: 95%;
            margin: 1rem auto;
        }

        .error-axis-label {
            font-size: .75rem;
        }
        .error-axis-text {
        font-size: .7rem;
    }
        .error-text {
            stroke-width: 3px;
            stroke: #f1f3f3;
            font-size: 0.7rem;
            letter-spacing: 1px;
        }
        .path-line {
            stroke-width: 4;
        }
        .outline-line {
            stroke-width: 7;
        }
    }

  </style>