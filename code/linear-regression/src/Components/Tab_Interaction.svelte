<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
</script>

<p class="body-text">
  <span class="interpretation-header"
    >Interpreting A Multivariate Regression Model With Interaction</span
  >
  <br /><br />
  <span class="bold">Model Form:</span>
  {@html katexify(`y=β0+β1∗x1+β2∗x2+ β3∗(x1:x2)`, false)}
</p>
<br /><br />
<p class="body-text">
  <span class="bold">Example:</span>
  {@html katexify(
    `y=4 + 200*sqft + 100*num_floors + 400*(sqft:num_floors)`,
    false
  )}
</p>
<br />
<p class="body-text">
  <span class="bold">Interpretation</span>: Typically, a regression model will
  contain more than one features. We call this a
  <i>multivariate regression model</i>. In our example, we model home prices as
  a function of both the size of the house ({@html katexify(`sqft`, false)}) and
  whether or not it has a pool ({@html katexify(`has\\_pool`, false)}).
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
</style>
