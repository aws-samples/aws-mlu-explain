import { writable } from "svelte/store";
import { tweened } from "svelte/motion";
import { linear } from "svelte/easing";

export const margin = writable({
  top: 40,
  bottom: 20,
  left: 50,
  right: 10,
});
export const marginScroll = writable({
  top: 12,
  bottom: 18,
  left: 70,
  right: 30,
});
export const sqft = writable(1000);
export const coeff = writable(1);
export const intercept = writable(5.5);
export const lineType = writable("regressionLineFlat");
export const gdWeight = writable(0.1);
export const gdBias = writable(0.1);
export const gdIteration = writable(0);
export const gdError = writable(0);
export const gdErrors = writable([]);
export const shuffleIteration = writable(1);
// mse vars
export const mseWeight = writable(0.1);
export const mseBias = writable(0.1);
export const mseIteration = writable(0);
export const mseError = writable(0);
export const mseErrors = writable([]);
