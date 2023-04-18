<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
  import ROC from "./charts/ROC.svelte";
  import Tab_Constraints from "./Tab_Constraints.svelte";
  import Tab_Postprocessing from "./Tab_Postprocessing.svelte";
  import Tabs from "./Tabs.svelte";
  import { mobile } from "../store";

  $: items = [
    {
      label: $mobile ? "Training" : "Constrained Optimization during Training",
      value: 1,
      component: Tab_Constraints,
    },
    {
      label: $mobile ? "Post-Processing" : "Post-Processing to achieve EO",
      value: 2,
      component: Tab_Postprocessing,
    },
  ];
</script>

<section>
  <p class="body-header">Equalized Odds to achieve fairness</p>
  <p class="body-text">
    Using EO, we can also influence the predictions a model makes to achieve a
    more fair outcome. We are going to look at two different ways of performing
    this: by constraining the model during training and by introducing
    group-wise probability thresholds for a trained model.
  </p>
  <br />
  <Tabs {items} />
  <br />
  <p class="body-text">
    To visualize the search for the probability thresholds that meets EO, we can
    look at the so-called <a href="https://mlu-explain.github.io/roc-auc/"
      >ROC curves</a
    >
    for both groups,<svg height="16" width="16">
      <circle
        cx="8"
        cy="10"
        r="4"
        stroke="var(--group_circles)"
        stroke-width="3"
        fill="var(--group_circles)"
      />
    </svg>
    and
    <svg height="12" width="12">
      <polygon
        points="6,0 0,12 12,12"
        style="fill:var(--group_triangles);stroke-width:1"
      />
      Sorry, your browser does not support inline SVG.
    </svg>. We can see that for most probability thresholds the TPR and FPR
    values are different per group. For the dataset shown below, there is only
    one point where TPR and FPR are equal for both groups (and not lazy solutions); this is where the EO
    criterion is satisfied.
  </p>
  <br />
  <div id="roc-container">
    <ROC />
  </div>
</section>

<style>
  #roc-container {
    margin: auto;
    height: 55vh;
    width: 55%;
    max-width: 1000px;
  }

  /* mobile */
  @media screen and (max-width: 1000px) {
    #roc-container {
      height: 70vh;
      width: 100%;
      max-width: 1000px;
    }
  }
</style>
