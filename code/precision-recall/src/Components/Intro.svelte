<script>
</script>

<section>
  <p class="body-text">
    Many machine learning tasks involve <span class="bold">classification</span
    >: the act of predicting a discrete category for some given input. Examples
    of classifiers include determining whether the item in front of your phone's
    camera is a hot dog or not (two categories, so
    <span class="bold">binary</span>
    classification), or predicting whether your Amazon package will arrive
    early, late, or on time (more than two categories, so
    <span class="bold">multiclass</span> classification).
  </p>
  <br />
  <p class="body-text">
    Evaluating classifiers requires careful consideration. In this article,
    we'll explore why accuracy isn't always a great measure of classification
    performance, and discuss three other evaluation metrics often used in its
    place: <span class="bold">precision</span>,
    <span class="bold">recall</span>, and the
    <span class="bold">F1-score</span>. To help qualify the importance of these
    metrics, we'll make use of the <span class="bold">confusion matrix</span>, a
    simple technique for visualizing the performance of a classification model.
  </p>

  <br /><br />
  <table>
    <tr>
      <th />
      <th class="table-head">Predicted: 1</th>
      <th class="table-head">Predicted: 0</th>
    </tr>
    <tr>
      <td class="table-head">Actual: 1</td>
      <td>True Positive (<span class="bold">TP</span>)</td>
      <td>False Negative (<span class="bold">FN</span>)</td>
    </tr>
    <tr>
      <td class="table-head">Actual: 0</td>
      <td>False Poisitive (<span class="bold">FP</span>)</td>
      <td>True Negative (<span class="bold">TN</span>)</td>
    </tr>
  </table>
  <br /><br /><br />
  <p class="body-text">
    Instead of looking at the model's raw accuracy (the number of correctly
    assigned categories divided by te total number of predictions) , the
    confusion matrix decomposes predictions into several categories of interest,
    making explicit how one class may be <i>confused</i> for another:
  </p>
  <br />
  <ul class="body-text">
    <li>
      <span class="bold">True Positives (TP)</span>: The number of positive
      instances correctly classified as positive. E.g., predicting an email as
      spam when it actually is spam.
    </li>
    <li>
      <span class="bold">False Positives (FP)</span>: The number of negative
      instances incorrectly classified as positive. E.g., predicting an email is
      spam when it actually is not spam.
    </li>
    <li>
      <span class="bold">True Negatives (TN)</span>: The number of negative
      instances correctly classified as negative. E.g., predicting an email is
      not spam when it actually is not spam.
    </li>
    <li>
      <span class="bold">False Negatives (FN)</span>: The number of positive
      instances incorrectly classified as negative. E.g., predicting an email is
      not spam when it actually is spam.
    </li>
  </ul>
  <br />
  <p class="body-text">
    The distinction between these four different prediction outcomes is often
    consequential, so it's very important to have a solid understanding of them!
  </p>
  <br />
  <p class="body-text">
    To motivate our problem, we'll pretend that we've trained a binary
    classification model to diagnose an individual as having cancer or not.
    Under the hood, our model will output a probability for each individual of
    having cancer, and we'll compare this probability to the value of our
    classification threshold to determine whether or not an individual has
    cancer or not. The classification threshold is just a value we use to
    translate our probabilities into binary outputs. It is a decision threshold
    used to bin values into distinct categories. For example, if our
    classification threshold is 0.5, we'll classify any patient with a
    probability greater than 0.5 as being cancer-positive, and any patient with
    a probability less than 0.5 as being cancer-free:
  </p>
</section>

<style>
  ul {
    max-width: 600px;
    margin: auto;
    font-family: var(--font-main);
    font-size: 17px;
    padding-top: 0.5rem;
  }
  li {
    padding: 0.25rem;
  }
  table {
    border-collapse: collapse;
    width: 40%;
    margin: auto;
    max-width: 600px;
    font-size: 17px;
    font-family: var(--font-main);
  }

  td,
  th {
    border: 3px solid #dddddd;
    text-align: left;
    padding: 8px;
    color: var(--squid-ink);
  }

  th:nth-child(1) {
    border: 0;
  }

  .table-head {
    font-family: var(--font-heavy);
    color: var(--squid-ink);
    border: none;
  }

  /* mobile */
  @media screen and (max-width: 950px) {
    table {
      width: 95%;
      font-size: 18px;
    }

    ul {
      font-size: 18px;
      max-width: 80%;
    }

    td,
    th {
      padding: 4px;
    }
  }
</style>
