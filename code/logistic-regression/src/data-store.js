import { writable } from "svelte/store";

export const Temperature = writable(20);
export const DecisionBoundary = writable(0.5);
export const Prediction = writable("Rainy Day");

export const gdWeight = writable(0.2);
export const gdBias = writable(-10);
export const gdIteration = writable(0);
export const gdError = writable(0);
export const gdErrors = writable([]);
export const shuffleIteration = writable(1);

export const llProbability = writable(0.5);

export const yVal = writable(true);

export const mobile = writable(true);
