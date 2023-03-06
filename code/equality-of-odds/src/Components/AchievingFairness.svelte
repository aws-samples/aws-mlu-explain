<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
  import Scatter2 from "./charts/Scatter2.svelte";
  import StackedBar from "./charts/StackedBar.svelte";
</script>

<section>
  <p class="body-header">Equalized Odds to achieve fairness</p>
  <p class="body-text">
    Secondly, we can use EO to actually change the predictions a model makes to
    meet the probability equation we reviewed earlier.
  </p>
  <br />
  <div id="charts2-container">
    <div id="scatter2-container">
      <Scatter2 />
    </div>
    <div id="output2-container">
      <StackedBar />
    </div>
  </div>
</section>

<style>
  #charts2-container {
    display: grid;
    margin: auto;
    height: 38vh;
    width: 70%;
    grid-template-columns: 50% 50%;
    grid-gap: 2%;
    max-width: 1000px;
  }
  #scatter2-container {
    max-height: 38vh;
  }
  #output2-container {
    border: var(--sky);
    max-height: 38vh;
  }
  ul {
    max-width: 600px;
    margin: auto;
    color: var(--squid-ink);
    padding-top: 0.5rem;
  }
  li {
    padding: 0.25rem;
    list-style: none;
    color: var(--squid-ink);
  }
  /* mobile */
  @media screen and (max-width: 950px) {
    ul {
      max-width: 80%;
    }
    li {
      padding: 0.25rem 0;
    }
  }
</style>
