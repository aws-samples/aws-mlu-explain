export const logRegW0 = -1.03096821;
export const logRegW1 = 0.06139;
export const logRegW2 = 0.18226;

export const percW0 = -17.0;
export const percW1 = 9.8093627;
export const percW2 = 11.37731165;

export function logistic(x, y) {
  const z = logRegW0 + logRegW1 * x + logRegW2 * y;
  const p = 1 / (1 + Math.exp(-z));
  return p >= 0.5 ? 1 : 0;
}

export function perceptron(x, y) {
  const z = percW0 + percW1 * x + percW2 * y;
  return Math.sign(z) === 1 ? 1 : 0;
}
