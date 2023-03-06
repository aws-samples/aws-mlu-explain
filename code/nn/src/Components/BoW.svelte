<script>
  let text1 = "I";
  let text2 = "love dogs";
  let text3 = "dogs dogs dogs";

  $: tokens = (text1 + " " + text2 + " " + text3)
    .replace(/[^\w\s]/gi, "")
    .toLowerCase();

  $: vocab = Array.from(new Set(tokens.split(" "))).filter((el) => el !== "");

  let mode = "count";

  function countWords(vocab, text, mode) {
    let count = {};

    for (const word of vocab) {
      if (mode === "count") {
        count[word] = text.split(" ").filter((token) => token === word).length;
      } else {
        count[word] = text.split(" ").filter((token) => token === word).length
          ? 1
          : 0;
      }
    }

    return count;
  }

  $: text1Count = countWords(vocab, text1, mode);
  $: text2Count = countWords(vocab, text2, mode);
  $: text3Count = countWords(vocab, text3, mode);
</script>

<section>
  <h2>Bag of Words Demo</h2>
  <p class="description">
    Edit the sentences and watch the corresponding vocabulary and cell-counts
    update:
  </p>
  <br />
  <div id="title-div">
    <p class="description">Count Method:</p>
    <button
      class:active={mode === "count"}
      on:click={() => {
        mode = "count";
      }}>Count</button
    >
    <button
      class:active={mode === "ohe"}
      on:click={() => {
        mode = "ohe";
      }}>Binary</button
    >
  </div>

  <table>
    <thead>
      <tr>
        <th />
        {#each vocab as col}
          <th class="table-head">{col}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="table-head">
          <div>
            Sentence 1:
            <input bind:value={text1} />
          </div></td
        >

        {#each vocab as col}
          <td>{text1Count[col]}</td>
        {/each}
      </tr>
      <tr>
        <td class="table-head">
          <div>
            Sentence 2:
            <input bind:value={text2} />
          </div></td
        >

        {#each vocab as col}
          <td>{text2Count[col]}</td>
        {/each}
      </tr>
      <tr>
        <td class="table-head">
          <div>
            Sentence 3:
            <input bind:value={text3} />
          </div></td
        >

        {#each vocab as col}
          <td>{text3Count[col]}</td>
        {/each}
      </tr>
    </tbody>
  </table>
</section>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Inconsolata&display=swap");

  * {
    font-family: Inconsolata;
  }

  input {
    width: 300px;
    overflow: scroll;
    height: 38px;
  }
  .description {
    font-size: 16px;
    opacity: 0.9;
  }
  #title-div {
    display: flex;
    align-items: center;
  }
  section {
    margin: auto;
    padding-bottom: 15px;
  }
  table {
    font-size: 16px;
    background-color: white;
    border-collapse: collapse;
  }
  .table-head {
    padding: 16px;
    font-size: 16px;
    text-align: left;
    border: none;
  }

  td {
    padding: 16px;
    background-color: white;
    border-bottom: 1px solid black;
    font-size: 18px;
    text-align: center;
  }
  button {
    padding: 6px 10px;
    font-size: 16px;
    border: 1px solid black;
    text-align: center;
    margin: 2px 8px;
    font-weight: bold;
  }
  button:hover {
    color: white;
    background-color: coral;
  }

  .active {
    color: white;
    background-color: coral;
  }

  thead {
    /* 		background-color: pink; */
    border-bottom: 1px solid black;
  }
</style>
