<script>
  // "katexify" function
  import {
    absError,
    mseBias,
    mseWeight,
    mseError,
    rSquared,
    RSS,
    TSS,
  } from "../store";
  import { format } from "d3-format";
  import katexify from "../katexify";
  import MSEScatterplot from "./MSEScatterplot.svelte";
  import { tooltip } from "../tooltip";
  let mseScatterClass;

  // label formatter
  const formatter = format(".2f");
</script>

<h1 class="body-header">Model Evaluation</h1>
<p class="body-text">
  <span class="bold">Mean-Squared Error (MSE)</span>
  <br />
  To train an accurate linear regression model, we need a way to quantify how good
  (or bad!) our model performs. In machine learning, we call such performance-measuring
  functions <i>loss functions</i>. Several popular loss functions exist for
  regression problems. To measure our model's performance, we'll use one of the
  most popular:
  <span class="bold">mean-squared error</span> (MSE).
  <br /><br />
  MSE quantifies how close a regression line is to a set of points. It does this
  by summing up the squared distances from the points to the regression line (the
  red residuals we saw in the scrolly above) and averaging them across the number
  of data points:{@html katexify(
    `\\begin{aligned} MSE = \\frac{1}{n} \\Sigma^{n}_{i=1}(y_i - \\hat{y_i})^2 \\end{aligned}`,
    true
  )}
  <br />
  The name is quite literal: we take the mean of the squared errors. The squaring
  of errors prevents negative and positive terms from canceling out in the sum, and
  gives more weight to points further from the regression line, effectively punishing
  outliers. In practice, we'll fit our regression model to a set training data, and
  evaluate it's performance using MSE on the test dataset.
  <br /><br />But while MSE instills an L2 norm on our error (l2 norm), there's
  nothing stopping us from trying an L1 norm instead: (). This is called
  <span class="bold">Mean Absolue Error</span> To build intuition for yourself, try
  changing the weight and bias terms below to see how the MSE grows for poorly fit
  models:
</p>
<br /><br />
<div id="mse-container">
  <div id="equations-container">
    <!-- <p class="body-text">
      Explore MSE for yourself by seeing how updatng the weight and bias terms
      affect the MSE (and performance) of our model.
    </p> -->
    <div id="buttons-container">
      <button on:click={() => mseScatterClass.shuffleData()}
        >Shuffle Data</button
      >
    </div>
    <div id="weight-slider">
      <div class="input-container">
        <p>Weight: {$mseWeight}</p>
        <input
          type="range"
          min="-1.5"
          max="6"
          step=".01"
          bind:value={$mseWeight}
          class="slider"
          id="myRange"
        />
      </div>
    </div>
    <div id="bias-slider">
      <div class="input-container">
        <p>Bias: {$mseBias}</p>
        <input
          type="range"
          min="-1"
          step="-1"
          max="16"
          bind:value={$mseBias}
          class="slider"
          id="myRange"
        />
      </div>
    </div>
    <br />
    <div id="equation-math">
      For Our model: {@html katexify(
        `\\hat{y} = ${$mseWeight}x${$mseBias < 0 ? "" : "+"}${$mseBias}`
      )}
    </div>
    <br />
    <div id="equation-math">
      {@html katexify(
        `\\begin{aligned} MSE = \\frac{1}{n} \\Sigma^{n}_{i=1}(y - (${$mseWeight}x${
          $mseBias < 0 ? "" : "+"
        }${$mseBias}))^2 = ${formatter($mseError)} \\end{aligned}`
      )}
    </div>
    <div id="equation-math">
      {@html katexify(
        `\\begin{aligned} MAE = \\frac{1}{n} \\Sigma^{n}_{i=1}\\lvert(y - (${$mseWeight}x${
          $mseBias < 0 ? "" : "+"
        }${$mseBias}))\\rvert = ${formatter($absError)} \\end{aligned}`
      )}
    </div>
    <div id="equation-math">
      {@html katexify(
        `\\begin{aligned} R^2 = 1 - \\frac{${$RSS}}{${$TSS}}  = ${formatter(
          $rSquared
        )} \\end{aligned}`
      )}
    </div>
  </div>
  <div id="charts-container">
    <div id="mse-chart-regression">
      <MSEScatterplot bind:this={mseScatterClass} />
    </div>
  </div>
</div>
<br /><br />

