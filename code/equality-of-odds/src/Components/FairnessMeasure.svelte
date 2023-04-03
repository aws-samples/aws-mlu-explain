<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
  import Scatter from "./charts/Scatter.svelte";
  import StackedBar from "./charts/StackedBar.svelte";
  import Tab_FPRBalance from "./Tab_FPRBalance.svelte";
  import Tab_FNRBalance from "./Tab_FNRBalance.svelte";
  import Tab_ConditionalAccuracyEquality from "./Tab_ConditionalAccuracyEquality.svelte";
  import Tabs from "./Tabs.svelte";
  import { mobile } from "../store";

  $: items = [
    {
      label: $mobile ? "FPR" : "False Positive Error Rate Balance",
      value: 1,
      component: Tab_FPRBalance,
    },
    {
      label: $mobile ? "FNR" : "False Negative Error Rate Balance",
      value: 2,
      component: Tab_FNRBalance,
    },
    {
      label: $mobile
        ? "Conditional Procedure Accuracy"
        : "Conditional Procedure Accuracy Equality",
      value: 3,
      component: Tab_ConditionalAccuracyEquality,
    },
  ];
</script>

<section>
  <p class="body-header">Equalized Odds to measure fairness</p>
  <p class="body-text">
    Using the EO equation, we can derive several different metrics to measure
    the fairness of a model. For example, we can look at:
  </p>
  <br />
  <Tabs {items} />
  <br />
  <p class="body-text">
    Have a look at the beeswarm plot and stacked bar chart to understand the
    relationship between different probability thresholds and the resulting
    predictions for two groups,
    <svg height="16" width="16">
      <circle
        cx="8"
        cy="10"
        r="4"
        stroke="black"
        stroke-width="3"
        fill="black"
      />
    </svg>
    and
    <svg height="12" width="12">
      <polygon points="6,0 0,12 12,12" style="fill:black;stroke-width:1" />
      Sorry, your browser does not support inline SVG.
    </svg> as well as the ground truth distribution.
  </p>
  <div id="charts-container">
    <div id="scatter-container">
      <Scatter />
    </div>
    <div id="barchart-container">
      <StackedBar />
    </div>
  </div>
  <br /><br />
  <p class="body-text">
    Note that as you drag the slider, you might find some so-called lazy
    solutions where everyone gets rejected or accepted. Those solutions
    technically meet the EO fairness criterion but make no sense from a business
    perspective.
  </p>
</section>

<style>
  #charts-container {
    display: grid;
    margin: auto;
    height: 48vh;
    width: 80%;
    grid-template-columns: 55% 45%;
    grid-gap: 0%;
    max-width: 1000px;
  }
  #scatter-container {
    max-height: 48vh;
  }
  #barchart-container {
    border: var(--sky);
    max-height: 48vh;
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
  @media screen and (max-width: 1050px) {
    #charts-container {
      height: 100vh;
      width: 80%;
      grid-template-columns: 100%;
      grid-template-rows: 50% 50%;
    }
    ul {
      max-width: 80%;
    }
    li {
      padding: 0.25rem 0;
    }
  }

  @media screen and (max-width: 850px) {
    #charts-container {
      width: 100%;
    }
  }
</style>
