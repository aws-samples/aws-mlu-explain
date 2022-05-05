/** @typedef {typeof __propDef.props}  WebglProps */
/** @typedef {typeof __propDef.events}  WebglEvents */
/** @typedef {typeof __propDef.slots}  WebglSlots */
/** WebGL layout component */
export default class Webgl extends SvelteComponentTyped<{
    pointerEvents?: boolean;
    element?: HTMLCanvasElement;
    zIndex?: number;
    context?: WebGLRenderingContext;
    contextAttributes?: any;
}, {
    [evt: string]: CustomEvent<any>;
}, {
    default: {
        element: HTMLCanvasElement;
        context: WebGLRenderingContext;
    };
}> {
}
export type WebglProps = typeof __propDef.props;
export type WebglEvents = typeof __propDef.events;
export type WebglSlots = typeof __propDef.slots;
import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        pointerEvents?: boolean;
        element?: HTMLCanvasElement;
        zIndex?: number;
        context?: WebGLRenderingContext;
        contextAttributes?: any;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            element: HTMLCanvasElement;
            context: WebGLRenderingContext;
        };
    };
};
export {};
