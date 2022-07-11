<script>
  // "katexify" function
  import katexify from "../katexify";

  // math equations
  const math1 = "ax^2+bx+c=0";
  const math2 = "x=-\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}";
  const math3 = "V=\\frac{1}{3}\\pi r^2 h";
</script>

<!-- <h1 class="body-header">One Binary Feature</h1> -->

<p class="body-text">
  <span class="interpretation-header"
    >Interpreting A Multivariate Regression Model</span
  >
  <br /><br />
  <span class="bold">Model Form:</span>
  {@html katexify(`y=β0+β1∗x1+β2∗x2+...+βk∗xk+ϵ`, true)}
</p>
<p class="body-text">
  <span class="bold">Example:</span>
  {@html katexify(`y=β0+β1∗x1+β2∗x2+...+βk∗xk+ϵ`, true)}
</p>

<p class="body-text">
  <span class="bold">Interpretation</span>: house price = 78 + 12 * has_pool +
  error This model summarizes the difference in average housing prices between
  houses with swimming pools and houses without swimming pools. The intercept,
  78, is the average (or predicted) price for houses that do not have swimming
  pools. This is easy to see, simply set has_pool to 0 and solve the equation.
  To find the average price for houses with pools, we simply plug in 1 to obtain
  78 + 12*1 = 90. The difference between these two subpopulation means is equal
  to the coefficient on has_pool. It tells us that houses with pools cose 12
  points higher on average than houses that do not have pools.
</p>

<!-- 
  <p class="body-text">
    <span class="bold">One Continuous Predictor:</span> house price = 26 + 0.7 * sqft
    + error This model summarizes the difference in average housing prices across different
    values of the house size (in square feet). If we compare the average house prices
    for houses that differ in square-footage by 1 unit (1 square foot), we expect to
    see that the group with higher square-footage achieves 0.6 points more on average.
    To understand the constant term in the regression, we must consider a case with
    zero values of all the other predictors. In this example, the intercept of 26 refelcts
    the predicted house prices for houses with a square-footage of zero. Of course,
    this doesn’t make much sense, there are no houses with zero square-footages. We
    will discuss a transformation that gives this intercept a more useful interpretation.
  </p>
  <p class="body-text">
    <span class="bold">A Standard Multivariable Regression</span> house price = 26
    + 6 * pool + 0.6 * sqft + error This model attempts to summarize the average house
    of a price with respect to it’s size and whether or not it has a pool. While obviously
    not a perfect model, it does make sense: we expect housing prices to go up the
    bigger a house is, and if it has a pool. Let’s see how we interpret each piece
    of the model: *The Intercept:* The intercept is interpreted as the average value
    where all predictors are set to 0 (or for categorical values, to their baseline).
    Plugging in zero to our predictors, we see that the average house price for homes
    that don’t have a pool and have a square footage of zero is 26. This isn’t a useful
    prediction, as no homes have a square-footage of zero. To make this better, we
    often [explain]. *The coefficient of pool*: Comparing houses that have the same
    square-footage, but that differed in whether or not they have a pool, the model
    predicts an expected difference of 6 in their price. *The coefficient of sqft:*
    Comparing houses with the same value of pool, but whose house size differs by 1
    unit (1 square foot) in square feet, we would expect to see a difference of 0.6
    points in the house price. choices/comlexities: which predictos x to include in
    the model, interpretations of the coefficients (and how they interact), extensions
    to the model to capture discreteness or nonlinearity. Note, in the above model,
    we forced the slope of the regression of houseing price on sqft to be the same
    for each has_pool subgroup. This isn’t always desirable... [explain]. Enter interactions.
  </p>
  <p class="body-text">
    <span class="bold">A Multivariable Regression with Interaction Terms</span> house
    price = 26 + 6 * pool + 0.6 * sqft + -0.5 * pool:sqft + error In our standard multivariate
    model above, we forced the slope of the regression of housing price on square footage
    to be equal across the subgroups defined by whether or not a house has a pool.
    However, if we plot the data, we can see clearly that the slopes between whether
    or not a house has a pool or not differ substantially. Interaction terms allow
    us to vary the slope across subgroups of a categorical variable. An interaction
    term is a new predictor in the model defined as the product of the variables you
    want to interact. With the inclusion of interaction terms, we need to interpret
    our coefficients slightly differently. *Intercept*: Same interpretation as above.
    *Coefficient of pool*: The difference between the predicted housing price for houses
    without pools and have square footage of zero, and houses that do have pools and
    have square footage as zero. *Coefficient of sqft*: The comparison of mean housing
    price across houses without pools, but whose square-footage differs by one-unit
    (i.e. 1 square foot).
  </p>
  <p class="body-text">
    <span class="bold">Coefficient of the interaction term</span>: Represents the
    difference in slope for square footage, comparing houses with and without
    pools: that is, the difference between the slopes shown in the plot. *A
    multi-level categorical predictor:*
  </p> -->
<style>
  .interpretation-header {
    color: var(--squidink);
    font-family: var(--font-heavy);
    font-size: 1.4rem;
    text-decoration: underline;
    text-decoration-color: var(--smile);
  }
  /* sample css to style reactivity button */
  .button-div {
    display: flex;
    justify-content: center;
  }
  button {
    font-family: "Amazon Ember Mono";
    border: 3px solid black;
    padding: 5px 10px;
  }
</style>
