<script>
  import DatasetScatter from "./DatasetScatter.svelte";
  import { circles, moons, spirals } from "../../datasets";
  import { interactiveDataset } from "../../store";

  function setData(dataset) {
    $interactiveDataset = dataset;
  }
</script>

<div class="dataset-icons">
  <div class="dataset-icon" on:click={() => setData(circles)}>
    <DatasetScatter data={circles} />
  </div>
  <div class="dataset-icon" on:click={() => setData(moons)}>
    <DatasetScatter data={moons} />
  </div>
  <div class="dataset-icon" on:click={() => setData(spirals)}>
    <DatasetScatter data={spirals} />
  </div>
</div>

<style>
  .dataset-icons {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    width: 32%;
    height: 50px;
    /* outline: 1px solid var(--squidink); */
    margin-right: 1%;
  }

  .dataset-icon {
    width: 60px;
    height: 60px;
    opacity: 0.8;
  }
  .dataset-icon:hover {
    outline: 2px solid var(--squidink);
    opacity: 1;
  }
  .dataset-icon > p {
    font-family: var(--font-mono);
    font-size: 10px;
  }
</style>
