<script>
  import katexify from "../katexify";
  import { selectAll } from "d3-selection";
  import { format } from "d3-format";

  import Scatterplot from "./Scatterplot.svelte";
  import { onMount } from "svelte";
  // new
  import {
    sqft,
    coeff,
    intercept,
    showRegressionLine,
    showResiduals,
  } from "../store.js";

  const formatter = format("$,");

  let scatterClass;

  // let sections;
  const target2event = {
    0: () => {
      scatterClass.hideAnnotationLines();
      $showRegressionLine = true;
      $showResiduals = false;
      $coeff = 0;
      $intercept = 293683;
    },
    1: () => {
      // scatterClass.showResidualLines();
      $showRegressionLine = true;
      $showResiduals = true;
      // $coeff = 1.105;
      // $intercept = 0.544;
    },

    2: () => {
      scatterClass.hideAnnotationLines();
      $coeff = 756.9;
      $intercept = -27153.8;
      $showResiduals = true;
      $showRegressionLine = true;
    },
    3: () => {
      scatterClass.showAnnotationLines();
      $showResiduals = false;
      $showRegressionLine = true;
      $coeff = 756.9;
      $intercept = -27153.8;
    },
    4: () => {
      $showResiduals = false;
      $showRegressionLine = true;
      $coeff = 0.097;
      $intercept = -27153.8;
    },
    5: () => {},
  };

  function fireEvent(entryIndex) {
    if (entryIndex in target2event) {
      target2event[entryIndex]();
    }
  }

  onMount(() => {
    // store elements to track
    let sections = selectAll(".step").nodes();

    // observe elements to track
    sections.forEach((section) => {
      observer.observe(section);
    });
  });

  // options for intersection observer
  const options = {};

  let observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // check if visible or not
      if (entry.isIntersecting) {
        // resolve stage in graph
        const entryIndex = entry.target.getAttribute("data-index");
        const node = document.querySelectorAll(`[data-index="${entryIndex}"]`);

        if (entryIndex in target2event) {
          fireEvent(entryIndex);
        }
      }
    });
  }, options);
</script>

<h2 class="body-header">How It Works, Briefly</h2>
<p class="body-text">
  To make linear regression easier to digest, let's go through a quick,
  high-level introduction of how it works. We’ll scroll through the core
  concepts of the algorithm at a high-level, and then delve into the details
  thereafter:
</p>
<section>
  <div class="section-container">
    <div class="steps-container">
      <div class="step" data-index="1">
        <div class="step-content">
          <p>
            Let's fit a model to predict housing price ($) from the size of the
            house (in square-footage):
            <br /><br />
            {@html katexify(
              `\\text{house-price} = \\hat{\\beta_1} * sqft + \\hat{\\beta_0}`,
              false
            )}
            <br /><br />
            We'll start with a very simple model, predicting the price of each house
            to be just the average house price in our dataset, ~$290,000, ignoring
            the different sizes of each house:
            <br /><br />
            {@html katexify(`\\text{house-price} = 0 * sqft + 290000`, false)}
          </p>
        </div>
      </div>
      <div class="step" data-index="2">
        <div class="step-content">
          <p>
            Of course we know this model is bad - the data doesn't fit the data
            well at all. But how can do quantify exactly <i>how</i> bad?
            <br /><br />
            To evaluate our model's performance quantitatively, we plot the error
            of each observation directly. These errors, or
            <span class="bold">residuals</span>, measure the distance between
            each observation and the predicted value for that observation. We'll
            make use of these residuals later when we talk about evaluating
            regression models, but we can clearly see that our model has a lot
            of error.
          </p>
        </div>
      </div>
      <div class="step" data-index="3">
        <div class="step-content">
          <p>
            The goal of linear regression is reducing this error such that we
            find a line/surface that 'best' fits our data. For our simple
            regression problem, that involves estimating the slope and intercept
            of our model, {@html katexify(`\\hat{\\beta_1}`, false)} and {@html katexify(
              `\\hat{\\beta_0}`,
              false
            )}.
            <br /><br />
            For our specific problem, the best fit line is shown. There's still error,
            sure, but the general pattern is captured well. As a result, we can be
            reasonably confident that were we to plug in future values of square-footage,
            our predicted values of price would be fairly accurate.
          </p>
        </div>
      </div>
      <div class="step" data-index="4">
        <div class="step-content">
          <p>
            Once we've fit our model, predicting future values is super easy! We
            just plug in any {@html katexify(`x_i`, false)} values into our equation!
            <br /><br />For our simple model, that means plugging in a value for
            {@html katexify(`sqft`, false)} into our model:
          </p>
          <br />
          <div id="input-container">
            <p>{@html katexify(`sqft`, false)} Value: {$sqft}</p>
            <input
              type="range"
              min="36"
              max="775"
              step="1"
              bind:value={$sqft}
              class="slider"
              id="myRange"
            />
          </div>
          <p>
            <br />
            {@html katexify(
              `\\hat{y} = ${$coeff} * ${$sqft} ${$intercept}`,
              false
            )}
            <br />
            {@html katexify(
              `\\hat{y} =  ${Math.round($sqft * $coeff + $intercept, 3)}`,
              false
            )}
            <br />
            <br />
            Thus, for our model predicts a house sized {$sqft} square-feet will cost
            {formatter(Math.round($sqft * $coeff + $intercept, 3))}.
          </p>
          <br /><br />
        </div>
      </div>
      <div class="spacer" />
    </div>
    <div class="charts-container">
      <div class="chart-one">
        <Scatterplot bind:this={scatterClass} />
      </div>
    </div>
  </div>

  <br /><br />
</section>

<style>
  .chart-one {
    width: 100%;
    height: 100%;
  }
  /* space after scroll is finished */
  .spacer {
    height: 40vh;
  }

  .charts-container {
    position: sticky;
    top: 20%;
    width: 50%;
    height: 60vh;
    margin-right: 5%;
  }

  .section-container {
    margin-top: 1em;
    text-align: center;
    transition: background 100ms;
    display: flex;
  }

  .step {
    height: 100vh;
    display: flex;
    place-items: center;
    justify-content: center;
    background: transparent;
  }

  .step-content {
    font-size: 18px;
    background: var(--paper);
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
    opacity: 0.9;
  }

  .steps-container {
    height: 100%;
  }

  .steps-container {
    flex: 1 1 40%;
    z-index: 10;
  }

  .slider {
    -webkit-appearance: none;
    width: 100%;
    height: 15px;
    border-radius: 5px;
    background: var(--stone);
    outline: none;
    opacity: 0.9;
    -webkit-transition: 0.2s;
    transition: opacity 0.2s;
    border-color: var(--squidink);
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: var(--sky);
    cursor: pointer;
  }

  /* Comment out the following line to always make it 'text-on-top' */
  @media screen and (max-width: 950px) {
    .section-container {
      flex-direction: column-reverse;
    }

    .steps-container {
    }

    .charts-container {
      top: 7.5%;
      width: 95%;
      margin: auto;
    }

    .step {
      height: 120vh;
      background: transparent;
      color: var(--squidink);
    }

    .step-content {
      width: 95%;
      max-width: 768px;
      font-size: 17px;
      line-height: 1.6;
    }
  }
</style>
