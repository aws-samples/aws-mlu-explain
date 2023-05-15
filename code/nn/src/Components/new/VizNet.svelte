<script>
  import { onMount } from "svelte";
  import NetworkVisual from "./VizNetworkVisual.svelte";
  import ErrorLineChart from "./VizErrorLineChart.svelte";
  import VizPredictionScatter from "./VizPredictionScatter.svelte";
  import DatasetIcons from "./DatasetIcons.svelte";
  import InteractiveControls from "./InteractiveControls.svelte";

  import {
    animationDuration,
    networkInteractive,
    numLayersInteractive,
    playAnimation,
    ggg,
    points,
    errorMetrics,
    hexPreds,
    hexVals,
    interactiveDataset,
    networkInteractiveWeights,
    showText,
  } from "../../store";
  import { range } from "../../neuralnetCode/arrayUtils";
  import { Value, MLP, ensureValue } from "../../neuralnetCode/ann";
  import { circles, moons } from "../../datasets";
  import { makeJsonArray, numNeurons } from "../../utils";

  function instantiateWeights() {
    const numWeights = numNeurons($networkInteractive);

    const weightVals = Array.from({ length: numWeights }, (_, index) => {
      // Get the number of input neurons for the current weight
      const inputNeurons =
        $networkInteractive[index % ($networkInteractive.length - 1)];
      // Apply He Initialization
      const heInit = Math.sqrt(2 / inputNeurons) * (Math.random() * 2 - 1);

      return { data: heInit, grad: 0 };
    });

    $networkInteractiveWeights = [...weightVals];
  }

  // set default dataset to circles
  $interactiveDataset = circles;

  let buttonDisabled = false;

  function toggleAnimation() {
    $playAnimation = !$playAnimation;
    let animationSelections = [];

    $points.forEach((p) => {
      const selector = `animateMotion#animatePath1${p}`;
      const selection = $ggg.querySelectorAll(selector);
      // const set1 = $ggg.querySelectorAll(`#set1`);
      animationSelections.push({ selection: selection, p: p });
    });
    // trigger animation
    animationSelections.forEach((element) => {
      setTimeout(() => {
        element.selection.forEach((selection) => {
          selection.beginElement();
        });
      }, element.p * 100); // Multiply by 1000 to convert seconds to milliseconds
    });
  }

  function toggleButton() {
    buttonDisabled = true;
    setTimeout(() => {
      buttonDisabled = false;
    }, $animationDuration * 1000 * ($numLayersInteractive + 1));
  }

  function buttonClick() {
    getUpdateModelParams();
    runBatch();
    toggleAnimation();
    toggleButton();
    $showText = true;
  }

  function getUpdateModelParams() {
    const params = model.parameters();
    const weights = params.filter((v) => v.param === "w");
    const weightVals = weights.map((d) => {
      return { data: d.data, grad: d.grad };
    });
    console.log("new model weights:\n", weightVals);
    $networkInteractiveWeights = [...weightVals];
  }

  let batchSize = 1;
  $: $points = [...Array(batchSize).keys()];

  const inputDim = 2;
  $: dims = $networkInteractive.slice(1);
  let alpha = 0.00001;
  let k = 0;
  $: model = new MLP(inputDim, $networkInteractive.slice(1));

  $: dataArr = makeJsonArray($interactiveDataset);

  $: [X, y] = dataArr;

  // make sure each input is a Value
  $: inputs = X.map((row) => {
    return row.map((x) => {
      return ensureValue(x);
    });
  });

  function reset_model() {
    k = 0;
    model = new MLP(inputDim, dims);

    const newError = {
      x: k,
      loss: 0,
      y: 0,
    };

    // reset hex predictions
    const newPreds = $hexVals.map(function (row) {
      const pred = model.call(row);
      return -1;
    });

    $hexPreds = [...newPreds];

    // log errors
    $errorMetrics = [newError];

    instantiateWeights();
  }

  function runBatch() {
    // basic scheduling lr (decay) below:
    // let initial_learning_rate = 0.01; // set an appropriate initial learning rate
    // let decay_rate = 0.001; // set an appropriate decay rate

    // for (let ep = 0; ep < 200; ep++) {
    // basic scheduling lr (decay) below:
    // let learning_rate = initial_learning_rate * (1 / (1 + decay_rate * ep));

    let initial_learning_rate = 0.01; // set an appropriate initial learning rate
    const epsilon = 1e-8; // small constant to avoid division by zero

    // Create a cache for the squared gradients
    const grad_cache = model.parameters().map(() => new Value(0));

    console.log(
      "inputs",
      inputs.map((row) => row[1]["data"])
    );
    // loop through input X and call model prediction on it
    let preds = inputs.map((row) => model.call(row));

    // svm max margin loss
    let losses = range(0, preds.length).map((i) =>
      preds[i][0].mul(-y[i]).add(+1.0).relu()
    );

    let data_loss = losses
      .reduce((sum, current) => sum.add(current), new Value(0))
      .mul(1 / losses.length);

    let reg_loss = model
      .parameters()
      .map((e) => e.mul(e))
      .reduce((sum, cur) => sum.add(cur), new Value(0))
      .mul(alpha);

    let total_loss = data_loss.add(reg_loss);

    let accuracies = range(0, preds.length).map((i) =>
      preds[i][0].data > 0.0 === y[i] > 0.0 ? 1.0 : 0.0
    );

    // accuracy
    let accuracy =
      accuracies.reduce((sum, current) => sum + current, 0.0) /
      accuracies.length;

    // backward pass
    model.zero_grad();
    total_loss.backward();

    // sgd
    // let learning_rate = k <= 1 ? 0.05 : 1.0 - (0.9 * k) / 100;
    // let learning_rate = 0.0001;

    // basic lr updates:
    // for (let _i = 0, _b = model.parameters(); _i < _b.length; _i++) {
    //   let p = _b[_i];
    //   p.data -= learning_rate * p.grad;
    // }

    // AdaGradlr  updates
    for (let _i = 0, _b = model.parameters(); _i < _b.length; _i++) {
      let p = _b[_i];
      // Accumulate squared gradient
      grad_cache[_i].data += p.grad * p.grad;
      // Update parameter
      p.data -=
        (initial_learning_rate / Math.sqrt(grad_cache[_i].data + epsilon)) *
        p.grad;
    }

    const newError = {
      x: k + 1,
      loss: total_loss.data,
      y: accuracy * 100,
    };

    // update hex predictions
    const newPreds = $hexVals.map(function (row) {
      const pred = model.call(row);
      return pred[0].data > 0 ? 1 : -1;
    });
    // update background hexagons with new predictions
    $hexPreds = [...newPreds];

    // log errors
    $errorMetrics = [...$errorMetrics, newError];

    // increment epoch count
    k++;
  }
  // }

  // anytime dataset changes or nn changes, reset model
  $: {
    $interactiveDataset;
    $networkInteractive;
    reset_model();
  }

  onMount(() => {
    getUpdateModelParams();
    buttonClick();
  });
