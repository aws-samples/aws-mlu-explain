<script>
  import { line, curveStep } from "d3-shape";
  import { scaleLinear } from "d3-scale";
  import { scatterData } from "../datasets.js";
  import { format } from "d3-format";
  import { tooltip } from "../tooltip";
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
  <span class="interpretation-header">Homoscedasticity</span>
  <br /><br />
</p>
<p class="body-text">
  <span class="bold">Assumption</span>: Error terms in a regression model have
  constant variance.
  <br /><br />
  <span class="bold">Why</span>: The presence of <i>heteroscedasticity</i>
  (unequal error variance) can make it difficult to gauge the true standard deviation
  of the errors, which may yield confidence intervals that are too wide or too narrow.
  It may also have the effect of giving higher weight to the subset of data that
  has the larger error variance when estimating coefficients.
  <span
    class="info-tooltip"
    title="That said, violation of the Homoscedasticity assumption is usually relatively minor, as it does not affect the information going into the predictors and how it's combined. 
  "
    use:tooltip
    >[&#8505;]
  </span>
  <br /><br />
  <span class="bold">Diagnose</span>: look at a plot of residuals versus
  predicted values and, in the case of time series data, a plot of residuals
  versus time. Be alert for evidence of residuals that grow larger either as a
  function of time or as a function of the predicted value.
  <br /><br />
</p>

<p class="body-text">
  <span class="bold">Fix</span>: Work with shorter intervals of data.
  Double-check assumptions of linearity and/or independence. Apply a relevant
  transformation (e.g. a log transformation of the dependent variable). Apply
  domain-specific fixes.
</p>

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
