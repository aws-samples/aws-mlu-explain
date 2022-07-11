<script>
  // "katexify" function
  import katexify from "../katexify";
  import Tab_Binary from "./Tab_Binary.svelte";
  import Tab_Continuous from "./Tab_Continuous.svelte";
  import Tab_Multivariate from "./Tab_Multivariate.svelte";
  import Tab_Interaction from "./Tab_Interaction.svelte";
  import Tabs from "./Tabs.svelte";

  let items = [
    { label: "A Binary Feature", value: 1, component: Tab_Binary },
    { label: "A Continuous Feature", value: 2, component: Tab_Continuous },
    { label: "Multivariate Regression", value: 3, component: Tab_Multivariate },
    {
      label: "Regression with Interaction",
      value: 4,
      component: Tab_Interaction,
    },
  ];
</script>

<h1 class="body-header">Interpreting Regression Models</h1>
<p class="body-text">
  One of the most powerful aspects of regression models is their
  interpretability. However, different forms of regression models require
  different levels of interpretation. To make this clear, we’ll walk through
  several forms of our model, and describe how to interpret each in turn. For
  all aforementioned models, we interpret the error term as irreducible noise
  not captured by our model.<br /><br /> Select a tab to learn how to interpret
  the given form of regression model:<br /><br />
</p>
<Tabs {items} />
<br /><br />
<p class="body-text">
  This is not an exhaustive list of regression models - many other forms exist!
</p>

<style>
</style>
