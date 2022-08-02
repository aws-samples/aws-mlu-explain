<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
  import { line } from "d3-shape";
  import { scaleLinear } from "d3-scale";
  import { interpretationData } from "../datasets.js";
  import { max } from "d3-array";
  import { margin } from "../store";
  import { format } from "d3-format";

  const formatter = format("$,");
  const formatter2 = format(",");

  let height = 500;
  let width = 500;

  $: xScale = scaleLinear()
    .domain([-0.5, 1.5])
    .range([$margin.left, width - $margin.right]);
  $: yScale = scaleLinear()
    .domain([0, max(interpretationData, (d) => d.price)])
    .range([height - $margin.bottom, $margin.top]);

  const intercept = 172892.6;
  const slope = 241582.4;

  const pathData = [
    { x: 0, y: 0 * slope + intercept },
    { x: 1, y: 1 * slope + intercept },
  ];

  $: pricePath = line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y));
</script>

<p class="body-text">
  <span class="interpretation-header"
    >A Regression Model With One Binary Feature</span
  >
</p>
<div id="scatter-chart" bind:offsetWidth={width} bind:offsetHeight={height}>
  <svg {width} height={height + $margin.top + $margin.bottom}>
    <!-- x-ticks -->
    {#each xScale.ticks() as tick}
      <g
        transform={`translate(${xScale(tick) + 0} ${height - $margin.bottom})`}
      >
        <!-- svelte-ignore component-name-lowercase -->
        <line
          class="grid-line"
          x1="0"
          x2="0"
          y1="0"
          y2={-height + $margin.bottom + $margin.top}
          stroke="black"
          stroke-dasharray="4"
        />
        {#if [0, 1].includes(tick)}
          <text class="axis-text" y="15" text-anchor="middle">{tick}</text>
        {/if}
      </g>
    {/each}

    <!-- y-ticks -->
    {#each yScale.ticks() as tick, i}
      <g transform={`translate(${$margin.left - 5} ${yScale(tick) + 0})`}>
        <!-- svelte-ignore component-name-lowercase -->
        <line
          class="grid-line"
          x1={5}
          x2={width - $margin.right}
          y1="0"
          y2="0"
          stroke="black"
          stroke-dasharray="4"
        />
        {#if i % 2 === 0}
          <text
            class="axis-text"
            y="0"
            text-anchor="end"
            dominant-baseline="middle">{formatter(tick)}</text
          >
        {/if}
      </g>
    {/each}
    <!-- axis lines -->
    <!-- x -->
    <!-- svelte-ignore component-name-lowercase -->
    <line
      class="axis-line"
      y1={height - $margin.bottom}
      y2={height - $margin.bottom}
      x1={$margin.left}
      x2={width}
      stroke="black"
      stroke-width="1"
    />
    <!-- y -->
    <!-- svelte-ignore component-name-lowercase -->
    <line
      class="axis-line"
      y1={$margin.top}
      y2={height - $margin.bottom}
      x1={$margin.left}
      x2={$margin.left}
      stroke="black"
      stroke-width="1"
    />
    <!-- data points -->
    {#each interpretationData as d}
      <circle
        class="interpretation-circle"
        r="4.5"
        cx={xScale(d.pool)}
        cy={yScale(d.price)}
        fill={d.pool === 0 ? "#ff9900" : "#003181"}
      />
    {/each}

    <path class="outline-line" d={pricePath(pathData)} />
    <path class="path-line" d={pricePath(pathData)} stroke="#c9208a" />

    <!-- axis labels -->
    <text
      class="interpretation-axis-label"
      y={height + $margin.bottom / 2}
      x={(width + $margin.left) / 2}
      text-anchor="middle">Has Pool?</text
    >
    <text
      class="interpretation-axis-label"
      y={10}
      x={-(height / 2)}
      text-anchor="middle"
      transform="rotate(-90)">House Price (USD)</text
    >
    <text class="interpretation-title" y={$margin.top / 2} x={$margin.left}
      >Regression Model With One Binary Feature</text
    >
  </svg>
</div>
<br />
<!-- <p class="body-text">
  <span class="bold">Model Form:</span>
  {@html katexify(` y=β0+β1∗x1`, false)} where {@html katexify(
    `β1 \\in \\llbracket0, 1\\rrbracket`,
    false
  )}
</p>
<br /> -->
<p class="body-text">
  <span class="bold">Example:</span><br />
  {@html katexify(
    `\\begin{aligned} \\text{house price} = ${Math.round(
      intercept
    )} + ${Math.round(slope)} * pool \\end{aligned}`,
    false
  )}
</p>
<br />
<p class="body-text">
  <span class="bold">Interpretation</span>:This model summarizes the difference
  in average housing prices between houses without swimming pools (<span
    class="dot-without"
  />) and houses with swimming pools (<span class="dot-with" />).
  <br /><br /> The intercept, {formatter(Math.round(intercept))}, is the average
  predicted price for houses that do not have swimming pools (to see this,
  simply set has_pool to 0 and solve the equation). To find the average price
  predicted price for houses with pools, we simply plug in 1 to obtain {formatter(
    Math.round(intercept)
  )} + {formatter(Math.round(slope))} * 1 = {formatter(
    Math.round(slope + intercept)
  )}.

  <br /><br />The difference between these two subpopulation means is equal to
  the coefficient on {@html katexify(`pool`, false)}. It tells us that houses
  with pools cose {formatter(Math.round(slope))} points higher on average than houses
  that do not have pools.
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
    max-height: 30vh;
    width: 500px;
    margin: 1rem auto;
  }

  .interpretation-circle {
    stroke-width: 0;
  }

  .interpretation-title,
  .interpretation-axis-label {
    font-size: 0.85rem;
  }

  .axis-text {
    font-size: 0.7rem;
  }

  .grid-line {
    opacity: 0.075;
  }

  .outline-line {
    stroke-width: 4.5;
    stroke: white;
  }

  .path-line {
    fill: none;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 3;
    stroke: var(--anchor);
  }

  .dot-without {
    height: 12px;
    width: 12px;
    background-color: var(--smile);
    border-radius: 50%;
    display: inline-block;
  }
  .dot-with {
    height: 12px;
    width: 12px;
    background-color: var(--anchor);
    border-radius: 50%;
    display: inline-block;
  }
</style>
