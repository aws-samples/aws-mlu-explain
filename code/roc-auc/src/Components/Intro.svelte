<script>
  import katexify from "../katexify";
</script>

<section>
  <p class="body-text">
    In our <a href="https://mlu-explain.github.io/precision-recall/"
      >previous article discussing evaluating classification models</a
    >, we discussed the important consequences of favoring false positives to
    false negatives (or vice versa). Left unmentioned were two closely-related
    concepts, the Receiver Operating Curve, (often called just the ROC Curve),
    and AUC (which stands for Area under the ROC Curve, or AUROC). These
    concepts go hand-in-hand with our previous discussion on informed evaluation
    of classification models.
    <br /><br />
    The ROC Curve provides us with a visual way to observe how such changes in our
    model’s classification thresholds affect the model’s performance. (They originated
    during World War II as a way of measuring how well radar operators could distinguish
    noise from actual signals). An ROC curve is composed by plotting the
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
        `\\begin{aligned}{\\mathrm{True~Positive~Rate}} = \\frac{\\mathrm{\\#~True~Positives}}{\\mathrm{\\#~True~Positives + \\#~False~Negatives}} \\end{aligned}`
      )} <br /> and
    </li>
    <li>
      <span class="bold">False Positive Rate (FPR)</span>: The probability that
      a negative sample is predicted in the positive class:<br /><br />
      {@html katexify(
        `\\begin{aligned}{\\mathrm{False~Positive~Rate}} = \\frac{\\mathrm{\\#~False~Positives}}{\\mathrm{\\#~False~Positives + \\#~True~Negatives}} \\end{aligned}`
      )}
    </li>
  </ul>
  <br />
  <p class="body-text">
    Changing the way our model makes decisions (e.g. by changing our
    classification threshold) is liable to give us completely different outputs.
    That is, if we were to move the decision boundary our model uses for
    classification, we’d expect the resulting outputs, and thus the model’s TPR
    and FPR, to be different. These changes will be visualized as different
    points along the ROC Curve - results from different thresholds will become
    different points on our ROC curve.
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
