<script>
  import katexify from "../katexify";
</script>

<section>
  <p class="body-text">
    Often in machine learning we want to estimate the performance of our models
    before putting them into production. Of course, we could try evaluating our
    model's predictions on the same data that we used to fit our model's
    parameters, but this will give unreliable assessments of our model's ability
    to generalize to unseen data. Thus, we'd like to find a way to assess the
    generalization capabilities of our model without having to wait for new
    data. This article discusses one of the most common approaches for this
    task:
    <span class="bold">K-Fold Cross-Validation</span>. We'll first discuss the
    Validation Set approach we learned in the 
    <a href="https://mlu-explain.github.io/train-test-validation">Train,
      Test, and Validation Sets article</a>. Then we will describe how K-Fold 
    Cross-Validation extends that approach, and discuss some concerns around 
    selecting the values of {@html katexify(`k`, false)}.
  </p>
</section>

<style>
  /* mobile */
  @media screen and (max-width: 950px) {
  }
</style>
