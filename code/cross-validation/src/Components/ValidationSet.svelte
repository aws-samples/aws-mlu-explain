<script>
  import { line, curveCatmullRom } from "d3-shape";
  import { scaleLinear } from "d3-scale";
  import { rocData } from "../datasets.js";
  import { format } from "d3-format";

  const formatter = format(".1f");

  // these don't matter, but make the stretching less obvious at load
  let height = 500;
  let width = 500;
  // responsive margins
  const mobile = window.innerWidth <= 700;
  const margin = {
    top: mobile ? 40 : 50,
    bottom: mobile ? 10 : 25,
    left: mobile ? 0 : 80,
    right: mobile ? 0 : 10,
  };

  // scales
  $: xScale = scaleLinear()
    .domain([0.0, 1.0])
    .range([margin.left, width - margin.right]);
  $: rocScale = scaleLinear()
    .domain([0.0, 1.0])
    .range([height - margin.bottom, margin.top]);

  // line generator
  $: rocPath = line()
    .x((d) => xScale(d.fpr))
    .y((d) => rocScale(d.tpr));
  // .curve(curveCatmullRom.alpha(1));

  // line generator
  $: perfectPath = line()
    .x((d) => xScale(d.threshold))
    .y((d) => rocScale(d.ones));
  // .curve(curveCatmullRom);

  // line generator
  $: randomPath = line()
    .x((d) => xScale(d.threshold))
    .y((d) => rocScale(d.threshold));
  // .curve(curveCatmullRom);

  // path for svg arrows
  const arrows = [
    "M0.200275 13.2782C0.200275 12.4153 0.89983 11.7157 1.76278 11.7157H23.6378C24.5007 11.7157 25.2003 12.4153 25.2003 13.2782C25.2003 14.1411 24.5007 14.8407 23.6378 14.8407H1.76278C0.89983 14.8407 0.200275 14.1411 0.200275 13.2782Z",
    "M11.5954 1.23584C12.2056 0.62565 13.1949 0.62565 13.8051 1.23584L24.7426 12.1733C25.3528 12.7835 25.3528 13.7729 24.7426 14.3831L13.8051 25.3206C13.1949 25.9307 12.2056 25.9307 11.5954 25.3206C10.9852 24.7104 10.9852 23.721 11.5954 23.1108L21.4281 13.2782L11.5954 3.44555C10.9852 2.83536 10.9852 1.84604 11.5954 1.23584Z",
    "M 11.5954 1.23584 C 12.2056 0.62565 13.1949 0.62565 13.8051 1.23584 L 24.7426 12.1733 C 25.3528 12.7835 25.3528 13.7729 24.7426 14.3831 L 13.8051 25.3206 C 13.1949 25.9307 12.2056 25.9307 11.5954 25.3206 C 10.9852 24.7104 10.9852 23.721 11.5954 23.1108 L 21.4281 13.2782 L 11.5954 3.44555 C 10.9852 2.83536 10.9852 1.84604 11.5954 1.23584 Z",
  ];
</script>

<h1 class="body-header">Our Previous Approach</h1>
<p class="body-text">
  In <a href="">a previous article</a>, we described a standard technique for
  solving this problem: <span class="bold">The Validation Set Approach</span>.
  Recall this involved randomly splitting our data into three mutually exclusive
  sets:
</p>
<br />
<ul class="body-text">
  <li>
    <span class="bold">The Training Set</span> is used to learn the model parameters.
  </li>
  <li>
    <span class="bold">The Validation Set</span> is used to select which model or
    set of hyperparameters you’d like to use.
  </li>

  <li>
    <span class="bold">The Test Set</span> is used to evaluate how your model will
    perform on unseen data.
  </li>
</ul>
<br />

