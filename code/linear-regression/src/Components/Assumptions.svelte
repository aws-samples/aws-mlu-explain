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
  matter in the first place: if the predictions made from our model generalize well
  to unseen data, and our task is to create a model that generalizes well, then we're
  probably fine. If not, figure out which assumption is being violated, and how to
  address it! This will change depending on the assumption being violated, but in
  general, one can attempt to extend the model, accompany new data, transform the
  existing data, or some combination thereof. If a model transformation is unfit,
  perhaps the application (or research question) can be changed or restricted to
  better align with the data. In practice, some combination of the above will usually
  suffice.
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
