<script>
  // "katexify" function
  import { mseBias, mseWeight, mseError } from "../store";
  import { format } from "d3-format";
  import katexify from "../katexify";
  // import GradientDescentScatterplot from "./GradientDescentScatterplot.svelte";
  // import GradientDescentErrorPlot from "./GradientDescentErrorPlot.svelte";
  import MSEScatterplot from "./MSEScatterplot.svelte";

  let mseScatterClass;
  // math equations
  const math1 = "ax^2+bx+c=0";
  // label formatter
  const formatter = format(".2f");
</script>

<h1 class="body-header">Mean-Squared Error (MSE)</h1>
<p class="body-text">
  To train an accurate linear regression model, we need a way to quantify how
  good (or bad) our model performs. In machine learning, we call such
  performance-measuring functions <i>loss functions</i>. Several popular loss
  functions exist for regression problems. To measure our model's performance,
  we'll use one of the most popular:
  <span class="bold">mean-squared error</span> (MSE).
  <br /><br />
  MSE quantifies how close a regression line is to a set of points. It does this
  by summing up the squared distances from the points to the regression line (these
  distances represent errors and are called 'residuals') and averaging them across
  the number of data points: {@html katexify(
    `MSE = \\Sigma^{n}_{i=1}(y - y)^2`,
    true
  )}
  <br />
  The name is quite literal: we take the mean of the squared errors. The squaring
  of errors prevents negative and positive terms from canceling out in the sum, and
  gives more weight to points further from the regression line, effectively punishing
  outliers. The name is quite literal: we take the mean of the squared errors, and
  so the lower the MSE, the better fit the model. To build intuition for yourself,
  try changing the weight and bias terms below to see how the MSE grows for poorly
  fit models:
</p>
<br /><br />
<div id="mse-container">
  <div id="equations-container">
    <p class="body-text">
      <!-- Let's see how Gradient Descent works directly for our linear regression
      model. We'll use the algorithm to identify which values for our bias and
      weight we should select. Click the buttons to run 1, 10, or 50 steps of
      gradient descent, and see the line update live. The error for each
      iteration will be shown in the bottom error chart. -->
    </p>
    <div id="buttons-container">
      <button on:click={() => mseScatterClass.shuffleData()}>New Data</button>
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
    <div id="equation-math">
      Our model: {@html katexify(
        `y = ${$mseWeight}x${$mseBias < 0 ? "" : "+"}${$mseBias}+c`
      )}
    </div>
    <div id="equation-math">
      MSE: {@html katexify(
        `\\Sigma^{n}_{i=1}(y - (${$mseWeight}x${
          $mseBias < 0 ? "" : "+"
        }${$mseBias}))^2 = ${formatter($mseError)}`
      )}
    </div>
  </div>
  <div id="charts-container">
    <div id="mse-chart-regression">
      <MSEScatterplot bind:this={mseScatterClass} />
    </div>
    <div id="mse-chart-error">
      <!-- <GradientDescentErrorPlot bind:this={mseErrorClass} /> -->
    </div>
  </div>
</div>
<p class="body-text">
  MSE is by no means the only evaluation metric suitable for linear regression,
  and is itself not always a suitable choice. There are a lot of different error
  metrics for regression models, each with different concerns around
  interpretability, theory, and usability.
</p>

<style>
  #mse-container {
    display: grid;
    grid-template-columns: 50% 50%;
    font-family: var(--font-mono);
    margin: auto;
    max-width: 1000px;
    /* border: 1px solid black; */
    height: 70vh;
    max-height: 500px;
  }

  #equations-container {
    text-align: center;
    /* display: flex; */
    flex-direction: column;
    /* border: 1px solid red; */
    /* justify-content: center; */
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
    /* border: 1px solid red; */
  }

  #charts-container {
    /* border: 1px solid blue; */
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
    /* grid-row-gap: 3rem; */
    grid-column-gap: 0rem;
    grid-template-rows: 60% 40%;
    height: 80vh;
    padding-right: 1rem;
    height: 70vh;
    max-height: 500px;
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
