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
  } from "../../store";
  import { range } from "../../neuralnetCode/arrayUtils";
  import { circle_data } from "../../neuralnetCode/data";
  import { Value, MLP, ensureValue } from "../../neuralnetCode/ann";
  import { circles, moons } from "../../datasets";
  import { makeJsonArray } from "../../utils";

  // set default dataset to circles
  $interactiveDataset = circles;

  let buttonDisabled = false;

  function updateNetwork(event) {
    const hiddenLayerArchitecture = event.target.value
      .split(",")
      .map((x) => parseInt(x.trim()))
      .filter((x) => !isNaN(x))
      .slice(1, -1);

    const newNetwork = [2, ...hiddenLayerArchitecture, 1];
    // networkInteractive.set(newNetwork);
  }

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
    runBatch();
    toggleAnimation();
    toggleButton();
  }

  let batchSize = 1;
  $: $points = [...Array(batchSize).keys()];

  $: N_in = 2;
  // $: dims = [6, 4, 1];
  $: dims = $networkInteractive.slice(1);
  var lr = 0.01;
  var alpha = 0.0001;
  var k = 0;
  $: model = new MLP(N_in, $networkInteractive.slice(1));

  $: dataArr = makeJsonArray($interactiveDataset);

  $: [X, y] = dataArr;

  // make sure each input is a Value
  $: inputs = X.map(function (row) {
    return row.map(function (x) {
      return ensureValue(x);
    });
  });

  function reset_model() {
    k = 0;
    model = new MLP(N_in, dims);

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
  }

  function runBatch() {
    // return setInterval(function () {
    //   if (k > epochs) {
    //     clearInterval(train_interval);
    //     return;
    //   }

    // for (let k = 0; k < epochs; k++) {

    // --------------------------
    // TRAIN LOOP
    // --------------------------
    // k++;

    //  predictions
    // loop through input X and call model prediction on it
    let preds = inputs.map(function (row) {
      return model.call(row);
    });

    // svm max margin loss
    let losses = range(0, preds.length).map(function (i) {
      return preds[i][0].mul(-y[i]).add(+1.0).relu();
    });

    let data_loss = losses
      .reduce(function (sum, current) {
        return sum.add(current);
      }, new Value(0))
      .mul(1 / losses.length);

    let reg_loss = model
      .parameters()
      .map(function (e) {
        return e.mul(e);
      })
      .reduce(function (sum, cur) {
        return sum.add(cur);
      }, new Value(0))
      .mul(alpha);

    let total_loss = data_loss.add(reg_loss);

    let accuracies = range(0, preds.length).map(function (i) {
      return preds[i][0].data > 0.0 === y[i] > 0.0 ? 1.0 : 0.0;
    });

    let accuracy =
      accuracies.reduce(function (sum, current) {
        return sum + current;
      }, 0.0) / accuracies.length;

    // # backward
    model.zero_grad();
    total_loss.backward();

    // sgd
    let learning_rate = k <= 1 ? 0.05 : 1.0 - (0.9 * k) / 100;

    for (let _i = 0, _b = model.parameters(); _i < _b.length; _i++) {
      let p = _b[_i];
      // p.data -= lr * p.grad;
      p.data -= learning_rate * p.grad;
    }

    if (k % 1 === 0) {
      // console.log(
      //   "step " +
      //     k +
      //     " loss " +
      //     total_loss.data +
      //     ", accuracy " +
      //     accuracy * 100 +
      //     "%"
      // );
    }
    // export const errorMetrics = [{ x: 0, loss: 0, accuracy: 0 }];
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

    $hexPreds = [...newPreds];

    // log errors
    $errorMetrics = [...$errorMetrics, newError];

    // increment epoch count
    k++;
    // });
  }

  // anytime dataset changes or nn changes, reset model
  $: {
    $interactiveDataset;
    $networkInteractive;
    reset_model();
  }

  // runBatch();

  $: {
    console.log("model!", model);
  }
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
          <!-- <p>Network Architecture</p>
          <input type="text" value={$networkInteractive.join(", ")} /> -->
          <InteractiveControls />
        </div>
      </div>
      <DatasetIcons />
    </div>
    <div id="lol-container">
      <div class="network-plot">
        <NetworkVisual />
      </div>
      <div id="eval-container">
        <div id="scatter-plot">
          <VizPredictionScatter data={$interactiveDataset} nnModel={model} />
        </div>
        <div id="error-plot">
          <ErrorLineChart />
        </div>
      </div>
    </div>

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
          class:active={$playAnimation}
          on:click={() => {
            reset_model();
          }}>Restart</button
        >
      </div>
      <!-- <div id="batch-button">
        <p>Batch Size:</p>
        <input type="number" bind:value={batchSize} min="1" max="8" />
      </div> -->
      <div>
        Animation<br />
        Duration:
        <input
          class="input-duration"
          type="range"
          min="0.05"
          max="2"
          step="0.05"
          bind:value={$animationDuration}
        />
      </div>
    </div>
  </section>
</div>

<style>
  #top-controls {
    /* border: 1px solid hotpink; */
    display: flex;
    width: 1000px;
    margin: auto;
  }
  #lol-container {
    /* border: 1px solid var(--squidink); */
    display: grid;
    height: 60vh;
    width: 1000px;
    grid-template-columns: 70% 30%;
    margin: auto;
  }
  .network-plot {
    width: 100%;
    height: 60vh;
    margin: auto;
    background: conic-gradient(
        from 90deg at 1px 1px,
        #0000 90deg,
        rgba(243, 240, 240, 0.05) 0
      )
      0 0/20px 20px;
  }
  #eval-container {
    /* border: 1px solid var(--squidink); */
    display: grid;
    grid-template-rows: 60% 40%;
    grid-template-columns: 100%;
    grid-gap: 0%;
    max-height: 60vh;
    width: 100%;
  }

  #scatter-plot,
  #error-plot {
    height: 100%;
    outline: 0px solid hotpink;
  }

  button:hover {
    color: white;
    background-color: var(--squidink);
  }
  button {
    opacity: 1;
    pointer-events: auto;
  }

  button[disabled] {
    opacity: 0.6;
    pointer-events: none;
  }
  #animation-controls {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    max-width: 80%;
    margin: 0px auto;
    padding-top: 5px;
    font-size: var(--size-default);
    font-weight: bold;
    text-transform: uppercase;
  }
  #play-button {
    margin-right: auto;
    display: flex;
  }
  #play-button button {
    border: 1px solid var(--squidink);
    border-radius: 0;
    padding: 8px 24px;
    font-size: var(--size-default);
    /* box-shadow: 4px 4px 0 0 #285555; */
    /* text-transform: lowercase; */
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
