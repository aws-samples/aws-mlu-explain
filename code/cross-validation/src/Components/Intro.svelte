<script>
  import katexify from "../katexify";
</script>

<section>
  <p class="body-text">
    In machine learning we need to estimate the performance of a model before we
    put it into production. While we could just evaluate our model's performance
    on the same data that we used to fit its parameters, doing so will give us
    unreliable assessments of our model's ability to generalize to unseen data.
    Because obtaining new data may be difficult, we'd like to find a way to
    assess the generalization capabilities of a model without having to wait for
    new data. This article discusses one of the most common approaches for this
    task:
    <span class="bold">K-Fold Cross-Validation</span>. We'll first discuss the
    Validation Set approach we learned in the
    <a href="https://mlu-explain.github.io/train-test-validation"
      >Train, Test, and Validation Sets article</a
    >. Then we will describe how K-Fold Cross-Validation extends that approach,
    and discuss some concerns around selecting the values of {@html katexify(
      `k`,
      false
    )}.
  </p>
</section>
