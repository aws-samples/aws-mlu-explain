<script>
  import ScatterGrid from "./ScatterGrid.svelte";
  import SimulationGrid from "./SimulationGrid.svelte";
  import {
    gridRobot,
    gridRobotPath,
    gridEpsilon,
    gridQValues,
    lowRewardGrid,
    highRewardGrid,
    negRewardGrid,
    startPosGrid,
    gridStatIndex,
    gridRecordInterval,
  } from "../data-store.js";
  import { Env } from "../Env.js";
  import { Agent } from "../Agent.js";
  import { onMount } from "svelte";
  import { select, selectAll } from "d3-selection";

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

  let width;
  let height;

  var xVal;
  var yVal;

  // xVal = $gridRobotPath[0]["x"];
  // yVal = $gridRobotPath[0]["y"];

  const actions = ["up", "down", "left", "right"];

  // Episodic Q Values retrieved from simulation
  var episodicValues = Array();

  // Keep records at intervals.
  var episodeCount = 0;
  var episodeIntervalArray = [];
  const maxEpisodes = 3000; // Limit how many episodes can be run

  // Define the starting position
  var startX = 0.5;
  var startY = 0.5;

  //  Define the environment
  var env = new Env();

  // Define the agent
  var gridAgent = new Agent(
    env.rows,
    env.columns,
    env.wins, // for plotting
    env.losses // for plotting
  );

  // Set the env arrangement index
  var randomIndex = 0;

  // Start with a reset
  reset();

  // Run episodic trials and update Q-values
  function runAgentTrials(numEpisodes, episodicValues) {
    // Reduce the burden
    if (episodeCount > maxEpisodes) {
      return;
    }
    let trialStats = gridAgent.runEpisodes(env, numEpisodes);

    for (let ep = 0; ep < numEpisodes; ep++) {
      if (episodeCount % $gridRecordInterval == $gridRecordInterval - 1) {
        episodicValues.push(trialStats[ep]);
        episodeIntervalArray.push(episodeCount + 1);
      }
      episodeCount++;
    }

    // Update gridQValues
    updateGridQVals();

    // Reset robot position to starting position
    gridRobot.set({
      x: startX,
      y: startY,
    });

    gridRobotPath.set([{ x: startX, y: startY }]);

    // Reset episodicValues once gridQValues are updated
    episodicValues = Array();
  }

  function simulateEpisode(maxSteps = 15) {
    // Reset the robot to the starting position
    gridRobot.set({
      x: startX,
      y: startY,
    });

    gridRobotPath.set([{ x: startX, y: startY }]);

    // Variables to keep track of robot
    let currX = startX - 0.5;
    let currY = startY - 0.5;

    let nextX;
    let nextY;

    for (let i = 0; i < maxSteps; i++) {
      if ([currY, currX] in env.wins || [currY, currX] in env.losses) {
        break;
      }
      let index = currY + numX * currX;
      let state = $gridQValues[index];

      // Set default maxDirection incase Q values aren't learnt
      var maxDirection = "up";
      if (state["maxDirection"].length) {
        maxDirection = state["maxDirection"][state["maxDirection"].length - 1];
      }

      // Take action in direction of highest Q-value
      if (maxDirection == "up") {
        nextX = currX;
        nextY = currY - 1;
      } else {
        if (maxDirection == "down") {
          nextX = currX;
          nextY = currY + 1;
        } else {
          if (maxDirection == "left") {
            nextX = currX - 1;
            nextY = currY;
          } else {
            nextX = currX + 1;
            nextY = currY;
          }
        }
      }
      // Check validity of the transition
      if (nextX >= 0 && nextX <= env.rows - 1) {
        if (nextY >= 0 && nextY <= env.columns - 1) {
          currX = nextX;
          currY = nextY;
        }
      }

      gridRobot.set({
        x: currX + 0.5,
        y: currY + 0.5,
      });

      const newRobotPath = [
        ...$gridRobotPath,
        { x: currX + 0.5, y: currY + 0.5 },
      ];
      gridRobotPath.set(newRobotPath);
    }
  }

  // Generate optimal policy regardless of the epsilon value
  function getOptimalPolicy(){
    reset(true, false);
    runAgentTrials(maxEpisodes, episodicValues)
  }

  function reset(forOptimal=false, resetPosition=true) {
    // Reset episode count
    episodeCount = 0;
    episodeIntervalArray = [];
    var epsilon = forOptimal ? 0.7 : $gridEpsilon; // Produce optimal policy even when epsilon is too low

    // Randomly select environment stats only when reset button is clicked.
    if(resetPosition){
      randomIndex = Math.floor(Math.random() * $startPosGrid.length);
    }
    gridStatIndex.set(randomIndex);

    // Set starting position
    startX = $startPosGrid[randomIndex][0] + 0.5;
    startY = $startPosGrid[randomIndex][1] + 0.5;

    // Set the agent's starting position
    gridRobot.set({
      x: startX,
      y: startY,
    });

    // Set the wins and losses stats
    var wins = {};
    wins[
      [$highRewardGrid[randomIndex][1], $highRewardGrid[randomIndex][0]]
    ] = 10;
    wins[[$lowRewardGrid[randomIndex][1], $lowRewardGrid[randomIndex][0]]] = 2;

    var losses = {};
    losses[[$negRewardGrid[randomIndex][1], $negRewardGrid[randomIndex][0]]] =
      -5;

    //  Define the environment
    env = new Env(
      [startY - 0.5, startX - 0.5], // start
      numY, // rows
      numX, // columns
      wins, // Map of states and the corresponding reward
      losses, // Map of states and the corresponding reward
      {},
      true, // deterministic: Stochastic env not implemented yet
      true, // exploring_starts: Initializa agent at a random state in subsequent episodes.
      0.0 // exploring_starts_prob: Probability of selecting a random initial state instead of specified one
    );

    // set lambda to 0 for TD(0) update and lamdba to 1 for MC
    gridAgent = new Agent(
      env.rows,
      env.columns,
      env.wins, // for plotting
      env.losses, // for plotting
      "q-learning", // 'q-learning' or 'sarsa'
      epsilon, // Control exploration
      0.1, // Learning rate
      0.8, // Discount factor
      0.5 // Decay parameter for eligibility trace
    );

    gridRobot.set({
      x: startX,
      y: startY,
    });

    // Reset GridAgent stats
    gridAgent.resetQValues();
    gridAgent.resetTraceMatrix();

    gridRobotPath.set([{ x: startX, y: startY }]);

    gridQValues.set([
      {
        episodeNumber: [0],
        up: [0],
        down: [0],
        left: [0],
        right: [0],
        maxDirection: [],
        upWeight: [0],
        downWeight: [0],
        leftWeight: [0],
        rightWeight: [0],
      },
      {
        episodeNumber: [0],
        up: [0],
        down: [0],
        left: [0],
        right: [0],
        maxDirection: [],
        upWeight: [0],
        downWeight: [0],
        leftWeight: [0],
        rightWeight: [0],
      },
      {
        episodeNumber: [0],
        up: [0],
        down: [0],
        left: [0],
        right: [0],
        maxDirection: [],
        upWeight: [0],
        downWeight: [0],
        leftWeight: [0],
        rightWeight: [0],
      },
      {
        episodeNumber: [0],
        up: [0],
        down: [0],
        left: [0],
        right: [0],
        maxDirection: [],
        upWeight: [0],
        downWeight: [0],
        leftWeight: [0],
        rightWeight: [0],
      },
      {
        episodeNumber: [0],
        up: [0],
        down: [0],
        left: [0],
        right: [0],
        maxDirection: [],
        upWeight: [0],
        downWeight: [0],
        leftWeight: [0],
        rightWeight: [0],
      },
      {
        episodeNumber: [0],
        up: [0],
        down: [0],
        left: [0],
        right: [0],
        maxDirection: [],
        upWeight: [0],
        downWeight: [0],
        leftWeight: [0],
        rightWeight: [0],
      },
      {
        episodeNumber: [0],
        up: [0],
        down: [0],
        left: [0],
        right: [0],
        maxDirection: [],
        upWeight: [0],
        downWeight: [0],
        leftWeight: [0],
        rightWeight: [0],
      },
      {
        episodeNumber: [0],
        up: [0],
        down: [0],
        left: [0],
        right: [0],
        maxDirection: [],
        upWeight: [0],
        downWeight: [0],
        leftWeight: [0],
        rightWeight: [0],
      },
      {
        episodeNumber: [0],
        up: [0],
        down: [0],
        left: [0],
        right: [0],
        maxDirection: [],
        upWeight: [0],
        downWeight: [0],
        leftWeight: [0],
        rightWeight: [0],
      },
      {
        episodeNumber: [0],
        up: [0],
        down: [0],
        left: [0],
        right: [0],
        maxDirection: [],
        upWeight: [0],
        downWeight: [0],
        leftWeight: [0],
        rightWeight: [0],
      },
      {
        episodeNumber: [0],
        up: [0],
        down: [0],
        left: [0],
        right: [0],
        maxDirection: [],
        upWeight: [0],
        downWeight: [0],
        leftWeight: [0],
        rightWeight: [0],
      },
      {
        episodeNumber: [0],
        up: [0],
        down: [0],
        left: [0],
        right: [0],
        maxDirection: [],
        upWeight: [0],
        downWeight: [0],
        leftWeight: [0],
        rightWeight: [0],
      },
      {
        episodeNumber: [0],
        up: [0],
        down: [0],
        left: [0],
        right: [0],
        maxDirection: [],
        upWeight: [0],
        downWeight: [0],
        leftWeight: [0],
        rightWeight: [0],
      },
      {
        episodeNumber: [0],
        up: [0],
        down: [0],
        left: [0],
        right: [0],
        maxDirection: [],
        upWeight: [0],
        downWeight: [0],
        leftWeight: [0],
        rightWeight: [0],
      },
      {
        episodeNumber: [0],
        up: [0],
        down: [0],
        left: [0],
        right: [0],
        maxDirection: [],
        upWeight: [0],
        downWeight: [0],
        leftWeight: [0],
        rightWeight: [0],
      },
      {
        episodeNumber: [0],
        up: [0],
        down: [0],
        left: [0],
        right: [0],
        maxDirection: [],
        upWeight: [0],
        downWeight: [0],
        leftWeight: [0],
        rightWeight: [0],
      },
    ]);

    // Reset episodicValues
    episodicValues = Array();

    // Update gridQValues (not needed)
    updateGridQVals();
  }

  function updateGridQVals() {
    if (episodicValues.length == 0) {
      return;
    }

    // Maintain index to update the episodic count
    var episodeIntervalArrayIndex =
      episodeIntervalArray.length - episodicValues.length;

    for (let ep = 0; ep < episodicValues.length; ep++) {
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

        const valSum =
          Math.abs(upVal) +
          Math.abs(downVal) +
          Math.abs(leftVal) +
          Math.abs(rightVal);

        const vals = {
          episodeNumber: [
            ...state["episodeNumber"],
            episodeIntervalArray[episodeIntervalArrayIndex + ep],
          ],
          up: [...state["up"], upVal],
          down: [...state["down"], downVal],
          left: [...state["left"], leftVal],
          right: [...state["right"], rightVal],
          maxDirection: [...state["maxDirection"], maxDir],
          upWeight: [...state["upWeight"], upVal / valSum || 0],
          downWeight: [...state["downWeight"], downVal / valSum || 0],
          leftWeight: [...state["leftWeight"], leftVal / valSum || 0],
          rightWeight: [...state["rightWeight"], rightVal / valSum || 0],
        };

        return vals;
      });
      $gridQValues = [...newVals];
    }
    // Reset episodicValues
    episodicValues = Array();
    console.log($gridQValues);
  }

  // let sections;
  const target2event = {
    0: () => {
      console.log("step");
    },
    1: () => {
      console.log("step");
    },
    2: () => {
      console.log("step");
    },
    3: () => {
      console.log("step");
    },
    4: () => {
      console.log("step");
    },
    5: () => {},
  };
  function fireEvent(entryIndex) {
    if (entryIndex in target2event) {
      target2event[entryIndex]();
    }
  }
  onMount(() => {
    // store elements to track
    let sections = selectAll(".step-gridworld").nodes();
    // observe elements to track
    sections.forEach((section) => {
      observer.observe(section);
    });
  });
  // options for intersection observer
  const options = {
    threshold: 0.7,
  };
  let observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // check if visible or not
      if (entry.isIntersecting) {
        // resolve stage in graph
        const entryIndex = entry.target.getAttribute("data-index");
        if (entryIndex in target2event) {
          fireEvent(entryIndex);
        }
      }
    });
  }, options);
