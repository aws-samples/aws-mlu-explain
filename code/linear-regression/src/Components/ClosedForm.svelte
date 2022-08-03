<script>
  // "katexify" function
  import { format } from "d3-format";
  import katexify from "../katexify";
  import ClosedFormScatterplot from "./ClosedFormScatterplot.svelte";
  import { matrixDot, transpose } from "../utils";
  import { cfBias, cfWeight, cfCircles } from "../store.js";
  import App from "../App.svelte";
  import { tooltip } from "../tooltip";
  let closedFormScatterClass;

  // label formatter
  const formatter = format(".2f");

  function resetCircles() {
    $cfCircles = [];
  }
  $: X = $cfCircles.map((d) => [1, d.cx]);
  $: Y = $cfCircles.map((d) => [d.cy]);

  $: console.log("X", X);
  $: if ($cfCircles.length > 1) {
    let xT = transpose(X);
    let xProd = matrixDot(transpose(X), X);
    console.log("xProd", xProd);
  }

  $: xProd =
    $cfCircles.length > 1
      ? matrixDot(transpose(X), X)
      : [
          [0, 0],
          [0, 0],
        ];
</script>

<h1 class="body-header">Learning The Coefficients</h1>
<p class="body-text">
  <span class="bold">A Closed-Form Solution</span><br />
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
    `\\begin{aligned} \\hat{\\beta} = (X^{T}X)^{-1}X^{T}Y \\end{aligned}`,
    true
  )}
  Despite providing a convenient closed-form solution for finding our optimal coefficients,
  the least squares estimates are often not used in practice, because of the computational
  complexity required to calculate them. For this reason, we often just use gradient
  descent.
