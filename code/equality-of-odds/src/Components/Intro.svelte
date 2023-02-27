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
  <br />
  <p class="body-header">Equation and Tooltip Example</p>
  <p class="body-text">
    <br />
    Here is a tooltip<sup
      ><span
        class="info-tooltip"
        title="Supervised algorithms learn to predict a specific value based on historical data."
        use:tooltip
        >[&#8505;]
      </span></sup
    >
  </p>
  <br />
  <p class="body-text">
    And here is an equation:
    {@html katexify(
      `y=\\beta_0 + \\beta_1x_1  + \\beta_2x_2 + ... + \\beta_px_p + \\epsilon`,
      true
    )}
  </p>

  <br />
  <p class="body-text">
    where: <br />
  </p>
  <ul class="body-text">
    <li>
      {@html katexify(`y`, false)}: the dependent variable; the thing we are
      trying to predict.<sup
        ><span
          class="info-tooltip"
          title="If we are using the number of bathrooms to
      predict housing price, housing price is the dependent variable."
          use:tooltip
          >[&#8505;]
        </span></sup
      >
    </li>

    <li>
      {@html katexify(`x_i`, false)}: the independent variables: the features
      our model uses to model y.<sup
        ><span
          class="info-tooltip"
          title=" If we are using the number of bathrooms to
        predict housing price, the number of bathrooms is the independent variable."
          use:tooltip
          >[&#8505;]
        </span></sup
      >
    </li>
    <li>
      {@html katexify(`\\beta_i`, false)}: the coefficients (aka "weights") of
      our regression model. These are the foundations of our model. They are
      what our model "learns" during optimization.<sup
        ><span
          class="info-tooltip"
          title="The coefficient B<sub>0</sub> represents the
      intercept of our model, and each other coefficient 
      B<sub>i</sub> (i > 0) is a slope defining how variable 
      x<sub>i</sub> contributes to the model. We discuss how to
      interpret regression coefficients later in the article."
          use:tooltip
          >[&#8505;]
        </span></sup
      >
    </li>
    <li>
      {@html katexify(`\\epsilon`, false)}: the irreducible error in our model.
      A term that collects together all the unmodeled parts of our data.
    </li>
  </ul>
  <br />

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
