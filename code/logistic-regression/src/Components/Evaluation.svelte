<script>
  import katexify from "../katexify";
  import { llProbability, yVal } from "../data-store";
  import Scatterplot from "./LogLossScatter.svelte";
  import Select from "svelte-select";

  let llScatterClass;

  const log_loss =
    "\\textrm{Log-Loss} = \\sum_{i=0}^n - (y_i * \\textrm{log}(p_i) + (1-y_i)*\\textrm{log}(1-p_i))";

  const items = [
    { value: true, label: "y = 0" },
    { value: false, label: "y = 1" },
  ];

  let chosen = undefined;

  function handleSelect(event) {
    chosen = event.detail;
    $yVal = chosen.value;
    console.log($yVal);
    // chosen = $yVal;
  }

  function handleClear() {
    chosen = undefined;
  }
</script>

<section>
  <h1 class="body-header">Evaluating Our Model</h1>

  <p class="body-text">
    When fitting our model, the goal is to find the parameters that optimize a
    function that defines how well the model is performing. Put simply, the goal
    is to make predictions as close to 1 when the outcome is 1 and as close to 0
    when the outcome is 0. In machine learning, the function to be optimized is
    called the loss function or cost function. We use the loss function to
    determine how well our model fits the data.
  </p>
  <br /><br />
  <p class="body-text">
    A suitable loss function in logistic regression is called the Log Loss, or
    binary cross-entropy. This function is as follows, where {@html katexify(
      "n"
    )} is the number of samples,
    {@html katexify("i")} is the index, xf is the true class for the index {@html katexify(
      "i"
    )}, and {@html katexify("p_i")} is the model prediction for the index {@html katexify(
      "i"
    )}.

    {@html katexify(log_loss, true)}
  </p>
  <p class="body-text">
    Minimizing the Log-Loss is equivalent to maximizing the Log-Likelihood,
    since the Log-Loss is the negative of the Log-Likelihood.
  </p>

  <div id="ll-container">
    <div id="equations-container">
      <p class="body-text">
        <br /><br />
        The graph on the right shows how the Log-Loss depends on the true value for
        {@html katexify("y")} and the predicted probability. You can see how as the
        probability gets closer to the true value ({@html katexify("p = 0")} when
        {@html katexify("y = 0")} and {@html katexify("p = 1")} when
        {@html katexify("y = 1")}), the Log-Loss decreases to 0. As the
        probability gets further from the true value, the Log-Loss approaches
        infinity.
      </p>
      <br /><br />

        <!-- <div class="input-container">
          <label for="true-select" class="float-left"
            >Select true value for y:</label
          >
          <select
            name="true-select"
            id="true-select"
            class="themed"
            bind:value={$yVal}
          >
            <option value={true}>y = 0</option>
            <option value={false}>y = 1</option>
          </select>
        </div> -->
        <div class="input-container">
          <label for="true-select"
            >Select true value for y:</label
          >
          <div class="container">

          <Select
            name="true-select"
            id="true-select"
            {items}
            on:select={handleSelect}
            on:clear={handleClear}
            bind:value={chosen}
          />
          </div>
        </div>
      <div id="probability-slider">
        <div class="input-container">
          <label for="slider1" class="float-left">
            Probability: {$llProbability}
          </label>
          <input
            type="range"
            min="0.01"
            max="0.99"
            step="0.01"
            bind:value={$llProbability}
            class="slider"
            id="slider1"
          />
        </div>
      </div>

      <!-- <div id="equation-math">
        Our Model: {@html katexify(
          `\\begin{aligned} P(Y=1|x) = \\frac{1}{1 + e^{-(${$llWeight}x${
            $llBias < 0 ? "" : "+"
          }${$llBias})}} \\end{aligned}`
        )}
      </div> -->
    </div>
    <div id="charts-container">
      <div id="ll-chart">
        <Scatterplot bind:this={llScatterClass} />
      </div>
    </div>
  </div>
  <br /><br />
</section>

<style>
  #ll-container {
    display: grid;
    grid-template-columns: 50% 50%;
    font-family: var(--font-main);
    margin: auto;
    max-width: 1000px;
    height: 50vh;
    max-height: 500px;
    justify-content: center;
  }

  #equations-container {
    text-align: left;
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
    /* justify-content: space-around; */
    /* align-items: center; */
    width: 80%;
    /* border: 1px solid red; */
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

  #charts-container {
    display: grid;
    grid-template-columns: 100%;
    grid-column-gap: 0rem;
    grid-template-rows: 100%;
    padding-right: 1rem;
    height: 50vh;
    max-height: 400px;
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

  #equation-math {
    color: var(--squidink);
  }

  .custom-select {
    margin-bottom: 10px;
    margin-top: 10px;
    font-family: var(--font-main);
    outline: 0;
    background: var(--paper);
    color: var(--squidink);
    border: 1px var(--squidink);
    padding: 4px;
    border-radius: 9px;
    width: 100%;
    text-align: center;
    /* float: left; */
  }

  .container {
		width: 100%;
	}

  /* mobile */
  @media screen and (max-width: 950px) {
    #ll-container {
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
