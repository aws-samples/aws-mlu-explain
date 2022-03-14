<script>
</script>

<section> 

  <p class="body-text">
    In our <a href="https://mlu-explain.github.io/precision-recall-f1/">previous article discussing evaluating classification models</a>, we discussed the important consequences of favoring false positives to false negatives (or vice versa). Left unmentioned were two closely-related concepts, the Radio Operator Curve, (often called just the *ROC Curve*), and *AUC* (which stands for ‘Area under the ROC Curve’). These concepts go hand-in-hand with our previous discussion, and are important for informed evaluation of classification models. 
  <br><br>
The ROC Curve is composed by plotting the True-Positive Rate (TPR) versus the False-Positive Rate (FPR) for different classification threshold, where
<br><br>
TPR = TP / TP + FN
and
FPR = FP / FP + TN
<br><br>
These classification thresholds are a function of your models predictions, so a model with a different threshold will be a different point on our ROC curve. 
<br><br>
To make this concept more clear, we’ll imagine that we’re trying to predict bananas from apples using just the item’s weight.
Recall that ROC Curve is composed by plotting the TPR versus the FPR for different classification thresholds. That bit may sound a bit confusing, so we’ll step through the process to make it clear, visualizing our ROC curve directly:
  </p>
</section>

<style>
    /* .body-text {
        max-width: 45rem;
        margin: 0 auto;
        text-align: left;
        font-size: 21px;
        line-height: 1.5em;
        font-family: "Amazon Ember Mono"
        } */
</style>