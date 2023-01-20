import { writable, derived } from "svelte/store";

export const lossData = writable([]);
export const networkInteractive = writable([3, 2, 1, 5, 5, 1]);
export const numLayersInteractive = derived(
  networkInteractive,
  ($networkInteractive) => $networkInteractive.length
);
