import { multiply, add, reshape } from "mathjs";

// Finds the index of the maximum
function argMax(array) {
  return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}

export class Agent {
  constructor(
    rows,
    columns,
    wins,
    losses,
    td_update = "sarsa",
    epsilon = 0.1,
    alpha = 0.1,
    gamma = 0.9,
    lambda = 0.7
  ) {
    this.actions =
      rows > 1 ? ["up", "down", "left", "right"] : ["left", "right"];
    this.epsilon = epsilon;
    this.rows = rows;
    this.columns = columns;
    this.wins = wins;
    this.losses = losses;
    this.td_update = td_update;
    this.alpha = alpha;
    this.gamma = gamma;
    this.lambda_ = lambda;
    this.q_values = Array();
    this.reset_q_values();
    this.trace_matrix = Array();
    this.reset_trace_matrix();
  }

  //   Resets the Q-values to 0
  reset_q_values() {
    this.q_values = new Array(this.rows).fill(
      new Array(this.columns).fill(
      new Array(this.actions.length).fill(0))
    );

    // Array(this.rows)
    //   .fill(0)
    //   .map((x) => Array(this.columns).fill(0))
    //   .map((x) => Array(this.actions.length).fill(0));
  }

  //   Resets the trace matrix to 0
  reset_trace_matrix() {
    this.trace_matrix = new Array(this.rows).fill(
      new Array(this.columns).fill(
      new Array(this.actions.length).fill(0))
    );
  }

  //   Choose actions according to epsilon-greedy action selection
  chooseAction(state) {
    var action_index;
    if (Math.random() <= this.epsilon) {
      // Exploratory action
      action_index = Math.floor(Math.random() * this.actions.length);
    } else {
      // Greedy action
      action_index = argMax(this.q_values[(state[0], state[1])]);
    }
    return [this.actions[action_index], action_index];
  }

  //   Run episodes
  run_episodes(env, episodes = 10, max_steps = 2000) {
    var done, reward, state, td_error;
    var episodic_values = Array();

    for (var ep = 0, episodes = episodes; ep < episodes; ep += 1) {
      if (episodic_values.length == 0) {
        episodic_values = reshape(this.q_values, [1, 4, 4, 4]);
    } else {
        episodic_values = [...episodic_values, this.q_values];
      }

      [state, reward, done] = env.reset();

      for (var step = 0, steps = max_steps; step < steps; step += 1) {
        const [action, action_index] = this.chooseAction(state);
        const q_old = this.q_values[state[0]][state[1]][action_index];

        const [next_state, reward, done] = env.step(action);
        const [next_action, next_action_index] = this.chooseAction(next_state);

        if (this.td_update == "q-learning") {
          // Q-Learning
          td_error =
            reward +
            this.gamma *
              Math.max.apply(
                null,
                this.q_values[next_state[0]][next_state[1]]
              ) -
            q_old;
        } else if (this.td_update == "sarsa") {
          // SARSA
          td_error =
            reward +
            this.gamma *
              this.q_values[next_state[0]][next_state[1]][action_index] -
            q_old;
        } else {
          print("Please set 'td_update' to either 'sarsa' or 'q-learning'.");
        }

        //  Increment the trace matrix
        this.trace_matrix[state[0]][state[1]][action_index] += 1;

        //  TD(lambda) Update
        const multiplier1 = this.alpha * td_error;
        this.q_values = add(
          this.q_values,
          multiply(multiplier1, this.trace_matrix)
        );

        //  Decay the trace matrix values
        const multiplier2 = this.gamma * this.lambda_;
        this.trace_matrix = multiply(multiplier2, this.trace_matrix);

        state = next_state;

        if (done == true) {
          break;
        }
      }
    }

    return episodic_values;
  }
}
