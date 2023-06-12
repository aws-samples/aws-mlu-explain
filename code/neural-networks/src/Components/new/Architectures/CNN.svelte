<section>
  <h2>Convolutional Neural Networks (CNN's)</h2>
  <div class="wrapper">
    <div class="left">
      <svg><!-- Insert SVG here --></svg>
    </div>
    <div class="right">
      <p class="body-text">
        Convolutional Neural Networks (CNNs) are a type of neural network
        architecture that has been particularly successful in computer vision
        tasks. The key difference between CNNs and traditional feedforward
        neural networks is the presence of convolutional layers, which are
        specialized layers designed to process images and other types of
        multidimensional data. In a CNN, the convolutional layers learn to
        detect and extract features from the input data by sliding a set of
        filters over the input data and performing convolution operations. The
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
