export function circle_data(n) {
  var data = [];
  var labels = [];
  for (var i = 0; i < n / 2; i++) {
    var r = Math.random() * 2;
    var t = Math.random() * 2 * Math.PI;
    data.push([r * Math.sin(t), r * Math.cos(t)]);
    labels.push(1);
  }
  for (var i = 0; i < n / 2; i++) {
    var r = Math.random() * 2.0 + 3.0;
    var t = (2 * Math.PI * i) / 50.0;
    data.push([r * Math.sin(t), r * Math.cos(t)]);
    labels.push(-1);
  }
  return [data, labels];
}
