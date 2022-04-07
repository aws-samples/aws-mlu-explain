/** @typedef {typeof __propDef.props}  SvgProps */
/** @typedef {typeof __propDef.events}  SvgEvents */
/** @typedef {typeof __propDef.slots}  SvgSlots */
/** SVG layout component */
export default class Svg extends SvelteComponentTyped<{
    pointerEvents?: boolean;
    element?: Element;
    zIndex?: number;
    innerElement?: Element;
    viewBox?: string;
}, {
    [evt: string]: CustomEvent<any>;
}, {
    defs: {};
    default: {
        element: Element;
    };
}> {
}
export type SvgProps = typeof __propDef.props;
export type SvgEvents = typeof __propDef.events;
export type SvgSlots = typeof __propDef.slots;
import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        pointerEvents?: boolean;
        element?: Element;
        zIndex?: number;
        innerElement?: Element;
        viewBox?: string;
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
