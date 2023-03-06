<script>
  import { onMount } from "svelte";
  import NetworkVisual from "./VizNetworkVisual.svelte";
  import ErrorLineChart from "./VizErrorLineChart.svelte";
  import PredictionScatter from "./VizPredictionScatter.svelte";

  import {
    animationDuration,
    network,
    numLayers,
    playAnimation,
    ggg,
    points,
  } from "../../store";

  let iconToArrow;
  let canvas;

  function updateNetwork(event) {
    const newNetwork = event.target.value
      .split(",")
      .map((x) => parseInt(x.trim()))
      .filter((x) => !isNaN(x));
    network.set(newNetwork);
  }

  function toggleAnimation() {
    $playAnimation = !$playAnimation;
    let animationSelections = [];

    let circles = $ggg.querySelectorAll("circle.moving-circle");
    console.log("all circles", circles);
    console.log(`# circles: ${circles.length}`);

    $points.forEach((p) => {
      const selector = `animateMotion#animatePath1${p}`;
      const selection = $ggg.querySelectorAll(selector);
      const set1 = $ggg.querySelectorAll(`#set1`);
      // console.log("set1", set1);
      animationSelections.push({ selection: selection, p: p, set1: set1 });
    });
    console.log("anima", animationSelections);
    animationSelections.forEach((element) => {
      setTimeout(() => {
        element.selection.forEach((selection) => {
          selection.beginElement();
        });
        // element.set1.forEach((sett) => {
        //   sett.beginElement();
        // });
      }, element.p * 100); // Multiply by 1000 to convert seconds to milliseconds
    });
  }

  let batchSize = 3;
  $: $points = [...Array(batchSize).keys()];
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
        <input
          type="text"
          on:input={updateNetwork}
          value={$network.join(", ")}
        />
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
        <button class:active={$playAnimation} on:click={toggleAnimation}
          >Run Batch</button
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
    /* background: conic-gradient(
        from 90deg at 1px 1px,
        #0000 90deg,
        rgba(243, 240, 240, 0.05) 0
      )
      0 0/20px 20px; */
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
