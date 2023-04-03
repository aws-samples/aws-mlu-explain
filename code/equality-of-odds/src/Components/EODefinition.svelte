<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
</script>

<section>
  <p class="body-header">Defining Equalized Odds</p>
  <p class="body-text">
    In this article, we will review a well-known fairness criteria, called
    'Equalized Odds' (EO), a.k.a. 'separation criteria'. EO aims to equalize the
    error a model makes when predicting categorical outcomes for different
    groups, here
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
    </svg>.
    <br /><br />EO takes the merit different groups of people have into account
    by considering the underlying ground truth distribution of the labels to
    ensure the errors across outcomes and groups are similar.
    <br />
    <br />

    For example, if we take a hiring scenario, the errors EO compares are 'wrong
    rejection' and 'wrong acceptance'. We could simply count the number of wrong
    rejections and acceptances but as groups generally differ in size, we should
    use
    <span class="highlight">error rates</span>.This means we need to look at the
    False Negative Rate (FNR)<sup
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
    >, or the combination of FPR and FNR.
    <br /><br />
    According to EO, a
    <span class="highlight"
      >model is fair if the predictions it makes have the same FNR and FPR
      across all groups
    </span>in the dataset. Formally, this can be written as:
    <br />
    <br />
  </p>
  <p class="equation-text">
    {@html katexify(`\\mathbb{P}(\\hat{Y}=1| Y=y, A= \\;`, false)}<svg
      height="12"
      width="12"
    >
      <polygon points="6,0 0,12 12,12" style="fill:black;stroke-width:1" />
      Sorry, your browser does not support inline SVG.
    </svg>
    {@html katexify(`) = \\mathbb{P}(\\hat{Y}=1| Y=y, A=`, false)}
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
    {@html katexify(`),  \\; y \\: \\in \\: \\{0,1\\}`, false)}
  </p>
  <br />
  <p class="body-text">
    where {@html katexify(`\\hat{Y}`)} are the model predictions, {@html katexify(
      `A`
    )} denotes the group membership and {@html katexify(`Y`)} represents the ground
    truth.
    <br /><br /> Equalized odds enforces that a classifiers' accuracy is equal
    in all groups, punishing models that perform well only for the majority.
    This can be very hard to achieve in practice, so it makes sense to relax the
    EO criteria and set {@html katexify(`y=1`)} for equalizing FNR (<span
      class="highlight">equal opportunity</span
    >), or {@html katexify(`y=0`)} for equalizing FPR.
  </p>
</section>

<style>
  .highlight {
    display: inline;
    padding: 0.15em 0;
    background: #ff990080;
    box-shadow: 0.5em 0 0 #ff990080, -0.5em 0 0 #ff990080;
  }
</style>
