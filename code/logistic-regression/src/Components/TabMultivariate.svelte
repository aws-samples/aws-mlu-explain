<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
</script>

<p class="tab-text">
  <span class="interpretation-header"
    >Interpreting A Multivariate Logistic Regression Model</span
  >
  <br /><br />
  <span class="bold">Model Form:</span>
  {@html katexify(
    `\\begin{aligned} P(y=1|x) = \\frac{1}{1+e^{-(\\hat{\\beta_0} + \\hat{\\beta_1} * x_1 + \\hat{\\beta_2} * x_2 + ... + \\hat{\\beta_n} * x_n)}} \\end{aligned}`,
    false
  )}
</p>
<br />
<p class="tab-text">
  <span class="bold">Example:</span>
  {@html katexify(
    `\\begin{aligned} P(Day = Sunny|Temperature, Foggy) = \\end{aligned}`,
    false
  )}
  {@html katexify(
    `\\begin{aligned} \\frac{1}{1 + e^{-(\\hat{\\beta_0} + \\hat{\\beta_1} * Temperature + \\hat{\\beta_2} * Foggy)}} \\end{aligned}`,
    false
  )}
</p>
<br />
<p class="tab-text">
  <span class="bold">Interpretation</span>: Typically, a logistic regression model will
  contain more than one feature. We call this a
  <i>multivariate logistic regression model</i>. In this example, we model the
  probability of a sunny day as a function of temperature and whether or not it
  is foggy.
  <br /><br />The intercept represents the predicted probability of a sunny day
  for Days with all {@html katexify(`x_i = 0`, false)}: it represents the
  probability for days without fog and with a temperature of zero degrees
  Fahrenheit.
  <br /><br /> The weight {@html katexify(`\\hat{\\beta_1}`, false)} is the change
  in the log-odds ratio for a sunny day per unit change in temperature, and the weight
  {@html katexify(`\\hat{\\beta_2}`, false)} is the change in the log-odds ratio
  for a foggy day relative to a non-foggy day.
</p>

<style>
  .interpretation-header {
    font-family: var(--font-heavy);
    font-size: larger;
  }
</style>
