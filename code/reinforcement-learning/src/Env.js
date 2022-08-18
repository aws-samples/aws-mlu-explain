export class Env {
  constructor(
    start = [1, 3],
    rows = 4,
    columns = 4,
    wins = {
      [[3, 2]]: 2,
      [[0, 0]]: 3,
    },
    losses = {
      [[2, 2]]: -5,
    },
    obstacles = {},
    deterministic = true,
    exploring_starts = false,
    exploring_starts_prob = 0.4
  ) {
    this.start = start;
    this.state = start;
    this.rows = rows;
    this.columns = columns;
    this.board = Array(this.rows)
      .fill(0)
      .map((x) => Array(this.columns).fill(0));
    this.exploring_starts = exploring_starts;
    this.exploring_starts_prob = exploring_starts_prob;
    this.deterministic = deterministic;
    this.wins = wins;
    this.losses = losses;

    if (this.exploring_starts) {
      this.available_starts = [];

      for (var row = 0, rows = this.rows; row < rows; row += 1) {
        for (
          var col = 0, columns = this.columns;
          col < columns;
          col += 1
        ) {
          this.temp = [row, col];
          this.available_starts.push([row, col]);
        }
      }
    } else {
      this.available_starts = this.start;
    }
  }

  _giveReward() {
    if (this.state in this.wins) {
      return this.wins[this.state];
    } else {
      if (this.state in this.losses) {
        return this.losses[this.state];
      } else {
        return 0;
      }
    }
  }

  _isEndFunc() {
    if (
      this.state in this.wins || this.state in this.losses
    ) {
      return true;
    } else {
      return false;
    }
  }

  reset() {
    if (this.exploring_starts && Math.random() < this.exploring_starts_prob) {
      this.state =
        this.available_starts[
          Math.floor(Math.random() * this.available_starts.length)
        ];
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

    for (var i = 0, rows = this.rows; i < rows; i += 1) {
      console.log("-----------------");
      out = "| ";

      for (var j = 0, cols = this.columns; j < cols; j += 1) {
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
