<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
  import { line, curveStep } from "d3-shape";
  import { scaleLinear } from "d3-scale";
  import { interpretationData } from "../datasets.js";
  import { format } from "d3-format";
  import { extent } from "d3-array";

  const formatter = format(".0");

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
    .domain([-0.5, 1.5])
    .range([margin.left, width - margin.right]);
  $: yScale = scaleLinear()
    .domain(extent(interpretationData, (d) => d.price))
    .range([height - margin.bottom, margin.top]);

  $: pricePath = line()
    .x((d) => xScale(d.sqft))
    .y((d) => yScale(d.price))
    .curve(curveStep);
</script>

<p class="body-text">
  <span class="interpretation-header"
    >Interpreting A Regression Model With One Binary Feature</span
  >
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
    <!-- data points -->
    {#each interpretationData as d}
      <circle r="10" cx={xScale(d.pool)} cy={yScale(d.price)} fill="black" />
    {/each}

    <!-- <path class="outline-line" d={pricePath(scatterData)} />
      <path class="path-line" d={pricePath(scatterData)} stroke="#c9208a" /> -->

    <!-- axis labels -->
    <text
      class="error-axis-label"
      y={height + margin.bottom}
      x={(width + margin.left) / 2}
      text-anchor="middle">xewewaewaea</text
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
  <span class="bold">Model Form:</span>
  {@html katexify(` y=β0+β1∗x1`, false)} where {@html katexify(
    `β1 \\in \\llbracket0, 1\\rrbracket`,
    false
  )}
</p>
<br />
<p class="body-text">
  <span class="bold">Example:</span>
  {@html katexify(
    `\\begin{aligned} house price = 78 + 12 * has\\_pool +
      error \\end{aligned}`,
    false
  )}
</p>
<br />
<p class="body-text">
  <span class="bold">Interpretation</span>:This model summarizes the difference
  in average housing prices between houses with swimming pools and houses
  without swimming pools.
  <br /><br /> The intercept, 78, is the average (or predicted) price for houses
  that do not have swimming pools (to see this, simply set has_pool to 0 and
  solve the equation). To find the average price for houses with pools, we
  simply plug in 1 to obtain 78 + 12*1 = 90.

  <br /><br />The difference between these two subpopulation means is equal to
  the coefficient on {@html katexify(`has\\_pool`, false)}. It tells us that
  houses with pools cose 12 points higher on average than houses that do not
  have pools.
  <span
    class="info-tooltip"
    title="You may see categorical features in regression models with more than two
    possible outcomes. These multi-level categorical features are often called indicator,
    or dummy, variables. Special attention should be taken when interpreting indicator
    variables as any interpretation is dependent on the baseline category used in the
    model."
    use:tooltip
  >
    [&#8505;]
  </span>
</p>

<style>
  #scatter-chart {
    margin: auto;
    max-height: 35vh;
    width: 500px;
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
</style>
