import { backOut, cubicInOut } from "svelte/easing";

// animation func
export function shrink(node, { duration }) {
  return {
    duration,
    css: (t) => {
      const eased = backOut(t);
      return `opacity: ${eased}`;
    },
  };
}

// animation func
export function drawPath(node, params) {
  const len = node.getTotalLength();
  return {
    delay: params.delay,
    duration: params.duration || 800,
    easing: params.easing || cubicInOut,
    css: (t, u) => `stroke-dashoffset: ${t}; stroke-dasharray: 5 ${t * len};`,
  };
}
