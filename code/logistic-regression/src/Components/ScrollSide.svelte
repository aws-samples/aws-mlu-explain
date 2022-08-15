<script>
  import katexify from "../katexify";
  import { selectAll } from "d3-selection";
  import { scaleOrdinal } from "d3-scale";
  import Scatterplot from "./Scatterplot.svelte";
  import { scatterData } from "../datasets.js";
  import { onMount } from "svelte";
  import { Temperature, DecisionBoundary, Prediction } from "../data-store.js";

  let scatterClass;

  const seriesNames = new Set();
  const seriesColors = ["#7e93ee", "#ff99ff"];

  const target2event = {
    0: () => {
      scatterClass.hidePoints();
      scatterClass.hideCurve();
      scatterClass.hideBoundary();
      scatterClass.hideExample();
    },
    1: () => {
      // points appear
      scatterClass.showPoints();
      scatterClass.hideCurve();
      scatterClass.hideBoundary();
      scatterClass.hideExample();
    },

    2: () => {
      // curve appears
      scatterClass.showCurve();
      scatterClass.showPoints();
      scatterClass.hideBoundary();
      scatterClass.hideExample();
    },
    3: () => {
      // decision boundary appears
      scatterClass.showCurve();
      scatterClass.showPoints();
      scatterClass.showBoundary();
    },

    4: () => {
      scatterClass.showCurve();
      scatterClass.showPoints();
      scatterClass.showBoundary();
      scatterClass.showExample();
    },
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
    DecisionBoundary: { $DecisionBoundary },
  };

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

<h2 class="body-header">How It Works</h2>
<p class="body-text">
  Let’s make this a bit more concrete by walking through an example. Suppose
  that you want to go for a hike in Seattle. You want to predict whether it will
  be sunny or rainy, so that you can decide whether to hike or drink coffee
  indoors at a local cafe. You know that it rains often in Seattle, but you’ve
  heard the summers have nice weather. The question is: can we predict the
  weather, given factors such as the temperature?
</p>
<section>
  <div class="section-container">
    <div class="steps-container">
      <div class="step" data-index="1">
        <div class="step-content">
          <p>
            Assume there are two classes: Rainy Days and Sunny Days. We can
            assign a numeric value of 0 and 1 to each class, say 0 to a Rainy
            Day and 1 to a Sunny Day. We have one continuous feature: the
            temperature, in degrees Fahrenheit. For each day, we can plot this
            value along with the corresponding temperature.
          </p>
        </div>
      </div>
      <div class="step" data-index="2">
        <div class="step-content">
          <p>
            Clearly, we should not fit a linear regression model to these data.
            The outcomes of a linear regression model can take any numerical
            value, but these data can only take on outcomes of 0 or 1, so the
            predictions of a linear model may not be meaningful.
            <br /><br />

            Instead, we can fit a logistic function to the data. The values of
            this function can be interpreted as probabilities, as the values
            range between 0 and 1. We can interpret the line as the probability
            of a sunny day given a particular temperature.
          </p>
        </div>
      </div>
      <div class="step" data-index="3">
        <div class="step-content">
          <p>
            Now that we have the logistic function to predict the probabilities
            of each outcome, we can predict the class. We use a decision
            boundary to decide the predicted class based on the probability of
            each class given the feature values. A typical threshold for the
            decision boundary is 0.5, where we predict an outcome will occur if
            the probability of that outcome is greater than 0.5. This boundary
            can be adjusted — for example, if you really dislike the rain, you
            may want to set the boundary higher to be more cautious, so that
            that you predict a sunny day and go hiking only if the probability
            of a sunny day exceeds that boundary.
          </p>
        </div>
      </div>
      <div class="step" data-index="4">
        <div class="step-content">
          <p>
            To see how the model works for yourself, drag the values to make a
            prediction!
          </p>
          <br /><br />
          <div id="input-container">
            <p>
              <span class="bold">Temperature: </span>
              {$Temperature} Degrees Fahrenheit
            </p>
            <input
              type="range"
              min="20"
              max="100"
              bind:value={$Temperature}
              class="slider"
              id="tempSlider"
            />
          </div>
          <div id="input-container">
            <p>
              <span class="bold">Decision Boundary: </span>{$DecisionBoundary}
            </p>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              bind:value={$DecisionBoundary}
              class="slider"
              id="boundarySlider"
            />
          </div>
          <br /><br />
          <p>
            The prediction is a <span class="bold">{$Prediction}</span>.
          </p>
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
