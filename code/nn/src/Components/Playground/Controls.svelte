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

<style>
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
</style>
