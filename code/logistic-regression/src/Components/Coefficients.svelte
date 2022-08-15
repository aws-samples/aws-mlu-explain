<script>
  import katexify from "../katexify";
  import GradientDescent from "./GradientDescent.svelte";

  const log_likelihood =
    "\\textrm{Log-Likelihood} = \\sum_{i=0}^n (y_i * \\textrm{log}(p_i) + (1-y_i)*\\textrm{log}(1-p_i))";
</script>

<section>
  <h1 class="body-header">Estimating Coefficients</h1>

  <p class="body-text">
    How do we find the coefficients ({@html katexify(
      "\\hat{\\beta_0}, \\hat{\\beta_1}, ..., \\hat{\\beta_k}"
    )}) that minimize the loss function? There are two main approaches for
    logistic regression: gradient descent and maximum likelihood estimation.
    We’ll briefly discuss both here.
  </p>
  <h2 class="body-secondary-header">Gradient Descent</h2>
  <p class="body-text">
    A common way to estimate coefficients is to use gradient descent. In
    gradient descent, the goal is to minimize the Log-Loss cost function over
    all samples. This method involves selecting initial parameter values, and
    then updating them incrementally by moving them in the direction that
    decreases the loss. At each iteration, the parameter value is updated by the
    gradient, scaled by the step size (otherwise known as the learning rate).
    The gradient is the vector encompassing the direction and rate of the
    fastest increase of a function, which can be calculated using partial derivatives.
    The parameters are updated in the opposite direction of the gradient by the
    step size in an attempt to find the parameter values that minimize the
    Log-Loss.
  </p>

  <GradientDescent />

  <h2 class="body-secondary-header">Maximum Likelihood Estimation</h2>
  <p class="body-text">
    Another approach is finding the model that maximizes the likelihood of
    observing the data by using Maximum Likelihood Estimation (MLE). It turns
    out, minimizing the Log-Loss is equivalent to maximizing the Log-Likelihood.
    Therefore, the goal is to find the parameter values that maximize the
    following:
    {@html katexify(log_likelihood, true)}
    We can do so by differentiating the Log-Likelihood with respect to the parameters,
    setting the derivatives equal to 0, and solving the equation to find the estimates
    of the parameters.
  </p>
</section>

<style>
  @media screen and (max-width: 950px) {
    .body-secondary-header {
      max-width: 80%;
    }
  }
</style>
