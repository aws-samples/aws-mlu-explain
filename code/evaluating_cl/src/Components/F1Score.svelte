<script>
  import { f1Precision, f1Recall } from './data-store.js';
  import katexify from '../katexify';
  import Heatmap from "./Heatmap.svelte"
  import Slider from "./Slider.svelte"
  import { select, selectAll } from 'd3-selection';
  import { format } from "d3-format";

  const formatter = format(".2f") 
	
	// math equations
  const f1Eq = `\\begin{aligned} F1 = \\frac{(2 * Precision * Recall)}{Precision + Recall} \\end{aligned}`
  $: f1Score = (2 * parseFloat($f1Precision) * parseFloat($f1Recall)) / (parseFloat($f1Precision) + parseFloat($f1Recall));
  $: f1EqReactive =  `\\begin{aligned}    
  F1 = \\frac{(2 * Precision * Recall)}{Precision + Recall} = \\frac{(2 * ${formatter($f1Precision)} * ${formatter($f1Recall)})}{${formatter($f1Precision)} + ${formatter($f1Recall)} }
  = ${formatter(f1Score)}
  \\end{aligned}`

  $: {
    // reset strokes first
    selectAll('rect.f1-rect').attr('stroke', 'none')
    // highlight rect corresponding to current f1 score
    selectAll('rect.f1-rect')
      .filter(function(d) { return select(this).attr('precision') == $f1Precision})
      .filter(function(d) { return select(this).attr('recall') == $f1Recall})
      .attr('stroke', 'black')
      .attr('stroke-width', 4)
      .raise();

  }

</script>


<h1 class='body-header'>F1-Score</h1>
<p class='body-text'>Anytime you're deploying a machine learning that uses classification, you should pay special attention to the goals and objectives of the model,
  and the previously discussed tradeoff. However, in some instances (e.g online machine learning competitions), your primary modeling objective is just to
  maximize accuracy. 
</p>
<p class="body-text">
  The F1-score combines the precision and recall of a classifier into a single metric by taking their harmonic mean. It is primarily used to compare the performance of two classifiers. Suppose that classifier A has a higher recall, and classifier B has higher precision. In this case, the F1-scores for both the classifiers can be used to determine which one produces better results.

The F1-score of a classification model is calculated as follows:
: {@html katexify(f1Eq, true)}

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
<div id="f1-container">
  <Heatmap />
  <div id="f1-equations">
    {@html katexify(f1EqReactive, true)}
    <Slider label="Precision" value={f1Precision}/>
    <Slider label="Recall" value={f1Recall}/>
  </div>
</div>



<style>
  #f1-container{
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 68% 32%;
    row-gap: 3rem;
    margin: auto;
    align-items: center;
    height: 75vh;
    width: 70%;
    margin: auto;
    margin-top: 1rem;
    /* border: 1px solid green; */
  }

  #f1-equations{
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 30% 20% 20%;
    column-gap: .1rem;
    margin: auto;
    align-items: center;
    height: 100%;
    width: 100%;
    margin: 2rem 0;
    /* border: 1px solid blue; */
    text-align: center;
  }

  /* mobile */
  @media screen and (max-width: 768px) {
        #f1-container {
          width: 100%;
          height: 95vh;
        }

        .katex, #f1-equations {
          font-size: .75rem;
        }
  }
</style>