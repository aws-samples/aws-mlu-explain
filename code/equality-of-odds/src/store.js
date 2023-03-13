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
    Accepted: 20,
    Declined: 30,
  },
  {
    xVal: "A Predicted",
    Accepted: 20,
    Declined: 30,
  },
  { xVal: "B", Accepted: 15, Declined: 10 },
  {
    xVal: "B Predicted",
    Accepted: 15,
    Declined: 10,
  },
]);