</script>

<h2 class="body-secondary-header">Navigating in a Grid World</h2>

<p class="body-text">
  Now the robot is in a commonly used environment in reinforcement learning: the
  gridworld. The robot can now move left, right, up, and down. Again, the
  robot’s actions affect the environment by changing its state in the grid.
</p>
<br /><br />
<p class="body-text">
  There is an obstacle in the gridworld: a <span class="bold">cactus</span>. 
  If the robot steps onto the cactus, it will receive a 
  <span class="bold">negative reward</span> and will result in the termination of 
  the episode. Therefore, the robot should learn to avoid the cactus. Instead 
  of learning to move left or right as in the line world, now the robot must 
  learn the path to take.
</p>
<br /><br />
<p class="body-text">
  See for yourself how increasing epsilon can change the robot's behavior in
  this 2-dimensional environment.
</p>

<section id="scrolly">
  <div class="scrolly-container">
    <div class="steps-container">
      <div class="spacer" />
    </div>
    <div class="charts-container">
      <div class="chart-one">
        <div>
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
              <td>Number of Bananas, Cactus</td>
            </tr>
          </table>

          <div id="graph-container">
            <SimulationGrid />
            <ScatterGrid />
          </div>

          <!-- Epsilon slider -->
          <div id="input-container">
            <p>Epsilon: {$gridEpsilon}</p>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.1"
              maxlength="20"
              bind:value={$gridEpsilon}
              class="slider"
              id="epsilonslider"
              on:input={() => reset(false, false)}
            />
          </div>

          <div id="buttons-container">
            <button on:click={() => simulateEpisode()}>Current Route</button>
            <button on:click={() => runAgentTrials(25, episodicValues)}
              >Run 25 Episodes</button
            >
            <button on:click={() => runAgentTrials(150, episodicValues)}
              >Run 150 Episodes</button
            >
            <button
              on:click={() =>
                getOptimalPolicy()}
              >Optimal Solution</button
            >
            <button on:click={() => reset()}>Reset</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

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

  @media screen and (max-width: 768px) {
    table {
      max-width: 95%;
    }
  }

  #scrolly {
    max-width: 1500px;
    margin: auto;
  }
  .chart-one {
    width: 100%;
    height: 100%;
  }
  /* space after scroll is finished */
  .spacer {
    height: 60vh;
  }

  .charts-container {
    position: sticky;
    margin-right: 5%;
    top: 1.5%;
    width: 95%;
    margin: auto;
    padding-bottom: 1rem;
    height: 100%;
  }
  .scrolly-container {
    margin-top: 1em;
    text-align: center;
    transition: background 100ms;
    display: flex;
    flex-direction: column-reverse;
  }
  .step-gridworld {
    height: 95vh;
    display: flex;
    place-items: center;
    justify-content: center;
  }
  .step-content {
    font-size: var(--size-default);
    background: var(--bg);
    border-radius: 1px;
    padding: 0.5rem 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: background 500ms ease;
    text-align: left;
    width: 75%;
    margin: auto;
    max-width: 500px;
    font-family: var(--font-main);
    line-height: 1.3;
    border: 4px solid var(--default);
    width: 95%;
    max-width: 768px;
    font-size: 15px;
    line-height: 1.3;
    background: rgba(241, 243, 243, 0.913);
  }
  .step-content p {
    color: var(--squidink);
  }
  .steps-container {
    height: 100%;
    pointer-events: none;
  }
  .steps-container {
    flex: 1 1 40%;
    z-index: 10;
  }
</style>
