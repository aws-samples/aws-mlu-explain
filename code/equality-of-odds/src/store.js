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

export const stackedData = tweened([
  {
    xVal: "A",
    Accepted: 70,
    Declined: 60,
  },
  {
    xVal: "A Predicted",
    Accepted: 16,
    Declined: 14,
  },
  { xVal: "B", Accepted: 33, Declined: 97 },
  {
    xVal: "B Predicted",
    Accepted: 32,
    Declined: 48,
  },
]);
