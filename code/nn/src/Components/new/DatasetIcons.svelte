<script>
  import DatasetScatter from "./DatasetScatter.svelte";
</script>

<div class="dataset-icons">
  <div class="dataset-icon">
    <DatasetScatter />
  </div>
  <div class="dataset-icon">
    <DatasetScatter />
  </div>
  <div class="dataset-icon">
    <DatasetScatter />
  </div>
</div>

<style>
  .dataset-icons {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    width: 32%;
    height: 50px;
    border: 1px solid blue;
    margin-right: 1%;
  }

  .dataset-icon {
    /* background-color: red; */
    width: 45px;
    height: 100%;
  }
</style>
