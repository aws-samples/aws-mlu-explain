<script>
    import katexify from "../katexify";
    import { tooltip } from "../tooltip";
  </script>
  
  <p class="body-text">
    <span class="definition-header">False Positive Error Rate Balance</span>
  </p>
  <br />
  <p class="body-text">
    The first fairness measure we can derive from EO looks at the FPR per group
    and takes the difference:
    {@html katexify(`FPR_{sheep} - FPR_{lama}`, true)}
    The resulting value will be in the range [-1, 1], the closer to 0 the more predictive
    equality the model achieves.
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
  