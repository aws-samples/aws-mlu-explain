<script>
  import ScatterGrid from "./ScatterGrid.svelte";
  import SimulationGrid from "./SimulationGrid.svelte";
  import { agent, agentPath, gridQValues, epsilon } from "../data-store.js";
  // import { Env } from "../Env.js"
  // import Agent from "../Agent.js"

  const randomInt = (max, min) => Math.round(Math.random() * (max - min)) + min;

  const numCells = 4;

  const numX = numCells;
  // 	change for 1 dim
  const numY = 4;
  

  // Check current x and y, determing where it can move
  // function moveAgent() {
  //   const randX = randomInt(numX - 1, 0) + 0.5;
  //   const randY = randomInt(numY - 1, 0) + 0.5;
  //   agent.set({
  //     x: randX,
  //     y: randY,
  //   });

  //   const newAgentPath = [...$agentPath, { x: randX, y: randY }];
  //   agentPath.set(newAgentPath);
  // }

  // x can be 0.5, 1.5, 2.5, 3.5
  function moveAgent(numRepeats) {
    // how to access current x and y

    for (let i = 0; i < numRepeats; i++) {

      let currX = $agentPath[$agentPath.length - 1]["x"];
      let currY = $agentPath[$agentPath.length - 1]["y"];

      // if x == 0.5, choosing between 0.5 and 1.5
      // if y == 0.5, choosing between 0.5 and 1.5
      // if x == 4.5, choosing between 3.5 and 4.5
      // if y == 4.5, choosing between 3.5 and 4.5
      // sample x and y

      // let newX;
      // let newY;

      // const newX = randomInt(currX + 0.5, currX - 0.5) + 0.5;
      // const newY = randomInt(currY + 0.5, currY - 0.5) + 0.5;


      if (currX == numX - 0.5) {
        var newX = randomInt(currX - 0.5, currX - 1.5) + 0.5;
      } else if (currX == 0.5) {
        var newX = randomInt(currX + 0.5, 0) + 0.5;
      } else {
        var newX = randomInt(currX + 0.5, currX - 1.5) + 0.5;
      }

      if (currY == numY - 0.5) {
        var newY = randomInt(currY - 0.5, currY - 1.5) + 0.5;
      } else if (currY == 0.5) {
        var newY = randomInt(currY + 0.5, 0) + 0.5;
      } else {
        var newY = randomInt(currY + 0.5, currY - 1.5) + 0.5;
      }


      // if (currY == numY) {
      //   var newY = randomInt(currY, currY - 0.5) + 0.5;
      // } else {
      //   var newY = randomInt(currY + 0.5, currY - 0.5) + 0.5;

      // }

      agent.set({
        x: newX,
        y: newY,
      });

      const newAgentPath = [...$agentPath, { x: newX, y: newY }];
      agentPath.set(newAgentPath);
    }
  }

  function reset() {
    agent.set({
        x: newX,
        y: newY,
      });

    const newAgentPath = [...$agentPath, { x: randX, y: randY }];
    agentPath.set(newAgentPath);

    // loop through grid values to update
    // for each value in grid
    const newVals = $gridQValues.map((row) => {
      return {
        x: [...Array(row["redValue"].length + 1).keys()],
        redValue: [...row["redValue"], randomInt(numX - 1, 0) + 0.5],
        blueValue: [...row["blueValue"], randomInt(numX - 1, 0) + 2.5],
      };
    });
    $gridQValues = [...newVals];
  }

</script>

<h2 class="body-secondary-header">Navigating in a Grid World</h2>

<p class="body-text">
  Now the robot is in a commonly used environment in reinforcement learning: the
  gridworld. The robot can now move left, right, up, and down. Again, the
  robot’s actions affect the environment by changing its state in the grid.
</p>
<br /><br />
<p class="body-text">
  There is an obstacle in the gridworld: a lake. If the robot falls into the
  lake, it will lose all of its bananas and the episode will end. Therefore, the
  robot should learn to avoid the obstacle. Instead of learning to move left or
  right as in the line world, now the robot must learn the path to take.
</p>
<br /><br />
<p class="body-text">
  See for yourself how increasing epsilon can change the agent’s behavior in
  this 2-Dimensional environment.
</p>

<table>
  <tr>
    <th class="table-head">Agent</th>
    <th class="table-head">Environment</th>
    <th class="table-head">State</th>
    <th class="table-head">Actions</th>
    <th class="table-head">Reward</th>
  </tr>
  <tr>
    <td>Robot</td>
    <td>Grid World</td>
    <td>X,Y-Position</td>
    <td>Move Left, Move Right, Move Up, Move Down</td>
    <td>Number of Bananas</td>
  </tr>
</table>

<div id="graph-container">
  <SimulationGrid {numX} {numY} />
  <!-- <button on:click={() => moveAgent()}> Move Randomly </button> -->
  <!-- <QValuePlot /> -->
  <ScatterGrid />
</div>
<!-- <p>
  Todo: replace circle with agent, add arrows to each grid, update moveAgent
  function to move one-step randomly.
</p> -->

<div id="buttons-container">
  <button on:click={() => moveAgent(1)}>Select 1 Action</button>
  <button on:click={() => moveAgent(5)}>Select 5 Actions</button>
  <button on:click={() => ""}>Run 1 Episode</button>
  <button on:click={() => ""}>Run 5 Episodes</button>
  <button on:click={() => ""}>Show Optimal Solution</button>
  <button on:click={() => ""}>Reset</button>
</div>

<div id="input-container">
  <p>
    <span class="bold">Epsilon: </span>
    {$epsilon}
  </p>
  <input
    type="range"
    min="0"
    max="1"
    step="0.01"
    bind:value={$epsilon}
    class="slider"
    id="epsilonSlider"
  />
</div>

<style>
  #graph-container {
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    margin: 0px;
    width: 100%;
    /* flex-direction: column; */
  }

  table {
    border-collapse: collapse;
    /* max-width: 100%; */
    margin-right: auto;
    margin-left: auto;
    margin-top: 50px;
    margin-bottom: 50px;
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

  #buttons-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  button {
    background-color: var(--secondary);
    border: none;
    color: var(--paper);
    padding: 8px 16px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    margin: 10px 5px;
    cursor: pointer;
    opacity: 0.9;
    width: 150px;
  }

  button:hover {
    outline: 2px solid var(--squidink);
  }

  button:active {
    color: var(--squidink);
  }

  button:visited {
    color: var(--white);
  }

  #input-container {
    display: flex;
    justify-content: center;
  }

  .slider {
    -webkit-appearance: none;
    width: 20%;
    height: 15px;
    border-radius: 5px;
    background: var(--stone);
    outline: none;
    opacity: 0.9;
    -webkit-transition: 0.2s;
    transition: opacity 0.2s;
    border-color: var(--squidink);
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: var(--secondary);
    cursor: pointer;
  }

  @media screen and (max-width: 768px) {
    table {
      max-width: 95%;
    }
  }
</style>
