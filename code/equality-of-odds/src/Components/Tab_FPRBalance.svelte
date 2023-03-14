<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
</script>

<p class="body-text">
  <span class="definition-header">False Positive Error Rate Balance</span>
</p>
<br />
<p class="body-text">
  The first fairness measure we can derive from EO looks at the False Positive
  Rate per group and takes the difference:
  {@html katexify(`FPR_{circles} - FPR_{triangles}`, true)}
  The resulting value will be in the range [-1, 1], the closer to 0 the more predictive
  equality the model achieves. FPR calculates the percentage of false positives compared
  to all positive predictions. In our example this would translate to: "What is the
  percentage of students that received a grant even though they did not deserve it?". 
</p>

<style>
  .definition-header {
    font-family: var(--font-bold);
  }

  @media screen and (max-width: 950px) {
    .definition-header {
      font-size: 0.8rem;
    }
  }
</style>
