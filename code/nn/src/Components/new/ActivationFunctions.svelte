<script>
  import Table from "../Table.svelte";
  import katexify from "../../katexify";
  import { tooltip } from "../../tooltip";
</script>

<section>
  <br />
  <h1 class="body-header">Activation Functions</h1>
  <hr />
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
</style>
