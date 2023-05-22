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
  @media only screen and (max-width: 950px) {
    .dataset-icons {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      width: 100%;
      height: 40px;
      margin: auto;
    }
    .dataset-icon {
      width: 40px;
      height: 40px;
    }
  }
</style>
