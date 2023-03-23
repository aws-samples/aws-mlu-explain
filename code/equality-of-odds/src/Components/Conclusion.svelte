<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
</script>

<section>
  <p class="body-header">The End</p>
  <p class="body-text">
    While machine learning algorithms have the potential to revolutionize
    decision-making, we have to ensure that a fairness criteria is used for
    measuring any potential bias in addition to general Machine Learning
    metrics. Depending on the outcome of the bias evaluation we should include
    bias mitigation. Equality of Odds (EO) offers a promising approach to
    mitigate bias and is a method that can be used in different ways (and even
    during post-processing with access only to the predictions). However, before
    using EO for evaluation or bias mitigation, we should carefully consider the
    context and potential trade-offs between competing objectives.
  </p>
  <p class="body-header">Goodbye :)</p>
  <p class="body-text">
  To learn more about Machine Learning, check out our self-paced courses, our
  YouTube videos, and the Dive into Deep Learning textbook. If you have any
  comments or ideas related to MLU-Explain articles, feel free to reach out
  directly. The code for this article is available here.</p>
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
