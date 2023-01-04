import { tweened } from "svelte/motion";
import { cubicInOut } from "svelte/easing";
import { writable } from "svelte/store";

export const margin = writable({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
});
export const banditEpsilon = writable(0.2);
export const lineEpsilon = writable(0.5);
export const gridEpsilon = writable(0.5);

export const gridWidth = writable(500);
export const gridHeight = writable(500);
export const gridMargin = writable({
  top: 8,
  bottom: 12,
  left: 16,
  right: 0,
});
export const lineWidth = writable(125);
export const lineHeight = writable(125);
export const lineMargin = writable({
  top: 8,
  bottom: 20,
  left: 16,
  right: 0,
});
export const banditWidth = writable(430);
export const banditHeight = writable(200);

export const robotScale = writable(0.22);
export const bananaScale = writable(0.13);
export const arrowScale = writable(0.09);

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
  { x: 0.5, y: 1.5 },
  {
    duration: 200,
    easing: cubicInOut,
  }
);

export const gridStatIndex = writable(0);
export const gridRecordInterval = writable(25);

export const lowRewardGrid = writable([
  [0, 0],
  [3, 3],
  [3, 1],
  [3, 0],
  [3, 0],
  
]);

export const highRewardGrid = writable([
  [2, 3],
  [0, 0],
  [0, 0],
  [0, 2],
  [0, 1],
]);

export const negRewardGrid = writable([
  [2, 2],
  [3, 1],
  [2, 2],
  [1, 2],
  [1, 1],
]);

export const startPosGrid =  writable([
  [0, 1],
  [3, 2],
  [3, 2],
  [3, 1],
  [3, 3],
 ]);


export const lineRobotPath = writable([{ x: 3.5, y: 0.5 }]);
export const gridRobotPath = writable([{ x: 3.5, y: 1.5 }]);

export const banditQValues = writable([
  {
    episodeNumber: [1, 2, 3],
    left: [2, 4, 6],
    right: [1, 2, 3],
    maxDirection: [1, 1, 1],
  },
]);

export const lineRecordInterval = writable(15);
export const lineQValues = writable([
  { episodeNumber: [0], left: [0], right: [0], maxDirection: ['left'] },
  { episodeNumber: [0], left: [0], right: [0], maxDirection: ['left'] },
  { episodeNumber: [0], left: [0], right: [0], maxDirection: ['left'] },
  { episodeNumber: [0], left: [0], right: [0], maxDirection: ['left'] },
  { episodeNumber: [0], left: [0], right: [0], maxDirection: ['left'] },
  { episodeNumber: [0], left: [0], right: [0], maxDirection: ['left'] },
  { episodeNumber: [0], left: [0], right: [0], maxDirection: ['left'] },
  { episodeNumber: [0], left: [0], right: [0], maxDirection: ['left'] },
]);

export const gridQValues = writable([
  {
    episodeNumber: [],
    up: [],
    down: [],
    left: [],
    right: [],
    maxDirection: [],
  },
  {
    episodeNumber: [],
    up: [],
    down: [],
    left: [],
    right: [],
    maxDirection: [],
  },
  {
    episodeNumber: [],
    up: [],
    down: [],
    left: [],
    right: [],
    maxDirection: [],
  },
  {
    episodeNumber: [],
    up: [],
    down: [],
    left: [],
    right: [],
    maxDirection: [],
  },
  {
    episodeNumber: [],
    up: [],
    down: [],
    left: [],
    right: [],
    maxDirection: [],
  },
  {
    episodeNumber: [],
    up: [],
    down: [],
    left: [],
    right: [],
    maxDirection: [],
  },
  {
    episodeNumber: [],
    up: [],
    down: [],
    left: [],
    right: [],
    maxDirection: [],
  },
  {
    episodeNumber: [],
    up: [],
    down: [],
    left: [],
    right: [],
    maxDirection: [],
  },
  {
    episodeNumber: [],
    up: [],
    down: [],
    left: [],
    right: [],
    maxDirection: [],
  },
  {
    episodeNumber: [],
    up: [],
    down: [],
    left: [],
    right: [],
    maxDirection: [],
  },
  {
    episodeNumber: [],
    up: [],
    down: [],
    left: [],
    right: [],
    maxDirection: [],
  },
  {
    episodeNumber: [],
    up: [],
    down: [],
    left: [],
    right: [],
    maxDirection: [],
  },
  {
    episodeNumber: [],
    up: [],
    down: [],
    left: [],
    right: [],
    maxDirection: [],
  },
  {
    episodeNumber: [],
    up: [],
    down: [],
    left: [],
    right: [],
    maxDirection: [],
  },
  {
    episodeNumber: [],
    up: [],
    down: [],
    left: [],
    right: [],
    maxDirection: [],
  },
  {
    episodeNumber: [],
    up: [],
    down: [],
    left: [],
    right: [],
    maxDirection: [],
  },
]);
