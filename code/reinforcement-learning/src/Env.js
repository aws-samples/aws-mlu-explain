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
    exploringStarts = false,
    exploringStartsProb = 0.4
  ) {
    this.start = start;
    this.state = start;
    this.rows = rows;
    this.columns = columns;
    this.board = Array(this.rows)
      .fill(0)
      .map((x) => Array(this.columns).fill(0));
    this.exploringStarts = exploringStarts;
    this.exploringStartsProb = exploringStartsProb;
    this.deterministic = deterministic;
    this.wins = wins;
    this.losses = losses;

    if (this.exploringStarts) {
      this.availableStarts = [];

      for (var row = 0, rows = this.rows; row < rows; row += 1) {
        for (
          var col = 0, columns = this.columns;
          col < columns;
          col += 1
        ) {
          this.temp = [row, col];
          this.availableStarts.push([row, col]);
        }
      }
    } else {
      this.availableStarts = this.start;
    }
  }

  giveReward() {
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

  isEndFunc() {
    if (
      this.state in this.wins || this.state in this.losses
    ) {
      return true;
    } else {
      return false;
    }
  }

  reset() {
    if (this.exploringStarts && Math.random() < this.exploringStartsProb) {
      this.state =
        this.availableStarts[
          Math.floor(Math.random() * this.availableStarts.length)
        ];
    } else {
      this.availableStarts;
    }

    return [this.start, this.giveReward(), this.isEndFunc()];
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

      return [this.state, this.giveReward(), this.isEndFunc()];
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
