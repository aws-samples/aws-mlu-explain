<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
  import Scatter1 from "./charts/Scatter1.svelte";
  import Roc from "./charts/ROC.svelte";
</script>

<section>
  <p class="body-header">N-Grams</p>
  <p class="body-text">
    N-gram language models are a simple yet effective way to capture context in
    text. They break text into fixed-size chunks called n-grams (where 'n'
    represents the number of words in the chunk). By analyzing the frequency and
    co-occurrence of these n-grams in a corpus, the model can make predictions
    based on the context provided by the preceding words.
  </p>
</section>

<style>
  #charts1-container {
    display: grid;
    margin: auto;
    height: 38vh;
    width: 70%;
    grid-template-columns: 50% 50%;
    grid-gap: 2%;
    max-width: 1000px;
  }
  #scatter1-container {
    max-height: 38vh;
  }
  #output1-container {
    border: var(--sky);
    max-height: 38vh;
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
