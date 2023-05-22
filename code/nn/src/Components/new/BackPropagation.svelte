<script>
  import katexify from "../../katexify";
  import { tooltip } from "../../tooltip";
</script>

<section>
  <!-- <h1 id="intro-hed">Backpropagation</h1> -->

  <h1 class="body-header">Backpropagation: How Networks Learn</h1>
  <hr />
  <p class="body-text">
    Now that we've grasped the concept of activation functions and their role in
    neural networks, it's time to understand how these networks learn. The magic
    behind this learning process is a technique known as backpropagation.
    <br /><br />
    Backpropagation is an algorithm used during the training of neural networks.
    <span class="bold"
      >The goal of backpropagation is to update the weights so that the Neural
      Network makes better predictions.</span
    >
    Specifically, it calculates the gradient of the loss function with respect to
    the weights of the network, updating the weights to minimize the network's prediction
    error.
    <br /><br />
    To make the process as clear as possible, let's visualize it step-by-step.
    <br /><br />
  </p>
  <br />
  <br />
</section>

<style>
  section {
    padding-top: 5rem;
    padding-left: 1rem;
    /* background-color: var(--darksquidink); */
    color: var(--white);
    background: radial-gradient(
      ellipse at center,
      var(--darksquidink) 60%,
      var(--squidink) 100%
    );
  }

  .body-text,
  .body-header {
    color: var(--paper);
  }

  hr {
    width: var(--max-width);
    border: 1px solid var(--stone);
    opacity: 0.6;
  }
</style>
