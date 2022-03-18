<script>
    export let step;
  
    let data = [
      { foo: 4, bar: 1, swag: 7 },
      { foo: 1, bar: 3, swag: 3 },
      { foo: 9, bar: 5, swag: 4 },
      { foo: 2, bar: 5, swag: 5 },
      { foo: 10, bar: 4, swag: 6 },
      { foo: 9, bar: 5, swag: 7 },
      { foo: 5, bar: 3, swag: 8 },
      { foo: 4, bar: 10, swag: 9 },
      { foo: 1, bar: 6, swag: 10 },
    ];


      
    import { scaleLinear, scaleSqrt } from "d3-scale";
    import { extent, min, max } from "d3-array";
    import { tweened } from "svelte/motion";
    import { cubicOut } from "svelte/easing";
  
    let width;
    let height;
  
    const margin = { top: 30, bottom: 30, left: 30, right: 30 };
  
    const tweenOptions = {
      delay: 0,
      duration: 1000,
      easing: cubicOut,
    };
  
    const tweenedX = tweened(
      data.map((d) => d.foo),
      tweenOptions
    );
  
    const tweenedY = tweened(
      data.map((d) => d.bar),
      tweenOptions
    );
  
    $: tweenedData = data.map((d, index) => ({
      x: $tweenedX[index],
      y: $tweenedY[index]
    }));
  
    function setTween(dimension, key) {
      dimension.set(data.map((d) => +d[key]));
    }
  
    $: {
      if (step == 0) {
        setTween(tweenedX, "foo");
        setTween(tweenedY, "bar");
      }
      if (step == 1) {
        setTween(tweenedX, "foo");
        setTween(tweenedY, "swag");
      }
      if (step == 2) {
        setTween(tweenedX, "swag");
      }
    }
  
    $: xScale = scaleLinear()
      .domain(extent($tweenedX, (d) => d))
      .range([margin.left, width - margin.right]);
  
    $: yScale = scaleLinear()
      .domain(extent($tweenedY, (d) => d))
      .range([height - margin.top, margin.bottom]);
  </script>
  
  <div
    class="sc-container"
    bind:offsetWidth={width}
    bind:offsetHeight={height}
  >
    <svg width={width + margin.right + margin.left} height={height}>
      {#each tweenedData as d}
        <circle
          cx={xScale(d.x)}
          cy={yScale(d.y)}
          r={15}
          fill="steelblue"
          stroke="#000000"
          opacity=".9"
        />
      {/each}
    </svg>
  </div>
  
  <style>
    .sc-container {
      height: 100%;
      max-width: 100%;
      background: linear-gradient(to bottom right, steelblue -100%, white 100%);
      border-radius: 5px;
      box-shadow: 1px 1px 6px #cecece;
    }
  </style>