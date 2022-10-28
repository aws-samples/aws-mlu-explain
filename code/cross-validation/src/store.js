import { writable } from "svelte/store";

export const marginStatic = writable({ top: 5, bottom: 30, left: 5, right: 5 });
export const marginGrid = writable({ top: 0, bottom: 0, left: 5, right: 5 });
