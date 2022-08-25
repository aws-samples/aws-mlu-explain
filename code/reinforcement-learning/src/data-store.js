import { tweened } from "svelte/motion";
import { cubicInOut } from "svelte/easing";
import { writable } from "svelte/store";

export const margin = writable({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
});

export const lineRobot = tweened(
  { x: 3.5, y: 0.5 },
  {
    duration: 200,
    easing: cubicInOut,
  }
);

export const gridRobot = tweened(
  { x: 0.5, y: 0.5 },
  {
    duration: 200,
    easing: cubicInOut,
  }
);

export const lineRobotPath = writable([{ x: 3.5, y: 0.5 }]);
export const gridRobotPath = writable([{ x: 0.5, y: 0.5 }]);

export const epsilon = writable(0.5);

// export const gridQValues = writable([
//   { x: [0, 1, 2], redValue: [1, 1, 2], blueValue: [2, 1, 1], maxDirection: 1 },
//   { x: [0, 1, 2], redValue: [1, 1, 2], blueValue: [2, 1, 1], maxDirection: 2 },
//   { x: [0, 1, 2], redValue: [1, 1, 2], blueValue: [2, 1, 1], maxDirection: 3 },
//   { x: [0, 1, 2], redValue: [1, 1, 2], blueValue: [2, 1, 1], maxDirection: 1 },
//   { x: [0, 1, 2], redValue: [1, 1, 2], blueValue: [2, 1, 1], maxDirection: 2 },
//   { x: [0, 1, 2], redValue: [1, 1, 2], blueValue: [2, 1, 1], maxDirection: 3 },
//   { x: [0, 1, 2], redValue: [1, 1, 2], blueValue: [2, 1, 1], maxDirection: 1 },
//   { x: [0, 1, 2], redValue: [1, 1, 2], blueValue: [2, 1, 1], maxDirection: 2 },
//   { x: [0, 1, 2], redValue: [1, 1, 2], blueValue: [2, 1, 1], maxDirection: 3 },
//   { x: [0, 1, 2], redValue: [1, 1, 2], blueValue: [2, 1, 1], maxDirection: 1 },
//   { x: [0, 1, 2], redValue: [1, 1, 2], blueValue: [2, 1, 1], maxDirection: 2 },
//   { x: [0, 1, 2], redValue: [1, 1, 2], blueValue: [2, 1, 1], maxDirection: 3 },
//   { x: [0, 1, 2], redValue: [1, 1, 2], blueValue: [2, 1, 1], maxDirection: 1 },
//   { x: [0, 1, 2], redValue: [1, 1, 2], blueValue: [2, 1, 1], maxDirection: 2 },
//   { x: [0, 1, 2], redValue: [1, 1, 2], blueValue: [2, 1, 1], maxDirection: 3 },
//   { x: [0, 1, 2], redValue: [1, 1, 2], blueValue: [2, 1, 1], maxDirection: 3 },
// ])

export const lineQValues = writable([
  { episodeNumber: [], left: [], right: [], maxDirection: [] },
  { episodeNumber: [], left: [], right: [], maxDirection: [] },
  { episodeNumber: [], left: [], right: [], maxDirection: [] },
  { episodeNumber: [], left: [], right: [], maxDirection: [] },
  { episodeNumber: [], left: [], right: [], maxDirection: [] },
  { episodeNumber: [], left: [], right: [], maxDirection: [] },
  { episodeNumber: [], left: [], right: [], maxDirection: [] },
  { episodeNumber: [], left: [], right: [], maxDirection: [] },
]);

export const gridQValues = writable([
  { episodeNumber: [], up: [], down: [], left: [], right: [], maxDirection: [] },
  { episodeNumber: [], up: [], down: [], left: [], right: [], maxDirection: [] },
  { episodeNumber: [], up: [], down: [], left: [], right: [], maxDirection: [] },
  { episodeNumber: [], up: [], down: [], left: [], right: [], maxDirection: [] },
  { episodeNumber: [], up: [], down: [], left: [], right: [], maxDirection: [] },
  { episodeNumber: [], up: [], down: [], left: [], right: [], maxDirection: [] },
  { episodeNumber: [], up: [], down: [], left: [], right: [], maxDirection: [] },
  { episodeNumber: [], up: [], down: [], left: [], right: [], maxDirection: [] },
  { episodeNumber: [], up: [], down: [], left: [], right: [], maxDirection: [] },
  { episodeNumber: [], up: [], down: [], left: [], right: [], maxDirection: [] },
  { episodeNumber: [], up: [], down: [], left: [], right: [], maxDirection: [] },
  { episodeNumber: [], up: [], down: [], left: [], right: [], maxDirection: [] },
  { episodeNumber: [], up: [], down: [], left: [], right: [], maxDirection: [] },
  { episodeNumber: [], up: [], down: [], left: [], right: [], maxDirection: [] },
  { episodeNumber: [], up: [], down: [], left: [], right: [], maxDirection: [] },
  { episodeNumber: [], up: [], down: [], left: [], right: [], maxDirection: [] },
]);
