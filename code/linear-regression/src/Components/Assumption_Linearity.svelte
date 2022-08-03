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
  <span class="interpretation-header"
    >Data Are Linearity & Additivity Related</span
  >
  <br /><br />
</p>
<p class="body-text">
  <span class="bold">Assumption</span>: Data fitted to a linear model should
  have a linear and additive relationship (i.e., that y is a linear function of
  the separate features).
  <br /><br />
  <span class="bold">Why</span>: A linear model fit to nonlinear and nonadditive
  data may yield poor predictions that don't extrapolate beyond the range of the
  sample data.
  <br /><br />
  <span class="bold">Diagnose</span>: Look at Residuals vs Fitted Values plot.
  The points should be symmetrically distributed around the horizontal line with
  a near constant variance. A bow-like pattern indicates systematic error.
</p>

<br /><br />
<p class="body-text">
  <span class="bold">Fix</span>: Apply a nonlinear transformation where
  appropriate, add interaction terms, include additional features to capture
  nonlinearity, or extend the model (e.g. a piecewise spline model).
  <span
    class="info-tooltip"
    title="In practice, almost every problem is nonlinear, so linear regression will often be applied with transformations or extensions. That said,
  the algorithm is still effective for estimating average relationships (when a linear model makes sense)."
    use:tooltip
    >[&#8505;]
  </span>
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
