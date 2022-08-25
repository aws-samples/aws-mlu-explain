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
    tdUpdate = "sarsa",
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
    this.tdUpdate = tdUpdate;
    this.alpha = alpha;
    this.gamma = gamma;
    this.lambda = lambda;
    this.qValues = Array();
    this.resetQValues();
    this.traceMatrix = Array();
    this.resetTraceMatrix();
  }

  //   Resets the Q-values to 0
  resetQValues() {
    this.qValues = new Array(this.rows).fill(
      new Array(this.columns).fill(new Array(this.actions.length).fill(0))
    );
  }

  //   Resets the trace matrix to 0
  resetTraceMatrix() {
    this.traceMatrix = new Array(this.rows).fill(
      new Array(this.columns).fill(new Array(this.actions.length).fill(0))
    );
  }

  //   Choose actions according to epsilon-greedy action selection
  chooseAction(state) {
    var actionIndex;
    if (Math.random() <= this.epsilon) {
      // Exploratory action
      actionIndex = Math.floor(Math.random() * this.actions.length);
    } else {
      // Greedy action
      actionIndex = argMax(this.qValues[state[0]][state[1]]);
    }
    return [this.actions[actionIndex], actionIndex];
  }

  //   Run episodes
  runEpisodes(env, episodes = 10, maxSteps = 2000) {
    var done, reward, state, tdError;
    var episodicValues = Array();

    for (var ep = 0; ep < episodes; ep += 1) {
      if (episodicValues.length == 0) {
        episodicValues = reshape(this.qValues, [1, this.rows, this.columns, this.actions.length]);
      } else {
        episodicValues = [...episodicValues, this.qValues];
      }

      [state, reward, done] = env.reset();

      for (var step = 0; step < maxSteps; step += 1) {
        const [action, actionIndex] = this.chooseAction(state);
        const qOld = this.qValues[state[0]][state[1]][actionIndex];

        const [nextState, reward, done] = env.step(action);
        const [nextAction, nextActionIndex] = this.chooseAction(nextState);

        if (this.tdUpdate == "q-learning") {
          // Q-Learning
          tdError =
            reward +
            this.gamma *
              Math.max.apply(null, this.qValues[nextState[0]][nextState[1]]) -
            qOld;
        } else if (this.tdUpdate == "sarsa") {
          // SARSA
          tdError =
            reward +
            this.gamma *
              this.qValues[nextState[0]][nextState[1]][actionIndex] -
            qOld;
        } else {
          print("Please set 'tdUpdate' to either 'sarsa' or 'q-learning'.");
        }

        //  Increment the trace matrix
        this.traceMatrix[state[0]][state[1]][actionIndex] += 1;

        //  TD(lambda) Update
        const multiplier1 = this.alpha * tdError;
        this.qValues = add(
          this.qValues,
          multiply(multiplier1, this.traceMatrix)
        );

        //  Decay the trace matrix values
        const multiplier2 = this.gamma * this.lambda;
        this.traceMatrix = multiply(multiplier2, this.traceMatrix);

        state = nextState;

        if (done == true) {
          break;
        }
      }
    }

    return episodicValues;
  }

  runAdditionalEpisodes(env, episodes = 1, maxSteps = 2000, episodic_values) {
    var done, reward, state, tdError;

    for (var ep = 0; ep < episodes; ep += 1) {
      if (episodicValues.length == 0) {
        episodicValues = reshape(this.qValues, [1, this.rows, this.columns, this.actions.length]);
      } else {
        episodicValues = [...episodicValues, this.qValues];
      }

      [state, reward, done] = env.reset();

      for (var step = 0; step < maxSteps; step += 1) {
        const [action, actionIndex] = this.chooseAction(state);
        const qOld = this.qValues[state[0]][state[1]][actionIndex];

        const [nextState, reward, done] = env.step(action);
        const [nextAction, nextActionIndexndex] =
          this.chooseAction(nextState);

        if (this.tdUpdate == "q-learning") {
          // Q-Learning
          tdError =
            reward +
            this.gamma *
              Math.max.apply(null, this.qValues[nextState[0]][nextState[1]]) -
            qOld;
        } else if (this.tdUpdate == "sarsa") {
          // SARSA
          tdError =
            reward +
            this.gamma *
              this.qValues[nextState[0]][nextState[1]][actionIndex] -
            qOld;
        } else {
          print("Please set 'tdUpdate' to either 'sarsa' or 'q-learning'.");
        }

        //  Increment the trace matrix
        this.traceMatrix[state[0]][state[1]][actionIndex] += 1;

        //  TD(lambda) Update
        const multiplier1 = this.alpha * tdError;
        this.qValues = add(
          this.qValues,
          multiply(multiplier1, this.traceMatrix)
        );

        //  Decay the trace matrix values
        const multiplier2 = this.gamma * this.lambda;
        this.traceMatrix = multiply(multiplier2, this.traceMatrix);

        state = nextState;

        if (done == true) {
          break;
        }
      }
    }

    return episodicValues;
  }
}
