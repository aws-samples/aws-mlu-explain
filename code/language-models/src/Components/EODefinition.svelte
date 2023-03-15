<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
  import Scatter1 from "./charts/Scatter1.svelte";
  import Roc from "./charts/ROC.svelte";
</script>

<section>
  <p class="body-header">Defining Equalized Odds</p>
  <p class="body-text">
    In this article, we will review a well-known fairness criteria, called
    "Equalized Odds" (EO). EO aims to equalize the error a model makes based on
    the merit different groups of people have. In the case of a classification
    model, the errors to compare are 'wrong rejection' and 'wrong acceptance'.
    As groups generally differ in size, we don't want to compare absolute values
    and look at the False Negative Rate (FNR)<sup
      ><span
        class="info-tooltip"
        title="Probability of an individual with a true positive outcome to receive a negative outcome."
        use:tooltip
        >[&#8505;]
      </span></sup
    >
    and False Positive Rate (FPR)<sup
      ><span
        class="info-tooltip"
        title="Probability of falsely assigning a positive outcome."
        use:tooltip
        >[&#8505;]
      </span></sup
    >instead.
    <br /><br />
    According to EO, a model is fair if the predictions it makes have the same FNR
    and FPR across all groups in the dataset. Formally, this can be written as:
    {@html katexify(
      `P(\\hat{Y}=1| Y=y, A=a) = P(\\hat{Y}=1| Y=y, A=b),  \\; y \\: \\epsilon \\: \\{0,1\\}`,
      true
    )}
    where {@html katexify(`\\hat{Y}`)} are the model predictions, {@html katexify(
      `A`
    )} denotes the group membership (here: limited to two groups) and {@html katexify(
      `Y`
    )} represents the ground truth.
    <br /><br />
    To understand why equalizing FNR and FPR can give a fair outcome, let's assume
    we are building a model that is supposed to predict whether or not individuals
    from two different groups of students, circles and squares, will complete their
    degree. The students identified as promising (= likely to complete), will receive
    a treat.
    <br /><br />
    Let's have a look at the graphics below to see the difference between a model
    that treats both groups the same and a model that uses EO and treats the groups
    according to what they deserve/the merit.
  </p>
</section>

<style>
  #charts1-container {
    display: grid;
    margin: auto;
    height: 38vh;
    width: 70%;
    grid-template-columns: 50% 50%;
    grid-gap: 2%;
    max-width: 1000px;
  }
  #scatter1-container {
    max-height: 38vh;
  }
  #output1-container {
    border: var(--sky);
    max-height: 38vh;
  }
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
