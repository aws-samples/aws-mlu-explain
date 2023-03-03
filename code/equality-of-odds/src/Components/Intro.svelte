<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
</script>

<section>
  <p class="body-text">
    Machine learning algorithms have the potential to revolutionize the way we
    make decisions, but they can also perpetuate and amplify existing biases if
    not designed and used correctly. Equality of Odds (EO) is one approach to
    mitigating bias and promoting diversity in machine learning models. At its
    core, EO aims to ensure that models make accurate predictions for all
    demographic groups, regardless of any group-specific differences in the
    distribution of the predicted variable. This approach has gained increasing
    attention in recent years as concerns around algorithmic bias have come to
    the forefront of public and academic discussion. By promoting diverse
    outcomes, EO offers a valuable tool for building fairer and more equitable
    machine learning systems that can be applied in areas such as hiring,
    lending, and criminal justice. However, as with any approach to bias
    mitigation, it requires careful consideration of the specific context and
    potential trade-offs between competing objectives.
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
