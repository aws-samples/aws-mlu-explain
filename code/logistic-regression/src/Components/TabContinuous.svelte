<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
</script>

<p class="tab-text">
  <span class="interpretation-header"
    >Interpreting A Logistic Regression Model With One Continuous Feature</span
  >
  <br /><br />
  <span class="bold">Model Form:</span>
  {@html katexify(
    `\\begin{aligned} P(y=1|x) = \\frac{1}{1+e^{-(\\hat{\\beta_0} + \\hat{\\beta_1} * x)}} \\end{aligned}`,
    false
  )} where {@html katexify(`x \\in \\llbracket \\Reals \\rrbracket`, false)}
</p>
<br />
<p class="tab-text">
  <span class="bold">Example:</span>
  {@html katexify(
    `\\begin{aligned} P(Day = Sunny|Temperature) = \\end{aligned}`,
    false
  )}
  {@html katexify(
    `\\begin{aligned} \\frac{1}{1 + e^{-(\\hat{\\beta_0} + \\hat{\\beta_1} *Temperature)}} \\end{aligned}`,
    false
  )}
</p>
<br />
<p class="tab-text">
  <span class="bold">Interpretation</span>: This model describes the probability
  of a sunny day across temperatures (measured in degrees Fahrenheit).
  <br /><br />
  The weight {@html katexify(`\\hat{\\beta_1}`, false)} is the change in the log-odds ratio for {@html katexify(`y`, false)} per unit change in {@html katexify(
    `X`,
    false
  )}. When exponentiating the weight, this becomes the change in the odds ratio
  for {@html katexify(`y`, false)} per unit change in {@html katexify(
    `X`,
    false
  )}. In other words, the odds are multiplied by {@html katexify(
    `e^{\\hat{\\beta_1}}`,
    false
  )}. Therefore, for a coefficient of 0.7, the exponentiated value is {@html katexify(
    `e^{0.7} = 2.01`,
    false
  )}, which indicates that on average, for an increase of 1 degree in
  temperature, the odds that the day will be sunny multiplies by 2.01 (i.e.
  approximately doubles).
  <br /><br />
  The intercept {@html katexify(`\\hat{\\beta_0}`, false)} is the odds of a sunny
  day at 0 degrees Fahrenheit. We can use this to calculate the probability of a
  sunny day by using the following calculation:
  {@html katexify(
    `p = \\frac{e^{\\hat{\\beta_i}}}{1 + e^{\\hat{\\beta_i}}}`,
    false
  )}.
  <br /><br />
  If the intercept coefficient is 2, this means that there is a {@html katexify(
    `p = \\frac{e^{2}}{1 + e^{2}} = 0.88`,
    false
  )} probability that it will be a sunny day at 0 degrees Fahrenheit.
</p>

<style>
  .interpretation-header {
    font-family: var(--font-heavy);
    font-size: larger;
  }
</style>
