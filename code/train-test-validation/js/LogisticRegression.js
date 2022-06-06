import { animals } from "./data";

export class LogisticRegression {
  constructor(opts) {
    this.iterations = opts.iterations;
    this.startFeature = opts.startFeature;
    this.learningRate = opts.learningRate;
    this.X = animals.map((d) => {
      return {
        weight: d.weight,
        fluffiness: d.fluffiness,
      };
    });
    // this.X.filter((d) => d.class === "train");

    this.y = animals.map((d) => d.animal);
    this.yLabel = this.y.map((d) => (d === "cat" ? 0 : 1));

    this.fit("weight", this.X);
  }

  fit(feature, data) {
    if (feature === "both") {
      // let's just start off with X1
      let trainData = [
        data.map((d) => +d["fluffiness"]),
        data.map((d) => +d["weight"]),
      ];
      let label = this.yLabel;
      this.weights = this.logReg(trainData, label);
      this.decisionBoundary = -this.weights[0] / this.weights[1];
    } else {
      // let's just start off with X1
      let trainData = [data.map((d) => +d[feature])];
      let label = this.yLabel;
      this.weights = this.logReg(trainData, label);
      this.decisionBoundary = -this.weights[0] / this.weights[1];
    }
  }

  sigmoid(scores) {
    // define equation: 1 / ( 1 + e( - z ) )
    const sigmoidEq = (d) => 1 / (1 + Math.exp(-d));
    // destructure arrays from matrix
    let [x1, x2] = scores;
    // evaluate sigmoid
    if (scores.length === 1) {
      return [x1.map(sigmoidEq)];
    } else {
      // 2 dimension case, so apply to each side
      x1 = x1.map(sigmoidEq);
      x2 = x2.map(sigmoidEq);
      return [x1, x2];
    }
  }

  // compute dot product between our features and weights
  dotProduct(a, weights) {
    const n = a[0].length;

    // init scores array
    let scores = [];

    for (let row = 0; row < n; row++) {
      let rowSum = 0;
      weights.map((weight, col) => {
        rowSum += a[col][row] * weight;
      });
      scores.push(rowSum);
    }
    return [scores];
  }

  logReg(features, target) {
    const self = this;
    // helper func
    const subtractArrays = (a, b) => a.map((x, i) => x - b[i]);

    // add intercept term
    const m = features[0].length;

    // add intercept to data
    const intercept = new Array(m).fill(1);
    features.unshift(intercept);

    // initialize weights
    // (get length here to pad for bias weight)
    const n = features.length;
    this.weights = new Array(n).fill(0.5);

    // perform updates
    for (let index = 0; index < self.iterations; index++) {
      let scores = this.dotProduct(features, this.weights);
      let predictions = this.sigmoid(scores);
      let error = subtractArrays(target, predictions[0]);
      let gradient = this.dotProduct(transpose(features), error);
      this.weights = this.weights.map((w, i) => {
        return w + gradient[0][i] * self.learningRate;
      });
    }

    return this.weights;
  }
}

// transpose matrix
function transpose(m) {
  return m[0].map((x, i) => m.map((x) => x[i]));
}
