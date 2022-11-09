<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
  import { line } from "d3-shape";
  import { scaleLinear } from "d3-scale";
  import { interpretationData } from "../datasets.js";
  import { max } from "d3-array";
  import { margin, mobile } from "../store";
  import { format } from "d3-format";

  const formatter = format("$,");
  const formatterMobile = format("$.3s");

  let height = 500;
  let width = 500;

  const maxVal = max(interpretationData, (d) => d.sqft);

  $: xScale = scaleLinear()
    .domain([0, maxVal])
    .range([$margin.left, width - $margin.right]);
  $: yScale = scaleLinear()
    .domain([0, max(interpretationData, (d) => d.price)])
    .range([height - $margin.bottom, $margin.top]);

  const intercept = -27153.8;
  const slopeSqft = 756.9;
  const slopePool = 51866.7;

  const pathDataSqft = [
    { x: 43, y: 43 * slopeSqft + intercept },
    { x: maxVal, y: maxVal * slopeSqft + intercept },
  ];

  const pathDataPool = [
    { x: 0, y: 0 * slopeSqft + slopePool + intercept },
    { x: maxVal, y: maxVal * slopeSqft + slopePool + intercept },
  ];

  $: pricePath = line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y));
</script>

<p class="tab-text">
  <span class="interpretation-header">A Multivariate Regression Model</span>
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
        <!-- {#if [0, 1].includes(tick)} -->
        <text class="axis-text" y="15" text-anchor="middle">{tick}</text>
        <!-- {/if} -->
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
            dominant-baseline="middle"
            >{$mobile ? formatterMobile(tick) : formatter(tick)}</text
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
        cx={xScale(d.sqft)}
        cy={yScale(d.price)}
        fill={d.pool === 0 ? "#ff9900" : "#003181"}
      />
    {/each}

    <path class="outline-line" d={pricePath(pathDataSqft)} />
    <path class="path-line-sqft" d={pricePath(pathDataSqft)} />
    <path class="outline-line" d={pricePath(pathDataPool)} />
    <path class="path-line-pool" d={pricePath(pathDataPool)} />

    <!-- axis labels -->
    <text
      class="interpretation-axis-label"
      y={height + $margin.bottom / 2}
      x={(width + $margin.left) / 2}
      text-anchor="middle">Home Size (sqft)</text
    >
    <text
      class="interpretation-axis-label"
      y={10}
      x={-(height / 2)}
      text-anchor="middle"
      transform="rotate(-90)">House Price ($)</text
    >
    <text class="interpretation-title" y={$margin.top / 2} x={$margin.left}
      >Regression Model With Two Features</text
    >
  </svg>
</div>
<br />

<p class="tab-text">
  <span class="bold">Example:</span><br />
  {@html katexify(
    `\\begin{aligned} \\text{house price} = ${Math.round(
      intercept
    )} + ${Math.round(slopeSqft)} *sqft + ${Math.round(
      slopePool
    )} * pool \\end{aligned}`,
    false
  )}
</p>
<br />
<p class="tab-text">
  <span class="bold">Interpretation</span>: Typically, a regression model will
  contain more than one feature. We call this a
  <i>multivariate regression model</i>. In our example, we model home prices as
  a function of both the size of the house ({@html katexify(`sqft`, false)}) and
  whether or not it has a pool ({@html katexify(`pool`, false)}, where
  <span class="dot-without" /> = no pool and <span class="dot-with" /> = has a
  pool).
  <br /><br />The intercept, {formatter(Math.round(intercept))}, represents the
  predicted average housing price for houses with all {@html katexify(
    `x_i = 0`,
    false
  )}. For our model, it represents the cost of houses with no pools and a
  square-footage of zero.<sup
    ><span
      class="info-tooltip"
      title="Because this value doesn't make much intuitive sense, it's common for models to be transformed and standardized before carrying out a regression model."
      use:tooltip
    >
      [&#8505;]
    </span></sup
  >
  <br /><br /> The coefficient of {@html katexify(`pool`, false)}, {formatter(
    Math.round(slopePool)
  )}, represents the average expected price difference in houses of the same size (in
  {@html katexify(`sqft`, false)}) if they do or do not have a pool. In other words, we expect, on average, 
  houses of the same size to cost {formatter(
    Math.round(slopePool)
  )} more if they have a pool than if they do not.

  <br /><br />The coefficient of {@html katexify(`sqft`, false)}, {formatter(
    Math.round(slopeSqft)
  )}, represents the average expected price difference in housing price for houses
  that have the same value of {@html katexify(`pool`, false)} but differ in size
  by one square-foot.
  <br /><br />
  Note that, regardless of whether or not a house has a pool (<span
    class="line-with"
  />) or not (<span class="line-without" />), we assume the
  <i>same</i>
  slope for {@html katexify(`sqft`, false)}. To visualize this, we show two
  lines above. This isn't always a valid assumption to make, and when we think 
  those subpopulations should have different slopes, we can use interaction terms. 
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

  .path-line-pool {
    fill: none;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 3;
    stroke: var(--anchor);
  }

  .path-line-sqft {
    fill: none;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 3;
    stroke: var(--smile);
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

  .line-without {
    height: 3px;
    width: 12px;
    background-color: var(--smile);
    display: inline-block;
    margin-bottom: 4px;
  }
  .line-with {
    height: 3px;
    width: 12px;
    background-color: var(--anchor);
    display: inline-block;
    margin-bottom: 4px;
  }

  @media screen and (max-width: 950px) {
    #scatter-chart {
      width: 100%;
      max-width: 100%;
      margin: 1rem auto;
    }

    .interpretation-title {
      font-size: 0.8rem;
    }

    .axis-text {
      font-size: 0.6rem;
    }
  }
</style>
