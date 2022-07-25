import { writable } from "svelte/store";

export const Temperature = writable(20);
export const gdWeight = writable(0.2);
export const gdBias = writable(-10);
export const gdIteration = writable(0);
export const gdError = writable(0);
export const gdErrors = writable([]);
export const shuffleIteration = writable(1);

// export const llWeight = writable(0.2);
// export const llBias = writable(-10);
// export const llError = writable(0);

export const llProbability = writable(0.50);

export const yVal = writable(true);


