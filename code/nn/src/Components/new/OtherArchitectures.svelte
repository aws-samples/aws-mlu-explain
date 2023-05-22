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
    linearly backwards through a network. These are often referred to as
    <span class="bold">feed forward neural networks</span>, or
    <span class="bold">artificial neural networks</span> (the word 'artificial' comes
    from the network's composition of artificial neurons). (As mentioned previously,
    these are also sometimes referred to as Multilayer Perceptrons, because of their
    original compoistion of Perceptrons)
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
  <div>
    <p class="body-text">
      <span class="bold">Recurrent Neural Networks (RNNs):</span>

      Recurrent Neural Networks (RNNs) differ from feed-forward neural networks
      as they have a built-in memory, allowing them to process sequences of
      data. This makes RNNs well-suited for tasks like natural language
      processing and time series prediction. They can learn patterns in
      sequences by connecting the output from one time step to the input of the
      next, thereby remembering previous information.
    </p>
  </div>
  <!-- <hr class="splitter" /> -->
  <div>
    <p class="body-text">
      <span class="bold">Convolutional Neural Networks (CNNs):</span>

      Convolutional Neural Networks (CNNs) are specifically designed for
      processing grid-like data, such as images. Unlike feed-forward networks,
      CNNs use convolutional layers to scan and identify local patterns within
      the input. This makes them more efficient for image recognition, object
      detection, and other computer vision tasks, where spatial information is
      crucial.
    </p>
  </div>
  <!-- <hr class="splitter" /> -->
  <div>
    <p class="body-text">
      <span class="bold">Generative Adversarial Networks (GANs):</span>

      Generative Adversarial Networks (GANs) consist of two distinct neural
      networks, a generator and a discriminator, that compete against each
      other. Unlike feed-forward networks, GANs learn to generate new data
      samples by capturing the distribution of the training data. They are
      widely used for tasks such as image synthesis, style transfer, and data
      augmentation.
    </p>
  </div>
  <!-- <hr class="splitter" /> -->
  <div>
    <p class="body-text">
      <span class="bold">Graph Neural Networks:</span>

      Graph Neural Networks are a type of neural network that operate on
      graph-structured data, which is not easily handled by feed-forward
      networks. They are designed to learn and encode the relationships between
      nodes in a graph, making them useful for tasks such as social network
      analysis, molecular property prediction, and recommendation systems.
    </p>
  </div>
  <!-- <hr class="splitter" /> -->
  <div>
    <p class="body-text">
      <span class="bold">Transformer Architectures:</span>

      Transformer architectures differ from feed-forward networks as they rely
      on a self-attention mechanism to process input data, allowing them to
      handle long-range dependencies more effectively. They have been especially
      successful in natural language processing tasks, such as machine
      translation and text summarization, due to their ability to capture
      contextual information across large sequences.
    </p>
  </div>
  <!-- <hr class="splitter" /> -->

  <!-- <Cnn />
  <hr class="splitter" />
  <Rnn />
  <hr class="splitter" />
  <Gan />
  <hr class="splitter" />
  <Transformer /> -->
  <!-- <hr class="splitter" /> -->
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
