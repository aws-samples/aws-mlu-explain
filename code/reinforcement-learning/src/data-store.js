import { tweened } from 'svelte/motion';
import { cubicInOut } from 'svelte/easing';
import { writable } from "svelte/store";

export const margin = writable({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
});

export const agent = tweened({x:0.5, y:0.5}, {
	duration: 200,
	easing: cubicInOut
}); 

export const agentPath = writable([{x:0.5, y:0.5}])
