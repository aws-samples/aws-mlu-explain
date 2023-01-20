<script>
  import Table from "./Table.svelte";
  import NeuralNetwork from "./NeuralNetwork.svelte";
  import LayerControls from "./LayerControls.svelte";
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
</script>

<section>
  <hr />
  <h1>Try For Yourself</h1>
  <p class="body-text">
    By combining nonlinearities, neural networks are able to solve more
    difficult problems. For example, the conic data shown below can't be solved
    with a single classifier, but neural networks make it a breeze. In fact, a
    theorem exists that neural networks are universal approximaters: they're
    able to approximate anything (though that theorem says nothing about how
    long or how much data you'll need to solve whatever it is you're trying to
    solve).
    <br /><br />
    To see for yourself, update out the neural network below to predict the given
    problem set.
  </p>
  <br /><br />
  <div id="nn-container">
    <div id="controls">
      <button>Run Model</button>
      <p>Epochs: 1,000</p>
      <h2>Datasets</h2>
      <div id="data-cards">
        <div class="dataset-card" id="data1" />
        <div class="dataset-card" id="data2" />
        <div class="dataset-card" id="data3" />
        <div class="dataset-card" id="data4" />
      </div>
      <br />
      <button>Reset</button>
    </div>
    <div id="network-interactive">
      <!-- <div id='neural-network-chart'></div> -->
      <div id="neural-network-controls">
        <LayerControls />
      </div>
      <NeuralNetwork />
    </div>
    <div id="loss-plots">
      <div id="heatmap" />
      <div id="errors">
        <div id="loss-scatter" />
        <div id="error-text" />
      </div>
    </div>
  </div>
</section>
<br />
<br />
<br />
<br />

<style>
  * {
    transition: all 0.5s;
  }
  section {
    max-width: 80%;
    margin: auto;
  }
  h1 {
    max-width: 600px;
    margin: auto;
    font-size: 2.6rem;
    margin-bottom: 2rem;
    background-color: var(--squidink);
    color: white;
    font-family: var(--font-mono);
  }
  #nn-container {
    width: 100%;
    height: 65vh;
    max-height: 65vh;
    display: grid;
    grid-template-columns: 10% 60% 30%;
  }

  #controls {
    height: 65vh;
    display: grid;
    grid-template-rows: 10% 10% 10% 55% 5% 10%;
  }

  #data-cards {
    display: grid;
    height: 100%;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    margin-bottom: 1rem;
    padding-bottom: 1rem;
  }

  .dataset-card {
    border: 1px solid red;
  }

  #neural-network-controls {
    outline: 1px solid black;
  }

  #error-text {
    outline: 1px solid black;
  }

  #network-interactive {
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 15% 80%;
    outline: 1px solid black;
  }
  #loss-plots {
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 65% 35%;
    outline: 1px solid black;
  }
  #errors {
    display: grid;
    grid-template-columns: 65% 35%;
    outline: 1px solid black;
  }
  button {
    background-color: var(--bg);
    border: 2px solid var(--darksquidink);
    color: var(--squidink);
    padding: 7px 16px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 1.2rem;
    margin: 1rem;
    transition: all 0.25s;
  }
  button:hover {
    background-color: var(--darksquidink); /* Green */
    border: 2px solid var(--darksquidink);
    color: var(--white);
    padding: 7px 16px;
  }
</style>
