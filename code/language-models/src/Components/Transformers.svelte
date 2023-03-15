<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
</script>

<section>
  <p class="body-header">Transformers and Attention Mechanism</p>
  <p class="body-text">
    Transformers are a revolutionary neural network architecture introduced by
    Vaswani et al. in 2017. They overcome the limitations of RNNs by leveraging
    a mechanism called self-attention, which allows the model to weigh the
    importance of each word in a sequence when making predictions. This has led
    to significant improvements in NLP tasks, and Transformers now form the
    backbone of many state-of-the-art language models, such as GPT and BERT.
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
