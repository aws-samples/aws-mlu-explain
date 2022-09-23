<script>
  import { scaleBand } from "d3-scale";
  import { margin } from "../store";

  //   props
  export let height = 500;
  export let numRects = 100;
  export let numCol = 5;
  export let x = 0;
  export let y = 0;
  // rule to color rects (by index)
  export let fillRule = (i) => {
    return "#232f3e";
  };
  // prop to label rects
  // should take form [{label: 'str, y: int}]
  // where y is a column #
  export let labels;

  // consts
  const data = [...Array(numRects).keys()];

  //   reactive vars
  $: numRow = Math.ceil(numRects / numCol);
  $: dataDomain = [...Array(numRow).keys()];

  $: rectYScale = scaleBand()
    .domain(dataDomain)
    .range([height - $margin.top, $margin.bottom])
    .padding(0.1);

  $: radius = rectYScale.bandwidth();
  $: radiusGap = radius + 2;
</script>

<!-- Stacked Rectangles -->
<g transform="translate({x}, {y})">
  {#each data as d, i}
    <rect
      x={(d % numCol) * radiusGap}
      y={rectYScale(Math.floor(d / numCol))}
      width={radius}
      height={radius}
      fill={fillRule(i)}
    />
  {/each}
  <!-- Optional labels over each rect -->
  {#if labels}
    {#each labels as label}
      <text
        class="rect-text"
        x="0"
        y={rectYScale(label.y) + radius * 2}
        dy={label.dy}
        dx={radius * 2.5}
        text-anchor="middle">{label.label}</text
      >
    {/each}
  {/if}
</g>

<style>
  text {
    font-family: var(--font-heavy);
    stroke-linejoin: round;
    paint-order: stroke fill;
    stroke-width: 6px;
    pointer-events: none;
    stroke: #f1f3f3;
    font-size: 1.2rem;
    letter-spacing: 1px;
    opacity: 1;
    fill: "#232f3e";
  }
</style>
