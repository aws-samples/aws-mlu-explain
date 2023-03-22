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
    Secondly, we can use EO to actually change the predictions a model makes to
    meet the probability equation we reviewed earlier.
  </p>
  <br />
  <Tabs {items} />
  <br />
  <p class="body-text">
    How can we visualize this search for the ideal combination of TPR and FPR?
    Very simply, we can plot the so-called ROC curves (have a look at ROC
    article here) for both groups, circles and triangles.
  </p>
  <br />
  <div id="roc-container">
    <ROC />
  </div>
</section>

<style>
  #roc-container {
    margin: auto;
    height: 60vh;
    width: 45%;
    max-width: 1000px;
  }
  #scatter2-container {
    max-height: 45vh;
  }

  ul {
    max-width: 600px;
    margin: auto;
    color: var(--squid-ink);
    padding-top: 0.5rem;
  }
  li {
    padding: 0.25rem;
    list-style: none;
    color: var(--squid-ink);
  }
  /* mobile */
  @media screen and (max-width: 950px) {
    ul {
      max-width: 80%;
    }
    li {
      padding: 0.25rem 0;
    }
  }
</style>
