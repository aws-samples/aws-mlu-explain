import { writable } from "svelte/store";
import { tweened } from "svelte/motion";

export const mobile = writable(true);
export const margin = writable({
  top: 55,
  bottom: 10,
  left: 60,
  right: 10,
});

export const outerWidth = writable(300);
export const outerHeight = writable(300);
export const rectPos = writable(0.5);
export const rectPos2 = writable(0.5);
export const wronglyAccepted = writable(1);
export const wronglyRejected = writable(1);
export const unigramCounts = writable({
  i: 0.14285714285714285,
  love: 0.2857142857142857,
  dogs: 0.2857142857142857,
  and: 0.14285714285714285,
  me: 0.14285714285714285,
});
