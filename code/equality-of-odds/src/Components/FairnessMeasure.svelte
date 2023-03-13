<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
  import Scatter1 from "./charts/Scatter1.svelte";
  import StackedBar from "./charts/StackedBar.svelte";
  import Tab_FPRBalance from "./Tab_FPRBalance.svelte";
  import Tab_FNRBalance from "./Tab_FNRBalance.svelte";
  import Tab_ConditionalAccuracyEquality from "./Tab_ConditionalAccuracyEquality.svelte";
  import Tabs from "./Tabs.svelte";
  import { mobile } from "../store";

  $: items = [
    {
      label: $mobile 
        ? "FPR" 
        : "False Positive Error Rate Balance",
      value: 1,
      component: Tab_FPRBalance,
    },
    {
      label: $mobile
        ? "FNR"
        : "False Negative Error Rate Balance",
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
    Using the EO equation, we can derive several different metrics now that can
    be used to measure how fair a model is. For example, we can look at:
  </p>
  <br />
  <Tabs {items} />
  <br />
  <p class="body-text">
    See if you can drag the slider in the interactive below to re-create the metrics above.
  </p>
  <br /><br />
  <div id="charts1-container">
    <div id="scatter1-container">
      <Scatter1 />
    </div>
    <div id="output1-container">
      <StackedBar />
    </div>
  </div>
</section>

<style>
  #charts1-container {
    display: grid;
    margin: auto;
    height: 45vh;
    width: 70%;
    grid-template-columns: 50% 50%;
    grid-gap: 2%;
    max-width: 1000px;
  }
  #scatter1-container {
    max-height: 45vh;
  }
  #output1-container {
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
