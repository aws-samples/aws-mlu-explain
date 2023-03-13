<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
</script>

<p class="body-text">
  <span class="definition-header">False Negative Error Rate Balance</span>
</p>
<br />
<p class="body-text">
  The second fairness measure we can derive from EO looks at the FNR per group
  and takes the difference: 
  {@html katexify(`FNR_{sheep} - FNR_{lama}`, true)}
  The resulting value will be in
  the range [-1, 1], the closer to 0 the closer to equal opportunity the groups
  are.
</p>

<style>
  .definition-header {
    font-family: var(--font-bold);
  }

  @media screen and (max-width: 950px) {
    .definition-header {
      font-size: 0.8rem;
    }
  }
</style>