</script>

<br /><br /><br />

<div id="all">
  <br />
  <h3 class="body-header">See for yourself</h3>
  <hr />
  <p class="body-text">
    Thanks for reading! We hope that the article is insightful no matter where
    you are along your machine learning journey, and that you came away with a
    better understanding of K-Fold Cross-Validation in the context of machine
    learning.
    <br /><br />
    Thanks for reading! We hope that the article is insightful no matter where you
    are along your machine learning journey, and that you came away with a better
    understanding of K-Fold Cross-Validation in the context of machine learning.
  </p>
  <br /><br />
  <section>
    <div id="top-controls">
      <div id="architecture-input">
        <div>
          <!-- <InteractiveControls /> -->
        </div>
      </div>
      <!-- <DatasetIcons /> -->
    </div>
    <div id="network-interactive-container">
      <div class="network-plot">
        <div id="left">
          <InteractiveControls />
          <NetworkVisual />
          <div id="animation-controls">
            <div id="play-button">
              <button
                class:active={$playAnimation}
                on:click={() => {
                  buttonClick();
                }}
                disabled={buttonDisabled}>Run Epoch</button
              >
              <button
                disabled={buttonDisabled}
                class:active={$playAnimation}
                on:click={() => {
                  reset_model();
                }}>Retrain</button
              >
              <div id="animation-duration-input">
                Animation Duration:
                <input
                  disabled={buttonDisabled}
                  class="input-duration"
                  type="range"
                  min="0.01"
                  max="2"
                  step="0.05"
                  bind:value={$animationDuration}
                />
              </div>
              <!-- <div id="batch-button">
                <p>Batch Size:</p>
                <input type="number" bind:value={batchSize} min="1" max="8" />
              </div> -->
            </div>
          </div>
        </div>
      </div>
      <div id="eval-container">
        <DatasetIcons />
        <div id="scatter-plot">
          <VizPredictionScatter data={$interactiveDataset} nnModel={model} />
        </div>
        <div id="error-plot">
          <ErrorLineChart />
        </div>
      </div>
    </div>
  </section>
  <p class="body-text">
    In the case of these specific problems, you may find that wider networks
    (networks with more neurons in each layer) perform better than deeper ones
    (networks with more hidden layers). This is because wider networks can
    create more complex decision boundaries, which can better capture the
    intricate patterns in the spiral and moon datasets.
  </p>
  <br />
  <p class="body-text">
    Notice how to this point, we've describe a specific neural network
    architecture where values flow forward linearly through a network, and
    gradients flow linearly backwards through a network. These a
  </p>
