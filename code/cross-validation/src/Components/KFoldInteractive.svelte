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

<h1 class="body-header">Try For Yourself</h1>
<p class="body-text">
  To k-folds cross-validation more clear, we’ll see how the process works
  directly. Let’s assume that we’d like to use a one-dimensional linear
  regression model to predict the price of a house from its square-footage. Drag
  the value of k for yourself to set the number of folds. Observe that each fold
  results in a new data split alongside a newly trained model.
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
  When exploring the fit models above, you may have observed something
  interesting! The lines of best fit across our folds vary more for lower values
  of k than for higher values of k. This is a result of our old friend, the bias
  variance tradeoff (https://mlu-explain.github.io/bias-variance/). Read on to
  learn more!
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
