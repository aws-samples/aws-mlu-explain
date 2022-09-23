<script>
</script>

<section>
  <h1 class="body-header">
    <span class="section-arrow">&gt; </span> Concerns With Selecting K
  </h1>
  <p class="body-text">
    Up to this point, we’ve talked about K-Folds Cross-Validation in the general
    sense, and described the two most-extreme cases: LOOCV (k = n) and the
    Validation Set Approach (k = 2). Given the different options for selecting
    k, how do we select the best value? This question is actually more complex
    than it may seem! In answering it, we'll revisit our old friend, the <a
      href="https://mlu-explain.github.io/bias-variance/"
      >Bias Variance Tradeoff</a
    >, to understand how different values of k affect the quality of our
    evaluation estimates.
    <br /><br />
    <span class="bold">Bias</span>
    <br />
    Let's start first with how k affects bias. When k = 2, we use only a handful
    of the available data for model training, usually around 60 percent of the data.
    On the other hand,the training set for LOOCV uses almost the entire dataset,
    all n-1 observations, to train our model. Thus, LOOCV gives us approximately
    unbiased estimates of our test error. In general, K-Folds Cross Validation will
    use a training set with (k - 1) * n observations. Then, as our value of k increases,
    the bias of our estimates should theoretically decrease, as larger training datasets
    should better approzimate the test error. Under this framework, common choices
    of k, like k = 5 or k = 10, will yield intermediate levels of bias, and low values
    should yield high. Therefore, if we want to reduce the contribution of bias to
    our evaluation estimates, we can increase k, increasing the data each model sees
    during training. It's important to not get confused about what we're discussing
    here: the bias here refers to our estimate of the test error from what we see
    during training/validation. We're not discussing the bias of the test error itself,
    E(hatfx) - f(x), which is not affected by the size of our training data.
    <!-- <br />
    the validation set approach can lead to overestimates of the test error rate,
    since in this approach the training set used to fit the statistical learning
    method contains only half the observations of the entire data set. Using this
    logic, it is not hard to see that LOOCV will give approximately unbiased estimates
    of the test error, since each training set contains n−1 observations, which is
    almost as many as the number of observations in the full data set. And performing
    k-fold CV for, say, k = 5 or k = 10 will lead to an intermediate level of bias,
    since each training set contains approximately (k − 1)n/k observations— fewer
    than in the LOOCV approach, but substantially more than in the validation set
    approach. Therefore, from the perspective of bias reduction, it is clear that
    LOOCV is to be preferred to k-fold CV. -->
    <br /><br />
    <span class="bold">Variance</span>
    <br />
    The effect the value of k has on the variance of our estimates is where things
    get more complex. It's often argued that the larger our value of k, the higher
    the variance of our estimates, with LOOCV having very high variance.<sup
      >[kohavi]</sup
    ><sup>[esl]</sup>. The oft-cited intuition here is that the variance should
    be higher for larger k, since each model is trained on nearly identical
    data, meaning that every model should be nearly the same. However, other
    researchers have demonstrated that this isn't true, and that LOOCV actually
    has the smallest asymptocic bias
    <i>and</i>
    variance for many models<sup>[zhang, yang</sup>, <sup>burman]</sup>. From
    their research, they saw that the that models worsen in variability for high
    k are a result when model selection is involved:
    <span id="quote"
      >" ...if model selection is involved, the performance of LOO worsens in
      variability as the model selection uncertainty gets higher due to large
      model space, small penalty coefficients and/or the use of data-driven
      penalty coefficients"</span
    >. We present both views here without taking a strong stance, and advise
    only that you spend time for yourself understanding how such tradeoffs
    manifest in your datasets.

    <br /><br />
    We present both views without taking a strong stance, as regardless of what you
    believe,
    <!-- old -->
    <!-- is a bit more subtle. Classical arguments [XX] claim that the variance should
    be higher for larger k since each model is trained on nearly identical data meaning
    that every model should be nearly the same. However in [XX, YY, ZZ] it has been
    shown that in many cases the variance can either decrease for larger k as well
    depending on the model---no one is completely sure what to expect!  -->

    one thing is certain: higher values of k require training more models, so
    often k=5 or k=10 is the largest you might be able to do in practice (if you
    can use it at all)!
  </p>
</section>

<style>
  #quote {
    font-style: italic;
    margin: 1rem;
  }
  /* mobile */
  @media screen and (max-width: 950px) {
  }
</style>
