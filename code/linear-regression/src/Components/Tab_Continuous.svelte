<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
  import { line } from "d3-shape";
  import { scaleLinear } from "d3-scale";
  import { interpretationData } from "../datasets.js";
  import { min, max } from "d3-array";
  import { margin, mobile } from "../store";
  import { format } from "d3-format";

  const formatter = format("$,");
  const formatterMobile = format("$.3s");

  let height = 500;
  let width = 500;

  const minVal = min(interpretationData, (d) => d.sqft);
  const maxVal = max(interpretationData, (d) => d.sqft);

  $: xScale = scaleLinear()
    .domain([0, maxVal])
    .range([$margin.left, width - $margin.right]);
  $: yScale = scaleLinear()
    .domain([0, max(interpretationData, (d) => d.price)])
    .range([height - $margin.bottom, $margin.top]);

  const intercept = -39591.3;
  const slope = 742.33;

  const pathData = [
    { x: 55, y: 55 * slope + intercept },
    { x: maxVal, y: maxVal * slope + intercept },
  ];

  $: pricePath = line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y));
</script>

<p class="tab-text">
  <span class="interpretation-header"
    >A Regression Model With One Continuous Feature</span
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
      />
    {/each}

    <path class="outline-line" d={pricePath(pathData)} />
    <path class="path-line" d={pricePath(pathData)} />

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
      >Regression Model With One Continuous Feature</text
    >
  </svg>
</div>

<br />
<p class="tab-text">
  <span class="bold">Example:</span><br />
  {@html katexify(
    `\\begin{aligned} \\text{house price} = ${Math.round(
      intercept
    )} + ${Math.round(slope)} * sqft \\end{aligned}`,
    false
  )}
</p>

<br />
<p class="tab-text">
  <span class="bold">Interpretation</span>: This model summarizes the average
  house prices across differently sized houses (<span class="dot-without" />) as
  measured in square feet.
  <br /><br />
  The coefficient, {formatter(Math.round(slope))}, represents the average
  difference in housing price for one-unit difference in the square-footage of
  the house. In other words, we expect each additional square-foot, on average,
  to raise the price of a house by {formatter(Math.round(slope))}.
  <br /><br /> The intercept, {formatter(Math.round(intercept))}, represents the
  predicted housing price for houses with {@html katexify(`sqft = 0`, false)},
  that is, it represents the average price of a zero square-foot house. Because
  this value doesn't make much intuitive sense, it's common for models to be
  transformed and standardized before carrying out a regression model.<sup
    ><span
      class="info-tooltip"
      title="By scaling and standardizing our data beforehand, this intercept will come to represent the average price in our dataset."
      use:tooltip
    >
      [&#8505;]
    </span></sup
  >
</p>

<style>
  #scatter-chart {
    max-height: 30vh;
    width: 500px;
    margin: 1rem auto;
  }

  .interpretation-circle {
    stroke-width: 0;
    fill: var(--smile);
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
    stroke: var(--smile);
  }
  .dot-without {
    height: 12px;
    width: 12px;
    background-color: var(--smile);
    border-radius: 50%;
    display: inline-block;
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
