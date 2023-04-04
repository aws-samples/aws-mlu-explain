<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
</script>

<p class="body-text">
  <span class="definition-header"
    >Threshold Optimization during Post-Processing</span
  >
</p>
<br />
<p class="body-text">
  To implement EO on a trained model, we can find probability thresholds for
  both groups,<svg height="16" width="16">
    <circle cx="8" cy="10" r="4" stroke="var(--group_circles)" stroke-width="3" fill="var(--group_circles)" />
  </svg>
  and
  <svg height="12" width="12">
    <polygon points="6,0 0,12 12,12" style="fill:var(--group_triangles);stroke-width:1" />
    Sorry, your browser does not support inline SVG.
  </svg>.
  <br />
  <br />
  The probability thresholds ultimately determine which outcome class the model will
  produce. The parameters of the model remain unchanged in this case.
  <br />
  <br />
  To find the thresholds that meets the EO criterion, we try many different probability
  threshold values (per group) and keep track of what the given FNR and FPR values
  are.
  <br /><br />
  Check out the visualization below for additional details about the ROC curve and
  threshold optimization.
</p>

<style>
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
