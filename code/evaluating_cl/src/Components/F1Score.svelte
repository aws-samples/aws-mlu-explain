  <script>
    import { onMount } from 'svelte';
    import { f1Precision, f1Recall } from './data-store.js';
    import katexify from '../katexify';
    import Heatmap from "./Heatmap.svelte"
    import Slider from "./Slider.svelte"
    import { select, selectAll } from 'd3-selection';
    import { format } from "d3-format";
    import HeatmapLegend from "./HeatmapLegend.svelte"

    const formatter = format(".2f") 
    
    // math equations
    const f1Eq = `\\begin{aligned} F1 = \\frac{(2 * Precision * Recall)}{Precision + Recall} \\end{aligned}`
    $: f1Score = (2 * parseFloat($f1Precision) * parseFloat($f1Recall)) / (parseFloat($f1Precision) + parseFloat($f1Recall));
    $: f1EqReactive =  `\\begin{aligned}    
    F1 = \\frac{(2 * ${formatter($f1Precision)} * ${formatter($f1Recall)})}{${formatter($f1Precision)} + ${formatter($f1Recall)} }
    = ${formatter(f1Score)}
    \\end{aligned}`


    onMount(() => {
      // default .5 .5 rect to be highlighted
      selectAll('rect.f1-rect')
          .filter(function(d) { return select(this).attr('precision') == 0.5})
          .filter(function(d) { return select(this).attr('recall') == 0.5})
          .attr('stroke', 'black')
          .attr('stroke-width', 3)
          .raise();
    });

    


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


  <h1 class='body-header'>The F1-Score</h1>
  <p class='body-text'>
    Of course, given this potential, competing tradeoff, it sure would be convenient to have a single performance metric that takes into account <i>both</i> precision and recall.
    And, given that I wrote that sentence in the first place, you can probably guess that there is. Also, since this section is itself titled <span class='bold'>F1-Score</span>,
    you've probably guessed that's the name of the metric. In which case you'd be right on all counts. Nice.
    <br><br>

    The F1 Score (also called the, "F-Measure") is a single performance metric that takes both precision and recall into account. 
    It's calculated by taking the harmonic mean of the two metrics::
      {@html katexify(f1Eq, true)}
     </p>
  <p class="body-text">
    For this reason, it takes values from zero to one, where values closer to one indicate better performance, and values closer to zero indicate poor performance.
    In situations where either precision <i>or</i> recall are poor, the F1 score will also be poor. Only when both precision <i>and</i> recall have good performance 
    will the F1-Score be high. 
    To see for yourself, try toggling the various values of precision and/or recall below. Or hover over the corresponding region to see the 
    corresponding F1-Score, and the precision and recall values used to obtain it:
  </p>


  <div id="heatmap-container">
    <div id="f1-container">
        <Heatmap />
        <HeatmapLegend />
      </div>
    <div id="f1-equations">
      {@html katexify(f1EqReactive, true)}
      <Slider label="Precision" value={f1Precision}/>
      <Slider label="Recall" value={f1Recall}/>
    </div>
  </div>
  <br />
  <br />
  <p class="body-text">
    The F1-score is a great way to compare the performance of multiple classifiers.
    When choosing between multiple models, all with varying values of precision and/or recall, it may be used to determine which one produces the 'best' results
    for the problem at hand. For this reason, it's often used in practice as a metric by which to 'rank' models by performance. But it's not perfect, and not suitable for all 
    classification problems. For one,
    it completely ignores True Negatives in its calculations, so it's misleading for unbalanced classes. (Indeed, this is true for Precision and Recall as well. 
    When True Negatives are important, consider other metrics, like Specificity or ).
    The F1-Score also gives equal importance to precision and recall. This is sometimes problematic because, as previously discussed,
    different types of mis-classifications incur different costs, and the relative importances of these costs is an aspect itself of the problem.
  </p>




  <style>
     #heatmap-container{
      display: grid;
      grid-template-columns: 75% 20%;
      grid-template-rows: 100%;
      column-gap: 1rem;
      align-items: center;
      height: 65vh;
      width: 70%;
      margin: 1.5rem auto;
      margin-top: 1rem;
    }
    #f1-container{
      display: grid;
      grid-template-columns: 80% 10%;
      grid-template-rows: 100%;
      column-gap: 0rem;
      margin: auto;
      align-items: center;
      height: 60vh;
      width: 100%;
      margin: 1.5rem auto;
      margin-top: 1rem;
      /* border: 2px solid red; */
    }

    #f1-equations{
      display: flex;
      flex-direction: column;
      margin: auto;
      align-items: center;
      vertical-align: middle;
      height: 60%;
      width: 100%;
      text-align: center;
      justify-content: center;
      /* border: 2px solid red; */
    }


    /* mobile */
    @media screen and (max-width: 950px) {
          #heatmap-container{
            width: 100%;
            height: 95vh;
            display: grid;
            grid-template-columns: 100%;
            grid-template-rows: 68% 32%;
            row-gap: 1.5rem;
            margin: auto;
            align-items: center;
            margin: auto;
            margin-top: 1rem;
          }
          #f1-equations{
            display: grid;
            grid-template-columns: 100%;
            grid-template-rows: 30% 23% 23%;
            column-gap: .2rem;
            align-items: center;
            height: 100%;
            width: 70%;
            margin: 2rem auto;
            text-align: center;
          }

          .katex, #f1-equations {
            font-size: .95rem;
          }
    }
  </style>