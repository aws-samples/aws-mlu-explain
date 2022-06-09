<script>
  import Scrolly from "./Scrolly.svelte";
  import { select, selectAll } from "d3-selection";
  import ROCScatter from "./ROCScatter.svelte";
  import { radius, rocCircles, xPoss } from "../data-store.js";
  import { LayerCake, Svg, Html } from "layercake";
  import { range } from "d3-array";
  import { scaleOrdinal } from "d3-scale";
  // import Key from "./Key-html.svelte";
  import AxisX from "./BeeswarmAxisX.svelte";
  import Beeswarm from "./BeeswarmForce.svelte";
  import DecisionBoundary from "./DecisionBoundary.svelte";
  import { scatterData } from "../datasets.js";
  import { transition } from "d3-transition";

  const xKey = "xVal";
  const zKey = "yVal";
  const seriesNames = new Set();
  const seriesColors = ["#c9208a", "#7cd1ea"];
  const dataTransformed = scatterData.map((d) => {
    seriesNames.add(d[zKey]);
    return {
      [zKey]: d[zKey],
      [xKey]: +d[xKey],
      xx: +d[xKey],
    };
  });

  // scroll iterator
  let value;
  // variable to break loop if scroll up too fast
  let scrollStageTrack = 2;

  // Paragraph text for scrolly
  $: steps = [
    `<h3 class='step-title'>Our First Threshold</h3>
       <p>We'll start with our model's classification threshold at 0,
        so anything with a probability greater-than-or-equal-to zero of being an airplane,
         we'll classify as an airplane. In other words, everything will be classified as an airplane!
         <br><br>
        While this model will correctly classify every airplane as an airplane (yielding a perfect <span class='bold'>TPR=1</span>), 
       it will also incorrectly classify every radar noise as an airplane (giving us the worst possible <span class='bold'>FPR=1</span>). 
      </p>`,
    `<h3 class='step-title'>Some New Thresholds</h3>
      <p>Clearly our first model was awful - we can do better! But how much better?
        <br><br> To find out, let's try some new threshold values.
        We'll move our threshold more and more to the right, increasing the threshold at which we classify a radar signal as an airplane.
        To assess the performance, we calculate the TPR and FPR for each new threshold choice, and plot them below.
    `,
    `<h3 class='step-title'>And More Thresholds</h3>
      <p>
        Recall that our goal is to find the classification threshold that best maximizes true positives while minimizing false positives. 
        <br><br>
        To find that threshold, we'll have to try all possible values for our threshold!
        <br><br>
        So that's exactly what we'll do: continue increasing our threshold until we can't any further (i.e. moving it all the way to the right),
         logging each TPR and FPR along the way.</p>`,
    `<h3 class='step-title'>The ROC Curve</h3>
      <p>After plotting each classification threshold's corresponding TPR and FPR, we obtain our ROC curve! 
        <br><br>This curve gives us a convenient
        visual of the performance of our classifier. It allows us to understand how that performance changes as a function of the model's classification threshold.
        <br><br>
        <span class='bold'>Drag the threshold for yourself to see its corresponding point along our ROC Curve!</span>
        <br>(Which threshold would you choose?)
      </p>`,
  ];

  const target2event = {
    0: () => {
      $rocCircles = [];
      $xPoss = -0.01;
    },
    1: () => {
      scrollStageTrack = 1;
      const xs = range(0.0, 0.45, 0.015);
      xs.forEach((x, i) => {
        setTimeout(() => {
          if (scrollStageTrack === 1) {
            $xPoss = x;
          }
        }, i * 40);
      });
    },

    2: () => {
      scrollStageTrack = 2;
      selectAll(".roc-circle").transition().attr("r", $radius);
      const xs = range(0.45, 0.98, 0.015);
      xs.forEach((x, i) => {
        setTimeout(() => {
          if (scrollStageTrack === 2) {
            $xPoss = x;
          }
        }, i * 40);
      });

      select(".highlight-circle").style("opacity", 1);
      select("#highlight-text").style("opacity", 1);
      select("#highlight-tspan").style("opacity", 1);
    },

    3: () => {
      selectAll(".roc-circle")
        .transition()
        .attr("r", $radius + 1)
        .transition()
        .attr("r", 0);

      select(".highlight-circle").style("opacity", 0);
      select("#highlight-text").style("opacity", 0);
      select("#highlight-tspan").style("opacity", 0);
    },
    4: () => {},
  };

  // trigger events on scroll typeof lastname !== "undefined"
  $: if (typeof value !== "undefined") target2event[value]();
