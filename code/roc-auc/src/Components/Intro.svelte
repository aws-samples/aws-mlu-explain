<script>
  const iconWidth = 35; //34
  const iconHeight = 22; //22
  const planePath = `m619.85 214.74c0.050782-33.195-102.47-60.727-235.13-65.004-3.4141-35.895-9.3789-68.66-18.395-96.035-4.9453 0.14062-9.9805 0.23047-15.176 0.23047h-0.93359c-3.7812 0-9.5312-0.0625-16.09-0.25781-9.1094 27.344-15.164 60.094-18.691 95.961-132.67 3.9023-235.26 31.113-235.3 64.293-0.074219 32.922 100.84 60.289 232 64.934 2.0312 60.781 8.3086 121.98 16.637 174.63-61.305 9.7656-86.223 60.969-17.91 61.051l29.301 0.042969c1.3477 6.1211 2.7031 12.078 4.0938 17.672 3.3828 14.262 8.0742 15.223 10.504 0l0.027343-0.027344c1.3945-5.6016 2.7656-11.531 4.1211-17.617l29.047 0.054687c68.176 0.066407 43.598-51.012-17.477-61.059 8.4844-52.633 14.953-113.84 17.152-174.64 131.17-4.2422 232.18-31.305 232.22-64.23zm-95.082-35.809c19.719 0 35.637 16.012 35.633 35.695-0.039063 19.719-16.039 35.688-35.734 35.648-19.75-0.035157-35.688-16.012-35.648-35.734 0.007813-19.715 16.035-35.664 35.75-35.609zm-350.31 70.84c-19.75-0.003906-35.672-16.023-35.672-35.734 0.0625-19.738 16.031-35.648 35.789-35.617 19.68 0.011719 35.598 16.023 35.598 35.734-0.003906 19.66-16.02 35.637-35.715 35.617z`;
  const cloudPath = `m558.77 267.66c-2.4492-60.551-52.5-109.02-113.57-109.02-7.0859 0-14.176 0.61328-21.086 
  1.9258-28.613-33.426-71.398-53.375-115.32-53.375-72.363 0-134.05 50.664-148.4 121.19-51.891 8.9219-90.391 54.246-90.391 107.18v8.3984c0 59.938 
  48.824 108.76 108.85 108.76h357.18c51.801 0 93.977-42.176 93.977-93.977-0.003906-43.223-29.668-80.758-71.23-91.082z`;

  const cloudIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="${iconWidth}" height="${iconHeight}" viewBox="0 0 ${iconWidth} ${iconHeight}" >
  <path stroke="white" stroke-width="30"  fill="#7cd1ea" transform="translate(2.5, 2.2) scale(0.042)" d="${cloudPath}"/>
  </svg>`;
  const planeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="${iconWidth}" height="${iconHeight}" viewBox="0 0 ${iconWidth} ${iconHeight}" >
    <path stroke="white" stroke-width="12" fill="#c9208a" transform="translate(1, 0) scale(0.043)" d="${planePath}"/>
 </svg>`;
</script>

<section>
  <p class="body-text">
    In our <a href="https://mlu-explain.github.io/precision-recall/"
      >previous article discussing evaluating classification models</a
    >, we discussed the importance of decomposing and understanding your model's
    outputs (e.g. the consequences of favoring False Positives over False
    Negatives, or vice versa). Left unmentioned were two closely-related
    concepts, the Receiver Operating Characteristic Curve (the
    <span class="bold">ROC Curve</span>) and the Area Under the ROC Curve (<span
      class="bold">AUC</span
    >, or <span class="bold">AUROC</span>).
    <br /><br />
    ROC curves were first employed during World War 2 to analyze radar signals: After
    missing the Japanese aircraft that carried out the attack on Pearl Harbor, the
    US wanted their radar receiver operators to better identify aircraft from signal
    noise (e.g. clouds). The operator's ability to identify as many true positives
    as possible while minimizing false positives was named the
    <i>Receiver Operating Characteristic</i>, and the curve analyzing their
    predictive abilities was called the ROC Curve. Today, ROC curves are used in
    a number of contexts, including clinical settings (to assess the diagnostic
    accuracy of a test) and machine learning (the focus of this article).

    <br /><br />
    In machine learning, we use ROC Curves to analyze the predictive power of a classifier:
    they provide a visual way to observe how changes in our model’s classification
    thresholds affect our model’s performance. Similar to their original use in the
    1940s, the curves allow us to select for classification thresholds that allow
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
    signals as either airplanes ({@html planeIcon}) or noise (e.g. clouds {@html cloudIcon}).
    Items greater than our classification threshold will be predicted to be
    airplanes, and items less than will be predicted to be noise:
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
    li {
      padding: 0.25rem 0;
    }
  }
</style>
