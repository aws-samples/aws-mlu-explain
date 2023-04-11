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
    <div class="button-container">
      <button on:click={add}>+</button>
      <button on:click={subtract}>-</button>
    </div>
  </div>
</div>

<style>
  .button-container {
    display: flex;
    justify-content: space-between;
    width: 50%;
    margin: auto;
  }

  #layer-controls {
    display: flex;
    justify-content: center;
    margin: auto;
    height: 100%;
    /* border: 1px solid black; */
  }

  button {
    background-color: var(--bb);
    border: 1px solid var(--squidink);
    color: var(--squidink);
    padding: 5px 10px;
    font-size: 14px;
    cursor: pointer;
  }
  button:hover {
    background-color: var(--darksquidink); /* Green */
    border: 1px solid var(--darksquidink);
    color: var(--white);
  }
</style>
