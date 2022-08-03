// transpose matrix
export const transpose = (m) => {
  return m[0].map((x, i) => m.map((x) => x[i]));
};

export const matrixDot = (A, B) => {
  // Error handling
  const mx = [A, B];
  const cols = mx.map((matrix) => matrix[0].length);
  if (!mx.every((matrix, i) => matrix.every((row) => row.length === cols[i]))) {
    throw new Error(
      "All rows in a matrix must have the same number of columns"
    );
  } else if (cols[0] !== B.length) {
    throw new Error(
      "The number of columns in the 1st matrix must be equal to the number of rows in the 2nd matrix"
    );
  }

  // Calculations
  return A.map((rowA) =>
    B[0].map((_, xb) =>
      rowA.reduce((acc, itemA, yb) => acc + itemA * B[yb][xb], 0)
    )
  );
};

export const leastSquares = (values_x, values_y) => {
  let x_sum = 0;
  let y_sum = 0;
  let xy_sum = 0;
  let xx_sum = 0;
  let count = 0;

  /*
   * The above is just for quick access, makes the program faster
   */
  let x = 0;
  let y = 0;
  let values_length = values_x.length;

  if (values_length != values_y.length) {
    throw new Error(
      "The parameters values_x and values_y need to have same size!"
    );
  }

  /*
   * Above and below cover edge cases
   */
  if (values_length === 0) {
    return [[], []];
  }

  /*
   * Calculate the sum for each of the parts necessary.
   */
  for (let i = 0; i < values_length; i++) {
    x = values_x[i];
    y = values_y[i];
    x_sum += x;
    y_sum += y;
    xx_sum += x * x;
    xy_sum += x * y;
    count++;
  }

  /*
   * Calculate m and b for the line equation:
   * y = x * m + b
   */
  let m = (count * xy_sum - x_sum * y_sum) / (count * xx_sum - x_sum * x_sum);
  let b = y_sum / count - (m * x_sum) / count;

  /*
   * We then return the x and y data points according to our fit
   */
  let result_values_x = [];
  let result_values_y = [];

  for (let i = 0; i < values_length; i++) {
    x = values_x[i];
    y = x * m + b;
    result_values_x.push(x);
    result_values_y.push(y);
  }

  //   return [result_values_x, result_values_y, m, b];
  return [m, b];
};
