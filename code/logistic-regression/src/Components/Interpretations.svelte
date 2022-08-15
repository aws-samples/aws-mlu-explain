<script>
  // "katexify" function
  import katexify from "../katexify";
  import TabBinary from "./TabBinary.svelte";
  import TabContinuous from "./TabContinuous.svelte";
  import TabMultivariate from "./TabMultivariate.svelte";
  import Tabs from "./Tabs.svelte";
  import { mobile } from "../data-store";
  $: items = [
    {
      label: $mobile ? "Binary" : "A Binary Feature",
      value: 1,
      component: TabBinary,
    },
    {
      label: $mobile ? "Continuous" : "A Continuous Feature",
      value: 2,
      component: TabContinuous,
    },
    {
      label: $mobile ? "Multivariate" : "Multivariate Regression",
      value: 3,
      component: TabMultivariate,
    },
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
    as {@html katexify("\\frac{p}{1-p}")}. This gives the ratio of the
    probability of a sunny day to that of a rainy day. Say that the probability
    of a sunny day is 0.75. This implies that the probability of a rainy day is
    0.25. The odds would then be {@html katexify("\\frac{0.75}{0.25} = 3")},
    which means that the odds of a sunny day are 3 to 1. If the probability of
    rain is 0.5, then the odds would be {@html katexify(
      "\\frac{0.5}{0.5} = 1"
    )}, meaning that the odds of a sunny day are 1 to 1, so sun and rain are
    equally likely. Taking the log of the odds yields the log-odds, and taking
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

<Tabs {items} />

<style>
</style>
