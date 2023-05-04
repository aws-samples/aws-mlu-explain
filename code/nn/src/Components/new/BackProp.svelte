<script>
  import NetworkBackProp from "./NetworkBackProp.svelte";
  import { onMount } from "svelte";
  import {
    networkBp,
    stepIndexBp,
    bpStage,
    bpbind,
    drawErrorCircle,
    bpSlope,
    bpIntercept,
    fillRule,
    strokeRule,
    bpWeights,
  } from "../../store";
  import katexify from "../../katexify";

  $networkBp = [2, 2, 1, 1];

  const animationDuration = 500;

  const target2event = {
    0: () => {
      $stepIndexBp = 0;
      $fillRule = 0;
      $strokeRule = 0;
      $bpStage = 0.2;
      $bpSlope = 0;
      $bpIntercept = 0.75;
      animation0();
    },

    1: () => {
      $bpStage = 1;
      $fillRule = 1;
      $strokeRule = 1;
    },
    2: () => {
      $bpSlope = 0;
      $bpIntercept = 0.55;
      $bpStage = 2;
      animation2();
    },
    3: () => {
      $bpSlope = 0;
      $bpIntercept = 0.55;
      $stepIndexBp = 2;
      $bpStage = 1;
      animation3();
    },
    4: () => {
      $bpSlope = 0;
      $bpIntercept = 0.55;
      $stepIndexBp = 2;
      $bpStage = 1;
      animation3();
    },
  };

  function fireEvent(entryIndex) {
    if (entryIndex in target2event) {
      target2event[entryIndex]();
    }
  }

  function animation1() {
    $strokeRule = 0;
    setTimeout(() => {
      $strokeRule = 1;
    }, animationDuration);
  }
  function animation0() {
    $drawErrorCircle = false;
    $fillRule = 0;
    $strokeRule = 0;
    let animationSelections = [];

    const selector = `animateMotion#animatePathForwardBp1`;
    const selection = $bpbind.querySelectorAll(selector);
    animationSelections.push({ selection: selection });
    // trigger animation
    animationSelections.forEach((element) => {
      setTimeout(() => {
        element.selection.forEach((selection) => {
          selection.beginElement();
        });
      }, 100);
    });
    // draw circle at end of animation
    setTimeout(() => {
      $fillRule = 1;
    }, 3 * animationDuration);
  }

  function animation2() {
    let animationSelections = [];

    const selector = `animateMotion#animatePathBackward3`;
    const selection = $bpbind.querySelectorAll(selector);
    animationSelections.push({ selection: selection });
    animationSelections.forEach((element) => {
      setTimeout(() => {
        element.selection.forEach((selection) => {
          selection.beginElement();
        });
      }, 100);
    });

    setTimeout(() => {
      $fillRule = 2;
      $strokeRule = 2;
      updateWeights();
    }, 3 * animationDuration);
  }

  function animation3() {
    if ($bpSlope > -1.046) {
      let animationSelections = [];

      const selector1 = `animateMotion#animatePathForwardBp1`;
      const selection1 = $bpbind.querySelectorAll(selector1);
      animationSelections.push({ selection: selection1 });
      const selector = `animateMotion#animatePathBackward3`;
      const selection = $bpbind.querySelectorAll(selector);
      animationSelections.push({ selection: selection });
      // trigger animation
      animationSelections.forEach((element, i) => {
        setTimeout(() => {
          element.selection.forEach((selection) => {
            selection.beginElement();
          });
        }, i * 3 * animationDuration);
      });
      setTimeout(() => {
        $fillRule = 3;
        $strokeRule = 3;
        updateMetrics();
      }, 6 * animationDuration);
    } else {
      return;
    }
  }

  function restartAnimation3() {
    $bpSlope = 0;
    $bpIntercept = 0.55;
    animation3();
  }

  function updateWeights() {
    bpWeights.update((values) => {
      return values.map((value) => {
        const randomChange = Math.floor(Math.random() * 8); // generate a random integer between 0 and 5
        const randomDirection = Math.random() < 0.5 ? -1 : 1; // randomly choose whether to add or subtract
        return Math.max(
          1,
          Math.min(14, value + randomChange * randomDirection)
        ); // ensure the value stays within the range of 1 to 10
      });
    });
  }

  function updateMetrics() {
    $bpIntercept += 0.1;
    $bpSlope += -0.35;
    // update these to trigger color updates without forced remount
    $strokeRule += 1;
    $fillRule += 1;
    updateWeights();
  }

  onMount(() => {
    // store elements to track
    const sections = [...document.querySelectorAll(".step-bp")];

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
</script>

<!-- <h1 class='main-title'>Neural Networks</h1> -->
<div id="container">
  <section>
    <div class="scrolly-container-backprop">
      <div class="charts-container-backprop">
        <div class="chart-holder-backprop">
          <NetworkBackProp />
        </div>
      </div>
      <div class="steps-container-backprop">
        <div class="step-bp" data-index="0">
          <div class="step-content">
            <h2>Forward Pass</h2>
            <hr />
            <br />

            <p>
              During the forward pass, input data is fed through a neural
              network's layers to produce a prediction. This process involves
              calculating the weighted sums and applying activation functions
              for each neuron in each layer.
            </p>
            <br />
            <button class="step-button" on:click={() => animation0()}
              >Replay Animation</button
            >
          </div>
        </div>
        <div class="step-bp" data-index="1">
          <div class="step-content">
            <h2>Error</h2>
            <hr />
            <br />

            <p>
              The error, also known as loss, measures the difference between the
              neural network's predicted output and the actual target values. By
              minimizing this error, the neural network learns to improve its
              predictions during training.
              <br /><br />
              Notice those extra big circles in the chart, the ones that are colored
              differently than their background? Those are the values that were falsely
              predicted.
            </p>
            <br />
            <button class="step-button" on:click={() => animation1()}
              >Replay Animation</button
            >
          </div>
        </div>
        <div class="step-bp" data-index="2">
          <div class="step-content">
            <h2>Adjusting Weights</h2>
            <hr />
            <br />
            <p>
              The network will look at these mistakes and adjust the weights to
              try and make them right. In the backward pass, the error is
              propagated back through the network, starting from the output
              layer, to adjust the weights and biases of each neuron. This
              weight adjustment process, guided by the gradients of the error
              with respect to the weights, aims to minimize the overall error of
              the network.
            </p>
            <br />
            <button class="step-button" on:click={() => animation2()}
              >Replay Animation</button
            >
          </div>
        </div>
        <div class="step-bp" data-index="3">
          <div class="step-content">
            <h2>BackPropagation</h2>
            <hr />
            <br />

            <p>
              In today's Neural Networks, this process is repeated thousands of
              times: predictions flow forward, errors are observed and
              backpropagated through the network, and the weights are adjusted.
              This process is know as "Backpropagation." Backpropagation is a
              supervised learning algorithm used in neural networks that
              optimizes their weights and biases through iterative forward and
              backward passes. By computing the gradients of the error with
              respect to the weights, backpropagation enables the network to
              learn and improve its predictions.
              <br /><br />
              Try clicking Run backprop 3 more times to see the model learn the optimal
              boundary!
            </p>
            <br />
            <button class="step-button" on:click={() => restartAnimation3()}
              >Restart</button
            >
            <button class="step-button" on:click={() => animation3()}
              >Run Backprop</button
            >
          </div>
        </div>
        <div class="step-bp" data-index="4">
          <div class="step-content">
            <h2>Mpre BackPropagation...</h2>
            <hr />
            <br />

            <p>
              Backpropagation doesn't occur just once! For a typical neural
              network, backpropagation is repeated hundreds, if not thousands,
              of times.
              <br /><br />
              To keep things simple, we animate only a couple more runs of backprop
              here. The key thing to note is that, at each run, the weights update
              and our model's classification region performs better.
            </p>
            <br />
            <button class="step-button" on:click={() => restartAnimation3()}
              >Restart</button
            >
            <button class="step-button" on:click={() => animation3()}
              >Run Backprop</button
            >
          </div>
        </div>
      </div>
    </div>
  </section>
  <br />
  <h3 class="body-header">A Note On Optimization</h3>
  <hr />
  <p class="body-text">
    Thanks for reading! We hope that the article is insightful no matter where
    you are along your machine learning journey, and that you came away with a
    better understanding of K-Fold Cross-Validation in the context of machine
    learning.
    <br /><br />
  </p>
  <br /><br /><br />
</div>

<style>
  .body-header,
  .body-text {
    color: var(--paper);
  }
  .step-button {
    cursor: pointer;
    padding: 10px 16px;
  }

  .step-button:hover {
    color: var(--bg);
    background-color: var(--squidink);
    border: 1px solid var(--bg);
  }

  div#container {
    background-color: var(--darksquidink);
  }
  section {
    padding-bottom: 5rem;
    background-color: var(--darksquidink);
    color: var(--white);
    max-width: 1200px;
    margin: auto;
  }

  .scrolly-container-backprop {
    text-align: center;
    display: flex;
    margin-top: 0;
    padding-top: 0;
    flex-direction: row-reverse;
    padding-left: 1rem;
  }

  .charts-container-backprop {
    position: sticky;
    top: 25%;
    width: 70%;
    height: 50vh;
    margin-right: 2%;
    /* border: 2px solid green; */
    flex: 0 0 60%; /* This item will take up 70% of the container-backprop's width */
  }

  .steps-container-backprop {
    /* border: 2px solid red; */
    width: 100%;
  }

  .chart-holder-backprop {
    width: 100%;
    height: 100%;
    max-height: 750px;
  }

  .step-bp {
    position: relative;
    scroll-snap-align: center;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    height: 90vh;
    display: flex;
    place-items: center;
    justify-content: flex-start;
    padding: 1rem;
    padding-right: 1.4rem;
  }
  .step-bp {
    height: 100vh;
  }

  .step-content {
    text-align: left;
    font-size: var(--size-default);
    font-family: var(--font-light);
    border-radius: 10px;
    padding-left: 1.5rem;
    background-color: var(--darksquidink);
  }

  .step-content > h2 {
    font-family: var(--font-heavy);
    text-transform: uppercase;
    font-size: var(--size-default);
    color: var(--paper);
  }

  .step-content > p {
    font-size: var(--size-default);
    font-family: var(--font-light);
    color: var(--paper);
  }

  .step-content > hr {
    width: 100%;
    margin: 5px auto;
    border: 1px solid var(--stone);
    opacity: 0.6;
  }

  hr {
    border: 1px solid var(--stone);
  }
</style>