<br /><br />
<p class="body-text">
  <span class="bold">Selecting An Evaluation Metric</span><br />
  It is not a rule to use MSE for evaluating regression models. The evaluation metric
  should reflect whatever it is you actually care about when making predictions.
  For example, when we use MSE, we are implicitly saying that we think the cost of
  our prediction error should reflect the quadratic (squared) distance between what
  we predicted and what is correct. This may work well if we want to punish outliers,
  but comes at the cost of interpretability: we output our error in squared units.
  If we want error to reflec the linear distance between what we predicted and what
  is correct, we could try a different method, like Mean Abosulte Error (MAE). If
  our concern is with interpeting our error, we could use RMSE or MAE, but not that
  these too offer different assumptions about what we care about.<span
    class="info-tooltip"
    title="We could also
        try an entirely different class of evaluation methods that look at the goodness of fit, such as R-squared. Although this isn't
        as important for machine learning where our main concern is predictive accuracy,
        and we can just use cross-validation train/test splits."
    use:tooltip
    >[&#8505;]
  </span>
  The main thing to takeaway here is that many methods exist for evaluating regression
  models, each with different concerns around interpretability, theory, and usability.
  <br /><br />
  <!-- The performance measure should reflect what you actually care about when making
  predictions. E.g. choose MSE if you think that the badness/cost of a prediction
  increases quadratically with its distance from the true value, or MAE if you think
  it increases linearly. Other factors might come into play as well, like choosing
  a common metric in order to compare your results to past work. In all cases, you
  should choose the performance measure (or multiple measures) ahead of time, based
  on your actual interests. Then, see how the results turn out. You shouldn't fiddle
  with the metric in order to get an answer you've already decided is true. Some
  other considerations: The relative performance of the different regression methods
  can depend on the the fraction of points that are outliers, as well as how the
  outliers are distributed (e.g. how far they tend to lie from the inliers). It's
  worth exploring a range of these parameters in your code, because the results you
  find for a single setting might not apply to another. Robust regression methods
  would be expected to show a greater advantage as the frequency and severity of
  outliers increase. When measuring test set prediction error, it's worth thinking
  about whether the test set should contain outliers. If yes, you're asking about
  predictive performance on the same distribution as the training data (a 'contaminated'
  mix of inliers and outliers). If no, you're asking how well a model trained on
  a contaminated mix fits the inliers alone (which is presumably the distribution
  of interest). Both are valid approaches, but they address different questions.
  Outlier-free test sets would probably tend to show a greater difference between
  robust and non-robust regression methods. Besides prediction, you might also be
  interested in inference. I.e. how closely can you recover the true parameters of
  the (inlier) data generating process? For example, suppose the inliers are generated
  as 𝑦𝑖=𝛽𝑇𝑥𝑖+𝜖𝑖 and you fit coefficients 𝛽̂ to a training set containing a mix of
  inliers/outliers. The squared Euclidean distance ‖𝛽−𝛽̂ ‖22 is one way to quantify
  how well the estimated coefficients match the true values. -->
</p>

<style>
  #mse-container {
    display: grid;
    grid-template-columns: 50% 50%;
    font-family: var(--font-mono);
    margin: auto;
    max-width: 1000px;
    height: 50vh;
    max-height: 500px;
    justify-content: center;
  }

  #equations-container {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  #buttons-container {
    display: flex;
    margin: 8px auto;
    justify-content: space-around;
    align-items: center;
    width: 90%;
  }

  .input-container {
    display: flex;
    flex-direction: row;
    margin: 8px auto;
    justify-content: space-around;
    align-items: center;
    width: 70%;
  }

  button {
    background-color: var(--smile); /* Green */
    border: none;
    color: white;
    padding: 8px 16px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    margin: 4px 2px;
    cursor: pointer;
  }

  button:hover {
    outline: 2px solid var(--squidink);
  }

  button:active {
    color: var(--squidink);
  }

  button:visited {
    color: var(--white);
  }

  #charts-container {
    display: grid;
    grid-template-columns: 100%;
    grid-column-gap: 0rem;
    grid-template-rows: 100%;
    padding-right: 1rem;
    height: 50vh;
    max-height: 400px;
  }

  #mse-chart-regression {
    width: 100%;
    height: 100%;
  }

  /* mobile */
  @media screen and (max-width: 950px) {
    #mse-container {
      display: grid;
      grid-template-columns: 100%;
      margin: auto;
      max-width: 100%;
      width: 100%;
      /* border: 1px solid black; */
      height: 70vh;
      max-height: 100vh;
    }

    #charts-container {
      max-width: 100%;
    }
  }
</style>
