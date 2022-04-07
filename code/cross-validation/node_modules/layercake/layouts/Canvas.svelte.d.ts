/** @typedef {typeof __propDef.props}  CanvasProps */
/** @typedef {typeof __propDef.events}  CanvasEvents */
/** @typedef {typeof __propDef.slots}  CanvasSlots */
/** Canvas layout component */
export default class Canvas extends SvelteComponentTyped<{
    pointerEvents?: boolean;
    element?: HTMLCanvasElement;
    zIndex?: number;
    context?: CanvasRenderingContext2D;
}, {
    [evt: string]: CustomEvent<any>;
}, {
    default: {
        element: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
    };
}> {
}
export type CanvasProps = typeof __propDef.props;
export type CanvasEvents = typeof __propDef.events;
export type CanvasSlots = typeof __propDef.slots;
import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        pointerEvents?: boolean;
        element?: HTMLCanvasElement;
        zIndex?: number;
        context?: CanvasRenderingContext2D;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            element: HTMLCanvasElement;
            context: CanvasRenderingContext2D;
        };
    };
};
export {};
