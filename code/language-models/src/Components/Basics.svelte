<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
  import UnigramTable from "./charts/UnigramTable.svelte";
  import Barchart from "./charts/Barchart.svelte";
  import UnigramSentence from "./charts/UnigramSentence.svelte";
</script>

<section>
  <p class="body-header">Word Distributions</p>
  <p class="body-text">
    Language models learn to predict the likelihood of a word or sequence of
    words in a given context. By leveraging large amounts of text data, these
    models capture the statistical patterns of words and their relationships
    within sentences. The key idea is to estimate the probability distribution
    of words in a language, which can then be used to generate new text or
    analyze existing text.
  </p>
</section>
<div id="unigram-container">
  <div>
    <div id="scatter1-container">
      <Barchart />
    </div>
    <div id="output1-container">
      <UnigramTable />
    </div>
  </div>
  <div id="unigram-model">
    <UnigramSentence />
  </div>
</div>

<style>
  #unigram-container {
    outline: 2px solid black;
    display: grid;
    margin: auto;
    height: 100%;
    width: 70%;
    grid-template-columns: 60% 40%;
    grid-gap: 0%;
    max-width: 1000px;
  }
  #scatter1-container {
    height: 38vh;
  }
  #output1-container {
    border: var(--sky);
    max-height: 38vh;
  }
  #unigram-model {
    display: flex;
    align-items: center;
  }
  ul {
    max-width: 600px;
    margin: auto;
    color: var(--squid-ink);
    padding-top: 0.5rem;
  }
  li {
    padding: 0.25rem;
    list-style: none;
    color: var(--squid-ink);
  }
  /* mobile */
  @media screen and (max-width: 950px) {
    ul {
      max-width: 80%;
    }
    li {
      padding: 0.25rem 0;
    }
  }
</style>
