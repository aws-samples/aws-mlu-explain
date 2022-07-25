<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
</script>

<section>
  <p class="body-text">
    Linear Regression is a simple but very powerful model for predicting a
    numeric response. It is widely used across a large number of domains for its
    simplicity, ease of interpretation, and ease of extension. The key ideas in
    linear regression are recycled all over statistics and machine learning, so
    understanding provides a great foundation for many approaches used in
    machine learning and statistics. It’s a straightforward model used for
    prediction, comparisons, and casual inference.
  </p>
  <br />
  <p class="body-text">
    A linear regression models the relationship between a dependent variable
    (aka the response or label) as a function of one or more independent
    variables (aka features or examples). In the specific case of linear
    regression, our dependent variable should be some number.[1] Linear
    regression is a supervised model, meaning it learns to model Y by looking at
    previous data. It uses this previous data to find a line that minimizes the
    residuals, or error, in our dataset. The ‘best fit’ line is one that
    minimizes these residuals the best Examples of linear regression include:
    predicting the price of a house using the number of rooms, predicting weight
    using height, predicting items sold using the number of previous items sold.
    The equation for linear regression is: [1] Recall - classification predicts
    discrete objects from each other, regression predicts numerical.
  </p>
  <br />
  <!-- <p class="body-text">y=β0+β1∗x1+β2∗x2+...+βk∗xk+ϵ</p> -->
  <p class="body-text">
    {@html katexify(`y=β0+β1∗x1+β2∗x2+...+βk∗xk+ϵ`, true)}
  </p>

  <br />
  <p class="body-text">
    where: <br />
  </p>
  <ul class="body-text">
    <li>
      <span class="bold">y</span>: the dependent variable; the thing we are
      trying to predict.<span
        class="info-tooltip"
        title="E.g., if we are using the number of bathrooms to
      predict housing price, housing price is the dependent variable."
        use:tooltip
      >
        [&#8505;]
      </span>
    </li>

    <li>
      <span class="bold">x</span>: the independent variables: the features our
      model uses to model y.<span
        class="info-tooltip"
        title=" E.g., if we are using height and age to predict
      weight, height and age are the independent variables."
        use:tooltip
      >
        [&#8505;]
      </span>
    </li>
    <li>
      <span class="bold">B</span>: the coefficients (aka the weights) of our
      regression model. These are the foundations of our model. They are what
      our model ‘learns’ during optimization.<span
        class="info-tooltip"
        title="The coefficient B0 represents the
      intercept of our model, and each other coefficient Bi (i > 0) is a slope
      defining how variable xi contributes to the model. We discuss how to
      interpret regression coefficients later in the article [link]."
        use:tooltip
      >
        [&#8505;]
      </span>
    </li>
    <li>
      <span class="bold">Error</span>: the irreducible error in our model. A
      statistical artifact representing the stuff we can’t control for in our
      model.<span
        class="info-tooltip"
        title="(that is, the random variation in y we can’t explain/model with our
      xi). [reword: we don’t really care about this, because it’s out of our
      control]."
        use:tooltip
      >
        [&#8505;]
      </span>
    </li>
  </ul>
  <br />

  <p class="body-text">
    Linear regression is the act of learning the best coefficients on our Xi to
    model y as closely as possible. That is, once we’ve determined which
    features to include in our model, the linear regression algorithm will learn
    via some optimization process (discussed below), to find the best
    coefficients for model. [a little rewording]
  </p>
  <br />
  <!-- <p class="body-text">y^=β0+β1∗x1+β2∗x2+...+βk∗xk</p> -->
  <p class="body-text">
    {@html katexify(`y=β0+β1∗x1+β2∗x2+...+βk∗xk+ϵ`, true)}
  </p>
  <p class="body-text">
    To be clear, this is the exact form of the model we'll be using. yhat
    represents our predictions, bhat represent out estimated coefficients (we'll
    use previous training data to estimate [i.e. 'learn'] them), and because our
    model is an approximation, we won't explicitly include the error term, as
    we'll just take it for granted.
  </p>
  <br />
</section>

<style>
  ul {
    max-width: 600px;
    margin: auto;
    color: var(--squid-ink);
    padding-top: 0.5rem;
    /* border: 2px solid black; */
  }
  li {
    padding: 0.25rem;
    list-style: none;
    color: var(--squid-ink);
  }
  /* mobile */
  @media screen and (max-width: 950px) {
    ul {
      max-width: 80%;
    }
    li {
      padding: 0.25rem 0;
    }
  }
</style>
