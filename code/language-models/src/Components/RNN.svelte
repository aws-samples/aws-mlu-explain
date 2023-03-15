<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
</script>

<section>
  <p class="body-header">Recurrent Neural Networks (RNN)</p>
  <p class="body-text">
    Recurrent Neural Networks (RNNs) are a class of neural networks designed to
    handle sequential data, making them well-suited for language modeling. RNNs
    have a unique architecture that allows them to maintain an internal state or
    "memory" of past inputs. This memory helps the model capture the
    dependencies between words in a sequence, enabling it to generate more
    accurate predictions.
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
