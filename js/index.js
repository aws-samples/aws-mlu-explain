const highlightColor = "rgba(252, 106, 73, 0.4)";
const underlineColor = "rgba(252, 106, 73, 0.5)";

const n1 = document.querySelector(".subtitle");
const n2 = document.querySelector(".section-segue");

const a1 = RoughNotation.annotate(n1, {
  type: "highlight",
  color: highlightColor,
  strokeWidth: 1,
  iterations: 1,
  multiline: true,
  animationDuration: 1000,
});

const a2 = RoughNotation.annotate(n2, {
  type: "underline",
  color: underlineColor,
  strokeWidth: 1.25,
  iterations: 2,
  animationDuration: 1000,
});

setTimeout(() => {
  a1.show();
  a2.show();
}, 750);
