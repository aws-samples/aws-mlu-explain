<script>
  import { gdBias, gdWeight } from "../store";
  import katexify from "../katexify";
  import GradientDescentScatterplot from "./GradientDescentScatterplot.svelte";
  import GradientDescentErrorPlot from "./GradientDescentErrorPlot.svelte";
  import Hidden from "./Hidden.svelte";
  import { tooltip } from "../tooltip";

  // instantiate class for gd methods
  let gdScatterClass;
  let gdErrorClass;
  let shown;
  let show;
</script>

<h1 class="body-header">Learning The Coefficients</h1>
<p class="body-text">
  <span class="bold">Gradient Descent</span>
  <br />
  Let's recap what we've learned so far: Linear regression is all about finding a
  line (or plane) that fits our data well. And as we just saw, this involves selecting
  the coefficients of our model that best minimize MSE. But how can we find these
  values? In practice, they're unknown, and selecting them by hand quickly becomes
  infeasible for regression models with many features. There must be a better way!
  <br /><br />
  Luckily for us, a very popular algorithm in machine learning does exactly this:
  gradient descent. Gradient descent is an iterative optimization algorithm that
  identifies some set of coefficients that yield the minimum of a convex function.
  Put simply: it will find suitable coefficients for our regression model that minimize
  prediction error (remember, lower MSE equals better model).
  <br /><br />
  A full conversation on gradient descent is outside the course of this article (stay-tuned
  for our future article on the subject), but if you'd like to learn more, click
  the "Show Math" button below. Otherwise, read on!
  <br />
</p>
<div class="show-button-container">
  <button class="show-button" on:click={show}
    >{shown ? `Hide` : `Show`} Math</button
  >
</div>

