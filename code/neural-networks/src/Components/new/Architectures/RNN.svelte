<section>
  <h2>Recurrent Neural Networks (RNN's)</h2>
  <div class="wrapper">
    <div class="left">
      <svg><!-- Insert SVG here --></svg>
    </div>
    <div class="right">
      <p class="body-text">
        Recurrent Neural Networks (RNNs) are a type of neural network
        architecture that is particularly well-suited for processing sequential
        data, such as speech or text. The key difference between RNNs and
        traditional feedforward neural networks is the presence of recurrent
        connections, which allow information to persist over time within the
        network. In an RNN, each neuron receives an input as well as a hidden
        state from the previous time step, which allows the network to use
      </p>
    </div>
  </div>
</section>

<style>
  h2 {
    font-size: var(--size-default);
    text-decoration: underline;
  }
  .wrapper {
    display: grid;
    grid-template-columns: 30% 70%;
    grid-gap: 1rem;
    align-items: center;
    max-width: 100%;
    margin: auto;
  }
  .left {
    display: flex;
    justify-content: center;
  }
  .right {
    /* border: 2px solid black; */
  }
  svg {
    max-width: 100%;
    max-height: 100%;
    border: 2px solid red;
  }
</style>
