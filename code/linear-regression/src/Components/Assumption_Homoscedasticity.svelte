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
  constant variance.<span
    class="info-tooltip"
    title="Nonconstant variance across error terms is called 'Heteroscedasticity'."
    use:tooltip
  >
    [&#8505;]
  </span>
  <br /><br />
  <span class="bold">Why</span>: make it difficult to gauge the true standard
  deviation of the forecast errors, usually resulting in confidence intervals
  that are too wide or too narrow. In particular, if the variance of the errors
  is increasing over time, confidence intervals for out-of-sample predictions
  will tend to be unrealistically narrow. Heteroscedasticity may also have the
  effect of giving too much weight to a small subset of the data (namely the
  subset where the error variance was largest) when estimating coefficients.
  <br /><br />
  <span class="bold">Diagnose</span>: look at a plot of residuals versus
  predicted values and, in the case of time series data, a plot of residuals
  versus time. Be alert for evidence of residuals that grow larger either as a
  function of time or as a function of the predicted value. To be really
  thorough, you should also generate plots of residuals versus independent
  variables to look for consistency there as well. Because of imprecision in the
  coefficient estimates, the errors may tend to be slightly larger for forecasts
  associated with predictions or values of independent variables that are
  extreme in both directions, although the effect should not be too dramatic.
  What you hope not to see are errors that systematically get larger in one
  direction by a significant amount.

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
<p class="body-text">
  <span class="bold">Fix</span>: If the dependent variable is strictly positive
  and if the residual-versus-predicted plot shows that the size of the errors is
  proportional to the size of the predictions (i.e., if the errors seem
  consistent in percentage rather than absolute terms), a log transformation
  applied to the dependent variable may be appropriate. In time series models,
  heteroscedasticity often arises due to the effects of inflation and/or real
  compound growth. Some combination of logging and/or deflating will often
  stabilize the variance in this case. Stock market data may show periods of
  increased or decreased volatility over time. This is normal and is often
  modeled with so-called ARCH (auto-regressive conditional heteroscedasticity)
  models in which the error variance is fitted by an autoregressive model. Such
  models are beyond the scope of this discussion, but a simple fix would be to
  work with shorter intervals of data in which volatility is more nearly
  constant. Heteroscedasticity can also be a byproduct of a significant
  violation of the linearity and/or independence assumptions, in which case it
  may also be fixed as a byproduct of fixing those problem.
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
