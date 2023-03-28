<script>
  import DatasetScatter from "./DatasetScatter.svelte";
  import { circles, moons, spirals } from "../../datasets";
  import { interactiveDataset } from "../../store";

  function setData(dataset, i) {
    clickedOption = i;
    $interactiveDataset = dataset;
  }

  let clickedOption = 0;
</script>

<div class="dataset-icons">
  {#each [circles, moons, spirals] as data, i}
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
    width: 32%;
    height: 50px;
    /* outline: 1px solid var(--squidink); */
    margin-right: 1%;
  }

  .dataset-icon {
    width: 60px;
    height: 60px;
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
  .dataset-icon > p {
    font-family: var(--font-mono);
    font-size: 10px;
  }
</style>
