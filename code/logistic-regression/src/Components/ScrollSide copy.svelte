<script>
  import Scrolly from "./Scrolly.svelte";
  import katexify from "../katexify";
  import { scaleOrdinal } from "d3-scale";
  import { select, selectAll } from "d3-selection";
  import Scatterplot from "./Scatterplot.svelte";

  // import { scatterData } from './datasets.js';

  // const xKey = "weight";
  // const yKey = "weight";
  // const zKey = "outcome";
  // const titleKey = "gender";

  const r = 10;

  const seriesNames = new Set();
  const seriesColors = ["#7e93ee", "#ff99ff"];

  // scroll iterator
  let value;

  // Paragraph text for scrolly
  $: steps = [
    `<h1 class='step-title'>Step 1</h1>
      <p>
        There are two classes: Rainy Days and Rainless Days. We can assign a numeric value of 0 and 1 to each event,
         say 0 to a Rainy Day and 1 to a Rainless Day. For each day, we can plot this value along with the corresponding 
         temperature.
      </p>
      <br><br>
      <p>Clearly, we should not fit a linear model to these data. The outcomes of a linear model can take any numerical 
        value, but these data can only take on outcomes of 0 or 1, so the predictions of a linear model may not be meaningful. 
      </p>
      `,
    `<h1 class='step-title'>Step 2</h1>
      <p> Instead, we can fit a logistic function to the data. The values of this function can be interpreted as 
        probabilities, as the values range between 0 and 1. We can interpret the line as the probability of a rainless
         day given a particular temperature.
      </p>
      `,
      `<h1 class='step-title'>Step 3</h1>
    <p>Finally, now that we have the logistic function to predict the probabilities of each outcome, we can make a prediction of the class. How do we make this prediction? We use a decision boundary, for which we decide on the class based on the probability of that class given the feature values. A typical decision boundary is 0.5, where we predict an outcome will occur if the probability at that outcome is greater than 0.5. This boundary can be adjusted based on the particular situation at hand — for example, if you really really dislike the rain, you may want to set the boundary lower to be more cautious, such that you predict a rainy day at a lower probability.
      </p>
      `
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

<h2 class="body-header">How it Works</h2>
<p class="body-text">
  Suppose that you want to go for a hike in Seattle. You want to predict whether
  it will rain or not, so that you can decide whether to hike or drink coffee
  indoors at a local cafe. You know that it rains often in Seattle, but you’ve
  heard the summers have nice weather. The question is: can we predict whether
  there will be no rain, given factors such as the temperature?
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
      <!-- <Scatterplot step={value} /> -->
      <div class="chart-one">
        <Scatterplot />
      </div>
    </div>
  </div>
  <!-- end scroll -->
  <br /><br />
  <p class="body-text">And that's the end of our scrolly.</p>
</section>

<style>
  .chart-one {
    width: 100%;
    height: 100%;
    /* border: 3px solid skyblue; */
  }

  /* space after scroll is finished */
  .spacer {
    height: 40vh;
  }

  .charts-container {
    position: sticky;
    top: 20%;
    width: 50%;
    height: 50vh;
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
    background: var(--bg);
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
    border: 5px solid var(--default);
  }

  .step.active .step-content {
    background: #f1f3f3ee;
    color: var(--squidink);
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
