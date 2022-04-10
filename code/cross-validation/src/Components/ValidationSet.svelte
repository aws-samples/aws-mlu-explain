<script>
  import { line, curveCatmullRom } from "d3-shape";
  import { scaleBand, scaleLinear } from "d3-scale";
  import { rocData } from "../datasets.js";
  import { format } from "d3-format";
  import { range } from 'd3-array';
import { each } from "svelte/internal";

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
  $: waffleXScale = scaleBand()
    .domain(range(0,10,1))
    .range([margin.left, width - margin.right])
  $: waffleYScale = scaleBand()
    .domain(range(0,10,1))
    .range([margin.top, height - margin.bottom])

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
    <!-- waffleChart -->
    <g
      id={"inital-waffleChart"}
      >
    {#each range(0,100,1) as cell}
        <!-- svelte-ignore component-name-lowercase -->
        <rect
          class="waffle-cell"
          id={`waffle-cell-${cell}`}
          x={waffleXScale(Math.floor(cell / 10))}
          y={waffleYScale(cell % 10)}
          rx="1"
          height={waffleYScale.bandwidth()}
          width={waffleXScale.bandwidth()}
          fill={cell <= 64 ?"green"  : cell < 80 ? "goldenrod" : "darkslateblue"}
          stroke="black"
          stroke-width=".5"
        />
        {/each}
      </g>
      <path 
        id="train-outline"
        d={
          `
          M${waffleXScale(0)},${waffleYScale(0)}
          L${waffleXScale(7)},${waffleYScale(0)}
          L${waffleXScale(7)},${waffleYScale(5)}
          L${waffleXScale(6)},${waffleYScale(5)}
          L${waffleXScale(6)},${waffleYScale(9)}
          L${waffleXScale(0)},${waffleYScale(9)}
          Z`
        }
        fill="none"
        stroke="black"
        stroke-width="4"
        stroke-linejoin="round"
        stroke-linejcap="round"
        rx="2px"
      />
      <path 
        id="test-outline"
        d={
          `
          M${waffleXScale(7)},${waffleYScale(0)}
          L${waffleXScale(8)},${waffleYScale(0)}
          L${waffleXScale(8)},${waffleYScale(9)}
          L${waffleXScale(6)},${waffleYScale(9)}
          L${waffleXScale(6)},${waffleYScale(5)}
          L${waffleXScale(7)},${waffleYScale(5)}
          Z`
        }
        fill="none"
        stroke="black"
        stroke-width="4"
        stroke-linejoin="round"
        stroke-linejcap="round"
        rx="2px"
      />

      <path 
        id="validate-outline"
        d={
          `
          M${waffleXScale(8)},${waffleYScale(0)}
          L${waffleXScale(9)},${waffleYScale(0)}
          L${waffleXScale(9)},${waffleYScale(9)}
          L${waffleXScale(8)},${waffleYScale(9)}
          Z`
        }
        fill="none"
        stroke="black"
        stroke-width="4"
        stroke-linejoin="round"
        stroke-linejcap="round"
        rx="2px"
      />
      

    <!-- axis labels -->
    <text
      class="error-axis-label"
      y={margin.top / 2}
      x={(width + margin.left) / 2}
      text-anchor="middle">The Validation Set Approach</text
    >
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
