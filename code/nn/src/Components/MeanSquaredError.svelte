<script>
  import { mseBias, mseWeight, mseError, rSquared, RSS, TSS } from "../store";
  import { format } from "d3-format";
  import katexify from "../katexify";
  import MSEScatterplot from "./MSEScatterplot.svelte";
  import { tooltip } from "../tooltip";
  let mseScatterClass;

  // label formatter
  const formatter = format(".2f");
</script>

<section>
  <h1 class="body-header">Model Evaluation</h1>
  <p class="body-text">
    <br />
    To train an accurate linear regression model, we need a way to quantify how good
    (or bad) our model performs. In machine learning, we call such performance-measuring
    functions <i>loss functions</i>. Several popular loss functions exist for
    regression problems.<sup
      ><span
        class="info-tooltip"
        title="You can actually use whatever you want, as long as minimizing it achieves your goal."
        use:tooltip
        >[&#8505;]
      </span></sup
    >
    To measure our model's performance, we'll use one of the most popular: mean-squared
    error (MSE).
    <br /><br />
    <span class="bold">Mean-Squared Error (MSE)</span>
    <br />
    MSE quantifies how close a predicted value is to the true value, so we'll use
    it to quantify how close a regression line is to a set of points. MSE works by
    squaring the distance between each data point and the regression line (the red
    residuals in the graphs above), summing the squared values, and then dividing
    by the number of data points: {@html katexify(
      `\\begin{aligned} MSE = \\frac{1}{n} \\Sigma^{n}_{i=1}(y_i - \\hat{y_i})^2 \\end{aligned}`,
      true
    )}
    The name is quite literal: take the mean of the squared errors. The squaring
    of errors prevents negative and positive terms from canceling out in the sum,<sup
      ><span
        class="info-tooltip"
        title="There is nothing stopping us from using a different norm instead, so as 
        long as the positive and negative values cancel out. For example,
        if we took the absolute value of our errors instead of the square, we'd have the
        popular loss-function Mean-Absolute Error (MAE)."
        use:tooltip
        >[&#8505;]
      </span></sup
    >
    and gives more weight to points further from the regression line, punishing outliers.
    In practice, we'll fit our regression model to a set training data, and evaluate
    it's performance using MSE on the test dataset.
    <!-- new -->
    <br /><br />
    <span class="bold">R-Squared</span>
    <br />
    Regression models may also be evaluated with the so-called
    <i>goodness of fit</i>
    measures, which summarize how well a model fits a set of data. The most popular
    goodness of fit measure for linear regression is r-squared, a metric that represents
    the percentage of the variance in {@html katexify(`y`, false)} explained by our
    features {@html katexify(`x`, false)}.<sup
      ><span
        class="info-tooltip"
        title="Intuitively, an ideal model would explain all of the variation in the data for all inputs."
        use:tooltip
        >[&#8505;]
      </span></sup
    >
    More specifically, r-squared measures the percentage of variance explained normalized
    against the baseline variance of our model (which is just the variance of the
    mean):
    {@html katexify(
      `\\begin{aligned} R^2 = 1 - \\frac{\\Sigma^{n}_{i=1}(y_i - \\hat{y_i})^2 }{\\Sigma^{n}_{i=1}(y_i - \\bar{y})^2 }  \\end{aligned}`,
      true
    )}
    The highest possible value for r-squared is 1, representing a model that captures
    100% of the variance. A negative r-squared means that our model is doing worse
    (capturing less variance) than a flat line through mean of our data would.

    <br /><br />To build intuition for yourself, try changing the weight and
    bias terms below to see how the MSE and r-squared change across different
    model fits:
  </p>
  <br /><br />
  <div id="mse-container">
    <div id="equations-container">
      <div id="buttons-container">
        <button on:click={() => mseScatterClass.shuffleData()}
          >Shuffle Data</button
        >
      </div>
      <div id="bias-slider">
        <div class="input-container">
          <p>
            Bias ({@html katexify(`\\hat{\\beta_0}`, false)}): {formatter(
              $mseBias
            )}
          </p>
          <input
            type="range"
            min="-2"
            step="0.5"
            max="16"
            bind:value={$mseBias}
            class="slider"
            id="myRange"
          />
        </div>
      </div>
      <div id="weight-slider">
        <div class="input-container">
          <p>
            Weight ({@html katexify(`\\hat{\\beta_1}`, false)}): {formatter(
              $mseWeight
            )}
          </p>
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

      <br />
      <div id="equation-math">
        For our model: {@html katexify(
          `\\hat{y} = ${formatter($mseWeight)}x${
            $mseBias < 0 ? "" : "+"
          }${formatter($mseBias)}`
        )}
      </div>
      <br />
      <div id="equation-math">
        {@html katexify(
          `\\begin{aligned} MSE = \\frac{1}{n} \\Sigma^{n}_{i=1}(y - (${formatter(
            $mseWeight
          )}x${$mseBias < 0 ? "" : "+"}${formatter($mseBias)}))^2 = ${formatter(
            $mseError
          )} \\end{aligned}`
        )}
      </div>
      <div id="equation-math">
        {@html katexify(
          `\\begin{aligned} R^2 = 1 - \\frac{${formatter($RSS)}}{${formatter(
            $TSS
          )}}  = ${formatter($rSquared)} \\end{aligned}`
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
    You will often see R-Squared referenced in statistical contexts as a way to
    assess model fit.
    <br /><br />
    <span class="bold">Selecting An Evaluation Metric</span><br />
    Many methods exist for evaluating regression models, each with different concerns
    around interpretability, theory, and usability. The evaluation metric should
    reflect whatever it is you actually care about when making predictions. For example,
    when we use MSE, we are implicitly saying that we think the cost of our prediction
    error should reflect the quadratic (squared) distance between what we predicted
    and what is correct. This may work well if we want to punish outliers or if our
    data is minimized by the mean, but this comes at the cost of interpretability:
    we output our error in squared units (though this may be fixed with
    <a href="https://en.wikipedia.org/wiki/Root-mean-square_deviation">RMSE</a
    >). If instead we wanted our error to reflect the linear distance between
    what we predicted and what is correct, or we wanted our data minimized by
    the median, we could try something like Mean Abosulte Error (<a
      href="https://en.wikipedia.org/wiki/Mean_absolute_error">MAE</a
    >). Whatever the case, you should be thinking of your evaluation metric as
    part of your modeling process, and select the best metric based on the
    specific concerns of your use-case.
  </p>
</section>

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
      height: 100%;
      max-height: 100%;
    }

    #charts-container {
      max-width: 100%;
    }
  }
</style>
