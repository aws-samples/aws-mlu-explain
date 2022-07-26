<script>
  import katexify from "../katexify";
  import { selectAll } from "d3-selection";
  import Scatterplot from "./Scatterplot.svelte";
  import {
    sqft,
    lineType,
    coeff,
    intercept,
    showRegressionLine,
    showResiduals,
  } from "../store.js";
  import { onMount } from "svelte";

  let scatterClass;

  // let sections;
  const target2event = {
    0: () => {
      scatterClass.hideAnnotationLines();
      $lineType = "regressionLineFlat";
      $showRegressionLine = true;
      $showResiduals = false;
      $coeff = 1.105;
      $intercept = 0.544;
    },
    1: () => {
      // scatterClass.showResidualLines();
      $lineType = "regressionLineFlat";
      $showRegressionLine = true;
      $showResiduals = true;
      // $coeff = 1.105;
      // $intercept = 0.544;
    },

    2: () => {
      scatterClass.hideAnnotationLines();
      $lineType = "regressionLine";
      $coeff = 1.105;
      $intercept = 0.544;
      $showResiduals = true;
      $showRegressionLine = true;
    },
    3: () => {
      scatterClass.showAnnotationLines();
      $showResiduals = false;
      $showRegressionLine = true;
      $lineType = "regressionLine";
      $coeff = 1.105;
      $intercept = 0.544;
    },
    4: () => {
      $showResiduals = false;
      $showRegressionLine = true;
      $coeff = 0.097;
      $intercept = 2.783;
      $lineType = "regressionLineSqrt";
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
  const options = {
    threshold: 0.7,
  };

  let observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // check if visible or not
      if (entry.isIntersecting) {
        // resolve stage in graph
        const entryIndex = entry.target.getAttribute("data-index");
        if (entryIndex in target2event) {
          fireEvent(entryIndex);
        }
      }
    });
  }, options);

  // $: if (typeof value !== "undefined") target2event[value]();
</script>

<h2 class="body-header">How It Works, Briefly</h2>
<p class="body-text">
  To make linear regression easier to digest, let's go through a quick,
  high-level introduction of how it works. We’ll scroll through the core
  concepts of the algorithm at a high-level, and then delve into the details
  thereafter:
</p>
<br />
<section>
  <div class="section-container">
    <div class="steps-container">
      <div class="step" data-index="0">
        <div class="step-content">
          <p>
            Let's fit a model to predict housing price ($) from the size of the
            house (in square-footage):
            <br /><br />
            {@html katexify(`house-price = sqft * x`, false)}
            <br /><br />
            We'll start with an extremely poor model, because why not. Let's just
            predict every house to be $4, so our equation becomes:
            <br /><br />
            {@html katexify(`house-price = 4`, false)}
          </p>
        </div>
      </div>
      <div class="step" data-index="1">
        <div class="step-content">
          <p>
            Of course we know this model is bad - the data doesn't fit the data
            well at all. But how can do quanitfy exactly how bad it is?
            <br /><br />
            To measure this quantitatively, we plot the error of each observation
            directly. This error, or <i>residual</i> as it's often called, goes from
            each observation to it's predicted value on our regression curve. We'll
            make use of these residuals later when we talk about evaluating regression
            models, but we can clearly see that our model has a lot of error.
          </p>
        </div>
      </div>
      <div class="step" data-index="2">
        <div class="step-content">
          <p>
            The goal of linear regression is reducing this error such that we
            find a line (or in the case of multiple features, a surface) that
            'best' fits our data. .
            <br /><br />
            For our simple regression problem, that involves finding the slope and
            intercept of our model, B0 and B1. How much better can we do? Well, given
            this specific data, the best fit line is shown. In this case, 'best'
            fit refers to a line that models the data. Our line is shown here. There's
            still error, sure, but the general pattern is captured well. As a result,
            we can be reasonably confident that were we to plug in future values
            of square-footage, our predicted values of price would be fairly accurate.
          </p>
        </div>
      </div>
      <div class="step" data-index="3">
        <div class="step-content">
          <p>
            Once we've fit our model, predicting future values is super easy! We
            just plug in any xi values into our equation {@html katexify(
              `house-price = 4`,
              false
            )}!
            <br /><br />For our simple model, that means plugging in a value for
            SQFT:
          </p>
          <br />
          <div id="input-container">
            <p>SQFT Value: {$sqft}</p>
            <input
              type="range"
              min="0"
              max="11"
              bind:value={$sqft}
              class="slider"
              id="myRange"
            />
          </div>
          <p>
            <br />
            So our prediction becomes
            {@html katexify(
              `\\hat{y} = ${$coeff} * ${$sqft} = ${Math.round(
                $sqft * $coeff,
                3
              )}`,
              false
            )}
          </p>
        </div>
      </div>
      <div class="step" data-index="4">
        <div class="step-content">
          <p>
            And finally, it's worth a quick mention that the <i>linear</i> in linear
            regression does not mean our predictions are limited to lines!
          </p>
          <div id="input-container">
            <p>Value: {$sqft}</p>
            <input
              type="range"
              min="0"
              max="11"
              bind:value={$sqft}
              class="slider"
              id="myRange"
            />
          </div>
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

  <p class="body-text">
    Now that we have a high-level idea of how linear regression works, let's
    dive a bit deeper. The remainder of this article will cover: to evaluate
    regression models (using mean-squared error), how to find the 'best' model
    (using gradient descent), how to interpret different forms of regression
    models, and the different assumptions underpinning correct usage of
    regression models.
    <br /><br /> Let's dive in!
  </p>
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
    width: 40%;
    height: 40vh;
    margin-right: 5%;
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
    font-size: var(--size-default);
    background: var(--bg);
    /* background: var(--secondary); */
    /* color: #ccc; */
    /* color: var(--squidink); */
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
    border: 4px solid var(--default);
  }

  .step.active .step-content {
    /* background: var(--bg); */
    /* background: var(--white); */
    /* color: var(--squid-ink); */
    /* color: var(--squidink); */
  }

  .step-content p {
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
