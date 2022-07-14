import { writable } from "svelte/store";

export const Temperature = writable(20);
// export const coeff = writable(0.5);
// export const intercept = writable(-20);
export const gdWeight = writable(0.1);
export const gdBias = writable(-20);
export const gdIteration = writable(0);
export const gdError = writable(0);
export const gdErrors = writable([]);
export const shuffleIteration = writable(1);


