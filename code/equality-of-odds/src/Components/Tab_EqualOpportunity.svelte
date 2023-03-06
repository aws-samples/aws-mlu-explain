<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
</script>

<p class="tab-text">
  <span class="definition-header">False Negative Error Rate Balance</span>
</p>
<br />
<p class="tab-text">
  <span class="bold">definition</span>: Typically, a regression model will
  contain more than one feature. We call this a
  <i>multivariate regression model</i>. In our example, we model home prices as
  a function of both the size of the house. </p>

<style>
  #scatter-chart {
    max-height: 30vh;
    width: 500px;
    margin: 1rem auto;
  }

  .definition-circle {
    stroke-width: 0;
  }

  .definition-title,
  .definition-axis-label {
    font-size: 0.85rem;
  }

  .axis-text {
    font-size: 0.7rem;
  }

  .grid-line {
    opacity: 0.075;
  }

  .outline-line {
    stroke-width: 4.5;
    stroke: white;
  }

  .path-line-pool {
    fill: none;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 3;
    stroke: var(--anchor);
  }

  .path-line-sqft {
    fill: none;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 3;
    stroke: var(--smile);
  }

  .dot-without {
    height: 12px;
    width: 12px;
    background-color: var(--smile);
    border-radius: 50%;
    display: inline-block;
  }
  .dot-with {
    height: 12px;
    width: 12px;
    background-color: var(--anchor);
    border-radius: 50%;
    display: inline-block;
  }

  .line-without {
    height: 3px;
    width: 12px;
    background-color: var(--smile);
    display: inline-block;
    margin-bottom: 4px;
  }
  .line-with {
    height: 3px;
    width: 12px;
    background-color: var(--anchor);
    display: inline-block;
    margin-bottom: 4px;
  }

  @media screen and (max-width: 950px) {
    #scatter-chart {
      width: 100%;
      max-width: 100%;
      margin: 1rem auto;
    }

    .definition-title {
      font-size: 0.8rem;
    }

    .axis-text {
      font-size: 0.6rem;
    }
  }
</style>
