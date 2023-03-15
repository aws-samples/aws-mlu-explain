<script>
  import { max } from "d3-array";
  import { unigramCounts } from "../../store";
  let text = "I love dogs and dogs love me";

  $: tokens = text.replace(/[^\w\s]/gi, "").toLowerCase();

  $: vocab = Array.from(new Set(tokens.split(" "))).filter((el) => el !== "");

  function countWords(vocab, text) {
    let count = {};
    let cleanedText = text.replace(/[^\w\s]/gi, "").toLowerCase();
    let totalWords = cleanedText
      .split(" ")
      .filter((token) => token !== "").length;

    for (const word of vocab) {
      count[word] =
        cleanedText.split(" ").filter((token) => token === word).length /
        totalWords;
    }

    return count;
  }

  $: $unigramCounts = countWords(vocab, text);
  $: {
    console.log($unigramCounts);
  }
</script>

<section>
  <!-- <p class="description">
    Edit the sentence and waunigramCountsh the corresponding vocabulary and
    probability distribution update:
  </p> -->
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
            Sentence:
            <input bind:value={text} />
          </div>
        </td>
        {#each vocab as col}
          <td>{$unigramCounts[col].toFixed(2)}</td>
        {/each}
      </tr>
    </tbody>
  </table>
</section>

<style>
  input {
    width: 100%;
    overflow: scroll;
    height: 38px;
  }

  .description {
    font-size: 16px;
    opacity: 0.9;
  }

  section {
    margin: auto;
    padding-bottom: 15px;
  }

  table {
    font-size: 16px;
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
    border-bottom: 1px solid black;
    font-size: 18px;
    text-align: center;
  }

  thead {
    border-bottom: 1px solid black;
  }
</style>
