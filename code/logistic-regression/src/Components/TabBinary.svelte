<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
</script>

<p class="body-text">
  <span class="interpretation-header"
    >Interpreting A Logistic Regression Model With One Binary Feature</span
  >
  <br /><br />
  <span class="bold">Model Form:</span>
  {@html katexify(
    `\\begin{aligned} P(Y=1|x) = \\frac{1}{1+e^{-(\\beta_0 + \\beta_1 * x)}} \\end{aligned}`,
    false
  )} where {@html katexify(`\\beta_1 \\in \\llbracket0, 1\\rrbracket`, false)}
</p>
<br />
<p class="body-text">
  <span class="bold">Example: </span>
  {@html katexify(
    `\\begin{aligned} P(Day=Rainless|Foggy) = \\frac{1}{1+e^{-(\\beta_0 + \\beta_1 * Foggy)}} \\end{aligned}`,
    false
  )}
</p>
<br />
<p class="body-text">
  <span class="bold">Interpretation</span>:
  This model summarizes the difference in the probability of a rainless day for days
  that are foggy and days that are not.

  <br /><br /> The weight {@html katexify(`\\beta_1`, false)} is the change in the
  log odds ratio for a foggy day relative to a non-foggy day. For a coefficient of
  -0.7, the exponentiated value is exp(-0.7) = 0.50, which indicates that on average,
  the odds that the day will be rainless multiplies by 0.50 (i.e. is about half)
  if it is foggy compared to if it is not.

  <br /><br />The intercept {@html katexify(`\\beta_0`, false)} is the odds of a
  rainless day if it is not foggy.
  <br /><br />
  <!-- <span
    class="info-tooltip"
    title="To learn more, read chapter 10.4 of Regression And Other Stories, listed in the resources."
    use:tooltip
  >
    [&#8505;]
  </span> -->
</p>

<style>
  .interpretation-header {
    font-family: var(--font-heavy);
    font-size: larger;
  }
</style>
