class Agent {
    constructor(rows, columns, wins, losses, td_update = "sarsa", epsilon = 0.1, alpha = 0.1, gamma = 0.9, lambda_ = 0.7) {
      this.actions = rows > 1 ? ["up", "down", "left", "right"] : ["left", "right"];
      this.epsilon = epsilon;
      this.rows = rows;
      this.columns = columns;
      this.wins = wins;
      this.losses = losses;
      this.td_update = td_update;
      this.alpha = alpha;
      this.gamma = gamma;
      this.lambda = lambda;
      this.q_values = np.array([]);
      this.reset_q_values();
      this.trace_matrix = np.array([]);
      this.reset_trace_matrix();
    }
  
    reset_q_values() {
      this.q_values = np.zeros([this.rows, this.columns, this.actions.length]);
    }
  
    reset_trace_matrix() {
      this.trace_matrix = np.zeros([this.rows, this.columns, this.actions.length]);
    }

    chooseAction(state) {
        var action_index;
      
        if (np.random.uniform(0, 1) <= this.epsilon) {
            action_index = np.random.randint(this.actions.length);
        } else {
            // greedy action
            action_index = np.argmax(self.q_values[state[0], state[1], :])
        }
        return self.actions[action_index], action_index
      }

      run_episodes(env, episodes = 10, max_steps = 2000) {
        var done, episodic_values, reward, state;
        episodic_values = np.array([]);
      
        for (var _ = 0, _pj_a = episodes; _ < _pj_a; _ += 1) {
          if (episodic_values.shape[0] === 0) {
            episodic_values = np.expand_dims(this.q_values, {
              "axis": 0
            });
          } else {
            episodic_values = np.append(episodic_values, [this.q_values], {
              "axis": 0
            });
          }
      
          [state, reward, done] = env.reset();
        }

        for (var step = 0, _pj_a = max_steps; step < _pj_a; step += 1) {
            [action, action_index] = this.chooseAction(state);
            q_old = this.q_values[[state[0], state[1], action_index]];
            [next_state, reward, done] = env.step(action);
            [next_action, next_action_index] = this.chooseAction(next_state);
          }
          
          
      }
      
  
  }