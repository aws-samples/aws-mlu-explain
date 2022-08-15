<script>
  import QValuePlot from "./QValuePlotLineWorld.svelte";
</script>

<h2 class="body-secondary-header">Navigating in a Line World</h2>

<p class="body-text">
  Let’s progress to a slightly more complex environment. Now, the robot and
  trees are located on a line. The robot has to decide which action to take:
  move left or move right. The main difference from the previous scenario is
  that the robot’s actions affect its state in the environment, reflected by its
  location. The robot must now learn how valuable each action is depending on
  its state, where the state depends on the previous action. This defines a
  policy that the robot can follow, by learning which action it should take in
  each state. This is reflected by the arrow in each state, corresponding to the
  action with the greater Q-value for that particular state.
</p>
<br /><br />
<p class="body-text">
  The robot currently follows a policy where it moves to the tree on the left,
  having previously discovered that the tree yields bananas. Though the left
  tree is closer, the right tree actually has a higher mean value, making it
  more fruitful. If the robot strictly follows its current policy, it will
  always move to the left tree. This is called exploitation, as the robot
  exploits its knowledge when deciding how to pursue rewards. The robot needs to
  explore in order to reduce the uncertainty about the tree on the right, in
  order to learn that it actually yields greater rewards. This introduces an
  important concept in reinforcement learning: <text class="bold"
    >the explore-exploit dilemma</text
  >. Agents must balance exploiting known rewards with exploring the
  environment, and potentially discovering more rewarding actions.
</p>
<br /><br />
<p class="body-text">
  Constantly performing the action that the agent believes yields the greatest
  reward is called being greedy. This does not allow the agent to explore at
  all, and the robot will never discover that the other tree yields greater
  rewards. To allow for some exploration, the agent can select actions according
  to <text class="bold">epsilon-greedy action selection</text>. This is a simple
  way to balance exploration and exploitation, by exploring (i.e. choosing
  randomly) with probability epsilon and exploiting by greedily following the
  policy with probability 1-epsilon. Increasing epsilon increases exploration.
</p>
<br /><br />
<p class="body-text">
  The agent is currently choosing greedily, which is equivalent to epsilon=0.
  See for yourself how increasing epsilon can change the agent’s behavior,
  leading to updating the Q-values and policy.
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
    <td>Line World</td>
    <td>X-Position</td>
    <td>Move Left and Move Right</td>
    <td>Number of Bananas</td>
  </tr>
</table>

<QValuePlot />

<div id="buttons-container">
  <button on:click={() => ""}>Select 1 Action</button>
  <button on:click={() => ""}>Select 5 Actions</button>
  <button on:click={() => ""}>Run 1 Episode</button>
  <button on:click={() => ""}>Run 5 Episodes</button>
  <button on:click={() => ""}>Reset</button>
</div>

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

  @media screen and (max-width: 768px) {
    table {
      max-width: 95%;
    }
  }
</style>
