<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
  import StackedBarDef1 from "./charts/StackedBarDef1.svelte";
  import StackedBarDef2 from "./charts/StackedBarDef2.svelte";
</script>

<section>
  <p class="body-header">Defining Equalized Odds</p>
  <p class="body-text">
    In this article, we will review a well-known fairness criteria, called
    'Equalized Odds' (EO), also known as 'separation criteria'. EO aims to
    equalize the error a model makes based on the merit different groups of
    people have.
    <br /><br />
    In the case of a classification model, the errors to compare in an admission
    or hiring scenario are 'wrong rejection' and 'wrong acceptance'. As groups generally
    differ in size, we don't want to compare absolute values and look at the False
    Negative Rate (FNR)<sup
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
    >, or the combination of FPR and FNR instead.
    <br /><br />
    According to EO, a model is fair if the predictions it makes have the same FNR
    and FPR across all groups in the dataset. Formally, this can be written as:
    {@html katexify(
      `P(\\hat{Y}=1| Y=y, A=a) = P(\\hat{Y}=1| Y=y, A=b),  \\; y \\: \\epsilon \\: \\{0,1\\}`,
      true
    )}
    where {@html katexify(`\\hat{Y}`)} are the model predictions, {@html katexify(
      `A`
    )} denotes the group membership (here: limited to two groups,
    <svg height="16" width="16">
      <circle
        cx="8"
        cy="10"
        r="4"
        stroke="black"
        stroke-width="3"
        fill="black"
      />
    </svg>
    and
    <svg height="12" width="12">
      <polygon points="6,0 0,12 12,12" style="fill:black;stroke-width:1" />
      Sorry, your browser does not support inline SVG.
    </svg>) and {@html katexify(`Y`)} represents the ground truth.
    <br /><br />
    This can be very hard to achieve, so in some cases it makes sense to relax the
    EO criteria and set {@html katexify(`y=1`)} for equalizing FPR, or {@html katexify(
      `y=0`
    )} for equalizing FNR.
    <!-- To understand why equalizing FNR and FPR can give a fair outcome, let's assume
    we are building a model that is supposed to predict whether or not individuals
    from two different groups of students,
    <svg height="16" width="16">
      <circle
        cx="8"
        cy="10"
        r="4"
        stroke="black"
        stroke-width="3"
        fill="black"
      />
    </svg>
    and <svg height="12" width="12">
      <polygon points="6,0 0,12 12,12" style="fill:black;stroke-width:1" />
      Sorry, your browser does not support inline SVG.
    </svg>
    
, will complete their degree. The students identified as promising (=
        likely to complete), will receive a grant.
        <br /><br />
        Let's have a look at the charts below to see the difference between a model
        that grants both groups the same rate of positive outcomes and a model that
        uses EO and grants the groups according to what they deserve/the merit.
  </p>
  <br /> -->

    <!-- <div id="stacked-charts-container">
    <div id="stackeddef1-container">
      <StackedBarDef1 />
    </div>
    <div id="stackeddef2-container">
      <StackedBarDef2 />
    </div>
  </div> -->
  </p>
</section>

<style>
  #stacked-charts-container {
    display: grid;
    margin: auto;
    height: 38vh;
    width: 70%;
    grid-template-columns: 50% 50%;
    grid-gap: 2%;
    max-width: 1000px;
  }
  #stackeddef1-container {
    max-height: 38vh;
  }
  #stackeddef2-container {
    max-height: 38vh;
  }
  /* mobile */
  @media screen and (max-width: 950px) {
  }
</style>
