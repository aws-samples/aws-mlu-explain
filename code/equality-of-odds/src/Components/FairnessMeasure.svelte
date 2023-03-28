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
    Note that as you drag the slider, you might find some so-called lazy solutions where
    everyone gets rejected or accepted. Those solutions technically meet
    fairness criteria but make no sense from a business perspective.
  </p>
</section>

<style>
  #charts-container {
    display: grid;
    margin: auto;
    height: 45vh;
    width: 70%;
    grid-template-columns: 50% 50%;
    grid-gap: 2%;
    max-width: 1000px;
  }
  #scatter-container {
    max-height: 45vh;
  }
  #barchart-container {
    border: var(--sky);
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
