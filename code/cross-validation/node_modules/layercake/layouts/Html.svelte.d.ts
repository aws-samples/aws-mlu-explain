/** @typedef {typeof __propDef.props}  HtmlProps */
/** @typedef {typeof __propDef.events}  HtmlEvents */
/** @typedef {typeof __propDef.slots}  HtmlSlots */
/** HTML layout component */
export default class Html extends SvelteComponentTyped<{
    pointerEvents?: boolean;
    element?: Element;
    zIndex?: number;
}, {
    [evt: string]: CustomEvent<any>;
}, {
    default: {
        element: Element;
    };
}> {
}
export type HtmlProps = typeof __propDef.props;
export type HtmlEvents = typeof __propDef.events;
export type HtmlSlots = typeof __propDef.slots;
import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        pointerEvents?: boolean;
        element?: Element;
        zIndex?: number;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            element: Element;
        };
    };
};
export {};
