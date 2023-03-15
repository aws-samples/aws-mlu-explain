<script>
  import { unigramCounts } from "../../store";
  import { generateWords } from "../../nlp";

  $: words = generateWords($unigramCounts, 5);
  $: console.log("words", words);
</script>

<textarea bind:value={words} />

<style>
  textarea {
    margin: auto;
    height: 50%;
    width: 80%;
  }
</style>
