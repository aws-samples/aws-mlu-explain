<script>
  import katexify from "../katexify";
</script>

<h1 class="body-header">Regression Model Assumptions</h1>
<p class="body-text">
  When teaching regression models, it's common to mention the various
  assumptions underpinning linear regression. For completion, we'll list some of
  those assumptions here. However, in the context of machine learning we care
  most about if the predictions made from our model generalize well to unseen
  data. We'll use our model if it generalizes well even if it violates
  statistical assumptions. Still, no treatment of regression is complete without
  mentioning the assumptions.
  <br />
  <br />
  <span class="bold"><span class="dot" /> Validity: </span>
  Does the data we're modeling matches to the problem we're actually trying to solve?

  <br />
  <span class="bold"> <span class="dot" /> Representativeness: </span>
  Is the sample data used to train the regression model representative of the population
  to which it will be applied?

  <br />
  <span class="bold"> <span class="dot" /> Additivity and Linearity: </span>
  The deterministic component of a regression model is a linear function of the separate
  predictors: {@html katexify(`y=B_0 + B_1x_1  + ... + B_px_p `, false)}.

  <br />
  <span class="bold"><span class="dot" /> Independence of Errors: </span>
  The errors from our model are independent.
  <br />
  <span class="bold"><span class="dot" /> Homoscedasticity: </span>
  The errors from our model have equal variance.
  <br />
  <span class="bold"><span class="dot" /> Normality of Errors: </span>
  The errors from our model are normally distributed.
</p>

<br />
<p class="body-text">
  <span class="bold">When Assumptions Fail?</span>
  <br />
  What should we do if the assumptions for our regression model aren't met? Don't
  fret, it's not the end of the world! First, double-check that the assumptions even
  matter in the first place. One can extend the model. One can change the data or
  model so the assumptions are more reasonable. And Finally, one can change or restrict
  the questions to align them closer to the data, making conclusions that are more
  descriptive and less causal or extrapololative, defining the sample to match the
  sample, or predicting averages rather than individual cases. In practice, one usually
  employs some combination of all three choices: applying some mix of model expansion,
  data processing, and care in extrapolation beyond the data.
</p>

<style>
  .dot {
    height: calc(0.6 * var(--size-default));
    width: calc(0.6 * var(--size-default));
    background-color: var(--primary);
    border-radius: 50%;
    padding: 5px 0px;
    display: inline-block;
  }
</style>
