<script>
  import katexify from "../katexify";
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
    Let's start first with how k affects bias. To qualify our discussion of bias,
    we'll look at the true test error of a model as a function of the size of the
    dataset it's trained on. That is, we refer to bias here as the shift in accuracy
    that a model gets when trained on less data,
    {@html katexify(
      `\\\mathbb{E}\\left[\\mathcal{E}(\\hat f)\\right]-\\mathbb{E}\\left[\\mathcal{E}(\\hat f_k)\\right]`,
      false
    )}, and not the systematic bias in the predictions (as the term is normally
    applied in machine learning).
    <br /><br />
    With {@html katexify(`k = 2`, false)}, we use only a handful of the
    available data for model training, usually around 60 percent of the data. On
    the other hand,the training set for LOOCV uses almost the entire dataset,
    all {@html katexify(`n - 1`, false)} observations, to train our model. As such,
    LOOCV gives us approximately unbiased estimates of our test error. In general,
    K-Folds Cross-Validation will use a training set with {@html katexify(
      `(k - 1) * n / k`,
      false
    )} observations. Then, as our value of {@html katexify(`k`, false)} increases,
    the bias of our estimates should theoretically decrease, as larger training datasets
    should better approximate the test error. Under this framework, common choices
    of {@html katexify(`k`, false)}, like {@html katexify(`k = 5`, false)} or {@html katexify(
      `k = 10`,
      false
    )}, will yield intermediate levels of bias, and low values should yield
    high. Therefore, if we want to reduce the contribution of bias to our
    evaluation estimates, we can increase {@html katexify(`k`, false)},
    increasing the data each model sees during training. It's important to not
    get confused about what we're discussing here: the bias here refers to our
    estimate of the test error from what we see during training/validation (not
    the bias of the test error itself, which is not affected by the size of our
    training data.
    <br /><br />
    <span class="bold">Variance</span>
    <br />
    The effect the value of {@html katexify(`k`, false)} has on the variance of our
    estimates is where things get more complex. It's often argued that the larger
    our value of {@html katexify(`k`, false)}, the higher the variance of our
    estimates, with LOOCV having very high variance.<sup>[1][2]</sup>. The
    oft-cited intuition here is that the variance should be higher for larger {@html katexify(
      `k`,
      false
    )}, since each model is trained on nearly identical data, meaning that every
    model should be essentially the same. However, this intuition isn't always
    correct and can depend heavily on the type of model and dataset used! For
    instance, [1] shows that for linear regression LOOCV actually has the
    smallest asymptotic bias and variance amongst all choices of {@html katexify(
      `k`,
      false
    )} in K-fold Cross-Validation. One thing is certain: higher values of k require
    training more models, so often {@html katexify(`k=5`, false)}or {@html katexify(
      `k=10`,
      false
    )} is the largest you might be able to do in practice. K-fold Cross-Validation
    can be an excellent tool to help improve estimates of test error rates compared
    to a simple validation set, however it does not completely solve the issue.
  </p>
</section>
