import { range } from "./arrayUtils";

export const isNumber = (x) => typeof x === "number";
export const isString = (x) => typeof x === "string";
export const isValueInstance = (x) => x instanceof Value;
export const ensureValue = (x) => (isNumber(x) ? new Value(x) : x);

export class Value {
  constructor(data, children = [], op = "") {
    this.data = data;
    this.children = children;
    this.op = op;

    this._backward = function () {
      return null;
    };
    this.grad = 0.0;
  }

  add(other_) {
    const self = this;
    const other = ensureValue(other_);
    const out = new Value(this.data + other.data, [this, other], "+");

    out._backward = function () {
      self.grad += out.grad;
      other.grad += out.grad;
    };

    return out;
  }

  mul(other_) {
    const other = ensureValue(other_);
    const self = this;
    const out = new Value(this.data * other.data, [this, other], "*");

    out._backward = function () {
      self.grad += other.data * out.grad;
      other.grad += self.data * out.grad;
    };

    return out;
  }

  pow(other_) {
    const other = other_;
    const self = this;
    const out = new Value(
      Math.pow(this.data, other),
      [this],
      "**" + other.toString()
    );

    out._backward = function () {
      self.grad += other * Math.pow(self.data, other - 1) * out.grad;
    };

    return out;
  }

  relu() {
    const self = this;
    const out = new Value(this.data < 0 ? 0.0 : this.data, [this], "ReLU");

    out._backward = function () {
      self.grad += (out.data > 0.0 ? 1.0 : 0.0) * out.grad;
    };
    return out;
  }

  backward() {
    const topo = [];
    const visited = new Set();
    const build_topo = function (v) {
      if (!visited.has(v)) {
        visited.add(v);
        for (const child of v.children) {
          build_topo(child);
        }
        topo.push(v);
      }
    };
    build_topo(this);

    this.grad = 1;
    topo
      .slice()
      .reverse()
      .forEach(function (v) {
        v._backward();
      });
  }

  toString() {
    return `Value(data=${this.data}, grad=${this.grad}, op=${this.op})`;
  }
} // end Value

export class Module {
  parameters() {
    return [];
  }
  call_value_(x) {
    return [new Value(0.0)];
  }
  call_number_(x) {
    const input = Array.from(range(0, x.length), (i) => ensureValue(x[i]));
    return this.call_value_(input);
  }
  call(x) {
    if (typeof x[0] === "number") {
      return this.call_number_(x);
    } else {
      return this.call_value_(x);
    }
  }
  zero_grad() {
    this.parameters().forEach(function (v) {
      v.grad = 0;
    });
  }
}

export class Neuron extends Module {
  constructor(nin, nonlin = true) {
    super();
    this.w = Array.from(
      range(0, nin),
      (x) => new Value(Math.random() * 2.0 - 1.0)
    );
    this.b = new Value(0.0);
    this.nonlin = nonlin;
  }

  call_value_(x) {
    if (x.length != this.w.length) {
      throw new Error("Different sizes");
    }
    const act = this.w
      .map(function (e, i) {
        return e.mul(x[i]);
      })
      .reduce((sum, current) => sum.add(current), new Value(0.0))
      .add(this.b);
    return this.nonlin ? [act.relu()] : [act];
  }

  parameters() {
    return this.w.concat([this.b]);
  }

  toString() {
    return "${this.nonlin? 'ReLU': 'Linear'}Neuron(${this.w.length})";
  }
}

export class Layer extends Module {
  constructor(nin, nout, nonlin = true) {
    super();
    this.neurons = Array.from(range(0, nout), (x) => new Neuron(nin, nonlin));
  }

  call_value_(x) {
    const output = Array.from(this.neurons, (n) => n.call(x)[0]);
    return output;
  }

  parameters() {
    const result = [];
    for (const neuron of this.neurons) {
      for (const param of neuron.parameters()) {
        result.push(param);
      }
    }
    return result;
  }

  toString() {
    return "Layer of"; //TODO
  }
}

export class MLP extends Module {
  constructor(nin, nouts) {
    super();
    const sizes = [nin].concat(nouts);
    this.layers = Array.from(
      nouts.keys(),
      (i) => new Layer(sizes[i], sizes[i + 1], i != nouts.length - 1)
    );
  }

  call_value_(x) {
    let result = this.layers[0].call(x);
    for (let i = 1; i < this.layers.length; i++) {
      result = this.layers[i].call(result);
    }
    return result;
  }

  parameters() {
    const result = [];
    for (const layer of this.layers) {
      for (const param of layer.parameters()) {
        result.push(param);
      }
    }
    return result;
  }

  toString() {
    return "MLP of"; //TODO
  }
}
