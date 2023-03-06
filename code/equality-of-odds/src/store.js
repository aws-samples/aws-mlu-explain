import { writable } from "svelte/store";

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
