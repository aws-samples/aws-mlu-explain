
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element('iframe');
        iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
            'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.48.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/Components/Logo.svelte generated by Svelte v3.48.0 */

    const file$b = "src/Components/Logo.svelte";

    function create_fragment$c(ctx) {
    	let div;
    	let a;
    	let svg;
    	let g2;
    	let g1;
    	let path0;
    	let path1;
    	let path2;
    	let path3;
    	let g0;
    	let path4;
    	let defs;
    	let clipPath;
    	let rect;
    	let t0;
    	let h2;
    	let t1;
    	let span;
    	let t3;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			svg = svg_element("svg");
    			g2 = svg_element("g");
    			g1 = svg_element("g");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			g0 = svg_element("g");
    			path4 = svg_element("path");
    			defs = svg_element("defs");
    			clipPath = svg_element("clipPath");
    			rect = svg_element("rect");
    			t0 = space();
    			h2 = element("h2");
    			t1 = text("MLU-EXPL");
    			span = element("span");
    			span.textContent = "AI";
    			t3 = text("N");
    			attr_dev(path0, "id", "Vector");
    			attr_dev(path0, "d", "M90.6641 83.1836C96.8828 83.1836 101.941 78.1289 101.941 71.8906V71.8242C101.941 65.5898 96.8945 60.5312 90.6641 60.5312C84.4453 60.5312 79.3828 65.5898 79.3828 71.8242V71.8906C79.3828 78.1289 84.4336 83.1836 90.6641 83.1836Z");
    			attr_dev(path0, "fill", /*robotLogoColor*/ ctx[1]);
    			add_location(path0, file$b, 10, 10, 322);
    			attr_dev(path1, "id", "Vector_2");
    			attr_dev(path1, "d", "M143.305 83.1836C149.523 83.1836 154.586 78.1289 154.586 71.8906V71.8242C154.586 65.5898 149.535 60.5312 143.305 60.5312C137.09 60.5312 132.027 65.5898 132.027 71.8242V71.8906C132.027 78.1289 137.078 83.1836 143.305 83.1836Z");
    			attr_dev(path1, "fill", /*robotLogoColor*/ ctx[1]);
    			add_location(path1, file$b, 15, 10, 651);
    			attr_dev(path2, "id", "Vector_3");
    			attr_dev(path2, "d", "M163.586 159.402H173.609V122.641H163.586V159.402Z");
    			attr_dev(path2, "fill", /*robotLogoColor*/ ctx[1]);
    			add_location(path2, file$b, 20, 10, 981);
    			attr_dev(path3, "id", "Vector_4");
    			attr_dev(path3, "d", "M60.3594 159.402H70.3867V122.641H60.3594V159.402Z");
    			attr_dev(path3, "fill", /*robotLogoColor*/ ctx[1]);
    			add_location(path3, file$b, 25, 10, 1136);
    			attr_dev(path4, "id", "Vector_5");
    			attr_dev(path4, "d", "M182.16 30.0781H51.8047V10.0234H182.16V30.0781ZM182.16 103.609H51.8047V40.1055H182.16V103.609ZM144.559 168.789H89.4062V113.641H144.559V168.789ZM0 0V10.0234H15.8789V46.7891H25.9023V10.0234H41.7812V113.641H79.3867V178.816H96.9297V215.578H106.957V178.816H127.016V215.578H137.039V178.816H154.586V113.641H192.188V10.0234H233.969V0");
    			attr_dev(path4, "fill", /*robotLogoColor*/ ctx[1]);
    			add_location(path4, file$b, 31, 12, 1318);
    			attr_dev(g0, "id", "Group");
    			add_location(g0, file$b, 30, 10, 1291);
    			add_location(g1, file$b, 9, 8, 308);
    			attr_dev(g2, "id", "mlu_robot 1");
    			attr_dev(g2, "clip-path", "url(#clip0)");
    			add_location(g2, file$b, 8, 6, 255);
    			attr_dev(rect, "width", "233.97");
    			attr_dev(rect, "height", "215.58");
    			attr_dev(rect, "fill", "black");
    			add_location(rect, file$b, 41, 10, 1839);
    			attr_dev(clipPath, "id", "clip0");
    			add_location(clipPath, file$b, 40, 8, 1807);
    			add_location(defs, file$b, 39, 6, 1792);
    			attr_dev(svg, "width", "30");
    			attr_dev(svg, "height", "30");
    			attr_dev(svg, "viewBox", "0 0 234 216");
    			add_location(svg, file$b, 7, 5, 198);
    			attr_dev(span, "id", "ai");
    			attr_dev(span, "class", "svelte-htd26v");
    			add_location(span, file$b, 45, 29, 1966);
    			attr_dev(h2, "class", "logo svelte-htd26v");
    			add_location(h2, file$b, 45, 4, 1941);
    			attr_dev(a, "href", "https://mlu-explain.github.io");
    			attr_dev(a, "class", "svelte-htd26v");
    			add_location(a, file$b, 6, 2, 153);
    			attr_dev(div, "id", "intro-icon");
    			set_style(div, "--ai-color", /*aiLogoColor*/ ctx[0]);
    			attr_dev(div, "class", "svelte-htd26v");
    			add_location(div, file$b, 5, 0, 95);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(a, svg);
    			append_dev(svg, g2);
    			append_dev(g2, g1);
    			append_dev(g1, path0);
    			append_dev(g1, path1);
    			append_dev(g1, path2);
    			append_dev(g1, path3);
    			append_dev(g1, g0);
    			append_dev(g0, path4);
    			append_dev(svg, defs);
    			append_dev(defs, clipPath);
    			append_dev(clipPath, rect);
    			append_dev(a, t0);
    			append_dev(a, h2);
    			append_dev(h2, t1);
    			append_dev(h2, span);
    			append_dev(h2, t3);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*robotLogoColor*/ 2) {
    				attr_dev(path0, "fill", /*robotLogoColor*/ ctx[1]);
    			}

    			if (dirty & /*robotLogoColor*/ 2) {
    				attr_dev(path1, "fill", /*robotLogoColor*/ ctx[1]);
    			}

    			if (dirty & /*robotLogoColor*/ 2) {
    				attr_dev(path2, "fill", /*robotLogoColor*/ ctx[1]);
    			}

    			if (dirty & /*robotLogoColor*/ 2) {
    				attr_dev(path3, "fill", /*robotLogoColor*/ ctx[1]);
    			}

    			if (dirty & /*robotLogoColor*/ 2) {
    				attr_dev(path4, "fill", /*robotLogoColor*/ ctx[1]);
    			}

    			if (dirty & /*aiLogoColor*/ 1) {
    				set_style(div, "--ai-color", /*aiLogoColor*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Logo', slots, []);
    	let { aiLogoColor = "black" } = $$props;
    	let { robotLogoColor = "black" } = $$props;
    	const writable_props = ['aiLogoColor', 'robotLogoColor'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Logo> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('aiLogoColor' in $$props) $$invalidate(0, aiLogoColor = $$props.aiLogoColor);
    		if ('robotLogoColor' in $$props) $$invalidate(1, robotLogoColor = $$props.robotLogoColor);
    	};

    	$$self.$capture_state = () => ({ aiLogoColor, robotLogoColor });

    	$$self.$inject_state = $$props => {
    		if ('aiLogoColor' in $$props) $$invalidate(0, aiLogoColor = $$props.aiLogoColor);
    		if ('robotLogoColor' in $$props) $$invalidate(1, robotLogoColor = $$props.robotLogoColor);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [aiLogoColor, robotLogoColor];
    }

    class Logo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { aiLogoColor: 0, robotLogoColor: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Logo",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get aiLogoColor() {
    		throw new Error("<Logo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set aiLogoColor(value) {
    		throw new Error("<Logo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get robotLogoColor() {
    		throw new Error("<Logo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set robotLogoColor(value) {
    		throw new Error("<Logo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const t="http://www.w3.org/2000/svg";class e{constructor(t){this.seed=t;}next(){return this.seed?(2**31-1&(this.seed=Math.imul(48271,this.seed)))/2**31:Math.random()}}function s(t,e,s,i,n){return {type:"path",ops:c(t,e,s,i,n)}}function i(t,e,i){const n=(t||[]).length;if(n>2){const s=[];for(let e=0;e<n-1;e++)s.push(...c(t[e][0],t[e][1],t[e+1][0],t[e+1][1],i));return e&&s.push(...c(t[n-1][0],t[n-1][1],t[0][0],t[0][1],i)),{type:"path",ops:s}}return 2===n?s(t[0][0],t[0][1],t[1][0],t[1][1],i):{type:"path",ops:[]}}function n(t,e,s,n,o){return function(t,e){return i(t,!0,e)}([[t,e],[t+s,e],[t+s,e+n],[t,e+n]],o)}function o(t,e,s,i,n){return function(t,e,s,i){const[n,o]=l(i.increment,t,e,i.rx,i.ry,1,i.increment*h(.1,h(.4,1,s),s),s);let r=f(n,null,s);if(!s.disableMultiStroke){const[n]=l(i.increment,t,e,i.rx,i.ry,1.5,0,s),o=f(n,null,s);r=r.concat(o);}return {estimatedPoints:o,opset:{type:"path",ops:r}}}(t,e,n,function(t,e,s){const i=Math.sqrt(2*Math.PI*Math.sqrt((Math.pow(t/2,2)+Math.pow(e/2,2))/2)),n=Math.max(s.curveStepCount,s.curveStepCount/Math.sqrt(200)*i),o=2*Math.PI/n;let r=Math.abs(t/2),h=Math.abs(e/2);const c=1-s.curveFitting;return r+=a(r*c,s),h+=a(h*c,s),{increment:o,rx:r,ry:h}}(s,i,n)).opset}function r(t){return t.randomizer||(t.randomizer=new e(t.seed||0)),t.randomizer.next()}function h(t,e,s,i=1){return s.roughness*i*(r(s)*(e-t)+t)}function a(t,e,s=1){return h(-t,t,e,s)}function c(t,e,s,i,n,o=!1){const r=o?n.disableMultiStrokeFill:n.disableMultiStroke,h=u(t,e,s,i,n,!0,!1);if(r)return h;const a=u(t,e,s,i,n,!0,!0);return h.concat(a)}function u(t,e,s,i,n,o,h){const c=Math.pow(t-s,2)+Math.pow(e-i,2),u=Math.sqrt(c);let f=1;f=u<200?1:u>500?.4:-.0016668*u+1.233334;let l=n.maxRandomnessOffset||0;l*l*100>c&&(l=u/10);const g=l/2,d=.2+.2*r(n);let p=n.bowing*n.maxRandomnessOffset*(i-e)/200,_=n.bowing*n.maxRandomnessOffset*(t-s)/200;p=a(p,n,f),_=a(_,n,f);const m=[],w=()=>a(g,n,f),v=()=>a(l,n,f);return o&&(h?m.push({op:"move",data:[t+w(),e+w()]}):m.push({op:"move",data:[t+a(l,n,f),e+a(l,n,f)]})),h?m.push({op:"bcurveTo",data:[p+t+(s-t)*d+w(),_+e+(i-e)*d+w(),p+t+2*(s-t)*d+w(),_+e+2*(i-e)*d+w(),s+w(),i+w()]}):m.push({op:"bcurveTo",data:[p+t+(s-t)*d+v(),_+e+(i-e)*d+v(),p+t+2*(s-t)*d+v(),_+e+2*(i-e)*d+v(),s+v(),i+v()]}),m}function f(t,e,s){const i=t.length,n=[];if(i>3){const o=[],r=1-s.curveTightness;n.push({op:"move",data:[t[1][0],t[1][1]]});for(let e=1;e+2<i;e++){const s=t[e];o[0]=[s[0],s[1]],o[1]=[s[0]+(r*t[e+1][0]-r*t[e-1][0])/6,s[1]+(r*t[e+1][1]-r*t[e-1][1])/6],o[2]=[t[e+1][0]+(r*t[e][0]-r*t[e+2][0])/6,t[e+1][1]+(r*t[e][1]-r*t[e+2][1])/6],o[3]=[t[e+1][0],t[e+1][1]],n.push({op:"bcurveTo",data:[o[1][0],o[1][1],o[2][0],o[2][1],o[3][0],o[3][1]]});}if(e&&2===e.length){const t=s.maxRandomnessOffset;n.push({op:"lineTo",data:[e[0]+a(t,s),e[1]+a(t,s)]});}}else 3===i?(n.push({op:"move",data:[t[1][0],t[1][1]]}),n.push({op:"bcurveTo",data:[t[1][0],t[1][1],t[2][0],t[2][1],t[2][0],t[2][1]]})):2===i&&n.push(...c(t[0][0],t[0][1],t[1][0],t[1][1],s));return n}function l(t,e,s,i,n,o,r,h){const c=[],u=[],f=a(.5,h)-Math.PI/2;u.push([a(o,h)+e+.9*i*Math.cos(f-t),a(o,h)+s+.9*n*Math.sin(f-t)]);for(let r=f;r<2*Math.PI+f-.01;r+=t){const t=[a(o,h)+e+i*Math.cos(r),a(o,h)+s+n*Math.sin(r)];c.push(t),u.push(t);}return u.push([a(o,h)+e+i*Math.cos(f+2*Math.PI+.5*r),a(o,h)+s+n*Math.sin(f+2*Math.PI+.5*r)]),u.push([a(o,h)+e+.98*i*Math.cos(f+r),a(o,h)+s+.98*n*Math.sin(f+r)]),u.push([a(o,h)+e+.9*i*Math.cos(f+.5*r),a(o,h)+s+.9*n*Math.sin(f+.5*r)]),[u,c]}function g(t,e){return {maxRandomnessOffset:2,roughness:"highlight"===t?3:1.5,bowing:1,stroke:"#000",strokeWidth:1.5,curveTightness:0,curveFitting:.95,curveStepCount:9,fillStyle:"hachure",fillWeight:-1,hachureAngle:-41,hachureGap:-1,dashOffset:-1,dashGap:-1,zigzagOffset:-1,combineNestedSvgPaths:!1,disableMultiStroke:"double"!==t,disableMultiStrokeFill:!1,seed:e}}function d(e,r,h,a,c,u){const f=[];let l=h.strokeWidth||2;const d=function(t){const e=t.padding;if(e||0===e){if("number"==typeof e)return [e,e,e,e];if(Array.isArray(e)){const t=e;if(t.length)switch(t.length){case 4:return [...t];case 1:return [t[0],t[0],t[0],t[0]];case 2:return [...t,...t];case 3:return [...t,t[1]];default:return [t[0],t[1],t[2],t[3]]}}}return [5,5,5,5]}(h),p=void 0===h.animate||!!h.animate,_=h.iterations||2,m=g("single",u);switch(h.type){case"underline":{const t=r.y+r.h+d[2];for(let e=0;e<_;e++)e%2?f.push(s(r.x+r.w,t,r.x,t,m)):f.push(s(r.x,t,r.x+r.w,t,m));break}case"strike-through":{const t=r.y+r.h/2;for(let e=0;e<_;e++)e%2?f.push(s(r.x+r.w,t,r.x,t,m)):f.push(s(r.x,t,r.x+r.w,t,m));break}case"box":{const t=r.x-d[3],e=r.y-d[0],s=r.w+(d[1]+d[3]),i=r.h+(d[0]+d[2]);for(let o=0;o<_;o++)f.push(n(t,e,s,i,m));break}case"bracket":{const t=Array.isArray(h.brackets)?h.brackets:h.brackets?[h.brackets]:["right"],e=r.x-2*d[3],s=r.x+r.w+2*d[1],n=r.y-2*d[0],o=r.y+r.h+2*d[2];for(const h of t){let t;switch(h){case"bottom":t=[[e,r.y+r.h],[e,o],[s,o],[s,r.y+r.h]];break;case"top":t=[[e,r.y],[e,n],[s,n],[s,r.y]];break;case"left":t=[[r.x,n],[e,n],[e,o],[r.x,o]];break;case"right":t=[[r.x+r.w,n],[s,n],[s,o],[r.x+r.w,o]];}t&&f.push(i(t,!1,m));}break}case"crossed-off":{const t=r.x,e=r.y,i=t+r.w,n=e+r.h;for(let o=0;o<_;o++)o%2?f.push(s(i,n,t,e,m)):f.push(s(t,e,i,n,m));for(let o=0;o<_;o++)o%2?f.push(s(t,n,i,e,m)):f.push(s(i,e,t,n,m));break}case"circle":{const t=g("double",u),e=r.w+(d[1]+d[3]),s=r.h+(d[0]+d[2]),i=r.x-d[3]+e/2,n=r.y-d[0]+s/2,h=Math.floor(_/2),a=_-2*h;for(let r=0;r<h;r++)f.push(o(i,n,e,s,t));for(let t=0;t<a;t++)f.push(o(i,n,e,s,m));break}case"highlight":{const t=g("highlight",u);l=.95*r.h;const e=r.y+r.h/2;for(let i=0;i<_;i++)i%2?f.push(s(r.x+r.w,e,r.x,e,t)):f.push(s(r.x,e,r.x+r.w,e,t));break}}if(f.length){const s=function(t){const e=[];for(const s of t){let t="";for(const i of s.ops){const s=i.data;switch(i.op){case"move":t.trim()&&e.push(t.trim()),t=`M${s[0]} ${s[1]} `;break;case"bcurveTo":t+=`C${s[0]} ${s[1]}, ${s[2]} ${s[3]}, ${s[4]} ${s[5]} `;break;case"lineTo":t+=`L${s[0]} ${s[1]} `;}}t.trim()&&e.push(t.trim());}return e}(f),i=[],n=[];let o=0;const r=(t,e,s)=>t.setAttribute(e,s);for(const a of s){const s=document.createElementNS(t,"path");if(r(s,"d",a),r(s,"fill","none"),r(s,"stroke",h.color||"currentColor"),r(s,"stroke-width",""+l),p){const t=s.getTotalLength();i.push(t),o+=t;}e.appendChild(s),n.push(s);}if(p){let t=0;for(let e=0;e<n.length;e++){const s=n[e],r=i[e],h=o?c*(r/o):0,u=a+t,f=s.style;f.strokeDashoffset=""+r,f.strokeDasharray=""+r,f.animation=`rough-notation-dash ${h}ms ease-out ${u}ms forwards`,t+=h;}}}}class p{constructor(t,e){this._state="unattached",this._resizing=!1,this._seed=Math.floor(Math.random()*2**31),this._lastSizes=[],this._animationDelay=0,this._resizeListener=()=>{this._resizing||(this._resizing=!0,setTimeout(()=>{this._resizing=!1,"showing"===this._state&&this.haveRectsChanged()&&this.show();},400));},this._e=t,this._config=JSON.parse(JSON.stringify(e)),this.attach();}get animate(){return this._config.animate}set animate(t){this._config.animate=t;}get animationDuration(){return this._config.animationDuration}set animationDuration(t){this._config.animationDuration=t;}get iterations(){return this._config.iterations}set iterations(t){this._config.iterations=t;}get color(){return this._config.color}set color(t){this._config.color!==t&&(this._config.color=t,this.refresh());}get strokeWidth(){return this._config.strokeWidth}set strokeWidth(t){this._config.strokeWidth!==t&&(this._config.strokeWidth=t,this.refresh());}get padding(){return this._config.padding}set padding(t){this._config.padding!==t&&(this._config.padding=t,this.refresh());}attach(){if("unattached"===this._state&&this._e.parentElement){!function(){if(!window.__rno_kf_s){const t=window.__rno_kf_s=document.createElement("style");t.textContent="@keyframes rough-notation-dash { to { stroke-dashoffset: 0; } }",document.head.appendChild(t);}}();const e=this._svg=document.createElementNS(t,"svg");e.setAttribute("class","rough-annotation");const s=e.style;s.position="absolute",s.top="0",s.left="0",s.overflow="visible",s.pointerEvents="none",s.width="100px",s.height="100px";const i="highlight"===this._config.type;if(this._e.insertAdjacentElement(i?"beforebegin":"afterend",e),this._state="not-showing",i){const t=window.getComputedStyle(this._e).position;(!t||"static"===t)&&(this._e.style.position="relative");}this.attachListeners();}}detachListeners(){window.removeEventListener("resize",this._resizeListener),this._ro&&this._ro.unobserve(this._e);}attachListeners(){this.detachListeners(),window.addEventListener("resize",this._resizeListener,{passive:!0}),!this._ro&&"ResizeObserver"in window&&(this._ro=new window.ResizeObserver(t=>{for(const e of t)e.contentRect&&this._resizeListener();})),this._ro&&this._ro.observe(this._e);}haveRectsChanged(){if(this._lastSizes.length){const t=this.rects();if(t.length!==this._lastSizes.length)return !0;for(let e=0;e<t.length;e++)if(!this.isSameRect(t[e],this._lastSizes[e]))return !0}return !1}isSameRect(t,e){const s=(t,e)=>Math.round(t)===Math.round(e);return s(t.x,e.x)&&s(t.y,e.y)&&s(t.w,e.w)&&s(t.h,e.h)}isShowing(){return "not-showing"!==this._state}refresh(){this.isShowing()&&!this.pendingRefresh&&(this.pendingRefresh=Promise.resolve().then(()=>{this.isShowing()&&this.show(),delete this.pendingRefresh;}));}show(){switch(this._state){case"unattached":break;case"showing":this.hide(),this._svg&&this.render(this._svg,!0);break;case"not-showing":this.attach(),this._svg&&this.render(this._svg,!1);}}hide(){if(this._svg)for(;this._svg.lastChild;)this._svg.removeChild(this._svg.lastChild);this._state="not-showing";}remove(){this._svg&&this._svg.parentElement&&this._svg.parentElement.removeChild(this._svg),this._svg=void 0,this._state="unattached",this.detachListeners();}render(t,e){let s=this._config;e&&(s=JSON.parse(JSON.stringify(this._config)),s.animate=!1);const i=this.rects();let n=0;i.forEach(t=>n+=t.w);const o=s.animationDuration||800;let r=0;for(let e=0;e<i.length;e++){const h=o*(i[e].w/n);d(t,i[e],s,r+this._animationDelay,h,this._seed),r+=h;}this._lastSizes=i,this._state="showing";}rects(){const t=[];if(this._svg)if(this._config.multiline){const e=this._e.getClientRects();for(let s=0;s<e.length;s++)t.push(this.svgRect(this._svg,e[s]));}else t.push(this.svgRect(this._svg,this._e.getBoundingClientRect()));return t}svgRect(t,e){const s=t.getBoundingClientRect(),i=e;return {x:(i.x||i.left)-(s.x||s.left),y:(i.y||i.top)-(s.y||s.top),w:i.width,h:i.height}}}function _(t,e){return new p(t,e)}

    /* src/Components/Title.svelte generated by Svelte v3.48.0 */
    const file$a = "src/Components/Title.svelte";

    function create_fragment$b(ctx) {
    	let section;
    	let h10;
    	let span;
    	let t1;
    	let h11;
    	let t3;
    	let h3;
    	let a0;
    	let t5;
    	let a1;
    	let t7;

    	const block = {
    		c: function create() {
    			section = element("section");
    			h10 = element("h1");
    			span = element("span");
    			span.textContent = "Cross Validation";
    			t1 = space();
    			h11 = element("h1");
    			h11.textContent = "Reduce, Reuse, Resample";
    			t3 = space();
    			h3 = element("h3");
    			a0 = element("a");
    			a0.textContent = "Jared Wilber";
    			t5 = text(" &\n    ");
    			a1 = element("a");
    			a1.textContent = "Jasper Croome";
    			t7 = text(", May\n    2022");
    			attr_dev(span, "id", "title-cv");
    			add_location(span, file$a, 24, 4, 478);
    			attr_dev(h10, "id", "intro-hed");
    			attr_dev(h10, "class", "title-cv svelte-pehdcn");
    			add_location(h10, file$a, 23, 2, 437);
    			attr_dev(h11, "class", "intro-sub svelte-pehdcn");
    			add_location(h11, file$a, 26, 2, 532);
    			attr_dev(a0, "href", "https://twitter.com/jdwlbr");
    			attr_dev(a0, "class", "svelte-pehdcn");
    			add_location(a0, file$a, 28, 4, 611);
    			attr_dev(a1, "href", "https://www.linkedin.com/in/jaspercroome/");
    			attr_dev(a1, "class", "svelte-pehdcn");
    			add_location(a1, file$a, 29, 4, 671);
    			attr_dev(h3, "id", "intro__date");
    			attr_dev(h3, "class", "svelte-pehdcn");
    			add_location(h3, file$a, 27, 2, 585);
    			attr_dev(section, "id", "intro");
    			attr_dev(section, "class", "svelte-pehdcn");
    			add_location(section, file$a, 22, 0, 414);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h10);
    			append_dev(h10, span);
    			append_dev(section, t1);
    			append_dev(section, h11);
    			append_dev(section, t3);
    			append_dev(section, h3);
    			append_dev(h3, a0);
    			append_dev(h3, t5);
    			append_dev(h3, a1);
    			append_dev(h3, t7);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Title', slots, []);

    	onMount(() => {
    		const n1 = document.querySelector(".title-cv");

    		const a1 = _(n1, {
    			type: "box",
    			// color: "#f46ebb",
    			strokeWidth: 5,
    			iterations: 4,
    			multiline: true,
    			animationDuration: 1000
    		});

    		setTimeout(
    			() => {
    				a1.show();
    			},
    			450
    		);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Title> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ onMount, annotate: _ });
    	return [];
    }

    class Title extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Title",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src/Components/Intro.svelte generated by Svelte v3.48.0 */

    const file$9 = "src/Components/Intro.svelte";

    function create_fragment$a(ctx) {
    	let section;
    	let p;

    	const block = {
    		c: function create() {
    			section = element("section");
    			p = element("p");
    			p.textContent = "Often in machine learning we want to compare and evaluate models without\n    having to wait for new data. Of course, we could just evaluate predictions\n    on the same data that we used to fit our model’s parameters, but this will\n    give unreliable assessments of our model's ability to generalize. Thus, we’d\n    like to find a way to assess the generalization capabilities of our model\n    without waiting for new data. This article discusses one of the most common\n    approaches for this task: *cross-validation*. We'll first discuss the\n    approach we previously learned, introduce some new approaches, and discuss\n    what values of k are commonly selected and why.";
    			attr_dev(p, "class", "body-text");
    			add_location(p, file$9, 4, 2, 32);
    			add_location(section, file$9, 3, 0, 20);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, p);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Intro', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Intro> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Intro extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Intro",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    function ascending(a, b) {
      return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }

    function bisector(f) {
      let delta = f;
      let compare = f;

      if (f.length === 1) {
        delta = (d, x) => f(d) - x;
        compare = ascendingComparator(f);
      }

      function left(a, x, lo, hi) {
        if (lo == null) lo = 0;
        if (hi == null) hi = a.length;
        while (lo < hi) {
          const mid = (lo + hi) >>> 1;
          if (compare(a[mid], x) < 0) lo = mid + 1;
          else hi = mid;
        }
        return lo;
      }

      function right(a, x, lo, hi) {
        if (lo == null) lo = 0;
        if (hi == null) hi = a.length;
        while (lo < hi) {
          const mid = (lo + hi) >>> 1;
          if (compare(a[mid], x) > 0) hi = mid;
          else lo = mid + 1;
        }
        return lo;
      }

      function center(a, x, lo, hi) {
        if (lo == null) lo = 0;
        if (hi == null) hi = a.length;
        const i = left(a, x, lo, hi - 1);
        return i > lo && delta(a[i - 1], x) > -delta(a[i], x) ? i - 1 : i;
      }

      return {left, center, right};
    }

    function ascendingComparator(f) {
      return (d, x) => ascending(f(d), x);
    }

    function number$1(x) {
      return x === null ? NaN : +x;
    }

    const ascendingBisect = bisector(ascending);
    const bisectRight = ascendingBisect.right;
    bisector(number$1).center;
    var bisect = bisectRight;

    var e10 = Math.sqrt(50),
        e5 = Math.sqrt(10),
        e2 = Math.sqrt(2);

    function ticks(start, stop, count) {
      var reverse,
          i = -1,
          n,
          ticks,
          step;

      stop = +stop, start = +start, count = +count;
      if (start === stop && count > 0) return [start];
      if (reverse = stop < start) n = start, start = stop, stop = n;
      if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

      if (step > 0) {
        let r0 = Math.round(start / step), r1 = Math.round(stop / step);
        if (r0 * step < start) ++r0;
        if (r1 * step > stop) --r1;
        ticks = new Array(n = r1 - r0 + 1);
        while (++i < n) ticks[i] = (r0 + i) * step;
      } else {
        step = -step;
        let r0 = Math.round(start * step), r1 = Math.round(stop * step);
        if (r0 / step < start) ++r0;
        if (r1 / step > stop) --r1;
        ticks = new Array(n = r1 - r0 + 1);
        while (++i < n) ticks[i] = (r0 + i) / step;
      }

      if (reverse) ticks.reverse();

      return ticks;
    }

    function tickIncrement(start, stop, count) {
      var step = (stop - start) / Math.max(0, count),
          power = Math.floor(Math.log(step) / Math.LN10),
          error = step / Math.pow(10, power);
      return power >= 0
          ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
          : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
    }

    function tickStep(start, stop, count) {
      var step0 = Math.abs(stop - start) / Math.max(0, count),
          step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
          error = step0 / step1;
      if (error >= e10) step1 *= 10;
      else if (error >= e5) step1 *= 5;
      else if (error >= e2) step1 *= 2;
      return stop < start ? -step1 : step1;
    }

    function sequence(start, stop, step) {
      start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

      var i = -1,
          n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
          range = new Array(n);

      while (++i < n) {
        range[i] = start + i * step;
      }

      return range;
    }

    function initRange(domain, range) {
      switch (arguments.length) {
        case 0: break;
        case 1: this.range(domain); break;
        default: this.range(range).domain(domain); break;
      }
      return this;
    }

    const implicit = Symbol("implicit");

    function ordinal() {
      var index = new Map(),
          domain = [],
          range = [],
          unknown = implicit;

      function scale(d) {
        var key = d + "", i = index.get(key);
        if (!i) {
          if (unknown !== implicit) return unknown;
          index.set(key, i = domain.push(d));
        }
        return range[(i - 1) % range.length];
      }

      scale.domain = function(_) {
        if (!arguments.length) return domain.slice();
        domain = [], index = new Map();
        for (const value of _) {
          const key = value + "";
          if (index.has(key)) continue;
          index.set(key, domain.push(value));
        }
        return scale;
      };

      scale.range = function(_) {
        return arguments.length ? (range = Array.from(_), scale) : range.slice();
      };

      scale.unknown = function(_) {
        return arguments.length ? (unknown = _, scale) : unknown;
      };

      scale.copy = function() {
        return ordinal(domain, range).unknown(unknown);
      };

      initRange.apply(scale, arguments);

      return scale;
    }

    function band() {
      var scale = ordinal().unknown(undefined),
          domain = scale.domain,
          ordinalRange = scale.range,
          r0 = 0,
          r1 = 1,
          step,
          bandwidth,
          round = false,
          paddingInner = 0,
          paddingOuter = 0,
          align = 0.5;

      delete scale.unknown;

      function rescale() {
        var n = domain().length,
            reverse = r1 < r0,
            start = reverse ? r1 : r0,
            stop = reverse ? r0 : r1;
        step = (stop - start) / Math.max(1, n - paddingInner + paddingOuter * 2);
        if (round) step = Math.floor(step);
        start += (stop - start - step * (n - paddingInner)) * align;
        bandwidth = step * (1 - paddingInner);
        if (round) start = Math.round(start), bandwidth = Math.round(bandwidth);
        var values = sequence(n).map(function(i) { return start + step * i; });
        return ordinalRange(reverse ? values.reverse() : values);
      }

      scale.domain = function(_) {
        return arguments.length ? (domain(_), rescale()) : domain();
      };

      scale.range = function(_) {
        return arguments.length ? ([r0, r1] = _, r0 = +r0, r1 = +r1, rescale()) : [r0, r1];
      };

      scale.rangeRound = function(_) {
        return [r0, r1] = _, r0 = +r0, r1 = +r1, round = true, rescale();
      };

      scale.bandwidth = function() {
        return bandwidth;
      };

      scale.step = function() {
        return step;
      };

      scale.round = function(_) {
        return arguments.length ? (round = !!_, rescale()) : round;
      };

      scale.padding = function(_) {
        return arguments.length ? (paddingInner = Math.min(1, paddingOuter = +_), rescale()) : paddingInner;
      };

      scale.paddingInner = function(_) {
        return arguments.length ? (paddingInner = Math.min(1, _), rescale()) : paddingInner;
      };

      scale.paddingOuter = function(_) {
        return arguments.length ? (paddingOuter = +_, rescale()) : paddingOuter;
      };

      scale.align = function(_) {
        return arguments.length ? (align = Math.max(0, Math.min(1, _)), rescale()) : align;
      };

      scale.copy = function() {
        return band(domain(), [r0, r1])
            .round(round)
            .paddingInner(paddingInner)
            .paddingOuter(paddingOuter)
            .align(align);
      };

      return initRange.apply(rescale(), arguments);
    }

    function define(constructor, factory, prototype) {
      constructor.prototype = factory.prototype = prototype;
      prototype.constructor = constructor;
    }

    function extend(parent, definition) {
      var prototype = Object.create(parent.prototype);
      for (var key in definition) prototype[key] = definition[key];
      return prototype;
    }

    function Color() {}

    var darker = 0.7;
    var brighter = 1 / darker;

    var reI = "\\s*([+-]?\\d+)\\s*",
        reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
        reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
        reHex = /^#([0-9a-f]{3,8})$/,
        reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
        reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
        reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
        reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
        reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
        reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

    var named = {
      aliceblue: 0xf0f8ff,
      antiquewhite: 0xfaebd7,
      aqua: 0x00ffff,
      aquamarine: 0x7fffd4,
      azure: 0xf0ffff,
      beige: 0xf5f5dc,
      bisque: 0xffe4c4,
      black: 0x000000,
      blanchedalmond: 0xffebcd,
      blue: 0x0000ff,
      blueviolet: 0x8a2be2,
      brown: 0xa52a2a,
      burlywood: 0xdeb887,
      cadetblue: 0x5f9ea0,
      chartreuse: 0x7fff00,
      chocolate: 0xd2691e,
      coral: 0xff7f50,
      cornflowerblue: 0x6495ed,
      cornsilk: 0xfff8dc,
      crimson: 0xdc143c,
      cyan: 0x00ffff,
      darkblue: 0x00008b,
      darkcyan: 0x008b8b,
      darkgoldenrod: 0xb8860b,
      darkgray: 0xa9a9a9,
      darkgreen: 0x006400,
      darkgrey: 0xa9a9a9,
      darkkhaki: 0xbdb76b,
      darkmagenta: 0x8b008b,
      darkolivegreen: 0x556b2f,
      darkorange: 0xff8c00,
      darkorchid: 0x9932cc,
      darkred: 0x8b0000,
      darksalmon: 0xe9967a,
      darkseagreen: 0x8fbc8f,
      darkslateblue: 0x483d8b,
      darkslategray: 0x2f4f4f,
      darkslategrey: 0x2f4f4f,
      darkturquoise: 0x00ced1,
      darkviolet: 0x9400d3,
      deeppink: 0xff1493,
      deepskyblue: 0x00bfff,
      dimgray: 0x696969,
      dimgrey: 0x696969,
      dodgerblue: 0x1e90ff,
      firebrick: 0xb22222,
      floralwhite: 0xfffaf0,
      forestgreen: 0x228b22,
      fuchsia: 0xff00ff,
      gainsboro: 0xdcdcdc,
      ghostwhite: 0xf8f8ff,
      gold: 0xffd700,
      goldenrod: 0xdaa520,
      gray: 0x808080,
      green: 0x008000,
      greenyellow: 0xadff2f,
      grey: 0x808080,
      honeydew: 0xf0fff0,
      hotpink: 0xff69b4,
      indianred: 0xcd5c5c,
      indigo: 0x4b0082,
      ivory: 0xfffff0,
      khaki: 0xf0e68c,
      lavender: 0xe6e6fa,
      lavenderblush: 0xfff0f5,
      lawngreen: 0x7cfc00,
      lemonchiffon: 0xfffacd,
      lightblue: 0xadd8e6,
      lightcoral: 0xf08080,
      lightcyan: 0xe0ffff,
      lightgoldenrodyellow: 0xfafad2,
      lightgray: 0xd3d3d3,
      lightgreen: 0x90ee90,
      lightgrey: 0xd3d3d3,
      lightpink: 0xffb6c1,
      lightsalmon: 0xffa07a,
      lightseagreen: 0x20b2aa,
      lightskyblue: 0x87cefa,
      lightslategray: 0x778899,
      lightslategrey: 0x778899,
      lightsteelblue: 0xb0c4de,
      lightyellow: 0xffffe0,
      lime: 0x00ff00,
      limegreen: 0x32cd32,
      linen: 0xfaf0e6,
      magenta: 0xff00ff,
      maroon: 0x800000,
      mediumaquamarine: 0x66cdaa,
      mediumblue: 0x0000cd,
      mediumorchid: 0xba55d3,
      mediumpurple: 0x9370db,
      mediumseagreen: 0x3cb371,
      mediumslateblue: 0x7b68ee,
      mediumspringgreen: 0x00fa9a,
      mediumturquoise: 0x48d1cc,
      mediumvioletred: 0xc71585,
      midnightblue: 0x191970,
      mintcream: 0xf5fffa,
      mistyrose: 0xffe4e1,
      moccasin: 0xffe4b5,
      navajowhite: 0xffdead,
      navy: 0x000080,
      oldlace: 0xfdf5e6,
      olive: 0x808000,
      olivedrab: 0x6b8e23,
      orange: 0xffa500,
      orangered: 0xff4500,
      orchid: 0xda70d6,
      palegoldenrod: 0xeee8aa,
      palegreen: 0x98fb98,
      paleturquoise: 0xafeeee,
      palevioletred: 0xdb7093,
      papayawhip: 0xffefd5,
      peachpuff: 0xffdab9,
      peru: 0xcd853f,
      pink: 0xffc0cb,
      plum: 0xdda0dd,
      powderblue: 0xb0e0e6,
      purple: 0x800080,
      rebeccapurple: 0x663399,
      red: 0xff0000,
      rosybrown: 0xbc8f8f,
      royalblue: 0x4169e1,
      saddlebrown: 0x8b4513,
      salmon: 0xfa8072,
      sandybrown: 0xf4a460,
      seagreen: 0x2e8b57,
      seashell: 0xfff5ee,
      sienna: 0xa0522d,
      silver: 0xc0c0c0,
      skyblue: 0x87ceeb,
      slateblue: 0x6a5acd,
      slategray: 0x708090,
      slategrey: 0x708090,
      snow: 0xfffafa,
      springgreen: 0x00ff7f,
      steelblue: 0x4682b4,
      tan: 0xd2b48c,
      teal: 0x008080,
      thistle: 0xd8bfd8,
      tomato: 0xff6347,
      turquoise: 0x40e0d0,
      violet: 0xee82ee,
      wheat: 0xf5deb3,
      white: 0xffffff,
      whitesmoke: 0xf5f5f5,
      yellow: 0xffff00,
      yellowgreen: 0x9acd32
    };

    define(Color, color, {
      copy: function(channels) {
        return Object.assign(new this.constructor, this, channels);
      },
      displayable: function() {
        return this.rgb().displayable();
      },
      hex: color_formatHex, // Deprecated! Use color.formatHex.
      formatHex: color_formatHex,
      formatHsl: color_formatHsl,
      formatRgb: color_formatRgb,
      toString: color_formatRgb
    });

    function color_formatHex() {
      return this.rgb().formatHex();
    }

    function color_formatHsl() {
      return hslConvert(this).formatHsl();
    }

    function color_formatRgb() {
      return this.rgb().formatRgb();
    }

    function color(format) {
      var m, l;
      format = (format + "").trim().toLowerCase();
      return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
          : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
          : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
          : l === 4 ? rgba((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
          : null) // invalid hex
          : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
          : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
          : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
          : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
          : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
          : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
          : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
          : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
          : null;
    }

    function rgbn(n) {
      return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
    }

    function rgba(r, g, b, a) {
      if (a <= 0) r = g = b = NaN;
      return new Rgb(r, g, b, a);
    }

    function rgbConvert(o) {
      if (!(o instanceof Color)) o = color(o);
      if (!o) return new Rgb;
      o = o.rgb();
      return new Rgb(o.r, o.g, o.b, o.opacity);
    }

    function rgb$1(r, g, b, opacity) {
      return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
    }

    function Rgb(r, g, b, opacity) {
      this.r = +r;
      this.g = +g;
      this.b = +b;
      this.opacity = +opacity;
    }

    define(Rgb, rgb$1, extend(Color, {
      brighter: function(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      darker: function(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      rgb: function() {
        return this;
      },
      displayable: function() {
        return (-0.5 <= this.r && this.r < 255.5)
            && (-0.5 <= this.g && this.g < 255.5)
            && (-0.5 <= this.b && this.b < 255.5)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      hex: rgb_formatHex, // Deprecated! Use color.formatHex.
      formatHex: rgb_formatHex,
      formatRgb: rgb_formatRgb,
      toString: rgb_formatRgb
    }));

    function rgb_formatHex() {
      return "#" + hex(this.r) + hex(this.g) + hex(this.b);
    }

    function rgb_formatRgb() {
      var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
      return (a === 1 ? "rgb(" : "rgba(")
          + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.b) || 0))
          + (a === 1 ? ")" : ", " + a + ")");
    }

    function hex(value) {
      value = Math.max(0, Math.min(255, Math.round(value) || 0));
      return (value < 16 ? "0" : "") + value.toString(16);
    }

    function hsla(h, s, l, a) {
      if (a <= 0) h = s = l = NaN;
      else if (l <= 0 || l >= 1) h = s = NaN;
      else if (s <= 0) h = NaN;
      return new Hsl(h, s, l, a);
    }

    function hslConvert(o) {
      if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
      if (!(o instanceof Color)) o = color(o);
      if (!o) return new Hsl;
      if (o instanceof Hsl) return o;
      o = o.rgb();
      var r = o.r / 255,
          g = o.g / 255,
          b = o.b / 255,
          min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          h = NaN,
          s = max - min,
          l = (max + min) / 2;
      if (s) {
        if (r === max) h = (g - b) / s + (g < b) * 6;
        else if (g === max) h = (b - r) / s + 2;
        else h = (r - g) / s + 4;
        s /= l < 0.5 ? max + min : 2 - max - min;
        h *= 60;
      } else {
        s = l > 0 && l < 1 ? 0 : h;
      }
      return new Hsl(h, s, l, o.opacity);
    }

    function hsl(h, s, l, opacity) {
      return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
    }

    function Hsl(h, s, l, opacity) {
      this.h = +h;
      this.s = +s;
      this.l = +l;
      this.opacity = +opacity;
    }

    define(Hsl, hsl, extend(Color, {
      brighter: function(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      darker: function(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      rgb: function() {
        var h = this.h % 360 + (this.h < 0) * 360,
            s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
            l = this.l,
            m2 = l + (l < 0.5 ? l : 1 - l) * s,
            m1 = 2 * l - m2;
        return new Rgb(
          hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
          hsl2rgb(h, m1, m2),
          hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
          this.opacity
        );
      },
      displayable: function() {
        return (0 <= this.s && this.s <= 1 || isNaN(this.s))
            && (0 <= this.l && this.l <= 1)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      formatHsl: function() {
        var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
        return (a === 1 ? "hsl(" : "hsla(")
            + (this.h || 0) + ", "
            + (this.s || 0) * 100 + "%, "
            + (this.l || 0) * 100 + "%"
            + (a === 1 ? ")" : ", " + a + ")");
      }
    }));

    /* From FvD 13.37, CSS Color Module Level 3 */
    function hsl2rgb(h, m1, m2) {
      return (h < 60 ? m1 + (m2 - m1) * h / 60
          : h < 180 ? m2
          : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
          : m1) * 255;
    }

    var constant = x => () => x;

    function linear$1(a, d) {
      return function(t) {
        return a + t * d;
      };
    }

    function exponential(a, b, y) {
      return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
        return Math.pow(a + t * b, y);
      };
    }

    function gamma(y) {
      return (y = +y) === 1 ? nogamma : function(a, b) {
        return b - a ? exponential(a, b, y) : constant(isNaN(a) ? b : a);
      };
    }

    function nogamma(a, b) {
      var d = b - a;
      return d ? linear$1(a, d) : constant(isNaN(a) ? b : a);
    }

    var rgb = (function rgbGamma(y) {
      var color = gamma(y);

      function rgb(start, end) {
        var r = color((start = rgb$1(start)).r, (end = rgb$1(end)).r),
            g = color(start.g, end.g),
            b = color(start.b, end.b),
            opacity = nogamma(start.opacity, end.opacity);
        return function(t) {
          start.r = r(t);
          start.g = g(t);
          start.b = b(t);
          start.opacity = opacity(t);
          return start + "";
        };
      }

      rgb.gamma = rgbGamma;

      return rgb;
    })(1);

    function numberArray(a, b) {
      if (!b) b = [];
      var n = a ? Math.min(b.length, a.length) : 0,
          c = b.slice(),
          i;
      return function(t) {
        for (i = 0; i < n; ++i) c[i] = a[i] * (1 - t) + b[i] * t;
        return c;
      };
    }

    function isNumberArray(x) {
      return ArrayBuffer.isView(x) && !(x instanceof DataView);
    }

    function genericArray(a, b) {
      var nb = b ? b.length : 0,
          na = a ? Math.min(nb, a.length) : 0,
          x = new Array(na),
          c = new Array(nb),
          i;

      for (i = 0; i < na; ++i) x[i] = interpolate(a[i], b[i]);
      for (; i < nb; ++i) c[i] = b[i];

      return function(t) {
        for (i = 0; i < na; ++i) c[i] = x[i](t);
        return c;
      };
    }

    function date(a, b) {
      var d = new Date;
      return a = +a, b = +b, function(t) {
        return d.setTime(a * (1 - t) + b * t), d;
      };
    }

    function interpolateNumber(a, b) {
      return a = +a, b = +b, function(t) {
        return a * (1 - t) + b * t;
      };
    }

    function object(a, b) {
      var i = {},
          c = {},
          k;

      if (a === null || typeof a !== "object") a = {};
      if (b === null || typeof b !== "object") b = {};

      for (k in b) {
        if (k in a) {
          i[k] = interpolate(a[k], b[k]);
        } else {
          c[k] = b[k];
        }
      }

      return function(t) {
        for (k in i) c[k] = i[k](t);
        return c;
      };
    }

    var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
        reB = new RegExp(reA.source, "g");

    function zero(b) {
      return function() {
        return b;
      };
    }

    function one(b) {
      return function(t) {
        return b(t) + "";
      };
    }

    function string(a, b) {
      var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
          am, // current match in a
          bm, // current match in b
          bs, // string preceding current number in b, if any
          i = -1, // index in s
          s = [], // string constants and placeholders
          q = []; // number interpolators

      // Coerce inputs to strings.
      a = a + "", b = b + "";

      // Interpolate pairs of numbers in a & b.
      while ((am = reA.exec(a))
          && (bm = reB.exec(b))) {
        if ((bs = bm.index) > bi) { // a string precedes the next number in b
          bs = b.slice(bi, bs);
          if (s[i]) s[i] += bs; // coalesce with previous string
          else s[++i] = bs;
        }
        if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
          if (s[i]) s[i] += bm; // coalesce with previous string
          else s[++i] = bm;
        } else { // interpolate non-matching numbers
          s[++i] = null;
          q.push({i: i, x: interpolateNumber(am, bm)});
        }
        bi = reB.lastIndex;
      }

      // Add remains of b.
      if (bi < b.length) {
        bs = b.slice(bi);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }

      // Special optimization for only a single match.
      // Otherwise, interpolate each of the numbers and rejoin the string.
      return s.length < 2 ? (q[0]
          ? one(q[0].x)
          : zero(b))
          : (b = q.length, function(t) {
              for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
              return s.join("");
            });
    }

    function interpolate(a, b) {
      var t = typeof b, c;
      return b == null || t === "boolean" ? constant(b)
          : (t === "number" ? interpolateNumber
          : t === "string" ? ((c = color(b)) ? (b = c, rgb) : string)
          : b instanceof color ? rgb
          : b instanceof Date ? date
          : isNumberArray(b) ? numberArray
          : Array.isArray(b) ? genericArray
          : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object
          : interpolateNumber)(a, b);
    }

    function interpolateRound(a, b) {
      return a = +a, b = +b, function(t) {
        return Math.round(a * (1 - t) + b * t);
      };
    }

    function constants(x) {
      return function() {
        return x;
      };
    }

    function number(x) {
      return +x;
    }

    var unit = [0, 1];

    function identity$1(x) {
      return x;
    }

    function normalize(a, b) {
      return (b -= (a = +a))
          ? function(x) { return (x - a) / b; }
          : constants(isNaN(b) ? NaN : 0.5);
    }

    function clamper(a, b) {
      var t;
      if (a > b) t = a, a = b, b = t;
      return function(x) { return Math.max(a, Math.min(b, x)); };
    }

    // normalize(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
    // interpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding range value x in [a,b].
    function bimap(domain, range, interpolate) {
      var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
      if (d1 < d0) d0 = normalize(d1, d0), r0 = interpolate(r1, r0);
      else d0 = normalize(d0, d1), r0 = interpolate(r0, r1);
      return function(x) { return r0(d0(x)); };
    }

    function polymap(domain, range, interpolate) {
      var j = Math.min(domain.length, range.length) - 1,
          d = new Array(j),
          r = new Array(j),
          i = -1;

      // Reverse descending domains.
      if (domain[j] < domain[0]) {
        domain = domain.slice().reverse();
        range = range.slice().reverse();
      }

      while (++i < j) {
        d[i] = normalize(domain[i], domain[i + 1]);
        r[i] = interpolate(range[i], range[i + 1]);
      }

      return function(x) {
        var i = bisect(domain, x, 1, j) - 1;
        return r[i](d[i](x));
      };
    }

    function copy(source, target) {
      return target
          .domain(source.domain())
          .range(source.range())
          .interpolate(source.interpolate())
          .clamp(source.clamp())
          .unknown(source.unknown());
    }

    function transformer() {
      var domain = unit,
          range = unit,
          interpolate$1 = interpolate,
          transform,
          untransform,
          unknown,
          clamp = identity$1,
          piecewise,
          output,
          input;

      function rescale() {
        var n = Math.min(domain.length, range.length);
        if (clamp !== identity$1) clamp = clamper(domain[0], domain[n - 1]);
        piecewise = n > 2 ? polymap : bimap;
        output = input = null;
        return scale;
      }

      function scale(x) {
        return x == null || isNaN(x = +x) ? unknown : (output || (output = piecewise(domain.map(transform), range, interpolate$1)))(transform(clamp(x)));
      }

      scale.invert = function(y) {
        return clamp(untransform((input || (input = piecewise(range, domain.map(transform), interpolateNumber)))(y)));
      };

      scale.domain = function(_) {
        return arguments.length ? (domain = Array.from(_, number), rescale()) : domain.slice();
      };

      scale.range = function(_) {
        return arguments.length ? (range = Array.from(_), rescale()) : range.slice();
      };

      scale.rangeRound = function(_) {
        return range = Array.from(_), interpolate$1 = interpolateRound, rescale();
      };

      scale.clamp = function(_) {
        return arguments.length ? (clamp = _ ? true : identity$1, rescale()) : clamp !== identity$1;
      };

      scale.interpolate = function(_) {
        return arguments.length ? (interpolate$1 = _, rescale()) : interpolate$1;
      };

      scale.unknown = function(_) {
        return arguments.length ? (unknown = _, scale) : unknown;
      };

      return function(t, u) {
        transform = t, untransform = u;
        return rescale();
      };
    }

    function continuous() {
      return transformer()(identity$1, identity$1);
    }

    function formatDecimal(x) {
      return Math.abs(x = Math.round(x)) >= 1e21
          ? x.toLocaleString("en").replace(/,/g, "")
          : x.toString(10);
    }

    // Computes the decimal coefficient and exponent of the specified number x with
    // significant digits p, where x is positive and p is in [1, 21] or undefined.
    // For example, formatDecimalParts(1.23) returns ["123", 0].
    function formatDecimalParts(x, p) {
      if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
      var i, coefficient = x.slice(0, i);

      // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
      // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
      return [
        coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
        +x.slice(i + 1)
      ];
    }

    function exponent(x) {
      return x = formatDecimalParts(Math.abs(x)), x ? x[1] : NaN;
    }

    function formatGroup(grouping, thousands) {
      return function(value, width) {
        var i = value.length,
            t = [],
            j = 0,
            g = grouping[0],
            length = 0;

        while (i > 0 && g > 0) {
          if (length + g + 1 > width) g = Math.max(1, width - length);
          t.push(value.substring(i -= g, i + g));
          if ((length += g + 1) > width) break;
          g = grouping[j = (j + 1) % grouping.length];
        }

        return t.reverse().join(thousands);
      };
    }

    function formatNumerals(numerals) {
      return function(value) {
        return value.replace(/[0-9]/g, function(i) {
          return numerals[+i];
        });
      };
    }

    // [[fill]align][sign][symbol][0][width][,][.precision][~][type]
    var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

    function formatSpecifier(specifier) {
      if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
      var match;
      return new FormatSpecifier({
        fill: match[1],
        align: match[2],
        sign: match[3],
        symbol: match[4],
        zero: match[5],
        width: match[6],
        comma: match[7],
        precision: match[8] && match[8].slice(1),
        trim: match[9],
        type: match[10]
      });
    }

    formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

    function FormatSpecifier(specifier) {
      this.fill = specifier.fill === undefined ? " " : specifier.fill + "";
      this.align = specifier.align === undefined ? ">" : specifier.align + "";
      this.sign = specifier.sign === undefined ? "-" : specifier.sign + "";
      this.symbol = specifier.symbol === undefined ? "" : specifier.symbol + "";
      this.zero = !!specifier.zero;
      this.width = specifier.width === undefined ? undefined : +specifier.width;
      this.comma = !!specifier.comma;
      this.precision = specifier.precision === undefined ? undefined : +specifier.precision;
      this.trim = !!specifier.trim;
      this.type = specifier.type === undefined ? "" : specifier.type + "";
    }

    FormatSpecifier.prototype.toString = function() {
      return this.fill
          + this.align
          + this.sign
          + this.symbol
          + (this.zero ? "0" : "")
          + (this.width === undefined ? "" : Math.max(1, this.width | 0))
          + (this.comma ? "," : "")
          + (this.precision === undefined ? "" : "." + Math.max(0, this.precision | 0))
          + (this.trim ? "~" : "")
          + this.type;
    };

    // Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
    function formatTrim(s) {
      out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
        switch (s[i]) {
          case ".": i0 = i1 = i; break;
          case "0": if (i0 === 0) i0 = i; i1 = i; break;
          default: if (!+s[i]) break out; if (i0 > 0) i0 = 0; break;
        }
      }
      return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
    }

    var prefixExponent;

    function formatPrefixAuto(x, p) {
      var d = formatDecimalParts(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1],
          i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
          n = coefficient.length;
      return i === n ? coefficient
          : i > n ? coefficient + new Array(i - n + 1).join("0")
          : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
          : "0." + new Array(1 - i).join("0") + formatDecimalParts(x, Math.max(0, p + i - 1))[0]; // less than 1y!
    }

    function formatRounded(x, p) {
      var d = formatDecimalParts(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1];
      return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
          : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
          : coefficient + new Array(exponent - coefficient.length + 2).join("0");
    }

    var formatTypes = {
      "%": (x, p) => (x * 100).toFixed(p),
      "b": (x) => Math.round(x).toString(2),
      "c": (x) => x + "",
      "d": formatDecimal,
      "e": (x, p) => x.toExponential(p),
      "f": (x, p) => x.toFixed(p),
      "g": (x, p) => x.toPrecision(p),
      "o": (x) => Math.round(x).toString(8),
      "p": (x, p) => formatRounded(x * 100, p),
      "r": formatRounded,
      "s": formatPrefixAuto,
      "X": (x) => Math.round(x).toString(16).toUpperCase(),
      "x": (x) => Math.round(x).toString(16)
    };

    function identity(x) {
      return x;
    }

    var map = Array.prototype.map,
        prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

    function formatLocale(locale) {
      var group = locale.grouping === undefined || locale.thousands === undefined ? identity : formatGroup(map.call(locale.grouping, Number), locale.thousands + ""),
          currencyPrefix = locale.currency === undefined ? "" : locale.currency[0] + "",
          currencySuffix = locale.currency === undefined ? "" : locale.currency[1] + "",
          decimal = locale.decimal === undefined ? "." : locale.decimal + "",
          numerals = locale.numerals === undefined ? identity : formatNumerals(map.call(locale.numerals, String)),
          percent = locale.percent === undefined ? "%" : locale.percent + "",
          minus = locale.minus === undefined ? "−" : locale.minus + "",
          nan = locale.nan === undefined ? "NaN" : locale.nan + "";

      function newFormat(specifier) {
        specifier = formatSpecifier(specifier);

        var fill = specifier.fill,
            align = specifier.align,
            sign = specifier.sign,
            symbol = specifier.symbol,
            zero = specifier.zero,
            width = specifier.width,
            comma = specifier.comma,
            precision = specifier.precision,
            trim = specifier.trim,
            type = specifier.type;

        // The "n" type is an alias for ",g".
        if (type === "n") comma = true, type = "g";

        // The "" type, and any invalid type, is an alias for ".12~g".
        else if (!formatTypes[type]) precision === undefined && (precision = 12), trim = true, type = "g";

        // If zero fill is specified, padding goes after sign and before digits.
        if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

        // Compute the prefix and suffix.
        // For SI-prefix, the suffix is lazily computed.
        var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
            suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : "";

        // What format function should we use?
        // Is this an integer type?
        // Can this type generate exponential notation?
        var formatType = formatTypes[type],
            maybeSuffix = /[defgprs%]/.test(type);

        // Set the default precision if not specified,
        // or clamp the specified precision to the supported range.
        // For significant precision, it must be in [1, 21].
        // For fixed precision, it must be in [0, 20].
        precision = precision === undefined ? 6
            : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
            : Math.max(0, Math.min(20, precision));

        function format(value) {
          var valuePrefix = prefix,
              valueSuffix = suffix,
              i, n, c;

          if (type === "c") {
            valueSuffix = formatType(value) + valueSuffix;
            value = "";
          } else {
            value = +value;

            // Determine the sign. -0 is not less than 0, but 1 / -0 is!
            var valueNegative = value < 0 || 1 / value < 0;

            // Perform the initial formatting.
            value = isNaN(value) ? nan : formatType(Math.abs(value), precision);

            // Trim insignificant zeros.
            if (trim) value = formatTrim(value);

            // If a negative value rounds to zero after formatting, and no explicit positive sign is requested, hide the sign.
            if (valueNegative && +value === 0 && sign !== "+") valueNegative = false;

            // Compute the prefix and suffix.
            valuePrefix = (valueNegative ? (sign === "(" ? sign : minus) : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
            valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");

            // Break the formatted value into the integer “value” part that can be
            // grouped, and fractional or exponential “suffix” part that is not.
            if (maybeSuffix) {
              i = -1, n = value.length;
              while (++i < n) {
                if (c = value.charCodeAt(i), 48 > c || c > 57) {
                  valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                  value = value.slice(0, i);
                  break;
                }
              }
            }
          }

          // If the fill character is not "0", grouping is applied before padding.
          if (comma && !zero) value = group(value, Infinity);

          // Compute the padding.
          var length = valuePrefix.length + value.length + valueSuffix.length,
              padding = length < width ? new Array(width - length + 1).join(fill) : "";

          // If the fill character is "0", grouping is applied after padding.
          if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

          // Reconstruct the final output based on the desired alignment.
          switch (align) {
            case "<": value = valuePrefix + value + valueSuffix + padding; break;
            case "=": value = valuePrefix + padding + value + valueSuffix; break;
            case "^": value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length); break;
            default: value = padding + valuePrefix + value + valueSuffix; break;
          }

          return numerals(value);
        }

        format.toString = function() {
          return specifier + "";
        };

        return format;
      }

      function formatPrefix(specifier, value) {
        var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
            e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
            k = Math.pow(10, -e),
            prefix = prefixes[8 + e / 3];
        return function(value) {
          return f(k * value) + prefix;
        };
      }

      return {
        format: newFormat,
        formatPrefix: formatPrefix
      };
    }

    var locale;
    var format;
    var formatPrefix;

    defaultLocale({
      thousands: ",",
      grouping: [3],
      currency: ["$", ""]
    });

    function defaultLocale(definition) {
      locale = formatLocale(definition);
      format = locale.format;
      formatPrefix = locale.formatPrefix;
      return locale;
    }

    function precisionFixed(step) {
      return Math.max(0, -exponent(Math.abs(step)));
    }

    function precisionPrefix(step, value) {
      return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
    }

    function precisionRound(step, max) {
      step = Math.abs(step), max = Math.abs(max) - step;
      return Math.max(0, exponent(max) - exponent(step)) + 1;
    }

    function tickFormat(start, stop, count, specifier) {
      var step = tickStep(start, stop, count),
          precision;
      specifier = formatSpecifier(specifier == null ? ",f" : specifier);
      switch (specifier.type) {
        case "s": {
          var value = Math.max(Math.abs(start), Math.abs(stop));
          if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
          return formatPrefix(specifier, value);
        }
        case "":
        case "e":
        case "g":
        case "p":
        case "r": {
          if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
          break;
        }
        case "f":
        case "%": {
          if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
          break;
        }
      }
      return format(specifier);
    }

    function linearish(scale) {
      var domain = scale.domain;

      scale.ticks = function(count) {
        var d = domain();
        return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
      };

      scale.tickFormat = function(count, specifier) {
        var d = domain();
        return tickFormat(d[0], d[d.length - 1], count == null ? 10 : count, specifier);
      };

      scale.nice = function(count) {
        if (count == null) count = 10;

        var d = domain();
        var i0 = 0;
        var i1 = d.length - 1;
        var start = d[i0];
        var stop = d[i1];
        var prestep;
        var step;
        var maxIter = 10;

        if (stop < start) {
          step = start, start = stop, stop = step;
          step = i0, i0 = i1, i1 = step;
        }
        
        while (maxIter-- > 0) {
          step = tickIncrement(start, stop, count);
          if (step === prestep) {
            d[i0] = start;
            d[i1] = stop;
            return domain(d);
          } else if (step > 0) {
            start = Math.floor(start / step) * step;
            stop = Math.ceil(stop / step) * step;
          } else if (step < 0) {
            start = Math.ceil(start * step) / step;
            stop = Math.floor(stop * step) / step;
          } else {
            break;
          }
          prestep = step;
        }

        return scale;
      };

      return scale;
    }

    function linear() {
      var scale = continuous();

      scale.copy = function() {
        return copy(scale, linear());
      };

      initRange.apply(scale, arguments);

      return linearish(scale);
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const margin = writable({ top: 5, bottom: 30, left: 5, right: 5 });

    /* src/Components/StackedRects.svelte generated by Svelte v3.48.0 */
    const file$8 = "src/Components/StackedRects.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	child_ctx[19] = i;
    	return child_ctx;
    }

    // (38:2) {#each data as d, i}
    function create_each_block_1$1(ctx) {
    	let rect;
    	let rect_x_value;
    	let rect_y_value;
    	let rect_fill_value;

    	const block = {
    		c: function create() {
    			rect = svg_element("rect");
    			attr_dev(rect, "x", rect_x_value = /*d*/ ctx[17] % /*numCol*/ ctx[0] * /*radiusGap*/ ctx[7]);
    			attr_dev(rect, "y", rect_y_value = /*rectYScale*/ ctx[6](Math.floor(/*d*/ ctx[17] / /*numCol*/ ctx[0])));
    			attr_dev(rect, "width", /*radius*/ ctx[5]);
    			attr_dev(rect, "height", /*radius*/ ctx[5]);
    			attr_dev(rect, "fill", rect_fill_value = /*fillRule*/ ctx[3](/*i*/ ctx[19]));
    			add_location(rect, file$8, 38, 4, 899);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, rect, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*numCol, radiusGap*/ 129 && rect_x_value !== (rect_x_value = /*d*/ ctx[17] % /*numCol*/ ctx[0] * /*radiusGap*/ ctx[7])) {
    				attr_dev(rect, "x", rect_x_value);
    			}

    			if (dirty & /*rectYScale, numCol*/ 65 && rect_y_value !== (rect_y_value = /*rectYScale*/ ctx[6](Math.floor(/*d*/ ctx[17] / /*numCol*/ ctx[0])))) {
    				attr_dev(rect, "y", rect_y_value);
    			}

    			if (dirty & /*radius*/ 32) {
    				attr_dev(rect, "width", /*radius*/ ctx[5]);
    			}

    			if (dirty & /*radius*/ 32) {
    				attr_dev(rect, "height", /*radius*/ ctx[5]);
    			}

    			if (dirty & /*fillRule*/ 8 && rect_fill_value !== (rect_fill_value = /*fillRule*/ ctx[3](/*i*/ ctx[19]))) {
    				attr_dev(rect, "fill", rect_fill_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(rect);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(38:2) {#each data as d, i}",
    		ctx
    	});

    	return block;
    }

    // (48:2) {#if labels}
    function create_if_block$3(ctx) {
    	let each_1_anchor;
    	let each_value = /*labels*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*rectYScale, labels, radius*/ 112) {
    				each_value = /*labels*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(48:2) {#if labels}",
    		ctx
    	});

    	return block;
    }

    // (49:4) {#each labels as label}
    function create_each_block$5(ctx) {
    	let text_1;
    	let t_value = /*label*/ ctx[14].label + "";
    	let t;
    	let text_1_y_value;
    	let text_1_dy_value;
    	let text_1_dx_value;

    	const block = {
    		c: function create() {
    			text_1 = svg_element("text");
    			t = text(t_value);
    			attr_dev(text_1, "class", "rect-text svelte-1tm3ubi");
    			attr_dev(text_1, "x", "0");
    			attr_dev(text_1, "y", text_1_y_value = /*rectYScale*/ ctx[6](/*label*/ ctx[14].y) + /*radius*/ ctx[5] * 2);
    			attr_dev(text_1, "dy", text_1_dy_value = /*label*/ ctx[14].dy);
    			attr_dev(text_1, "dx", text_1_dx_value = /*radius*/ ctx[5] * 2.5);
    			attr_dev(text_1, "text-anchor", "middle");
    			add_location(text_1, file$8, 49, 6, 1161);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, text_1, anchor);
    			append_dev(text_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*labels*/ 16 && t_value !== (t_value = /*label*/ ctx[14].label + "")) set_data_dev(t, t_value);

    			if (dirty & /*rectYScale, labels, radius*/ 112 && text_1_y_value !== (text_1_y_value = /*rectYScale*/ ctx[6](/*label*/ ctx[14].y) + /*radius*/ ctx[5] * 2)) {
    				attr_dev(text_1, "y", text_1_y_value);
    			}

    			if (dirty & /*labels*/ 16 && text_1_dy_value !== (text_1_dy_value = /*label*/ ctx[14].dy)) {
    				attr_dev(text_1, "dy", text_1_dy_value);
    			}

    			if (dirty & /*radius*/ 32 && text_1_dx_value !== (text_1_dx_value = /*radius*/ ctx[5] * 2.5)) {
    				attr_dev(text_1, "dx", text_1_dx_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(text_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(49:4) {#each labels as label}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let g;
    	let each_1_anchor;
    	let g_transform_value;
    	let each_value_1 = /*data*/ ctx[8];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	let if_block = /*labels*/ ctx[4] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			g = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			if (if_block) if_block.c();
    			attr_dev(g, "transform", g_transform_value = "translate(" + /*x*/ ctx[1] + ", " + /*y*/ ctx[2] + ")");
    			add_location(g, file$8, 36, 0, 836);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}

    			append_dev(g, each_1_anchor);
    			if (if_block) if_block.m(g, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*data, numCol, radiusGap, rectYScale, Math, radius, fillRule*/ 489) {
    				each_value_1 = /*data*/ ctx[8];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(g, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (/*labels*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(g, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*x, y*/ 6 && g_transform_value !== (g_transform_value = "translate(" + /*x*/ ctx[1] + ", " + /*y*/ ctx[2] + ")")) {
    				attr_dev(g, "transform", g_transform_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let numRow;
    	let dataDomain;
    	let rectYScale;
    	let radius;
    	let radiusGap;
    	let $margin;
    	validate_store(margin, 'margin');
    	component_subscribe($$self, margin, $$value => $$invalidate(13, $margin = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('StackedRects', slots, []);
    	let { height = 500 } = $$props;
    	let { numRects = 100 } = $$props;
    	let { numCol = 5 } = $$props;
    	let { x = 0 } = $$props;
    	let { y = 0 } = $$props;

    	let { fillRule = i => {
    		return "#232f3e";
    	} } = $$props;

    	let { labels } = $$props;

    	// consts
    	const data = [...Array(numRects).keys()];

    	const writable_props = ['height', 'numRects', 'numCol', 'x', 'y', 'fillRule', 'labels'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<StackedRects> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('height' in $$props) $$invalidate(9, height = $$props.height);
    		if ('numRects' in $$props) $$invalidate(10, numRects = $$props.numRects);
    		if ('numCol' in $$props) $$invalidate(0, numCol = $$props.numCol);
    		if ('x' in $$props) $$invalidate(1, x = $$props.x);
    		if ('y' in $$props) $$invalidate(2, y = $$props.y);
    		if ('fillRule' in $$props) $$invalidate(3, fillRule = $$props.fillRule);
    		if ('labels' in $$props) $$invalidate(4, labels = $$props.labels);
    	};

    	$$self.$capture_state = () => ({
    		scaleBand: band,
    		margin,
    		height,
    		numRects,
    		numCol,
    		x,
    		y,
    		fillRule,
    		labels,
    		data,
    		radius,
    		radiusGap,
    		rectYScale,
    		dataDomain,
    		numRow,
    		$margin
    	});

    	$$self.$inject_state = $$props => {
    		if ('height' in $$props) $$invalidate(9, height = $$props.height);
    		if ('numRects' in $$props) $$invalidate(10, numRects = $$props.numRects);
    		if ('numCol' in $$props) $$invalidate(0, numCol = $$props.numCol);
    		if ('x' in $$props) $$invalidate(1, x = $$props.x);
    		if ('y' in $$props) $$invalidate(2, y = $$props.y);
    		if ('fillRule' in $$props) $$invalidate(3, fillRule = $$props.fillRule);
    		if ('labels' in $$props) $$invalidate(4, labels = $$props.labels);
    		if ('radius' in $$props) $$invalidate(5, radius = $$props.radius);
    		if ('radiusGap' in $$props) $$invalidate(7, radiusGap = $$props.radiusGap);
    		if ('rectYScale' in $$props) $$invalidate(6, rectYScale = $$props.rectYScale);
    		if ('dataDomain' in $$props) $$invalidate(11, dataDomain = $$props.dataDomain);
    		if ('numRow' in $$props) $$invalidate(12, numRow = $$props.numRow);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*numRects, numCol*/ 1025) {
    			//   reactive vars
    			$$invalidate(12, numRow = Math.ceil(numRects / numCol));
    		}

    		if ($$self.$$.dirty & /*numRow*/ 4096) {
    			$$invalidate(11, dataDomain = [...Array(numRow).keys()]);
    		}

    		if ($$self.$$.dirty & /*dataDomain, height, $margin*/ 10752) {
    			$$invalidate(6, rectYScale = band().domain(dataDomain).range([height - $margin.top, $margin.bottom]).padding(0.1));
    		}

    		if ($$self.$$.dirty & /*rectYScale*/ 64) {
    			$$invalidate(5, radius = rectYScale.bandwidth());
    		}

    		if ($$self.$$.dirty & /*radius*/ 32) {
    			$$invalidate(7, radiusGap = radius + 2);
    		}
    	};

    	return [
    		numCol,
    		x,
    		y,
    		fillRule,
    		labels,
    		radius,
    		rectYScale,
    		radiusGap,
    		data,
    		height,
    		numRects,
    		dataDomain,
    		numRow,
    		$margin
    	];
    }

    class StackedRects extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			height: 9,
    			numRects: 10,
    			numCol: 0,
    			x: 1,
    			y: 2,
    			fillRule: 3,
    			labels: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StackedRects",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*labels*/ ctx[4] === undefined && !('labels' in props)) {
    			console.warn("<StackedRects> was created without expected prop 'labels'");
    		}
    	}

    	get height() {
    		throw new Error("<StackedRects>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<StackedRects>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get numRects() {
    		throw new Error("<StackedRects>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set numRects(value) {
    		throw new Error("<StackedRects>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get numCol() {
    		throw new Error("<StackedRects>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set numCol(value) {
    		throw new Error("<StackedRects>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x() {
    		throw new Error("<StackedRects>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<StackedRects>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<StackedRects>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<StackedRects>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fillRule() {
    		throw new Error("<StackedRects>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fillRule(value) {
    		throw new Error("<StackedRects>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labels() {
    		throw new Error("<StackedRects>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labels(value) {
    		throw new Error("<StackedRects>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Scatterplot.svelte generated by Svelte v3.48.0 */
    const file$7 = "src/Components/Scatterplot.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (30:2) {#each xScale.ticks() as tick}
    function create_each_block_1(ctx) {
    	let g;
    	let line;
    	let g_transform_value;

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			line = svg_element("line");
    			attr_dev(line, "class", "axis-line");
    			attr_dev(line, "x1", 0);
    			attr_dev(line, "x2", 0);
    			attr_dev(line, "y1", "0");
    			attr_dev(line, "y2", 10);
    			attr_dev(line, "stroke", "black");
    			attr_dev(line, "stroke-dasharray", "4");
    			add_location(line, file$7, 31, 6, 677);
    			attr_dev(g, "transform", g_transform_value = `translate(${/*xScale*/ ctx[5](/*tick*/ ctx[7])} ${/*height*/ ctx[0]})`);
    			add_location(g, file$7, 30, 4, 616);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			append_dev(g, line);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*xScale, height*/ 33 && g_transform_value !== (g_transform_value = `translate(${/*xScale*/ ctx[5](/*tick*/ ctx[7])} ${/*height*/ ctx[0]})`)) {
    				attr_dev(g, "transform", g_transform_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(30:2) {#each xScale.ticks() as tick}",
    		ctx
    	});

    	return block;
    }

    // (45:2) {#each [0, 0.2, 0.4, 0.6, 0.8, 1.0] as tick}
    function create_each_block$4(ctx) {
    	let g;
    	let line;
    	let g_transform_value;

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			line = svg_element("line");
    			attr_dev(line, "class", "y-axis-line");
    			attr_dev(line, "x1", "0");
    			attr_dev(line, "x2", 3);
    			attr_dev(line, "y1", "0");
    			attr_dev(line, "y2", "0");
    			attr_dev(line, "stroke", "black");
    			attr_dev(line, "stroke-dasharray", "4");
    			add_location(line, file$7, 47, 6, 1111);
    			attr_dev(g, "transform", g_transform_value = `translate(${0} ${/*yScale*/ ctx[4](/*tick*/ ctx[7]) + 0})`);
    			add_location(g, file$7, 45, 4, 997);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			append_dev(g, line);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*yScale*/ 16 && g_transform_value !== (g_transform_value = `translate(${0} ${/*yScale*/ ctx[4](/*tick*/ ctx[7]) + 0})`)) {
    				attr_dev(g, "transform", g_transform_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(45:2) {#each [0, 0.2, 0.4, 0.6, 0.8, 1.0] as tick}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let g;
    	let each0_anchor;
    	let line0;
    	let line0_x__value_1;
    	let line1;
    	let g_transform_value;
    	let each_value_1 = /*xScale*/ ctx[5].ticks();
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = [0, 0.2, 0.4, 0.6, 0.8, 1.0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < 6; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			g = svg_element("g");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			each0_anchor = empty();

    			for (let i = 0; i < 6; i += 1) {
    				each_blocks[i].c();
    			}

    			line0 = svg_element("line");
    			line1 = svg_element("line");
    			attr_dev(line0, "class", "axis-line");
    			attr_dev(line0, "x1", /*margin*/ ctx[6].left);
    			attr_dev(line0, "x2", line0_x__value_1 = /*width*/ ctx[1] - /*margin*/ ctx[6].right);
    			attr_dev(line0, "y1", /*height*/ ctx[0]);
    			attr_dev(line0, "y2", /*height*/ ctx[0]);
    			attr_dev(line0, "stroke", "black");
    			add_location(line0, file$7, 63, 2, 1442);
    			attr_dev(line1, "class", "axis-line");
    			attr_dev(line1, "x1", /*margin*/ ctx[6].left);
    			attr_dev(line1, "x2", /*margin*/ ctx[6].left);
    			attr_dev(line1, "y1", 0);
    			attr_dev(line1, "y2", /*height*/ ctx[0]);
    			attr_dev(line1, "stroke", "black");
    			add_location(line1, file$7, 72, 2, 1592);
    			attr_dev(g, "transform", g_transform_value = "translate(" + /*x*/ ctx[2] + ", " + /*y*/ ctx[3] + ")");
    			add_location(g, file$7, 27, 0, 524);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(g, null);
    			}

    			append_dev(g, each0_anchor);

    			for (let i = 0; i < 6; i += 1) {
    				each_blocks[i].m(g, null);
    			}

    			append_dev(g, line0);
    			append_dev(g, line1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*xScale, height*/ 33) {
    				each_value_1 = /*xScale*/ ctx[5].ticks();
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(g, each0_anchor);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*yScale*/ 16) {
    				each_value = [0, 0.2, 0.4, 0.6, 0.8, 1.0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < 6; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(g, line0);
    					}
    				}

    				for (; i < 6; i += 1) {
    					each_blocks[i].d(1);
    				}
    			}

    			if (dirty & /*width*/ 2 && line0_x__value_1 !== (line0_x__value_1 = /*width*/ ctx[1] - /*margin*/ ctx[6].right)) {
    				attr_dev(line0, "x2", line0_x__value_1);
    			}

    			if (dirty & /*height*/ 1) {
    				attr_dev(line0, "y1", /*height*/ ctx[0]);
    			}

    			if (dirty & /*height*/ 1) {
    				attr_dev(line0, "y2", /*height*/ ctx[0]);
    			}

    			if (dirty & /*height*/ 1) {
    				attr_dev(line1, "y2", /*height*/ ctx[0]);
    			}

    			if (dirty & /*x, y*/ 12 && g_transform_value !== (g_transform_value = "translate(" + /*x*/ ctx[2] + ", " + /*y*/ ctx[3] + ")")) {
    				attr_dev(g, "transform", g_transform_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let xScale;
    	let yScale;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Scatterplot', slots, []);
    	let { height = 500 } = $$props;
    	let { width } = $$props;
    	let { x = 0 } = $$props;
    	let { y = 300 } = $$props;
    	const margin = { top: 10, bottom: 10, left: 0, right: 0 };
    	const writable_props = ['height', 'width', 'x', 'y'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Scatterplot> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('height' in $$props) $$invalidate(0, height = $$props.height);
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    		if ('x' in $$props) $$invalidate(2, x = $$props.x);
    		if ('y' in $$props) $$invalidate(3, y = $$props.y);
    	};

    	$$self.$capture_state = () => ({
    		scaleLinear: linear,
    		height,
    		width,
    		x,
    		y,
    		margin,
    		yScale,
    		xScale
    	});

    	$$self.$inject_state = $$props => {
    		if ('height' in $$props) $$invalidate(0, height = $$props.height);
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    		if ('x' in $$props) $$invalidate(2, x = $$props.x);
    		if ('y' in $$props) $$invalidate(3, y = $$props.y);
    		if ('yScale' in $$props) $$invalidate(4, yScale = $$props.yScale);
    		if ('xScale' in $$props) $$invalidate(5, xScale = $$props.xScale);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*width*/ 2) {
    			//   scale
    			$$invalidate(5, xScale = linear().domain([-1, 1]).range([margin.left, width - margin.right]));
    		}

    		if ($$self.$$.dirty & /*height*/ 1) {
    			$$invalidate(4, yScale = linear().domain([0, 1]).range([height - margin.bottom, margin.top]));
    		}
    	};

    	return [height, width, x, y, yScale, xScale, margin];
    }

    class Scatterplot extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { height: 0, width: 1, x: 2, y: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Scatterplot",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*width*/ ctx[1] === undefined && !('width' in props)) {
    			console.warn("<Scatterplot> was created without expected prop 'width'");
    		}
    	}

    	get height() {
    		throw new Error("<Scatterplot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Scatterplot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Scatterplot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Scatterplot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x() {
    		throw new Error("<Scatterplot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<Scatterplot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<Scatterplot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<Scatterplot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/KFoldInteractive.svelte generated by Svelte v3.48.0 */
    const file$6 = "src/Components/KFoldInteractive.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	return child_ctx;
    }

    // (78:4) {#each [...Array(nSplits).keys()] as tick}
    function create_each_block$3(ctx) {
    	let line;
    	let line_x__value;
    	let line_x__value_1;
    	let stackedrects;
    	let scatterplot;
    	let text_1;
    	let t;
    	let text_1_x_value;
    	let text_1_y_value;
    	let current;

    	function func(...args) {
    		return /*func*/ ctx[11](/*tick*/ ctx[14], ...args);
    	}

    	stackedrects = new StackedRects({
    			props: {
    				height: /*height*/ ctx[1] / 4.5,
    				numCol: /*numCol*/ ctx[6],
    				numRects: numRects$1,
    				x: /*xScale*/ ctx[9](/*tick*/ ctx[14]) - /*xDiff*/ ctx[7],
    				y: /*yScale*/ ctx[8](-1),
    				fillRule: func
    			},
    			$$inline: true
    		});

    	scatterplot = new Scatterplot({
    			props: {
    				class: "scatterplot",
    				width: 70,
    				height: 70,
    				x: /*xScale*/ ctx[9](/*tick*/ ctx[14]) - /*xDiff*/ ctx[7] * 2,
    				y: /*yScale*/ ctx[8](1)
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			line = svg_element("line");
    			create_component(stackedrects.$$.fragment);
    			create_component(scatterplot.$$.fragment);
    			text_1 = svg_element("text");
    			t = text("MAPE: 0.6%");
    			attr_dev(line, "class", "axis-line");
    			attr_dev(line, "x1", line_x__value = /*xScale*/ ctx[9](/*tick*/ ctx[14]) - 10);
    			attr_dev(line, "x2", line_x__value_1 = /*xScale*/ ctx[9](/*tick*/ ctx[14]) - 10);
    			attr_dev(line, "y1", "0");
    			attr_dev(line, "y2", 500);
    			attr_dev(line, "stroke", "black");
    			attr_dev(line, "stroke-dasharray", "4");
    			attr_dev(line, "opacity", "0.08");
    			add_location(line, file$6, 79, 6, 2760);
    			attr_dev(text_1, "class", "fold-error-text svelte-1qiglte");
    			attr_dev(text_1, "x", text_1_x_value = /*xScale*/ ctx[9](/*tick*/ ctx[14]) - /*xDiff*/ ctx[7] * 2);
    			attr_dev(text_1, "y", text_1_y_value = /*yScale*/ ctx[8](3));
    			add_location(text_1, file$6, 119, 6, 3770);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    			mount_component(stackedrects, target, anchor);
    			mount_component(scatterplot, target, anchor);
    			insert_dev(target, text_1, anchor);
    			append_dev(text_1, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (!current || dirty & /*xScale, nSplits*/ 528 && line_x__value !== (line_x__value = /*xScale*/ ctx[9](/*tick*/ ctx[14]) - 10)) {
    				attr_dev(line, "x1", line_x__value);
    			}

    			if (!current || dirty & /*xScale, nSplits*/ 528 && line_x__value_1 !== (line_x__value_1 = /*xScale*/ ctx[9](/*tick*/ ctx[14]) - 10)) {
    				attr_dev(line, "x2", line_x__value_1);
    			}

    			const stackedrects_changes = {};
    			if (dirty & /*height*/ 2) stackedrects_changes.height = /*height*/ ctx[1] / 4.5;
    			if (dirty & /*numCol*/ 64) stackedrects_changes.numCol = /*numCol*/ ctx[6];
    			if (dirty & /*xScale, nSplits, xDiff*/ 656) stackedrects_changes.x = /*xScale*/ ctx[9](/*tick*/ ctx[14]) - /*xDiff*/ ctx[7];
    			if (dirty & /*yScale*/ 256) stackedrects_changes.y = /*yScale*/ ctx[8](-1);
    			if (dirty & /*numTest, numValidation, nSplits*/ 28) stackedrects_changes.fillRule = func;
    			stackedrects.$set(stackedrects_changes);
    			const scatterplot_changes = {};
    			if (dirty & /*xScale, nSplits, xDiff*/ 656) scatterplot_changes.x = /*xScale*/ ctx[9](/*tick*/ ctx[14]) - /*xDiff*/ ctx[7] * 2;
    			if (dirty & /*yScale*/ 256) scatterplot_changes.y = /*yScale*/ ctx[8](1);
    			scatterplot.$set(scatterplot_changes);

    			if (!current || dirty & /*xScale, nSplits, xDiff*/ 656 && text_1_x_value !== (text_1_x_value = /*xScale*/ ctx[9](/*tick*/ ctx[14]) - /*xDiff*/ ctx[7] * 2)) {
    				attr_dev(text_1, "x", text_1_x_value);
    			}

    			if (!current || dirty & /*yScale*/ 256 && text_1_y_value !== (text_1_y_value = /*yScale*/ ctx[8](3))) {
    				attr_dev(text_1, "y", text_1_y_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stackedrects.$$.fragment, local);
    			transition_in(scatterplot.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stackedrects.$$.fragment, local);
    			transition_out(scatterplot.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    			destroy_component(stackedrects, detaching);
    			destroy_component(scatterplot, detaching);
    			if (detaching) detach_dev(text_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(78:4) {#each [...Array(nSplits).keys()] as tick}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let h1;
    	let span;
    	let t1;
    	let t2;
    	let p0;
    	let t4;
    	let br0;
    	let br1;
    	let t5;
    	let div0;
    	let p1;
    	let t6;
    	let t7;
    	let t8;
    	let input;
    	let input_max_value;
    	let t9;
    	let div1;
    	let svg;
    	let g;
    	let rect0;
    	let text0;
    	let t10;
    	let rect1;
    	let text1;
    	let t11;
    	let rect2;
    	let text2;
    	let t12;
    	let g_transform_value;
    	let text3;
    	let t13;
    	let text3_x_value;
    	let text3_y_value;
    	let svg_height_value;
    	let div1_resize_listener;
    	let t14;
    	let br2;
    	let t15;
    	let br3;
    	let t16;
    	let p2;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = [...Array(/*nSplits*/ ctx[4]).keys()];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			span = element("span");
    			span.textContent = ">";
    			t1 = text(" Try For Yourself");
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "To make the ideas behind Cross Validation more clear, we’ll see how the\n  process works directly. Let’s assume that we’d like to use a one-dimensional\n  linear regression model to predict the price of a house from its\n  square-footage. Drag the value of k for yourself to set the number of folds.\n  Observe that each fold results in a new data split alongside a newly trained\n  model.";
    			t4 = space();
    			br0 = element("br");
    			br1 = element("br");
    			t5 = space();
    			div0 = element("div");
    			p1 = element("p");
    			t6 = text("K = ");
    			t7 = text(/*nSplits*/ ctx[4]);
    			t8 = space();
    			input = element("input");
    			t9 = space();
    			div1 = element("div");
    			svg = svg_element("svg");
    			g = svg_element("g");
    			rect0 = svg_element("rect");
    			text0 = svg_element("text");
    			t10 = text("Train");
    			rect1 = svg_element("rect");
    			text1 = svg_element("text");
    			t11 = text("Validation");
    			rect2 = svg_element("rect");
    			text2 = svg_element("text");
    			t12 = text("Test");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			text3 = svg_element("text");
    			t13 = text("Average Score: 0.85");
    			t14 = space();
    			br2 = element("br");
    			t15 = space();
    			br3 = element("br");
    			t16 = space();
    			p2 = element("p");
    			p2.textContent = "When exploring the fit models above, you may have observed something\n  interesting! The lines of best fit across our folds vary more for lower values\n  of k than for higher values of k. This is a result of our old friend, the bias\n  variance tradeoff (https://mlu-explain.github.io/bias-variance/). Read on to\n  learn more!";
    			attr_dev(span, "class", "section-arrow");
    			add_location(span, file$6, 41, 2, 1314);
    			attr_dev(h1, "class", "body-header");
    			add_location(h1, file$6, 40, 0, 1287);
    			attr_dev(p0, "class", "body-text");
    			add_location(p0, file$6, 43, 0, 1378);
    			add_location(br0, file$6, 51, 0, 1792);
    			add_location(br1, file$6, 51, 6, 1798);
    			attr_dev(p1, "id", "input-label");
    			attr_dev(p1, "class", "svelte-1qiglte");
    			add_location(p1, file$6, 54, 2, 1851);
    			attr_dev(input, "type", "range");
    			attr_dev(input, "step", "1");
    			attr_dev(input, "min", "2");
    			attr_dev(input, "max", input_max_value = numRects$1 - /*numTest*/ ctx[3]);
    			add_location(input, file$6, 55, 2, 1891);
    			attr_dev(div0, "id", "input-container");
    			attr_dev(div0, "class", "svelte-1qiglte");
    			add_location(div0, file$6, 53, 0, 1822);
    			attr_dev(rect0, "x", 0);
    			attr_dev(rect0, "y", "3");
    			attr_dev(rect0, "fill", trainColor);
    			attr_dev(rect0, "width", "12");
    			attr_dev(rect0, "height", "12");
    			add_location(rect0, file$6, 68, 6, 2253);
    			attr_dev(text0, "class", "legend-text svelte-1qiglte");
    			attr_dev(text0, "x", 15);
    			attr_dev(text0, "y", "15");
    			add_location(text0, file$6, 69, 6, 2321);
    			attr_dev(rect1, "x", 65);
    			attr_dev(rect1, "y", "3");
    			attr_dev(rect1, "fill", validationColor);
    			attr_dev(rect1, "width", "12");
    			attr_dev(rect1, "height", "12");
    			add_location(rect1, file$6, 70, 6, 2380);
    			attr_dev(text1, "class", "legend-text svelte-1qiglte");
    			attr_dev(text1, "x", 80);
    			attr_dev(text1, "y", "15");
    			add_location(text1, file$6, 71, 6, 2454);
    			attr_dev(rect2, "x", 170);
    			attr_dev(rect2, "y", "3");
    			attr_dev(rect2, "fill", testColor);
    			attr_dev(rect2, "width", "12");
    			attr_dev(rect2, "height", "12");
    			add_location(rect2, file$6, 72, 6, 2518);
    			attr_dev(text2, "class", "legend-text svelte-1qiglte");
    			attr_dev(text2, "x", 185);
    			attr_dev(text2, "y", "15");
    			add_location(text2, file$6, 73, 6, 2587);
    			attr_dev(g, "class", "g-tag");
    			attr_dev(g, "transform", g_transform_value = "translate(" + (/*width*/ ctx[0] / 2 - 102) + ", " + 0 + ")");
    			add_location(g, file$6, 67, 4, 2183);
    			attr_dev(text3, "class", "fold-error-text svelte-1qiglte");
    			attr_dev(text3, "id", "average-fold-error-text");
    			attr_dev(text3, "x", text3_x_value = "" + (/*width*/ ctx[0] / 2 + ","));
    			attr_dev(text3, "y", text3_y_value = /*yScale*/ ctx[8](4));
    			attr_dev(text3, "text-anchor", "middle");
    			add_location(text3, file$6, 139, 4, 4359);
    			attr_dev(svg, "width", /*width*/ ctx[0]);
    			attr_dev(svg, "height", svg_height_value = /*height*/ ctx[1] + /*$margin*/ ctx[5].top + /*$margin*/ ctx[5].bottom);
    			attr_dev(svg, "class", "svelte-1qiglte");
    			add_location(svg, file$6, 65, 2, 2098);
    			attr_dev(div1, "id", "cv-chart");
    			attr_dev(div1, "class", "svelte-1qiglte");
    			add_render_callback(() => /*div1_elementresize_handler*/ ctx[12].call(div1));
    			add_location(div1, file$6, 64, 0, 2024);
    			add_location(br2, file$6, 152, 0, 4695);
    			add_location(br3, file$6, 153, 0, 4702);
    			attr_dev(p2, "class", "body-text");
    			add_location(p2, file$6, 154, 0, 4709);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, span);
    			append_dev(h1, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div0, anchor);
    			append_dev(div0, p1);
    			append_dev(p1, t6);
    			append_dev(p1, t7);
    			append_dev(div0, t8);
    			append_dev(div0, input);
    			set_input_value(input, /*nSplits*/ ctx[4]);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, svg);
    			append_dev(svg, g);
    			append_dev(g, rect0);
    			append_dev(g, text0);
    			append_dev(text0, t10);
    			append_dev(g, rect1);
    			append_dev(g, text1);
    			append_dev(text1, t11);
    			append_dev(g, rect2);
    			append_dev(g, text2);
    			append_dev(text2, t12);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(svg, null);
    			}

    			append_dev(svg, text3);
    			append_dev(text3, t13);
    			div1_resize_listener = add_resize_listener(div1, /*div1_elementresize_handler*/ ctx[12].bind(div1));
    			insert_dev(target, t14, anchor);
    			insert_dev(target, br2, anchor);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, br3, anchor);
    			insert_dev(target, t16, anchor);
    			insert_dev(target, p2, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*input_change_input_handler*/ ctx[10]),
    					listen_dev(input, "input", /*input_change_input_handler*/ ctx[10])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*nSplits*/ 16) set_data_dev(t7, /*nSplits*/ ctx[4]);

    			if (!current || dirty & /*numTest*/ 8 && input_max_value !== (input_max_value = numRects$1 - /*numTest*/ ctx[3])) {
    				attr_dev(input, "max", input_max_value);
    			}

    			if (dirty & /*nSplits*/ 16) {
    				set_input_value(input, /*nSplits*/ ctx[4]);
    			}

    			if (!current || dirty & /*width*/ 1 && g_transform_value !== (g_transform_value = "translate(" + (/*width*/ ctx[0] / 2 - 102) + ", " + 0 + ")")) {
    				attr_dev(g, "transform", g_transform_value);
    			}

    			if (dirty & /*xScale, Array, nSplits, xDiff, yScale, height, numCol, numRects, numTest, testColor, numValidation, validationColor, trainColor*/ 990) {
    				each_value = [...Array(/*nSplits*/ ctx[4]).keys()];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(svg, text3);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*width*/ 1 && text3_x_value !== (text3_x_value = "" + (/*width*/ ctx[0] / 2 + ","))) {
    				attr_dev(text3, "x", text3_x_value);
    			}

    			if (!current || dirty & /*yScale*/ 256 && text3_y_value !== (text3_y_value = /*yScale*/ ctx[8](4))) {
    				attr_dev(text3, "y", text3_y_value);
    			}

    			if (!current || dirty & /*width*/ 1) {
    				attr_dev(svg, "width", /*width*/ ctx[0]);
    			}

    			if (!current || dirty & /*height, $margin*/ 34 && svg_height_value !== (svg_height_value = /*height*/ ctx[1] + /*$margin*/ ctx[5].top + /*$margin*/ ctx[5].bottom)) {
    				attr_dev(svg, "height", svg_height_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			div1_resize_listener();
    			if (detaching) detach_dev(t14);
    			if (detaching) detach_dev(br2);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(br3);
    			if (detaching) detach_dev(t16);
    			if (detaching) detach_dev(p2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const numRects$1 = 16;
    const testColor = "#ffad97";
    const trainColor = "#003181";
    const validationColor = "#f46ebb";

    function instance$7($$self, $$props, $$invalidate) {
    	let nSplits;
    	let xScale;
    	let yScale;
    	let xDiff;
    	let numCol;
    	let numTest;
    	let numValidation;
    	let numTrain;
    	let $margin;
    	validate_store(margin, 'margin');
    	component_subscribe($$self, margin, $$value => $$invalidate(5, $margin = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('KFoldInteractive', slots, []);
    	let width = 500;
    	let height = 500;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<KFoldInteractive> was created with unknown prop '${key}'`);
    	});

    	function input_change_input_handler() {
    		nSplits = to_number(this.value);
    		$$invalidate(4, nSplits);
    	}

    	const func = (tick, d) => {
    		if (d >= numRects$1 - numTest) return testColor;
    		if (d >= numValidation * (nSplits - tick - 1) && d < numValidation * (nSplits - tick - 1) + numValidation) return validationColor;
    		return trainColor;
    	};

    	function div1_elementresize_handler() {
    		width = this.offsetWidth;
    		height = this.offsetHeight;
    		$$invalidate(0, width);
    		$$invalidate(1, height);
    	}

    	$$self.$capture_state = () => ({
    		scaleLinear: linear,
    		scaleBand: band,
    		margin,
    		StackedRects,
    		Scatterplot,
    		width,
    		height,
    		numRects: numRects$1,
    		testColor,
    		trainColor,
    		validationColor,
    		numValidation,
    		numTest,
    		numTrain,
    		nSplits,
    		numCol,
    		xDiff,
    		yScale,
    		xScale,
    		$margin
    	});

    	$$self.$inject_state = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('numValidation' in $$props) $$invalidate(2, numValidation = $$props.numValidation);
    		if ('numTest' in $$props) $$invalidate(3, numTest = $$props.numTest);
    		if ('numTrain' in $$props) numTrain = $$props.numTrain;
    		if ('nSplits' in $$props) $$invalidate(4, nSplits = $$props.nSplits);
    		if ('numCol' in $$props) $$invalidate(6, numCol = $$props.numCol);
    		if ('xDiff' in $$props) $$invalidate(7, xDiff = $$props.xDiff);
    		if ('yScale' in $$props) $$invalidate(8, yScale = $$props.yScale);
    		if ('xScale' in $$props) $$invalidate(9, xScale = $$props.xScale);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*nSplits, width*/ 17) {
    			$$invalidate(9, xScale = nSplits < 8
    			? linear().domain([-1, nSplits]).range([width * 0.2, width - width * 0.2])
    			: linear().domain([-1, nSplits]).range([0, width]));
    		}

    		if ($$self.$$.dirty & /*$margin, height*/ 34) {
    			// $: yScale = scaleLinear().domain([-1, 1]).range([height, 0]);
    			$$invalidate(8, yScale = band().domain([-1, 0, 1, 2, 3, 4]).range([$margin.bottom, height - $margin.top]).padding(0.1));
    		}

    		if ($$self.$$.dirty & /*nSplits*/ 16) {
    			// fill rule
    			$$invalidate(6, numCol = nSplits > 10 + 2 ? 1 : 2);
    		}

    		if ($$self.$$.dirty & /*numTest, nSplits*/ 24) {
    			$$invalidate(2, numValidation = (numRects$1 - numTest) / nSplits);
    		}

    		if ($$self.$$.dirty & /*numTest, numValidation*/ 12) {
    			numTrain = numRects$1 - numTest - numValidation;
    		}
    	};

    	$$invalidate(4, nSplits = 4);

    	// $: xDiff = width / ((nSplits + 1) * 4);
    	$$invalidate(7, xDiff = 20);

    	$$invalidate(3, numTest = 4);

    	return [
    		width,
    		height,
    		numValidation,
    		numTest,
    		nSplits,
    		$margin,
    		numCol,
    		xDiff,
    		yScale,
    		xScale,
    		input_change_input_handler,
    		func,
    		div1_elementresize_handler
    	];
    }

    class KFoldInteractive extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "KFoldInteractive",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/Components/Conclusion.svelte generated by Svelte v3.48.0 */

    const file$5 = "src/Components/Conclusion.svelte";

    function create_fragment$6(ctx) {
    	let h1;
    	let span;
    	let t1;
    	let t2;
    	let p0;
    	let t4;
    	let br0;
    	let t5;
    	let p1;
    	let t6;
    	let br1;
    	let br2;
    	let t7;
    	let a0;
    	let t9;
    	let a1;
    	let t11;
    	let a2;
    	let t13;
    	let a3;
    	let t15;
    	let a4;
    	let t17;
    	let a5;
    	let t19;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			span = element("span");
    			span.textContent = ">";
    			t1 = text(" Concluding Text");
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "Write a paragraph here detailing that the article is over. Mention stuff that\n  you've learned. Mention stuff that's related that we didn't mention. You only\n  need edit the next two paragraphs slightly.";
    			t4 = space();
    			br0 = element("br");
    			t5 = space();
    			p1 = element("p");
    			t6 = text("Thanks for reading. We hope that the article is insightful no matter where you\n  are along your Machine Learning journey, and that you came away with a better\n  understanding of some of the difficulties of evaluating classification models.\n  ");
    			br1 = element("br");
    			br2 = element("br");
    			t7 = text("\n  To learn more about Machine Learning, check out our\n  ");
    			a0 = element("a");
    			a0.textContent = "self-paced courses";
    			t9 = text(", our\n  ");
    			a1 = element("a");
    			a1.textContent = "YouTube videos";
    			t11 = text(", and the\n  ");
    			a2 = element("a");
    			a2.textContent = "Dive into Deep Learning";
    			t13 = text("\n  textbook. If you have any comments or ideas related to\n  ");
    			a3 = element("a");
    			a3.textContent = "MLU-Explain articles";
    			t15 = text(", feel free to reach out\n  ");
    			a4 = element("a");
    			a4.textContent = "directly";
    			t17 = text(". The code for\n  this article is available\n  ");
    			a5 = element("a");
    			a5.textContent = "here";
    			t19 = text(".");
    			attr_dev(span, "class", "section-arrow");
    			add_location(span, file$5, 3, 2, 46);
    			attr_dev(h1, "class", "body-header");
    			add_location(h1, file$5, 2, 0, 19);
    			attr_dev(p0, "class", "body-text");
    			add_location(p0, file$5, 5, 0, 109);
    			add_location(br0, file$5, 10, 0, 342);
    			add_location(br1, file$5, 15, 2, 615);
    			add_location(br2, file$5, 15, 8, 621);
    			attr_dev(a0, "class", "on-end");
    			attr_dev(a0, "href", "https://aws.amazon.com/machine-learning/mlu/");
    			add_location(a0, file$5, 17, 2, 684);
    			attr_dev(a1, "class", "on-end");
    			attr_dev(a1, "href", "https://www.youtube.com/channel/UC12LqyqTQYbXatYS9AA7Nuw");
    			add_location(a1, file$5, 20, 2, 792);
    			attr_dev(a2, "class", "on-end");
    			attr_dev(a2, "href", "https://d2l.ai/");
    			add_location(a2, file$5, 25, 2, 920);
    			attr_dev(a3, "class", "on-end");
    			attr_dev(a3, "href", "https://mlu-explain.github.io/");
    			add_location(a3, file$5, 27, 2, 1048);
    			attr_dev(a4, "class", "on-end");
    			attr_dev(a4, "href", "https://twitter.com/jdwlbr");
    			add_location(a4, file$5, 30, 2, 1163);
    			attr_dev(a5, "class", "on-end");
    			attr_dev(a5, "href", "https://github.com/aws-samples/aws-mlu-explain");
    			add_location(a5, file$5, 32, 2, 1272);
    			attr_dev(p1, "class", "body-text");
    			add_location(p1, file$5, 11, 0, 349);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, span);
    			append_dev(h1, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, t6);
    			append_dev(p1, br1);
    			append_dev(p1, br2);
    			append_dev(p1, t7);
    			append_dev(p1, a0);
    			append_dev(p1, t9);
    			append_dev(p1, a1);
    			append_dev(p1, t11);
    			append_dev(p1, a2);
    			append_dev(p1, t13);
    			append_dev(p1, a3);
    			append_dev(p1, t15);
    			append_dev(p1, a4);
    			append_dev(p1, t17);
    			append_dev(p1, a5);
    			append_dev(p1, t19);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(p1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Conclusion', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Conclusion> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Conclusion extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Conclusion",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/Components/Resources.svelte generated by Svelte v3.48.0 */

    const file$4 = "src/Components/Resources.svelte";

    function create_fragment$5(ctx) {
    	let br0;
    	let t0;
    	let br1;
    	let t1;
    	let br2;
    	let t2;
    	let section;
    	let br3;
    	let t3;
    	let h3;
    	let span;
    	let t5;
    	let t6;
    	let p0;
    	let t8;
    	let br4;
    	let t9;
    	let p1;
    	let a0;
    	let br5;
    	let t11;
    	let t12;
    	let p2;
    	let a1;
    	let br6;
    	let t14;
    	let t15;
    	let p3;
    	let a2;
    	let br7;
    	let t17;
    	let t18;
    	let p4;
    	let a3;
    	let br8;
    	let t20;
    	let t21;
    	let p5;
    	let a4;
    	let t23;
    	let br9;
    	let t24;
    	let t25;
    	let p6;
    	let a5;
    	let br10;
    	let t27;
    	let t28;
    	let br11;
    	let t29;
    	let br12;
    	let t30;
    	let br13;

    	const block = {
    		c: function create() {
    			br0 = element("br");
    			t0 = space();
    			br1 = element("br");
    			t1 = space();
    			br2 = element("br");
    			t2 = space();
    			section = element("section");
    			br3 = element("br");
    			t3 = space();
    			h3 = element("h3");
    			span = element("span");
    			span.textContent = ">";
    			t5 = text(" References + Open Source");
    			t6 = space();
    			p0 = element("p");
    			p0.textContent = "This article is a product of the following resources + the awesome people\n    who made (and contributed to) them:";
    			t8 = space();
    			br4 = element("br");
    			t9 = space();
    			p1 = element("p");
    			a0 = element("a");
    			a0.textContent = "Evaluation: From Precision, Recall and F-Factor to ROC, Informedness,\n      Markedness & Correlation";
    			br5 = element("br");
    			t11 = text("\n    (David Martin Ward Powers, 2008).");
    			t12 = space();
    			p2 = element("p");
    			a1 = element("a");
    			a1.textContent = "Classification assessment methods";
    			br6 = element("br");
    			t14 = text("\n    (John Ross Quinlan, 1986).");
    			t15 = space();
    			p3 = element("p");
    			a2 = element("a");
    			a2.textContent = "D3.js";
    			br7 = element("br");
    			t17 = text("(Mike Bostock &\n    Philippe Rivière)");
    			t18 = space();
    			p4 = element("p");
    			a3 = element("a");
    			a3.textContent = "LayerCake";
    			br8 = element("br");
    			t20 = text("(Michael Keller)");
    			t21 = space();
    			p5 = element("p");
    			a4 = element("a");
    			a4.textContent = "KaTeX";
    			t23 = space();
    			br9 = element("br");
    			t24 = text("(Emily Eisenberg\n    & Sophie Alpert)");
    			t25 = space();
    			p6 = element("p");
    			a5 = element("a");
    			a5.textContent = "Svelte";
    			br10 = element("br");
    			t27 = text("(Rich Harris)");
    			t28 = space();
    			br11 = element("br");
    			t29 = space();
    			br12 = element("br");
    			t30 = space();
    			br13 = element("br");
    			add_location(br0, file$4, 3, 0, 33);
    			add_location(br1, file$4, 4, 0, 40);
    			add_location(br2, file$4, 5, 0, 47);
    			add_location(br3, file$4, 7, 2, 81);
    			attr_dev(span, "class", "section-arrow svelte-pn1n2d");
    			add_location(span, file$4, 9, 4, 119);
    			attr_dev(h3, "class", "body-header");
    			add_location(h3, file$4, 8, 2, 90);
    			attr_dev(p0, "class", "body-text svelte-pn1n2d");
    			add_location(p0, file$4, 11, 2, 195);
    			add_location(br4, file$4, 15, 2, 344);
    			attr_dev(a0, "class", "on-end svelte-pn1n2d");
    			attr_dev(a0, "href", "https://www.researchgate.net/publication/228529307_Evaluation_From_Precision_Recall_and_F-Factor_to_ROC_Informedness_Markedness_Correlation");
    			add_location(a0, file$4, 17, 4, 383);
    			add_location(br5, file$4, 22, 5, 676);
    			attr_dev(p1, "class", "resource-item svelte-pn1n2d");
    			add_location(p1, file$4, 16, 2, 353);
    			attr_dev(a1, "class", "on-end svelte-pn1n2d");
    			attr_dev(a1, "href", "https://link.springer.com/article/10.1007/BF00116251");
    			add_location(a1, file$4, 26, 4, 760);
    			add_location(br6, file$4, 30, 5, 899);
    			attr_dev(p2, "class", "resource-item svelte-pn1n2d");
    			add_location(p2, file$4, 25, 2, 730);
    			attr_dev(a2, "class", "on-end svelte-pn1n2d");
    			attr_dev(a2, "href", "https://d3js.org/");
    			add_location(a2, file$4, 34, 4, 976);
    			add_location(br7, file$4, 34, 56, 1028);
    			attr_dev(p3, "class", "resource-item svelte-pn1n2d");
    			add_location(p3, file$4, 33, 2, 946);
    			attr_dev(a3, "class", "on-end svelte-pn1n2d");
    			attr_dev(a3, "href", "https://layercake.graphics/");
    			add_location(a3, file$4, 38, 4, 1111);
    			add_location(br8, file$4, 38, 70, 1177);
    			attr_dev(p4, "class", "resource-item svelte-pn1n2d");
    			add_location(p4, file$4, 37, 2, 1081);
    			attr_dev(a4, "class", "on-end svelte-pn1n2d");
    			attr_dev(a4, "href", "https://katex.org/");
    			add_location(a4, file$4, 42, 4, 1243);
    			add_location(br9, file$4, 42, 58, 1297);
    			attr_dev(p5, "class", "resource-item svelte-pn1n2d");
    			add_location(p5, file$4, 41, 2, 1213);
    			attr_dev(a5, "class", "on-end svelte-pn1n2d");
    			attr_dev(a5, "href", "https://svelte.dev/");
    			add_location(a5, file$4, 46, 4, 1380);
    			add_location(br10, file$4, 46, 59, 1435);
    			attr_dev(p6, "class", "resource-item svelte-pn1n2d");
    			add_location(p6, file$4, 45, 2, 1350);
    			add_location(br11, file$4, 48, 2, 1464);
    			add_location(br12, file$4, 49, 2, 1473);
    			add_location(br13, file$4, 50, 2, 1482);
    			attr_dev(section, "id", "resources");
    			attr_dev(section, "class", "svelte-pn1n2d");
    			add_location(section, file$4, 6, 0, 54);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, br0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, br2, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, section, anchor);
    			append_dev(section, br3);
    			append_dev(section, t3);
    			append_dev(section, h3);
    			append_dev(h3, span);
    			append_dev(h3, t5);
    			append_dev(section, t6);
    			append_dev(section, p0);
    			append_dev(section, t8);
    			append_dev(section, br4);
    			append_dev(section, t9);
    			append_dev(section, p1);
    			append_dev(p1, a0);
    			append_dev(p1, br5);
    			append_dev(p1, t11);
    			append_dev(section, t12);
    			append_dev(section, p2);
    			append_dev(p2, a1);
    			append_dev(p2, br6);
    			append_dev(p2, t14);
    			append_dev(section, t15);
    			append_dev(section, p3);
    			append_dev(p3, a2);
    			append_dev(p3, br7);
    			append_dev(p3, t17);
    			append_dev(section, t18);
    			append_dev(section, p4);
    			append_dev(p4, a3);
    			append_dev(p4, br8);
    			append_dev(p4, t20);
    			append_dev(section, t21);
    			append_dev(section, p5);
    			append_dev(p5, a4);
    			append_dev(p5, t23);
    			append_dev(p5, br9);
    			append_dev(p5, t24);
    			append_dev(section, t25);
    			append_dev(section, p6);
    			append_dev(p6, a5);
    			append_dev(p6, br10);
    			append_dev(p6, t27);
    			append_dev(section, t28);
    			append_dev(section, br11);
    			append_dev(section, t29);
    			append_dev(section, br12);
    			append_dev(section, t30);
    			append_dev(section, br13);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(br2);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Resources', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Resources> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Resources extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Resources",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    const arrowPath =
      "M11.5954 1.23584C12.2056 0.62565 13.1949 0.62565 13.8051 1.23584L24.7426 12.1733C25.3528 12.7835 25.3528 13.7729 24.7426 14.3831L13.8051 25.3206C13.1949 25.9307 12.2056 25.9307 11.5954 25.3206C10.9852 24.7104 10.9852 23.721 11.5954 23.1108L21.4281 13.2782L11.5954 3.44555C10.9852 2.83536 10.9852 1.84604 11.5954 1.23584Z";

    /* src/Components/ValidationSet.svelte generated by Svelte v3.48.0 */
    const file$3 = "src/Components/ValidationSet.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (72:6) {:else}
    function create_else_block$2(ctx) {
    	let stackedrects;
    	let current;

    	stackedrects = new StackedRects({
    			props: {
    				height: /*height*/ ctx[1],
    				x: /*xScale*/ ctx[4](/*tick*/ ctx[9]) - /*xDiff*/ ctx[2],
    				fillRule: func_1,
    				labels: /*validationLabels*/ ctx[7]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(stackedrects.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(stackedrects, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const stackedrects_changes = {};
    			if (dirty & /*height*/ 2) stackedrects_changes.height = /*height*/ ctx[1];
    			if (dirty & /*xScale, xDiff*/ 20) stackedrects_changes.x = /*xScale*/ ctx[4](/*tick*/ ctx[9]) - /*xDiff*/ ctx[2];
    			stackedrects.$set(stackedrects_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stackedrects.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stackedrects.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(stackedrects, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(72:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (63:27) 
    function create_if_block_1$2(ctx) {
    	let stackedrects;
    	let current;

    	stackedrects = new StackedRects({
    			props: {
    				height: /*height*/ ctx[1],
    				x: /*xScale*/ ctx[4](/*tick*/ ctx[9]) - /*xDiff*/ ctx[2],
    				fillRule: func$2,
    				labels: /*dataLabel*/ ctx[6]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(stackedrects.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(stackedrects, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const stackedrects_changes = {};
    			if (dirty & /*height*/ 2) stackedrects_changes.height = /*height*/ ctx[1];
    			if (dirty & /*xScale, xDiff*/ 20) stackedrects_changes.x = /*xScale*/ ctx[4](/*tick*/ ctx[9]) - /*xDiff*/ ctx[2];
    			stackedrects.$set(stackedrects_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stackedrects.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stackedrects.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(stackedrects, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(63:27) ",
    		ctx
    	});

    	return block;
    }

    // (52:6) {#if tick === 1}
    function create_if_block$2(ctx) {
    	let g;
    	let path;
    	let g_transform_value;

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			path = svg_element("path");
    			attr_dev(path, "d", arrowPath);
    			attr_dev(path, "style", `transform: scale(0.1)`);
    			attr_dev(path, "stroke", "#232f3e");
    			attr_dev(path, "stroke-width", "3");
    			attr_dev(path, "fill", "#232f3e");
    			add_location(path, file$3, 54, 10, 1894);
    			attr_dev(g, "transform", g_transform_value = "translate(" + (/*xScale*/ ctx[4](/*tick*/ ctx[9]) - /*xDiff*/ ctx[2]) + ", " + (/*yScale*/ ctx[3](0) - /*xDiff*/ ctx[2]) + ")");
    			add_location(g, file$3, 53, 8, 1813);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			append_dev(g, path);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*xScale, xDiff, yScale*/ 28 && g_transform_value !== (g_transform_value = "translate(" + (/*xScale*/ ctx[4](/*tick*/ ctx[9]) - /*xDiff*/ ctx[2]) + ", " + (/*yScale*/ ctx[3](0) - /*xDiff*/ ctx[2]) + ")")) {
    				attr_dev(g, "transform", g_transform_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(52:6) {#if tick === 1}",
    		ctx
    	});

    	return block;
    }

    // (51:4) {#each [...Array(nSplits).keys()] as tick}
    function create_each_block$2(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$2, create_if_block_1$2, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*tick*/ ctx[9] === 1) return 0;
    		if (/*tick*/ ctx[9] === 0) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(51:4) {#each [...Array(nSplits).keys()] as tick}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let h1;
    	let span0;
    	let t1;
    	let t2;
    	let p0;
    	let t3;
    	let a;
    	let t5;
    	let span1;
    	let t7;
    	let t8;
    	let br0;
    	let t9;
    	let ul;
    	let li0;
    	let span2;
    	let t11;
    	let t12;
    	let li1;
    	let span3;
    	let t14;
    	let t15;
    	let li2;
    	let span4;
    	let t17;
    	let t18;
    	let br1;
    	let t19;
    	let div;
    	let svg;
    	let svg_height_value;
    	let div_resize_listener;
    	let t20;
    	let br2;
    	let br3;
    	let t21;
    	let p1;
    	let current;
    	let each_value = [...Array(nSplits$2).keys()];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			span0 = element("span");
    			span0.textContent = ">";
    			t1 = text(" Our Previous Approach");
    			t2 = space();
    			p0 = element("p");
    			t3 = text("In a ");
    			a = element("a");
    			a.textContent = "previous article";
    			t5 = text(", we described a standard technique for solving this problem:\n  ");
    			span1 = element("span");
    			span1.textContent = "The Validation Set Approach";
    			t7 = text(". Recall this involved\n  randomly splitting our data into three mutually exclusive sets:");
    			t8 = space();
    			br0 = element("br");
    			t9 = space();
    			ul = element("ul");
    			li0 = element("li");
    			span2 = element("span");
    			span2.textContent = "The Training Set";
    			t11 = text(" is used to learn the model parameters.");
    			t12 = space();
    			li1 = element("li");
    			span3 = element("span");
    			span3.textContent = "The Validation Set";
    			t14 = text(" is used to select which model or\n    set of hyperparameters you’d like to use.");
    			t15 = space();
    			li2 = element("li");
    			span4 = element("span");
    			span4.textContent = "The Test Set";
    			t17 = text(" is used to evaluate how your model will\n    perform on unseen data.");
    			t18 = space();
    			br1 = element("br");
    			t19 = space();
    			div = element("div");
    			svg = svg_element("svg");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t20 = space();
    			br2 = element("br");
    			br3 = element("br");
    			t21 = space();
    			p1 = element("p");
    			p1.textContent = "The Validation Set Approach is still widely used, especially when resource\n  constraints prohibit alternatives that require resampling (like cross\n  validation). But the approach is perfect! The obvious issues is that our\n  estimate of the test error can be highly variable depending on which\n  particular observations are included in the training set and which are\n  included in the validation set. That is, how do we know that the 30% we\n  selected is the best way to split the data? What if we’d used a different\n  split instead? Another issue is that this approach tends to overestimate the\n  test error for models fit on our entire dataset. This is because more training\n  data usually means better accuracy, but the validation set approach reserves a\n  decent-sized chunk of data for validation and testing (and not training). If\n  only there was a better resampling method for assessing how the results of a\n  statistical analysis will generalize to an independent data set...";
    			attr_dev(span0, "class", "section-arrow");
    			add_location(span0, file$3, 22, 2, 680);
    			attr_dev(h1, "class", "body-header");
    			add_location(h1, file$3, 21, 0, 653);
    			attr_dev(a, "href", "https://mlu-explain.github.io/train-test-validation");
    			add_location(a, file$3, 25, 7, 778);
    			attr_dev(span1, "class", "bold");
    			add_location(span1, file$3, 28, 2, 932);
    			attr_dev(p0, "class", "body-text");
    			add_location(p0, file$3, 24, 0, 749);
    			add_location(br0, file$3, 31, 0, 1079);
    			attr_dev(span2, "class", "bold");
    			add_location(span2, file$3, 34, 4, 1120);
    			add_location(li0, file$3, 33, 2, 1111);
    			attr_dev(span3, "class", "bold");
    			add_location(span3, file$3, 37, 4, 1221);
    			add_location(li1, file$3, 36, 2, 1212);
    			attr_dev(span4, "class", "bold");
    			add_location(span4, file$3, 42, 4, 1365);
    			add_location(li2, file$3, 41, 2, 1356);
    			attr_dev(ul, "class", "body-text svelte-aoodt6");
    			add_location(ul, file$3, 32, 0, 1086);
    			add_location(br1, file$3, 46, 0, 1486);
    			attr_dev(svg, "width", /*width*/ ctx[0]);
    			attr_dev(svg, "height", svg_height_value = /*height*/ ctx[1] + /*$margin*/ ctx[5].top + /*$margin*/ ctx[5].bottom);
    			attr_dev(svg, "class", "svelte-aoodt6");
    			add_location(svg, file$3, 48, 2, 1567);
    			attr_dev(div, "id", "cv-chart");
    			attr_dev(div, "class", "svelte-aoodt6");
    			add_render_callback(() => /*div_elementresize_handler*/ ctx[8].call(div));
    			add_location(div, file$3, 47, 0, 1493);
    			add_location(br2, file$3, 103, 0, 3118);
    			add_location(br3, file$3, 103, 6, 3124);
    			attr_dev(p1, "class", "body-text");
    			add_location(p1, file$3, 104, 0, 3131);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, span0);
    			append_dev(h1, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p0, anchor);
    			append_dev(p0, t3);
    			append_dev(p0, a);
    			append_dev(p0, t5);
    			append_dev(p0, span1);
    			append_dev(p0, t7);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, ul, anchor);
    			append_dev(ul, li0);
    			append_dev(li0, span2);
    			append_dev(li0, t11);
    			append_dev(ul, t12);
    			append_dev(ul, li1);
    			append_dev(li1, span3);
    			append_dev(li1, t14);
    			append_dev(ul, t15);
    			append_dev(ul, li2);
    			append_dev(li2, span4);
    			append_dev(li2, t17);
    			insert_dev(target, t18, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t19, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(svg, null);
    			}

    			div_resize_listener = add_resize_listener(div, /*div_elementresize_handler*/ ctx[8].bind(div));
    			insert_dev(target, t20, anchor);
    			insert_dev(target, br2, anchor);
    			insert_dev(target, br3, anchor);
    			insert_dev(target, t21, anchor);
    			insert_dev(target, p1, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*xScale, Array, nSplits, xDiff, yScale, arrowPath, height, dataLabel, validationLabels*/ 222) {
    				each_value = [...Array(nSplits$2).keys()];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(svg, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*width*/ 1) {
    				attr_dev(svg, "width", /*width*/ ctx[0]);
    			}

    			if (!current || dirty & /*height, $margin*/ 34 && svg_height_value !== (svg_height_value = /*height*/ ctx[1] + /*$margin*/ ctx[5].top + /*$margin*/ ctx[5].bottom)) {
    				attr_dev(svg, "height", svg_height_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(ul);
    			if (detaching) detach_dev(t18);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t19);
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			div_resize_listener();
    			if (detaching) detach_dev(t20);
    			if (detaching) detach_dev(br2);
    			if (detaching) detach_dev(br3);
    			if (detaching) detach_dev(t21);
    			if (detaching) detach_dev(p1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const nSplits$2 = 3;

    const func$2 = () => {
    	return "#232f3e";
    };

    const func_1 = i => i < 45 ? "#003181" : i < 75 ? "#f46ebb" : "#ffad97";

    function instance$4($$self, $$props, $$invalidate) {
    	let xScale;
    	let yScale;
    	let xDiff;
    	let $margin;
    	validate_store(margin, 'margin');
    	component_subscribe($$self, margin, $$value => $$invalidate(5, $margin = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ValidationSet', slots, []);
    	let width = 500;
    	let height = 500;
    	let dataLabel = [{ label: "Data", y: 10, dy: -6.5 }];

    	let validationLabels = [
    		{ label: "Train", y: 5, dy: 0 },
    		{ label: "Validation", y: 13, dy: 6.5 },
    		{ label: "Test", y: 18, dy: 0 }
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ValidationSet> was created with unknown prop '${key}'`);
    	});

    	function div_elementresize_handler() {
    		width = this.offsetWidth;
    		height = this.offsetHeight;
    		$$invalidate(0, width);
    		$$invalidate(1, height);
    	}

    	$$self.$capture_state = () => ({
    		scaleLinear: linear,
    		scaleBand: band,
    		margin,
    		arrowPath,
    		StackedRects,
    		width,
    		height,
    		nSplits: nSplits$2,
    		dataLabel,
    		validationLabels,
    		xDiff,
    		yScale,
    		xScale,
    		$margin
    	});

    	$$self.$inject_state = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('dataLabel' in $$props) $$invalidate(6, dataLabel = $$props.dataLabel);
    		if ('validationLabels' in $$props) $$invalidate(7, validationLabels = $$props.validationLabels);
    		if ('xDiff' in $$props) $$invalidate(2, xDiff = $$props.xDiff);
    		if ('yScale' in $$props) $$invalidate(3, yScale = $$props.yScale);
    		if ('xScale' in $$props) $$invalidate(4, xScale = $$props.xScale);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*width*/ 1) {
    			$$invalidate(4, xScale = linear().domain([-1, nSplits$2]).range([0, width]));
    		}

    		if ($$self.$$.dirty & /*height*/ 2) {
    			$$invalidate(3, yScale = linear().domain([-1, 1]).range([height, 0]));
    		}

    		if ($$self.$$.dirty & /*width*/ 1) {
    			$$invalidate(2, xDiff = width / ((nSplits$2 + 1) * 4));
    		}
    	};

    	return [
    		width,
    		height,
    		xDiff,
    		yScale,
    		xScale,
    		$margin,
    		dataLabel,
    		validationLabels,
    		div_elementresize_handler
    	];
    }

    class ValidationSet extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ValidationSet",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/Components/KFoldCV.svelte generated by Svelte v3.48.0 */
    const file$2 = "src/Components/KFoldCV.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (77:6) {:else}
    function create_else_block$1(ctx) {
    	let stackedrects;
    	let current;

    	function func_1(...args) {
    		return /*func_1*/ ctx[6](/*tick*/ ctx[8], ...args);
    	}

    	stackedrects = new StackedRects({
    			props: {
    				height: /*height*/ ctx[1],
    				numCol: "3",
    				numRects: 66,
    				x: /*xScale*/ ctx[4](/*tick*/ ctx[8]) - /*xDiff*/ ctx[2],
    				fillRule: func_1
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(stackedrects.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(stackedrects, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const stackedrects_changes = {};
    			if (dirty & /*height*/ 2) stackedrects_changes.height = /*height*/ ctx[1];
    			if (dirty & /*xScale, xDiff*/ 20) stackedrects_changes.x = /*xScale*/ ctx[4](/*tick*/ ctx[8]) - /*xDiff*/ ctx[2];
    			stackedrects.$set(stackedrects_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stackedrects.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stackedrects.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(stackedrects, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(77:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (67:27) 
    function create_if_block_1$1(ctx) {
    	let stackedrects;
    	let current;

    	stackedrects = new StackedRects({
    			props: {
    				height: /*height*/ ctx[1],
    				numCol: "3",
    				numRects: 66,
    				x: /*xScale*/ ctx[4](/*tick*/ ctx[8]) - /*xDiff*/ ctx[2],
    				fillRule: func$1
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(stackedrects.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(stackedrects, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const stackedrects_changes = {};
    			if (dirty & /*height*/ 2) stackedrects_changes.height = /*height*/ ctx[1];
    			if (dirty & /*xScale, xDiff*/ 20) stackedrects_changes.x = /*xScale*/ ctx[4](/*tick*/ ctx[8]) - /*xDiff*/ ctx[2];
    			stackedrects.$set(stackedrects_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stackedrects.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stackedrects.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(stackedrects, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(67:27) ",
    		ctx
    	});

    	return block;
    }

    // (57:6) {#if tick === 1}
    function create_if_block$1(ctx) {
    	let g;
    	let path;
    	let g_transform_value;

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			path = svg_element("path");
    			attr_dev(path, "d", arrowPath);
    			attr_dev(path, "style", `transform: scale(0.1)`);
    			attr_dev(path, "stroke", "#232f3e");
    			attr_dev(path, "stroke-width", "3");
    			attr_dev(path, "fill", "#232f3e");
    			add_location(path, file$2, 58, 10, 2626);
    			attr_dev(g, "transform", g_transform_value = "translate(" + (/*xScale*/ ctx[4](/*tick*/ ctx[8]) - /*xDiff*/ ctx[2]) + ", " + (/*yScale*/ ctx[3](0) - /*xDiff*/ ctx[2]) + ")");
    			add_location(g, file$2, 57, 8, 2545);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			append_dev(g, path);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*xScale, xDiff, yScale*/ 28 && g_transform_value !== (g_transform_value = "translate(" + (/*xScale*/ ctx[4](/*tick*/ ctx[8]) - /*xDiff*/ ctx[2]) + ", " + (/*yScale*/ ctx[3](0) - /*xDiff*/ ctx[2]) + ")")) {
    				attr_dev(g, "transform", g_transform_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(57:6) {#if tick === 1}",
    		ctx
    	});

    	return block;
    }

    // (56:4) {#each [...Array(nSplits).keys()] as tick}
    function create_each_block$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$1, create_if_block_1$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*tick*/ ctx[8] === 1) return 0;
    		if (/*tick*/ ctx[8] === 0) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(56:4) {#each [...Array(nSplits).keys()] as tick}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let h1;
    	let span0;
    	let t1;
    	let t2;
    	let p0;
    	let t3;
    	let span1;
    	let t5;
    	let t6;
    	let br0;
    	let t7;
    	let p1;
    	let t9;
    	let br1;
    	let t10;
    	let br2;
    	let t11;
    	let div;
    	let svg;
    	let g;
    	let rect0;
    	let text0;
    	let t12;
    	let rect1;
    	let text1;
    	let t13;
    	let rect2;
    	let text2;
    	let t14;
    	let g_transform_value;
    	let svg_height_value;
    	let div_resize_listener;
    	let t15;
    	let br3;
    	let br4;
    	let t16;
    	let p2;
    	let current;
    	let each_value = [...Array(nSplits$1).keys()];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			span0 = element("span");
    			span0.textContent = ">";
    			t1 = text(" K-Folds Cross-Validation");
    			t2 = space();
    			p0 = element("p");
    			t3 = text("Rather than worrying about which split of data to use for training versus\n  validation, we’ll use them all in turn. Our strategy will be to iterativelyuse\n  different portions of our data to test and train our model. The exact process\n  is actually quite simple: We’ll randomly split our dataset into k sets, or\n  \"folds\", of equal size. One fold will be reserved for the validation set (or\n  \"holdout set\") and the remaining k - 1 folds will be used for the training\n  set. The training folds will fit our models parameters, and the validation\n  fold will be used for evaluation. This process will be repeated on our data k\n  times, using a different fold for the validation set at each iteration. At the\n  end of the procedure, we'll take the average the validation set scores and\n  take that as our as our model's estimated performance. This process is known\n  as ");
    			span1 = element("span");
    			span1.textContent = "k-folds cross validation";
    			t5 = text(", and requires re-fitting\n  our data k times (once for each fold).");
    			t6 = space();
    			br0 = element("br");
    			t7 = space();
    			p1 = element("p");
    			p1.textContent = "Below we show the process for K=4 folds of our data. Note that the test data\n  always remains untouched (after all, it's the final hold out set), but the\n  distribution of training and validation sets differs at every fold:";
    			t9 = space();
    			br1 = element("br");
    			t10 = space();
    			br2 = element("br");
    			t11 = space();
    			div = element("div");
    			svg = svg_element("svg");
    			g = svg_element("g");
    			rect0 = svg_element("rect");
    			text0 = svg_element("text");
    			t12 = text("Train");
    			rect1 = svg_element("rect");
    			text1 = svg_element("text");
    			t13 = text("Validation");
    			rect2 = svg_element("rect");
    			text2 = svg_element("text");
    			t14 = text("Test");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t15 = space();
    			br3 = element("br");
    			br4 = element("br");
    			t16 = space();
    			p2 = element("p");
    			p2.textContent = "If you think this looks familiar, you're on the right track: it's basically\n  the validation set applied k times - just with different splits of\n  training/validation data each time. But this simple extension to the\n  validation approach is very effective at overcoming the shortcomings of the\n  validation set approach. To be clear, it does come with a cost: the need to\n  train our data multiple times (once for each fold). Still, the method is\n  widely used, as the benefits outweight the cost in many scenarios. Because we\n  train our model on multiple instances of our data and take the average of\n  their evaluation scores, our evaluation estimates have lower variance.\n  Additionally, each fold itself uses more data than previously, so test error\n  estimates are more accurate. Even for modest values (e.g. k = 5), our training\n  set comprises 80 percent of our data. (Compare that with the validation set\n  approach, where our model is typically trained on around only 50-60 percent of\n  the original dataset.) This means that the K-fold approach typically doesn’t\n  overestimate the test error as much as the validation set approach does.";
    			attr_dev(span0, "class", "section-arrow");
    			add_location(span0, file$2, 15, 2, 472);
    			attr_dev(h1, "class", "body-header");
    			add_location(h1, file$2, 14, 0, 445);
    			attr_dev(span1, "class", "bold");
    			add_location(span1, file$2, 29, 5, 1435);
    			attr_dev(p0, "class", "body-text");
    			add_location(p0, file$2, 17, 0, 544);
    			add_location(br0, file$2, 32, 0, 1557);
    			attr_dev(p1, "class", "body-text");
    			add_location(p1, file$2, 33, 0, 1564);
    			add_location(br1, file$2, 38, 0, 1817);
    			add_location(br2, file$2, 40, 0, 1825);
    			attr_dev(rect0, "x", 0);
    			attr_dev(rect0, "y", "3");
    			attr_dev(rect0, "fill", "#003181");
    			attr_dev(rect0, "width", "12");
    			attr_dev(rect0, "height", "12");
    			add_location(rect0, file$2, 46, 6, 2062);
    			attr_dev(text0, "class", "legend-text svelte-164d2jo");
    			attr_dev(text0, "x", 15);
    			attr_dev(text0, "y", "15");
    			add_location(text0, file$2, 47, 6, 2127);
    			attr_dev(rect1, "x", 65);
    			attr_dev(rect1, "y", "3");
    			attr_dev(rect1, "fill", "#f46ebb");
    			attr_dev(rect1, "width", "12");
    			attr_dev(rect1, "height", "12");
    			add_location(rect1, file$2, 48, 6, 2186);
    			attr_dev(text1, "class", "legend-text svelte-164d2jo");
    			attr_dev(text1, "x", 80);
    			attr_dev(text1, "y", "15");
    			add_location(text1, file$2, 49, 6, 2252);
    			attr_dev(rect2, "x", 170);
    			attr_dev(rect2, "y", "3");
    			attr_dev(rect2, "fill", "#ffad97");
    			attr_dev(rect2, "width", "12");
    			attr_dev(rect2, "height", "12");
    			add_location(rect2, file$2, 50, 6, 2316);
    			attr_dev(text2, "class", "legend-text svelte-164d2jo");
    			attr_dev(text2, "x", 185);
    			attr_dev(text2, "y", "15");
    			add_location(text2, file$2, 51, 6, 2383);
    			attr_dev(g, "class", "g-tag");
    			attr_dev(g, "transform", g_transform_value = "translate(" + (/*width*/ ctx[0] / 2 - 102) + ", " + 0 + ")");
    			add_location(g, file$2, 45, 4, 1992);
    			attr_dev(svg, "width", /*width*/ ctx[0]);
    			attr_dev(svg, "height", svg_height_value = /*height*/ ctx[1] + /*$margin*/ ctx[5].top + /*$margin*/ ctx[5].bottom);
    			attr_dev(svg, "class", "svelte-164d2jo");
    			add_location(svg, file$2, 43, 2, 1907);
    			attr_dev(div, "id", "cv-chart");
    			attr_dev(div, "class", "svelte-164d2jo");
    			add_render_callback(() => /*div_elementresize_handler*/ ctx[7].call(div));
    			add_location(div, file$2, 42, 0, 1833);
    			add_location(br3, file$2, 112, 0, 4006);
    			add_location(br4, file$2, 112, 6, 4012);
    			attr_dev(p2, "class", "body-text");
    			add_location(p2, file$2, 113, 0, 4019);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, span0);
    			append_dev(h1, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p0, anchor);
    			append_dev(p0, t3);
    			append_dev(p0, span1);
    			append_dev(p0, t5);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, p1, anchor);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, br2, anchor);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, g);
    			append_dev(g, rect0);
    			append_dev(g, text0);
    			append_dev(text0, t12);
    			append_dev(g, rect1);
    			append_dev(g, text1);
    			append_dev(text1, t13);
    			append_dev(g, rect2);
    			append_dev(g, text2);
    			append_dev(text2, t14);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(svg, null);
    			}

    			div_resize_listener = add_resize_listener(div, /*div_elementresize_handler*/ ctx[7].bind(div));
    			insert_dev(target, t15, anchor);
    			insert_dev(target, br3, anchor);
    			insert_dev(target, br4, anchor);
    			insert_dev(target, t16, anchor);
    			insert_dev(target, p2, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*width*/ 1 && g_transform_value !== (g_transform_value = "translate(" + (/*width*/ ctx[0] / 2 - 102) + ", " + 0 + ")")) {
    				attr_dev(g, "transform", g_transform_value);
    			}

    			if (dirty & /*xScale, Array, nSplits, xDiff, yScale, arrowPath, height*/ 30) {
    				each_value = [...Array(nSplits$1).keys()];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(svg, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*width*/ 1) {
    				attr_dev(svg, "width", /*width*/ ctx[0]);
    			}

    			if (!current || dirty & /*height, $margin*/ 34 && svg_height_value !== (svg_height_value = /*height*/ ctx[1] + /*$margin*/ ctx[5].top + /*$margin*/ ctx[5].bottom)) {
    				attr_dev(svg, "height", svg_height_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(br2);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			div_resize_listener();
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(br3);
    			if (detaching) detach_dev(br4);
    			if (detaching) detach_dev(t16);
    			if (detaching) detach_dev(p2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const nSplits$1 = 6;

    const func$1 = () => {
    	return "#232f3e";
    };

    function instance$3($$self, $$props, $$invalidate) {
    	let xScale;
    	let yScale;
    	let xDiff;
    	let $margin;
    	validate_store(margin, 'margin');
    	component_subscribe($$self, margin, $$value => $$invalidate(5, $margin = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('KFoldCV', slots, []);
    	let width = 500;
    	let height = 500;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<KFoldCV> was created with unknown prop '${key}'`);
    	});

    	const func_1 = (tick, d) => {
    		if (d > 59) return "#ffad97";
    		if (d >= 15 * (3 - (tick - 2)) && d < 15 * (3 - (tick - 2)) + 15) return "#f46ebb";
    		return "#003181";
    	};

    	function div_elementresize_handler() {
    		width = this.offsetWidth;
    		height = this.offsetHeight;
    		$$invalidate(0, width);
    		$$invalidate(1, height);
    	}

    	$$self.$capture_state = () => ({
    		scaleLinear: linear,
    		scaleBand: band,
    		margin,
    		arrowPath,
    		StackedRects,
    		width,
    		height,
    		nSplits: nSplits$1,
    		xDiff,
    		yScale,
    		xScale,
    		$margin
    	});

    	$$self.$inject_state = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('xDiff' in $$props) $$invalidate(2, xDiff = $$props.xDiff);
    		if ('yScale' in $$props) $$invalidate(3, yScale = $$props.yScale);
    		if ('xScale' in $$props) $$invalidate(4, xScale = $$props.xScale);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*width*/ 1) {
    			$$invalidate(4, xScale = linear().domain([-1, nSplits$1]).range([0, width]));
    		}

    		if ($$self.$$.dirty & /*height*/ 2) {
    			$$invalidate(3, yScale = linear().domain([-1, 1]).range([height, 0]));
    		}

    		if ($$self.$$.dirty & /*width*/ 1) {
    			$$invalidate(2, xDiff = width / ((nSplits$1 + 1) * 4));
    		}
    	};

    	return [
    		width,
    		height,
    		xDiff,
    		yScale,
    		xScale,
    		$margin,
    		func_1,
    		div_elementresize_handler
    	];
    }

    class KFoldCV extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "KFoldCV",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/Components/LOOCV.svelte generated by Svelte v3.48.0 */
    const file$1 = "src/Components/LOOCV.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (74:6) {:else}
    function create_else_block(ctx) {
    	let stackedrects;
    	let current;

    	function func_1(...args) {
    		return /*func_1*/ ctx[6](/*tick*/ ctx[9], ...args);
    	}

    	stackedrects = new StackedRects({
    			props: {
    				height: /*height*/ ctx[1],
    				numCol,
    				numRects,
    				x: /*xScale*/ ctx[4](/*tick*/ ctx[9]) - /*xDiff*/ ctx[2],
    				fillRule: func_1
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(stackedrects.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(stackedrects, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const stackedrects_changes = {};
    			if (dirty & /*height*/ 2) stackedrects_changes.height = /*height*/ ctx[1];
    			if (dirty & /*xScale, xDiff*/ 20) stackedrects_changes.x = /*xScale*/ ctx[4](/*tick*/ ctx[9]) - /*xDiff*/ ctx[2];
    			stackedrects.$set(stackedrects_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stackedrects.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stackedrects.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(stackedrects, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(74:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (64:27) 
    function create_if_block_1(ctx) {
    	let stackedrects;
    	let current;

    	stackedrects = new StackedRects({
    			props: {
    				height: /*height*/ ctx[1],
    				numCol,
    				numRects,
    				x: /*xScale*/ ctx[4](/*tick*/ ctx[9]) - /*xDiff*/ ctx[2],
    				fillRule: func
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(stackedrects.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(stackedrects, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const stackedrects_changes = {};
    			if (dirty & /*height*/ 2) stackedrects_changes.height = /*height*/ ctx[1];
    			if (dirty & /*xScale, xDiff*/ 20) stackedrects_changes.x = /*xScale*/ ctx[4](/*tick*/ ctx[9]) - /*xDiff*/ ctx[2];
    			stackedrects.$set(stackedrects_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stackedrects.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stackedrects.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(stackedrects, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(64:27) ",
    		ctx
    	});

    	return block;
    }

    // (51:6) {#if tick === 1}
    function create_if_block(ctx) {
    	let g;
    	let path;
    	let g_transform_value;

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			path = svg_element("path");
    			attr_dev(path, "d", arrowPath);
    			attr_dev(path, "style", `transform: scale(0.05)`);
    			attr_dev(path, "stroke", "#232f3e");
    			attr_dev(path, "stroke-width", "3");
    			attr_dev(path, "fill", "#232f3e");
    			add_location(path, file$1, 55, 10, 2130);
    			attr_dev(g, "transform", g_transform_value = "translate(" + (/*xScale*/ ctx[4](/*tick*/ ctx[9]) - /*xDiff*/ ctx[2] - 7) + ", " + (/*yScale*/ ctx[3](0) - /*xDiff*/ ctx[2]) + ")");
    			add_location(g, file$1, 52, 8, 2026);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			append_dev(g, path);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*xScale, xDiff, yScale*/ 28 && g_transform_value !== (g_transform_value = "translate(" + (/*xScale*/ ctx[4](/*tick*/ ctx[9]) - /*xDiff*/ ctx[2] - 7) + ", " + (/*yScale*/ ctx[3](0) - /*xDiff*/ ctx[2]) + ")")) {
    				attr_dev(g, "transform", g_transform_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(51:6) {#if tick === 1}",
    		ctx
    	});

    	return block;
    }

    // (50:4) {#each [...Array(nSplits).keys()] as tick}
    function create_each_block(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*tick*/ ctx[9] === 1) return 0;
    		if (/*tick*/ ctx[9] === 0) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(50:4) {#each [...Array(nSplits).keys()] as tick}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let h1;
    	let span0;
    	let t1;
    	let t2;
    	let p0;
    	let t4;
    	let br0;
    	let t5;
    	let div;
    	let svg;
    	let g;
    	let rect0;
    	let text0;
    	let t6;
    	let rect1;
    	let text1;
    	let t7;
    	let rect2;
    	let text2;
    	let t8;
    	let g_transform_value;
    	let svg_height_value;
    	let div_resize_listener;
    	let t9;
    	let br1;
    	let br2;
    	let t10;
    	let p1;
    	let t11;
    	let span1;
    	let t13;
    	let current;
    	let each_value = [...Array(nSplits).keys()];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			span0 = element("span");
    			span0.textContent = ">";
    			t1 = text(" Leave-One-Out Cross-Validation (LOOCV)");
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "A special case of k-fold cross-validation, called *leave one out cv*, occurs\n  when we set k equal to n, the number of observations in our dataset. In\n  leave-one-out cross-validation, our data is repeatedly split into a training\n  set containing all but one observations, and a validation set containing the\n  remaining left out observation. That is, the training set consists of n-1\n  observations, and the validation set consists of just one individual\n  observation:";
    			t4 = space();
    			br0 = element("br");
    			t5 = space();
    			div = element("div");
    			svg = svg_element("svg");
    			g = svg_element("g");
    			rect0 = svg_element("rect");
    			text0 = svg_element("text");
    			t6 = text("Train");
    			rect1 = svg_element("rect");
    			text1 = svg_element("text");
    			t7 = text("Validation");
    			rect2 = svg_element("rect");
    			text2 = svg_element("text");
    			t8 = text("Test");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t9 = space();
    			br1 = element("br");
    			br2 = element("br");
    			t10 = space();
    			p1 = element("p");
    			t11 = text("LOOCV carries all the same benefits mentioned previously, as well as some more\n  we'll discuss in the Bias Variance tradeoff section below (though these may be\n  contentioius!). However, large value of k used in LOOCV carries some\n  additional costs, namely that it requires re-training our data ");
    			span1 = element("span");
    			span1.textContent = "many";
    			t13 = text("\n  times (once for every data point!). This is expensive both in the amount of resources\n  it requires, as well as the time it takes to wait for your model to train on so\n  many iterations. For this reason, it's rare to see LOOCV employed in the wild,\n  (especially for large-scale models), and a more conservative value of k is often\n  used (e.g. k = 5 or k = 10).");
    			attr_dev(span0, "class", "section-arrow");
    			add_location(span0, file$1, 23, 2, 634);
    			attr_dev(h1, "class", "body-header");
    			add_location(h1, file$1, 22, 0, 607);
    			attr_dev(p0, "class", "body-text");
    			add_location(p0, file$1, 25, 0, 720);
    			add_location(br0, file$1, 34, 0, 1220);
    			attr_dev(rect0, "x", 0);
    			attr_dev(rect0, "y", "3");
    			attr_dev(rect0, "fill", "#003181");
    			attr_dev(rect0, "width", "12");
    			attr_dev(rect0, "height", "12");
    			add_location(rect0, file$1, 40, 6, 1457);
    			attr_dev(text0, "class", "legend-text svelte-1fpr9wp");
    			attr_dev(text0, "x", 15);
    			attr_dev(text0, "y", "15");
    			add_location(text0, file$1, 41, 6, 1522);
    			attr_dev(rect1, "x", 65);
    			attr_dev(rect1, "y", "3");
    			attr_dev(rect1, "fill", "#f46ebb");
    			attr_dev(rect1, "width", "12");
    			attr_dev(rect1, "height", "12");
    			add_location(rect1, file$1, 42, 6, 1581);
    			attr_dev(text1, "class", "legend-text svelte-1fpr9wp");
    			attr_dev(text1, "x", 80);
    			attr_dev(text1, "y", "15");
    			add_location(text1, file$1, 43, 6, 1647);
    			attr_dev(rect2, "x", 170);
    			attr_dev(rect2, "y", "3");
    			attr_dev(rect2, "fill", "#ffad97");
    			attr_dev(rect2, "width", "12");
    			attr_dev(rect2, "height", "12");
    			add_location(rect2, file$1, 44, 6, 1711);
    			attr_dev(text2, "class", "legend-text svelte-1fpr9wp");
    			attr_dev(text2, "x", 185);
    			attr_dev(text2, "y", "15");
    			add_location(text2, file$1, 45, 6, 1778);
    			attr_dev(g, "class", "g-tag");
    			attr_dev(g, "transform", g_transform_value = "translate(" + (/*width*/ ctx[0] / 2 - 102) + ", " + 0 + ")");
    			add_location(g, file$1, 39, 4, 1387);
    			attr_dev(svg, "width", /*width*/ ctx[0]);
    			attr_dev(svg, "height", svg_height_value = /*height*/ ctx[1] + /*$margin*/ ctx[5].top + /*$margin*/ ctx[5].bottom);
    			add_location(svg, file$1, 37, 2, 1302);
    			attr_dev(div, "id", "cv-chart");
    			attr_dev(div, "class", "svelte-1fpr9wp");
    			add_render_callback(() => /*div_elementresize_handler*/ ctx[7].call(div));
    			add_location(div, file$1, 36, 0, 1228);
    			add_location(br1, file$1, 108, 0, 3450);
    			add_location(br2, file$1, 108, 6, 3456);
    			attr_dev(span1, "class", "bold");
    			add_location(span1, file$1, 113, 65, 3783);
    			attr_dev(p1, "class", "body-text");
    			add_location(p1, file$1, 109, 0, 3463);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, span0);
    			append_dev(h1, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, g);
    			append_dev(g, rect0);
    			append_dev(g, text0);
    			append_dev(text0, t6);
    			append_dev(g, rect1);
    			append_dev(g, text1);
    			append_dev(text1, t7);
    			append_dev(g, rect2);
    			append_dev(g, text2);
    			append_dev(text2, t8);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(svg, null);
    			}

    			div_resize_listener = add_resize_listener(div, /*div_elementresize_handler*/ ctx[7].bind(div));
    			insert_dev(target, t9, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, br2, anchor);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, t11);
    			append_dev(p1, span1);
    			append_dev(p1, t13);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*width*/ 1 && g_transform_value !== (g_transform_value = "translate(" + (/*width*/ ctx[0] / 2 - 102) + ", " + 0 + ")")) {
    				attr_dev(g, "transform", g_transform_value);
    			}

    			if (dirty & /*xScale, Array, nSplits, xDiff, yScale, arrowPath, height, numCol, numRects*/ 30) {
    				each_value = [...Array(nSplits).keys()];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(svg, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*width*/ 1) {
    				attr_dev(svg, "width", /*width*/ ctx[0]);
    			}

    			if (!current || dirty & /*height, $margin*/ 34 && svg_height_value !== (svg_height_value = /*height*/ ctx[1] + /*$margin*/ ctx[5].top + /*$margin*/ ctx[5].bottom)) {
    				attr_dev(svg, "height", svg_height_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			div_resize_listener();
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(br2);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(p1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const nSplits = 23;
    const numCol = 1;
    const numRects = 26;

    const func = () => {
    	return "#232f3e";
    };

    function instance$2($$self, $$props, $$invalidate) {
    	let xScale;
    	let yScale;
    	let xDiff;
    	let $margin;
    	validate_store(margin, 'margin');
    	component_subscribe($$self, margin, $$value => $$invalidate(5, $margin = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LOOCV', slots, []);
    	let width = 500;
    	let height = 500;

    	let validationLabels = [
    		{ label: "Train", y: 5 },
    		{ label: "Validation", y: 13 },
    		{ label: "Test", y: 18 }
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LOOCV> was created with unknown prop '${key}'`);
    	});

    	const func_1 = (tick, d) => {
    		if (d > 20) return "#ffad97";
    		if (d === 24 - tick - 2) return "#f46ebb";
    		return "#003181";
    	};

    	function div_elementresize_handler() {
    		width = this.offsetWidth;
    		height = this.offsetHeight;
    		$$invalidate(0, width);
    		$$invalidate(1, height);
    	}

    	$$self.$capture_state = () => ({
    		scaleLinear: linear,
    		margin,
    		arrowPath,
    		StackedRects,
    		width,
    		height,
    		nSplits,
    		numCol,
    		numRects,
    		validationLabels,
    		xDiff,
    		yScale,
    		xScale,
    		$margin
    	});

    	$$self.$inject_state = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('validationLabels' in $$props) validationLabels = $$props.validationLabels;
    		if ('xDiff' in $$props) $$invalidate(2, xDiff = $$props.xDiff);
    		if ('yScale' in $$props) $$invalidate(3, yScale = $$props.yScale);
    		if ('xScale' in $$props) $$invalidate(4, xScale = $$props.xScale);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*width*/ 1) {
    			$$invalidate(4, xScale = linear().domain([-1, nSplits]).range([0, width]));
    		}

    		if ($$self.$$.dirty & /*height*/ 2) {
    			$$invalidate(3, yScale = linear().domain([-1, 1]).range([height, 0]));
    		}

    		if ($$self.$$.dirty & /*width*/ 1) {
    			$$invalidate(2, xDiff = width / ((nSplits + 1) * 4));
    		}
    	};

    	return [
    		width,
    		height,
    		xDiff,
    		yScale,
    		xScale,
    		$margin,
    		func_1,
    		div_elementresize_handler
    	];
    }

    class LOOCV extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LOOCV",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/Components/BiasVariance.svelte generated by Svelte v3.48.0 */

    const file = "src/Components/BiasVariance.svelte";

    function create_fragment$1(ctx) {
    	let section;
    	let h1;
    	let span0;
    	let t1;
    	let t2;
    	let p;
    	let t3;
    	let a;
    	let t5;
    	let br0;
    	let br1;
    	let t6;
    	let span1;
    	let t8;
    	let br2;
    	let t9;
    	let br3;
    	let br4;
    	let t10;
    	let span2;
    	let t12;
    	let br5;
    	let t13;
    	let sup0;
    	let sup1;
    	let t16;
    	let i;
    	let t18;
    	let sup2;
    	let t20;
    	let sup3;
    	let t22;
    	let span3;
    	let t24;
    	let br6;
    	let br7;
    	let t25;

    	const block = {
    		c: function create() {
    			section = element("section");
    			h1 = element("h1");
    			span0 = element("span");
    			span0.textContent = ">";
    			t1 = text(" Concerns With Selecting K");
    			t2 = space();
    			p = element("p");
    			t3 = text("Up to this point, we’ve talked about K-Folds Cross-Validation in the general\n    sense, and described the two most-extreme cases: LOOCV (k = n) and the\n    Validation Set Approach (k = 2). Given the different options for selecting\n    k, how do we select the best value? This question is actually more complex\n    than it may seem! In answering it, we'll revisit our old friend, the ");
    			a = element("a");
    			a.textContent = "Bias Variance Tradeoff";
    			t5 = text(", to understand how different values of k affect the quality of our\n    evaluation estimates.\n    ");
    			br0 = element("br");
    			br1 = element("br");
    			t6 = space();
    			span1 = element("span");
    			span1.textContent = "Bias";
    			t8 = space();
    			br2 = element("br");
    			t9 = text("\n    Let's start first with how k affects bias. When k = 2, we use only a handful\n    of the available data for model training, usually around 60 percent of the data.\n    On the other hand,the training set for LOOCV uses almost the entire dataset,\n    all n-1 observations, to train our model. Thus, LOOCV gives us approximately\n    unbiased estimates of our test error. In general, K-Folds Cross Validation will\n    use a training set with (k - 1) * n observations. Then, as our value of k increases,\n    the bias of our estimates should theoretically decrease, as larger training datasets\n    should better approzimate the test error. Under this framework, common choices\n    of k, like k = 5 or k = 10, will yield intermediate levels of bias, and low values\n    should yield high. Therefore, if we want to reduce the contribution of bias to\n    our evaluation estimates, we can increase k, increasing the data each model sees\n    during training. It's important to not get confused about what we're discussing\n    here: the bias here refers to our estimate of the test error from what we see\n    during training/validation. We're not discussing the bias of the test error itself,\n    E(hatfx) - f(x), which is not affected by the size of our training data.\n    \n    ");
    			br3 = element("br");
    			br4 = element("br");
    			t10 = space();
    			span2 = element("span");
    			span2.textContent = "Variance";
    			t12 = space();
    			br5 = element("br");
    			t13 = text("\n    The effect the value of k has on the variance of our estimates is where things\n    get more complex. It's often argued that the larger our value of k, the higher\n    the variance of our estimates, with LOOCV having very high variance.");
    			sup0 = element("sup");
    			sup0.textContent = "[kohavi]";
    			sup1 = element("sup");
    			sup1.textContent = "[esl]";
    			t16 = text(". The oft-cited intuition here is that the variance should\n    be higher for larger k, since each model is trained on nearly identical\n    data, meaning that every model should be nearly the same. However, other\n    researchers have demonstrated that this isn't true, and that LOOCV actually\n    has the smallest asymptocic bias\n    ");
    			i = element("i");
    			i.textContent = "and";
    			t18 = text("\n    variance for many models");
    			sup2 = element("sup");
    			sup2.textContent = "[zhang, yang";
    			t20 = text(", ");
    			sup3 = element("sup");
    			sup3.textContent = "burman]";
    			t22 = text(". From\n    their research, they saw that the that models worsen in variability for high\n    k are a result when model selection is involved:\n    ");
    			span3 = element("span");
    			span3.textContent = "\" ...if model selection is involved, the performance of LOO worsens in\n      variability as the model selection uncertainty gets higher due to large\n      model space, small penalty coefficients and/or the use of data-driven\n      penalty coefficients\"";
    			t24 = text(". We present both views here without taking a strong stance, and advise\n    only that you spend time for yourself understanding how such tradeoffs\n    manifest in your datasets.\n\n    ");
    			br6 = element("br");
    			br7 = element("br");
    			t25 = text("\n    We present both views without taking a strong stance, as regardless of what you\n    believe,\n    \n    \n\n    one thing is certain: higher values of k require training more models, so\n    often k=5 or k=10 is the largest you might be able to do in practice (if you\n    can use it at all)!");
    			attr_dev(span0, "class", "section-arrow");
    			add_location(span0, file, 5, 4, 61);
    			attr_dev(h1, "class", "body-header");
    			add_location(h1, file, 4, 2, 32);
    			attr_dev(a, "href", "https://mlu-explain.github.io/bias-variance/");
    			add_location(a, file, 12, 73, 547);
    			add_location(br0, file, 17, 4, 744);
    			add_location(br1, file, 17, 10, 750);
    			attr_dev(span1, "class", "bold");
    			add_location(span1, file, 18, 4, 761);
    			add_location(br2, file, 19, 4, 796);
    			add_location(br3, file, 47, 4, 2960);
    			add_location(br4, file, 47, 10, 2966);
    			attr_dev(span2, "class", "bold");
    			add_location(span2, file, 48, 4, 2977);
    			add_location(br5, file, 49, 4, 3016);
    			add_location(sup0, file, 52, 72, 3261);
    			add_location(sup1, file, 54, 5, 3292);
    			add_location(i, file, 59, 4, 3641);
    			add_location(sup2, file, 60, 28, 3680);
    			add_location(sup3, file, 60, 53, 3705);
    			attr_dev(span3, "id", "quote");
    			attr_dev(span3, "class", "svelte-16juomj");
    			add_location(span3, file, 63, 4, 3868);
    			add_location(br6, file, 72, 4, 4339);
    			add_location(br7, file, 72, 10, 4345);
    			attr_dev(p, "class", "body-text");
    			add_location(p, file, 7, 2, 138);
    			add_location(section, file, 3, 0, 20);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h1);
    			append_dev(h1, span0);
    			append_dev(h1, t1);
    			append_dev(section, t2);
    			append_dev(section, p);
    			append_dev(p, t3);
    			append_dev(p, a);
    			append_dev(p, t5);
    			append_dev(p, br0);
    			append_dev(p, br1);
    			append_dev(p, t6);
    			append_dev(p, span1);
    			append_dev(p, t8);
    			append_dev(p, br2);
    			append_dev(p, t9);
    			append_dev(p, br3);
    			append_dev(p, br4);
    			append_dev(p, t10);
    			append_dev(p, span2);
    			append_dev(p, t12);
    			append_dev(p, br5);
    			append_dev(p, t13);
    			append_dev(p, sup0);
    			append_dev(p, sup1);
    			append_dev(p, t16);
    			append_dev(p, i);
    			append_dev(p, t18);
    			append_dev(p, sup2);
    			append_dev(p, t20);
    			append_dev(p, sup3);
    			append_dev(p, t22);
    			append_dev(p, span3);
    			append_dev(p, t24);
    			append_dev(p, br6);
    			append_dev(p, br7);
    			append_dev(p, t25);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BiasVariance', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BiasVariance> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class BiasVariance extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BiasVariance",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.48.0 */

    function create_fragment(ctx) {
    	let logo;
    	let t0;
    	let title;
    	let t1;
    	let intro;
    	let t2;
    	let validationset;
    	let t3;
    	let kfoldcv;
    	let t4;
    	let kfoldinteractive;
    	let t5;
    	let loocv;
    	let t6;
    	let biasvariance;
    	let t7;
    	let conclusion;
    	let t8;
    	let resources;
    	let current;
    	logo = new Logo({ $$inline: true });
    	title = new Title({ $$inline: true });
    	intro = new Intro({ $$inline: true });
    	validationset = new ValidationSet({ $$inline: true });
    	kfoldcv = new KFoldCV({ $$inline: true });
    	kfoldinteractive = new KFoldInteractive({ $$inline: true });
    	loocv = new LOOCV({ $$inline: true });
    	biasvariance = new BiasVariance({ $$inline: true });
    	conclusion = new Conclusion({ $$inline: true });
    	resources = new Resources({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(logo.$$.fragment);
    			t0 = space();
    			create_component(title.$$.fragment);
    			t1 = space();
    			create_component(intro.$$.fragment);
    			t2 = space();
    			create_component(validationset.$$.fragment);
    			t3 = space();
    			create_component(kfoldcv.$$.fragment);
    			t4 = space();
    			create_component(kfoldinteractive.$$.fragment);
    			t5 = space();
    			create_component(loocv.$$.fragment);
    			t6 = space();
    			create_component(biasvariance.$$.fragment);
    			t7 = space();
    			create_component(conclusion.$$.fragment);
    			t8 = space();
    			create_component(resources.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(logo, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(title, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(intro, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(validationset, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(kfoldcv, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(kfoldinteractive, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(loocv, target, anchor);
    			insert_dev(target, t6, anchor);
    			mount_component(biasvariance, target, anchor);
    			insert_dev(target, t7, anchor);
    			mount_component(conclusion, target, anchor);
    			insert_dev(target, t8, anchor);
    			mount_component(resources, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro$1(local) {
    			if (current) return;
    			transition_in(logo.$$.fragment, local);
    			transition_in(title.$$.fragment, local);
    			transition_in(intro.$$.fragment, local);
    			transition_in(validationset.$$.fragment, local);
    			transition_in(kfoldcv.$$.fragment, local);
    			transition_in(kfoldinteractive.$$.fragment, local);
    			transition_in(loocv.$$.fragment, local);
    			transition_in(biasvariance.$$.fragment, local);
    			transition_in(conclusion.$$.fragment, local);
    			transition_in(resources.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(logo.$$.fragment, local);
    			transition_out(title.$$.fragment, local);
    			transition_out(intro.$$.fragment, local);
    			transition_out(validationset.$$.fragment, local);
    			transition_out(kfoldcv.$$.fragment, local);
    			transition_out(kfoldinteractive.$$.fragment, local);
    			transition_out(loocv.$$.fragment, local);
    			transition_out(biasvariance.$$.fragment, local);
    			transition_out(conclusion.$$.fragment, local);
    			transition_out(resources.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(logo, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(title, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(intro, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(validationset, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(kfoldcv, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(kfoldinteractive, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(loocv, detaching);
    			if (detaching) detach_dev(t6);
    			destroy_component(biasvariance, detaching);
    			if (detaching) detach_dev(t7);
    			destroy_component(conclusion, detaching);
    			if (detaching) detach_dev(t8);
    			destroy_component(resources, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Logo,
    		Title,
    		Intro,
    		KFoldInteractive,
    		Conclusion,
    		Resources,
    		ValidationSet,
    		KFoldCv: KFoldCV,
    		LOOCV,
    		BiasVariance
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
