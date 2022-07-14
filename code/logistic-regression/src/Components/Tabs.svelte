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
      max-width: 95%;
      margin: auto;
      /* border: 4px solid var(--squidink); */
      border-radius: 4px;
    }
    .box {
      margin-bottom: 10px;
      padding: 40px;
      border: 2px solid var(--secondary);
      border-radius: 0 0 0.5rem 0.5rem;
      background: var(--paper);
      border-top: 0;
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      padding-left: 0;
      margin-bottom: 0;
      list-style: none;
      border-bottom: 2px solid var(--secondary);
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
      color: var(--squidink);
    }
  
    span:hover {
      /* border-color: #e9ecef #e9ecef var(--secondary); */
    }
  
    li:hover {
      color: var(--secondary);
    }
  
    li.active > span {
      color: #495057;
      background-color: var(--paper);
      border-color: var(--secondary) var(--secondary) var(--paper);
      background: var(--paper);
    }
  </style>