<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
</script>

<section>
  <p class="body-text">
    Linear Regression is a simple and powerful model for predicting a numeric
    response from a set of one or more independent variables. This article will
    focus mostly on how the method is used in machine learning, so we won't
    cover common use cases like causal inference or experimental design. And
    although it may seem like linear regression is overlooked in modern machine
    learning's ever-increasing world of complex neural network architectures,
    the algorithm is still widely used across a large number of domains because
    it is effective, easy to interpret, and easy to extend. The key ideas in
    linear regression are recycled everywhere, so understanding the algorithm is
    a must-have for a strong foundation in machine learning.
  </p>
  <br />
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
