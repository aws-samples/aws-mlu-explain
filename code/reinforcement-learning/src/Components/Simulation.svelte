<script>
  import Bandit from "./Part1.svelte";
  import LineWorld from "./Part2.svelte";
  import GridWorld from "./Part3.svelte";

  // import P5 from "p5-svelte";

  // const sketch = (p5) => {
  //   let grid_height = 250;
  //   let grid_width = 250;
  //   p5.setup = () => {
  //     p5.createCanvas(grid_width, grid_height);
  //   };

  //   p5.draw = () => {
  //     p5.background(300);
  //     for (var x = 0; x <= grid_width; x += grid_width / 4) {
  //       for (var y = 0; y <= grid_height; y += grid_height / 4) {
  //         p5.stroke(0);
  //         p5.strokeWeight(2);
  //         p5.line(x, 0, x, grid_height);
  //         p5.line(0, y, grid_width, y);
  //       }
  //     }
  //   };
  // };

  // const scatterChart = new Scatter({
  //   chartContainer: "static-chart",
  //   data: scatterData
  // });
  // console.log(scatterData, 'hm')
</script>

<h1 class="body-header">Simulation</h1>

<p class="body-text">
  Let’s see reinforcement learning in action! We’ll walk through a scenario with
  a robot learning to find bananas.
</p>

<Bandit />

<LineWorld />

<GridWorld />

<div id="static-chart">
  <!-- <P5 {sketch} /> -->
</div>

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
