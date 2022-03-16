<script>
  import MulticlassConfusionMatrix from "./MulticlassConfusionMatrix.svelte";
</script>


<h1 class='body-header'>What About Multiclass?</h1>
<p class='body-text'>This component is a scope example of a D3 chart.
    It's pretty simple.
</p>
<p class="body-text">
    The F1-score combines the precision and recall of a classifier into a single metric by taking their harmonic mean. It is primarily used to compare the performance of two classifiers. Suppose that classifier A has a higher recall, and classifier B has higher precision. In this case, the F1-scores for both the classifiers can be used to determine which one produces better results.

The F1-score of a classification model is calculated as follows:
  </p>
  <br>
  <MulticlassConfusionMatrix />
  <br>
  <p class="body-text">
    Above, you can compute the entropy of a collection of labeled data
    points belonging to two classes, which is typical for
    <span class="bold">binary classification</span> problems. Click on the
    <span class="bold">Add</span> and
    <span class="bold">Remove</span> buttons to modify the composition of
    the bubble.
    So far our discussions have been limited to binary classification.
    However, most classification purposes require classifying more than two things!
    Don't worry - all of the methods discussed can easily be extended to the multiclass setting. 
    (We just kept things binary for easy-to-follow visual explanations).
    A multiclass confusion matrix simply adds a row/column for each class. 
    The other discussed concepts, Precision, Recall, etc. can simply be calculated using averages.
    For example, here's 
    a four-class confusion matrix:
    <!-- 4-class matrix w equations -->
    or exemplary reasoins, the previous were just binary. nut applying to multiclass extending to multiclass is trivial.
    take the following multiclass confusion matrix: (note now that each column... blah)

    to calculate precision or recall, an appropriate measure is to___, ____.
  </p>


<style></style>