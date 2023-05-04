<script>
  import katexify from "../../katexify";
  import { tooltip } from "../../tooltip";
</script>

<section>
  <!-- <h1 id="intro-hed">Backpropagation</h1> -->

  <h1 class="body-header">Backpropagation: How Networks Learn</h1>
  <hr />
  <p class="body-text">
    We know how Neural Networks work, but how do they learn the correct weight?
    Backpropagation is an important method that helps neural networks learn to
    make better predictions. below, we will explore how backpropagation works by
    looking at a simple example regression example. By focusing on this example,
    you will learn how backpropagation helps a network adjust its inner parts
    called weights and biases to improve its predictions. This will give you a
    better understanding of how backpropagation plays a key role in a network's
    ability to learn from information.
  </p>
  <br />
  <br />
</section>

<style>
  section {
    padding-top: 5rem;
    padding-left: 1rem;
    background-color: var(--darksquidink);
    color: var(--white);
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
