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
  left: 95,
  right: 30,
});
export const mobile = writable(true);
export const showHighlight = writable(false);
export const showRegressionLine = writable(false);
export const showResiduals = writable(false);
export const sqft = writable(350);
export const coeff = writable(0);
export const intercept = writable(293683);
export const lineType = writable("regressionLineFlat");
export const gdWeight = writable(0.1);
export const gdBias = writable(0.1);
export const gdIteration = writable(0);
export const gdError = writable(0);
export const gdErrors = writable([]);
export const shuffleIteration = writable(1);
// mse vars
export const mseWeight = writable(0);
export const mseBias = writable(5);
export const mseIteration = writable(0);
export const mseError = writable(0);
export const mseErrors = writable([]);
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

// reactive dims for safari bug
export const cfWidth = writable(500);
export const cfHeight = writable(500);
export const mseWidth = writable(500);
export const mseHeight = writable(500);
export const gdeWidth = writable(500);
export const gdeHeight = writable(500);
export const gdWidth = writable(500);
export const gdHeight = writable(500);
export const tabWidth = writable(500);
export const tabHeight = writable(500);
export const scrollWidth = writable(500);
export const scrollHeight = writable(500);
