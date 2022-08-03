<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
</script>

<p class="tab-text">
  <span class="interpretation-header"
    >Interpreting A Logistic Regression Model With One Binary Feature</span
  >
  <br /><br />
  <span class="bold">Model Form:</span>
  {@html katexify(
    `\\begin{aligned} P(y=1|x) = \\frac{1}{1+e^{-(\\hat{\\beta_0} + \\hat{\\beta_1} * x)}} \\end{aligned}`,
    false
  )} where {@html katexify(`x \\in \\llbracket0, 1\\rrbracket`, false)}
</p>
<br />
<p class="tab-text">
  <span class="bold">Example: </span>
  {@html katexify(
    `\\begin{aligned} P(Day=Sunny|Foggy) = \\end{aligned}`,
    false
  )}
  {@html katexify(
    `\\begin{aligned} \\frac{1}{1+e^{-(\\hat{\\beta_0} + \\hat{\\beta_1} * Foggy)}} \\end{aligned}`,
    false
  )}
</p>
<br />
<p class="tab-text">
  <span class="bold">Interpretation</span>: This model summarizes the difference
  in the probability of a sunny day for days that are foggy and days that are
  not.

  <br /><br /> The weight {@html katexify(`\\hat{\\beta_1}`, false)} is the change
  in the log-odds ratio for a foggy day relative to a non-foggy day. For a coefficient
  of -0.7, the exponentiated value is {@html katexify(
    `e^{-0.7} = 0.50`,
    false
  )}, which indicates that on average, the odds that the day will be sunny
  multiplies by 0.50 (i.e. is about half) if it is foggy compared to if it is
  not.

  <br /><br />The intercept {@html katexify(`\\hat{\\beta_0}`, false)} is the odds
  of a sunny day if it is not foggy.
  <br /><br />
</p>

<style>
  .interpretation-header {
    font-family: var(--font-heavy);
    font-size: larger;
  }
</style>
