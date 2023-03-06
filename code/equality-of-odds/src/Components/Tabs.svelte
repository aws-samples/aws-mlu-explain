<script>
  export let items = [];
  export let activeTabValue = 1;

  const handleClick = (tabValue) => () => (activeTabValue = tabValue);
</script>

<div id="tab-container">
  <ul>
    {#each items as item}
      <li class={activeTabValue === item.value ? "active" : ""}>
        <span on:click={handleClick(item.value)}>{item.label}</span>
      </li>
    {/each}
  </ul>
  {#each items as item}
    {#if activeTabValue == item.value}
      <div class="box">
        <svelte:component this={item.component} />
      </div>
    {/if}
  {/each}
</div>

<style>
  #tab-container {
    width: 95%;
    max-width: 1000px;
    margin: auto;
    border-radius: 4px;
  }
  .box {
    margin-bottom: 10px;
    padding: 40px;
    border: 2px solid var(--smile);
    border-radius: 0 0 0.5rem 0.5rem;
    background: #f1f3f3;
    border-top: 0;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    padding-left: 0;
    margin-bottom: 0;
    list-style: none;
    border-bottom: 2px solid var(--smile);
  }
  li {
    margin-bottom: -2px;
    font-size: 14px;
  }

  span {
    border: 2px solid transparent;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    display: block;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }

  span:hover {
    /* border-color: #e9ecef #e9ecef var(--smile); */
  }

  li:hover {
    color: var(--smile);
  }

  li.active > span {
    color: #495057;
    background-color: #f1f3f3;
    border-color: var(--smile) var(--smile) #f1f3f3;
    background: #f1f3f3;
  }

  @media screen and (max-width: 950px) {
    li {
      margin-bottom: -2px;
      font-size: 12px;
    }

    .box {
      padding: 5px;
    }

    span {
      padding: 0.5rem 0.35rem;
    }

    #tab-container {
      max-width: 100%;
    }
  }
</style>
