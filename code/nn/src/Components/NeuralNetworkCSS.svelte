<script>
  export let network = [1, 2, 3, 3, 5, 2, 4];
</script>

<div class="neural-network">
  {#each Array(network.length).fill(null) as i, layer}
    <div class="layer">
      {#each Array(network[layer]).fill(null) as _, node}
        <div class="node">{network[layer]}</div>
      {/each}
    </div>
  {/each}
</div>

<style>
  .neural-network {
    display: flex;
    align-items: center;
  }

  .layer {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 20px;
  }

  .node {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #333;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: bold;
  }
</style>
