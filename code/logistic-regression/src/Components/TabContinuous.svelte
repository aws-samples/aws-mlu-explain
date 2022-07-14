<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
</script>

<p class="body-text">
  <span class="interpretation-header"
    >Interpreting A Logistic Regression Model With One Continuous Feature</span
  >
  <br /><br />
  <span class="bold">Model Form:</span>
  {@html katexify(
    `\\begin{aligned} P(Y=1|x) = \\frac{1}{1+e^{-(\\beta_0 + \\beta_1 * x)}} \\end{aligned}`,
    false
  )} where {@html katexify(`\\beta_1 \\in \\llbracket \\Reals \\rrbracket`, false)}
</p>
<br />
<p class="body-text">
  <span class="bold">Example:</span>
  {@html katexify(
    `\\begin{aligned} P(Day = Rainless|Temperature) = \\frac{1}{1 + e^{-(\\beta_0 + \\beta_1 *Temperature)}} \\end{aligned}`,
    false
  )}
</p>
<br />
<p class="body-text">
  <span class="bold">Interpretation</span>:
  This model describes the probability of a rainless day across temperatures (measured
  in degrees Fahrenheit). 
  <br /><br />
  The weight {@html katexify(`\\beta_1`, false)} is the change in the log odds ratio
  for Y per unit change in X. When exponentiating the weight, this becomes the change
  in the odds ratio for Y per unit change in X. In other words, the odds are multiplied
  by e^{@html katexify(`\\beta_1`, false)}. Therefore, for a coefficient of 0.7,
  the exponentiated value is exp(0.7) = 2.01, which indicates that on average,
  for an increase of 1 degree in temperature, the odds that the day will be
  rainless multiplies by 2.01 (i.e. approximately doubles).
  <br /><br />
  The intercept {@html katexify(`\\beta_0`, false)} is the odds of a rainless day
  at 0 degrees Fahrenheit. We can use this to calculate the probability of a rainless
  day by using the following calculation:
  {@html katexify(`p = \\frac{e^{b}}{1 + e^{b}}`, false)}
  <br /><br />
  If the intercept coefficient is 2, this means that there is a p = e^2/(1+e^2) =
  0.88 probability that it will be a rainless degree at 0 degrees Fahrenheit.
  <!-- <span
    class="info-tooltip"
    title="Because this value doesn't make much intuitive sense, it's common for models to be transformed and standardized before carrying out a regression model."
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
