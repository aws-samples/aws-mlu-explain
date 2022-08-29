<script>
</script>

<section>
  <h1 class="body-header">Problem Structure</h1>

  <p class="body-text">
    In reinforcement learning problems, there is an <span class="bold"
      >agent</span
    >
    who makes decisions and learns how to achieve a goal. This agent interacts
    with the <span class="bold">environment</span>
    by taking <span class="bold">actions</span>. The environment produces
    <span class="bold">rewards</span>
    as a result of the actions taken, and these rewards provide insight into the
    overall <span class="bold">value</span> of taking an action in a particular
    state. Actions may affect the environment, leading to changes in
    <span class="bold">state</span>, which the agent observes. This process
    continues with the agent taking actions and observing the resulting reward.
    The agent uses this information to learn what actions it should take
    depending on the circumstance. This mapping from states to actions is called
    a <span class="bold">policy</span>. The agent also learns a
    <span class="bold">value function</span> which it uses to predict how
    desirable states are when behaving according to the policy. The learning in
    reinforcement learning comes from the agent changing its policy and updating
    its value function as a result of its experiences in the environment.
    <br /><br />
    Typically, the agent interacts with the environment over time. At each time point,
    an action is taken based on the agent’s policy, a reward is obtained, and the
    next state is observed. The sequence of transitions experienced by the agent
    starting from the intitial state until the final state is called a trial or an
    episode.
  </p>
</section>

<style>
</style>
