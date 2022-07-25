<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
</script>

<p class="body-text">
  <span class="interpretation-header"
    >Interpreting A Regression Model With One Continuous Feature</span
  >
  <br /><br />
  <span class="bold">Model Form:</span>
  {@html katexify(`y=β0+β1∗x1`, false)} where {@html katexify(
    `β1 \\in \\llbracket \\Reals \\rrbracket`,
    false
  )}
</p>
<br />
<p class="body-text">
  <span class="bold">Example:</span>
  {@html katexify(
    `house price = 78 + 12 *sqft +
        error`,
    false
  )}
</p>
<br />
<p class="body-text">
  <span class="bold">Interpretation</span>:With this model, we summarize the
  average housing price across different sized houses (as measured in square
  footage {@html katexify(`sqft`, false)}).
  <br /><br />
  The coefficient, 12, represents the average difference in housing price for one-unit
  difference in the square-footage of the house. In other words, we expect each additional
  square-foot, on average, to raise the price of a house by $600.
  <br /><br /> The intercept, 78, represents the predicted housing price for
  houses with {@html katexify(`x1 = 0`, false)} - in other words, it represents the
  cost of houses with a square-footage of zero. Because this value doesn't make much
  intuitive sense, it's common for models to be transformed and standardized before
  carrying out a regression model.<span
    class="info-tooltip"
    title="Because this value doesn't make much intuitive sense, it's common for models to be transformed and standardized before carrying out a regression model."
    use:tooltip
  >
    [&#8505;]
  </span>
</p>

<style>
</style>
