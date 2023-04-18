<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
</script>

<section>
  <p class="body-header">Defining Equalized Odds</p>
  <p class="body-text">
    In this article, we will review a well-known fairness criterion, called
    'Equalized Odds' (EO). EO aims to equalize the
    error a model makes when predicting categorical outcomes for different
    groups, here:
    <svg height="16" width="16">
      <circle
        cx="8"
        cy="10"
        r="4"
        stroke="var(--group_circles)"
        stroke-width="3"
        fill="var(--group_circles)"
      />
    </svg>
    and
    <svg height="12" width="12">
      <polygon
        points="6,0 0,12 12,12"
        style="fill:var(--group_triangles);stroke-width:1"
      />
      Sorry, your browser does not support inline SVG.
    </svg>.
    <br /><br />EO takes the merit different groups of people have into account
    by considering the underlying ground truth distribution of the labels. This
    ensures the errors across outcomes and groups are similar, i.e. fair.
    <br />
    <br />

    For example, if we consider a hiring scenario, the errors EO compares are
    'wrong rejection' and 'wrong acceptance'. We could simply count the number
    of wrong rejections and acceptances but as groups generally differ in size,
    we should use
    <span class="highlight">error rates</span> instead as those are scale
    invariant. Useful error rates to consider are the False Negative Rate (FNR)<sup
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
    >
    of a classifier, or the combination of both those error rates<sup
    ><span
      class="info-tooltip"
      title="In the EO literature, usually TPR and FPR are considered. This is possible because TPR can be calculated as 1 - FNR."
      use:tooltip
      >[&#8505;]
    </span></sup
  >.
    <br /><br />
    According to EO, a
    <span class="highlight"
      >model is fair if the predictions it makes have the same TPR<sup
      ><span
        class="info-tooltip"
        title="TPR = 1 - FNR"
        use:tooltip
        >[&#8505;]
      </span></sup
    > and FPR across all groups </span>in the dataset. Formally, this can be written as:
    <br />
    <br />
  </p>
  <p class="equation-text">
    {@html katexify(`\\mathbb{P}(\\hat{Y}=1| Y=y, A= \\;`, false)}<svg
      height="12"
      width="12"
    >
      <polygon
        points="6,0 0,12 12,12"
        style="fill:var(--group_triangles);stroke-width:1"
      />
      Sorry, your browser does not support inline SVG.
    </svg>
    {@html katexify(`) = \\mathbb{P}(\\hat{Y}=1| Y=y, A=`, false)}
    <svg height="16" width="16">
      <circle
        cx="8"
        cy="10"
        r="4"
        stroke="var(--group_circles)"
        stroke-width="3"
        fill="var(--group_circles)"
      />
    </svg>
    {@html katexify(`),  \\; y \\: \\in \\: \\{0,1\\}`, false)}
  </p>
  <br />
  <p class="body-text">
    where {@html katexify(`\\hat{Y}`)} denotes predictions (here: positive), {@html katexify(
      `A`
    )} refers to the group membership and {@html katexify(`Y`)} represents the ground
    truth.
    <br /><br /> Equalized odds aims to match TPR and FPR for different groups, punishing models that perform well for one group only.
    Unfortunately this can be very hard to achieve in practice, so it makes
    sense to relax the EO criterion and consider a modified version of the EO
    equation with {@html katexify(`y=1`)} for equalizing TPR
    <span class="highlight">(equal opportunity)</span>, or {@html katexify(
      `y=0`
    )} for equalizing FPR.
  </p>
</section>
