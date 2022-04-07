<script>
</script>

<section>
  <h1 class="body-header">
    Selecting K and The Bias Variance Tradeoff - It’s Complicated
  </h1>
  <p class="body-text">
    Let's start first with how k affects bias. Recall that the Validation Set
    Approach suffered from only using a handful of available data for model
    training. For most commonly used models, the more data the model has to
    train on, the less bias it will have. Taken to the extreme end, we can use
    LOOCV to minimize the contribution of bias. Variance is a bit more subtle.
    Classical arguments [XX] claim that the variance should be higher for larger
    k since each model is trained on nearly identical data meaning that every
    model should be nearly the same. However in [XX, YY, ZZ] it has been shown
    that in many cases the variance can either decrease for larger k as well
    depending on the model---no one is completely sure what to expect! One thing
    that is certain: larger values of k require training more models, so often
    k=5 or k=10 is the largest you might be able to do in practice (if you can
    use it at all)!
  </p>
</section>

<style>
  /* mobile */
  @media screen and (max-width: 950px) {
  }
</style>
