<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
</script>

<p class="body-text">
  <span class="interpretation-header"
    >Interpreting A Regression Model With One Binary Feature</span
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
  without swimming pools.
  <br /><br /> The intercept, 78, is the average (or predicted) price for houses
  that do not have swimming pools (to see this, simply set has_pool to 0 and
  solve the equation). To find the average price for houses with pools, we
  simply plug in 1 to obtain 78 + 12*1 = 90.

  <br /><br />The difference between these two subpopulation means is equal to
  the coefficient on {@html katexify(`has\\_pool`, false)}. It tells us that
  houses with pools cose 12 points higher on average than houses that do not
  have pools.
  <br /><br />
  Note, you may see categorical features in regression models with more than two
  possible outcomes. These multi-level categorical features are often called indicator,
  or dummy, variables. Special attention should be taken when interpreting indicator
  variables as any interpretation is dependent on the baseline category used in the
  model.
  <span
    class="info-tooltip"
    title="To learn more, read chapter 10.4 of Regression And Other Stories, listed in the resources."
    use:tooltip
  >
    [&#8505;]
  </span>
</p>

<style>
</style>
