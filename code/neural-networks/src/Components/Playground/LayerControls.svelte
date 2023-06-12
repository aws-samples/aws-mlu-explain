<script>
  import {
    numLayersInteractive,
    networkInteractive,
  } from "../../playground-store";

  function add() {
    if ($numLayersInteractive < 6) {
      let newNN = [...$networkInteractive];
      newNN.splice(-1, 0, 1);
      $networkInteractive = [...newNN];
    }
  }
  function subtract() {
    if ($numLayersInteractive > 3) {
      let finalEl = $networkInteractive.slice(-1);
      let newNN = $networkInteractive.slice(0, -2).concat(finalEl);
      $networkInteractive = [...newNN];
    }
  }
</script>

<div id="layer-controls">
  <div>
    <p># Hidden Layers: {$numLayersInteractive - 2}</p>
    <div id="add-buttons">
      <button on:click={add}>+</button>
      <button on:click={subtract}>-</button>
    </div>
  </div>
</div>

<style>
  * {
    /* border: 1px solid black; */
  }
  #layer-controls {
    display: flex;
    justify-content: center;
    height: 100%;
  }
  #add-buttons {
    display: flex;
    justify-content: center;
  }

  button {
    background-color: var(--white);
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
