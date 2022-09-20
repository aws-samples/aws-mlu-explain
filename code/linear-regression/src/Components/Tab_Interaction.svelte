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

  const intercept = -70296.3;
  const slopeSqft = 898.5;
  const slopePool = 217110.5;
  const slopeInteraction = -347.4;

  const pathDataSqft = [
    { x: 82, y: 82 * slopeSqft + intercept },
    { x: maxVal, y: maxVal * slopeSqft + intercept },
  ];

  const pathDataPool = [
    { x: 0, y: 0 * slopeSqft + slopePool + intercept },
    {
      x: maxVal,
      y: maxVal * slopeSqft + slopePool + slopeInteraction * maxVal + intercept,
    },
  ];

  $: pricePath = line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y));
</script>

<p class="tab-text">
  <span class="interpretation-header"
    >A Regression Model With Interaction Terms</span
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
      >Regression Model With Interaction</text
    >
  </svg>
</div>

<br />
<p class="tab-text">
  <span class="bold">Example:</span><br />
  {@html katexify(
    `\\begin{aligned} \\text{house price}=${Math.round(
      intercept
    )} + ${Math.round(slopeSqft)}*sqft + ${Math.round(
      slopePool
    )}*pool  ${Math.round(slopeInteraction)}*(sqft:pool) \\end{aligned}`,
    false
  )}
</p>
<br />
<p class="tab-text">
  <span class="bold">Interpretation</span>: If we believe that the slope for {@html katexify(
    `sqft`,
    false
  )} should differ between houses that do have pools and houses that do not, we can
  add an interaction term to our model, {@html katexify(`(sqft:pool) `, false)}.
  <br /><br />
  The coefficient of the interaction term {@html katexify(
    `(sqft:pool)`,
    false
  )}, {formatter(Math.round(slopeInteraction))}, represents the difference in
  the slope for {@html katexify(`sqft`, false)}, comparing houses that do and 
  do not have pools. Visually, this represents the difference between the slopes 
  of the two lines,
  <span class="line-with" />
  and <span class="line-without" />, above.
  <br /><br />
  The intercept, {formatter(Math.round(intercept))}, represents the predicted
  housing price for houses with no pools and a square-footage of zero.<sup
    ><span
      class="info-tooltip"
      title="Because this value doesn't make much intuitive sense, it's common for the features to be centered at zero."
      use:tooltip
    >
      [&#8505;]
    </span></sup
  >
  <br /><br />
  The coefficient of {@html katexify(`pool`, false)}, {formatter(
    Math.round(slopePool)
  )}, represents the average expected difference in houses of the same size (0
  {@html katexify(`sqft`, false)}) that differed in whether or not they had a pool.
  (It's not super useful since we don't have houses with 0 square-feet).
  <br /><br />
  The coefficient of {@html katexify(`sqft`, false)}, {formatter(
    Math.round(slopeSqft)
  )}, represents the average expected difference in housing price for houses
  that do not have a pool ({@html katexify(`pool= 0`, false)}) but differ in
  size by one square-foot.
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

  .line-without {
    height: 3px;
    width: 14px;
    background-color: var(--smile);
    display: inline-block;
    margin-bottom: 4px;
  }
  .line-with {
    height: 3px;
    width: 14px;
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
