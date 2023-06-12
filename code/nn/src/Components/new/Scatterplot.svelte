<script>
  import { scaleLinear, scaleOrdinal } from "d3-scale";
  import { hexbin } from "d3-hexbin";
  import { onDestroy } from "svelte";
  import { moons } from "../../datasets";
  import { min, max } from "d3-array";
  import { stepIndex } from "../../store";
  import { line } from "d3-shape";
  import { draw } from "svelte/transition";
  import {
    logistic,
    perceptron,
    neuralNetwork1,
    neuralNetwork2,
  } from "../../outputModelWeights";
  import { cubicOut, linear } from "svelte/easing";
  import { tweened } from "svelte/motion";

  export let height = 160;
  export let width = 160;

  // const margin = 5;
  let margin = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };
  const hexbinRadius = 5;

  const modelDict = {
    0: logistic,
    1: logistic,
    2: logistic,
    3: logistic,
    4: perceptron,
    5: perceptron,
    6: neuralNetwork1,
    7: neuralNetwork1,
    8: neuralNetwork2,
  };

  // init to false so don't show drawing during rendering

  $: xScale = scaleLinear()
    .domain([
      1.2 * min(moons.map((d) => d.x1)),
      max(moons.map((d) => d.x1)) * 1.2,
    ])
    .range([margin.left, width - margin.right]);

  $: yScale = scaleLinear()
    .domain([
      1.2 * min(moons.map((d) => d.x2)),
      max(moons.map((d) => d.x2)) * 1.2,
    ])
    .range([height - margin.bottom, margin.top]);

  const colorScale = scaleOrdinal()
    .domain([-1, 1])
    .range(["#f46ebb", "#2074d5"]);

  $: hexbins = hexbin()
    .radius(hexbinRadius)
    .extent([
      [0, 0],
      [width - margin.left - margin.right, height - margin.top - margin.bottom],
    ]);

  $: hexBins = hexbins(hexbins.centers()).map((h) => {
    return [xScale.invert(h.x + margin.left), yScale.invert(h.y + margin.top)];
  });

  // responsive dimensions for scatter plot
  $: scatterCondition = ![0, 1].includes($stepIndex);

  // $: model = $stepIndex < 5 ? logistic : perceptron;
  $: model = modelDict[$stepIndex];

  // regression stuff
  const slope = 0.45;
  const intercept = -0.1;
  let data = [
    { x1: -1.6, x2: 1.05 - 0.85, y: 1.0 },
    { x1: -1.43, x2: 0.58 - 0.85, y: 0.0 },
    { x1: -1.26, x2: 0.3 - 0.85, y: 0.0 },
    { x1: -1.09, x2: 0.54 - 0.85, y: 0.0 },
    { x1: -0.92, x2: 0.87 - 0.85, y: 0.0 },
    { x1: -0.75, x2: 0.16 - 0.85, y: 1.0 },
    { x1: -0.58, x2: 0.8 - 0.85, y: 0.0 },
    { x1: -0.41, x2: 0.36 - 0.85, y: 1.0 },
    { x1: -0.24, x2: 0.39 - 0.85, y: 1.0 },
    { x1: -0.07, x2: 0.22 - 0.85, y: 1.0 },
    { x1: 0.1, x2: 1 - 0.85, y: 1.0 },
    { x1: 0.27, x2: 0 - 0.85, y: 1.0 },
    { x1: 0.44, x2: 0.55 - 0.85, y: 1.0 },
    { x1: 0.61, x2: 0.61 - 0.85, y: 1.0 },
    { x1: 0.78, x2: 0.68 - 0.85, y: 0.0 },
    { x1: 0.95, x2: 0.95 - 0.85, y: 0.0 },
    { x1: 1.12, x2: 1.07 - 0.85, y: 0.0 },
    { x1: 1.29, x2: 0 - 0.85, y: 1.0 },
    { x1: 1.46, x2: 1.51 - 0.85, y: 0.0 },
    { x1: 1.63, x2: 1.68 - 0.85, y: 0.0 },
    { x1: 1.9, x2: 1.85 - 0.85, y: 0.0 },
    { x1: 1.97, x2: 1 - 0.85, y: 1.0 },
    { x1: 2.3, x2: 1.2 - 0.85, y: 1.0 },
    { x1: 2.31, x2: 2.16 - 0.85, y: 1.0 },
    { x1: 2.4, x2: 2.15 - 0.85, y: 0.0 },
  ];

  // the path generator
  $: pathLine = line()
    .x((d) => xScale(d.x1))
    .y((d) => yScale(d.x1 * slope + intercept));

  function radiusTransition(node, { duration = 300, from = 0, to = 8 }) {
    const diff = to - from;
    const easing = cubicOut;

    return {
      duration,
      css: (t) => {
        const eased_t = easing(t);
        const r = from + eased_t * diff;
        return `r: ${r};`;
      },
    };
  }

  // tween stuff
  const maxLength = Math.max(moons.length, data.length);

  const startingData = Array(maxLength)
    .fill(null)
    .map((_, i) => {
      return {
        x1: data[i]?.x1 ?? 0.3,
        x2: data[i]?.x2 ?? 0,
        y: data[i]?.y ?? 1,
      };
    });

  // Initialize the tweened store with startingData
  const dataset = tweened(startingData, {
    duration: 500,
    easing: linear,
  });

  let ismoons = false;

  // Create a function to update the tween
  function updateTween() {
    if (ismoons) {
      // Map data to the desired format
      const mappedData = Array(maxLength)
        .fill(null)
        .map((_, i) => {
          return {
            x1: data[i]?.x1 ?? 0,
            x2: data[i]?.x2 ?? 0,
            y: data[i]?.y ?? 1, // Use existing 'y' values or default to 1
          };
        });

      // Update the tween
      dataset.set(mappedData);
    } else {
      // Reset the tween to the original moons with maxLength
      const resetData = Array(maxLength)
        .fill(null)
        .map((_, i) => {
          return {
            x1: moons[i]?.x1 ?? 0,
            x2: moons[i]?.x2 ?? 0,
            y: moons[i]?.y ?? 1,
          };
        });

      dataset.set(resetData);
    }
  }

  $: {
    if ($stepIndex <= 2) {
      ismoons = true;
      updateTween();
    } else {
      ismoons = false;
      updateTween();
    }
  }

  // Clean up the tween when the component is destroyed
  onDestroy(() => {
    dataset.stop();
  });
