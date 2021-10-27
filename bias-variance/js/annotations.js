import { annotate } from "rough-notation";
const col2 = "rgba(255, 241, 118, .5)"; // "rgba(0,128,128, .48)";
const biasColor = "skyblue";
const varianceColor = "rgba(0,128,128, .8)";
const n1 = document.querySelector("#bias");
const n2 = document.querySelector("#variance");
const n3 = document.querySelector("#overfit-highlight");
const n4 = document.querySelector("#underfit-highlight");
const n5 = document.querySelector("#underfit-def");
const n6 = document.querySelector("#overfit-def");
const n7 = document.querySelector("#bias-def");
const n8 = document.querySelector("#variance-def");
const n9 = document.querySelector("#balance-def");
const n10 = document.querySelector("#decomp-highlight");
const n11 = document.querySelector("#conclusion");

const a1 = annotate(n1, {
  type: "highlight",
  color: biasColor,
  strokeWidth: 1,
});
const a2 = annotate(n2, {
  type: "highlight",
  color: varianceColor,
  strokeWidth: 0.2,
});
const a3 = annotate(n3, {
  type: "highlight",
  padding: [0, 0],
  color: col2,
  strokeWidth: 1,
  iterations: 1,
});
const a4 = annotate(n4, {
  type: "highlight",
  padding: [0, 0],
  color: col2,
  strokeWidth: 2,
  iterations: 1,
});
const a5 = annotate(n5, {
  type: "highlight",
  padding: [0, 0],
  color: col2,
  strokeWidth: 2,
  iterations: 1,
  multiline: true,
});
const a6 = annotate(n6, {
  type: "highlight",
  padding: [0, 0],
  color: col2,
  strokeWidth: 2,
  iterations: 1,
  multiline: true,
});
const a7 = annotate(n7, {
  type: "highlight",
  padding: [0, 0],
  color: col2,
  strokeWidth: 2,
  iterations: 1,
  multiline: true,
});
const a8 = annotate(n8, {
  type: "highlight",
  padding: [0, 0],
  color: col2,
  strokeWidth: 2,
  iterations: 1,
  multiline: true,
});
const a9 = annotate(n9, {
  type: "highlight",
  padding: [0, 0],
  color: col2,
  strokeWidth: 2,
  iterations: 1,
  multiline: true,
});
const a10 = annotate(n10, {
  type: "highlight",
  padding: [0, 0],
  color: col2,
  strokeWidth: 2,
  iterations: 1,
  multiline: true,
});
const a11 = annotate(n11, {
  type: "highlight",
  padding: [0, 0],
  color: col2,
  strokeWidth: 2,
  iterations: 1,
  multiline: true,
});

setTimeout(() => {
  a1.show();
}, 750);
setTimeout(() => {
  a2.show();
}, 750);

export { a3, a4, a5, a6, a7, a8, a9, a10, a11 };
