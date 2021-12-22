import katex from "katex";

katex.render(`(p_1, p_2, \\dots, p_n)`, document.querySelector("#equation-1"), {
  throwOnError: false,
});

katex.render(
  `\\displaystyle  H = - \\sum\\limits_{i=1}^{n} p_i \\log_2(p_i)`,
  document.querySelector("#equation-2"),
  {
    throwOnError: false,
  }
);
