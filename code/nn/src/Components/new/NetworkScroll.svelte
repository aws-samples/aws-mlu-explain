<script>
  import ForwardNetwork from "./ForwardNetwork.svelte";
  import { onMount } from "svelte";
  import {
    drawActivation,
    network,
    showLayerLine,
    labels,
    showSubScript,
    stepIndex,
    hideWeights,
  } from "../../store";
  import katexify from "../../katexify";

  $stepIndex = 0;
  $network = [2, 1, 1];

  // $: console.log("stepIndex", $stepIndex);

  const target2event = {
    0: () => {
      $showLayerLine = false;
      $network = [2, 1, 1];
      $labels = ["input", "function", "output"];
      $stepIndex = 0;
      $showSubScript = false;
      $drawActivation = false;
      $hideWeights = 2;
    },
    1: () => {
      $showLayerLine = false;
      $network = [2, 1, 1];
      $labels = ["X", "linear", "y"];
      $showSubScript = true;
      $drawActivation = false;
      $stepIndex = 1;
      $hideWeights = 2;
    },
    2: () => {
      $stepIndex = 2;
      $showLayerLine = false;
      $labels = ["X", "linear", "y"];
      $network = [2, 1, 1];
      $drawActivation = false;
      $hideWeights = 2;
    },
    3: () => {
      $stepIndex = 3;
      $labels = ["X", "sigmoid", "y"];
      $showLayerLine = false;
      $network = [2, 1, 1];
      $drawActivation = false;
      $hideWeights = 2;
    },
    4: () => {
      $stepIndex = 4;
      $showLayerLine = false;
      $drawActivation = false;
      $labels = ["input", "step", "y"];
      $network = [2, 1, 1];
      $hideWeights = 2;
    },
    5: () => {
      $stepIndex = 5;
      $showLayerLine = false;
      $drawActivation = true;
      $labels = ["input", "step", "y"];
      $network = [2, 1, 1];
      $hideWeights = 2;
    },
    6: () => {
      $stepIndex = 6;
      $showLayerLine = false;
      $labels = ["input", "step", "step", "y"];
      $network = [2, 1, 1, 1];
      $drawActivation = false;
      $hideWeights = 3;
    },
    7: () => {
      $stepIndex = 7;
      $showLayerLine = true;
      $labels = ["input", "step", "step", "y"];
      $network = [2, 1, 1, 1];
      $drawActivation = false;
      $hideWeights = 3;
    },
    8: () => {
      $stepIndex = 8;
      $showLayerLine = true;
      $labels = ["input", "reLu", "sigmoid", "y"];
      $network = [2, 3, 2, 1];
      $drawActivation = false;
      $hideWeights = 12;
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

  const sigmoid =
    "\\begin{aligned} \\text{sigmoid} = \\frac{1}{1+e^{-w_iX_i}} \\end{aligned}";
  const linearEq = `\\begin{aligned} \\text{linear} = \\sum^{n}_{i=1}w_iX_i \\end{aligned}`;
  const stepEq = `\\begin{aligned} \\text{step} = \\begin{cases}
         +1, \\text{if } w_iX_i \\geq 0  \\\\
         -1, \\text{if } w_iX_i < 0
        \\end{cases} \\end{aligned}`;
  const eq = `y=w_0+ w_1X_1  + w_2X_2`;
</script>

<!-- <h1 class='main-title'>Neural Networks</h1> -->
<section>
  <div class="scrolly-container">
    <div class="charts-container">
      <div class="chart-holder">
        <ForwardNetwork />
      </div>
    </div>
    <div class="steps-container">
      <div class="step" data-index="0">
        <div class="step-content">
          <h2>Building Blocks: Computational Graphs</h2>
          <hr />
          <br />
          <p>
            A computational graph has an input node where data is fed into the
            graph, a function node where the input data is processed, and an
            output node where the result of the computation is produced.
            <br /><br />
            As we can see, data flows in one direction, from inputs to output, through
            the graph.
          </p>
        </div>
      </div>
      <div class="step" data-index="1">
        <div class="step-content">
          <h2>Linear Regression</h2>
          <hr />
          <br />

          <p>
            We can represent all sorts of algorithms with as computational
            graphs. For example, we can easily represent <a
              href="https://mlu-explain.github.io/linear-regression/"
              >Linear Regression</a
            >
            as a computational graph:
            {@html katexify(eq, true)}
            To do so, we need only change two things:
            <br /><br />
            1. Add weights to each edge connecting the input nodes to the function
            nodes.
            <br /><br />
            2. Update our function to represent a linear function of a weighted sum:
            {@html katexify(linearEq, true)}
            And just like that, we have a computational graph for linear regression!
          </p>
        </div>
      </div>
      <div class="step" data-index="2">
        <div class="step-content">
          <h2>Model Outputs</h2>
          <hr />
          <br />
          <p>
            To make the process extra clear, let's visualize the outputs of our
            linear regression model.
            <br /><br />
            Just as we'd expect, this model is outputting some predictions (the yellow
            diagonal line) based on the input data.
            <br /><br />
            As we build up a more complex model for different applications, we will
            see this output change to reflect the state of the corresponding model.
          </p>
        </div>
      </div>
      <div class="step" data-index="3">
        <div class="step-content">
          <h2>Logistic Regression</h2>
          <hr />
          <br />
          <p>
            What if our problem changes, and want to switch our model from
            linear regression to <a
              href="https://mlu-explain.github.io/logistic-regression/"
              >logistic regression</a
            >?
            <br /><br />
            We can just add another input,and update the function in our computational
            graph, changing the linear function to a sigmoid function:
            {@html katexify(sigmoid, true)}
            Now, we can see the model output (the decision region background) reflect
            our new classification problem and dataset.
          </p>
        </div>
      </div>
      <div class="step" data-index="4">
        <div class="step-content">
          <h2>Perceptrons</h2>
          <hr />
          <br />
          <p>
            Our computational graph setup makes it trivial to model different
            algorithms. For example, if we want to model a Perceptron instead of
            logistic regression, we need only switch our logistic function to a
            step function:
            {@html katexify(stepEq, true)}
            Note that the classification region in our model output changed as well,
            to reflect the new model being represented.
          </p>
        </div>
      </div>
      <div class="step" data-index="5">
        <div class="step-content">
          <h2>Activation Functions & Artificial Neurons</h2>
          <hr />
          <br />
          <p>
            In a neural network, this function node we're changing is very
            special - we call it an <span class="bold">artificial neuron</span>.
            <br /><br />
            An artificial neuron is a fundamental computational element that receives
            inputs, performs a weighted operation on these inputs, and passes the
            result through a function.
            <br /><br />In neural networks, these functions <i>must</i> be
            non-linear, and are referred to as
            <span class="bold">activation functions</span>.
          </p>
        </div>
      </div>
      <div class="step" data-index="6">
        <div class="step-content">
          <h2>Neural Networks</h2>
          <hr />
          <br />
          <p>
            Nothing is stopping us from chaining multiple aritifical neurons
            together, feeding one to another. <span class="bold"
              >This is all a neural network is!</span
            >
            <br /><br />
            In fact, the original neural networks were called
            <span class="bold">multilayer perceptrons</span> because they were composed
            of layers of perceptrons (artificial neurons with step functions) feeding
            one into another!
          </p>
        </div>
      </div>
      <div class="step" data-index="7">
        <div class="step-content">
          <h2>Architecture</h2>
          <hr />
          <br />

          <p>
            In general, a neural network architecture consists of three layer
            types:
            <br /><br /><span class="bold">input layer</span>: A layer with a
            node for each network input.
            <br /><br /><span class="bold">hidden layer(s)</span>: A layer full
            of artificial neurons.
            <br /><br /><span class="bold">output layer</span>: A layer
            representing the network's output.
            <br /><br />
            There should only be one input and one output layer, but there may be
            an arbitrary number of hidden layers.
          </p>
        </div>
      </div>

      <div class="step" data-index="8">
        <div class="step-content">
          <h2>No Limits</h2>
          <hr />
          <br />

          <p>
            Designing a neural network architecture is more of an art than a
            science. The input and output layer will be selected for the
            specific problem, but the hidden layer is fairly arbitrary. <br
            /><br />
            Neural networks can be <span class="bold">wide</span>: having many
            neurons in a given hidden layer, or <span class="bold">deep</span>:
            having many hidden layers in the network. Balancing neuron count
            optimizes performance; more neurons enable complex learning, at the
            cost of the risk of overfitting and more computational cost.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  section {
    padding-bottom: 5rem;
    max-width: 1200px;
    margin: auto;
  }

  .scrolly-container {
    text-align: center;
    display: flex;
    margin-top: 0;
    padding-top: 0;
    flex-direction: row;
    padding-left: 1rem;
    width: 88%;
    margin: auto;
  }

  .charts-container {
    position: sticky;
    top: 25%;
    width: 100%;
    height: 45vh;
    margin-right: 2%;
    flex: 0 0 60%; /* This item will take up 70% of the container's width */
  }

  .steps-container {
    /* border: 2px solid red; */
    width: 100%;
  }

  .chart-holder {
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
    padding-left: 1.5rem;
    background-color: var(--white);
    border: 5px solid var(--squidink);
    padding: 20px;
  }

  .step-content > h2 {
    font-family: var(--font-heavy);
    text-transform: uppercase;
    font-size: var(--size-default);
  }

  .step-content > p {
    font-size: var(--size-default);
    font-family: var(--font-light);
  }

  hr {
    width: 100%;
  }

  /* .step > * {
      opacity: 1;
      transform: translate3d(0, 4rem, 0);
      transition: opacity 800ms var(--delay),
        transform 800ms cubic-bezier(0.13, 0.07, 0.26, 0.99) var(--delay);
    } */

  /* Comment out the following line to always make it 'text-on-top' */
  @media screen and (max-width: 950px) {
    .scrolly-container {
      display: block;
      top: 30%;
      width: 99%;
      padding-left: 0;
    }

    .step {
      height: 120vh;
      padding: 0;
      padding-right: 0;
      margin-bottom: 50vh;
    }

    .step-content {
      text-align: left;
      font-size: var(--size-default);
      font-family: var(--font-light);
      padding-left: 0;
      background-color: rgba(255, 255, 255, 0.93);
      border: 3px solid var(--squidink);
      padding: 10px;
      line-height: 1.1;
    }
    .steps-container {
      pointer-events: none;
    }
    .charts-container {
      top: 25%;
      width: 100%;
      height: 45vh;
      margin-right: 0%;
      flex: 0 0 100%;
    }
  }
  /* 
  @media screen and (max-width: 950px) {
    .scrolly-container {
      display: block;
      flex-direction: column-reverse;
      top: 30%;
      width: 99%;
      padding-left: 0;
    }

    .steps-container {
      pointer-events: none;
    }

    .charts-container {
      top: 20.5%;
      width: 95%;
      margin: auto;
      top: 25%;
      width: 100%;
      height: 45vh;
      margin-right: 0%;
    }

    .step {
      height: 130vh;
    }

    .step-content {
      width: 95%;
      max-width: 768px;
      font-size: 15px;
      line-height: 1.3;
      background: rgba(241, 243, 243, 0.913);
    }
    .charts-container {
      top: 25%;
      width: 100%;
      height: 45vh;
      margin-right: 0%;
      flex: 0 0 100%;
    }
  } */
</style>
