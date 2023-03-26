import { writable, derived } from "svelte/store";
import { tweened } from "svelte/motion";
import { linear } from "svelte/easing";

export const margin = writable({
  top: 3,
  bottom: 3,
  left: 3,
  right: 3,
});
export const marginScroll = writable({
  top: 3,
  bottom: 3,
  left: 3,
  right: 3,
});
export const mobile = writable(true);

export const network = writable([2, 1, 1]);
export const labels = writable(["input", "function", "hidden"]);
export const numLayers = derived(network, ($network) => $network.length);

export const showLayerLine = writable(false);
export const showSubScript = writable(false);
export const drawActivation = writable(false);
export const stepIndex = writable(0);
// backprop
export const stepIndexBp = writable(0);
export const labelsBp = writable(["X", "reLu", "linear"]);
export const networkBp = writable([1, 2, 1, 1]);
export const bpStage = writable(0);
export const numLayersBp = derived(
  networkBp,
  ($networkBp) => $networkBp.length
);

// viz
export const playAnimation = writable(true);
export const animationDuration = writable(0.25);
export const ggg = writable();
export const points = writable([1, 2, 3]);
export const show = writable(true);
export const networkInteractive = writable([2, 3, 1]);
export const numLayersInteractive = derived(
  networkInteractive,
  ($networkInteractive) => $networkInteractive.length
);
export const errorMetrics = writable([{ x: 0, loss: 0, y: 0 }]);
// preds
export const hexPreds = writable([]);
export const hexVals = writable([]);
