<section>
  <h2>Generative Adversarial Networks (GANS's)</h2>
  <div class="wrapper">
    <div class="left">
      <svg><!-- Insert SVG here --></svg>
    </div>
    <div class="right">
      <p class="body-text">
        Generative Adversarial Networks (GANs) are a type of neural network
        architecture that is used for generative modeling. GANs consist of two
        networks: a generator network and a discriminator network. The generator
        network learns to generate samples that resemble the training data,
        while the discriminator network learns to distinguish between real and
        fake samples. The two networks are trained simultaneously, with the
        generator network trying to produce samples that fool the discriminator
        network, and the discriminator network trying to accurately distinguish
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
