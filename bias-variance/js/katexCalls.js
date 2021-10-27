import katex from "katex";

katex.render(
  `\\mathrm{Error}(x) =  \\Big( \\mathbf{E}\\big[\\widehat{f}(x)\\big] - f(x) \\Big)^2 + \\mathbf{E}\\Big[\\Big(\\widehat{f}(x) -  \\mathbf{E}\\big[\\widehat{f}(x)\\big]\\Big)^2\\Big] + \\mathrm{Noise} `,
  document.querySelector(".katex-bv-equation"),
  {
    throwOnError: false,
  }
);

katex.render(
  `\\mathrm{Bias}^2(x) =  \\Big( \\mathbf{E}\\big[\\widehat{f}(x)\\big] - f(x) \\Big)^2`,
  document.querySelector(".katex-bias"),
  {
    throwOnError: false,
  }
);

katex.render(
  `\\mathrm{Variance}(x) = \\mathbf{E}\\Big[\\Big(\\widehat{f}(x) -  \\mathbf{E}\\big[\\widehat{f}(x)\\big]\\Big)^2\\Big]`,
  document.querySelector(".katex-var"),
  {
    throwOnError: false,
  }
);

katex.render(
  `\\mathrm{Error} =  \\mathrm{Bias}^2 + \\mathrm{Variance} + \\mathrm{Noise}`,
  document.querySelector(".katex-bv-text"),
  {
    throwOnError: false,
  }
);

katex.render(`\\thinspace \\mathrm{Noise}`, document.querySelector(".katex-noise"), {
  throwOnError: false,
});
katex.render(
  `\\thinspace E[\\widehat{f}(x)]`,
  document.querySelector(".katex-bias-inline"),
  {
    throwOnError: false,
  }
);
