<script>
  import { scaleLinear, scaleOrdinal } from "d3-scale";
  import { draw } from "svelte/transition";
  import { hexbin } from "d3-hexbin";
  import { bpSlope, bpIntercept, fillRule, strokeRule } from "../../store";

  const data = [
    { x: 0.05, y: 0.14, class: 1.0 },
    { x: 0.86, y: 0.57, class: -1.0 },
    { x: 0.41, y: 0.39, class: 1.0 },
    { x: 1.0, y: 0.69, class: -1.0 },
    { x: 0.27, y: 0.28, class: 1.0 },
    { x: 0.57, y: 0.92, class: -1.0 },
    { x: 0.18, y: 0.4, class: 1.0 },
    { x: 0.09, y: 0.3, class: 1.0 },
    { x: 0.52, y: 0.49, class: -1.0 },
    { x: 0.33, y: 0.35, class: 1.0 },
    { x: 0.88, y: 0.65, class: -1.0 },
    { x: 0.16, y: 0.16, class: 1.0 },
    { x: 0.94, y: 0.53, class: -1.0 },
    { x: 0.34, y: 0.3, class: 1.0 },
    { x: 0.71, y: 0.92, class: -1.0 },
    { x: 0.15, y: 0.19, class: 1.0 },
    { x: 0.59, y: 0.71, class: -1.0 },
    { x: 0.11, y: 0.26, class: 1.0 },
    { x: 0.82, y: 0.83, class: -1.0 },
    { x: 0.14, y: 0.11, class: 1.0 },
    { x: 0.2, y: 0.6, class: 1.0 },
    { x: 0.4, y: 0.12, class: 1.0 },
    { x: 0.7, y: 0.37, class: -1.0 },
    { x: 0.75, y: 0.32, class: -1.0 },
    { x: 0.85, y: 0.12, class: -1.0 },
  ];

  export let height = 200;
  export let width = 200;
  let margin = {
    top: 0,
    left: 0,
    bottom: 0,
    right: 20,
  };

  const hexbinRadius = 5;

  // scales
  $: xScale = scaleLinear()
    .domain([0, 1])
    .range([margin.left, width - margin.right]);

  $: yScale = scaleLinear()
    .domain([0, 1])
    .range([height - margin.bottom, margin.top]);

  const colorScale = scaleOrdinal()
    .domain([-1, 0, 1])
    .range(["#f46ebb", "var(--darksquidink)", "#2074d5"]);

  $: hexbins = hexbin()
    .radius(hexbinRadius)
    .extent([
      [0, 0],
      [width, height],
    ]);

  const hexFillRules = (stage, d) => {
    if (stage === 0) {
      return 0;
    } else {
      return yScale.invert(d.y) > $bpIntercept + $bpSlope * xScale.invert(d.x)
        ? -1
        : 1;
    }
  };

  const rRules = (stage, d) => {
    if (stage === 0) {
      return false;
    } else {
      if (d.y > $bpIntercept + $bpSlope * d.x) {
        return d.class === -1 ? false : true;
      } else {
        return d.class === 1 ? false : true;
      }
    }
  };
</script>

<clipPath id="clip-bp">
  <rect id="bg-rect" {width} {height} />
</clipPath>

<g
  class="nn-g"
  clip-path="url(#clip-bp)"
  transform={`translate(${0} ${-height / 2})`}
>
  <!-- hexbins -->
  <!-- {#key $bpSlope} -->
  {#each hexbins(hexbins.centers()) as h}
    <path
      in:draw={{ duration: 500 }}
      out:draw={{ duration: 500 }}
      class="hex-cell"
      d={`M${h.x},${h.y}${hexbins.hexagon()}`}
      fill={colorScale(hexFillRules($fillRule, h))}
      stroke={colorScale(hexFillRules($fillRule, h))}
    />
  {/each}
  <!-- {/key} -->
  <!-- x-ticks -->
  {#each xScale.ticks() as tick}
    <g transform={`translate(${xScale(tick) + 0} ${height + margin.bottom})`}>
      <line
        class="axis-tick"
        x1="0"
        x2="0"
        y1={-margin.bottom}
        y2={-height + margin.bottom * 2}
      />
    </g>
  {/each}
  <!-- y-ticks -->
  {#each yScale.ticks() as tick}
    <g transform={`translate(${margin.left - 5} ${yScale(tick) + 0})`}>
      <line
        class="axis-tick"
        x1={4}
        x2={width - margin.right - margin.left}
        y1="0"
        y2="0"
      />
    </g>
  {/each}

  <!-- {#key $bpSlope} -->
  {#each data as d, i}
    <circle
      class="dot"
      cx={xScale(d.x)}
      cy={yScale(d.y)}
      fill={colorScale(d.class)}
      class:wrong={rRules($strokeRule, d)}
      r="4"
    />
  {/each}
  <!-- {/key} -->
</g>

<style>
  * {
    color: white;
  }

  #bg-rect {
    fill: var(--darksquidink);
    stroke: var(--squidink);
    stroke-width: 2;
  }

  .hex-cell {
    transition: all 1s;
    stroke-width: 2;
  }

  .axis-tick {
    stroke-width: 1;
    stroke: var(--white);
    fill: none;
    opacity: 0.05;
  }

  circle {
    transition: all 1s;
    stroke: var(--white);
  }
  circle.dot {
    /* stroke: var(--bg);
    stroke-width: 0.5; */
  }
  .wrong {
    r: 7;
    stroke: white;
    stroke-width: 4;
  }
</style>
