import { writable } from "svelte/store";
import { tweened } from "svelte/motion";
import { linear } from "svelte/easing";

export const margin = writable({
  top: 25,
  bottom: 20,
  left: 90,
  right: 10,
});
export const marginScroll = writable({
  top: 12,
  bottom: 18,
  left: 70,
  right: 30,
});
export const showRegressionLine = writable(false);
export const showResiduals = writable(false);
export const sqft = writable(5);
export const coeff = writable(1.1);
export const intercept = writable(0.5);
export const lineType = writable("regressionLineFlat");
export const gdWeight = writable(0.1);
export const gdBias = writable(0.1);
export const gdIteration = writable(0);
export const gdError = writable(0);
export const gdErrors = writable([]);
export const shuffleIteration = writable(1);
// mse vars
export const mseWeight = writable(1);
export const mseBias = writable(1);
export const mseIteration = writable(0);
export const mseError = writable(0);
export const mseErrors = writable([]);
export const absError = writable(0);
export const rSquared = writable(0);
export const RSS = writable(0);
export const TSS = writable(0);
// closed form vars
export const cfWeight = writable(1);
export const cfBias = writable(1);
export const cfIteration = writable(0);
export const cfError = writable(0);
export const cfErrors = writable([]);
// here
export const cfCircles = writable([]);
