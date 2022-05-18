<script></script>

<section id="conclusion">
  <h1 class="body-header">Considerations</h1>
  <p class="body-text">
    In modern machine learning, ROC and AUC are commonly used tools for
    evaluating the performance of a classifier. However, as with everything,
    they’re not perfect! In cases when you desire well-calibrated probability
    outputs (i.e. when you care about the true likelihood of an event, and not
    just model performance), ROC/AUC will give us no such information.
    Additionally, the AUC metric treats all classification errors equally,
    ignoring the potential consequences of ignoring one type over another. For
    example, in cancer detection, we’ll probably want to minimize false
    negatives (even at the risk of increasing false positives). That said, even
    in these cases plotting the ROC may help in understanding the potential
    strengths and weaknesses of your model, and where special care should be
    given.
  </p>
  <hr />
  <p class="body-text">
    Thanks for reading! We hope that the article is insightful no matter where
    you are along your Machine Learning journey, and that you came away with a
    better understanding of ROC and AUC in the context of machine learning.
    <br /><br />

    To learn more about Machine Learning, check out our
    <a class="on-end" href="https://aws.amazon.com/machine-learning/mlu/"
      >self-paced courses</a
    >, our
    <a
      class="on-end"
      href="https://www.youtube.com/channel/UC12LqyqTQYbXatYS9AA7Nuw"
      >YouTube videos</a
    >, and the
    <a class="on-end" href="https://d2l.ai/">Dive into Deep Learning</a>
    textbook. If you have any comments or ideas related to
    <a class="on-end" href="https://mlu-explain.github.io/"
      >MLU-Explain articles</a
    >, feel free to reach out
    <a class="on-end" href="https://twitter.com/jdwlbr">directly</a>. The code
    for this article is available
    <a class="on-end" href="https://github.com/aws-samples/aws-mlu-explain"
      >here</a
    >.
    <br /><br />
    A special thanks goes out to <span class="bold">Brent Werness</span> for his
    valuable contributions to the article.
  </p>
</section>

<style>
  hr {
    margin: 3rem auto;
    width: 3%;
    border: 3px solid rgba(201, 32, 138, 0.7);
  }
</style>
