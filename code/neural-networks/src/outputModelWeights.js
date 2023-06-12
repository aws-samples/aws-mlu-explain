export const logRegW1 = -0.156;
export const logRegW0 = -0.51;
export const logRegW2 = -0.989;

export const percW0 = -15.0;
export const percW1 = 9.8093627;
export const percW2 = 11.37731165;

function relu(x) {
  return Math.max(0, x);
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

export function logistic(x1, x2) {
  const inputLayer1 = x1 * -0.136 + x2 * -0.98;
  const hiddenLayer1 = relu(inputLayer1);
  const outputLayer = sigmoid(hiddenLayer1 * -0.688);
  return outputLayer >= 0.5 ? 1 : -1;
}

export function perceptron(x, y) {
  const z = percW0 + percW1 * x + percW2 * y;
  return Math.sign(z) === 1 ? 1 : -1;
}

export function neuralNetwork1(x1, x2) {
  if (x1 > -0.25) {
    // if (x1 > 0.7) {
    //   return 1;
    // } else {
    if (x2 > 0.69) {
      return -1;
    } else {
      return 1;
      // }
    }
  } else {
    return -1;
  }
}

export function neuralNetwork2(x1, x2) {
  if (x1 > -0.25) {
    if (x1 > 0.7) {
      // diagonal far right case
      if (x1 - x2 > 1.1) {
        return 1;
      } else {
        return -1;
      }
    } else {
      if (x2 > 0.69) {
        return -1;
      } else {
        if (x1 + x2 > 0.85) {
          return -1;
        } else {
          return 1;
        }
      }
    }
  } else {
    return -1;
  }
}
