import katex from "katex";

katex.render(
  `\\displaystyle  H = - \\sum\\limits_{i=1}^{n} p_i \\log_2(p_i)`,
  document.querySelector("#entropy-equation"),
  {
    throwOnError: false,
  }
);

katex.render(`H`, document.querySelector("#H-equation"), {
  throwOnError: false,
});

katex.render(`H`, document.querySelector("#H-equation2"), {
  throwOnError: false,
});

katex.render(`H`, document.querySelector("#H-equation3"), {
  throwOnError: false,
});

katex.render(`H=0`, document.querySelector("#H-eq-0-equation"), {
  throwOnError: false,
});

katex.render(`p_i`, document.querySelector("#one-prob-equation"), {
  throwOnError: false,
});

katex.render(`p_i`, document.querySelector("#one-prob-equation2"), {
  throwOnError: false,
});

katex.render(
  `(p_1, p_2, \\dots, p_n)`,
  document.querySelector("#probs-equation"),
  {
    throwOnError: false,
  }
);

katex.render(
  `(p_1, p_2, \\dots, p_n)`,
  document.querySelector("#probs-equation2"),
  {
    throwOnError: false,
  }
);

katex.render(`\\Delta IG`, document.querySelector("#delta-ig-equation"), {
  throwOnError: false,
});

katex.render(
  `\\displaystyle \\Delta IG = H_{\\text{parent}}  - \\frac{1}{N}\\sum\\limits_{\\text{children}} N_{\\text{child}} \\cdot H_{\\text{child}}`,
  document.querySelector("#ig-equation"),
  {
    throwOnError: false,
  }
);

katex.render(`N`, document.querySelector("#N-equation"), {
  throwOnError: false,
});

katex.render(`N_{\\text{child}}`, document.querySelector("#N-child-equation"), {
  throwOnError: false,
});
