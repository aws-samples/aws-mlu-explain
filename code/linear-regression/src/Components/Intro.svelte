<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
</script>

<section>
  <p class="body-text">
    Linear Regression is a simple but very powerful model for predicting a
    numeric response from a set of one or more independent variables (which can
    be basically any data type). It is widely used across a large number of
    domains for its simplicity, ease of interpretation, and ease of extension.
    <!-- If you've
    taken a course in statistics, economics, sociology, or basically any field,
    chances are you've encountered the model either directly as a point of study
    or indirectly from a research paper.  -->
    The key ideas in linear regression are recycled all over statistics and machine
    learning, so understanding provides a great foundation for many approaches used
    in machine learning and statistics. We'll discuss the algorithm in this article
    in the context of how it's commonly used in machine learning.
  </p>
  <br />
  <p class="body-text">
    <span class="bold">Let's Be More Specific</span>
    <br />
    A linear regression models the relationship between a dependent variable, {@html katexify(
      `y`,
      false
    )}, as a function of one or more independent variables, {@html katexify(
      `x_i`,
      false
    )}, where {@html katexify(`y`, false)} is assumed to be some number and each
    {@html katexify(`x_i`, false)} can be basically anything. Linear regression is
    a supervised algorithm
    <span
      class="info-tooltip"
      title="Supervised algorithms are those that learn from past examples
    of historical data."
      use:tooltip
    >
      [&#8505;]
    </span>
    that learns to model y as a function of the features {@html katexify(
      `x_i`,
      false
    )} by finding a line (or surface) that best 'fits' the data. Examples of linear
    regression include: predicting the price of a house using the number of rooms
    in that house ({@html katexify(`y`, false)}: price, {@html katexify(
      `x_1`,
      false
    )} = number of rooms) or predicting weight from height and age ({@html katexify(
      `y`,
      false
    )}: weight, {@html katexify(`x_1`, false)} = height, {@html katexify(
      `x_2`,
      false
    )} = age).
    <br /><br />
    In general, the equation for linear regression is
  </p>
  <br />
  <!-- <p class="body-text">y=β0+β1∗x1+β2∗x2+...+βk∗xk+ϵ</p> -->
  <p class="body-text">
    {@html katexify(
      `y=B_0 + B_1x_1  + B_2x_2 + ... + B_px_p + \\epsilon`,
      true
    )}
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
      interpret regression coefficients further on in the article."
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
    The line of best fist is parameterized by our coefficients, {@html katexify(
      `B_i`,
      false
    )}. If we can estimate these, we're good. Linear regression is all about
    estimating these coefficients. Once we've estimated these coefficients, we
    predict future values, {@html katexify(`\\hat{y}`, false)}, as:
  </p>
  <br />
  <!-- <p class="body-text">y^=β0+β1∗x1+β2∗x2+...+βk∗xk</p> -->
  <p class="body-text">
    {@html katexify(
      `\\hat{y}=\\hat{B_0} + \\hat{B_1}x_1  + \\hat{B_2}x_2 + ... + \\hat{B_p}x_p  `,
      true
    )}
  </p>
  <p class="body-text">
    So predicting future values (often called inference), is as simple as
    plugging the values of our features {@html katexify(`x_i`, false)} into our equation!
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
