export const logRegW0 = -0.9803096821;
export const logRegW1 = 0.6139;
export const logRegW2 = 0.218226;

export const percW0 = -15.0;
export const percW1 = 9.8093627;
export const percW2 = 11.37731165;

function relu(x) {
  return Math.max(0, x);
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

export function logistic(x, y) {
  const z = logRegW0 + logRegW1 * x + logRegW2 * y;
  const p = 1 / (1 + Math.exp(-z));
  return p >= 0.5 ? 1 : 0;
}

export function perceptron(x, y) {
  const z = percW0 + percW1 * x + percW2 * y;
  return Math.sign(z) === 1 ? 1 : 0;
}

export function neuralNetwork1(x1, x2) {
  // console.log(x, y);
  const inputLayer = x2 * -0.379 + x1 * -0.464;
  const hiddenLayer1 = relu(inputLayer);
  const hiddenLayer2 = relu(hiddenLayer1 * 0.932);
  const outputLayer = sigmoid(hiddenLayer2 * -0.969);

  // console.log("output", outputLayer, outputLayer >= 0.5 ? 1 : 0);
  return outputLayer >= 0.5 ? 1 : 0;
}

export function neuralNetwork2(x1, x2) {
  // console.log(x, y);
  const inputLayer1 = x2 * 0.6222 + x1 * 0.889;
  const inputLayer2 = x2 * 0.639 + x1 * -0.44;
  const hiddenLayer11 = relu(inputLayer1);
  const hiddenLayer12 = relu(inputLayer2);
  const hiddenLayer2 = relu(hiddenLayer11 * 0.618 + hiddenLayer12 * 0.49);
  const outputLayer = sigmoid(hiddenLayer2 * -0.426);

  // console.log("output", outputLayer, outputLayer >= 0.5 ? 1 : 0);
  return outputLayer >= 0.5 ? 1 : 0;
}
