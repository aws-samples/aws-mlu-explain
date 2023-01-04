<script>
  import ScatterLine from "./ScatterLine.svelte";
  import SimulationLine from "./SimulationLine.svelte";
  import {
    lineRobot,
    lineRobotPath,
    lineEpsilon,
    lineQValues,
    lineRecordInterval,
  } from "../data-store.js";
  import { Env } from "../Env.js";
  import { Agent } from "../Agent.js";
  import { onMount } from "svelte";
  import { select, selectAll } from "d3-selection";

  const randomInt = (max, min) => Math.round(Math.random() * (max - min)) + min;

  // Finds the index of the maximum
  function argMax(array) {
    return array
      .map((x, i) => [x, i])
      .reduce((r, a) => (a[0] > r[0] ? a : r))[1];
  }

  const numCells = 8;

  // 	change for 1 dim
  const numX = numCells;
  const numY = 1;

  var xVal;
  var yVal;

  xVal = $lineRobotPath[0]["x"];
  yVal = $lineRobotPath[0]["y"];

  const actions = ["left", "right"];

  //  Define the environment
  const env = new Env(
    [0, 3], // start
    numY, // rows
    numX, // columns
    { [[0, 0]]: 1, [[0, 7]]: 7 }, // Map of states and the corresponding reward
    {
      // [[2, 2]]: -5,
    }, // Map of states and the corresponding reward
    true, // deterministic: Stochastic env not implemented yet
    true, // exploring_starts: Initializa agent at a random state in subsequent episodes.
    0.7 // exploring_starts_prob: Probability of selecting a random initial state instead of specified one
  );

  // set lambda to 0 for TD(0) update and lamdba to 1 for MC
  var lineAgent = new Agent(
    env.rows,
    env.columns,
    env.wins, // for plotting
    env.losses, // for plotting
    "q-learning", // 'q-learning' or 'sarsa'
    $lineEpsilon, // Control exploration
    0.1, // Learning rate
    0.8, // Discount factor
    0.5 // Decay parameter for eligibility trace
  );

  // Agent's starting position
  const startX = 3.5;
  const startY = 0.5;

  // Episodic Q Values retrieved from simulation
  var episodicValues = Array();

  // Keep records at intervals. 
  var episodeCount = 0;
  var episodeIntervalArray = [];
  const maxEpisodes = 2500;

  reset();

  // Run episodic trials and update Q-values
  function runAgentTrials(numEpisodes, episodicValues) {
    // Reduce the burden 
    if (episodeCount > maxEpisodes){
      return
    }
    let trialStats = lineAgent.runEpisodes(env, numEpisodes);

    for (let ep = 0; ep < numEpisodes; ep++) {
      episodeCount ++;
      if(episodeCount % $lineRecordInterval == $lineRecordInterval-1){
        console.log(episodeCount, ep);
        episodicValues.push(trialStats[ep]);
        episodeIntervalArray.push(episodeCount+1);
      }
    }

    // Update LineQValues
    updateLineQVals();

    // Reset robot position to starting position
    lineRobot.set({
      x: startX,
      y: startY,
    });

    lineRobotPath.set([{ x: startX, y: startY }]);

    // Reset episodicValues once lineQValues are updated
    episodicValues = Array();
  }

  function simulateEpisode(maxSteps = 15) {
    // Reset the robot to the starting position
    lineRobot.set({
      x: startX,
      y: startY,
    });

    lineRobotPath.set([{ x: startX, y: startY }]);

    // Variables to keep track of robot
    let currX = startX - 0.5;
    let currY = startY - 0.5;

    let nextX;
    let nextY;

    for (let i = 0; i < maxSteps; i++) {
      if ([currY, currX] in env.wins || [currY, currX] in env.losses) {
        break;
      }
      let index = currX;
      let state = $lineQValues[index];

      // Set default maxDirection incase Q values aren't learnt
      var maxDirection = "left";
      if (state["maxDirection"].length) {
        maxDirection = state["maxDirection"][state["maxDirection"].length - 1];
      }

      // Take action in direction of highest Q-value
      if (maxDirection == "left") {
        nextX = currX - 1;
        nextY = currY;
      } else {
        if (maxDirection == "right") {
          nextX = currX + 1;
          nextY = currY;
        }
      }
      // Check validity of the transition
      if (nextX >= 0 && nextX <= env.columns - 1) {
        currX = nextX;
        currY = nextY;
      }

      lineRobot.set({
        x: currX + 0.5,
        y: currY + 0.5,
      });

      const newRobotPath = [
        ...$lineRobotPath,
        { x: currX + 0.5, y: currY + 0.5 },
      ];
      lineRobotPath.set(newRobotPath);
    }
  }

  // Generate optimal policy regardless of the epsilon value
  function getOptimalPolicy(){
    reset(true);
    runAgentTrials(maxEpisodes, episodicValues);
  }

  function reset(forOptimal=false) {
    // Reset episode count
    episodeCount = 0;
    episodeIntervalArray = [];
    var epsilon = forOptimal ? 0.5 : $lineEpsilon; // Produce optimal policy even when epsilon is too low
    
    lineAgent = new Agent(
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

    lineRobot.set({
      x: startX,
      y: startY,
    });

    // Reset lineAgent stats
    lineAgent.resetQValues();
    lineAgent.resetTraceMatrix();

    lineRobotPath.set([{ x: startX, y: startY }]);

    lineQValues.set([
      {
        episodeNumber: [0],
        left: [0],
        right: [0],
        maxDirection: [],
        leftWeight: [0],
        rightWeight: [0],
      },
      {
        episodeNumber: [0],
        left: [0],
        right: [0],
        maxDirection: [],
        leftWeight: [0],
        rightWeight: [0],
      },
      {
        episodeNumber: [0],
        left: [0],
        right: [0],
        maxDirection: [],
        leftWeight: [0],
        rightWeight: [0],
      },
      {
        episodeNumber: [0],
        left: [0],
        right: [0],
        maxDirection: [],
        leftWeight: [0],
        rightWeight: [0],
      },
      {
        episodeNumber: [0],
        left: [0],
        right: [0],
        maxDirection: [],
        leftWeight: [0],
        rightWeight: [0],
      },
      {
        episodeNumber: [0],
        left: [0],
        right: [0],
        maxDirection: [],
        leftWeight: [0],
        rightWeight: [0],
      },
      {
        episodeNumber: [0],
        left: [0],
        right: [0],
        maxDirection: [],
        leftWeight: [0],
        rightWeight: [0],
      },
      {
        episodeNumber: [0],
        left: [0],
        right: [0],
        maxDirection: [],
        leftWeight: [0],
        rightWeight: [0],
      },
    ]);

    // Reset episodicValues
    episodicValues = Array();

    // Update lineQValues (not needed)
    updateLineQVals();
  }

  function updateLineQVals() {
    if (episodicValues.length == 0) {
      return;
    }

    // Maintain index to update the episodic count
    var episodeIntervalArrayIndex = episodeIntervalArray.length - episodicValues.length;
    for (let ep = 0; ep < episodicValues.length; ep++) {
      // Mapping combination of row and col onto row of gridQvalues
      // state is row in gridQValues
      // (0,0), (1,0), (2,0), (3,0)
      // (0,1), (1,1), (2,1), (3,1)
      // (0,2), (1,2), (2,2), (3,2)
      // (0,3), (1,3), (2,3), (3,3)
      const newVals = $lineQValues.map((state, index) => {
        const leftVal = episodicValues[ep][0][index][0];
        const rightVal = episodicValues[ep][0][index][1];

        const allVals = [leftVal, rightVal];
        const maxIndex = argMax(allVals);

        let maxDir;

        if (maxIndex == 0) {
          maxDir = "left";
        } else if (maxIndex == 1) {
          maxDir = "right";
        }

        const valSum = Math.abs(leftVal) + Math.abs(rightVal);

        const vals = {
          episodeNumber: [...state["episodeNumber"], episodeIntervalArray[episodeIntervalArrayIndex+ep]],
          // up: [...state["up"], episodicValues[ep][r][c][0]],
          // down: [...state["down"], episodicValues[ep][r][c][1]],
          left: [...state["left"], episodicValues[ep][0][index][0]],
          right: [...state["right"], episodicValues[ep][0][index][1]],
          maxDirection: [...state["maxDirection"], maxDir],
          leftWeight: [...state["leftWeight"], leftVal / valSum || 0],
          rightWeight: [...state["rightWeight"], rightVal / valSum || 0],
        };

        return vals;
      });
      $lineQValues = [...newVals];
    }

    // Reset episodicValues
    episodicValues = Array();

    console.log($lineQValues);
  }
  // trigger scroll events
  // let sections;
  const target2event = {
    0: () => {
      reset();
      console.log("step 0");
    },
    1: () => {
      runAgentTrials(15, episodicValues);
      console.log("step 1");
    },
    2: () => {
      console.log("step 2");
      runAgentTrials(2500, episodicValues);
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
    let sections = selectAll(".step-lineworld").nodes();
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

<h2 class="body-secondary-header">Navigating in a Line World</h2>

<p class="body-text">
  Let’s progress to a slightly more complex environment. Now, the robot and
  trees are located on a line. The robot has to decide which action to take:
  move left or move right. Each action moves the robot one step in that direction. 
  The main difference from the previous scenario is that the robot’s actions affect 
  its state in the environment, reflected by its location. The robot must now learn 
  how valuable each action is depending on its state. 
  This defines a policy that the robot can follow, by learning which action 
  it should take in each state. This is reflected by the arrow in each state, 
  corresponding to the action with the greater Q-value for that particular state.
</p>
<br /><br />
<p class="body-text">
  The robot currently follows a policy where it moves to the tree on the left,
  having previously discovered that the tree yields bananas. Though the
  tree on the left is closer to the robot's initial position, 
  the right tree actually generates much higher rewards, making it
  more fruitful. If the robot strictly follows its current policy, it will
  always move to the left tree. This is called exploitation, as the robot
  exploits its knowledge when deciding how to pursue rewards. The robot needs to
  explore in order to reduce the uncertainty about the tree on the right, in
  order to learn that it actually yields greater rewards. This introduces an
  important concept in reinforcement learning:  <span class="bold">
  the explore-exploit dilemma</span>. Agents must balance exploiting 
  known rewards with exploring the environment, and potentially 
  discovering more rewarding actions.
</p>
<br /><br />
<p class="body-text">
  Constantly performing the action that the robot believes yields the greatest
  reward is called being <span class="bold">greedy</span>. This does not allow the robot to explore at
  all, and the robot will never discover that the other tree yields greater
  rewards. To allow for some exploration, the robot can select actions according
  to <span class="bold">epsilon-greedy policy</span>. This is a simple
  way to balance exploration and exploitation, by exploring (i.e. choosing action
  randomly) with probability epsilon and exploiting by greedily following the
  policy with probability 1-epsilon. Increasing epsilon increases exploration.
</p>
<br /><br />
<p class="body-text">
  See for yourself how increasing epsilon can change the robot's behavior,
  leading to updating the Q-values and policy. Setting epsilon to zero 
  will result in a greedy polcy.
</p>

<section id="scrolly">
  <div class="scrolly-container">
    <div class="steps-container">
      <div class="step-lineworld" data-index="0">
        <div class="step-content">
          <p>
            Let's observe the explore-exploit dilemma in the following
            simulation. The robot's initial policy suggests perpetually 
            going left towards the tree that has already been
            discovered.
          </p>
        </div>
      </div>
      <div class="step-lineworld" data-index="1">
        <div class="step-content">
          <p>
            The robot has sampled 15 episodes or trials following the
            epsilon-greedy policy discussed before. You can see the robot still
            prefers stepping towards the tree on the left for all the states
            despite the one on the right producing higher rewards. Let's allow 
            the robot to explore the environment further...
          </p>
        </div>
      </div>
      <div class="step-lineworld" data-index="2">
        <div class="step-content">
          <p>
            The robot has now sampled 2500 episodes following the epsilon-greedy
            policy. You can observe how the robot has updated its policy to
            prefer stepping towards the tree on the right instead. The plots
            indicate moving towards the right is more fruitful for each state.
          </p>
        </div>
      </div>
      <div class="spacer" />
    </div>
    <div class="charts-container">
      <div class="chart-one">
        <!-- <Scatterplot bind:this={scatterClass} /> -->
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
              <td>Line World</td>
              <td>X-Position</td>
              <td>Move Left, Move Right</td>
              <td>Number of Bananas</td>
            </tr>
          </table>

          <div id="graph-container">
            <div id="simulation-chart">
              <SimulationLine {numX} {numY} />
            </div>
            <div id="scatter-chart">
              <ScatterLine />
            </div>
          </div>
          
          <!-- Epsilon slider -->
          <div id="input-container">
            <p>Epsilon: {$lineEpsilon}</p>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.1"
              maxlength="20"
              bind:value={$lineEpsilon}
              class="slider"
              id="epsilonslider"
              on:input={() => reset()}
            />
          </div>

          <div id="buttons-container">
            <button on:click={() => simulateEpisode()}>Simulate Episode</button>
            <button on:click={() => runAgentTrials(15, episodicValues)}
              >Run 15 Episodes</button
            >
            <button on:click={() => runAgentTrials(50, episodicValues)}
              >Run 50 Episodes</button
            >
            <button on:click={() => getOptimalPolicy()}>Optimal Policy</button>
            <button on:click={() => reset()}>Reset</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <br /><br />

  <p class="body-text">
    Humans often balance short-term gratification and long-term consequences in their decision-making. 
    We are predisposed to value rewards received now more than those received in the future. This makes
    sense as the distant future is more uncertain than the present. 
    Similarly, the agent needs to find a balance between acquiring immediate rewards and considering 
    long-term gain. The Q-values for the Line World and the upcoming Grid World environment are estimated to be
    the expected <span class="bold">discounted</span> cummulative rewards. This simply means rewards 
    received later are worth less than those recieved immediately. For more information, refer this 
    <a
    href="http://incompleteideas.net/book/the-book.html"
    >book.</a
  >
    <!-- <br /><br /> Let's dive in! -->
  </p>
</section>

<style>
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

  #graph-container {
    display: grid;
    position: relative;
    align-items: center;
    justify-content: center;
  }

  #simulation-chart {
    width: 100%;
    height: 100%;
  }

  #scatter-chart {
    width: 100%;
    height: 100%;
  }

  #input-container {
    display: flex;
    justify-content: center;
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
    top: 5.5%;
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
  .step-lineworld {
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
