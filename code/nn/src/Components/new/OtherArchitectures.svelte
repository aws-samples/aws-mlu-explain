<script>
  import Rnn from "./Architectures/RNN.svelte";
  import Cnn from "./Architectures/CNN.svelte";
  import Gan from "./Architectures/GAN.svelte";
  import Transformer from "./Architectures/Transformer.svelte";
</script>

<section>
  <h3 class="body-header">Going Forward: Other Neural Network Architectures</h3>
  <hr />
  <p class="body-text">
    Up to this point, we've describe a specific neural network architecture
    where values flow forward linearly through a network, and gradients flow
    linearly backwards through a network. These are often referred to as feed
    <span class="bold">forward neural networks</span>, or
    <span class="bold">artificial neural networks</span> (the word 'artificial' comes
    from the network's composition of artificial neurons).
  </p>
  <br />
  <p class="body-text">
    However, this is just the tip of the iceberg when it comes to the field of
    neural networks. While artificial neural networks have been incredibly
    successful in a wide range of applications, many other types of neural
    network architectures exist that can be used to solve different types of
    problems. In this section, we will briefly explore some of the other network
    architectures that are commonly used and why they are necessary for solving
    different types of problems.
  </p>
  <br />
  <br />
  <Cnn />
  <hr class="splitter" />
  <Rnn />
  <hr class="splitter" />
  <Gan />
  <hr class="splitter" />
  <Transformer />
  <hr class="splitter" />
  <p class="body-text">
    This is not an exhaustive list of network architectures - more are developed
    every day! But it's a great starting point to send you forward on your
    journey into deep learning.
  </p>
</section>

<style>
  section {
    padding-top: 5rem;
    max-width: var(--max-width);
    margin: auto;
  }
  .splitter {
    margin: 2% auto;
    width: 10%;
  }
</style>
