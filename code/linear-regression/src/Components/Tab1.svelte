<script>
  import katexify from "../katexify";
</script>

<p class="body-text">
  <span class="interpretation-header"
    >Interpreting A Regression Model With One Categorical Feature</span
  >
  <br /><br />
  <span class="bold">Model Form:</span>
  {@html katexify(`y=β0+β1∗x1`, false)} where {@html katexify(
    `β1 \\in \\llbracket0, 1\\rrbracket`,
    false
  )}
</p>
<br />
<p class="body-text">
  <span class="bold">Example:</span>
  {@html katexify(
    `house price = 78 + 12 * has\\_pool +
      error`,
    false
  )}
</p>
<br />
<p class="body-text">
  <span class="bold">Interpretation</span>:This model summarizes the difference
  in average housing prices between houses with swimming pools and houses
  without swimming pools. The intercept, 78, is the average (or predicted) price
  for houses that do not have swimming pools (to see this, simply set has_pool
  to 0 and solve the equation). To find the average price for houses with pools,
  we simply plug in 1 to obtain 78 + 12*1 = 90. The difference between these two
  subpopulation means is equal to the coefficient on {@html katexify(
    `has\\_pool`,
    false
  )}. It tells us that houses with pools cose 12 points higher on average than
  houses that do not have pools.
  <br /><br />
  It's common to see categorical features in regression models with more than two
  possible outcomes. These multi-level categorical features are often called indicator,
  or dummy, variables.
</p>

<style>
  .interpretation-header {
    color: var(--squidink);
    font-family: var(--font-heavy);
    font-size: 1.4rem;
  }
</style>