</p>
<div id="cf-container">
  <div id="equations-container">
    <br />
    <div id="equation-math">
      {@html katexify(
        `\\begin{aligned}
        
        \\hat{\\beta} = (X^{T}X)^{-1}X^{T}Y \\\\
         = \\begin{pmatrix} 
         \\begin{bmatrix}
            1 & ${$cfCircles?.[0] ? $cfCircles[0].cx : 0} \\\\
            ${$cfCircles?.[1] ? `1 & ${$cfCircles[1].cx} \\\\` : ""} 
            ${
              $cfCircles.length > 3
                ? `\\vdots & \\vdots \\\\`
                : $cfCircles?.[2]
                ? `1 & ${$cfCircles[2].cx} \\\\`
                : ""
            } 
            ${
              $cfCircles.length > 3
                ? `1 & ${$cfCircles.at(-1).cx}`
                : $cfCircles?.[3]
                ? `1 & ${$cfCircles[3].cx}`
                : ""
            } 
            \\end{bmatrix}^T 
            \\begin{bmatrix}
            1 & ${$cfCircles?.[0] ? $cfCircles[0].cx : 0} \\\\
            ${$cfCircles?.[1] ? `1 & ${$cfCircles[1].cx} \\\\` : ""} 
            ${
              $cfCircles.length > 3
                ? `\\vdots & \\vdots \\\\`
                : $cfCircles?.[2]
                ? `1 & ${$cfCircles[2].cx} \\\\`
                : ""
            } 
            ${
              $cfCircles.length > 3
                ? `1 & ${$cfCircles.at(-1).cx}`
                : $cfCircles?.[3]
                ? `1 & ${$cfCircles[3].cx}`
                : ""
            } 
            \\end{bmatrix}
            \\end{pmatrix}^{-1} 
            \\begin{bmatrix}
            1 & ${$cfCircles?.[0] ? $cfCircles[0].cx : 0} \\\\
            ${$cfCircles?.[1] ? `1 & ${$cfCircles[1].cx} \\\\` : ""} 
            ${
              $cfCircles.length > 3
                ? `\\vdots & \\vdots \\\\`
                : $cfCircles?.[2]
                ? `1 & ${$cfCircles[2].cx} \\\\`
                : ""
            } 
            ${
              $cfCircles.length > 3
                ? `1 & ${$cfCircles.at(-1).cx}`
                : $cfCircles?.[3]
                ? `1 & ${$cfCircles[3].cx}`
                : ""
            } 
            \\end{bmatrix}^T 
            \\begin{bmatrix}
            ${$cfCircles?.[0] ? $cfCircles[0].cy : 0} \\\\
            ${$cfCircles?.[1] ? `${$cfCircles[1].cy} \\\\` : ""} 
            ${
              $cfCircles.length > 3
                ? `\\vdots \\\\`
                : $cfCircles?.[2]
                ? `${$cfCircles[2].cy} \\\\`
                : ""
            } 
            ${
              $cfCircles.length > 3
                ? `${$cfCircles.at(-1).cy}`
                : $cfCircles?.[3]
                ? `${$cfCircles[3].cy}`
                : ""
            } 
            \\end{bmatrix}
            \\\\

            

            =  
            \\begin{pmatrix}
         \\begin{bmatrix}
            ${xProd[0][0]} & ${xProd[0][1]} \\\\
            ${xProd[1][0]} & ${xProd[1][1]}
            \\end{bmatrix}
            \\end{pmatrix}^{-1}
            \\begin{bmatrix}
            1 & ${$cfCircles?.[0] ? $cfCircles[0].cx : 0} \\\\
            ${$cfCircles?.[1] ? `1 & ${$cfCircles[1].cx} \\\\` : ""} 
            ${
              $cfCircles.length > 3
                ? `\\vdots & \\vdots \\\\`
                : $cfCircles?.[2]
                ? `1 & ${$cfCircles[2].cx} \\\\`
                : ""
            } 
            ${
              $cfCircles.length > 3
                ? `1 & ${$cfCircles.at(-1).cx}`
                : $cfCircles?.[3]
                ? `1 & ${$cfCircles[3].cx}`
                : ""
            } 
            \\end{bmatrix}^T 
            \\begin{bmatrix}
            ${$cfCircles?.[0] ? $cfCircles[0].cy : 0} \\\\
            ${$cfCircles?.[1] ? `${$cfCircles[1].cy} \\\\` : ""} 
            ${
              $cfCircles.length > 3
                ? `\\vdots \\\\`
                : $cfCircles?.[2]
                ? `${$cfCircles[2].cy} \\\\`
                : ""
            } 
            ${
              $cfCircles.length > 3
                ? `${$cfCircles.at(-1).cy}`
                : $cfCircles?.[3]
                ? `${$cfCircles[3].cy}`
                : ""
            } 
            \\end{bmatrix}

            \\\\
            =  
         \\begin{bmatrix}
            1 & ${$cfCircles?.[1] ? formatter($cfBias) : 0} \\\\
            1 &${$cfCircles?.[1] ? formatter($cfWeight) : 0}
            \\end{bmatrix}
   

            
        \\end{aligned}
        
        
        `,
        true
      )}
    </div>
  </div>
  <div id="charts-container">
    <div id="cf-chart-regression">
      <ClosedFormScatterplot bind:this={closedFormScatterClass} />
    </div>
  </div>
  <div class="button-container">
    <button class="show-button" on:click={resetCircles}>Reset</button>
  </div>
</div>
<br /><br />

<style>
  #cf-container {
    display: grid;
    grid-template-columns: 50% 50%;
    font-family: var(--font-mono);
    margin: auto;
    max-width: 1000px;
    min-height: 50vh;
    /* max-height: 500px; */
    justify-content: center;
  }

  #equations-container {
    text-align: center;
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
  }

  button {
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

  .button-container {
    max-width: var(--max-width);
    display: flex;
    margin: 1rem auto;
    justify-content: center;
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

  #cf-chart-regression {
    width: 100%;
    height: 100%;
  }

  /* mobile */
  @media screen and (max-width: 950px) {
    #cf-container {
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
