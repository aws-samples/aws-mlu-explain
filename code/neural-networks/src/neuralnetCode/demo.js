import { range } from "./arrayUtils";
import { circle_data } from "./data";
import { Value, MLP, ensureValue } from "./ann";

var train_interval;
var N = 200;
//   var [X_data, y_data] = circle_data(N);
var epochs = 10;
var N_in = 2;
var dims = [3, 1];
var lr = 0.01;
var alpha = 0.0001;
var batch_size = 32;
var k = 0;
const model = new MLP(N_in, dims);
console.log("model", model);
console.log("num params", model.parameters().length);

const [X, y] = circle_data(100);

// function start_training() {
//   return setInterval(function () {
//     if (k > epochs) {
//       clearInterval(train_interval);
//       return;
//     }

//     // --------------------------
//     // TRAIN LOOP
//     // --------------------------
//     // k++;

//     // batch for data
//     var X_b = X;
//     var y_b = y;

//     // make sure each input is a Value
//     var inputs = X_b.map(function (row) {
//       return row.map(function (x) {
//         return ensureValue(x);
//       });
//     });

//     //  predictions
//     // loop through input X and call model prediction on it
//     var scores = inputs.map(function (row) {
//       return model.call(row);
//     });

//     // svm max margin loss
//     var losses = range(0, scores.length).map(function (i) {
//       return scores[i][0].mul(-y_b[i]).add(+1.0).relu();
//     });

//     // console.log("losses", losses);

//     var data_loss = losses
//       .reduce(function (sum, current) {
//         return sum.add(current);
//       }, new Value(0))
//       .mul(1 / losses.length);

//     var reg_loss = model
//       .parameters()
//       .map(function (e) {
//         return e.mul(e);
//       })
//       .reduce(function (sum, cur) {
//         return sum.add(cur);
//       }, new Value(0))
//       .mul(alpha);

//     var total_loss = data_loss.add(reg_loss);

//     var accuracies = range(0, scores.length).map(function (i) {
//       return scores[i][0].data > 0.0 === y_b[i] > 0.0 ? 1.0 : 0.0;
//     });

//     var accuracy =
//       accuracies.reduce(function (sum, current) {
//         return sum + current;
//       }, 0.0) / accuracies.length;

//     // # backward
//     model.zero_grad();
//     total_loss.backward();

//     // sgd
//     var learning_rate = 1.0 - (0.9 * k) / 100;
//     console.log("lr", learning_rate);

//     for (var _i = 0, _b = model.parameters(); _i < _b.length; _i++) {
//       var p = _b[_i];
//       // p.data -= lr * p.grad;
//       p.data -= learning_rate * p.grad;
//     }

//     if (k % 1 === 0) {
//       console.log(
//         "step " +
//           k +
//           " loss " +
//           total_loss.data +
//           ", accuracy " +
//           accuracy * 100 +
//           "%"
//       );
//     }

//     k++;
//   });
// }

// start_training();
