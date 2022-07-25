<script>
  import { line, curveStep } from "d3-shape";
  import { scaleLinear } from "d3-scale";
  import { scatterData } from "../datasets.js";
  import { format } from "d3-format";

  const formatter = format(".0%");

  let height = 500;
  let width = 500;
  const mobile = window.innerWidth <= 700;
  const margin = {
    top: mobile ? 40 : 50,
    bottom: mobile ? 10 : 25,
    left: mobile ? 0 : 80,
    right: mobile ? 0 : 10,
  };

  $: xScale = scaleLinear()
    .domain([0, 14.4])
    .range([margin.left, width - margin.right]);
  $: yScale = scaleLinear()
    .domain([0.0, 1])
    .range([height - margin.bottom, margin.top]);

  $: pricePath = line()
    .x((d) => xScale(d.sqft))
    .y((d) => yScale(d.price))
    .curve(curveStep);
</script>

<p class="body-text">
  <span class="interpretation-header">Normality</span>
  <br /><br />
</p>
<p class="body-text">
  <span class="bold">What</span>: create problems for determining whether model
  coefficients are significantly different from zero and for calculating
  confidence intervals for forecasts. Sometimes the error distribution is
  "skewed" by the presence of a few large outliers. Since parameter estimation
  is based on the minimization of squared error, a few extreme observations can
  exert a disproportionate influence on parameter estimates. Calculation of
  confidence intervals and various significance tests for coefficients are all
  based on the assumptions of normally distributed errors. If the error
  distribution is significantly non-normal, confidence intervals may be too wide
  or too narrow.Technically, the normal distribution assumption is not necessary
  if you are willing to assume the model equation is correct and your only goal
  is to estimate its coefficients and generate predictions in such a way as to
  minimize mean squared error. The formulas for estimating coefficients require
  no more than that, and some references on regression analysis do not list
  normally distributed errors among the key assumptions. But generally we are
  interested in making inferences about the model and/or estimating the
  probability that a given forecast error will exceed some threshold in a
  particular direction, in which case distributional assumptions are important.
  Also, a significant violation of the normal distribution assumption is often a
  "red flag" indicating that there is some other problem with the model
  assumptions and/or that there are a few unusual data points that should be
  studied closely and/or that a better model is still waiting out there
  somewhere.
  <br /><br />
  <span class="bold">Why</span>: Violaton of this assumption means Lorem ipsum
  dolor sit amet consectetur adipisicing elit. Dolorum optio quibusdam
  consequuntur.
  <br /><br />
  <span class="bold">Diagnose</span>: the best test for normally distributed
  errors is a normal probability plot or normal quantile plot of the residuals.
  These are plots of the fractiles of error distribution versus the fractiles of
  a normal distribution having the same mean and variance. If the distribution
  is normal, the points on such a plot should fall close to the diagonal
  reference line. A bow-shaped pattern of deviations from the diagonal indicates
  that the residuals have excessive skewness (i.e., they are not symmetrically
  distributed, with too many large errors in one direction). An S-shaped pattern
  of deviations indicates that the residuals have excessive kurtosis--i.e.,
  there are either too many or two few large errors in both directions.
  Sometimes the problem is revealed to be that there are a few data points on
  one or both ends that deviate significantly from the reference line
  ("outliers"), in which case they should get close attention. There are also a
  variety of statistical tests for normality, including the Kolmogorov-Smirnov
  test, the Shapiro-Wilk test, the Jarque-Bera test, and the Anderson-Darling
  test. The Anderson-Darling test (which is the one used by RegressIt) is
  generally considered to be the best, because it is specific to the normal
  distribution (unlike the K-S test) and it looks at the whole distribution
  rather than just the skewness and kurtosis (like the J-B test). But all of
  these tests are excessively "picky" in this author’s opinion. Real data rarely
  has errors that are perfectly normally distributed, and it may not be possible
  to fit your data with a model whose errors do not violate the normality
  assumption at the 0.05 level of significance. It is usually better to focus
  more on violations of the other assumptions and/or the influence of a few
  outliers (which may be mainly responsible for violations of normality anyway)
  and to look at a normal probability plot or normal quantile plot and draw your
  own conclusions about whether the problem is serious and whether it is
  systematic.
  <br /><br />
</p>

<div id="scatter-chart" bind:offsetWidth={width} bind:offsetHeight={height}>
  <svg {width} height={height + margin.top + margin.bottom}>
    <!-- x-ticks -->
    {#each xScale.ticks() as tick}
      <g transform={`translate(${xScale(tick) + 0} ${height - margin.bottom})`}>
        <!-- svelte-ignore component-name-lowercase -->
        <line
          class="grid-line"
          x1="0"
          x2="0"
          y1="0"
          y2={-height + margin.bottom + margin.top}
          stroke="black"
          stroke-dasharray="4"
        />
        <text class="axis-text" y="15" text-anchor="middle"
          >{formatter(tick)}</text
        >
      </g>
    {/each}
    <!-- y-ticks -->
    {#each yScale.ticks() as tick}
      <g transform={`translate(${margin.left - 5} ${yScale(tick) + 0})`}>
        <!-- svelte-ignore component-name-lowercase -->
        <line
          class="grid-line"
          x1={5}
          x2={width - margin.right}
          y1="0"
          y2="0"
          stroke="black"
          stroke-dasharray="4"
        />
        <text
          class="axis-text"
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
      class="axis-line"
      y1={height - margin.bottom}
      y2={height - margin.bottom}
      x1={margin.left}
      x2={width}
      stroke="black"
      stroke-width="1"
    />
    <!-- y -->
    <!-- svelte-ignore component-name-lowercase -->
    <line
      class="axis-line"
      y1={margin.top}
      y2={height - margin.bottom}
      x1={margin.left}
      x2={margin.left}
      stroke="black"
      stroke-width="1"
    />

    <!-- <path class="outline-line" d={pricePath(scatterData)} />
        <path class="path-line" d={pricePath(scatterData)} stroke="#c9208a" /> -->

    <!-- axis labels -->
    <text
      class="error-axis-label"
      y={height + margin.bottom}
      x={(width + margin.left) / 2}
      text-anchor="middle">x</text
    >
    <text
      class="error-axis-label"
      y={margin.left / 3}
      x={-(height / 2)}
      text-anchor="middle"
      transform="rotate(-90)">y</text
    >
  </svg>
</div>

<style>
  #scatter-chart {
    margin: auto;
    max-height: 25vh;
    width: 58%;
    margin: 1rem auto;
  }

  .regression-circle {
    fill: var(--primary);
    stroke-width: 0;
  }

  .regression-line {
    stroke: var(--squidink);
    stroke-width: 3.5;
    fill: none;
  }

  .residual-line {
    stroke: var(--cosmos);
    stroke-width: 1.5;
  }

  .residual-rect {
    stroke: var(--cosmos);
    fill: var(--cosmos);
    fill-opacity: 0.25;
  }

  .axis-label {
    font-weight: bold;
  }

  .axis-text {
    font-size: 0.7rem;
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

  .grid-line {
    opacity: 0.075;
  }

  .axis-label {
    text-transform: uppercase;
    font-size: 0.7rem;
  }

  .path-line {
    fill: none;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 4;
  }

  /* ipad */
  @media screen and (max-width: 950px) {
    .axis-label {
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
  }
  /* mobile */
  @media screen and (max-width: 750px) {
    .axis-label {
      font-size: 0.75rem;
    }
  }
</style>
