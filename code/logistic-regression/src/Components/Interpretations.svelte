<script>
  // "katexify" function
  import katexify from "../katexify";
  import TabBinary from "./TabBinary.svelte";
  import TabContinuous from "./TabContinuous.svelte";
  import TabMultivariate from "./TabMultivariate.svelte";
  import Tabs from "./Tabs.svelte";
  let items = [
    { label: "A Binary Feature", value: 1, component: TabBinary },
    { label: "A Continuous Feature", value: 2, component: TabContinuous },
    { label: "Multivariate Regression", value: 3, component: TabMultivariate },
  ];
</script>

<section>
  <h1 class="body-header">Interpreting Logistic Regression Models</h1>

  <p class="body-text">
    Interpreting the coefficients of a logistic regression model can be tricky
    because the coefficients in a logistic regression are on the log-odds scale.
    This means the interpretations are different than in linear regression.
  </p>
  <br /><br />
  <p class="body-text">
    To understand log-odds, we must first understand odds. Odds are calculated
    as {@html katexify("\\frac{p}{1-p}")}. This gives the ratio of the probability of a rainless day to
    that of a rainy day. Say that the probability of a rainless day is 0.75.
    This implies that the probability of a rainy day is 0.25. The odds would
    then be {@html katexify("\\frac{0.75}{0.25} = 3")}, which means that the odds of a rainless day are 3 to
    1. If the probability of rain is 0.5, then the odds would be {@html katexify("\\frac{0.5}{0.5} = 1")},
    meaning that the odds of a rainless day are 1 to 1, so rain and no rain are
    equally likely. Taking the log of the odds yield the log-odds, and taking
    ratios of log-odds yields log-odds ratios.
  </p>
  <br /><br />
  <p class="body-text">
    Now that we understand log-odds a bit more, we can discuss how to interpret
    the models. Since the coefficients are on the log-odds scale, we can
    transform them to the odds scale by exponentiating so that they are easier
    to interpret.
  </p>
  <br /><br />

</section>

<!-- <h1 class="body-header">Interpreting Regression Models</h1>
<p class="body-text">
  One of the most powerful aspects of regression models is their
  interpretability. However, different forms of regression models require
  different levels of interpretation. To make this clear, we’ll walk through
  several forms of our model, and describe how to interpret each in turn. For
  all aforementioned models, we interpret the error term as irreducible noise
  not captured by our model.<br /><br /> Select a tab to learn how to interpret
  the given form of regression model:<br /><br />
</p> -->

<Tabs {items} />
<br /><br />
<p class="body-text">
  As with linear regression, there are many other forms of logistic regression models. 
</p>

<style>
</style>
