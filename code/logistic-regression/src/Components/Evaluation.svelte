<script>
  import katexify from "../katexify";

  const log_loss =
    "\\textrm{Log-Loss} = \\sum_{i=0}^n - (y_i * \\textrm{log}(p_i) + (1-y_i)*\\textrm{log}(1-p_i))";
</script>

<section>
  <h1 class="body-header">Evaluating Our Model</h1>

  <p class="body-text">
    When fitting our model, the goal is to find the parameters that optimize a
    function that defines how well the model is performing. Put simply, the goal
    is to make predictions as close to 1 when the outcome is 1 and as close to 0
    when the outcome is 0. In machine learning, the function to be optimized is
    called the loss function or cost function. We use the loss function to
    determine how well our model fits the data.
  </p>
  <br /><br />
  <p class="body-text">
    A suitable loss function in logistic regression is called the Log Loss, or
    binary cross-entropy. This function is as follows, where {@html katexify(
      "n"
    )} is the number of samples,
    {@html katexify("i")} is the index, {@html katexify("y_i")} is the true class
    for the index {@html katexify("i")}, and {@html katexify("p_i")} is the model
    prediction for the index {@html katexify("i")}.

    {@html katexify(log_loss, true)}
  </p>
  <p class="body-text">
    Minimizing the Log-Loss is equivalent to maximizing the Log-Likelihood,
    since the Log-Loss is the negative of the Log-Likelihood.
  </p>
</section>

<style>
</style>
