<script>
  import katexify from "../katexify";

  const sigmoid = "P(Y=1|X) = sigmoid(z) = \\frac{1}{1+e^{-z}}";
  const z_eq =
    "z = X*\\beta = \\beta_0 + \\beta_1 * x_1 + \\beta_2*x_2 + ... + \\beta_n*x_n";
</script>

<section>
  <p class="body-text">
    As mentioned in our
    <a href="https://mlu-explain.github.io/precision-recall/">
      Precision & Recall article</a
    >, a common machine learning problem is classification, where the goal is to
    categorize data into classes based on their features. In this article, we
    will discuss how logistic regression can be used for classification
    problems. <span class="bold">Logistic regression</span> is a supervised learning
    model, as it learns to predict the class for a particular input based on the
    correct classes of observations in the data set.
  </p>
  <br /><br />
  <p class="body-text">
    Though it can be extended to more than two categories, logistic regression
    is often used for binary classification, i.e. determining which of two
    groups a data point falls in, or whether an event will occur or not. In this
    article, we will focus on binary logistic regression.
  </p>
  <br /><br />
  <p class="body-text">
    The typical setup for logistic regression is as follows: there is an outcome
    {@html katexify("Y")} that falls into one of two categories (say 0 or 1), and
    the following equation is used to calculate the probability that {@html katexify(
      "Y"
    )} belongs to a particular category given inputs {@html katexify("X")}:

    {@html katexify(sigmoid, true)}
    where {@html katexify(z_eq, true)}
  </p>
  <br /><br />

  <p class="body-text">
    If you have seen linear regression, the equation for {@html katexify("z")} likely
    looks familiar. This is called the linear predictor, and it is transformed by
    the sigmoid function so that the values fall between 0 and 1, and can therefore
    be interpreted as probabilities.
  </p>
  <br /><br />

  <p class="body-text">
    This resulting probability is then compared to a threshold to predict a
    class for {@html katexify("Y")} based on {@html katexify("X")}. For example,
    a threshold of 0.5 may be reasonable, so that an outcome of 1 is predicted
    if the probability that {@html katexify("Y=1")} is greater than 0.5.
  </p>
</section>

<style>
</style>
