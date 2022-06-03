<script>
    import { line, curveStep} from 'd3-shape';
    import { scaleLinear } from "d3-scale";
    import { errorData } from "../datasets.js";
    import { format } from "d3-format";

    const formatter = format(".0%")

    let height = 500;
    let width = 500;
    const mobile = window.innerWidth <= 700;
    const margin = { 
        top: mobile ? 40 : 50, 
        bottom: mobile ? 10 : 25, 
        left: mobile ? 0 : 80, 
        right: mobile ? 0 : 10 
    };


    $: xScale = scaleLinear().domain([0, 14.4]).range([margin.left, width - margin.right])
    $: accuracyScale = scaleLinear().domain([0.0, 1]).range([height - margin.bottom, margin.top])
    $: precisionScale = scaleLinear().domain([0.0, 1]).range([height - margin.bottom, margin.top])


  
    $: accuracyPath = line()
      .x(d => xScale(d.thresh))
      .y(d => accuracyScale(d.accuracy))
      .curve(curveStep);

    $: precisionPath = line()
      .x(d => xScale(d.thresh))
      .y(d => precisionScale(d.precision))
      .curve(curveStep);

  </script>

<h1 class='body-header'>Responsive, Static Chart Example</h1>
<p class='body-text'>This component is a scope example of a D3 chart.
    It's pretty simple.
</p>
<p class="body-text">
    The entropy can be used to quantify the
    <span class="bold">impurity</span> of a collection of labeled data
    points: a node containing multiple classes is impure whereas a node
    including only one class is pure.
  </p>

  <div id="static-chart"></div>
  <p class="body-text">
    Above, you can compute the entropy of a collection of labeled data
    points belonging to two classes, which is typical for
    <span class="bold">binary classification</span> problems. Click on the
    <span class="bold">Add</span> and
    <span class="bold">Remove</span> buttons to modify the composition of
    the bubble.
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
        <path class='outline-line' d='{precisionPath(errorData)}' ></path>
        <path class='path-line' d='{precisionPath(errorData)}' stroke='#ab00d6'></path>



        <!-- chart labels -->
        <text id='error-text-precision' class='error-text' y="{precisionScale(1)}" x="{xScale(12.35)}" dominant-baseline="middle">Precision</text>
        <text id='error-text-accuracy' class='error-text' y="{accuracyScale(0.79)}" x="{xScale(9.2)}" dominant-baseline="middle">Accuracy</text>

        <!-- axis labels -->
        <text class='error-axis-label' y="{height + margin.bottom}" x="{(width + margin.left) / 2}" text-anchor="middle">Decision Boundary Threshold</text>
        <text class='error-axis-label' y="{margin.left / 3}" x="{-((height ) / 2)}" text-anchor="middle" transform="rotate(-90)">Score</text>

        <!-- x-ticks -->
        {#each xScale.ticks() as tick}
            <g transform={`translate(${xScale(tick) + 0} ${height - margin.bottom})`}>
                <text class='error-axis-text' y="15" text-anchor="end">{tick}</text>
            </g>
        {/each}
        
    </svg>

</div>


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