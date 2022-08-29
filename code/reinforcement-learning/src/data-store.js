import { tweened } from "svelte/motion";
import { cubicInOut } from "svelte/easing";
import { writable } from "svelte/store";

export const margin = writable({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
});

export const epsilon = writable(0.5);


export const banditRobot = tweened(
  { x: 0.5, y: 0.5 },
  {
    duration: 200,
    easing: cubicInOut,
  }
);

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

export const banditQValues = writable([
  { episodeNumber: [1, 2, 3], left: [2, 4, 6], right: [1, 2, 3], maxDirection: [1, 1, 1] },
]);

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