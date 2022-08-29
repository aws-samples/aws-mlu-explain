<script>
  import ScatterGrid from "./ScatterGrid.svelte";
  import SimulationGrid from "./SimulationGrid.svelte";
  import { gridRobot, gridRobotPath, epsilon, gridQValues } from "../data-store.js";
  import { Env } from "../Env.js";
  import { Agent } from "../Agent.js";

  const randomInt = (max, min) => Math.round(Math.random() * (max - min)) + min;

  // Finds the index of the maximum
  function argMax(array) {
    return array
      .map((x, i) => [x, i])
      .reduce((r, a) => (a[0] > r[0] ? a : r))[1];
  }

  const numCells = 4;

  // 	change for 1 dim
  const numX = numCells;
  const numY = 4;

  var xVal;
  var yVal;

  xVal = $gridRobotPath[0]["x"];
  yVal = $gridRobotPath[0]["y"];

  const actions = ["up", "down", "left", "right"];

  //  Define the environment
  const env = new Env(
    [3, 0], // start
    numY, // rows
    numX, // columns
    { [[3, 2]]: 10, [[0, 0]]: 2 }, // Map of states and the corresponding reward
    {
      [[2, 2]]: -5,
    }, // Map of states and the corresponding reward
    true, // deterministic: Stochastic env not implemented yet
    true, // exploring_starts: Initializa agent at a random state in subsequent episodes.
    0.4 // exploring_starts_prob: Probability of selecting a random initial state instead of specified one
  );

  // set lambda to 0 for TD(0) update and lamdba to 1 for MC
  const gridAgent = new Agent(
    env.rows,
    env.columns,
    env.wins, // for plotting
    env.losses, // for plotting
    "q-learning", // 'q-learning' or 'sarsa'
    $epsilon, // Control exploration
    0.1, // Learning rate
    0.7, // Discount factor
    0.5 // Decay parameter for eligibility trace
  );

  // episode, row, column, action
  const numEpisodes = 10;
  var episodicValues = gridAgent.runEpisodes(env, numEpisodes);

  reset();

  // Check current x and y, determing where it can move
  function moveAgent(numRepeats, episodicValues) {
    // how to access current x and y

    for (let i = 0; i < numRepeats; i++) {

      let currX = $gridRobotPath[$gridRobotPath.length - 1]["x"] - 0.5;
      let currY = $gridRobotPath[$gridRobotPath.length - 1]["y"] - 0.5;

      var currState = [currX, currY];

      var chosenAction = gridAgent.chooseAction(currState);
      var [nextState, reward, done] = env.step(chosenAction);

      console.log(chosenAction)
      console.log(nextState)

      // gridAgent.run_additional_episodes(env, 1, episodicValues);

      const newX = nextState[0] + 0.5;
      const newY = nextState[1] + 0.5;

      console.log(newX);
      console.log(newY);

      gridRobot.set({
        x: newX,
        y: newY,
      });

      const newRobotPath = [...$gridRobotPath, { x: newX, y: newY }];
      gridRobotPath.set(newRobotPath);

      // TODO: Replace with new Q-values
      const newVals = $gridQValues.map((state, index) => {
          const r = index % numY;
          const c = Math.floor(index / numY);
          const upVal = episodicValues[ep][r][c][0];
          const downVal = episodicValues[ep][r][c][1];
          const leftVal = episodicValues[ep][r][c][2];
          const rightVal = episodicValues[ep][r][c][3];

          const allVals = [upVal, downVal, leftVal, rightVal];
          const maxIndex = argMax(allVals);

          let maxDir;

          if (maxIndex == 0) {
            maxDir = "up";
          } else if (maxIndex == 1) {
            maxDir = "down";
          } else if (maxIndex == 2) {
            maxDir = "left";
          } else if (maxIndex == 3) {
            maxDir = "right";
          }

        return {
          episodeNumber: [...Array(row["up"].length + 1).keys()],
          up: [...row["up"], 1],
          down: [...row["down"], 1],
          left: [...row["left"], 1],
          right: [...row["right"], 1],
          maxDirection: [...row["maxDirection"], maxDir],
        };
      });

      $gridQValues = [...newVals];

      // let currX = $gridRobotPath[$gridRobotPath.length - 1]["x"];
      // let currY = $gridRobotPath[$gridRobotPath.length - 1]["y"];

      // if (currX == numX - 0.5) {
      //   var newX = randomInt(currX - 0.5, currX - 1.5) + 0.5;
      // } else if (currX == 0.5) {
      //   var newX = randomInt(currX + 0.5, 0) + 0.5;
      // } else {
      //   var newX = randomInt(currX + 0.5, currX - 1.5) + 0.5;
      // }

      // if (currY == numY - 0.5) {
      //   var newY = randomInt(currY - 0.5, currY - 1.5) + 0.5;
      // } else if (currY == 0.5) {
      //   var newY = randomInt(currY + 0.5, 0) + 0.5;
      // } else {
      //   var newY = randomInt(currY + 0.5, currY - 1.5) + 0.5;
      // }
    }
  }

  function runEpisode(numEpisodes, episodicValues) {
    var episodicValues = gridAgent.runAdditionalEpisodes();
  }

  function reset() {
    const startX = 0.5;
    const startY = 0.5;
    gridRobot.set({
      x: startX,
      y: startY,
    });

    gridRobotPath.set([{ x: startX, y: startY }]);

    gridQValues.set([
      { episodeNumber: [], up: [], down: [], left: [], right: [], maxDirection: [] },
      { episodeNumber: [], up: [], down: [], left: [], right: [], maxDirection: [] },
      { episodeNumber: [], up: [], down: [], left: [], right: [], maxDirection: [] },
      { episodeNumber: [], up: [], down: [], left: [], right: [], maxDirection: [] },
      { episodeNumber: [], up: [], down: [], left: [], right: [], maxDirection: [] },
      { episodeNumber: [], up: [], down: [], left: [], right: [], maxDirection: [] },
      { episodeNumber: [], up: [], down: [], left: [], right: [], maxDirection: [] },
      { episodeNumber: [], up: [], down: [], left: [], right: [], maxDirection: [] },
      { episodeNumber: [], up: [], down: [], left: [], right: [], maxDirection: [] },
      { episodeNumber: [], up: [], down: [], left: [], right: [], maxDirection: [] },
      { episodeNumber: [], up: [], down: [], left: [], right: [], maxDirection: [] },
      { episodeNumber: [], up: [], down: [], left: [], right: [], maxDirection: [] },
      { episodeNumber: [], up: [], down: [], left: [], right: [], maxDirection: [] },
      { episodeNumber: [], up: [], down: [], left: [], right: [], maxDirection: [] },
      { episodeNumber: [], up: [], down: [], left: [], right: [], maxDirection: [] },
      { episodeNumber: [], up: [], down: [], left: [], right: [], maxDirection: [] },
    ]);

    for (let ep = 0; ep < numEpisodes; ep++) {
      // Mapping combination of row and col onto row of gridQvalues
      // state is row in gridQValues
      // (0,0), (1,0), (2,0), (3,0)
      // (0,1), (1,1), (2,1), (3,1)
      // (0,2), (1,2), (2,2), (3,2)
      // (0,3), (1,3), (2,3), (3,3)
      const newVals = $gridQValues.map((state, index) => {
        const r = index % numY;
        const c = Math.floor(index / numY);
        const upVal = episodicValues[ep][r][c][0];
        const downVal = episodicValues[ep][r][c][1];
        const leftVal = episodicValues[ep][r][c][2];
        const rightVal = episodicValues[ep][r][c][3];

        const allVals = [upVal, downVal, leftVal, rightVal];
        const maxIndex = argMax(allVals);

        let maxDir;

        if (maxIndex == 0) {
          maxDir = "up";
        } else if (maxIndex == 1) {
          maxDir = "down";
        } else if (maxIndex == 2) {
          maxDir = "left";
        } else if (maxIndex == 3) {
          maxDir = "right";
        }

        return {
          episodeNumber: [...Array(state["up"].length + 1).keys()],
          up: [...state["up"], episodicValues[ep][r][c][0]],
          down: [...state["down"], episodicValues[ep][r][c][1]],
          left: [...state["left"], episodicValues[ep][r][c][2]],
          right: [...state["right"], episodicValues[ep][r][c][3]],
          maxDirection: [...state["maxDirection"], maxDir],
        };
      });
      $gridQValues = [...newVals];
    }
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
  <ScatterGrid />
</div>

<div id="buttons-container">
  <button on:click={() => moveAgent(1, episodicValues)}>Select 1 Action</button
  >
  <button on:click={() => moveAgent(5, episodicValues)}
    >Select 5 Actions</button
  >
  <button on:click={() => ""}>Run 1 Episode</button>
  <button on:click={() => ""}>Run 5 Episodes</button>
  <button on:click={() => ""}>Show Optimal Solution</button>
  <button on:click={() => reset()}>Reset</button>
</div>

<!-- <div id="input-container">
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
</div> -->
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