<Hidden bind:shown bind:show>
  <section class="gd-math">
    <p class="body-text">
      Gradient descent works as follows. We assume that we have some convex
      function representing the error of our machine learning algorithm (in our
      case, MSE). Gradient descent will iteratively update our model's
      coefficients in the direction of our error functions minimum [we can't
      guarantee global minima].
      <br /><br />
      In our case, our model takes the form:
      {@html katexify(
        `\\begin{aligned} \\hat{y}=\\hat{\\beta_0} + \\hat{\\beta_1}x_1  \\end{aligned}`,
        true
      )}
      and our error function takes the form:
      {@html katexify(
        `\\begin{aligned} MSE(\\hat{\\beta_0}, \\hat{\\beta_1}) = \\frac{1}{n} \\sum^{n}_{i=1}(y_i - \\hat{y_i})^2 \\\\
        = \\frac{1}{n} \\sum^{n}_{i=1}(y_i - (\\hat{\\beta_0} + \\hat{\\beta_1}x_1 ))^2 \\end{aligned}`,
        true
      )}
      <!-- {@html katexify(
        `\\begin{aligned}  = \\frac{1}{n} \\sum^{n}_{i=1}(y_i - (\\hat{\\beta_0} + \\hat{\\beta_1}x_1 ))^2 \\end{aligned}`,
        true
      )} -->
      Our goal is to find the coefficients, {@html katexify(`\\beta_0`, false)} and
      {@html katexify(`\\beta_1`, false)}, to minimize the error function. To do
      this, we'll use the gradient, which represents the direction where that
      function is increasing, and the rate at which it is increasing. Gradient
      descent works by taking steps in the direction oppositie of where our
      error function is increasing, proportional to the rate of change. To find
      the coefficients that minimize
      <!-- our error function, we apply gradient descent: -->
      <!-- To control
      the rate at which gradient descent learns the optimal model parameters, we
      introduce a parameter, step_size.  -->
      First, we calculate the derivatives of our loss function, MSE:
      {@html katexify(
        `\\frac{\\delta}{\\delta\\beta_i}MSE = \\begin{cases}
        -\\frac{2}{n} \\sum^{n}_{i=1}(y_i - \\hat{y_i}) \\text{for i = 0} \\\\
        -\\frac{2}{n} \\sum^{n}_{i=1}x_i(y_i - \\hat{y_i}) \\text{for i = 1}
        \\end{cases}`,
        true
      )}
      <!-- {@html katexify(
        `\\begin{aligned} \\frac{\\delta}{\\delta\\beta_i}MSE =  \\end{aligned}`,
        true
      )}
      {@html katexify(
        `\\begin{aligned} = -\\frac{2}{n} \\sum^{n}_{i=1}(y_i - \\hat{y_i}) \\text{for i = 0} \\end{aligned}`,
        true
      )}
      {@html katexify(
        `\\begin{aligned} = -\\frac{2}{n} \\sum^{n}_{i=1}x_i(y_i - \\hat{y_i}) \\text{for i = 1} \\end{aligned}`,
        true
      )}
      {@html katexify(
        `f(n) = \\begin{cases}
          n/2  & n \\text{ is even} \\\\
          3n+1 & n \\text{ is odd}
        \\end{cases}`,
        true
      )} -->
      Next, now that we have the gradients for our error function (with respect to
      each coefficient to be updated), we perform iterative updates as:
      {@html katexify(
        `\\text{repeat until converge:} = \\begin{cases}
         \\beta_0 = \\beta_0 - \\alpha (-\\frac{2}{n} \\sum^{n}_{i=1}(y_i - \\hat{y_i}))  \\\\
         \\beta_1 = \\beta_1 - \\alpha (-\\frac{2}{n} x_i\\sum^{n}_{i=1}(y_i - \\hat{y_i})) 
        \\end{cases}`,
        true
      )}
      <!-- {@html katexify(
        `\\begin{aligned} repeat: \\beta_0 = \\beta_0 - \\alpha (-\\frac{2}{n} \\sum^{n}_{i=1}(y_i - \\hat{y_i})) \\end{aligned}`,
        true
      )}
      {@html katexify(
        `\\begin{aligned} repeat: \\beta_1 = \\beta_1 - \\alpha (-\\frac{2}{n} x_i\\sum^{n}_{i=1}(y_i - \\hat{y_i})) \\end{aligned}`,
        true
      )} -->
      <br /><br />
      <!-- error function. For a given error function (MSE in our case), Gradient descent
      will iteratively update our models' coefficients to minimize the error of that
      function. It does this by calculating the gradient of that function. The gradient
      measures For each coefficient Bi in our model, it calculates the partial derivative
      of our error function with respect to that cofficient, (this tells us the magnitude -->
      updating these values iteratively will yield coefficients of our model that
      minimize error.<span
        class="info-tooltip"
        title="Gradient descent won't always yield the best coefficients for our model, because it can sometimes 
      get stuck in local minima (as opposed to global minima). Many extensions exist to help solve this problem."
        use:tooltip
      >
        [&#8505;]
      </span>
      <br />
    </p>
    <!-- <p class="body-text">
      <br />
      Because the gradient calculates where the function is increasing, going in
      the opposite direction leads us to the minimum of our function. In this manner,
      we can repeatedly update our model's cofficients such that we eventually reach
      the minimum of our error function and obtain a line that fits our data well
      [i] mention global vs local optima.
    </p> -->
    <div class="show-button-container">
      <button class="show-button" on:click={show}>Hide Math</button>
    </div>
  </section>
</Hidden>

<!-- {#if shown}
  <div>Hidden child is shown!</div>
{/if} -->
<p class="body-text">
  <br />
  Gradient descent will iteratively identify the coefficients our model needs to
  fit the data. Let's see an example directly. We'll fit data to our equation y =
  b0 + b1x. So we'll want to learn two coefficients, b0 and b1. To do so, interact
  witht he plot below. Try dragging the wrights and values to 'poor' fit solutions
  and run gradient descent to see them iteratively improve.
</p>
<br /><br />
<div id="gd-container">
  <div id="equations-container">
    <p class="body-text">
      Let's see how Gradient Descent works directly for our linear regression
      model. We'll use the algorithm to identify which values for our bias and
      weight we should select. Click the buttons to run 1, 10, or 50 steps of
      gradient descent, and see the line update live. The error for each
      iteration will be shown in the bottom error chart. With each weight
      update, we recalculate the error, so you can see how gradient descent
      improves our model iteratively.
    </p>
    <div id="buttons-container">
      <button on:click={() => gdScatterClass.shuffleData()}>New Data</button>
      <button on:click={() => gdScatterClass.runGradientDescent(1)}
        >1 Step</button
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
        <p>Weight: {$gdWeight}</p>
        <input
          type="range"
          min="-1.5"
          max="6"
          step=".01"
          bind:value={$gdWeight}
          class="slider"
          id="myRange"
        />
      </div>
    </div>
    <div id="bias-slider">
      <div class="input-container">
        <p>Bias: {$gdBias}</p>
        <input
          type="range"
          min="-1"
          step="-1"
          max="16"
          bind:value={$gdBias}
          class="slider"
          id="myRange"
        />
      </div>
    </div>
    <div id="equation-math">
      Our model: {@html katexify(
        `\\begin{aligned} y = ${$gdWeight}x${
          $gdBias < 0 ? "" : "+"
        }${$gdBias}+c \\end{aligned}`
      )}
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
<p class="body-text">
  Although gradient descent is the most popular optimization algorithm in
  machine learning, it's not perfect! It doesn't work for every loss function,
  and it may not always find the most optimal set of coefficients for your
  model. Still, it has many extensions to help solve these issues, and is a
  great choice for mean-squared error.
</p>
<br /><br />
<p class="body-text">
  <span class="bold">What About Least Squares?</span><br />
  We'd be remiss not to mention Least Squares, a widely taught (but rarely-used)
  method for obtaining estimates for our linear regression coefficients.<span
    class="info-tooltip"
    title="Least squares is rarely used in the context of machine learning because "
    use:tooltip
  >
    [&#8505;]
  </span>
  Least squares is a closed-form solution that allows us to estimate our coefficients
  directly by minimizing the <i>residual sum of squares</i> (RSS) of our data:
  {@html katexify(
    `\\begin{aligned} RSS = \\sum^{n}_{i=1}(y_i - \\hat{y_i})^2 \\end{aligned}`,
    true
  )}The RSS should look familiar - it's just mean-squared error without the
  'mean' (i.e. we take the sum without averaging). The coefficient estimates
  have somewhat complex forms - you'll often see them presented in matrix form
  as:
  {@html katexify(
    `\\begin{aligned} \\beta = (X^{T}X)^{-1}X^{T}Y \\end{aligned}`,
    true
  )}
  Despite providing a convenient closed-form solution for finding our optimal coefficients,
  the least squares estimates are often not used in practice, because of the computational
  complexity required to calculate them. For this reason, we often just use gradient
  descent.
</p>

<!-- <p class="body-text">
  The important takeaway here is to know that although gradient descent is the
  most popular method for estimating regression coefficients (at least in the
  context of machine learning) many other methods exist.
</p> -->
<br /><br />
<p class="body-text">
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
</p>

<style>
  #gd-container {
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

  .gd-math {
    margin: auto;
    max-width: 700px;
    border: 5px solid var(--smile);
    padding: 2rem;
    background-color: var(--paper);
  }

  .gd-math .body-text {
    /* color: white; */
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

  /* mobile */
  @media screen and (max-width: 950px) {
    #gd-container {
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
