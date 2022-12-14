<script>
  import ScatterBandit from "./ScatterBandit.svelte";
  import SimulationBandit from "./SimulationBandit.svelte";
  import {
    banditRobot,
    banditEpsilon,
    banditQValues
  } from "../data-store";
  import {MultiArmBandit} from "../MultiArmBandit";
  import { onMount } from "svelte";
  import { select, selectAll } from "d3-selection";

const randomInt = (max, min) => Math.round(Math.random() * (max - min)) + min;

// Finds the index of the maximum
function argMax(array) {
  return array
    .map((x, i) => [x, i])
    .reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}

const numX = 1;
const numY = 1;

// Define the env
const env = new MultiArmBandit(
  [2,5], // Mean value of each arm
  [1.0, 1.0], // STD of each arm
  $banditEpsilon, // Epsilon (exploration)
  0.1, // Alpha (Q-value update step)
);

// Reset simulation
reset()


function runBanditTrials(numEpisodes, episodicValues){
  for (let ep = 0; ep < numEpisodes; ep++){
    let maxDir;
    let q_val = env.runTrial();

    if (q_val[0] > q_val[1]){
      maxDir = "left"
    } else {
      maxDir = "right"
    }

    const valSum =
          Math.abs(q_val[0]) +
          Math.abs(q_val[1]);


    
    $banditQValues[0]["episodeNumber"].push($banditQValues[0]["episodeNumber"].length+1);
    $banditQValues[0]["left"].push(q_val[0]);
    $banditQValues[0]["right"].push(q_val[1]);
    $banditQValues[0]["maxDirection"].push(maxDir);
    $banditQValues[0]["leftWeight"].push(q_val[0]/valSum);
    $banditQValues[0]["rightWeight"].push(q_val[1]/valSum);
  }
    
  console.log($banditQValues);
}


// Reset the environment
function reset(){

  // Reset env
  env.resetQValues();

  //Reset banditQValues
  banditQValues.set([
  {
    episodeNumber: [],
    left: [],
    right: [],
    maxDirection: [],
    leftWeight: [],
    rightWeight: [],
  },
]);

banditRobot.set({
  x: 0.5, 
  y: 0.5 
})

}




</script>

<h2 class="body-secondary-header">Choosing Between Two Trees</h2>

<p class="body-text">
  In pursuit of finding bananas, the robot can pick either Tree A or Tree B.
  Tree A produces on average 3 bananas, with a standard deviation of 1 banana,
  and Tree B produces on average 6 bananas, with a standard deviation of 2
  bananas. The goal is to maximize the number of bananas found, however, the
  robot does not know which tree produces more bananas. Since the robot does not
  know which action will lead to greater reward, it must make choices and
  observe the outcomes directly.
</p>
<br /><br />
<p class="body-text">
  This type of reinforcement learning problem resembles that of the <span
    class="bold">multi-armed bandit problem</span
  >. The multi-armed bandit problem is named after a gambler at a row of slot
  machines, and the gambler must decide, given limited resources, which slot
  machine to play (i.e. which arm to pull). Here, the trees are the “arms” and
  the robot must decide how to choose between them.
</p>
<br /><br />
<p class="body-text">
  Observe how the robot makes choices between the two trees and receives the
  reward. This reward information is stored in what is called a Q-value, which
  reflects the expected reward for each action based on the history of
  experienced rewards. In this case, the robot maintains two Q-values: one for
  Tree A and one for Tree B.
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
    <td>Two Options</td>
    <td>None</td>
    <td>Tree A, Tree B</td>
    <td>Number of Bananas</td>
  </tr>
</table>

<div id="graph-container">
  <div id="simulation-chart">
    <SimulationBandit />
  </div>
  <div id="scatter-chart">
    <ScatterBandit />
  </div>
</div>

<div id="buttons-container">
  <button on:click={() => runBanditTrials(10)}>Select 10 Action</button>
  <button on:click={() => runBanditTrials(50)}>Select 50 Actions</button>
  <button on:click={() => reset()}>Reset</button>
</div>

<style>
  svg {
    width: 400px;
    height: 400px;
    border: 2px solid black;
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

  #graph-container {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
  }

  /* button.show-button {
    background-color: var(--bg);
    border: none;
    color: var(--squidink);
    padding: 8px 16px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    margin: 4px 2px;
    cursor: pointer;
    outline: 2px solid var(--squidink);
  } */

  /* .show-button-container {
    max-width: var(--max-width);
    display: flex;
    margin: 1rem auto;
    justify-content: center;
  } */

  @media screen and (max-width: 768px) {
    table {
      max-width: 95%;
    }
  }
</style>
