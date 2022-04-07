/** @typedef {typeof __propDef.props}  ScaledSvgProps */
/** @typedef {typeof __propDef.events}  ScaledSvgEvents */
/** @typedef {typeof __propDef.slots}  ScaledSvgSlots */
/** Scaled SVG layout component */
export default class ScaledSvg extends SvelteComponentTyped<{
    pointerEvents?: boolean;
    element?: Element;
    zIndex?: number;
    viewBox?: string;
    fixedAspectRatio?: number;
}, {
    [evt: string]: CustomEvent<any>;
}, {
    defs: {};
    default: {
        element: Element;
    };
}> {
}
export type ScaledSvgProps = typeof __propDef.props;
export type ScaledSvgEvents = typeof __propDef.events;
export type ScaledSvgSlots = typeof __propDef.slots;
import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        pointerEvents?: boolean;
        element?: Element;
        zIndex?: number;
        viewBox?: string;
        fixedAspectRatio?: number;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        defs: {};
        default: {
            element: Element;
        };
    };
};
export {};
