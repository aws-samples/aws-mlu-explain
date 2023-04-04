import { writable } from "svelte/store";
import { tweened } from "svelte/motion";

export const mobile = writable(true);
export const margin = writable({
  top: 60,
  bottom: 10,
  left: 80,
  right: 10,
});

export const outerWidth = writable(300);
export const outerHeight = writable(300);
export const fnrfprWidth = writable(300);
export const fnrfprHeight = writable(300);
export const rocWidth = writable(300);
export const rocHeight = writable(300);
export const rectPos = writable(0.5);
export const rectPos2 = writable(0.5);
export const wrongly_accepted_A = writable(1);
export const wrongly_accepted_B = writable(1);
export const wrongly_rejected_A = writable(1);
export const wrongly_rejected_B = writable(1);

export const stackedData = tweened([
  {
    xVal: "A",
    Accepted: 30,
    Declined: 20,
  },
  {
    xVal: "A Predicted",
    Accepted: 30,
    Declined: 20,
  },
  {
    xVal: "B",
    Accepted: 10,
    Declined: 15,
  },
  {
    xVal: "B Predicted",
    Accepted: 10,
    Declined: 15,
  },
]);
