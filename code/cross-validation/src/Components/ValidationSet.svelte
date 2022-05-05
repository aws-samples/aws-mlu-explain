<script>
  import { scaleBand, scaleOrdinal } from "d3-scale";
  import { range } from 'd3-array';
  import {scale, draw} from 'svelte/transition'
	import { quintIn, quintOut } from 'svelte/easing';
  import {
    forceSimulation,
    forceX,
    forceY,
    forceCollide,
  } from 'd3-force';
  import { each } from "svelte/internal";


  // these don't matter, but make the stretching less obvious at load
  let height = 500;
  let width = 500;
  // responsive margins
  const mobile = window.innerWidth <= 700;
  const margin = {
    top: mobile ? 40 : 50,
    bottom: mobile ? 10 : 25,
    left: mobile ? 0 : 80,
    right: mobile ? 0 : 10,
  };

  // scales
  let dotXScale = scaleBand()
  .domain(['','train','validate','test',''])
  .range([0, width - margin.right])

  let colorScale = scaleOrdinal()
  .domain(['train','validate','test'])
  .range(['darkslateblue','hotpink','limegreen'])
  
  // simulation data
  let xStrength = 1
  let yStrength = 1
  let nodes = [];
  let data = range(1,100,1).map((d, dNdx)=>({
    value:d,
    category:(dNdx <= 70 ? 'train' : dNdx <= 90 ? 'validate' : 'test')
  }))
  let simulation = forceSimulation(data)


  $: {
    simulation.on("tick", () => {
      nodes = simulation.nodes()  
    })
  }
  $: {
    simulation
    .force('collision', forceCollide().radius(9.5))
    .force('x', forceX().x((d) => dotXScale(d.category)).strength(xStrength))
    .force('y', forceY().y(height/2).strength(yStrength))
    .alpha(.8)
    }

</script>

<h1 class="body-header">Our Previous Approach</h1>
<p class="body-text">
  In <a href="">a previous article</a>, we described a standard technique for
  solving this problem: <span class="bold">The Validation Set Approach</span>.
  Recall this involved randomly splitting our data into three mutually exclusive
  sets:
</p>
<br />
<ul class="body-text">
  <li>
    <span class="bold">The Training Set</span> is used to learn the model parameters.
  </li>
  <li>
    <span class="bold">The Validation Set</span> is used to select which model or
    set of hyperparameters you’d like to use.
  </li>

  <li>
    <span class="bold">The Test Set</span> is used to evaluate how your model will
    perform on unseen data.
  </li>
</ul>
<br />

<div id="cv-chart" bind:offsetWidth={width} bind:offsetHeight={height}>
  <svg
    width={width + margin.left + margin.right}
    height={height + margin.top + margin.bottom}
    overflow="visible"
  >
    <!-- waffleChart -->
    <g>
    {#each nodes as cell, ndx}
        <!-- svelte-ignore component-name-lowercase -->
        <circle
          cx={cell.x}
          cy={cell.y}
          r={10}
          fill={colorScale(cell.category)}
          fill-opacity=".8"
          stroke="black"
          stroke-width="1"
        />
        {/each}
    </g>  

    <!-- waffle labels -->
    <text
    class="error-axis-label"
    y={margin.top / 2}
    x={(width + margin.left) / 2}
    text-anchor="middle">The Validation Set Approach</text
  >
    <text
      class="annotation"
      y={height / 2}
      x={dotXScale('train')}
      text-anchor="middle"
      >Train</text>
      
      <text
      class="annotation"
      y={height / 2}
      x={dotXScale('validate')}
      text-anchor="middle"
      >Validate</text>
      
      <text
      class="annotation"
      y={height / 2}
      x={dotXScale('test')}
      dx="-2"
      text-anchor="middle"
    >Test</text>

  </svg>
</div>
<br /><br />
<p class="body-text">
  The Validation Set Approach is still widely used, especially when resource
  constraints prohibit alternatives that require resampling (like cross
  validation). But the approach is perfect! The obvious issues is that our
  estimate of the test error can be highly variable depending on which
  particular observations are included in the training set and which are
  included in the validation set. That is, how do we know that the 30% we
  selected is the best way to split the data? What if we’d used a different
  split instead? Another issue is that this approach tends to overestimate the
  test error for models fit on our entire dataset. This is because more training
  data usually means better accuracy, but the validation set approach reserves a
  decent-sized chunk of data for validation and testing (and not training). If
  only there was a better resampling method for assessing how the results of a
  statistical analysis will generalize to an independent data set...
</p>

<style>
  #cv-chart {
    margin: auto;
    max-height: 48vh;
    width: 40%;
    margin: 1rem auto;
  }

  .annotation {
    font-family: var(--font-heavy);
    stroke-linejoin: round;
    paint-order: stroke fill;
    stroke-width: 4.4px;
    pointer-events: none;
    stroke: #f1f3f3;
    font-size: 0.95rem;
    letter-spacing: 1px;
    text-transform: uppercase;
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
  .error-axis-text {
    font-size: 0.9rem;
  }

  .axis-line {
    opacity: 0.15;
  }

  #error-text-accuracy {
    fill: #c9208a;
  }

  .error-axis-label {
    text-transform: uppercase;
    font-size: 1rem;
  }

  .path-line {
    fill: none;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 5;
  }

  .outline-line {
    fill: none;
    stroke: #f1f3f3;
    stroke-width: 10;
  }

  ul {
    max-width: 600px;
    margin: auto;
    font-family: var(--font-main);
    font-size: 17px;
    padding-top: 0.5rem;
  }
  li {
    padding: 0.25rem;
  }

  /* ipad */
  @media screen and (max-width: 950px) {
    #cv-chart {
      max-height: 55vh;
      width: 85%;
      margin: 1rem auto;
    }
    .error-axis-label {
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
    .path-line {
      stroke-width: 5;
    }
    .outline-line {
      stroke-width: 9;
    }
  }
  /* mobile */
  @media screen and (max-width: 750px) {
    ul {
      font-size: 18px;
      max-width: 80%;
    }
    #cv-chart {
      max-height: 55vh;
      width: 95%;
      margin: 1rem auto;
    }

    .error-axis-label {
      font-size: 0.75rem;
    }
    .error-axis-text {
      font-size: 0.7rem;
    }
    .error-text {
      stroke-width: 3px;
      stroke: #f1f3f3;
      font-size: 0.7rem;
      letter-spacing: 1px;
    }
    .path-line {
      stroke-width: 4;
    }
    .outline-line {
      stroke-width: 7;
    }
  }
</style>
