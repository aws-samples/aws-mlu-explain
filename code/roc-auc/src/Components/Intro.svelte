<script>
</script>

<section>
  <p class="body-text">
    In our <a href="https://mlu-explain.github.io/precision-recall/"
      >previous article discussing evaluating classification models</a
    >, we discussed the importance of decomposing and understanding your model's
    outputs (e.g. the consequences of favoring False Positives over False
    Negatives, or vice versa). Left unmentioned were two closely-related
    concepts, the Receiver Operating Characteristic Curve (the
    <span class="bold">ROC Curve</span>) and the Area under the ROC Curve (<span
      class="bold">AUC</span
    >, or <span class="bold">AUROC</span>).
    <br /><br />
    ROC curves were first employed during World War 2 to analyze radar signals: After
    missing the Japanese aircraft that carried out the attack on Pearl Harbor, the
    US wanted their radar receiver operators to better identify aircraft from signal
    noise. The operator's ability to identify as many true positives as possible
    while minimizing false positives was named the
    <i>Receiver Operating Characteristic</i>, and the curve analyzing their
    predictive abilities was called the ROC Curve. Today, ROC curves are used in
    a number of contexts, including clinical settings (to assess the diagnostic
    accuracy of a test) and machine learning (the focus of this article).

    <br /><br />
    In machine learning, we use ROC Curves to analyze the predictive power of a classifier:
    they provide a visual way to observe how changes in our model’s classification
    thresholds affect our model’s performance. Similar to their original use in the
    1940's, the curves allow us to select for classification thresholds that allow
    our model to identify as many true positives as possible while minimizing false
    positives.
    <br /><br />
    In particular, the ROC curve is composed by plotting a model's
    <span class="bold">True-Positive Rate (TPR)</span>
    versus its <span class="bold">False-Positive Rate (FPR)</span> across all possible
    classification thresholds, where:
  </p>

  <ul class="body-text">
    <li>
      <span class="bold">True Positive Rate (TPR)</span>: The probability that a
      positive sample is correctly predicted in the positive class. E.g., the
      percentage of radar signals predicted to be airplanes that actually are
      airplanes.
    </li>

    <li>
      <span class="bold">False Positive Rate (FPR)</span>: The probability that
      a negative sample is incorrectly predicted in the positive class. E.g.,
      the percentage of radar signals predicted to be airplanes that actually
      are
      <i>not</i>
      airplanes.
    </li>
  </ul>
  <br />
  <p class="body-text">
    To make the concept as clear as possible, we'll construct an ROC curve for
    ourselves. Let's pretend that we have our own model to classify radar
    signals as either airplanes or noise. Items greater than our classification
    threshold will be predicted to be airplanes, and items less than will be
    predicted to be noise:
  </p>
</section>

<style>
  ul {
    max-width: 600px;
    margin: auto;
    color: var(--squid-ink);
    padding-top: 0.5rem;
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
  }
</style>
