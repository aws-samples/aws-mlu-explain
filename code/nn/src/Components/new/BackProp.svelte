<script>
  import NetworkBackProp from "./NetworkBackProp.svelte";
  import { onMount } from "svelte";
  import {
    drawActivation,
    network,
    showLayerLine,
    labels,
    showSubScript,
  } from "../../store";
  import katexify from "../../katexify";

  $: stepIndex = 0;
  $network = [3, 2, 3, 2, 1];

  const target2event = {
    0: () => {
      $showLayerLine = false;
      $network = [3, 2, 3, 2, 1];
      stepIndex = 0;
      $showSubScript = false;
      $drawActivation = false;
    },

    1: () => {
      $showLayerLine = false;
      $network = [3, 1, 1];
      $labels = ["input", "function", "output"];
      stepIndex = 1;
      $showSubScript = false;
      $drawActivation = false;
    },
    2: () => {
      $showLayerLine = false;
      $network = [3, 1, 1];
      $labels = ["X", "linear", "y"];
      $showSubScript = true;
      $drawActivation = false;
      stepIndex = 1;
    },
    3: () => {
      stepIndex = 2;
      $showLayerLine = false;
      $labels = ["X", "sigmoid", "y"];
      $network = [3, 1, 1];
      $drawActivation = false;
    },
    4: () => {
      stepIndex = 3;
      $labels = ["X", "step", "y"];
      $showLayerLine = false;
      $network = [3, 1, 1];
      $drawActivation = true;
    },
    5: () => {
      stepIndex = 4;
      $showLayerLine = false;
      $drawActivation = false;

      $network = [3, 1, 1, 1];
    },
    6: () => {
      stepIndex = 5;
      $showLayerLine = true;
      $labels = ["X", "sigmoid", "y"];

      $network = [3, 2, 2, 1];
      $drawActivation = false;
    },
    7: () => {
      stepIndex = 5;
      $showLayerLine = true;
      $network = [3, 4, 2, 3, 1];
      $drawActivation = false;
    },
  };

  function fireEvent(entryIndex) {
    if (entryIndex in target2event) {
      target2event[entryIndex]();
    }
  }

  onMount(() => {
    // store elements to track
    const sections = [...document.querySelectorAll(".step")];
    console.log("sections", sections);

    // observe elements to track
    sections.forEach((section) => {
      observer.observe(section);
    });

    // node to track
    // const stepNode = select(".step[data-index='7']");
    // console.log("stepNode", stepNode);
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
        <!-- <h2 class="chart-title">{stepTitles[stepIndex]}</h2> -->
        <div class="chart-holder-backprop">
          <NetworkBackProp />
        </div>
      </div>
      <div class="steps-container-backprop">
        <!-- <div class="step" data-index="0">
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
        <div class="step" data-index="1">
          <div class="step-content">
            <h2>Building Blocks: Computational Graphs</h2>
            <hr />
            <br />

            <p>
              To build intuition, let's first revisit computational graphs.
              <br /><br />A computational graph has an input node where data is
              fed into the graph, a function node where the input data is
              processed, and an output node where the result of the computation
              is produced.
            </p>
          </div>
        </div>
        <div class="step" data-index="2">
          <div class="step-content">
            <h2>Linear Regression</h2>
            <hr />
            <br />

            <p>
              We can represent all sorts of algorithms with this framework. For
              example, let's look at an equation for <a
                href="https://mlu-explain.github.io/linear-regression/"
                >Linear Regression</a
              >:
              <br /><br />
              {@html katexify(`y=w_0+ w_1X_1  + w_2X_2`, false)}
              <br /><br /> To represent this as a graph, we need only weight
              each edge connecting our input nodes to our function node, and
              have our function represent a linear function on a weighted sum:<br
              />
              linear = {@html katexify(
                `\\begin{aligned}  \\sum^{n}_{i=1}w_iX_i \\end{aligned}`,
                false
              )}
            </p>
          </div>
        </div>
        <div class="step" data-index="3">
          <div class="step-content">
            <h2>Logistic Regression</h2>
            <hr />
            <br />
            <p>
              Extending this representation to <a
                href="https://mlu-explain.github.io/logistic-regression/"
                >Logistic Regression</a
              >
              is dead simple, we need only swap the linear function with a sigmoid
              function:
              <br /><br />
              {@html katexify(`y=w_0+ w_1X_1  + w_2X_2`, false)}
              <br /><br /> In this manner, our computational graph now
              represents the following:<br />
              linear = {@html katexify(
                `\\begin{aligned}  \\sum^{n}_{i=1}w_iX_i \\end{aligned}`,
                false
              )}
            </p>
          </div>
        </div>
        <div class="step" data-index="4">
          <div class="step-content">
            <h2>Artificial Neurons <br />& Perceptrons</h2>
            <hr />
            <br />

            <p>
              Extending this representation to <a
                href="https://mlu-explain.github.io/logistic-regression/"
                >Logistic Regression</a
              >
              is dead simple, we need only swap out the linear function for the sigmoid
              function:
              <br /><br />
              {@html katexify(`y=w_0+ w_1X_1  + w_2X_2`, false)}
              <br /><br /> In this manner, our computational graph now
              represents the following:<br />
              linear = {@html katexify(
                `\\begin{aligned}  \\sum^{n}_{i=1}w_iX_i \\end{aligned}`,
                false
              )}
            </p>
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

  .step {
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
  .step {
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