</script>

<!-- scatterplot -->
{#if scatterCondition}
  <g clip-path="url(#clip)" transform={`translate(0 ${-height / 2})`}>
    {#if $stepIndex > 2}
      {#each hexbins(hexbins.centers()) as h}
        <path
          in:draw={{ duration: 500 }}
          out:draw={{ duration: 0 }}
          class="hex-cell"
          d={`M${h.x},${h.y}${hexbins.hexagon()}`}
          fill={colorScale(
            model(
              xScale.invert(h.x + margin.left),
              yScale.invert(h.y + margin.top)
            )
          )}
        />
      {/each}
      <!-- end hex -->
    {/if}

    {#each $dataset as d, i}
      {#if i > 0}
        <circle
          class="dot"
          cx={xScale(d.x1)}
          cy={yScale(d.x2)}
          r="4"
          fill={$stepIndex > 2 ? colorScale(d.y) : colorScale(1)}
          stroke-width={$stepIndex > 2 ? 2 : 0}
          in:draw={{ duration: 500 }}
          out:draw={{ duration: 0 }}
        />
      {/if}
    {/each}

    <!-- draw for reg -->
    {#if $stepIndex == 2}
      <path
        in:draw={{ duration: 500 }}
        out:draw={{ duration: 500 }}
        class="outer-path"
        d={pathLine($dataset)}
      />
      <path
        in:draw={{ duration: 500 }}
        out:draw={{ duration: 500 }}
        class="inner-path"
        d={pathLine($dataset)}
      />
    {/if}
    <!-- end reg -->
  </g>
{/if}

<style>
  circle {
    transition: all 1s;
  }
  circle.dot {
    stroke: var(--white);
    opacity: 0.85;
  }
  .inner-path {
    stroke: var(--bananayellow);
    stroke-width: 4;
    fill: none;
    transition: all 1s;
    stroke-linecap: round;
  }
  .outer-path {
    stroke: var(--squidink);
    stroke-width: 9;
    fill: none;
    transition: all 1s;
    stroke-linecap: round;
  }

  .hex-cell {
    stroke-width: 0;
    opacity: 0.4;
  }
  circle {
    stroke: var(--bg);
  }
</style>
