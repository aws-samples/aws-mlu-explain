<script>
  import Bandit from "./Bandit.svelte";
  import LineWorld from "./LineWorld.svelte";
  import GridWorld from "./GridWorld.svelte";
</script>

<h1 class="body-header">Simulation</h1>

<p class="body-text">
  Let’s see reinforcement learning in action! We’ll walk through a scenario with
  a robot learning to find bananas.
</p>

<Bandit />

<LineWorld />

<GridWorld />

<style>
  /* sample css to style reactivity button */
  .button-div {
    display: flex;
    justify-content: center;
  }
  button {
    font-family: "Amazon Ember Mono";
    border: 3px solid black;
    padding: 5px 10px;
  }

  #static-chart {
    align-items: left;
    justify-content: left;
    display: flex;
    margin: auto;
    width: 50%;
    height: 50%;
    /* width: 900px; */
    /* height: 600px; */
  }

  table {
    border-collapse: collapse;
    /* max-width: 100%; */
    margin: auto;
    font-size: 20px;
    font-family: var(--font-main);
  }

  td,
  th {
    border: 3px solid #dddddd;
    text-align: left;
    padding: 8px;
    color: var(--squid-ink);
  }

  th:nth-child(1) {
    border: 0;
  }

  .table-head {
    font-family: var(--font-heavy);
    color: var(--squid-ink);
    border: none;
  }

  @media screen and (max-width: 768px) {
    table {
      max-width: 95%;
    }
  }
</style>
