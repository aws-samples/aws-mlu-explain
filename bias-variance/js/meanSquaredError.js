// calculate MSE for two equal-dimension arrays

export const meanSquaredError = (actual, pred) => {
    // helper funcs
    const sqr = a => a * a;
    const add = (a, b) => a + b;
    const difference = (a, b) => a.map((x, i) => x - b[i]);

    // calculate MSE
    const squaredError = difference(actual, pred).map(sqr);
    const sumSquaredError = squaredError.reduce(add, 0);
    const mse = sumSquaredError / actual.length;

    return mse
}