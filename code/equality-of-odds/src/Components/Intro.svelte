<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
</script>

<section>
  <p class="body-text">
    Machine Learning models learn to make predictions by looking at data with
    the help of algorithms, both of which can be biased against different groups
    of people. Biased machine learning can harm, discriminate and negatively
    stereotype against underrepresented or (historically and otherwise) disfavored groups.
    Therefor, it is crucial to <span class='highlight'>evaluate and control model predictions not only
    for general machine learning performance but also for fairness</span>.
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
