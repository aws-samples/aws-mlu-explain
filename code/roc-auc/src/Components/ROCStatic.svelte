<script>
  import { line, curveStep } from "d3-shape";
  import { scaleLinear } from "d3-scale";
  import { rocData } from "../datasets.js";
  import { format } from "d3-format";
  import { margin } from "../data-store.js";

  const formatter = format(".1f");

  // these don't matter, but make the stretching less obvious at load
  let height = 500;
  let width = 500;

  // scales
  $: xScale = scaleLinear()
    .domain([0.0, 1.0])
    .range([$margin.left, width - $margin.right]);
  $: rocScale = scaleLinear()
    .domain([0.0, 1.0])
    .range([height - $margin.bottom, $margin.top]);

  // line generator
  $: rocPath = line()
    .x((d) => xScale(d.fpr))
    .y((d) => rocScale(d.tpr))
    .curve(curveStep);

  // line generator
  $: perfectPath = line()
    .x((d) => xScale(d.threshold))
    .y((d) => rocScale(d.ones));

  // line generator
  $: randomPath = line()
    .x((d) => xScale(d.threshold))
    .y((d) => rocScale(d.threshold));
</script>

<section id="roc-section">
  <h1 class="body-header">What Makes A Good ROC Curve?</h1>
  <p class="body-text">
    The ROC Curve is valuable not only because it gives us an overview of our
    model's performance (and lets us select an optimal classification threshold
    for that model), but because it also gives us an easy visual to compare the
    performance of different classifiers to one another.

    <br /><br />
    A perfect classifier is one that hugs along the outer-left and top of the chart.
    This is expected, as ‘perfect’ here implies the classifier will always have a
    TPR=1, regardless of the FPR. On the other hand, a diagonal line implies that
    TPR=FPR for every classification threshold - in other words, the classifier is
    just making random guesses. The model is garbage!
  </p>

  <div id="roc-chart" bind:offsetWidth={width} bind:offsetHeight={height}>
    <svg {width} height={height + $margin.top + $margin.bottom}>
      <!-- x-ticks -->
      {#each xScale.ticks() as tick}
        <g
          transform={`translate(${xScale(tick) + 0} ${
            height - $margin.bottom
          })`}
        >
          <!-- svelte-ignore component-name-lowercase -->
          <line
            class="axis-line"
            x1="0"
            x2="0"
            y1="0"
            y2={-height + $margin.bottom + $margin.top}
            stroke="black"
            stroke-dasharray="4"
          />
          <text class="roc-axis-tick" y="15" text-anchor="middle">{tick}</text>
        </g>
      {/each}
      <!-- y-ticks -->
      {#each [0, 0.2, 0.4, 0.6, 0.8, 1.0] as tick}
        <g transform={`translate(${$margin.left - 5} ${rocScale(tick) + 0})`}>
          <!-- svelte-ignore component-name-lowercase -->
          <line
            class="axis-line"
            x1="0"
            x2={width - $margin.right - $margin.left}
            y1="0"
            y2="0"
            stroke="black"
            stroke-dasharray="4"
          />
          <text
            class="roc-axis-tick"
            x="-2"
            y="0"
            text-anchor="end"
            dominant-baseline="middle">{formatter(tick)}</text
          >
        </g>
      {/each}

      <!-- axis lines -->
      <!-- x -->
      <!-- svelte-ignore component-name-lowercase -->
      <line
        class="roc-axis-line"
        y1={height - $margin.bottom}
        y2={height - $margin.bottom}
        x1={$margin.left}
        x2={width - $margin.right}
        stroke="black"
        stroke-width="2"
      />
      <!-- y -->
      <!-- svelte-ignore component-name-lowercase -->
      <line
        class="roc-axis-line"
        y1={$margin.top}
        y2={height - $margin.bottom}
        x1={$margin.left}
        x2={$margin.left}
        stroke="black"
        stroke-width="2"
      />

      <!-- perfect classifier line & text -->
      <path class="outline-line" d={perfectPath(rocData)} />
      <path
        id="perfect-line"
        class="path-line"
        d={perfectPath(rocData)}
        stroke="#c9208a"
      />

      <!-- random classifier line & text -->
      <path
        class="outline-line"
        stroke-dasharray="15"
        d={randomPath(rocData)}
      />
      <path
        id="random-line"
        class="path-line"
        d={randomPath(rocData)}
        stroke="#232F3E"
        stroke-dasharray="15"
      />

      <!-- our data line & text -->
      <path class="outline-line" d={rocPath(rocData)} />
      <path
        id="our-line"
        class="path-line"
        d={rocPath(rocData)}
        stroke="#9e1f63"
      />

      <!-- Chart Annotations -->
      <text
        class="annotation"
        transform={`translate(${xScale(0.03)},${rocScale(0.95)})`}
        text-anchor="start"
        fill="#c9208a"
        alignment-baseline="middle"
      >
        Perfect Classifier
      </text>
      <text dy="5" class="annotation">
        <textPath
          href="#random-line"
          startOffset="50%"
          text-anchor="middle"
          fill="#232F3E"
          dominant-baseline="hanging">Random Classifier</textPath
        >
      </text>
      <text
        class="annotation"
        transform={`translate(${xScale(0.45)},${rocScale(0.74)}) rotate(-18)`}
        text-anchor="middle"
        fill="#9e1f63"
        alignment-baseline="middle"
      >
        Our Classifier
      </text>

      <!-- chart labels -->
      <text
        id="error-text-accuracy"
        class="error-text"
        y={rocScale(0.79)}
        x={xScale(9.2)}
        dominant-baseline="middle">Label</text
      >

      <!-- axis labels -->
      <text
        class="roc-axis-label"
        y={$margin.top / 2}
        x={(width + $margin.left) / 2}
        text-anchor="middle">Comparing ROC Curves</text
      >
      <text
        class="roc-axis-label"
        y={height + $margin.bottom}
        x={(width + $margin.left) / 2}
        text-anchor="middle">False Positive Rate</text
      >
      <text
        class="roc-axis-label"
        y={15}
        x={-(height / 2)}
        text-anchor="middle"
        transform="rotate(-90)">True Positive Rate</text
      >
    </svg>
  </div>
  <br /><br />
  <p class="body-text">
    When it comes to comparing models, the rule of thumb is that curves that
    fall above the ROC Curve of a random classifier (the diagonal line) are good
    or decent. The higher up they are (i.e. the closer they are to the curve of
    the elusive perfect classifier), the better. Anything below the diagonal
    line has worse performance than random guessing, so likely isn't worth any
    consideration.
    <br /><br />
    Our model shows something that hangs somewhere between perfect and random. Indeed,
    this is the kind of result you’d expect to get in the real-world. Obtaining a
    perfect or exactly random result likely indicates a problem. An exactly random
    result may indicate that your problem is not well-framed, and may not have a
    solution without additional data. If the result shows a perfect classifier, make
    sure that there is no place where the training data is leaking information about
    the label which would not be available when the model is in deployment, as such
    a result likely points to overfitting or data-leakage.
  </p>
</section>

<style>
  #roc-chart {
    margin: auto;
    max-height: 48vh;
    width: 50%;
    margin: 1rem auto;
  }

  .annotation {
    font-family: var(--font-heavy);
    stroke-linejoin: round;
    paint-order: stroke fill;
    stroke-width: 4.4px;
    pointer-events: none;
    stroke: #f1f3f3;
    font-size: 0.95rem;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .error-text {
    text-transform: uppercase;
    font-family: var(--font-heavy);
    stroke-linejoin: round;
    paint-order: stroke fill;
    stroke-width: 4.5px;
    pointer-events: none;
    stroke: #f1f3f3;
    font-size: 0.9rem;
    letter-spacing: 2px;
  }
  .roc-axis-tick {
    font-size: 0.9rem;
  }

  .axis-line {
    opacity: 0.15;
  }

  #error-text-accuracy {
    fill: #c9208a;
  }

  .roc-axis-label {
    text-transform: uppercase;
    font-size: 1rem;
  }

  .path-line {
    fill: none;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 5;
  }

  .outline-line {
    fill: none;
    stroke: #f1f3f3;
    stroke-width: 10;
  }

  /* ipad */
  @media screen and (max-width: 950px) {
    #roc-chart {
      max-height: 55vh;
      width: 85%;
      margin: 1rem auto;
    }
    .roc-axis-label {
      font-size: 1rem;
    }
    .roc-axis-tick {
      font-size: 1rem;
    }
    .error-text {
      stroke-width: 3.5px;
      stroke: #f1f3f3;
      font-size: 0.9rem;
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
    .annotation {
      stroke-width: 4px;
      font-size: 0.85rem;
    }

    #roc-chart {
      max-height: 55vh;
      width: 95%;
      margin: 1rem auto;
    }

    .roc-axis-label {
      font-size: 0.9rem;
    }
    .roc-axis-tick {
      font-size: 0.8rem;
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
