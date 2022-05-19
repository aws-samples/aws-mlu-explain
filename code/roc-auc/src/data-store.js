import { writable } from "svelte/store";

export const TP = writable(0);
export const FP = writable(0);
export const TN = writable(0);
export const FN = writable(0);
export const TPR = writable(0);
export const FPR = writable(0);
export const xPoss = writable(0.005);
export const rocCircles = writable([]);
export const innerWidth = writable(0);
export const margin = writable({
  top: 40,
  bottom: 20,
  left: 50,
  right: 10,
});
export const marginScroll = writable({
  top: 12,
  bottom: 18,
  left: 50,
  right: 40,
});
export const collision = writable(13.5);
export const iconScale = writable(0.04);
export const radius = writable(5);
