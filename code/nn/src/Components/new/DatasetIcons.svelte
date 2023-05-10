<script>
  import DatasetScatter from "./DatasetScatter.svelte";
  import { circles, moons, spirals, scatterData } from "../../datasets";
  import { interactiveDataset } from "../../store";

  function setData(dataset, i) {
    clickedOption = i;
    $interactiveDataset = dataset;
  }

  let clickedOption = 0;
</script>

<div class="dataset-icons">
  {#each [circles, moons, spirals, scatterData] as data, i}
    <div
      class="dataset-icon"
      class:selected={clickedOption == i}
      on:click={() => setData(data, i)}
      on:keydown={() => setData(data, i)}
    >
      <DatasetScatter {data} />
    </div>
  {/each}
</div>

<style>
  .dataset-icons {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    width: 80%;
    height: 50px;
    margin: auto;
  }

  .dataset-icon {
    width: 45px;
    height: 45px;
    opacity: 0.5;
  }
  .dataset-icon:hover {
    outline: 3px solid var(--squidink);
    opacity: 1;
  }
  .selected {
    outline: 3px solid var(--squidink);
    opacity: 1;
  }
</style>
