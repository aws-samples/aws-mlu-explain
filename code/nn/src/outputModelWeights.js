export const logRegW0 = -0.9803096821;
export const logRegW1 = 0.6139;
export const logRegW2 = 0.218226;
// 0.455 -.792 -.535

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
  return p >= 0.5 ? 1 : -1;
}

export function perceptron(x, y) {
  const z = percW0 + percW1 * x + percW2 * y;
  return Math.sign(z) === 1 ? 1 : -1;
}

// export function neuralNetwork1(x1, x2) {
//   // const inputLayer = x2 * -0.379 + x1 * -0.464;
//   // const hiddenLayer1 = relu(inputLayer);
//   // const hiddenLayer2 = relu(hiddenLayer1 * 0.932);
//   // const outputLayer = sigmoid(hiddenLayer2 * -0.969);
//   const inputLayer = x1 * -0.832 + x2 * 0.459;
//   const hiddenLayer1 = relu(inputLayer);
//   // const hiddenLayer2 = relu(hiddenLayer1 * 0.932);
//   // const outputLayer = sigmoid(hiddenLayer2 * -0.969);
//   const outputLayer = sigmoid(hiddenLayer1 * 0.017);
//   console.log("output", outputLayer);

//   return outputLayer >= 0.5 ? 1 : -1;
// }

export function neuralNetwork2(x1, x2) {
  // console.log(x, y);
  const inputLayer1 = x1 * -0.374 + x2 * -0.179;
  const inputLayer2 = x1 * -0.016 + x2 * -1.719;
  const inputLayer3 = x1 * -0.762 + x2 * 0.354;
  const hiddenLayer1 = relu(inputLayer1);
  const hiddenLayer2 = relu(inputLayer2);
  const hiddenLayer3 = relu(inputLayer3);
  const outputLayer = sigmoid(
    hiddenLayer3 * -1.804 + hiddenLayer2 * 2.771 + hiddenLayer1 * 4.805
  );

  // console.log("output", outputLayer, outputLayer >= 0.5 ? 1 : 0);
  return outputLayer >= 0.5 ? 1 : -1;
}

export function neuralNetwork1(x1, x2) {
  const inputLayer1 = x1 * 0.367 + x2 * -0.677;
  const inputLayer2 = x1 * -0.627 + x2 * 0.534;
  const inputLayer3 = x1 * 0.163 + x2 * -0.536;
  const hiddenLayer1 = relu(inputLayer1);
  const hiddenLayer2 = relu(inputLayer2);
  const hiddenLayer3 = relu(inputLayer3);
  const outputLayer = sigmoid(
    hiddenLayer1 * 0.682 + hiddenLayer2 * 0.245 + hiddenLayer3 * 0.81
  );

  // console.log("output", outputLayer, outputLayer >= 0.5 ? 1 : 0);
  const output = outputLayer >= 0.5 ? 1 : -1;
  console.log("x", x1, "y", x2, "out", output);
  return output;
}
