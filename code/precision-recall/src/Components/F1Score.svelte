<script>
  import { onMount } from "svelte";
  import { f1Precision, f1Recall } from "./data-store.js";
  import katexify from "../katexify";
  import Heatmap from "./Heatmap.svelte";
  import Slider from "./Slider.svelte";
  import { select, selectAll } from "d3-selection";
  import { format } from "d3-format";
  import HeatmapLegend from "./HeatmapLegend.svelte";

  const formatter = format(".2f");

  // math equations
  const f1Eq = `\\begin{aligned}
    F_1 = \\frac{2\\cdot\\mathrm{Precision}\\cdot\\mathrm{Recall}}{\\mathrm{Precision}+\\mathrm{Recall}} 
    \\end{aligned}`;
  const f1Eq2 = `\\begin{aligned}\\frac{\\mathrm{TP}}{\\mathrm{TP} + \\frac{1}{2}(\\mathrm{FP} + \\mathrm{FN})}\\end{aligned}.`;
  $: f1Score =
    (2 * parseFloat($f1Precision) * parseFloat($f1Recall)) /
    (parseFloat($f1Precision) + parseFloat($f1Recall));
  $: f1EqReactive = `\\begin{aligned}    
    F_1 = \\frac{(2 \\cdot ${formatter($f1Precision)} \\cdot ${formatter(
    $f1Recall
  )})}{${formatter($f1Precision)} + ${formatter($f1Recall)} }
    = ${formatter(f1Score)}
    \\end{aligned}`;

  onMount(() => {
    // default .5 .5 rect to be highlighted
    selectAll("rect.f1-rect")
      .filter(function (d) {
        return select(this).attr("precision") == 0.5;
      })
      .filter(function (d) {
        return select(this).attr("recall") == 0.5;
      })
      .attr("stroke", "black")
      .attr("stroke-width", 3)
      .raise();
  });

  $: {
    // reset strokes first
    selectAll("rect.f1-rect").attr("stroke", "none");
    // highlight rect corresponding to current f1 score
    selectAll("rect.f1-rect")
      .filter(function (d) {
        return select(this).attr("precision") == $f1Precision;
      })
      .filter(function (d) {
        return select(this).attr("recall") == $f1Recall;
      })
      .attr("stroke", "black")
      .attr("stroke-width", 4)
      .raise();
  }
</script>

<h1 class="body-header">The F1-Score</h1>
<p class="body-text">
  Given this competing tradeoff, it would be very convenient to have a single
  performance metric that takes into account <i>both</i> precision and recall.
  And, given that I wrote that sentence in the first place, you can probably
  guess that there is. And that it's called the
  <span class="bold">F1-score</span>... Nice.
  <br /><br />

  The F1-score (also sometimes called the <i>F-Measure</i>) is a single
  performance metric that takes both precision and recall into account. It's
  calculated by taking the harmonic mean of the two metrics::
  {@html katexify(f1Eq, true)}
  which is equivalent to
  {@html katexify(f1Eq2, true)}
</p>
<p class="body-text">
  For this reason, it takes values from zero to one, with values closer to one
  indicating better performance, and values closer to zero indicating poorer
  performance. In situations where <i>either</i> precision or recall are poor,
  the F1-score will also be poor. Only when <i>both</i> precision and recall have
  good performance will the F1-score be high. To see for yourself, try toggling the
  various values of precision and/or recall below. Or hover over the corresponding
  region to see the corresponding F1-score, and the precision and recall values used
  to obtain it:
</p>

<div id="heatmap-container">
  <div id="f1-container">
    <Heatmap />
    <HeatmapLegend />
  </div>
  <div id="f1-equations">
    {@html katexify(f1EqReactive, true)}
    <Slider label="Precision" value={f1Precision} />
    <Slider label="Recall" value={f1Recall} />
  </div>
</div>
<br />
<br />
<p class="body-text">
  The F1-score is a great way to compare the performance of multiple
  classifiers. When choosing between multiple models, all with varying values of
  precision and/or recall, it may be used to determine which one produces the
  'best' results for the problem at hand. For this reason, it's often used in
  practice as a metric by which to rank models by performance.
  <br /><br />
  That said, the F1-score isn't perfect, and isn't suitable for every classification
  problem. For one, it completely ignores true negatives in its calculations, so
  it's misleading for unbalanced classes. (Indeed, this is true for precision and
  recall as well, so if true negatives are important, consider a different metric
  such as specificity). The F1-score also gives equal importance to precision and
  recall. This is sometimes problematic because, as previously discussed, different
  types of mis-classifications incur different costs, and these costs themselves
  are tied deeply to the performance of the model.
</p>

<style>
  #heatmap-container {
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
  #f1-container {
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
  }

  #f1-equations {
    display: flex;
    flex-direction: column;
    margin: auto;
    align-items: center;
    vertical-align: middle;
    height: 60%;
    width: 100%;
    text-align: center;
    justify-content: center;
  }

  /* mobile */
  @media screen and (max-width: 950px) {
    #heatmap-container {
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
    #f1-equations {
      display: grid;
      grid-template-columns: 100%;
      grid-template-rows: 30% 23% 23%;
      column-gap: 0.2rem;
      align-items: center;
      height: 100%;
      width: 70%;
      margin: 2rem auto;
      text-align: center;
    }

    #f1-equations {
      font-size: 0.95rem;
    }
  }
</style>
