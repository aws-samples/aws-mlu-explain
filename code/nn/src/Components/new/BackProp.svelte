<script>
  import NetworkBackProp from "./NetworkBackProp.svelte";
  import { onMount } from "svelte";
  import {
    networkBp,
    showLayerLine,
    showSubScript,
    stepIndexBp,
    bpStage,
    bpbind,
    bpPlayAnimation,
    drawErrorLine,
    drawErrorCircle,
    bpSlope,
    fillRule,
  } from "../../store";
  import katexify from "../../katexify";

  $networkBp = [1, 2, 1, 1];

  const target2event = {
    0: () => {
      // $showLayerLine = false;
      $networkBp = [1, 2, 1, 1];
      $stepIndexBp = 0;
      // $showSubScript = false;
      $fillRule = 0;

      $bpStage = 0;
      animation1();
      $drawErrorLine = false;
    },

    1: () => {
      // $showLayerLine = false;
      // $networkBp = [1, 2, 1, 1];
      // $stepIndexBp = 1;
      // $showSubScript = false;
      $bpStage = 1;
      $drawErrorLine = true;
      $fillRule = 1;
    },
    2: () => {
      // $showLayerLine = false;
      // $showSubScript = true;
      // $stepIndexBp = 1;
      $fillRule = 2;
      $bpStage = 2;
      // new
      $drawErrorLine = true;
      animation3();
    },
    3: () => {
      $fillRule = 1;
      $stepIndexBp = 2;
      $showLayerLine = false;
      $bpStage = 1;
      animation4();
    },
    4: () => {
      $stepIndexBp = 3;
      $showLayerLine = false;
    },
    5: () => {
      $stepIndexBp = 4;
      $showLayerLine = false;

      $networkBp = [2, 1, 1, 1];
    },
  };

  function fireEvent(entryIndex) {
    if (entryIndex in target2event) {
      target2event[entryIndex]();
    }
  }

  $: {
    console.log("bpStage", $bpStage);
  }

  function animation2() {
    $drawErrorLine = false;
    setTimeout(() => {
      $drawErrorLine = true;
    }, 1000);
    // $drawErrorLine = true;
  }
  function animation1() {
    $drawErrorCircle = false;
    $fillRule = 0;
    let animationSelections = [];

    const selector = `animateMotion#animatePathForward1`;
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
    }, 3 * 1000);
  }

  function animation3() {
    console.log("click");
    $bpSlope = 0.7;
    let animationSelections = [];

    const selector = `animateMotion#animatePathBackward3`;
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

    setTimeout(() => {
      $bpSlope = 0.8;
    }, 3000);
  }

  function animation4() {
    console.log("click");
    let animationSelections = [];

    const selector1 = `animateMotion#animatePathForward1`;
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
      }, i * 3000);
    });
    setTimeout(() => {
      $bpSlope = 1;
    }, 6000);
  }

  onMount(() => {
    // store elements to track
    const sections = [...document.querySelectorAll(".step-bp")];
    console.log("sections", sections);

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
        <!-- <h2 class="chart-title">{stepTitles[$stepIndexBp]}</h2> -->
        <div class="chart-holder-backprop">
          <NetworkBackProp />
        </div>
      </div>
      <div class="steps-container-backprop">
        <!-- <div class="step-bp" data-index="0">
          <div class="step-content">
            <h2>That Is A Neural Network</h2>
            <hr />
            <br />
            <p>
              Today's hottest advancements in A.I., like ChatGPT, Stable
              Diffusion,and midjourney have one thing in common: they're based on
              neural networks, a sophisticated machine learning algorithm.Scroll
              down to continue reading!
            </p>
            <br /><br />
            <p style="margin:auto; text-align: center;">&#8595</p>
          </div>
        </div> -->
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
            <button class="step-button" on:click={() => animation1()}
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
            </p>
            <br />
            <button class="step-button" on:click={() => animation2()}
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
              In the backward pass, the error is propagated back through the
              network, starting from the output layer, to adjust the weights and
              biases of each neuron. This weight adjustment process, guided by
              the gradients of the error with respect to the weights, aims to
              minimize the overall error of the network.
            </p>
            <br />
            <button class="step-button" on:click={() => animation3()}
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
              Backpropagation is a supervised learning algorithm used in neural
              networks that optimizes their weights and biases through iterative
              forward and backward passes. By computing the gradients of the
              error with respect to the weights, backpropagation enables the
              network to learn and improve its predictions.
            </p>
            <br />
            <button class="step-button" on:click={() => animation4()}
              >Replay Animation</button
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
