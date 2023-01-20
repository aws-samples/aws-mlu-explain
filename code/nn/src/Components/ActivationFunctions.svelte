<script>
  import Table from "./Table.svelte";
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
</script>

<section>
  <hr />
  <h1>Activation Functions</h1>
  <p class="body-text">
    Activation functions are used in neural networks to introduce non-linearity
    in the model. They are applied to the output of a neuron to determine the
    neuron's output. Common activation functions include the hyperbolic tangent
    (tanh), rectified linear unit (ReLu) and sigmoid functions.
    <br /><br />
  </p>
  <Table />
  <br /><br />
  <p class="body-text">
    Activation functions are used in neural networks to introduce non-linearity
    in the model. They are applied to the output of a neuron to determine the
    neuron's output. Common activation functions include the hyperbolic tangent
    (tanh), rectified linear unit (ReLu) and sigmoid functions.
    <br /><br />
  </p>
</section>

<style>
  section {
    max-width: 80%;
    margin: auto;
  }
  h1 {
    max-width: 600px;
    margin: auto;
    font-size: 2.6rem;
    margin-bottom: 2rem;
    background-color: var(--squidink);
    color: white;
    font-family: var(--font-mono);
  }
</style>
