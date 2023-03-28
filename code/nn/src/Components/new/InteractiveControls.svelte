<script>
  import { numLayersInteractive, networkInteractive } from "../../store";

  function add() {
    if ($numLayersInteractive < 6) {
      let newNN = [...$networkInteractive];
      newNN.splice(-1, 0, 1);
      $networkInteractive = [...newNN];
    }
  }

  function subtract() {
    if ($numLayersInteractive > 3) {
      const secondToLastLayerIndex = $numLayersInteractive - 2;
      let newNN = [...$networkInteractive];
      newNN.splice(secondToLastLayerIndex, 1);
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
    margin: auto;
    height: 100%;
    /* border: 1px solid black; */
  }
  #add-buttons {
    display: flex;
    justify-content: center;
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

  .button-container {
    display: flex;
    justify-content: space-between;
  }

  .button {
    background-color: var(--bb);
    border: 1px solid var(--squidink);
    color: var(--squidink);
    /* border-radius: 3px; */
    padding: 5px 10px;
    font-size: 14px;
    cursor: pointer;
  }
</style>
