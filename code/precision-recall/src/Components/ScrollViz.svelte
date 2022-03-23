<script>
  import Scrolly from "./Scrolly.svelte";
  import katexify from "../katexify";
  import ConfusionMatrix from "./ConfusionMatrix.svelte";
  import { TP, FP, TN, FN, stage } from "./data-store.js";
  import { LayerCake, Svg, Html } from "layercake";
  import { scaleLinear, scaleOrdinal } from "d3-scale";

  import Key from "./Key-html.svelte";
  import AxisX from "./BeeswarmAxisX.svelte";
  import AxisY from "./AxisY.svelte";
  import Beeswarm from "./BeeswarmForce.svelte";
  import DecisionBoundary from "./DecisionBoundary.svelte";

  import { scatterData } from "./datasets.js";

  const xKey = "weight";
  const zKey = "outcome";

  const r = 11;

  const seriesNames = new Set();
  const seriesColors = ["#7e93ee", "#ff99ff"];
  const reScaleX = scaleLinear().domain([0.4, 15]).range([0, 1]);

  const dataTransformed = scatterData.map((d) => {
    seriesNames.add(d[zKey]);

    return {
      [zKey]: d[zKey],
      [xKey]: +reScaleX(+d[xKey]),
      xx: +reScaleX(+d[xKey]),
    };
  });

  // Track metrics
  $: accuracy = ($TP + $TN) / ($TP + $TN + $FP + $FN);
  $: precision = $TP / ($TP + $FP);
  $: recall = $TP / ($TP + $FN);

  // scroll iterator
  let value;

  // Paragraph text for scrolly
  $: steps = [
    `<h1>Accuracy</h1>
     <p>Our cancer classifier uses a classification threshold of 0.5, so we classify patients with probabilities
       greater than 0.5 to be cancer-positive, otherwise cancer-free. This is a common threshold for models that output probabilities,
      as it has the intuitive effect of assigning values to be positive when the model determines that they're more than 50% likely to be positive. 
      (<span class='bold'>Try moving the threshold for yourself!</span>)<br><br>
      Our model's accuracy is then:<br><br>
      ${katexify(
        `\\begin{aligned} \\frac{\\mathrm{TP + TN}}{\\mathrm{TP + FP + TN + FN}} = \\frac{${
          $TP + $TN
        } }{${$TP + $FP + $TN + $FN}} \\end{aligned}`
      )} 
       ${katexify(`\\approx ${Math.round(accuracy * 100)}\\%`)}
      </p>`,
    `<h1>Problems</h1>
      <p>A big issue with our data (and common amongst many classification tasks) is imbalance: our data has three times more negative examples than positive!
        This is problematic, because if our model were to simply predict <i>every</i> individual as being cancer-free, it would have an accuracy of <br><br>
        ${katexify(
          `\\begin{aligned} \\frac{\\mathrm{\\# Positive}}{\\mathrm{\\# Samples}} = \\frac{26}{34} = 76\\% \\end{aligned}`
        )}<br><br>
        The more imbalanced the data, the more Severe the issue: imagine a search engine that never gives results because the information you are looking
         for is only 0.01% of the internet!  We need other metrics.
        </p>
      `,
    `<h1>Precision</h1>
      <p>One such metric is precision. Precision is the ratio of correctly predicted positive classes to <i>all items predicted to be positive:</i><br><br>
      ${katexify(
        `\\begin{aligned} \\frac{\\mathrm{TP}}{\\mathrm{TP + FP}} = \\frac{${$TP} }{${
          $TP + $FP
        }} \\approx ${Math.round(precision * 100)}\\% \\end{aligned}`
      )} <br><br>
      Intuitively, this tells us how correct, or <i>precise</i>, are our model's positive predictions. 
      Precision is important when we believe False Positives are more important than False Negatives (e.g. spam detection). 
      <span class='bold'>Try moving the threshold</span> to see how precision worsens with the increase of False Positives.</p>`,
    `<h1>Recall</h1>
      <p>A related metric is recall. Recall is the ratio of correctly predicted positive classes to <i>all items that are actually positive:</i><br><br>
      ${katexify(
        `\\begin{aligned} \\frac{\\mathrm{TP}}{\\mathrm{TP + FN}} = \\frac{${$TP} }{${
          $TP + $FN
        }} \\approx ${Math.round(recall * 100)}\\%  \\end{aligned}`
      )} <br><br>
      It measures how many of the actual positive instances we were able to correctly predict (or <i>recall</i>). 
      Recall is important when we believe False Negatives are more important than False Positives (e.g. our problem of cancer detection).
      </p>`,
    `<h1>Tradeoff</h1>
      <p>Ideally, our model would have both perfect precision <i>and</i> perfect recall. However, in practice there often exists a tradeoff between the two.
        <span class='bold'>Move the classification threshold around to observe the tradeoff for yourself:</span><br> <br>
        <span class='bold'>Precision:</span> ${Math.round(precision * 100)}% 
        <br><br>
        <span class='bold'>Recall:</span> ${Math.round(recall * 100)}% 
        <br><br>
        </p>`,
  ];

  const target2event = {
    0: () => {
      $stage = "none";
    },
    1: () => {
      $stage = "none";
    },
    2: () => {
      $stage = "precision";
    },
    3: () => {
      $stage = "recall";
    },
    4: () => {
      $stage = "none";
    },
    5: () => {
      $stage = "none";
    },
  };

  // trigger events on scroll typeof lastname !== "undefined"
  // $: if (value) target2event[value]()
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
      <!-- <Scatterplot step={value} /> -->
      <div class="chart-container">
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
            <AxisY />
            <Beeswarm
              r={width < 400 ? r / 1.15 : r}
              strokeWidth={2}
              xStrength={0.95}
              yStrength={0.075}
            />
            <DecisionBoundary />
          </Svg>

          <Html pointerEvents={false}>
            <Key shape="circle" />
          </Html>
        </LayerCake>
      </div>
      <ConfusionMatrix />
    </div>
  </div>
  <!-- end scroll -->
  <br /><br />
  <p class="body-text">
    Because of this tradeoff, it's important to understand the problem that
    you're trying to solve and any inherent consequences of favoring False
    Positives over False Negatives (or vice versa).
    <br /><br />
    Take our cancer example: designing a model with high recall will identify most
    people that have cancer (<i>true positives</i>), saving their lives, but at
    the cost of misdiagnosing healthy individuals as having cancer (<i
      >false positives</i
    >), subjecting them to expensive and dangerous treatments like chemotherapy.
    On the other hand, designing a model for precision yields confident
    diagnoses (i.e. someone predicted as having cancer very likely does have
    cancer), but at the cost of failing to identify everyone who has the disease
    (false negatives), resulting in potentially fatal consequences for those
    left undiagnosed. (Because False Negatives result in death, our
    classification threshold would likely be set to optimize recall over
    precision).
    <br /><br />
    Thus, it's important to understand and decide ahead of time what's more consequential,
    <span class="bold">False Positives</span> or
    <span class="bold">False Negatives</span>, to investigate how the tradeoff
    manifests for your particular dataset, and to design your model accordingly.
  </p>
</section>

<style>
  :global(body) {
    overflow-x: hidden;
    background-color: #f1f3f3;
  }

  .chart-container {
    width: 95%;
    height: 100%;
  }
  /* space after scroll is finished */
  .spacer {
    height: 40vh;
  }

  .charts-container {
    position: sticky;
    top: 12%;
    display: grid;
    width: 50%;
    grid-template-columns: 100%;
    grid-row-gap: 2rem;
    grid-column-gap: 0rem;
    grid-template-rows: 50% 30%;
    height: 85vh;
    /* border: 2px solid red; */
  }

  .section-container {
    margin-top: 1em;
    text-align: center;
    transition: background 100ms;
    display: flex;
  }

  .step {
    height: 105vh;
    display: flex;
    place-items: center;
    justify-content: center;
  }

  .step-content {
    font-size: 1.1rem;
    background: whitesmoke;
    color: #ccc;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: background 500ms ease;
    box-shadow: 1px 1px 9px var(--squid-ink);
    text-align: left;
    width: 75%;
    margin: auto;
    max-width: 500px;
    font-family: var(--font-main);
    line-height: 1.5;
  }

  .step.active .step-content {
    background: white;
    color: black;
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
      height: 150vh;
    }

    .step-content {
      width: 95%;
      max-width: 768px;
      font-size: 17px;
      line-height: 1.5;
      padding: 0.5rem;
    }

    .spacer {
      height: 100vh;
    }
  }

  /* responsive height for small screens */
  @media screen and (max-height: 620px) {
    .step {
      height: 170vh;
    }
    .spacer {
      height: 120vh;
    }
  }
</style>
