<script>
  import Scrolly from "./Scrolly.svelte";
  import katexify from "../katexify";
  import { select, selectAll } from "d3-selection";
  // import BeeSwarm from "./Beeswarm.svelte";
  import ROCScatter from "./ROCScatter.svelte";
  // import ConfusionMatrix from "./ConfusionMatrix.svelte";
  // import { TP, FP, TN, FN, stage } from "./data-store.js";
  import { LayerCake, Svg, Html } from "layercake";
  import { scaleLinear, scaleOrdinal } from "d3-scale";
  import Key from "./Key-html.svelte";
  import AxisX from "./BeeswarmAxisX.svelte";
  import AxisY from "./AxisY.svelte";
  import Beeswarm from "./BeeswarmForce.svelte";
  import DecisionBoundary from "./DecisionBoundary.svelte";
  import { scatterData } from "../datasets.js";

  const xKey = "xVal";
  const zKey = "yVal";
  const r = 7;
  const seriesNames = new Set();
  const seriesColors = ["#7e93ee", "#ff99ff"];
  const reScaleX = scaleLinear().domain([0.4, 15]).range([0, 1]);
  const dataTransformed = scatterData.map((d) => {
    seriesNames.add(d[zKey]);
    return {
      [zKey]: d[zKey],
      [xKey]: +d[xKey],
      xx: +d[xKey],
    };
  });

  console.log("dt", dataTransformed);

  // scroll iterator
  let value;

  // Paragraph text for scrolly
  $: steps = [
    `<h1 class='step-title'>Step 1</h1>
     
         <br><br>
         The chart on the top shows our classification model. Our ‘classification threshold’ is simply the current position of this model’s decision boundary, in this case 5, so anything greater than 5 we classify as an apple, otherwise we call it a banana. Different classification thresholds may output predictions, and therefore different values for False Positives or True Positives. We’ll build out our ROC Curve in the chart below by plotting the TPR vs FPR for different thresholds of our model, starting with our current point:
        </p>`,
    `<h1 class='step-title'>Step 2</h1>
        <p>By moving our decision boundary to the right, we can observe that we’ve correctly classified 2 more values, at the cost of 5 poor values. We’ll plot this point and see if we can do better: </p>
        `,
    `<h1 class='step-title'>Step 3</h1>
        <p>By moving our classification boundary threshold yet again, we obtain yet another point</p>`,
    `<h1 class='step-title'>Step 4</h1>
        <p>As we try more and more points, we build out a clear curve of results. This curve is our ROC curve. Each point refers to a TP vs FP rate for a different threshold of our model. </p>`,
  ];

  const target2event = {
    0: () => {
      // move decision bonudary to middle position
      // console.log(select("rect.decision-boundary-bar"))
      // console.log('0' )
      // $stage = 'none';
    },
    1: () => {
      // $TP += 1;
      // selectAll('circle').attr('r', 40)
      // $stage = 'none';
    },

    2: () => {
      // $FP += 3;
      // $stage = 'precision';
    },
    3: () => {
      // $stage = 'recall';
      // $TN += 3;
    },
    4: () => {
      // $TN += 5;
      // $stage = 'none';
    },
    5: () => {
      // $FP += 4;
      // $stage = 'none';
    },
  };

  // trigger events on scroll typeof lastname !== "undefined"
  // $: if (value) target2event[value]()
  $: if (typeof value !== "undefined") target2event[value]();
</script>

<h2 class="body-header">Radio Operator Curves (ROC)</h2>
<p class="body-text">
  Here's an example of a typical side-scroller. It's responsive, and will fold
  to an overlap scroll if the screen gets small enough:
</p>
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
            <!-- <AxisY /> -->
            <Beeswarm
              r={width < 400 ? r / 1.15 : r}
              strokeWidth={2}
              xStrength={0.05}
              yStrength={0.075}
            />
            <DecisionBoundary />
          </Svg>

          <Html pointerEvents={false}>
            <Key shape="circle" />
          </Html>
        </LayerCake>
      </div>
      <!-- <BeeSwarm /> -->
      <ROCScatter />
    </div>
  </div>
  <!-- end scroll -->
  <br /><br />
  <p class="body-text">And that's the end of our scrolly.</p>
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
    /* margin: auto; */
    width: 90%;
    max-height: 95%;
    /* max-height: 50%; */
    /* border: 3px solid skyblue; */
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
    grid-template-rows: 40% 45%;
    height: 80vh;
    padding-right: 1rem;
    /* border: 3px solid black; */
  }

  .section-container {
    margin-top: 1em;
    text-align: center;
    transition: background 100ms;
    display: flex;
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
    box-shadow: 1px 1px 8px #7e93ee;
    text-align: left;
    width: 75%;
    margin: auto;
    max-width: 500px;
    font-family: var(--font-main);
    line-height: 1.3;
  }

  .step.active .step-content {
    background: white;
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
      width: 95%;
      margin: auto;
    }

    .step {
      height: 130vh;
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
</style>
