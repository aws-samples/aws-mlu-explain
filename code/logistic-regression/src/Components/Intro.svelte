<script>
  import katexify from "../katexify";

  const sigmoid =
    "\\begin{aligned} P(y=1|X) = \\text{sigmoid}(z) = \\frac{1}{1+e^{-z}} \\end{aligned}";
  const z_eq =
    "\\begin{aligned} z = \\hat{\\beta_0} + \\hat{\\beta_1} x_1 + \\hat{\\beta_2} x_2 + ... + \\hat{\\beta_k} x_k \\end{aligned}";
</script>

<section>
  <p class="body-text">
    One major area in machine learning is supervised learning, where the
    goal is to predict an output given some inputs. The output value may be a
    numerical or categorical variable. In this article, we will discuss
    <span class="bold">logistic regression</span>: a supervised learning
    algorithm that can be used to classify data into categories, or classes, by
    predicting the probability that an observation falls into a particular class
    based on its features.
  </p>
  <br /><br />
  <p class="body-text">
    Though it can be extended to more than two categories, logistic regression
    is often used for binary classification, i.e. determining which of two
    groups a data point belongs to, or whether an event will occur or not. In
    this article, we will focus on binary logistic regression.
  </p>
  <br /><br />
  <p class="body-text">
    The typical setup for logistic regression is as follows: there is an outcome
    {@html katexify("y")} that falls into one of two categories (say 0 or 1), and
    the following equation is used to estimate the probability that {@html katexify(
      "y"
    )} belongs to a particular category given inputs {@html katexify(
      "X = (x_1, x_2, ..., x_k)"
    )}:

    {@html katexify(sigmoid, true)}
    where {@html katexify(z_eq, true)}
  </p>
  <br /><br />

  <p class="body-text">
    If you have ever encountered linear regression, the equation for {@html katexify(
      "z"
    )} likely looks familiar. This is called a linear predictor, and it is transformed
    by the sigmoid function so that the values fall between 0 and 1, and can therefore
    be interpreted as probabilities. This resulting probability is then compared
    to a threshold to predict a class for {@html katexify("y")} based on {@html katexify(
      "X"
    )}.
  </p>
  <br /><br />
</section>

<style>
</style>
