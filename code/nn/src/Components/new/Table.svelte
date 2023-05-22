<script>
  import katexify from "../../katexify";
  import ReLu from "./Activations/ReLu.svelte";
  import Sigmoid from "./Activations/Sigmoid.svelte";
  import Step from "./Activations/Step.svelte";
  import Tanh from "./Activations/Tanh.svelte";
</script>

<table class="table-container">
  <tr>
    <th class="table-head">Name</th>
    <th class="table-head">Plot</th>
    <th class="table-head">Function</th>
    <th class="table-head">Description</th>
  </tr>
  <tr>
    <td>Logistic (sigmoid)</td>
    <td><Sigmoid /></td>
    <td
      >{@html katexify(
        `\\begin{aligned} f(x) = \\frac{1}{1 + e^{-x}} \\end{aligned}`,
        false
      )}</td
    >
    <td>Squashes input to (0, 1).</td>
  </tr>
  <tr>
    <td>Hyperbolic Tangent (tanh)</td>
    <td><Tanh /></td>

    <td
      >{@html katexify(
        `\\begin{aligned} f(x) = \\frac{e^{x} - e^{-x}}{e^{x} + e^{-x}} \\end{aligned}`,
        false
      )}</td
    >
    <td>Squashes input to (-1, 1).</td>
  </tr>
  <tr>
    <td>Rectified Linear Unit (ReLu)</td>
    <td><ReLu /></td>

    <td
      >{@html katexify(
        `f(x) = \\begin{cases}
         0, \\text{if } x < 0  \\\\
         1, \\text{if } x \\geq 0
        \\end{cases}`,
        false
      )}</td
    >
    <td>Only keep positive values.</td>
  </tr>

  <tr />
</table>

<style>
  .table-container {
    overflow-x: auto;
  }

  table {
    border-collapse: collapse;
    margin: auto;
    font-size: var(--size-default);
    font-family: var(--font-light);
    max-width: var(--max-width);
    white-space: nowrap;
  }

  td,
  th {
    border: 3px solid #dddddd;
    text-align: left;
    padding: 4px;
    color: var(--squid-ink);
  }

  td {
    vertical-align: middle;
  }

  .table-head {
    font-family: var(--font-heavy);
    color: var(--squid-ink);
    border: none;
  }

  @media screen and (max-width: 950px) {
    .table-container {
      max-width: 100%;
    }

    table {
      font-size: 0.55em;
      max-width: 100%;
    }

    .table-head {
      font-size: 0.65em;
    }

    td,
    th {
      padding: 4px;
    }
  }
</style>