</div>

<style>
  section {
    padding-bottom: 5rem;
  }
  #left {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 8% 80% 8%;
    row-gap: 5px;
    /* outline: 2px solid hotpink; */
  }
  #animation-duration-input {
    display: flex;
    flex-direction: column;
  }
  #top-controls {
    display: flex;
    width: 1000px;
    margin: auto;
  }
  #network-interactive-container {
    display: grid;
    height: var(--viz-height);
    max-height: var(--max-viz-height);
    /* border: 2px solid black; */
    /* width: 1000px; */
    grid-template-columns: 70% 30%;
    /* margin: auto; */
  }
  .network-plot {
    width: 100%;
    height: var(--viz-height);
    max-height: var(--max-viz-height);
    margin: auto;
  }
  #eval-container {
    display: grid;
    grid-template-rows: 10% 50% 40%;
    grid-template-columns: 100%;
    grid-gap: 0%;
    max-height: var(--max-viz-height);
    width: 100%;
  }

  #scatter-plot,
  #error-plot {
    height: 100%;
  }

  button {
    opacity: 1;
    pointer-events: auto;
    border: 1px solid var(--darksquidink);
  }

  button[disabled] {
    opacity: 0.6;
    pointer-events: none;
  }
  #animation-controls {
    display: flex;
    flex-direction: row;
    align-items: center;
    max-width: 80%;
    margin: 0px auto;
    padding-top: 5px;
    font-size: var(--size-default);
    font-weight: bold;
  }
  #play-button {
    margin-right: auto;
    display: flex;
  }
  #play-button button {
    border-radius: 0;
    padding: 8px 24px;
    font-size: var(--size-default);
    margin-right: 10px;
    opacity: 1;
  }
  #play-button button:hover {
    background-color: var(--darksquidink);
    color: var(--bg);
  }

  p {
    font-weight: bold;
  }
  section {
    max-width: 1200px;
    margin: auto;

    /* outline: 2px solid teal; */
  }

  #architecture-input {
    display: flex;
    width: 80%;
    margin: auto;
    flex-direction: row;
    text-transform: uppercase;
    font-weight: bold;
    justify-content: center;
  }
  input {
    margin: auto;
  }

  .active {
    opacity: 0.8;
  }
</style>
