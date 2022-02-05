<script>
  import { TP, FP, TN, FN } from './data-store.js';

  let countValue;

  TP.subscribe(value => {
    countValue = value;
  });

  function handleClick() {
    $TP += 1;
  }

</script>

  <button on:click={handleClick}>
  Clicked { countValue } times</button>


<h1 class='body-header'>F1-Score</h1>
<p class='body-text'>This component is a scope example of a D3 chart.
    It's pretty simple.
</p>
<p class="body-text">
    The F1-score combines the precision and recall of a classifier into a single metric by taking their harmonic mean. It is primarily used to compare the performance of two classifiers. Suppose that classifier A has a higher recall, and classifier B has higher precision. In this case, the F1-scores for both the classifiers can be used to determine which one produces better results.

The F1-score of a classification model is calculated as follows:
Anytime you're deploying a machine learning that uses classification, you should pay special attention to the goals and objectives of the model,
and the previously discussed tradeoff. However, in some instances (e.g online machine learning competitions), your primary modeling objective is just to
maximize accuracy. 
  </p>

  <div id="static-chart"></div>
  <p class="body-text">
    Above, you can compute the entropy of a collection of labeled data
    points belonging to two classes, which is typical for
    <span class="bold">binary classification</span> problems. Click on the
    <span class="bold">Add</span> and
    <span class="bold">Remove</span> buttons to modify the composition of
    the bubble.
  </p>


<style></style>