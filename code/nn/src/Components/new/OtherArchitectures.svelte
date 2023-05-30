<script>
  import { tooltip } from "../../tooltip";
</script>

<section>
  <h3 class="body-header">Going Forward: Other Neural Network Architectures</h3>
  <hr />
  <p class="body-text">
    Up to this point, we've describe a specific neural network architecture
    where values flow forward linearly through a network, and gradients flow
    linearly backwards through a network. These are often referred to as
    <span class="bold">feed forward neural networks</span>, or
    <span class="bold">artificial neural networks</span> (ANN's
    <sup
      ><span
        class="info-tooltip"
        title="The word 'artificial' comes
      from the network's composition of artificial neurons."
        use:tooltip
        >[&#8505;]
      </span></sup
    >). You may even see them referred to as Multilayer Perceptrons, a callback
    to the early Neural Network compositions of Perceptrons
    <sup
      ><span
        class="info-tooltip"
        title="Indeed, this notion of a network of step-functions 'firing' or not is deeply inspired by the workings of biological neurons in the human brain, thus giving rise to the brain-like analogy often used to describe neural networks."
        use:tooltip
        >[&#8505;]
      </span></sup
    >.
  </p>
  <br />
  <p class="body-text">
    However, this is just the tip of the iceberg when it comes to the field of
    neural networks. While feed forward neural networks have been incredibly
    successful in a wide range of applications, many other types of neural
    network architectures exist that can be used to solve different types of
    problems. To get you started on your journey into the world of neural
    network's, and to up your buzzword game in today's world of AI obsession,
    the most popular architectures are listed and briefly explained below.
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
      next, remembering previous information (the <i>recurrence</i> in the namesake).
    </p>
  </div>
  <br />
  <!-- <hr class="splitter" /> -->
  <div>
    <p class="body-text">
      <span class="bold">Convolutional Neural Networks (CNNs):</span>

      Convolutional Neural Networks (CNNs) are specifically designed for
      processing spatial data, such as images. Unlike feed-forward networks,
      CNNs use special convolutional layers to scan and identify local patterns
      within the input. Imagine a grid sliding across an image, identifying
      patterns. This makes them more efficient for image recognition, object
      detection, and other computer vision tasks, where spatial information is
      crucial. They are also used for sequential tasks, such as time-series
      applications.
    </p>
  </div>
  <br />
  <!-- <hr class="splitter" /> -->
  <div>
    <p class="body-text">
      <span class="bold">Generative Adversarial Networks (GANs):</span>
      Generative Adversarial Networks (GANs) consist of two distinct neural networks,
      a generator and a discriminator, that compete against each other. The generator
      tries to create a data sample, and the discriminator tries to determine if
      that data sample came from the training data or the generator. By optimizing
      against each other, GANs learn to generate new data samples by capturing the
      distribution of the training data. They are widely used for tasks such as image
      synthesis, style transfer, and data augmentation.
    </p>
  </div>
  <br />
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
  <br />
  <div>
    <p class="body-text">
      <span class="bold">Transformer Architectures:</span>

      Transformer architectures differ from feed-forward networks as they rely
      on a self-attention mechanism to process input data, allowing them to
      handle long-range dependencies more effectively. These models are massive,
      and actually incorporate feed forward neural networks in parts of their
      architecture. They have been especially successful in natural language
      processing tasks, such as machine translation and text summarization, due
      to their ability to capture contextual information across large sequences.
      Most of the currently hyped AI models, such as the GPT family, are
      variants of transformers.
    </p>
  </div>
  <br />

  <p class="body-text">
    This is not an exhaustive list of network architectures. Rather, these are
    high-level architectures with many variants - more are developed every day!
    But it's a great starting point to send you forward on your journey into
    neural networks and deep learning.
  </p>
</section>

<style>
  section {
    padding-top: 5rem;
    max-width: var(--max-width);
    margin: auto;
  }
</style>
