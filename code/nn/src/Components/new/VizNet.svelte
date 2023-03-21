<script>
  import { onMount } from "svelte";
  import NetworkVisual from "./VizNetworkVisual.svelte";
  import ErrorLineChart from "./VizErrorLineChart.svelte";
  import PredictionScatter from "./VizPredictionScatter.svelte";

  import {
    animationDuration,
    networkInteractive,
    numLayers,
    playAnimation,
    ggg,
    points,
  } from "../../store";
  import { range } from "../../neuralnetCode/arrayUtils";
  import { circle_data } from "../../neuralnetCode/data";
  import { Value, MLP, ensureValue } from "../../neuralnetCode/ann";

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
      const set1 = $ggg.querySelectorAll(`#set1`);
      animationSelections.push({ selection: selection, p: p, set1: set1 });
    });
    animationSelections.forEach((element) => {
      setTimeout(() => {
        element.selection.forEach((selection) => {
          selection.beginElement();
        });
      }, element.p * 100); // Multiply by 1000 to convert seconds to milliseconds
    });
  }

  let batchSize = 3;
  $: $points = [...Array(batchSize).keys()];

  var train_interval;
  var N = 200;
  //   var [X_data, y_data] = circle_data(N);
  var epochs = 10;
  var N_in = 2;
  var dims = [3, 1];
  var lr = 0.01;
  var alpha = 0.0001;
  var batch_size = 32;
  var k = 0;
  const model = new MLP(N_in, dims);
  console.log("model", model);
  console.log("num params", model.parameters().length);

  const [X, y] = circle_data(100);

  // run batch gd

  // make sure each input is a Value
  var inputs = X.map(function (row) {
    return row.map(function (x) {
      return ensureValue(x);
    });
  });

  function run_batch() {
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
    var preds = inputs.map(function (row) {
      return model.call(row);
    });

    // svm max margin loss
    var losses = range(0, preds.length).map(function (i) {
      return preds[i][0].mul(-y[i]).add(+1.0).relu();
    });

    var data_loss = losses
      .reduce(function (sum, current) {
        return sum.add(current);
      }, new Value(0))
      .mul(1 / losses.length);

    var reg_loss = model
      .parameters()
      .map(function (e) {
        return e.mul(e);
      })
      .reduce(function (sum, cur) {
        return sum.add(cur);
      }, new Value(0))
      .mul(alpha);

    var total_loss = data_loss.add(reg_loss);

    var accuracies = range(0, preds.length).map(function (i) {
      return preds[i][0].data > 0.0 === y[i] > 0.0 ? 1.0 : 0.0;
    });

    var accuracy =
      accuracies.reduce(function (sum, current) {
        return sum + current;
      }, 0.0) / accuracies.length;

    // # backward
    model.zero_grad();
    total_loss.backward();

    // sgd
    var learning_rate = 1.0 - (0.9 * k) / 100;

    for (var _i = 0, _b = model.parameters(); _i < _b.length; _i++) {
      var p = _b[_i];
      // p.data -= lr * p.grad;
      p.data -= learning_rate * p.grad;
    }

    if (k % 1 === 0) {
      console.log(
        "step " +
          k +
          " loss " +
          total_loss.data +
          ", accuracy " +
          accuracy * 100 +
          "%"
      );
    }

    k++;
    // });
  }

  run_batch();
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
    <div id="architecture-input">
      <div>
        <p>Network Architecture</p>
        <input type="text" value={$networkInteractive.join(", ")} />
      </div>
    </div>
    <div id="lol-container">
      <div class="network-plot">
        <NetworkVisual />
      </div>
      <div id="eval-container">
        <div id="scatter-plot">
          <PredictionScatter />
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
            toggleAnimation();
            run_batch();
          }}>Run Batch</button
        >
      </div>
      <div id="batch-button">
        <p>Batch Size:</p>
        <input type="number" bind:value={batchSize} min="1" max="8" />
      </div>
      <div>
        Duration:
        <input
          class="input-duration"
          type="range"
          min="0.5"
          max="2"
          step="0.25"
          bind:value={$animationDuration}
        />
      </div>
    </div>
  </section>
</div>

<style>
  #lol-container {
    border: 1px solid black;
    display: grid;
    height: 60vh;
    width: 1000px;
    grid-template-columns: 80% 20%;
    margin: auto;
    background: conic-gradient(
        from 90deg at 1px 1px,
        #0000 90deg,
        rgba(243, 240, 240, 0.05) 0
      )
      0 0/20px 20px;
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
    border: 1px solid black;
    display: grid;
    grid-template-rows: 55% 45%;
    grid-template-columns: 100%;
    max-height: 60vh;
  }
  #scatter-plot {
    /* border: 1px solid black; */
    height: 100%;
  }
  #error-plot {
    /* border: 1px solid black; */
  }
  #animation-controls {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    max-width: 80%;
    margin: 0px auto;
    padding-top: 5px;
    font-size: 21px;
    font-weight: bold;
    text-transform: uppercase;
  }
  #play-button {
    margin-right: auto;
    display: flex;
  }
  #play-button button {
    border: 5px solid black;
    border-radius: 0;
    padding: 8px 24px;
    font-size: 21px;
    box-shadow: 4px 4px 0 0 #285555;
    text-transform: lowercase;
  }
  #play-button button:hover {
    background-color: var(--yellow);
  }
  #batch-button {
    display: flex;
    font-size: 21px;
    text-transform: uppercase;
    font-weight: bold;
    margin-right: 10px;
  }
  #batch-button input {
    font-size: 21px;
    padding-left: 5px;
    margin-left: 6px;
  }
  .bold {
    font-weight: bold;
    background-color: var(--yellow);
  }
  p {
    font-weight: bold;
  }
  section {
    max-width: 1200px;
    margin: auto;
    /* background-color: rgb(255, 164, 209); */
  }
  #lol {
    padding: 10px 14px;
    letter-spacing: 5px;
    /* animation: lol-bg 2.75s infinite alternate; */
    border: 4px solid black;
    background-color: var(--yellow);
  }
  #net {
    padding: 9px 17px;
    letter-spacing: 5px;
    /* animation: net-bg 2s infinite alternate; */
    outline: 5px solid rgba(0, 0, 0, 0.45);
    background: conic-gradient(
        from 90deg at 1px 1px,
        #0000 90deg,
        rgba(0, 0, 0, 0.15) 0
      )
      0 0/20px 20px;
    background-color: white;
  }

  @keyframes lol-bg {
    0% {
      background-color: var(--yellow);
    }
    50% {
      background-color: skyblue;
    }
    50% {
      background-color: rgb(138, 255, 80);
    }
    75% {
      background-color: skyblue;
    }
    100% {
      background-color: var(--yellow);
    }
  }

  @keyframes net-bg {
    0% {
      background-color: hotpink;
    }
    50% {
      background-color: white;
    }
    100% {
      background-color: skyblue;
    }
  }

  .input-duration {
    /* width: 20%; */
  }

  #architecture-input {
    display: flex;
    width: 80%;
    margin: auto;
    flex-direction: row;
    text-transform: uppercase;
    font-weight: bold;
    justify-content: flex-start;
  }
  input {
    /* width: 50%; */
    margin: auto;
  }

  .active {
    opacity: 0.8;
    /* pointer-events: none; */
  }
</style>
