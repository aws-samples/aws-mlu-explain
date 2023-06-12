<script>
  let open = false;
  let selected = "Intro";

  function handleOptionClick(option) {
    selected = option;
    console.log(`Selected option: ${option}`);
  }

  function toggle() {
    open = !open;
  }
</script>

<template>
  <div class="container">
    <div class="header" on:click={() => toggle()}>
      <span>Select Text Difficulty:</span>
      <span class="selected">{selected}</span>
      <span class="arrow">{open ? "▲" : "▼"}</span>
    </div>
    {#if open}
      <div class="options">
        <button
          on:click={() => handleOptionClick("Intro")}
          class:selected={selected === "Intro"}>Intro</button
        >
        <button
          on:click={() => handleOptionClick("Experienced")}
          class:selected={selected === "Experienced"}>Experienced</button
        >
        <button
          on:click={() => handleOptionClick("Expert")}
          class:selected={selected === "Expert"}>Expert</button
        >
      </div>
    {/if}
  </div>
</template>

<style>
  .container {
    position: fixed;
    top: 0;
    left: 0;
    background-color: pink;
    height: 50px;
    width: 300px;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }

  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }

  .options {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .arrow {
    font-size: 0.8em;
  }

  .selected {
    font-weight: bold;
  }

  button {
    margin-right: 10px;
    background-color: transparent;
    border: none;
    outline: none;
    font-size: 1em;
    font-weight: bold;
    text-transform: uppercase;
    color: white;
    cursor: pointer;
  }

  button:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
</style>
