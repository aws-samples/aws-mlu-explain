import { SVG_NS, DEFAULT_ANIMATION_DURATION } from './model.js';
import { renderAnnotation } from './render.js';
import { ensureKeyframes } from './keyframes.js';
import { randomSeed } from 'roughjs/bin/math';
class RoughAnnotationImpl {
    constructor(e, config) {
        this._state = 'unattached';
        this._resizing = false;
        this._seed = randomSeed();
        this._lastSizes = [];
        this._animationDelay = 0;
        this._resizeListener = () => {
            if (!this._resizing) {
                this._resizing = true;
                setTimeout(() => {
                    this._resizing = false;
                    if (this._state === 'showing') {
                        if (this.haveRectsChanged()) {
                            this.show();
                        }
                    }
                }, 400);
            }
        };
        this._e = e;
        this._config = JSON.parse(JSON.stringify(config));
        this.attach();
    }
    get animate() { return this._config.animate; }
    set animate(value) { this._config.animate = value; }
    get animationDuration() { return this._config.animationDuration; }
    set animationDuration(value) { this._config.animationDuration = value; }
    get iterations() { return this._config.iterations; }
    set iterations(value) { this._config.iterations = value; }
    get color() { return this._config.color; }
    set color(value) {
        if (this._config.color !== value) {
            this._config.color = value;
            this.refresh();
        }
    }
    get strokeWidth() { return this._config.strokeWidth; }
    set strokeWidth(value) {
        if (this._config.strokeWidth !== value) {
            this._config.strokeWidth = value;
            this.refresh();
        }
    }
    get padding() { return this._config.padding; }
    set padding(value) {
        if (this._config.padding !== value) {
            this._config.padding = value;
            this.refresh();
        }
    }
    attach() {
        if (this._state === 'unattached' && this._e.parentElement) {
            ensureKeyframes();
            const svg = this._svg = document.createElementNS(SVG_NS, 'svg');
            svg.setAttribute('class', 'rough-annotation');
            const style = svg.style;
            style.position = 'absolute';
            style.top = '0';
            style.left = '0';
            style.overflow = 'visible';
            style.pointerEvents = 'none';
            style.width = '100px';
            style.height = '100px';
            const prepend = this._config.type === 'highlight';
            this._e.insertAdjacentElement(prepend ? 'beforebegin' : 'afterend', svg);
            this._state = 'not-showing';
            // ensure e is positioned
            if (prepend) {
                const computedPos = window.getComputedStyle(this._e).position;
                const unpositioned = (!computedPos) || (computedPos === 'static');
                if (unpositioned) {
                    this._e.style.position = 'relative';
                }
            }
            this.attachListeners();
        }
    }
    detachListeners() {
        window.removeEventListener('resize', this._resizeListener);
        if (this._ro) {
            this._ro.unobserve(this._e);
        }
    }
    attachListeners() {
        this.detachListeners();
        window.addEventListener('resize', this._resizeListener, { passive: true });
        if ((!this._ro) && ('ResizeObserver' in window)) {
            this._ro = new window.ResizeObserver((entries) => {
                for (const entry of entries) {
                    if (entry.contentRect) {
                        this._resizeListener();
                    }
                }
            });
        }
        if (this._ro) {
            this._ro.observe(this._e);
        }
    }
    haveRectsChanged() {
        if (this._lastSizes.length) {
            const newRects = this.rects();
            if (newRects.length === this._lastSizes.length) {
                for (let i = 0; i < newRects.length; i++) {
                    if (!this.isSameRect(newRects[i], this._lastSizes[i])) {
                        return true;
                    }
                }
            }
            else {
                return true;
            }
        }
        return false;
    }
    isSameRect(rect1, rect2) {
        const si = (a, b) => Math.round(a) === Math.round(b);
        return (si(rect1.x, rect2.x) &&
            si(rect1.y, rect2.y) &&
            si(rect1.w, rect2.w) &&
            si(rect1.h, rect2.h));
    }
    isShowing() {
        return (this._state !== 'not-showing');
    }
    refresh() {
        if (this.isShowing() && (!this.pendingRefresh)) {
            this.pendingRefresh = Promise.resolve().then(() => {
                if (this.isShowing()) {
                    this.show();
                }
                delete this.pendingRefresh;
            });
        }
    }
    show() {
        switch (this._state) {
            case 'unattached':
                break;
            case 'showing':
                this.hide();
                if (this._svg) {
                    this.render(this._svg, true);
                }
                break;
            case 'not-showing':
                this.attach();
                if (this._svg) {
                    this.render(this._svg, false);
                }
                break;
        }
    }
    hide() {
        if (this._svg) {
            while (this._svg.lastChild) {
                this._svg.removeChild(this._svg.lastChild);
            }
        }
        this._state = 'not-showing';
    }
    remove() {
        if (this._svg && this._svg.parentElement) {
            this._svg.parentElement.removeChild(this._svg);
        }
        this._svg = undefined;
        this._state = 'unattached';
        this.detachListeners();
    }
    render(svg, ensureNoAnimation) {
        let config = this._config;
        if (ensureNoAnimation) {
            config = JSON.parse(JSON.stringify(this._config));
            config.animate = false;
        }
        const rects = this.rects();
        let totalWidth = 0;
        rects.forEach((rect) => totalWidth += rect.w);
        const totalDuration = (config.animationDuration || DEFAULT_ANIMATION_DURATION);
        let delay = 0;
        for (let i = 0; i < rects.length; i++) {
            const rect = rects[i];
            const ad = totalDuration * (rect.w / totalWidth);
            renderAnnotation(svg, rects[i], config, delay + this._animationDelay, ad, this._seed);
            delay += ad;
        }
        this._lastSizes = rects;
        this._state = 'showing';
    }
    rects() {
        const ret = [];
        if (this._svg) {
            if (this._config.multiline) {
                const elementRects = this._e.getClientRects();
                for (let i = 0; i < elementRects.length; i++) {
                    ret.push(this.svgRect(this._svg, elementRects[i]));
                }
            }
            else {
                ret.push(this.svgRect(this._svg, this._e.getBoundingClientRect()));
            }
        }
        return ret;
    }
    svgRect(svg, bounds) {
        const rect1 = svg.getBoundingClientRect();
        const rect2 = bounds;
        return {
            x: (rect2.x || rect2.left) - (rect1.x || rect1.left),
            y: (rect2.y || rect2.top) - (rect1.y || rect1.top),
            w: rect2.width,
            h: rect2.height
        };
    }
}
export function annotate(element, config) {
    return new RoughAnnotationImpl(element, config);
}
export function annotationGroup(annotations) {
    let delay = 0;
    for (const a of annotations) {
        const ai = a;
        ai._animationDelay = delay;
        const duration = ai.animationDuration === 0 ? 0 : (ai.animationDuration || DEFAULT_ANIMATION_DURATION);
        delay += duration;
    }
    const list = [...annotations];
    return {
        show() {
            for (const a of list) {
                a.show();
            }
        },
        hide() {
            for (const a of list) {
                a.hide();
            }
        }
    };
}
