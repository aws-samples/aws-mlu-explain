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

<!-- <h1 class="body-header">Gradient Descent</h1> -->
<!-- <p class="body-text"> -->
<!-- Let's recap what we've learned so far: Linear regression is all about finding a
    line (or plane) that fits our data well. And as we just saw, this involves selecting
    the coefficients of our model that best minimize MSE. But how can we find these
    values? After all, selecting coefficient values by hand as we just did quickly
    becomes infeasible for regression models with many coffieicents. There must be
    a better way!
    <br /><br />
    Luckily for us, a very popular algorithm in machine learning does exactly this:
    gradient descent. Gradient descent is an iterative optimization algorithm that
    identifies some set of coefficients that yield the minimum of a convex function.
    Put simply: it will find suitable coefficients for our regression model that minimize
    prediction error (remember, lower MSE equals better model).
    <br /><br />
    A full conversation on gradient descent is outside the course of this article (stay-tuned
    for our future article on the subject), but we'll give a brief explanation as applied
    to linear regression. For a given error function (MSE in our case), Gradient descent
    will repeatedly update our models coefficients to minimize MSE. For each coefficient
    Bi in our model, it calculates the partial derivative of our error function with
    respect to that cofficient, (this tells us the magnitude and direction of increase)
    and stepping in the <i>opposite</i> direction.
    <br /> -->
<!-- </p> -->
<!-- <div class="show-button-container">
    <button class="show-button" on:click={show}
      >{shown ? `Hide` : `Show`} Math</button
    >
  </div> -->

<!-- <Hidden bind:shown bind:show>
    <div>Hidden content</div>
  </Hidden> -->

<!-- {#if shown}
    <div>Hidden child is shown!</div>
  {/if} -->
<p class="body-text">
  <br />
  Because the gradient calculates where the function is increasing, going in the
  opposite direction leads us to the minimum of our function. In this manner, we
  can repeatedly update our model's cofficients such that we eventually reach the
  minimum of our error function and obtain a sigmoid curve that fits our data well.
</p>
<br /><br />
<div id="gd-container">
  <div id="equations-container">
    <p class="body-text">
      Let's see how Gradient Descent works for our logistic regression model.
      We'll use the algorithm to identify which values for our bias and weight
      we should select. Click the buttons to run 1, 10, 50, or 100 steps of
      gradient descent, and see the curve update live. The error for each
      iteration is shown in the bottom error chart.
    </p>
    <div id="buttons-container">
      <button on:click={() => gdScatterClass.runGradientDescent(1)}
        >1 Step</button
      >
      <button on:click={() => gdScatterClass.runGradientDescent(10)}
        >10 Steps</button
      >
      <button on:click={() => gdScatterClass.runGradientDescent(50)}
        >50 Steps</button
      >
      <button on:click={() => gdScatterClass.runGradientDescent(100)}
        >100 Steps</button
      >
    </div>
    <div id="weight-slider">
      <div class="input-container">
        <label for="slider1" class="float-left">
          Weight: {$gdWeight}
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
          Bias: {$gdBias}
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
        <label for="equation-math" class="float-left">Our Model: </label>
        {@html katexify(
          `\\begin{aligned} P(Y=1|x) = \\frac{1}{1 + e^{-(${$gdWeight}x${
            $gdBias < 0 ? "" : "+"
          }${$gdBias})}} \\end{aligned}`
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

<!-- <p class="body-text">
    <span class="bold">Are Our Coefficients Valid?</span><br />
    In research publications and statistical software, coefficients of regression models
    are often presented with associated p-values. These p-values from from traditional
    null hypothesis statistical tests: t-tests are used to measure whether a given
    cofficient is significantly different than zero (the null hypothesis that a particular
    coefficient Bj equals zero), while F tests are used to measure whether
    <i>all</i>
    the terms in a regression model are significantly different from zero. Different
    opinions exist on the utility of such tests (e.g. chapter 10.7 of
    <a href="#resources">[1]</a> argues against them). We don't take a strong stance
    on this issue, but believe practitioners should always assess the standard error
    aroud any parameter estimates for themselves and present them in their research.
  </p> -->
<style>
  #gd-container {
    display: grid;
    grid-template-columns: 50% 50%;
    font-family: var(--font-main);
    margin: auto;
    max-width: 1000px;
    /* border: 1px solid black; */
    height: 70vh;
    max-height: 500px;
  }

  #equations-container {
    text-align: left;
    /* display: flex; */
    flex-direction: column;
    /* border: 1px solid red; */
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
    /* border: 1px solid red; */
  }

  #charts-container {
    /* border: 1px solid blue; */
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
    /* grid-row-gap: 3rem; */
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
      display: grid;
      grid-template-columns: 100%;
      margin: auto;
      max-width: 100%;
      width: 100%;
      height: 90vh;
    }

    #charts-container {
      max-width: 100%;
    }
  }
</style>
