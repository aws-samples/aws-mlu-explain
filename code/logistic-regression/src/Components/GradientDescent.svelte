<script>
  // "katexify" function
  import { gdBias, gdWeight } from "../data-store";
  import katexify from "../katexify";
  import GradientDescentScatterplot from "./GradientDescentScatterplot.svelte";
  import GradientDescentErrorPlot from "./GradientDescentErrorPlot.svelte";

  // math equations
  const math1 = "ax^2+bx+c=0";

  // instantiate class for gd methods
  let gdScatterClass;
  let gdErrorClass;
  let shown;
  let show;
</script>

<p class="body-text">
  <br />
  Because the gradient calculates where the function is increasing, going in the
  opposite direction leads us to the minimum of our function. In this manner, we
  can repeatedly update our model's coefficients such that we eventually reach the
  minimum of our error function and obtain a sigmoid curve that fits our data well.
</p>
<br /><br />
<div id="gd-container">
  <div id="equations-container">
    <p class="body-text">
      Let's see how gradient descent works for our logistic regression model.
      We'll use the algorithm to identify which values for bias {@html katexify(
        "(\\hat{\\beta_0})",
        false
      )} and weight {@html katexify("(\\hat{\\beta_1})", false)} we should select.
      Click the buttons to run 1, 5, 10, or 25 steps of gradient descent, and see
      the curve update live. The error for each iteration is shown in the bottom
      error chart.
    </p>
    <div id="buttons-container">
      <button on:click={() => gdScatterClass.runGradientDescent(1)}
        >1 Step</button
      >
      <button on:click={() => gdScatterClass.runGradientDescent(5)}
        >5 Steps</button
      >
      <button on:click={() => gdScatterClass.runGradientDescent(10)}
        >10 Steps</button
      >
      <button on:click={() => gdScatterClass.runGradientDescent(25)}
        >25 Steps</button
      >
    </div>
    <div id="weight-slider">
      <div class="input-container">
        <label for="slider1" class="float-left">
          <span class="bold">Weight:</span>
          {$gdWeight}
        </label>
        <input
          type="range"
          min="-3"
          max="3"
          step=".01"
          bind:value={$gdWeight}
          class="slider"
          id="slider1"
        />
      </div>
    </div>
    <div id="bias-slider">
      <div class="input-container">
        <label for="slider2" class="float-left">
          <span class="bold">Bias:</span>
          {$gdBias}
        </label>

        <input
          type="range"
          min="-50"
          step="-1"
          max="10"
          bind:value={$gdBias}
          class="slider"
          id="slider2"
        />
      </div>
    </div>
    <div id="equation-math">
      <div class="input-container">
        <label for="equation-math" class="float-left"
          ><span class="bold">Our Model: </span></label
        >
        {@html katexify(
          `\\begin{aligned} P(y=1|x) = \\frac{1}{1 + e^{-(${$gdBias}${
            $gdWeight < 0 ? "" : "+"
          }
            ${$gdWeight}x)}} \\end{aligned}`
        )}
      </div>
    </div>
  </div>
  <div id="charts-container">
    <div id="gd-chart-regression">
      <GradientDescentScatterplot bind:this={gdScatterClass} />
    </div>
    <div id="gd-chart-error">
      <GradientDescentErrorPlot bind:this={gdErrorClass} />
    </div>
  </div>
</div>
<br /><br />

<style>
  #gd-container {
    display: grid;
    grid-template-columns: 50% 50%;
    font-family: var(--font-main);
    margin: auto;
    max-width: 1000px;
    height: 65vh;
  }

  #equations-container {
    text-align: left;
    flex-direction: column;
    justify-content: center;
  }

  #equation-math {
    color: var(--squidink);
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

  #charts-container {
  }

  button {
    background-color: var(--secondary); /* Green */
    border: none;
    color: var(--paper);
    padding: 8px 16px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    margin: 4px 2px;
    cursor: pointer;
    opacity: 0.9;
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

  button.show-button {
    background-color: var(--bg); /* Green */
    border: none;
    color: var(--squidink);
    padding: 8px 16px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    margin: 4px 2px;
    cursor: pointer;
    outline: 2px solid var(--squidink);
  }

  .show-button-container {
    max-width: var(--max-width);
    display: flex;
    margin: 1rem auto;
    justify-content: center;
  }

  #charts-container {
    display: grid;
    grid-template-columns: 100%;
    grid-column-gap: 0rem;
    grid-template-rows: 60% 40%;
    height: 80vh;
    padding-right: 1rem;
    height: 70vh;
    max-height: 500px;
  }

  #gd-chart-regression {
    width: 100%;
    height: 100%;
  }

  .slider {
    -webkit-appearance: none;
    width: 100%;
    height: 15px;
    border-radius: 5px;
    background: var(--paper);
    outline: none;
    opacity: 0.9;
    -webkit-transition: 0.2s;
    transition: opacity 0.2s;
    border-color: var(--squidink);
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: var(--sky);
    cursor: pointer;
  }

  label {
    width: 100%;
    color: var(--squidink);
  }

  /* mobile */
  @media screen and (max-width: 950px) {
    #gd-container {
      grid-template-columns: 100%;
      max-width: 100%;
      width: 100%;
      height: 130vh;
      max-height: 130vh;
    }

    #charts-container {
      max-width: 100%;
    }
  }
</style>
