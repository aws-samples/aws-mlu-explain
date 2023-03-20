<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
  import { rectPos } from "../store";

  console.log("rectois", $rectPos);
</script>

<p class="body-text">
  <span class="definition-header">False Negative Error Rate Balance</span>
</p>
<br />
<p class="body-text">
  The second fairness measure we can derive from EO looks at the False Negative
  Rate per group and takes the difference; this measure is also called equal
  opportunity:
  {@html katexify(`FNR_{circles} - FNR_{triangles}`, true)}
  The resulting value will be in the range [-1, 1], the closer to 0 the closer to
  equal opportunity the groups are. FNR calculates the probability that a true positive
  will be missclassified; in our example this refers to students that should have
  received a grant but missed out on receiving one.
</p>

<div class="button-container">
  <button on:click={() => ($rectPos = 130)}>Move Boundary To 0.30</button>
</div>

<style>
  button {
    background-color: var(--bg);
    border: none;
    color: var(--squidink);
    padding: 12px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: var(--size-default);
    margin: 4px 2px;
    cursor: pointer;
    outline: 2px solid var(--squidink);
  }
  button:hover {
    color: var(--bg);
    background-color: var(--squidink);
  }

  .button-container {
    max-width: var(--max-width);
    display: flex;
    margin: 1rem auto;
    justify-content: center;
  }

  .definition-header {
    font-size: 0.85rem;
    font-family: var(--font-bold);
    text-decoration: underline;
  }

  @media screen and (max-width: 950px) {
    .definition-header {
      font-size: 0.8rem;
    }
  }
</style>
