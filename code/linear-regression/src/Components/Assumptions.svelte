<script>
  import { tooltip } from "../tooltip";
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
  Does the data we're modeling matches to the problem we're actually trying to solve?<span
    class="info-tooltip"
    title="The outcome measure should accurately reflect the phenomenon of interest, the
    model should include all relevant predictors, and the model should generalize to
    the cases to which it will applied. Do the inputs reveal patterns in the outcome that make sense? Is the
    underlying sample representative of that during inference"
    use:tooltip
  >
    [&#8505;]
  </span>

  <br />
  <span class="bold"> <span class="dot" /> Representativeness: </span>
  Is the sample data used to train the regression model representative of the population
  to which it will be applied?
  <span
    class="info-tooltip"
    title="Precisely: is the data representative of the distribution of the outcome, y,
    given the predictors in the model, xi?
  Selection on x does not interfere with inference from the regression
    model, but selection on y does. (For this reason, more predictors are
    preferred in a regression model, to allow for a reasonable assumption of
    representativeness, conditional on X). Whenever we wish to generalize our
    regression model (e.g. most use-cases in machine learning), ides of
    statistical sampling arise, so we need to think about how representative the
    sample is to the implicit/explicit popoulation about which inferences will be
    drawn."
    use:tooltip
  >
    [&#8505;]
  </span>

  <br />
  <span class="bold"> <span class="dot" /> Additivity and Linearity: </span>
  The deterministic component of a regression model is a linear function of the separate
  predictors: {@html katexify(`y=B_0 + B_1x_1  + ... + B_px_p `, false)}
  <span
    class="info-tooltip"
    title="Note that this does not mean our model must create a straight line: we
    can still include nonlinearities in our model via transformations or more
    complex models (e.g. piecewise linear splines). it can draw an Transformations
    may be applied to make this so: e.g. is y=abc, log(y) = log(a) + log(b) +
    log(c)"
    use:tooltip
  >
    [&#8505;]
  </span>

  <br />
  <span class="bold"><span class="dot" /> Independence of Errors: </span>
  The errors from our model are independent.
  <span
    class="info-tooltip"
    title="In other words, we shouldn't see any pattern
    in the residuals about our prediction line. Note that this assumption is violated in many machine learning tasks,
    most notably time series."
    use:tooltip
  >
    [&#8505;]
  </span>
  <br />
  <span class="bold"><span class="dot" /> Homoscedasticity: </span>
  The errors from our model have equal variance.
  <span
    class="info-tooltip"
    title="can make it difficult to gauge the true standard deviation of the
    errors, which may yield confidence intervals that are too wide or too narrow.
    It may also have the effect of giving higher weight to the subset of data that
    has the larger error variance when estimating coefficients. Unequal error
    variance heteroscedasticity is a minor issue for most modeling
    tasks (an exception being probabilistic )"
    use:tooltip
  >
    [&#8505;]
  </span>
  <br />
  <span class="bold"><span class="dot" /> Normality of Errors: </span>
  The errors from our model are normally distributed.
  <span
    class="info-tooltip"
    title="Note that his assumption doesn't
  mean that our features xi be normally distributed, nor our response y, just the
  regression errors."
    use:tooltip
  >
    [&#8505;]
  </span>
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
