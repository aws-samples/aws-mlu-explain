import katex from "katex";

export default function katexify(math, displayMode = false) {
  const options = {
    displayMode: displayMode,
    throwOnError: false,
  };
  return katex.renderToString(math, options);
}
