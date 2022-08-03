<script>
  // "katexify" function
  import katexify from "../katexify";
  import Assumption_Linearity from "./Assumption_Linearity.svelte";
  import Assumption_Homoscedasticity from "./Assumption_Homoscedasticity.svelte";
  import Assumption_Independence from "./Assumption_Independence.svelte";
  import Assumption_Normality from "./Assumption_Normality.svelte";
  import Tabs from "./Tabs.svelte";

  let items = [
    {
      label: "Linearity/Additivity",
      value: 1,
      component: Assumption_Linearity,
    },
    {
      label: "Homoscedasticity",
      value: 2,
      component: Assumption_Homoscedasticity,
    },
    {
      label: "Error Independence",
      value: 3,
      component: Assumption_Independence,
    },
    { label: "Error Normality", value: 4, component: Assumption_Normality },
  ];
</script>

<h1 class="body-header">Regression Model Assumptions</h1>
<p class="body-text">
  Regression models are built upon a few different assumptions and ideas. Below
  we'll list four of the main assumptions of the model alongside possible
  diagnostic plots. It's worth mentioning that, while careful attention should
  be spent on whether or not the assumptions apply to your particular
  application, not all important aspects of the modeling process can be achieved
  by looking at a checklist of assumptions, and even where regression makes
  sense, it's not always a great choice.
</p>
<Tabs {items} />
<br /><br />
<p class="body-text">
  <span class="bold">When Assumptions Fail?</span>
  <br />
  What should we do if the assumptions for our regression model aren't met? Don't
  fret, it's not the end of the world! One can extend the model. One can change the
  data or model so the assumptions are more reasonable. And Finally, one can change
  or restrict the questions to align them closer to the data, making conclusions
  that are more descriptive and less causal or extrapololative, defining the sample
  to match the sample, or predicting averages rather than individual cases. In practice,
  one usually employs some combination of all three choices: applying some mix of
  model expansion, data processing, and care in extrapolation beyond the data.
</p>

<style>
  /* sample css to style reactivity button */
  .button-div {
    display: flex;
    justify-content: center;
  }
  button {
    font-family: "Amazon Ember Mono";
    border: 3px solid black;
    padding: 5px 10px;
  }
</style>
