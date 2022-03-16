import { writable } from "svelte/store";

export const TP = writable(0);
export const FP = writable(0);
export const TN = writable(0);
export const FN = writable(0);
export const f1Precision = writable(0.5);
export const f1Recall = writable(0.5);
export const stage = writable("none");
