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
  import { circles } from "../../datasets";
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
    // for (let ep = 0; ep < 200; ep++) {
    let initial_learning_rate = 0.01; // set an appropriate initial learning rate
    const epsilon = 1e-8; // small constant to avoid division by zero

    // Create a cache for the squared gradients
    const grad_cache = model.parameters().map(() => new Value(0));

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
    setTimeout(buttonClick, 1000);
  });
</script>

<br /><br /><br />

<div id="all">
  <br />
  <h3 class="body-header">See for yourself</h3>
  <hr />
  <p class="body-text">
    As they say, talk is cheap! So let's train our own Neural Network.
    <br /><br />
    Below we show the architecture for a fully-interactive feed-forward Neural Network.
    By selecting the <span class="box">+</span> and
    <span class="box">-</span>
    buttons, you can make the network wider, deeper, or both. On the right-hand side,
    select from three unique classification datasets for the network to classify.
    The network's accuracy at each epoch is shown below the network's predictions
    - hopefully the accuracy goes up each time you train!
    <br /><br />
    To train the model, we use batch gradient descent: every item in our training
    data (the blue and pink circles) is run via a forward pass through the data (⬤),
    the error is calculated, and the weights are then adjusted via backpropagation
    (<span class="red">⬤</span>). This occurs everytime you click
    <span class="bold">Run 1 Epoch</span>.
    <br /><br />
    Even for simple classification problems like these, neural networks can be hard
    to train! If your network accuracy doesn't improve after a few epochs, try reinitializing
    the weights by clicking
    <span class="bold">Reset Weights</span>, or try changing the network's
    architecture.
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
                disabled={buttonDisabled}>Run 1 Epoch</button
              >

              <button
                disabled={buttonDisabled}
                class:active={$playAnimation}
                on:click={() => {
                  reset_model();
                }}>Reset Weights</button
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
    How did you do? For these specific problems, you may have found that wider
    networks perform better than deeper networks. This is because wider networks
    can create more complex decision boundaries, which can better capture the
    intricate patterns in the spiral and moon datasets.
  </p>
  <br />
  <p class="body-text">
    You may also have noticed that the neural network doesn't always, well, <i
      >learn</i
    >. This may be occuring for a number of reasons, including inadequate weight
    initialization, a suboptimal learning rate, or even an insufficient number
    of training epochs. In some cases, the network architecture itself might not
    be suitable for the complexity of the data at hand.
    <br /><br />
    In any case, the key takeaway here is simple:
    <span class="bold">training neural networks isn't easy!</span> Even for small,
    relatively simple datasets such as those shown here, training a neural network
    can take some care and finesse.
  </p>
</div>

<style>
  .red {
    color: rgba(255, 80, 83, 0.75);
  }
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
    grid-template-columns: 70% 30%;
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
    background-color: var(--white);
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
    /* outline: 2px solid purple; */
  }
  #play-button {
    margin-right: auto;
    display: flex;
  }
  #play-button button {
    background-color: var(--white);
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

  section {
    max-width: 1200px;
    margin: auto;
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

  @media only screen and (max-width: 950px) {
    #play-button button {
      font-size: 12px;
      padding: 4px 1px;
      margin-right: 10px;
      opacity: 1;
    }

    #network-interactive-container {
      display: grid;
      height: var(--viz-height);
      max-height: var(--max-viz-height);
      grid-template-columns: 74% 26%;
    }

    #animation-controls {
      max-width: 100%;
    }
    #play-button button {
      padding: 4px 12px;
      margin-right: 5px;
    }
    #scatter-plot,
    #error-plot {
      height: 100%;
      width: 100%;
    }
    #eval-container {
      grid-template-rows: 10% 42% 40% 8%;
      grid-gap: 0%;
      max-height: var(--max-viz-height);
      width: 100%;
    }
  }
</style>
