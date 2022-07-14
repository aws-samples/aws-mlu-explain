<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
</script>

<p class="body-text">
  <span class="interpretation-header"
    >Interpreting A Multivariate Regression Model</span
  >
  <br /><br />
  <span class="bold">Model Form:</span>
  {@html katexify(
    `\\begin{aligned} P(Y=1|x) = \\frac{1}{1+e^{-(\\beta_0 + \\beta_1 * x_1 + \\beta_2 * x_2 + ... + \\beta_n * x_n)}} \\end{aligned}`,
    false
  )}
</p>
<br />
<p class="body-text">
  <span class="bold">Example:</span>
  {@html katexify(
    `\\begin{aligned} P(Day = Rainless|Temperature, Foggy) = \\frac{1}{1 + e^{-(\\beta_0 + \\beta_1 * Temperature + \\beta_2 * Foggy)}} \\end{aligned}`,
    false
  )}
</p>
<br />
<p class="body-text">
  <span class="bold">Interpretation</span>: Typically, a regression model will
  contain more than one feature. We call this a
  <i>multivariate regression model</i>. In this example, we model the
  probability of a rainless day as a function of temperature and whether or not
  it is foggy.
  <br /><br />The intercept, 78, represents the predicted housing price for
  houses with all {@html katexify(`xi = 0`, false)}: it represents the cost of
  houses with no pools and a square-footage of zero.<span
    class="info-tooltip"
    title="Because this value doesn't make much intuitive sense, it's common for models to be transformed and standardized before carrying out a regression model."
    use:tooltip
  >
    [&#8505;]
  </span>
  <br /><br /> The coefficient of {@html katexify(`has\\_pool`, false)}, 400,
  represents the average expected difference in houses of the same size (in
  sqft) that differed in whether or not they had a pool.<span
    class="info-tooltip"
    title="In other words, we expect, on average, houses of the same size to cost 400 more if they have a pool than if they do not."
    use:tooltip
  >
    [&#8505;]
  </span>
  <br /><br />The coefficient of {@html katexify(`sqft`, false)}, 12, represents
  the average expected difference in housing price for houses that have the same
  value of {@html katexify(`has\\_pool`, false)} but differ in size by one square-foot.
</p>

<style>
  .interpretation-header {
    font-family: var(--font-heavy);
    font-size: larger;
  }
</style>
