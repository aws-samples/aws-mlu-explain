var _pj;

function _pj_snippets(container) {
  function in_es6(left, right) {
    if (right instanceof Array || typeof right === "string") {
      return right.indexOf(left) > -1;
    } else {
      if (right instanceof Map || right instanceof Set || right instanceof WeakMap || right instanceof WeakSet) {
        return right.has(left);
      } else {
        return left in right;
      }
    }
  }

  container["in_es6"] = in_es6;
  return container;
}

_pj = {};

_pj_snippets(_pj);

export class Env {
  constructor(start = [1, 3], rows = 4, columns = 4, wins = {
    [[3, 2]]: 2,
    [[0, 0]]: 3
  }, losses = {
    [[2, 2]]: -5
  }, obstacles = {}, deterministic = true, exploring_starts = false, exploring_starts_prob = 0.4) {
    this.start = start;
    this.state = start;
    this.rows = rows;
    this.columns = columns;
    this.board = np.zeros([rows, columns]);
    this.exploring_starts = exploring_starts;
    this.exploring_starts_prob = exploring_starts_prob;
    this.deterministic = deterministic;
    this.wins = wins;
    this.losses = losses;

    if (this.exploring_starts) {
      this.available_starts = [];

      for (var row = 0, _pj_a = this.rows; row < _pj_a; row += 1) {
        for (var column = 0, _pj_b = this.columns; column < _pj_b; column += 1) {
          if (_pj.in_es6([row, column], this.wins) || _pj.in_es6([row, column], this.losses)) {
            continue;
          }

          this.available_starts.append([row, column]);
        }
      }
    } else {
      this.available_starts = this.start;
    }
  }

  _giveReward(state) {
    if (_pj.in_es6(state, this.wins)) {
      return this.wins[this.state];
    } else {
      if (_pj.in_es6(state, this.losses)) {
        return this.losses[this.state];
      } else {
        return 0;
      }
    }
  }

  _isEndFunc(state) {
    if (_pj.in_es6(state, this.wins) || _pj.in_es6(state, this.losses)) {
      return true;
    }
  }

  reset() {
    if (this.exploring_starts && np.random.random() < this.exploring_starts_prob) {
      this.state = this.available_starts[np.random.choice(this.available_starts.length)];
    } else {
      this.available_starts;
    }

    return [this.start, this._giveReward(), this._isEndFunc()];
  }

  step(action) {
    /*
    action: up, down, left, right
    -------------
    0 | 1 | 2| 3|
    1 |
    2 |
    return next position
    */
    var nxtState;

    if (this.deterministic) {
      if (action === "up") {
        nxtState = [this.state[0] - 1, this.state[1]];
      } else {
        if (action === "down") {
          nxtState = [this.state[0] + 1, this.state[1]];
        } else {
          if (action === "left") {
            nxtState = [this.state[0], this.state[1] - 1];
          } else {
            nxtState = [this.state[0], this.state[1] + 1];
          }
        }
      }

      if (nxtState[0] >= 0 && nxtState[0] <= this.rows - 1) {
        if (nxtState[1] >= 0 && nxtState[1] <= this.columns - 1) {
          this.state = nxtState;
        }
      }

      return [this.state, this._giveReward(), this._isEndFunc()];
    }
  }

  render() {
    var out, token;
    this.board[this.state] = 1;

    for (var i = 0, _pj_a = this.rows; i < _pj_a; i += 1) {
      console.log("-----------------");
      out = "| ";

      for (var j = 0, _pj_b = this.columns; j < _pj_b; j += 1) {
        if (this.board[[i, j]] === 1) {
          token = "*";
        }

        if (this.board[[i, j]] === -1) {
          token = "z";
        }

        if (this.board[[i, j]] === 0) {
          token = "0";
        }

        out += token + " | ";
      }

      console.log(out);
    }

    console.log("-----------------");
  }

}