</script>

<section>
  <!-- scroll container -->
  <div class="section-container">
    <div class="steps-container">
      <Scrolly bind:value>
        {#each steps as text, i}
          <div class="step" class:active={value === i}>
            <div class="step-content">{@html text}</div>
          </div>
        {/each}
        <div class="spacer" />
      </Scrolly>
    </div>
    <div class="charts-container">
      <div class="bs-chart">
        <LayerCake
          padding={{ bottom: 15 }}
          x={xKey}
          y="50"
          z={zKey}
          zScale={scaleOrdinal()}
          zDomain={Array.from(seriesNames)}
          zRange={seriesColors}
          data={dataTransformed}
          let:width
        >
          <Svg>
            <AxisX />
            <Beeswarm
              r={width < 700 ? 5.5 : 6.5}
              strokeWidth={1}
              xStrength={0.05}
              yStrength={0.075}
            />
            <DecisionBoundary />
          </Svg>

          <!-- <Html pointerEvents={false}>
            <Key shape="circle" />
          </Html> -->
        </LayerCake>
      </div>
      <ROCScatter />
    </div>
  </div>
  <!-- end scroll -->
  <br /><br />
</section>

<style>
  :global(body) {
    overflow-x: hidden;
  }

  :global(h1) {
    color: var(--squid-ink);
    font-family: var(--font-heavy);
  }

  :global(p) {
    color: var(--squid-ink);
    font-family: var(--font-main);
    font-weight: none;
  }

  .bs-chart {
    width: 94%;
    max-height: 95%;
    padding-left: 5%;
  }

  /* space after scroll is finished */
  .spacer {
    height: 40vh;
  }

  .charts-container {
    position: sticky;
    top: 10%;
    display: grid;
    width: 50%;
    grid-template-columns: 100%;
    grid-row-gap: 3rem;
    grid-column-gap: 0rem;
    grid-template-rows: 45% 47%;
    height: 80vh;
    padding-right: 1rem;
  }

  .section-container {
    margin-top: 1em;
    text-align: center;
    transition: background 100ms;
    display: flex;
    flex-direction: row-reverse;
  }

  .step {
    height: 110vh;
    display: flex;
    place-items: center;
    justify-content: center;
  }

  .step-content {
    font-size: 18px;
    background: whitesmoke;
    color: #ccc;
    border-radius: 1px;
    padding: 0.5rem 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: background 500ms ease;
    text-align: left;
    width: 75%;
    margin: auto;
    max-width: 500px;
    font-family: var(--font-main);
    line-height: 1.3;
    border: 5px solid #232f3e;
  }

  .step.active .step-content {
    background: #f1f3f3ee;
    color: var(--squid-ink);
  }

  .steps-container {
    height: 100%;
  }

  .steps-container {
    flex: 1 1 40%;
    z-index: 10;
  }

  /* Comment out the following line to always make it 'text-on-top' */
  @media screen and (max-width: 950px) {
    .section-container {
      flex-direction: column-reverse;
    }

    .steps-container {
      pointer-events: none;
    }

    .charts-container {
      top: 7.5%;
      width: 99%;
      margin: auto;
    }

    .step {
      height: 185vh;
    }

    .step-title {
      display: none;
    }

    .step-content {
      width: 95%;
      max-width: 768px;
      font-size: 17px;
      line-height: 1.6;
    }

    .spacer {
      height: 100vh;
    }
  }

  @media screen and (max-width: 750px) {
    .section-container {
      flex-direction: column-reverse;
    }

    .steps-container {
      pointer-events: none;
    }

    .charts-container {
      top: 7.5%;
      width: 99%;
      grid-template-columns: 90%;
      grid-row-gap: 20%;
      grid-column-gap: 0rem;
      grid-template-rows: 40% 40%;
      padding-right: 0.1rem;
      padding-left: 2rem;
    }

    .step {
      height: 185vh;
    }

    .step-content {
      width: 95%;
      max-width: 768px;
      font-size: 17px;
      line-height: 1.6;
    }

    .spacer {
      height: 100vh;
    }
  }

  @media screen and (max-height: 550px) {
    .step {
      height: 195vh;
    }
    .charts-container {
      top: 5.5%;
      height: 90vh;
    }
  }
</style>
