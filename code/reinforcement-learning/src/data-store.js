import { tweened } from "svelte/motion";
import { cubicInOut } from "svelte/easing";
import { writable } from "svelte/store";

export const margin = writable({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
});

export const agent = tweened(
  { x: 0.5, y: 0.5 },
  {
    duration: 200,
    easing: cubicInOut,
  }
);

export const agentPath = writable([{ x: 0.5, y: 0.5 }]);

export const epsilon = writable(0.5);

export const gridQValues = writable([
  { x: [0, 1, 2], redValue: [1, 1, 2], blueValue: [2, 1, 1], maxDirection: 1 },
  { x: [0, 1, 2], redValue: [1, 1, 2], blueValue: [2, 1, 1], maxDirection: 2 },
  { x: [0, 1, 2], redValue: [1, 1, 2], blueValue: [2, 1, 1], maxDirection: 3 },
  { x: [0, 1, 2], redValue: [1, 1, 2], blueValue: [2, 1, 1], maxDirection: 1 },
  { x: [0, 1, 2], redValue: [1, 1, 2], blueValue: [2, 1, 1], maxDirection: 2 },
  { x: [0, 1, 2], redValue: [1, 1, 2], blueValue: [2, 1, 1], maxDirection: 3 },
  { x: [0, 1, 2], redValue: [1, 1, 2], blueValue: [2, 1, 1], maxDirection: 1 },
  { x: [0, 1, 2], redValue: [1, 1, 2], blueValue: [2, 1, 1], maxDirection: 2 },
  { x: [0, 1, 2], redValue: [1, 1, 2], blueValue: [2, 1, 1], maxDirection: 3 },
  { x: [0, 1, 2], redValue: [1, 1, 2], blueValue: [2, 1, 1], maxDirection: 1 },
  { x: [0, 1, 2], redValue: [1, 1, 2], blueValue: [2, 1, 1], maxDirection: 2 },
  { x: [0, 1, 2], redValue: [1, 1, 2], blueValue: [2, 1, 1], maxDirection: 3 },
  { x: [0, 1, 2], redValue: [1, 1, 2], blueValue: [2, 1, 1], maxDirection: 1 },
  { x: [0, 1, 2], redValue: [1, 1, 2], blueValue: [2, 1, 1], maxDirection: 2 },
  { x: [0, 1, 2], redValue: [1, 1, 2], blueValue: [2, 1, 1], maxDirection: 3 },
  { x: [0, 1, 2], redValue: [1, 1, 2], blueValue: [2, 1, 1], maxDirection: 3 },
]);