<div id="error-chart" bind:offsetWidth={width} bind:offsetHeight={height}>
  <svg
    width={width + margin.left + margin.right}
    height={height + margin.top + margin.bottom}
  >
    <!-- x-ticks -->
    {#each xScale.ticks() as tick}
      <g transform={`translate(${xScale(tick) + 0} ${height - margin.bottom})`}>
        <!-- svelte-ignore component-name-lowercase -->
        <line
          class="axis-line"
          x1="0"
          x2="0"
          y1="0"
          y2={-height + margin.bottom + margin.top}
          stroke="black"
          stroke-dasharray="4"
        />
        <text class="error-axis-text" y="15" text-anchor="end">{tick}</text>
      </g>
    {/each}
    <!-- y-ticks -->
    {#each [0, 0.2, 0.4, 0.6, 0.8, 1.0] as tick}
      <g transform={`translate(${margin.left - 5} ${rocScale(tick) + 0})`}>
        <!-- svelte-ignore component-name-lowercase -->
        <line
          class="axis-line"
          x1="0"
          x2={width - margin.right - margin.left}
          y1="0"
          y2="0"
          stroke="black"
          stroke-dasharray="4"
        />
        <text
          class="error-axis-text"
          x="-5"
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
      class="error-axis-line"
      y1={height - margin.bottom}
      y2={height - margin.bottom}
      x1={margin.left}
      x2={width}
      stroke="black"
      stroke-width="2"
    />
    <!-- y -->
    <!-- svelte-ignore component-name-lowercase -->
    <line
      class="error-axis-line"
      y1={margin.top}
      y2={height - margin.bottom}
      x1={margin.left}
      x2={margin.left}
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
    <text
      class="annotation"
      transform={`translate(${xScale(0.03)},${rocScale(0.95)})`}
      text-anchor="start"
      fill="#c9208a"
      alignment-baseline="middle"
    >
      Perfect Classifier
    </text>

    <!-- random classifier line & text -->
    <path class="outline-line" stroke-dasharray="15" d={randomPath(rocData)} />
    <path
      id="random-line"
      class="path-line"
      d={randomPath(rocData)}
      stroke="#232F3E"
      stroke-dasharray="15"
    />
    <text dy="5" class="annotation">
      <textPath
        href="#random-line"
        startOffset="50%"
        text-anchor="middle"
        fill="#232F3E"
        dominant-baseline="hanging">Random Classifier</textPath
      >
    </text>

    <!-- our data line & text -->
    <path class="outline-line" d={rocPath(rocData)} />
    <path
      id="our-line"
      class="path-line"
      d={rocPath(rocData)}
      stroke="#9e1f63"
    />
    <text
      class="annotation"
      transform={`translate(${xScale(0.42)},${rocScale(0.78)}) rotate(-18)`}
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
      class="error-axis-label"
      y={margin.top / 2}
      x={(width + margin.left) / 2}
      text-anchor="middle">Comparing ROC Curves</text
    >
    <text
      class="error-axis-label"
      y={height + margin.bottom}
      x={(width + margin.left) / 2}
      text-anchor="middle">False Positive Rate (FPR)</text
    >
    <text
      class="error-axis-label"
      y={margin.left / 3}
      x={-(height / 2)}
      text-anchor="middle"
      transform="rotate(-90)">True Positive Rate (TPR)</text
    >

    <!-- x-ticks -->
    {#each xScale.ticks() as tick}
      <g transform={`translate(${xScale(tick) + 0} ${height - margin.bottom})`}>
        <text class="error-axis-text" y="15" text-anchor="end">{tick}</text>
      </g>
    {/each}
  </svg>
</div>
<br /><br />
<p class="body-text">
  The Validation Set Approach is still widely used, especially when resource
  constraints prohibit alternatives that require resampling (like cross
  validation). But the approach is perfect! The obvious issues is that our
  estimate of the test error can be highly variable depending on which
  particular observations are included in the training set and which are
  included in the validation set. That is, how do we know that the 30% we
  selected is the best way to split the data? What if we’d used a different
  split instead? Another issue is that this approach tends to overestimate the
  test error for models fit on our entire dataset. This is because more training
  data usually means better accuracy, but the validation set approach reserves a
  decent-sized chunk of data for validation and testing (and not training). If
  only there was a better resampling method for assessing how the results of a
  statistical analysis will generalize to an independent data set...
</p>

<style>
  #error-chart {
    margin: auto;
    max-height: 48vh;
    width: 40%;
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
  .error-axis-text {
    font-size: 0.9rem;
  }

  .axis-line {
    opacity: 0.15;
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
    stroke-width: 5;
  }

  .outline-line {
    fill: none;
    stroke: #f1f3f3;
    stroke-width: 10;
  }

  ul {
    max-width: 600px;
    margin: auto;
    font-family: var(--font-main);
    font-size: 17px;
    padding-top: 0.5rem;
  }
  li {
    padding: 0.25rem;
  }

  /* ipad */
  @media screen and (max-width: 950px) {
    #error-chart {
      max-height: 55vh;
      width: 85%;
      margin: 1rem auto;
    }
    .error-axis-label {
      font-size: 0.8rem;
    }
    .error-axis-text {
      font-size: 0.8rem;
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
    ul {
      font-size: 18px;
      max-width: 80%;
    }
    #error-chart {
      max-height: 55vh;
      width: 95%;
      margin: 1rem auto;
    }

    .error-axis-label {
      font-size: 0.75rem;
    }
    .error-axis-text {
      font-size: 0.7rem;
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
