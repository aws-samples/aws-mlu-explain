<script>
  import katexify from "../katexify";
</script>

<section>
  <p class="body-text">
    In our <a href="https://mlu-explain.github.io/precision-recall/"
      >previous article discussing evaluating classification models</a
    >, we discussed the consequences of favoring False Positives over False
    Negatives (or vice versa). Left unmentioned were two closely-related
    concepts, the Receiver Operating Curve (the
    <span class="bold">ROC Curve</span>) and the Area under the ROC Curve (<span
      class="bold">AUC</span
    >, or <span class="bold">AUROC</span>). The ROC Curve provides us with a
    visual way to observe how such changes in our model’s classification
    thresholds affect the model’s performance. An ROC curve is composed by
    plotting the
    <span class="bold">True-Positive Rate (TPR)</span>
    versus the <span class="bold">False-Positive Rate (FPR)</span> for different
    classification threshold, where
    <br />
  </p>
  <ul class="body-text">
    <li>
      <span class="bold">True Positive Rate (TPR)</span>: The probability that a
      positive sample is predicted in the positive class:<br /><br />
      {@html katexify(
        `\\begin{aligned}  \\frac{\\mathrm{\\#~True~Positives}}{\\mathrm{\\#~True~Positives + \\#~False~Negatives}} \\end{aligned}`
      )} <br /> and
    </li>

    <li>
      <span class="bold">False Positive Rate (FPR)</span>: The probability that
      a negative sample is predicted in the positive class:<br /><br />
      {@html katexify(
        `\\begin{aligned} \\frac{\\mathrm{\\#~False~Positives}}{\\mathrm{\\#~False~Positives + \\#~True~Negatives}} \\end{aligned}`
      )}
    </li>
  </ul>
  <br />
  <p class="body-text">
    Changing our model's classification threshold may give us completely
    different True Positive Rates and False Positive Rates Changing the way our
    model makes decisions (e.g. by changing our classification threshold) is
    liable to give us completely different outputs. That is, if we were to move
    the decision boundary our model uses for classification, we’d expect the
    resulting outputs, and thus the model’s TPR and FPR, to be different. These
    changes will be visualized as different points along the ROC Curve - results
    from different thresholds will become different points on our ROC curve.
    <br /><br />
    <!-- To make this concept more clear, we’ll imagine that we’re trying to predict bananas
    from apples using just the item’s weight. Recall that ROC Curve is composed by
    plotting the *TPR* versus the *FPR* for different classification thresholds.
    That bit may sound a bit confusing, so we’ll step through the process to make
    it clear, visualizing our ROC curve directly:
    <br /><br /> -->
  </p>
</section>

<style>
  ul {
    max-width: 600px;
    margin: auto;
    /* font-family: var(--font-main);
    font-size: 17px; */
    padding-top: 0.5rem;
  }
  li {
    padding: 0.25rem;
    list-style: none;
  }

  /* mobile */
  @media screen and (max-width: 950px) {
    ul {
      /* font-size: 18px; */
      max-width: 80%;
    }
  }
</style>
