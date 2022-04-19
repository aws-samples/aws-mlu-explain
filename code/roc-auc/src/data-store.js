import { writable } from "svelte/store";

export const TP = writable(0);
export const FP = writable(0);
export const TN = writable(0);
export const FN = writable(0);
export const TPR = writable(0);
export const FPR = writable(0);
export const xPoss = writable(0.005);
export const rocCircles = writable([]);
