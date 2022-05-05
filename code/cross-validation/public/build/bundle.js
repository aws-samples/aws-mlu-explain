
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop$1() { }
    const identity$3 = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
            return noop$1;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now$1 = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop$1;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
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
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
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
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
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
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
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

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch$1(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
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
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity$3, tick = noop$1, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now$1() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch$1(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch$1(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity$3, tick = noop$1, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now$1() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch$1(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch$1(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function each(items, fn) {
        let str = '';
        for (let i = 0; i < items.length; i += 1) {
            str += fn(items[i], i);
        }
        return str;
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
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
            update: noop$1,
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
            this.$destroy = noop$1;
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
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

    /* src/Components/Logo.svelte generated by Svelte v3.46.4 */

    const file$c = "src/Components/Logo.svelte";

    function create_fragment$d(ctx) {
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
    			add_location(path0, file$c, 10, 10, 326);
    			attr_dev(path1, "id", "Vector_2");
    			attr_dev(path1, "d", "M143.305 83.1836C149.523 83.1836 154.586 78.1289 154.586 71.8906V71.8242C154.586 65.5898 149.535 60.5312 143.305 60.5312C137.09 60.5312 132.027 65.5898 132.027 71.8242V71.8906C132.027 78.1289 137.078 83.1836 143.305 83.1836Z");
    			attr_dev(path1, "fill", /*robotLogoColor*/ ctx[1]);
    			add_location(path1, file$c, 15, 10, 655);
    			attr_dev(path2, "id", "Vector_3");
    			attr_dev(path2, "d", "M163.586 159.402H173.609V122.641H163.586V159.402Z");
    			attr_dev(path2, "fill", /*robotLogoColor*/ ctx[1]);
    			add_location(path2, file$c, 20, 10, 985);
    			attr_dev(path3, "id", "Vector_4");
    			attr_dev(path3, "d", "M60.3594 159.402H70.3867V122.641H60.3594V159.402Z");
    			attr_dev(path3, "fill", /*robotLogoColor*/ ctx[1]);
    			add_location(path3, file$c, 25, 10, 1140);
    			attr_dev(path4, "id", "Vector_5");
    			attr_dev(path4, "d", "M182.16 30.0781H51.8047V10.0234H182.16V30.0781ZM182.16 103.609H51.8047V40.1055H182.16V103.609ZM144.559 168.789H89.4062V113.641H144.559V168.789ZM0 0V10.0234H15.8789V46.7891H25.9023V10.0234H41.7812V113.641H79.3867V178.816H96.9297V215.578H106.957V178.816H127.016V215.578H137.039V178.816H154.586V113.641H192.188V10.0234H233.969V0");
    			attr_dev(path4, "fill", /*robotLogoColor*/ ctx[1]);
    			add_location(path4, file$c, 31, 12, 1322);
    			attr_dev(g0, "id", "Group");
    			add_location(g0, file$c, 30, 10, 1295);
    			add_location(g1, file$c, 9, 8, 312);
    			attr_dev(g2, "id", "mlu_robot 1");
    			attr_dev(g2, "clip-path", "url(#clip0)");
    			add_location(g2, file$c, 8, 6, 259);
    			attr_dev(rect, "width", "233.97");
    			attr_dev(rect, "height", "215.58");
    			attr_dev(rect, "fill", "black");
    			add_location(rect, file$c, 41, 10, 1843);
    			attr_dev(clipPath, "id", "clip0");
    			add_location(clipPath, file$c, 40, 8, 1811);
    			add_location(defs, file$c, 39, 6, 1796);
    			attr_dev(svg, "width", "30");
    			attr_dev(svg, "height", "30");
    			attr_dev(svg, "viewBox", "0 0 234 216");
    			add_location(svg, file$c, 7, 5, 202);
    			attr_dev(span, "id", "ai");
    			attr_dev(span, "class", "svelte-1lvf5is");
    			add_location(span, file$c, 45, 29, 1970);
    			attr_dev(h2, "class", "logo svelte-1lvf5is");
    			add_location(h2, file$c, 45, 4, 1945);
    			attr_dev(a, "href", "https://mlu-explain.github.io");
    			attr_dev(a, "class", "svelte-1lvf5is");
    			add_location(a, file$c, 6, 2, 157);
    			attr_dev(div, "id", "intro-icon");
    			set_style(div, "--ai-color", /*aiLogoColor*/ ctx[0]);
    			attr_dev(div, "class", "svelte-1lvf5is");
    			add_location(div, file$c, 5, 0, 99);
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
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Logo', slots, []);
    	let { aiLogoColor = "#f46ebb" } = $$props;
    	let { robotLogoColor = "#232F3E" } = $$props;
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
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { aiLogoColor: 0, robotLogoColor: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Logo",
    			options,
    			id: create_fragment$d.name
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

    const t="http://www.w3.org/2000/svg";class e{constructor(t){this.seed=t;}next(){return this.seed?(2**31-1&(this.seed=Math.imul(48271,this.seed)))/2**31:Math.random()}}function s(t,e,s,i,n){return {type:"path",ops:c$1(t,e,s,i,n)}}function i(t,e,i){const n=(t||[]).length;if(n>2){const s=[];for(let e=0;e<n-1;e++)s.push(...c$1(t[e][0],t[e][1],t[e+1][0],t[e+1][1],i));return e&&s.push(...c$1(t[n-1][0],t[n-1][1],t[0][0],t[0][1],i)),{type:"path",ops:s}}return 2===n?s(t[0][0],t[0][1],t[1][0],t[1][1],i):{type:"path",ops:[]}}function n(t,e,s,n,o){return function(t,e){return i(t,!0,e)}([[t,e],[t+s,e],[t+s,e+n],[t,e+n]],o)}function o(t,e,s,i,n){return function(t,e,s,i){const[n,o]=l(i.increment,t,e,i.rx,i.ry,1,i.increment*h(.1,h(.4,1,s),s),s);let r=f(n,null,s);if(!s.disableMultiStroke){const[n]=l(i.increment,t,e,i.rx,i.ry,1.5,0,s),o=f(n,null,s);r=r.concat(o);}return {estimatedPoints:o,opset:{type:"path",ops:r}}}(t,e,n,function(t,e,s){const i=Math.sqrt(2*Math.PI*Math.sqrt((Math.pow(t/2,2)+Math.pow(e/2,2))/2)),n=Math.max(s.curveStepCount,s.curveStepCount/Math.sqrt(200)*i),o=2*Math.PI/n;let r=Math.abs(t/2),h=Math.abs(e/2);const c=1-s.curveFitting;return r+=a$1(r*c,s),h+=a$1(h*c,s),{increment:o,rx:r,ry:h}}(s,i,n)).opset}function r(t){return t.randomizer||(t.randomizer=new e(t.seed||0)),t.randomizer.next()}function h(t,e,s,i=1){return s.roughness*i*(r(s)*(e-t)+t)}function a$1(t,e,s=1){return h(-t,t,e,s)}function c$1(t,e,s,i,n,o=!1){const r=o?n.disableMultiStrokeFill:n.disableMultiStroke,h=u(t,e,s,i,n,!0,!1);if(r)return h;const a=u(t,e,s,i,n,!0,!0);return h.concat(a)}function u(t,e,s,i,n,o,h){const c=Math.pow(t-s,2)+Math.pow(e-i,2),u=Math.sqrt(c);let f=1;f=u<200?1:u>500?.4:-.0016668*u+1.233334;let l=n.maxRandomnessOffset||0;l*l*100>c&&(l=u/10);const g=l/2,d=.2+.2*r(n);let p=n.bowing*n.maxRandomnessOffset*(i-e)/200,_=n.bowing*n.maxRandomnessOffset*(t-s)/200;p=a$1(p,n,f),_=a$1(_,n,f);const m=[],w=()=>a$1(g,n,f),v=()=>a$1(l,n,f);return o&&(h?m.push({op:"move",data:[t+w(),e+w()]}):m.push({op:"move",data:[t+a$1(l,n,f),e+a$1(l,n,f)]})),h?m.push({op:"bcurveTo",data:[p+t+(s-t)*d+w(),_+e+(i-e)*d+w(),p+t+2*(s-t)*d+w(),_+e+2*(i-e)*d+w(),s+w(),i+w()]}):m.push({op:"bcurveTo",data:[p+t+(s-t)*d+v(),_+e+(i-e)*d+v(),p+t+2*(s-t)*d+v(),_+e+2*(i-e)*d+v(),s+v(),i+v()]}),m}function f(t,e,s){const i=t.length,n=[];if(i>3){const o=[],r=1-s.curveTightness;n.push({op:"move",data:[t[1][0],t[1][1]]});for(let e=1;e+2<i;e++){const s=t[e];o[0]=[s[0],s[1]],o[1]=[s[0]+(r*t[e+1][0]-r*t[e-1][0])/6,s[1]+(r*t[e+1][1]-r*t[e-1][1])/6],o[2]=[t[e+1][0]+(r*t[e][0]-r*t[e+2][0])/6,t[e+1][1]+(r*t[e][1]-r*t[e+2][1])/6],o[3]=[t[e+1][0],t[e+1][1]],n.push({op:"bcurveTo",data:[o[1][0],o[1][1],o[2][0],o[2][1],o[3][0],o[3][1]]});}if(e&&2===e.length){const t=s.maxRandomnessOffset;n.push({op:"lineTo",data:[e[0]+a$1(t,s),e[1]+a$1(t,s)]});}}else 3===i?(n.push({op:"move",data:[t[1][0],t[1][1]]}),n.push({op:"bcurveTo",data:[t[1][0],t[1][1],t[2][0],t[2][1],t[2][0],t[2][1]]})):2===i&&n.push(...c$1(t[0][0],t[0][1],t[1][0],t[1][1],s));return n}function l(t,e,s,i,n,o,r,h){const c=[],u=[],f=a$1(.5,h)-Math.PI/2;u.push([a$1(o,h)+e+.9*i*Math.cos(f-t),a$1(o,h)+s+.9*n*Math.sin(f-t)]);for(let r=f;r<2*Math.PI+f-.01;r+=t){const t=[a$1(o,h)+e+i*Math.cos(r),a$1(o,h)+s+n*Math.sin(r)];c.push(t),u.push(t);}return u.push([a$1(o,h)+e+i*Math.cos(f+2*Math.PI+.5*r),a$1(o,h)+s+n*Math.sin(f+2*Math.PI+.5*r)]),u.push([a$1(o,h)+e+.98*i*Math.cos(f+r),a$1(o,h)+s+.98*n*Math.sin(f+r)]),u.push([a$1(o,h)+e+.9*i*Math.cos(f+.5*r),a$1(o,h)+s+.9*n*Math.sin(f+.5*r)]),[u,c]}function g(t,e){return {maxRandomnessOffset:2,roughness:"highlight"===t?3:1.5,bowing:1,stroke:"#000",strokeWidth:1.5,curveTightness:0,curveFitting:.95,curveStepCount:9,fillStyle:"hachure",fillWeight:-1,hachureAngle:-41,hachureGap:-1,dashOffset:-1,dashGap:-1,zigzagOffset:-1,combineNestedSvgPaths:!1,disableMultiStroke:"double"!==t,disableMultiStrokeFill:!1,seed:e}}function d(e,r,h,a,c,u){const f=[];let l=h.strokeWidth||2;const d=function(t){const e=t.padding;if(e||0===e){if("number"==typeof e)return [e,e,e,e];if(Array.isArray(e)){const t=e;if(t.length)switch(t.length){case 4:return [...t];case 1:return [t[0],t[0],t[0],t[0]];case 2:return [...t,...t];case 3:return [...t,t[1]];default:return [t[0],t[1],t[2],t[3]]}}}return [5,5,5,5]}(h),p=void 0===h.animate||!!h.animate,_=h.iterations||2,m=g("single",u);switch(h.type){case"underline":{const t=r.y+r.h+d[2];for(let e=0;e<_;e++)e%2?f.push(s(r.x+r.w,t,r.x,t,m)):f.push(s(r.x,t,r.x+r.w,t,m));break}case"strike-through":{const t=r.y+r.h/2;for(let e=0;e<_;e++)e%2?f.push(s(r.x+r.w,t,r.x,t,m)):f.push(s(r.x,t,r.x+r.w,t,m));break}case"box":{const t=r.x-d[3],e=r.y-d[0],s=r.w+(d[1]+d[3]),i=r.h+(d[0]+d[2]);for(let o=0;o<_;o++)f.push(n(t,e,s,i,m));break}case"bracket":{const t=Array.isArray(h.brackets)?h.brackets:h.brackets?[h.brackets]:["right"],e=r.x-2*d[3],s=r.x+r.w+2*d[1],n=r.y-2*d[0],o=r.y+r.h+2*d[2];for(const h of t){let t;switch(h){case"bottom":t=[[e,r.y+r.h],[e,o],[s,o],[s,r.y+r.h]];break;case"top":t=[[e,r.y],[e,n],[s,n],[s,r.y]];break;case"left":t=[[r.x,n],[e,n],[e,o],[r.x,o]];break;case"right":t=[[r.x+r.w,n],[s,n],[s,o],[r.x+r.w,o]];}t&&f.push(i(t,!1,m));}break}case"crossed-off":{const t=r.x,e=r.y,i=t+r.w,n=e+r.h;for(let o=0;o<_;o++)o%2?f.push(s(i,n,t,e,m)):f.push(s(t,e,i,n,m));for(let o=0;o<_;o++)o%2?f.push(s(t,n,i,e,m)):f.push(s(i,e,t,n,m));break}case"circle":{const t=g("double",u),e=r.w+(d[1]+d[3]),s=r.h+(d[0]+d[2]),i=r.x-d[3]+e/2,n=r.y-d[0]+s/2,h=Math.floor(_/2),a=_-2*h;for(let r=0;r<h;r++)f.push(o(i,n,e,s,t));for(let t=0;t<a;t++)f.push(o(i,n,e,s,m));break}case"highlight":{const t=g("highlight",u);l=.95*r.h;const e=r.y+r.h/2;for(let i=0;i<_;i++)i%2?f.push(s(r.x+r.w,e,r.x,e,t)):f.push(s(r.x,e,r.x+r.w,e,t));break}}if(f.length){const s=function(t){const e=[];for(const s of t){let t="";for(const i of s.ops){const s=i.data;switch(i.op){case"move":t.trim()&&e.push(t.trim()),t=`M${s[0]} ${s[1]} `;break;case"bcurveTo":t+=`C${s[0]} ${s[1]}, ${s[2]} ${s[3]}, ${s[4]} ${s[5]} `;break;case"lineTo":t+=`L${s[0]} ${s[1]} `;}}t.trim()&&e.push(t.trim());}return e}(f),i=[],n=[];let o=0;const r=(t,e,s)=>t.setAttribute(e,s);for(const a of s){const s=document.createElementNS(t,"path");if(r(s,"d",a),r(s,"fill","none"),r(s,"stroke",h.color||"currentColor"),r(s,"stroke-width",""+l),p){const t=s.getTotalLength();i.push(t),o+=t;}e.appendChild(s),n.push(s);}if(p){let t=0;for(let e=0;e<n.length;e++){const s=n[e],r=i[e],h=o?c*(r/o):0,u=a+t,f=s.style;f.strokeDashoffset=""+r,f.strokeDasharray=""+r,f.animation=`rough-notation-dash ${h}ms ease-out ${u}ms forwards`,t+=h;}}}}class p{constructor(t,e){this._state="unattached",this._resizing=!1,this._seed=Math.floor(Math.random()*2**31),this._lastSizes=[],this._animationDelay=0,this._resizeListener=()=>{this._resizing||(this._resizing=!0,setTimeout(()=>{this._resizing=!1,"showing"===this._state&&this.haveRectsChanged()&&this.show();},400));},this._e=t,this._config=JSON.parse(JSON.stringify(e)),this.attach();}get animate(){return this._config.animate}set animate(t){this._config.animate=t;}get animationDuration(){return this._config.animationDuration}set animationDuration(t){this._config.animationDuration=t;}get iterations(){return this._config.iterations}set iterations(t){this._config.iterations=t;}get color(){return this._config.color}set color(t){this._config.color!==t&&(this._config.color=t,this.refresh());}get strokeWidth(){return this._config.strokeWidth}set strokeWidth(t){this._config.strokeWidth!==t&&(this._config.strokeWidth=t,this.refresh());}get padding(){return this._config.padding}set padding(t){this._config.padding!==t&&(this._config.padding=t,this.refresh());}attach(){if("unattached"===this._state&&this._e.parentElement){!function(){if(!window.__rno_kf_s){const t=window.__rno_kf_s=document.createElement("style");t.textContent="@keyframes rough-notation-dash { to { stroke-dashoffset: 0; } }",document.head.appendChild(t);}}();const e=this._svg=document.createElementNS(t,"svg");e.setAttribute("class","rough-annotation");const s=e.style;s.position="absolute",s.top="0",s.left="0",s.overflow="visible",s.pointerEvents="none",s.width="100px",s.height="100px";const i="highlight"===this._config.type;if(this._e.insertAdjacentElement(i?"beforebegin":"afterend",e),this._state="not-showing",i){const t=window.getComputedStyle(this._e).position;(!t||"static"===t)&&(this._e.style.position="relative");}this.attachListeners();}}detachListeners(){window.removeEventListener("resize",this._resizeListener),this._ro&&this._ro.unobserve(this._e);}attachListeners(){this.detachListeners(),window.addEventListener("resize",this._resizeListener,{passive:!0}),!this._ro&&"ResizeObserver"in window&&(this._ro=new window.ResizeObserver(t=>{for(const e of t)e.contentRect&&this._resizeListener();})),this._ro&&this._ro.observe(this._e);}haveRectsChanged(){if(this._lastSizes.length){const t=this.rects();if(t.length!==this._lastSizes.length)return !0;for(let e=0;e<t.length;e++)if(!this.isSameRect(t[e],this._lastSizes[e]))return !0}return !1}isSameRect(t,e){const s=(t,e)=>Math.round(t)===Math.round(e);return s(t.x,e.x)&&s(t.y,e.y)&&s(t.w,e.w)&&s(t.h,e.h)}isShowing(){return "not-showing"!==this._state}refresh(){this.isShowing()&&!this.pendingRefresh&&(this.pendingRefresh=Promise.resolve().then(()=>{this.isShowing()&&this.show(),delete this.pendingRefresh;}));}show(){switch(this._state){case"unattached":break;case"showing":this.hide(),this._svg&&this.render(this._svg,!0);break;case"not-showing":this.attach(),this._svg&&this.render(this._svg,!1);}}hide(){if(this._svg)for(;this._svg.lastChild;)this._svg.removeChild(this._svg.lastChild);this._state="not-showing";}remove(){this._svg&&this._svg.parentElement&&this._svg.parentElement.removeChild(this._svg),this._svg=void 0,this._state="unattached",this.detachListeners();}render(t,e){let s=this._config;e&&(s=JSON.parse(JSON.stringify(this._config)),s.animate=!1);const i=this.rects();let n=0;i.forEach(t=>n+=t.w);const o=s.animationDuration||800;let r=0;for(let e=0;e<i.length;e++){const h=o*(i[e].w/n);d(t,i[e],s,r+this._animationDelay,h,this._seed),r+=h;}this._lastSizes=i,this._state="showing";}rects(){const t=[];if(this._svg)if(this._config.multiline){const e=this._e.getClientRects();for(let s=0;s<e.length;s++)t.push(this.svgRect(this._svg,e[s]));}else t.push(this.svgRect(this._svg,this._e.getBoundingClientRect()));return t}svgRect(t,e){const s=t.getBoundingClientRect(),i=e;return {x:(i.x||i.left)-(s.x||s.left),y:(i.y||i.top)-(s.y||s.top),w:i.width,h:i.height}}}function _(t,e){return new p(t,e)}

    /* src/Components/Title.svelte generated by Svelte v3.46.4 */
    const file$b = "src/Components/Title.svelte";

    function create_fragment$c(ctx) {
    	let section;
    	let h10;
    	let span;
    	let t0;
    	let br;
    	let t1;
    	let t2;
    	let h11;
    	let t4;
    	let h3;
    	let a0;
    	let t6;
    	let a1;
    	let t8;

    	const block = {
    		c: function create() {
    			section = element("section");
    			h10 = element("h1");
    			span = element("span");
    			t0 = text("K-Fold");
    			br = element("br");
    			t1 = text("Cross Validation");
    			t2 = space();
    			h11 = element("h1");
    			h11.textContent = "More is Less is More is Less";
    			t4 = space();
    			h3 = element("h3");
    			a0 = element("a");
    			a0.textContent = "Jared Wilber";
    			t6 = text(" &\n    ");
    			a1 = element("a");
    			a1.textContent = "Jasper Croome";
    			t8 = text(", May\n    2022");
    			add_location(br, file$b, 24, 30, 501);
    			attr_dev(span, "id", "title-cv");
    			add_location(span, file$b, 24, 4, 475);
    			attr_dev(h10, "id", "intro-hed");
    			attr_dev(h10, "class", "title-cv svelte-wb84y8");
    			add_location(h10, file$b, 23, 2, 434);
    			attr_dev(h11, "class", "intro-sub svelte-wb84y8");
    			add_location(h11, file$b, 26, 2, 541);
    			attr_dev(a0, "href", "https://twitter.com/jdwlbr");
    			attr_dev(a0, "class", "svelte-wb84y8");
    			add_location(a0, file$b, 28, 4, 625);
    			attr_dev(a1, "href", "https://www.linkedin.com/in/jaspercroome/");
    			attr_dev(a1, "class", "svelte-wb84y8");
    			add_location(a1, file$b, 29, 4, 685);
    			attr_dev(h3, "id", "intro__date");
    			attr_dev(h3, "class", "svelte-wb84y8");
    			add_location(h3, file$b, 27, 2, 599);
    			attr_dev(section, "id", "intro");
    			attr_dev(section, "class", "svelte-wb84y8");
    			add_location(section, file$b, 22, 0, 411);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h10);
    			append_dev(h10, span);
    			append_dev(span, t0);
    			append_dev(span, br);
    			append_dev(span, t1);
    			append_dev(section, t2);
    			append_dev(section, h11);
    			append_dev(section, t4);
    			append_dev(section, h3);
    			append_dev(h3, a0);
    			append_dev(h3, t6);
    			append_dev(h3, a1);
    			append_dev(h3, t8);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
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
    	validate_slots('Title', slots, []);

    	onMount(() => {
    		const n1 = document.querySelector(".title-cv");

    		const a1 = _(n1, {
    			type: "box",
    			color: "#f46ebb",
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
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Title",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src/Components/Intro.svelte generated by Svelte v3.46.4 */

    const file$a = "src/Components/Intro.svelte";

    function create_fragment$b(ctx) {
    	let section;
    	let p;

    	const block = {
    		c: function create() {
    			section = element("section");
    			p = element("p");
    			p.textContent = "Often in machine learning we want to compare and evaluate models without\n    having to wait for new data. Of course, we could just evaluate predictions\n    on the same data that we used to fit our model’s parameters, but this will\n    give unreliable assessments of our model's ability to generalize. Thus, we’d\n    like to find a way to assess the generalization capabilities of our model\n    without waiting for new data. This article discusses one of the most common\n    approaches for this task: *cross-validation*. We'll first discuss the\n    approach we previously learned, introduce some new approaches, and discuss\n    what values of k are commonly selected and why.";
    			attr_dev(p, "class", "body-text");
    			add_location(p, file$a, 4, 2, 32);
    			add_location(section, file$a, 3, 0, 20);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, p);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
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

    function instance$b($$self, $$props) {
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
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Intro",
    			options,
    			id: create_fragment$b.name
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

    function range(start, stop, step) {
      start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

      var i = -1,
          n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
          range = new Array(n);

      while (++i < n) {
        range[i] = start + i * step;
      }

      return range;
    }

    function initRange$1(domain, range) {
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

      initRange$1.apply(scale, arguments);

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
        var values = range(n).map(function(i) { return start + step * i; });
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

      return initRange$1.apply(rescale(), arguments);
    }

    function pointish(scale) {
      var copy = scale.copy;

      scale.padding = scale.paddingOuter;
      delete scale.paddingInner;
      delete scale.paddingOuter;

      scale.copy = function() {
        return pointish(copy());
      };

      return scale;
    }

    function point() {
      return pointish(band.apply(null, arguments).paddingInner(1));
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

    function identity$2(x) {
      return x;
    }

    var map = Array.prototype.map,
        prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

    function formatLocale(locale) {
      var group = locale.grouping === undefined || locale.thousands === undefined ? identity$2 : formatGroup(map.call(locale.grouping, Number), locale.thousands + ""),
          currencyPrefix = locale.currency === undefined ? "" : locale.currency[0] + "",
          currencySuffix = locale.currency === undefined ? "" : locale.currency[1] + "",
          decimal = locale.decimal === undefined ? "." : locale.decimal + "",
          numerals = locale.numerals === undefined ? identity$2 : formatNumerals(map.call(locale.numerals, String)),
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

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop$1) {
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
        function subscribe(run, invalidate = noop$1) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop$1;
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
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop$1;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop$1;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    /**
    	A function to help truth test values. Returns a `true` if zero.
    	@type {number} val The value to test.
    	@returns {boolean}
    */
    function canBeZero (val) {
    	if (val === 0) {
    		return true;
    	}
    	return val;
    }

    /**
    	Make an accessor from a string, number, function or an array of the combination of any
    	@param {String|Number|Function|Array} acc The accessor function, key or list of them.
    	@returns {Function} An accessor function.
    */
    function makeAccessor (acc) {
    	if (!canBeZero(acc)) return null;
    	if (Array.isArray(acc)) {
    		return d => acc.map(k => {
    			return typeof k !== 'function' ? d[k] : k(d);
    		});
    	} else if (typeof acc !== 'function') { // eslint-disable-line no-else-return
    		return d => d[acc];
    	}
    	return acc;
    }

    /**
    	Remove undefined fields from an object
    	@type {object} obj The object to filter
    	@type {object} [comparisonObj={}] TK
    	@returns {object}
    */

    // From Object.fromEntries polyfill https://github.com/tc39/proposal-object-from-entries/blob/master/polyfill.js#L1
    function fromEntries(iter) {
    	const obj = {};

    	for (const pair of iter) {
    		if (Object(pair) !== pair) {
    			throw new TypeError("iterable for fromEntries should yield objects");
    		}

    		// Consistency with Map: contract is that entry has "0" and "1" keys, not
    		// that it is an array or iterable.

    		const { "0": key, "1": val } = pair;

    		Object.defineProperty(obj, key, {
    			configurable: true,
    			enumerable: true,
    			writable: true,
    			value: val,
    		});
    	}

    	return obj;
    }

    function filterObject (obj, comparisonObj = {}) {
    	return fromEntries(Object.entries(obj).filter(([key, value]) => {
    		return value !== undefined
    			&& comparisonObj[key] === undefined;
    	}));
    }

    /**
    	Calculate the extents of desired fields
    	For example, data like this:
    	[{ x: 0, y: -10 }, { x: 10, y: 0 }, { x: 5, y: 10 }]
    	and a fields object like this:
    	`{'x': d => d.x, 'y': d => d.y}`
    	returns an object like this:
    	`{ x: [0, 10], y: [-10, 10] }`
    	@param {Array} data A flat array of objects.
    	@param {{x?: Function, y?: Function, z?: Function, r?: Function}} fields An object containing `x`, `y`, `r` or `z` keys that equal an accessor function.
    	@returns {{x?: [min: Number, max: Number]|[min: String, max: String], y?: [min: Number, max: Number]|[min: String, max: String], z?: [min: Number, max: Number]|[min: String, max: String], r?: [min: Number, max: Number]|[min: String, max: String]}} An object with the same structure as `fields` but instead of an accessor, each key contains an array of a min and a max.
    */
    function calcExtents (data, fields) {
    	if (!Array.isArray(data)) {
    		throw new TypeError('The first argument of calcExtents() must be an array. If you got this error using the <LayerCake> component, consider passing a flat array to the `flatData` prop. More info: https://layercake.graphics/guide/#flatdata');
    	}

    	if (
    		Array.isArray(fields)
    		|| fields === undefined
    		|| fields === null
    	) {
    		throw new TypeError('The second argument of calcExtents() must be an '
    		+ 'object with field names as keys as accessor functions as values.');
    	}

    	const extents = {};

    	const keys = Object.keys(fields);
    	const kl = keys.length;
    	let i;
    	let j;
    	let k;
    	let s;
    	let min;
    	let max;
    	let acc;
    	let val;

    	const dl = data.length;
    	for (i = 0; i < kl; i += 1) {
    		s = keys[i];
    		acc = fields[s];
    		min = null;
    		max = null;
    		for (j = 0; j < dl; j += 1) {
    			val = acc(data[j]);
    			if (Array.isArray(val)) {
    				const vl = val.length;
    				for (k = 0; k < vl; k += 1) {
    					if (val[k] !== undefined && val[k] !== null && Number.isNaN(val[k]) === false) {
    						if (min === null || val[k] < min) {
    							min = val[k];
    						}
    						if (max === null || val[k] > max) {
    							max = val[k];
    						}
    					}
    				}
    			} else if (val !== undefined && val !== null && Number.isNaN(val) === false) {
    				if (min === null || val < min) {
    					min = val;
    				}
    				if (max === null || val > max) {
    					max = val;
    				}
    			}
    		}
    		extents[s] = [min, max];
    	}

    	return extents;
    }

    /* --------------------------------------------
     * If we have a domain from settings, fill in
     * any null values with ones from our measured extents
     * otherwise, return the measured extent
     */
    function partialDomain (domain = [], directive) {
    	if (Array.isArray(directive) === true) {
    		return directive.map((d, i) => {
    			if (d === null) {
    				return domain[i];
    			}
    			return d;
    		});
    	}
    	return domain;
    }

    function calcDomain (s) {
    	return function domainCalc ([$extents, $domain]) {
    		return $extents ? partialDomain($extents[s], $domain) : $domain;
    	};
    }

    function initRange(domain, range) {
      switch (arguments.length) {
        case 0: break;
        case 1: this.range(domain); break;
        default: this.range(range).domain(domain); break;
      }
      return this;
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

    var constant$1 = x => () => x;

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
        return b - a ? exponential(a, b, y) : constant$1(isNaN(a) ? b : a);
      };
    }

    function nogamma(a, b) {
      var d = b - a;
      return d ? linear$1(a, d) : constant$1(isNaN(a) ? b : a);
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
      return b == null || t === "boolean" ? constant$1(b)
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

    function transformPow(exponent) {
      return function(x) {
        return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
      };
    }

    function transformSqrt(x) {
      return x < 0 ? -Math.sqrt(-x) : Math.sqrt(x);
    }

    function transformSquare(x) {
      return x < 0 ? -x * x : x * x;
    }

    function powish(transform) {
      var scale = transform(identity$1, identity$1),
          exponent = 1;

      function rescale() {
        return exponent === 1 ? transform(identity$1, identity$1)
            : exponent === 0.5 ? transform(transformSqrt, transformSquare)
            : transform(transformPow(exponent), transformPow(1 / exponent));
      }

      scale.exponent = function(_) {
        return arguments.length ? (exponent = +_, rescale()) : exponent;
      };

      return linearish(scale);
    }

    function pow$1() {
      var scale = powish(transformer());

      scale.copy = function() {
        return copy(scale, pow$1()).exponent(scale.exponent());
      };

      initRange.apply(scale, arguments);

      return scale;
    }

    function sqrt() {
      return pow$1.apply(null, arguments).exponent(0.5);
    }

    var defaultScales = {
    	x: linear,
    	y: linear,
    	z: linear,
    	r: sqrt
    };

    /* --------------------------------------------
     *
     * Determine whether a scale is a log, symlog, power or other
     * This is not meant to be exhaustive of all the different types of
     * scales in d3-scale and focuses on continuous scales
     *
     * --------------------------------------------
     */
    function findScaleType(scale) {
    	if (scale.constant) {
    		return 'symlog';
    	}
    	if (scale.base) {
    		return 'log';
    	}
    	if (scale.exponent) {
    		if (scale.exponent() === 0.5) {
    			return 'sqrt';
    		}
    		return 'pow';
    	}
    	return 'other';
    }

    /**
    	An identity function
    	@type {*} d The value to return.
    	@returns {*}
    */
    function identity (d) {
    	return d;
    }

    function log(sign) {
    	return x => Math.log(sign * x);
    }

    function exp(sign) {
    	return x => sign * Math.exp(x);
    }

    function symlog(c) {
    	return x => Math.sign(x) * Math.log1p(Math.abs(x / c));
    }

    function symexp(c) {
    	return x => Math.sign(x) * Math.expm1(Math.abs(x)) * c;
    }

    function pow(exponent) {
    	return function powFn(x) {
    		return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
    	};
    }

    function getPadFunctions(scale) {
    	const scaleType = findScaleType(scale);

    	if (scaleType === 'log') {
    		const sign = Math.sign(scale.domain()[0]);
    		return { lift: log(sign), ground: exp(sign), scaleType };
    	}
    	if (scaleType === 'pow') {
    		const exponent = 1;
    		return { lift: pow(exponent), ground: pow(1 / exponent), scaleType };
    	}
    	if (scaleType === 'sqrt') {
    		const exponent = 0.5;
    		return { lift: pow(exponent), ground: pow(1 / exponent), scaleType };
    	}
    	if (scaleType === 'symlog') {
    		const constant = 1;
    		return { lift: symlog(constant), ground: symexp(constant), scaleType };
    	}

    	return { lift: identity, ground: identity, scaleType };
    }

    /* --------------------------------------------
     *
     * Returns a modified scale domain by in/decreasing
     * the min/max by taking the desired difference
     * in pixels and converting it to units of data.
     * Returns an array that you can set as the new domain.
     * Padding contributed by @veltman.
     * See here for discussion of transforms: https://github.com/d3/d3-scale/issues/150
     *
     * --------------------------------------------
     */

    function padScale (scale, padding) {
    	if (typeof scale.range !== 'function') {
    		throw new Error('Scale method `range` must be a function');
    	}
    	if (typeof scale.domain !== 'function') {
    		throw new Error('Scale method `domain` must be a function');
    	}
    	if (!Array.isArray(padding)) {
    		return scale.domain();
    	}

    	if (scale.domain().length !== 2) {
    		console.warn('[LayerCake] The scale is expected to have a domain of length 2 to use padding. Are you sure you want to use padding? Your scale\'s domain is:', scale.domain());
    	}
    	if (scale.range().length !== 2) {
    		console.warn('[LayerCake] The scale is expected to have a range of length 2 to use padding. Are you sure you want to use padding? Your scale\'s range is:', scale.range());
    	}

    	const { lift, ground } = getPadFunctions(scale);

    	const d0 = scale.domain()[0];

    	const isTime = Object.prototype.toString.call(d0) === '[object Date]';

    	const [d1, d2] = scale.domain().map(d => {
    		return isTime ? lift(d.getTime()) : lift(d);
    	});
    	const [r1, r2] = scale.range();
    	const paddingLeft = padding[0] || 0;
    	const paddingRight = padding[1] || 0;

    	const step = (d2 - d1) / (Math.abs(r2 - r1) - paddingLeft - paddingRight); // Math.abs() to properly handle reversed scales

    	return [d1 - paddingLeft * step, paddingRight * step + d2].map(d => {
    		return isTime ? ground(new Date(d)) : ground(d);
    	});
    }

    /* eslint-disable no-nested-ternary */
    function calcBaseRange(s, width, height, reverse, percentRange) {
    	let min;
    	let max;
    	if (percentRange === true) {
    		min = 0;
    		max = 100;
    	} else {
    		min = s === 'r' ? 1 : 0;
    		max = s === 'y' ? height : s === 'r' ? 25 : width;
    	}
    	return reverse === true ? [max, min] : [min, max];
    }

    function getDefaultRange(s, width, height, reverse, range, percentRange) {
    	return !range
    		? calcBaseRange(s, width, height, reverse, percentRange)
    		: typeof range === 'function'
    			? range({ width, height })
    			: range;
    }

    function createScale (s) {
    	return function scaleCreator ([$scale, $extents, $domain, $padding, $nice, $reverse, $width, $height, $range, $percentScale]) {
    		if ($extents === null) {
    			return null;
    		}

    		const defaultRange = getDefaultRange(s, $width, $height, $reverse, $range, $percentScale);

    		const scale = $scale === defaultScales[s] ? $scale() : $scale.copy();

    		/* --------------------------------------------
    		 * On creation, `$domain` will already have any nulls filled in
    		 * But if we set it via the context it might not, so rerun it through partialDomain
    		 */
    		scale
    			.domain(partialDomain($extents[s], $domain))
    			.range(defaultRange);

    		if ($padding) {
    			scale.domain(padScale(scale, $padding));
    		}

    		if ($nice === true) {
    			if (typeof scale.nice === 'function') {
    				scale.nice();
    			} else {
    				console.error(`[Layer Cake] You set \`${s}Nice: true\` but the ${s}Scale does not have a \`.nice\` method. Ignoring...`);
    			}
    		}

    		return scale;
    	};
    }

    function createGetter ([$acc, $scale]) {
    	return d => {
    		const val = $acc(d);
    		if (Array.isArray(val)) {
    			return val.map(v => $scale(v));
    		}
    		return $scale(val);
    	};
    }

    function getRange([$scale]) {
    	if (typeof $scale === 'function') {
    		if (typeof $scale.range === 'function') {
    			return $scale.range();
    		}
    		console.error('[LayerCake] Your scale doesn\'t have a `.range` method?');
    	}
    	return null;
    }

    var defaultReverses = {
    	x: false,
    	y: true,
    	z: false,
    	r: false
    };

    /* node_modules/layercake/LayerCake.svelte generated by Svelte v3.46.4 */

    const { Object: Object_1, console: console_1 } = globals;
    const file$9 = "node_modules/layercake/LayerCake.svelte";

    const get_default_slot_changes$1 = dirty => ({
    	element: dirty[0] & /*element*/ 4,
    	width: dirty[0] & /*$width_d*/ 256,
    	height: dirty[0] & /*$height_d*/ 512,
    	aspectRatio: dirty[0] & /*$aspectRatio_d*/ 1024,
    	containerWidth: dirty[0] & /*$_containerWidth*/ 128,
    	containerHeight: dirty[0] & /*$_containerHeight*/ 64
    });

    const get_default_slot_context$1 = ctx => ({
    	element: /*element*/ ctx[2],
    	width: /*$width_d*/ ctx[8],
    	height: /*$height_d*/ ctx[9],
    	aspectRatio: /*$aspectRatio_d*/ ctx[10],
    	containerWidth: /*$_containerWidth*/ ctx[7],
    	containerHeight: /*$_containerHeight*/ ctx[6]
    });

    // (370:0) {#if (ssr === true || typeof window !== 'undefined')}
    function create_if_block(ctx) {
    	let div;
    	let div_resize_listener;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[90].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[89], get_default_slot_context$1);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "layercake-container svelte-vhzpsp");
    			add_render_callback(() => /*div_elementresize_handler*/ ctx[92].call(div));
    			set_style(div, "position", /*position*/ ctx[5], false);
    			set_style(div, "top", /*position*/ ctx[5] === 'absolute' ? '0' : null, false);
    			set_style(div, "right", /*position*/ ctx[5] === 'absolute' ? '0' : null, false);
    			set_style(div, "bottom", /*position*/ ctx[5] === 'absolute' ? '0' : null, false);
    			set_style(div, "left", /*position*/ ctx[5] === 'absolute' ? '0' : null, false);
    			set_style(div, "pointer-events", /*pointerEvents*/ ctx[4] === false ? 'none' : null, false);
    			add_location(div, file$9, 370, 1, 19795);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[91](div);
    			div_resize_listener = add_resize_listener(div, /*div_elementresize_handler*/ ctx[92].bind(div));
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*element, $width_d, $height_d, $aspectRatio_d, $_containerWidth, $_containerHeight*/ 1988 | dirty[2] & /*$$scope*/ 134217728)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[89],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[89])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[89], dirty, get_default_slot_changes$1),
    						get_default_slot_context$1
    					);
    				}
    			}

    			if (dirty[0] & /*position*/ 32) {
    				set_style(div, "position", /*position*/ ctx[5], false);
    			}

    			if (dirty[0] & /*position*/ 32) {
    				set_style(div, "top", /*position*/ ctx[5] === 'absolute' ? '0' : null, false);
    			}

    			if (dirty[0] & /*position*/ 32) {
    				set_style(div, "right", /*position*/ ctx[5] === 'absolute' ? '0' : null, false);
    			}

    			if (dirty[0] & /*position*/ 32) {
    				set_style(div, "bottom", /*position*/ ctx[5] === 'absolute' ? '0' : null, false);
    			}

    			if (dirty[0] & /*position*/ 32) {
    				set_style(div, "left", /*position*/ ctx[5] === 'absolute' ? '0' : null, false);
    			}

    			if (dirty[0] & /*pointerEvents*/ 16) {
    				set_style(div, "pointer-events", /*pointerEvents*/ ctx[4] === false ? 'none' : null, false);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[91](null);
    			div_resize_listener();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(370:0) {#if (ssr === true || typeof window !== 'undefined')}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = (/*ssr*/ ctx[3] === true || typeof window !== 'undefined') && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*ssr*/ ctx[3] === true || typeof window !== 'undefined') {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*ssr*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
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
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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

    function instance$a($$self, $$props, $$invalidate) {
    	let context;
    	let $_config;
    	let $_custom;
    	let $_rScale;
    	let $_zScale;
    	let $_yScale;
    	let $_xScale;
    	let $_rRange;
    	let $_zRange;
    	let $_yRange;
    	let $_xRange;
    	let $_rPadding;
    	let $_zPadding;
    	let $_yPadding;
    	let $_xPadding;
    	let $_rReverse;
    	let $_zReverse;
    	let $_yReverse;
    	let $_xReverse;
    	let $_rNice;
    	let $_zNice;
    	let $_yNice;
    	let $_xNice;
    	let $_rDomain;
    	let $_zDomain;
    	let $_yDomain;
    	let $_xDomain;
    	let $_r;
    	let $_z;
    	let $_y;
    	let $_x;
    	let $_padding;
    	let $_flatData;
    	let $_data;
    	let $_extents;
    	let $_containerHeight;
    	let $_containerWidth;
    	let $_percentRange;
    	let $width_d;
    	let $height_d;
    	let $aspectRatio_d;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LayerCake', slots, ['default']);
    	let { ssr = false } = $$props;
    	let { pointerEvents = true } = $$props;
    	let { position = 'relative' } = $$props;
    	let { percentRange = false } = $$props;
    	let { width = undefined } = $$props;
    	let { height = undefined } = $$props;
    	let { containerWidth = width || 100 } = $$props;
    	let { containerHeight = height || 100 } = $$props;
    	let { element = undefined } = $$props;
    	let { x = undefined } = $$props;
    	let { y = undefined } = $$props;
    	let { z = undefined } = $$props;
    	let { r = undefined } = $$props;
    	let { data = [] } = $$props;
    	let { xDomain = undefined } = $$props;
    	let { yDomain = undefined } = $$props;
    	let { zDomain = undefined } = $$props;
    	let { rDomain = undefined } = $$props;
    	let { xNice = false } = $$props;
    	let { yNice = false } = $$props;
    	let { zNice = false } = $$props;
    	let { rNice = false } = $$props;
    	let { xReverse = defaultReverses.x } = $$props;
    	let { yReverse = defaultReverses.y } = $$props;
    	let { zReverse = defaultReverses.z } = $$props;
    	let { rReverse = defaultReverses.r } = $$props;
    	let { xPadding = undefined } = $$props;
    	let { yPadding = undefined } = $$props;
    	let { zPadding = undefined } = $$props;
    	let { rPadding = undefined } = $$props;
    	let { xScale = defaultScales.x } = $$props;
    	let { yScale = defaultScales.y } = $$props;
    	let { zScale = defaultScales.z } = $$props;
    	let { rScale = defaultScales.r } = $$props;
    	let { xRange = undefined } = $$props;
    	let { yRange = undefined } = $$props;
    	let { zRange = undefined } = $$props;
    	let { rRange = undefined } = $$props;
    	let { padding = {} } = $$props;
    	let { extents = {} } = $$props;
    	let { flatData = undefined } = $$props;
    	let { custom = {} } = $$props;

    	/* --------------------------------------------
     * Keep track of whethr the component has mounted
     * This is used to emit warnings once we have measured
     * the container object and it doesn't have proper dimensions
     */
    	let isMounted = false;

    	onMount(() => {
    		isMounted = true;
    	});

    	/* --------------------------------------------
     * Preserve a copy of our passed in settings before we modify them
     * Return this to the user's context so they can reference things if need be
     * Add the active keys since those aren't on our settings object.
     * This is mostly an escape-hatch
     */
    	const config = {};

    	/* --------------------------------------------
     * Make store versions of each parameter
     * Prefix these with `_` to keep things organized
     */
    	const _percentRange = writable(percentRange);

    	validate_store(_percentRange, '_percentRange');
    	component_subscribe($$self, _percentRange, value => $$invalidate(128, $_percentRange = value));
    	const _containerWidth = writable(containerWidth);
    	validate_store(_containerWidth, '_containerWidth');
    	component_subscribe($$self, _containerWidth, value => $$invalidate(7, $_containerWidth = value));
    	const _containerHeight = writable(containerHeight);
    	validate_store(_containerHeight, '_containerHeight');
    	component_subscribe($$self, _containerHeight, value => $$invalidate(6, $_containerHeight = value));
    	const _extents = writable(filterObject(extents));
    	validate_store(_extents, '_extents');
    	component_subscribe($$self, _extents, value => $$invalidate(127, $_extents = value));
    	const _data = writable(data);
    	validate_store(_data, '_data');
    	component_subscribe($$self, _data, value => $$invalidate(126, $_data = value));
    	const _flatData = writable(flatData || data);
    	validate_store(_flatData, '_flatData');
    	component_subscribe($$self, _flatData, value => $$invalidate(125, $_flatData = value));
    	const _padding = writable(padding);
    	validate_store(_padding, '_padding');
    	component_subscribe($$self, _padding, value => $$invalidate(124, $_padding = value));
    	const _x = writable(makeAccessor(x));
    	validate_store(_x, '_x');
    	component_subscribe($$self, _x, value => $$invalidate(123, $_x = value));
    	const _y = writable(makeAccessor(y));
    	validate_store(_y, '_y');
    	component_subscribe($$self, _y, value => $$invalidate(122, $_y = value));
    	const _z = writable(makeAccessor(z));
    	validate_store(_z, '_z');
    	component_subscribe($$self, _z, value => $$invalidate(121, $_z = value));
    	const _r = writable(makeAccessor(r));
    	validate_store(_r, '_r');
    	component_subscribe($$self, _r, value => $$invalidate(120, $_r = value));
    	const _xDomain = writable(xDomain);
    	validate_store(_xDomain, '_xDomain');
    	component_subscribe($$self, _xDomain, value => $$invalidate(119, $_xDomain = value));
    	const _yDomain = writable(yDomain);
    	validate_store(_yDomain, '_yDomain');
    	component_subscribe($$self, _yDomain, value => $$invalidate(118, $_yDomain = value));
    	const _zDomain = writable(zDomain);
    	validate_store(_zDomain, '_zDomain');
    	component_subscribe($$self, _zDomain, value => $$invalidate(117, $_zDomain = value));
    	const _rDomain = writable(rDomain);
    	validate_store(_rDomain, '_rDomain');
    	component_subscribe($$self, _rDomain, value => $$invalidate(116, $_rDomain = value));
    	const _xNice = writable(xNice);
    	validate_store(_xNice, '_xNice');
    	component_subscribe($$self, _xNice, value => $$invalidate(115, $_xNice = value));
    	const _yNice = writable(yNice);
    	validate_store(_yNice, '_yNice');
    	component_subscribe($$self, _yNice, value => $$invalidate(114, $_yNice = value));
    	const _zNice = writable(zNice);
    	validate_store(_zNice, '_zNice');
    	component_subscribe($$self, _zNice, value => $$invalidate(113, $_zNice = value));
    	const _rNice = writable(rNice);
    	validate_store(_rNice, '_rNice');
    	component_subscribe($$self, _rNice, value => $$invalidate(112, $_rNice = value));
    	const _xReverse = writable(xReverse);
    	validate_store(_xReverse, '_xReverse');
    	component_subscribe($$self, _xReverse, value => $$invalidate(111, $_xReverse = value));
    	const _yReverse = writable(yReverse);
    	validate_store(_yReverse, '_yReverse');
    	component_subscribe($$self, _yReverse, value => $$invalidate(110, $_yReverse = value));
    	const _zReverse = writable(zReverse);
    	validate_store(_zReverse, '_zReverse');
    	component_subscribe($$self, _zReverse, value => $$invalidate(109, $_zReverse = value));
    	const _rReverse = writable(rReverse);
    	validate_store(_rReverse, '_rReverse');
    	component_subscribe($$self, _rReverse, value => $$invalidate(108, $_rReverse = value));
    	const _xPadding = writable(xPadding);
    	validate_store(_xPadding, '_xPadding');
    	component_subscribe($$self, _xPadding, value => $$invalidate(107, $_xPadding = value));
    	const _yPadding = writable(yPadding);
    	validate_store(_yPadding, '_yPadding');
    	component_subscribe($$self, _yPadding, value => $$invalidate(106, $_yPadding = value));
    	const _zPadding = writable(zPadding);
    	validate_store(_zPadding, '_zPadding');
    	component_subscribe($$self, _zPadding, value => $$invalidate(105, $_zPadding = value));
    	const _rPadding = writable(rPadding);
    	validate_store(_rPadding, '_rPadding');
    	component_subscribe($$self, _rPadding, value => $$invalidate(104, $_rPadding = value));
    	const _xRange = writable(xRange);
    	validate_store(_xRange, '_xRange');
    	component_subscribe($$self, _xRange, value => $$invalidate(103, $_xRange = value));
    	const _yRange = writable(yRange);
    	validate_store(_yRange, '_yRange');
    	component_subscribe($$self, _yRange, value => $$invalidate(102, $_yRange = value));
    	const _zRange = writable(zRange);
    	validate_store(_zRange, '_zRange');
    	component_subscribe($$self, _zRange, value => $$invalidate(101, $_zRange = value));
    	const _rRange = writable(rRange);
    	validate_store(_rRange, '_rRange');
    	component_subscribe($$self, _rRange, value => $$invalidate(100, $_rRange = value));
    	const _xScale = writable(xScale);
    	validate_store(_xScale, '_xScale');
    	component_subscribe($$self, _xScale, value => $$invalidate(99, $_xScale = value));
    	const _yScale = writable(yScale);
    	validate_store(_yScale, '_yScale');
    	component_subscribe($$self, _yScale, value => $$invalidate(98, $_yScale = value));
    	const _zScale = writable(zScale);
    	validate_store(_zScale, '_zScale');
    	component_subscribe($$self, _zScale, value => $$invalidate(97, $_zScale = value));
    	const _rScale = writable(rScale);
    	validate_store(_rScale, '_rScale');
    	component_subscribe($$self, _rScale, value => $$invalidate(96, $_rScale = value));
    	const _config = writable(config);
    	validate_store(_config, '_config');
    	component_subscribe($$self, _config, value => $$invalidate(94, $_config = value));
    	const _custom = writable(custom);
    	validate_store(_custom, '_custom');
    	component_subscribe($$self, _custom, value => $$invalidate(95, $_custom = value));

    	/* --------------------------------------------
     * Create derived values
     * Suffix these with `_d`
     */
    	const activeGetters_d = derived([_x, _y, _z, _r], ([$x, $y, $z, $r]) => {
    		const obj = {};

    		if ($x) {
    			obj.x = $x;
    		}

    		if ($y) {
    			obj.y = $y;
    		}

    		if ($z) {
    			obj.z = $z;
    		}

    		if ($r) {
    			obj.r = $r;
    		}

    		return obj;
    	});

    	const padding_d = derived([_padding, _containerWidth, _containerHeight], ([$padding]) => {
    		const defaultPadding = { top: 0, right: 0, bottom: 0, left: 0 };
    		return Object.assign(defaultPadding, $padding);
    	});

    	const box_d = derived([_containerWidth, _containerHeight, padding_d], ([$containerWidth, $containerHeight, $padding]) => {
    		const b = {};
    		b.top = $padding.top;
    		b.right = $containerWidth - $padding.right;
    		b.bottom = $containerHeight - $padding.bottom;
    		b.left = $padding.left;
    		b.width = b.right - b.left;
    		b.height = b.bottom - b.top;

    		if (b.width <= 0 && isMounted === true) {
    			console.warn('[LayerCake] Target div has zero or negative width. Did you forget to set an explicit width in CSS on the container?');
    		}

    		if (b.height <= 0 && isMounted === true) {
    			console.warn('[LayerCake] Target div has zero or negative height. Did you forget to set an explicit height in CSS on the container?');
    		}

    		return b;
    	});

    	const width_d = derived([box_d], ([$box]) => {
    		return $box.width;
    	});

    	validate_store(width_d, 'width_d');
    	component_subscribe($$self, width_d, value => $$invalidate(8, $width_d = value));

    	const height_d = derived([box_d], ([$box]) => {
    		return $box.height;
    	});

    	validate_store(height_d, 'height_d');
    	component_subscribe($$self, height_d, value => $$invalidate(9, $height_d = value));

    	/* --------------------------------------------
     * Calculate extents by taking the extent of the data
     * and filling that in with anything set by the user
     */
    	const extents_d = derived([_flatData, activeGetters_d, _extents], ([$flatData, $activeGetters, $extents]) => {
    		const getters = filterObject($activeGetters, $extents);

    		if (Object.keys(getters).length > 0) {
    			return {
    				...calcExtents($flatData, getters),
    				...$extents
    			};
    		} else {
    			return {};
    		}
    	});

    	const xDomain_d = derived([extents_d, _xDomain], calcDomain('x'));
    	const yDomain_d = derived([extents_d, _yDomain], calcDomain('y'));
    	const zDomain_d = derived([extents_d, _zDomain], calcDomain('z'));
    	const rDomain_d = derived([extents_d, _rDomain], calcDomain('r'));

    	const xScale_d = derived(
    		[
    			_xScale,
    			extents_d,
    			xDomain_d,
    			_xPadding,
    			_xNice,
    			_xReverse,
    			width_d,
    			height_d,
    			_xRange,
    			_percentRange
    		],
    		createScale('x')
    	);

    	const xGet_d = derived([_x, xScale_d], createGetter);

    	const yScale_d = derived(
    		[
    			_yScale,
    			extents_d,
    			yDomain_d,
    			_yPadding,
    			_yNice,
    			_yReverse,
    			width_d,
    			height_d,
    			_yRange,
    			_percentRange
    		],
    		createScale('y')
    	);

    	const yGet_d = derived([_y, yScale_d], createGetter);

    	const zScale_d = derived(
    		[
    			_zScale,
    			extents_d,
    			zDomain_d,
    			_zPadding,
    			_zNice,
    			_zReverse,
    			width_d,
    			height_d,
    			_zRange,
    			_percentRange
    		],
    		createScale('z')
    	);

    	const zGet_d = derived([_z, zScale_d], createGetter);

    	const rScale_d = derived(
    		[
    			_rScale,
    			extents_d,
    			rDomain_d,
    			_rPadding,
    			_rNice,
    			_rReverse,
    			width_d,
    			height_d,
    			_rRange,
    			_percentRange
    		],
    		createScale('r')
    	);

    	const rGet_d = derived([_r, rScale_d], createGetter);
    	const xRange_d = derived([xScale_d], getRange);
    	const yRange_d = derived([yScale_d], getRange);
    	const zRange_d = derived([zScale_d], getRange);
    	const rRange_d = derived([rScale_d], getRange);

    	const aspectRatio_d = derived([width_d, height_d], ([$width, $height]) => {
    		return $width / $height;
    	});

    	validate_store(aspectRatio_d, 'aspectRatio_d');
    	component_subscribe($$self, aspectRatio_d, value => $$invalidate(10, $aspectRatio_d = value));

    	const writable_props = [
    		'ssr',
    		'pointerEvents',
    		'position',
    		'percentRange',
    		'width',
    		'height',
    		'containerWidth',
    		'containerHeight',
    		'element',
    		'x',
    		'y',
    		'z',
    		'r',
    		'data',
    		'xDomain',
    		'yDomain',
    		'zDomain',
    		'rDomain',
    		'xNice',
    		'yNice',
    		'zNice',
    		'rNice',
    		'xReverse',
    		'yReverse',
    		'zReverse',
    		'rReverse',
    		'xPadding',
    		'yPadding',
    		'zPadding',
    		'rPadding',
    		'xScale',
    		'yScale',
    		'zScale',
    		'rScale',
    		'xRange',
    		'yRange',
    		'zRange',
    		'rRange',
    		'padding',
    		'extents',
    		'flatData',
    		'custom'
    	];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<LayerCake> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(2, element);
    		});
    	}

    	function div_elementresize_handler() {
    		containerWidth = this.clientWidth;
    		containerHeight = this.clientHeight;
    		$$invalidate(0, containerWidth);
    		$$invalidate(1, containerHeight);
    	}

    	$$self.$$set = $$props => {
    		if ('ssr' in $$props) $$invalidate(3, ssr = $$props.ssr);
    		if ('pointerEvents' in $$props) $$invalidate(4, pointerEvents = $$props.pointerEvents);
    		if ('position' in $$props) $$invalidate(5, position = $$props.position);
    		if ('percentRange' in $$props) $$invalidate(51, percentRange = $$props.percentRange);
    		if ('width' in $$props) $$invalidate(52, width = $$props.width);
    		if ('height' in $$props) $$invalidate(53, height = $$props.height);
    		if ('containerWidth' in $$props) $$invalidate(0, containerWidth = $$props.containerWidth);
    		if ('containerHeight' in $$props) $$invalidate(1, containerHeight = $$props.containerHeight);
    		if ('element' in $$props) $$invalidate(2, element = $$props.element);
    		if ('x' in $$props) $$invalidate(54, x = $$props.x);
    		if ('y' in $$props) $$invalidate(55, y = $$props.y);
    		if ('z' in $$props) $$invalidate(56, z = $$props.z);
    		if ('r' in $$props) $$invalidate(57, r = $$props.r);
    		if ('data' in $$props) $$invalidate(58, data = $$props.data);
    		if ('xDomain' in $$props) $$invalidate(59, xDomain = $$props.xDomain);
    		if ('yDomain' in $$props) $$invalidate(60, yDomain = $$props.yDomain);
    		if ('zDomain' in $$props) $$invalidate(61, zDomain = $$props.zDomain);
    		if ('rDomain' in $$props) $$invalidate(62, rDomain = $$props.rDomain);
    		if ('xNice' in $$props) $$invalidate(63, xNice = $$props.xNice);
    		if ('yNice' in $$props) $$invalidate(64, yNice = $$props.yNice);
    		if ('zNice' in $$props) $$invalidate(65, zNice = $$props.zNice);
    		if ('rNice' in $$props) $$invalidate(66, rNice = $$props.rNice);
    		if ('xReverse' in $$props) $$invalidate(67, xReverse = $$props.xReverse);
    		if ('yReverse' in $$props) $$invalidate(68, yReverse = $$props.yReverse);
    		if ('zReverse' in $$props) $$invalidate(69, zReverse = $$props.zReverse);
    		if ('rReverse' in $$props) $$invalidate(70, rReverse = $$props.rReverse);
    		if ('xPadding' in $$props) $$invalidate(71, xPadding = $$props.xPadding);
    		if ('yPadding' in $$props) $$invalidate(72, yPadding = $$props.yPadding);
    		if ('zPadding' in $$props) $$invalidate(73, zPadding = $$props.zPadding);
    		if ('rPadding' in $$props) $$invalidate(74, rPadding = $$props.rPadding);
    		if ('xScale' in $$props) $$invalidate(75, xScale = $$props.xScale);
    		if ('yScale' in $$props) $$invalidate(76, yScale = $$props.yScale);
    		if ('zScale' in $$props) $$invalidate(77, zScale = $$props.zScale);
    		if ('rScale' in $$props) $$invalidate(78, rScale = $$props.rScale);
    		if ('xRange' in $$props) $$invalidate(79, xRange = $$props.xRange);
    		if ('yRange' in $$props) $$invalidate(80, yRange = $$props.yRange);
    		if ('zRange' in $$props) $$invalidate(81, zRange = $$props.zRange);
    		if ('rRange' in $$props) $$invalidate(82, rRange = $$props.rRange);
    		if ('padding' in $$props) $$invalidate(83, padding = $$props.padding);
    		if ('extents' in $$props) $$invalidate(84, extents = $$props.extents);
    		if ('flatData' in $$props) $$invalidate(85, flatData = $$props.flatData);
    		if ('custom' in $$props) $$invalidate(86, custom = $$props.custom);
    		if ('$$scope' in $$props) $$invalidate(89, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		setContext,
    		onMount,
    		writable,
    		derived,
    		makeAccessor,
    		filterObject,
    		calcExtents,
    		calcDomain,
    		createScale,
    		createGetter,
    		getRange,
    		defaultScales,
    		defaultReverses,
    		ssr,
    		pointerEvents,
    		position,
    		percentRange,
    		width,
    		height,
    		containerWidth,
    		containerHeight,
    		element,
    		x,
    		y,
    		z,
    		r,
    		data,
    		xDomain,
    		yDomain,
    		zDomain,
    		rDomain,
    		xNice,
    		yNice,
    		zNice,
    		rNice,
    		xReverse,
    		yReverse,
    		zReverse,
    		rReverse,
    		xPadding,
    		yPadding,
    		zPadding,
    		rPadding,
    		xScale,
    		yScale,
    		zScale,
    		rScale,
    		xRange,
    		yRange,
    		zRange,
    		rRange,
    		padding,
    		extents,
    		flatData,
    		custom,
    		isMounted,
    		config,
    		_percentRange,
    		_containerWidth,
    		_containerHeight,
    		_extents,
    		_data,
    		_flatData,
    		_padding,
    		_x,
    		_y,
    		_z,
    		_r,
    		_xDomain,
    		_yDomain,
    		_zDomain,
    		_rDomain,
    		_xNice,
    		_yNice,
    		_zNice,
    		_rNice,
    		_xReverse,
    		_yReverse,
    		_zReverse,
    		_rReverse,
    		_xPadding,
    		_yPadding,
    		_zPadding,
    		_rPadding,
    		_xRange,
    		_yRange,
    		_zRange,
    		_rRange,
    		_xScale,
    		_yScale,
    		_zScale,
    		_rScale,
    		_config,
    		_custom,
    		activeGetters_d,
    		padding_d,
    		box_d,
    		width_d,
    		height_d,
    		extents_d,
    		xDomain_d,
    		yDomain_d,
    		zDomain_d,
    		rDomain_d,
    		xScale_d,
    		xGet_d,
    		yScale_d,
    		yGet_d,
    		zScale_d,
    		zGet_d,
    		rScale_d,
    		rGet_d,
    		xRange_d,
    		yRange_d,
    		zRange_d,
    		rRange_d,
    		aspectRatio_d,
    		context,
    		$_config,
    		$_custom,
    		$_rScale,
    		$_zScale,
    		$_yScale,
    		$_xScale,
    		$_rRange,
    		$_zRange,
    		$_yRange,
    		$_xRange,
    		$_rPadding,
    		$_zPadding,
    		$_yPadding,
    		$_xPadding,
    		$_rReverse,
    		$_zReverse,
    		$_yReverse,
    		$_xReverse,
    		$_rNice,
    		$_zNice,
    		$_yNice,
    		$_xNice,
    		$_rDomain,
    		$_zDomain,
    		$_yDomain,
    		$_xDomain,
    		$_r,
    		$_z,
    		$_y,
    		$_x,
    		$_padding,
    		$_flatData,
    		$_data,
    		$_extents,
    		$_containerHeight,
    		$_containerWidth,
    		$_percentRange,
    		$width_d,
    		$height_d,
    		$aspectRatio_d
    	});

    	$$self.$inject_state = $$props => {
    		if ('ssr' in $$props) $$invalidate(3, ssr = $$props.ssr);
    		if ('pointerEvents' in $$props) $$invalidate(4, pointerEvents = $$props.pointerEvents);
    		if ('position' in $$props) $$invalidate(5, position = $$props.position);
    		if ('percentRange' in $$props) $$invalidate(51, percentRange = $$props.percentRange);
    		if ('width' in $$props) $$invalidate(52, width = $$props.width);
    		if ('height' in $$props) $$invalidate(53, height = $$props.height);
    		if ('containerWidth' in $$props) $$invalidate(0, containerWidth = $$props.containerWidth);
    		if ('containerHeight' in $$props) $$invalidate(1, containerHeight = $$props.containerHeight);
    		if ('element' in $$props) $$invalidate(2, element = $$props.element);
    		if ('x' in $$props) $$invalidate(54, x = $$props.x);
    		if ('y' in $$props) $$invalidate(55, y = $$props.y);
    		if ('z' in $$props) $$invalidate(56, z = $$props.z);
    		if ('r' in $$props) $$invalidate(57, r = $$props.r);
    		if ('data' in $$props) $$invalidate(58, data = $$props.data);
    		if ('xDomain' in $$props) $$invalidate(59, xDomain = $$props.xDomain);
    		if ('yDomain' in $$props) $$invalidate(60, yDomain = $$props.yDomain);
    		if ('zDomain' in $$props) $$invalidate(61, zDomain = $$props.zDomain);
    		if ('rDomain' in $$props) $$invalidate(62, rDomain = $$props.rDomain);
    		if ('xNice' in $$props) $$invalidate(63, xNice = $$props.xNice);
    		if ('yNice' in $$props) $$invalidate(64, yNice = $$props.yNice);
    		if ('zNice' in $$props) $$invalidate(65, zNice = $$props.zNice);
    		if ('rNice' in $$props) $$invalidate(66, rNice = $$props.rNice);
    		if ('xReverse' in $$props) $$invalidate(67, xReverse = $$props.xReverse);
    		if ('yReverse' in $$props) $$invalidate(68, yReverse = $$props.yReverse);
    		if ('zReverse' in $$props) $$invalidate(69, zReverse = $$props.zReverse);
    		if ('rReverse' in $$props) $$invalidate(70, rReverse = $$props.rReverse);
    		if ('xPadding' in $$props) $$invalidate(71, xPadding = $$props.xPadding);
    		if ('yPadding' in $$props) $$invalidate(72, yPadding = $$props.yPadding);
    		if ('zPadding' in $$props) $$invalidate(73, zPadding = $$props.zPadding);
    		if ('rPadding' in $$props) $$invalidate(74, rPadding = $$props.rPadding);
    		if ('xScale' in $$props) $$invalidate(75, xScale = $$props.xScale);
    		if ('yScale' in $$props) $$invalidate(76, yScale = $$props.yScale);
    		if ('zScale' in $$props) $$invalidate(77, zScale = $$props.zScale);
    		if ('rScale' in $$props) $$invalidate(78, rScale = $$props.rScale);
    		if ('xRange' in $$props) $$invalidate(79, xRange = $$props.xRange);
    		if ('yRange' in $$props) $$invalidate(80, yRange = $$props.yRange);
    		if ('zRange' in $$props) $$invalidate(81, zRange = $$props.zRange);
    		if ('rRange' in $$props) $$invalidate(82, rRange = $$props.rRange);
    		if ('padding' in $$props) $$invalidate(83, padding = $$props.padding);
    		if ('extents' in $$props) $$invalidate(84, extents = $$props.extents);
    		if ('flatData' in $$props) $$invalidate(85, flatData = $$props.flatData);
    		if ('custom' in $$props) $$invalidate(86, custom = $$props.custom);
    		if ('isMounted' in $$props) isMounted = $$props.isMounted;
    		if ('context' in $$props) $$invalidate(88, context = $$props.context);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[1] & /*x*/ 8388608) {
    			if (x) $$invalidate(87, config.x = x, config);
    		}

    		if ($$self.$$.dirty[1] & /*y*/ 16777216) {
    			if (y) $$invalidate(87, config.y = y, config);
    		}

    		if ($$self.$$.dirty[1] & /*z*/ 33554432) {
    			if (z) $$invalidate(87, config.z = z, config);
    		}

    		if ($$self.$$.dirty[1] & /*r*/ 67108864) {
    			if (r) $$invalidate(87, config.r = r, config);
    		}

    		if ($$self.$$.dirty[1] & /*xDomain*/ 268435456) {
    			if (xDomain) $$invalidate(87, config.xDomain = xDomain, config);
    		}

    		if ($$self.$$.dirty[1] & /*yDomain*/ 536870912) {
    			if (yDomain) $$invalidate(87, config.yDomain = yDomain, config);
    		}

    		if ($$self.$$.dirty[1] & /*zDomain*/ 1073741824) {
    			if (zDomain) $$invalidate(87, config.zDomain = zDomain, config);
    		}

    		if ($$self.$$.dirty[2] & /*rDomain*/ 1) {
    			if (rDomain) $$invalidate(87, config.rDomain = rDomain, config);
    		}

    		if ($$self.$$.dirty[2] & /*xRange*/ 131072) {
    			if (xRange) $$invalidate(87, config.xRange = xRange, config);
    		}

    		if ($$self.$$.dirty[2] & /*yRange*/ 262144) {
    			if (yRange) $$invalidate(87, config.yRange = yRange, config);
    		}

    		if ($$self.$$.dirty[2] & /*zRange*/ 524288) {
    			if (zRange) $$invalidate(87, config.zRange = zRange, config);
    		}

    		if ($$self.$$.dirty[2] & /*rRange*/ 1048576) {
    			if (rRange) $$invalidate(87, config.rRange = rRange, config);
    		}

    		if ($$self.$$.dirty[1] & /*percentRange*/ 1048576) {
    			set_store_value(_percentRange, $_percentRange = percentRange, $_percentRange);
    		}

    		if ($$self.$$.dirty[0] & /*containerWidth*/ 1) {
    			set_store_value(_containerWidth, $_containerWidth = containerWidth, $_containerWidth);
    		}

    		if ($$self.$$.dirty[0] & /*containerHeight*/ 2) {
    			set_store_value(_containerHeight, $_containerHeight = containerHeight, $_containerHeight);
    		}

    		if ($$self.$$.dirty[2] & /*extents*/ 4194304) {
    			set_store_value(_extents, $_extents = filterObject(extents), $_extents);
    		}

    		if ($$self.$$.dirty[1] & /*data*/ 134217728) {
    			set_store_value(_data, $_data = data, $_data);
    		}

    		if ($$self.$$.dirty[1] & /*data*/ 134217728 | $$self.$$.dirty[2] & /*flatData*/ 8388608) {
    			set_store_value(_flatData, $_flatData = flatData || data, $_flatData);
    		}

    		if ($$self.$$.dirty[2] & /*padding*/ 2097152) {
    			set_store_value(_padding, $_padding = padding, $_padding);
    		}

    		if ($$self.$$.dirty[1] & /*x*/ 8388608) {
    			set_store_value(_x, $_x = makeAccessor(x), $_x);
    		}

    		if ($$self.$$.dirty[1] & /*y*/ 16777216) {
    			set_store_value(_y, $_y = makeAccessor(y), $_y);
    		}

    		if ($$self.$$.dirty[1] & /*z*/ 33554432) {
    			set_store_value(_z, $_z = makeAccessor(z), $_z);
    		}

    		if ($$self.$$.dirty[1] & /*r*/ 67108864) {
    			set_store_value(_r, $_r = makeAccessor(r), $_r);
    		}

    		if ($$self.$$.dirty[1] & /*xDomain*/ 268435456) {
    			set_store_value(_xDomain, $_xDomain = xDomain, $_xDomain);
    		}

    		if ($$self.$$.dirty[1] & /*yDomain*/ 536870912) {
    			set_store_value(_yDomain, $_yDomain = yDomain, $_yDomain);
    		}

    		if ($$self.$$.dirty[1] & /*zDomain*/ 1073741824) {
    			set_store_value(_zDomain, $_zDomain = zDomain, $_zDomain);
    		}

    		if ($$self.$$.dirty[2] & /*rDomain*/ 1) {
    			set_store_value(_rDomain, $_rDomain = rDomain, $_rDomain);
    		}

    		if ($$self.$$.dirty[2] & /*xNice*/ 2) {
    			set_store_value(_xNice, $_xNice = xNice, $_xNice);
    		}

    		if ($$self.$$.dirty[2] & /*yNice*/ 4) {
    			set_store_value(_yNice, $_yNice = yNice, $_yNice);
    		}

    		if ($$self.$$.dirty[2] & /*zNice*/ 8) {
    			set_store_value(_zNice, $_zNice = zNice, $_zNice);
    		}

    		if ($$self.$$.dirty[2] & /*rNice*/ 16) {
    			set_store_value(_rNice, $_rNice = rNice, $_rNice);
    		}

    		if ($$self.$$.dirty[2] & /*xReverse*/ 32) {
    			set_store_value(_xReverse, $_xReverse = xReverse, $_xReverse);
    		}

    		if ($$self.$$.dirty[2] & /*yReverse*/ 64) {
    			set_store_value(_yReverse, $_yReverse = yReverse, $_yReverse);
    		}

    		if ($$self.$$.dirty[2] & /*zReverse*/ 128) {
    			set_store_value(_zReverse, $_zReverse = zReverse, $_zReverse);
    		}

    		if ($$self.$$.dirty[2] & /*rReverse*/ 256) {
    			set_store_value(_rReverse, $_rReverse = rReverse, $_rReverse);
    		}

    		if ($$self.$$.dirty[2] & /*xPadding*/ 512) {
    			set_store_value(_xPadding, $_xPadding = xPadding, $_xPadding);
    		}

    		if ($$self.$$.dirty[2] & /*yPadding*/ 1024) {
    			set_store_value(_yPadding, $_yPadding = yPadding, $_yPadding);
    		}

    		if ($$self.$$.dirty[2] & /*zPadding*/ 2048) {
    			set_store_value(_zPadding, $_zPadding = zPadding, $_zPadding);
    		}

    		if ($$self.$$.dirty[2] & /*rPadding*/ 4096) {
    			set_store_value(_rPadding, $_rPadding = rPadding, $_rPadding);
    		}

    		if ($$self.$$.dirty[2] & /*xRange*/ 131072) {
    			set_store_value(_xRange, $_xRange = xRange, $_xRange);
    		}

    		if ($$self.$$.dirty[2] & /*yRange*/ 262144) {
    			set_store_value(_yRange, $_yRange = yRange, $_yRange);
    		}

    		if ($$self.$$.dirty[2] & /*zRange*/ 524288) {
    			set_store_value(_zRange, $_zRange = zRange, $_zRange);
    		}

    		if ($$self.$$.dirty[2] & /*rRange*/ 1048576) {
    			set_store_value(_rRange, $_rRange = rRange, $_rRange);
    		}

    		if ($$self.$$.dirty[2] & /*xScale*/ 8192) {
    			set_store_value(_xScale, $_xScale = xScale, $_xScale);
    		}

    		if ($$self.$$.dirty[2] & /*yScale*/ 16384) {
    			set_store_value(_yScale, $_yScale = yScale, $_yScale);
    		}

    		if ($$self.$$.dirty[2] & /*zScale*/ 32768) {
    			set_store_value(_zScale, $_zScale = zScale, $_zScale);
    		}

    		if ($$self.$$.dirty[2] & /*rScale*/ 65536) {
    			set_store_value(_rScale, $_rScale = rScale, $_rScale);
    		}

    		if ($$self.$$.dirty[2] & /*custom*/ 16777216) {
    			set_store_value(_custom, $_custom = custom, $_custom);
    		}

    		if ($$self.$$.dirty[2] & /*config*/ 33554432) {
    			set_store_value(_config, $_config = config, $_config);
    		}

    		if ($$self.$$.dirty[2] & /*context*/ 67108864) {
    			setContext('LayerCake', context);
    		}
    	};

    	$$invalidate(88, context = {
    		activeGetters: activeGetters_d,
    		width: width_d,
    		height: height_d,
    		percentRange: _percentRange,
    		aspectRatio: aspectRatio_d,
    		containerWidth: _containerWidth,
    		containerHeight: _containerHeight,
    		x: _x,
    		y: _y,
    		z: _z,
    		r: _r,
    		custom: _custom,
    		data: _data,
    		xNice: _xNice,
    		yNice: _yNice,
    		zNice: _zNice,
    		rNice: _rNice,
    		xReverse: _xReverse,
    		yReverse: _yReverse,
    		zReverse: _zReverse,
    		rReverse: _rReverse,
    		xPadding: _xPadding,
    		yPadding: _yPadding,
    		zPadding: _zPadding,
    		rPadding: _rPadding,
    		padding: padding_d,
    		flatData: _flatData,
    		extents: extents_d,
    		xDomain: xDomain_d,
    		yDomain: yDomain_d,
    		zDomain: zDomain_d,
    		rDomain: rDomain_d,
    		xRange: xRange_d,
    		yRange: yRange_d,
    		zRange: zRange_d,
    		rRange: rRange_d,
    		config: _config,
    		xScale: xScale_d,
    		xGet: xGet_d,
    		yScale: yScale_d,
    		yGet: yGet_d,
    		zScale: zScale_d,
    		zGet: zGet_d,
    		rScale: rScale_d,
    		rGet: rGet_d
    	});

    	return [
    		containerWidth,
    		containerHeight,
    		element,
    		ssr,
    		pointerEvents,
    		position,
    		$_containerHeight,
    		$_containerWidth,
    		$width_d,
    		$height_d,
    		$aspectRatio_d,
    		_percentRange,
    		_containerWidth,
    		_containerHeight,
    		_extents,
    		_data,
    		_flatData,
    		_padding,
    		_x,
    		_y,
    		_z,
    		_r,
    		_xDomain,
    		_yDomain,
    		_zDomain,
    		_rDomain,
    		_xNice,
    		_yNice,
    		_zNice,
    		_rNice,
    		_xReverse,
    		_yReverse,
    		_zReverse,
    		_rReverse,
    		_xPadding,
    		_yPadding,
    		_zPadding,
    		_rPadding,
    		_xRange,
    		_yRange,
    		_zRange,
    		_rRange,
    		_xScale,
    		_yScale,
    		_zScale,
    		_rScale,
    		_config,
    		_custom,
    		width_d,
    		height_d,
    		aspectRatio_d,
    		percentRange,
    		width,
    		height,
    		x,
    		y,
    		z,
    		r,
    		data,
    		xDomain,
    		yDomain,
    		zDomain,
    		rDomain,
    		xNice,
    		yNice,
    		zNice,
    		rNice,
    		xReverse,
    		yReverse,
    		zReverse,
    		rReverse,
    		xPadding,
    		yPadding,
    		zPadding,
    		rPadding,
    		xScale,
    		yScale,
    		zScale,
    		rScale,
    		xRange,
    		yRange,
    		zRange,
    		rRange,
    		padding,
    		extents,
    		flatData,
    		custom,
    		config,
    		context,
    		$$scope,
    		slots,
    		div_binding,
    		div_elementresize_handler
    	];
    }

    class LayerCake extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$a,
    			create_fragment$a,
    			safe_not_equal,
    			{
    				ssr: 3,
    				pointerEvents: 4,
    				position: 5,
    				percentRange: 51,
    				width: 52,
    				height: 53,
    				containerWidth: 0,
    				containerHeight: 1,
    				element: 2,
    				x: 54,
    				y: 55,
    				z: 56,
    				r: 57,
    				data: 58,
    				xDomain: 59,
    				yDomain: 60,
    				zDomain: 61,
    				rDomain: 62,
    				xNice: 63,
    				yNice: 64,
    				zNice: 65,
    				rNice: 66,
    				xReverse: 67,
    				yReverse: 68,
    				zReverse: 69,
    				rReverse: 70,
    				xPadding: 71,
    				yPadding: 72,
    				zPadding: 73,
    				rPadding: 74,
    				xScale: 75,
    				yScale: 76,
    				zScale: 77,
    				rScale: 78,
    				xRange: 79,
    				yRange: 80,
    				zRange: 81,
    				rRange: 82,
    				padding: 83,
    				extents: 84,
    				flatData: 85,
    				custom: 86
    			},
    			null,
    			[-1, -1, -1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LayerCake",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get ssr() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ssr(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pointerEvents() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pointerEvents(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get position() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set position(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get percentRange() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set percentRange(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerWidth() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerWidth(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerHeight() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerHeight(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get z() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set z(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get r() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set r(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xDomain() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xDomain(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yDomain() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yDomain(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zDomain() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zDomain(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rDomain() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rDomain(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xNice() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xNice(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yNice() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yNice(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zNice() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zNice(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rNice() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rNice(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xReverse() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xReverse(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yReverse() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yReverse(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zReverse() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zReverse(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rReverse() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rReverse(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xPadding() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xPadding(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yPadding() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yPadding(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zPadding() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zPadding(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rPadding() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rPadding(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xScale() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xScale(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yScale() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yScale(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zScale() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zScale(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rScale() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rScale(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xRange() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xRange(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yRange() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yRange(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zRange() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zRange(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rRange() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rRange(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get padding() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set padding(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get extents() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set extents(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flatData() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flatData(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get custom() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set custom(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/layercake/layouts/Svg.svelte generated by Svelte v3.46.4 */
    const file$8 = "node_modules/layercake/layouts/Svg.svelte";
    const get_default_slot_changes = dirty => ({ element: dirty & /*element*/ 1 });
    const get_default_slot_context = ctx => ({ element: /*element*/ ctx[0] });
    const get_defs_slot_changes = dirty => ({ element: dirty & /*element*/ 1 });
    const get_defs_slot_context = ctx => ({ element: /*element*/ ctx[0] });

    function create_fragment$9(ctx) {
    	let svg;
    	let defs;
    	let g;
    	let g_transform_value;
    	let current;
    	const defs_slot_template = /*#slots*/ ctx[12].defs;
    	const defs_slot = create_slot(defs_slot_template, ctx, /*$$scope*/ ctx[11], get_defs_slot_context);
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], get_default_slot_context);

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			defs = svg_element("defs");
    			if (defs_slot) defs_slot.c();
    			g = svg_element("g");
    			if (default_slot) default_slot.c();
    			add_location(defs, file$8, 33, 1, 992);
    			attr_dev(g, "class", "layercake-layout-svg_g");
    			attr_dev(g, "transform", g_transform_value = "translate(" + /*$padding*/ ctx[7].left + ", " + /*$padding*/ ctx[7].top + ")");
    			add_location(g, file$8, 36, 1, 1037);
    			attr_dev(svg, "class", "layercake-layout-svg svelte-u84d8d");
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[4]);
    			attr_dev(svg, "width", /*$containerWidth*/ ctx[5]);
    			attr_dev(svg, "height", /*$containerHeight*/ ctx[6]);
    			set_style(svg, "z-index", /*zIndex*/ ctx[2], false);
    			set_style(svg, "pointer-events", /*pointerEvents*/ ctx[3] === false ? 'none' : null, false);
    			add_location(svg, file$8, 24, 0, 782);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, defs);

    			if (defs_slot) {
    				defs_slot.m(defs, null);
    			}

    			append_dev(svg, g);

    			if (default_slot) {
    				default_slot.m(g, null);
    			}

    			/*g_binding*/ ctx[13](g);
    			/*svg_binding*/ ctx[14](svg);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (defs_slot) {
    				if (defs_slot.p && (!current || dirty & /*$$scope, element*/ 2049)) {
    					update_slot_base(
    						defs_slot,
    						defs_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(defs_slot_template, /*$$scope*/ ctx[11], dirty, get_defs_slot_changes),
    						get_defs_slot_context
    					);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, element*/ 2049)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}

    			if (!current || dirty & /*$padding*/ 128 && g_transform_value !== (g_transform_value = "translate(" + /*$padding*/ ctx[7].left + ", " + /*$padding*/ ctx[7].top + ")")) {
    				attr_dev(g, "transform", g_transform_value);
    			}

    			if (!current || dirty & /*viewBox*/ 16) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[4]);
    			}

    			if (!current || dirty & /*$containerWidth*/ 32) {
    				attr_dev(svg, "width", /*$containerWidth*/ ctx[5]);
    			}

    			if (!current || dirty & /*$containerHeight*/ 64) {
    				attr_dev(svg, "height", /*$containerHeight*/ ctx[6]);
    			}

    			if (dirty & /*zIndex*/ 4) {
    				set_style(svg, "z-index", /*zIndex*/ ctx[2], false);
    			}

    			if (dirty & /*pointerEvents*/ 8) {
    				set_style(svg, "pointer-events", /*pointerEvents*/ ctx[3] === false ? 'none' : null, false);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(defs_slot, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(defs_slot, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (defs_slot) defs_slot.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			/*g_binding*/ ctx[13](null);
    			/*svg_binding*/ ctx[14](null);
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
    	let $containerWidth;
    	let $containerHeight;
    	let $padding;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Svg', slots, ['defs','default']);
    	let { element = undefined } = $$props;
    	let { innerElement = undefined } = $$props;
    	let { zIndex = undefined } = $$props;
    	let { pointerEvents = undefined } = $$props;
    	let { viewBox = undefined } = $$props;
    	const { containerWidth, containerHeight, padding } = getContext('LayerCake');
    	validate_store(containerWidth, 'containerWidth');
    	component_subscribe($$self, containerWidth, value => $$invalidate(5, $containerWidth = value));
    	validate_store(containerHeight, 'containerHeight');
    	component_subscribe($$self, containerHeight, value => $$invalidate(6, $containerHeight = value));
    	validate_store(padding, 'padding');
    	component_subscribe($$self, padding, value => $$invalidate(7, $padding = value));
    	const writable_props = ['element', 'innerElement', 'zIndex', 'pointerEvents', 'viewBox'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Svg> was created with unknown prop '${key}'`);
    	});

    	function g_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			innerElement = $$value;
    			$$invalidate(1, innerElement);
    		});
    	}

    	function svg_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('element' in $$props) $$invalidate(0, element = $$props.element);
    		if ('innerElement' in $$props) $$invalidate(1, innerElement = $$props.innerElement);
    		if ('zIndex' in $$props) $$invalidate(2, zIndex = $$props.zIndex);
    		if ('pointerEvents' in $$props) $$invalidate(3, pointerEvents = $$props.pointerEvents);
    		if ('viewBox' in $$props) $$invalidate(4, viewBox = $$props.viewBox);
    		if ('$$scope' in $$props) $$invalidate(11, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		element,
    		innerElement,
    		zIndex,
    		pointerEvents,
    		viewBox,
    		containerWidth,
    		containerHeight,
    		padding,
    		$containerWidth,
    		$containerHeight,
    		$padding
    	});

    	$$self.$inject_state = $$props => {
    		if ('element' in $$props) $$invalidate(0, element = $$props.element);
    		if ('innerElement' in $$props) $$invalidate(1, innerElement = $$props.innerElement);
    		if ('zIndex' in $$props) $$invalidate(2, zIndex = $$props.zIndex);
    		if ('pointerEvents' in $$props) $$invalidate(3, pointerEvents = $$props.pointerEvents);
    		if ('viewBox' in $$props) $$invalidate(4, viewBox = $$props.viewBox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		element,
    		innerElement,
    		zIndex,
    		pointerEvents,
    		viewBox,
    		$containerWidth,
    		$containerHeight,
    		$padding,
    		containerWidth,
    		containerHeight,
    		padding,
    		$$scope,
    		slots,
    		g_binding,
    		svg_binding
    	];
    }

    class Svg extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			element: 0,
    			innerElement: 1,
    			zIndex: 2,
    			pointerEvents: 3,
    			viewBox: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Svg",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get element() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get innerElement() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set innerElement(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zIndex() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zIndex(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pointerEvents() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pointerEvents(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewBox() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewBox(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicInOut(t) {
        return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
    }
    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }
    function quintIn(t) {
        return t * t * t * t * t;
    }
    function quintOut(t) {
        return --t * t * t * t * t + 1;
    }

    function scale(node, { delay = 0, duration = 400, easing = cubicOut, start = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const sd = 1 - start;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (_t, u) => `
			transform: ${transform} scale(${1 - (sd * u)});
			opacity: ${target_opacity - (od * u)}
		`
        };
    }
    function draw(node, { delay = 0, speed, duration, easing = cubicInOut } = {}) {
        let len = node.getTotalLength();
        const style = getComputedStyle(node);
        if (style.strokeLinecap !== 'butt') {
            len += parseInt(style.strokeWidth);
        }
        if (duration === undefined) {
            if (speed === undefined) {
                duration = 800;
            }
            else {
                duration = len / speed;
            }
        }
        else if (typeof duration === 'function') {
            duration = duration(len);
        }
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `stroke-dasharray: ${t * len} ${u * len}`
        };
    }

    function tree_add(d) {
      const x = +this._x.call(null, d),
          y = +this._y.call(null, d);
      return add(this.cover(x, y), x, y, d);
    }

    function add(tree, x, y, d) {
      if (isNaN(x) || isNaN(y)) return tree; // ignore invalid points

      var parent,
          node = tree._root,
          leaf = {data: d},
          x0 = tree._x0,
          y0 = tree._y0,
          x1 = tree._x1,
          y1 = tree._y1,
          xm,
          ym,
          xp,
          yp,
          right,
          bottom,
          i,
          j;

      // If the tree is empty, initialize the root as a leaf.
      if (!node) return tree._root = leaf, tree;

      // Find the existing leaf for the new point, or add it.
      while (node.length) {
        if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
        if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
        if (parent = node, !(node = node[i = bottom << 1 | right])) return parent[i] = leaf, tree;
      }

      // Is the new point is exactly coincident with the existing point?
      xp = +tree._x.call(null, node.data);
      yp = +tree._y.call(null, node.data);
      if (x === xp && y === yp) return leaf.next = node, parent ? parent[i] = leaf : tree._root = leaf, tree;

      // Otherwise, split the leaf node until the old and new point are separated.
      do {
        parent = parent ? parent[i] = new Array(4) : tree._root = new Array(4);
        if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
        if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
      } while ((i = bottom << 1 | right) === (j = (yp >= ym) << 1 | (xp >= xm)));
      return parent[j] = node, parent[i] = leaf, tree;
    }

    function addAll(data) {
      var d, i, n = data.length,
          x,
          y,
          xz = new Array(n),
          yz = new Array(n),
          x0 = Infinity,
          y0 = Infinity,
          x1 = -Infinity,
          y1 = -Infinity;

      // Compute the points and their extent.
      for (i = 0; i < n; ++i) {
        if (isNaN(x = +this._x.call(null, d = data[i])) || isNaN(y = +this._y.call(null, d))) continue;
        xz[i] = x;
        yz[i] = y;
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }

      // If there were no (valid) points, abort.
      if (x0 > x1 || y0 > y1) return this;

      // Expand the tree to cover the new points.
      this.cover(x0, y0).cover(x1, y1);

      // Add the new points.
      for (i = 0; i < n; ++i) {
        add(this, xz[i], yz[i], data[i]);
      }

      return this;
    }

    function tree_cover(x, y) {
      if (isNaN(x = +x) || isNaN(y = +y)) return this; // ignore invalid points

      var x0 = this._x0,
          y0 = this._y0,
          x1 = this._x1,
          y1 = this._y1;

      // If the quadtree has no extent, initialize them.
      // Integer extent are necessary so that if we later double the extent,
      // the existing quadrant boundaries don’t change due to floating point error!
      if (isNaN(x0)) {
        x1 = (x0 = Math.floor(x)) + 1;
        y1 = (y0 = Math.floor(y)) + 1;
      }

      // Otherwise, double repeatedly to cover.
      else {
        var z = x1 - x0 || 1,
            node = this._root,
            parent,
            i;

        while (x0 > x || x >= x1 || y0 > y || y >= y1) {
          i = (y < y0) << 1 | (x < x0);
          parent = new Array(4), parent[i] = node, node = parent, z *= 2;
          switch (i) {
            case 0: x1 = x0 + z, y1 = y0 + z; break;
            case 1: x0 = x1 - z, y1 = y0 + z; break;
            case 2: x1 = x0 + z, y0 = y1 - z; break;
            case 3: x0 = x1 - z, y0 = y1 - z; break;
          }
        }

        if (this._root && this._root.length) this._root = node;
      }

      this._x0 = x0;
      this._y0 = y0;
      this._x1 = x1;
      this._y1 = y1;
      return this;
    }

    function tree_data() {
      var data = [];
      this.visit(function(node) {
        if (!node.length) do data.push(node.data); while (node = node.next)
      });
      return data;
    }

    function tree_extent(_) {
      return arguments.length
          ? this.cover(+_[0][0], +_[0][1]).cover(+_[1][0], +_[1][1])
          : isNaN(this._x0) ? undefined : [[this._x0, this._y0], [this._x1, this._y1]];
    }

    function Quad(node, x0, y0, x1, y1) {
      this.node = node;
      this.x0 = x0;
      this.y0 = y0;
      this.x1 = x1;
      this.y1 = y1;
    }

    function tree_find(x, y, radius) {
      var data,
          x0 = this._x0,
          y0 = this._y0,
          x1,
          y1,
          x2,
          y2,
          x3 = this._x1,
          y3 = this._y1,
          quads = [],
          node = this._root,
          q,
          i;

      if (node) quads.push(new Quad(node, x0, y0, x3, y3));
      if (radius == null) radius = Infinity;
      else {
        x0 = x - radius, y0 = y - radius;
        x3 = x + radius, y3 = y + radius;
        radius *= radius;
      }

      while (q = quads.pop()) {

        // Stop searching if this quadrant can’t contain a closer node.
        if (!(node = q.node)
            || (x1 = q.x0) > x3
            || (y1 = q.y0) > y3
            || (x2 = q.x1) < x0
            || (y2 = q.y1) < y0) continue;

        // Bisect the current quadrant.
        if (node.length) {
          var xm = (x1 + x2) / 2,
              ym = (y1 + y2) / 2;

          quads.push(
            new Quad(node[3], xm, ym, x2, y2),
            new Quad(node[2], x1, ym, xm, y2),
            new Quad(node[1], xm, y1, x2, ym),
            new Quad(node[0], x1, y1, xm, ym)
          );

          // Visit the closest quadrant first.
          if (i = (y >= ym) << 1 | (x >= xm)) {
            q = quads[quads.length - 1];
            quads[quads.length - 1] = quads[quads.length - 1 - i];
            quads[quads.length - 1 - i] = q;
          }
        }

        // Visit this point. (Visiting coincident points isn’t necessary!)
        else {
          var dx = x - +this._x.call(null, node.data),
              dy = y - +this._y.call(null, node.data),
              d2 = dx * dx + dy * dy;
          if (d2 < radius) {
            var d = Math.sqrt(radius = d2);
            x0 = x - d, y0 = y - d;
            x3 = x + d, y3 = y + d;
            data = node.data;
          }
        }
      }

      return data;
    }

    function tree_remove(d) {
      if (isNaN(x = +this._x.call(null, d)) || isNaN(y = +this._y.call(null, d))) return this; // ignore invalid points

      var parent,
          node = this._root,
          retainer,
          previous,
          next,
          x0 = this._x0,
          y0 = this._y0,
          x1 = this._x1,
          y1 = this._y1,
          x,
          y,
          xm,
          ym,
          right,
          bottom,
          i,
          j;

      // If the tree is empty, initialize the root as a leaf.
      if (!node) return this;

      // Find the leaf node for the point.
      // While descending, also retain the deepest parent with a non-removed sibling.
      if (node.length) while (true) {
        if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
        if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
        if (!(parent = node, node = node[i = bottom << 1 | right])) return this;
        if (!node.length) break;
        if (parent[(i + 1) & 3] || parent[(i + 2) & 3] || parent[(i + 3) & 3]) retainer = parent, j = i;
      }

      // Find the point to remove.
      while (node.data !== d) if (!(previous = node, node = node.next)) return this;
      if (next = node.next) delete node.next;

      // If there are multiple coincident points, remove just the point.
      if (previous) return (next ? previous.next = next : delete previous.next), this;

      // If this is the root point, remove it.
      if (!parent) return this._root = next, this;

      // Remove this leaf.
      next ? parent[i] = next : delete parent[i];

      // If the parent now contains exactly one leaf, collapse superfluous parents.
      if ((node = parent[0] || parent[1] || parent[2] || parent[3])
          && node === (parent[3] || parent[2] || parent[1] || parent[0])
          && !node.length) {
        if (retainer) retainer[j] = node;
        else this._root = node;
      }

      return this;
    }

    function removeAll(data) {
      for (var i = 0, n = data.length; i < n; ++i) this.remove(data[i]);
      return this;
    }

    function tree_root() {
      return this._root;
    }

    function tree_size() {
      var size = 0;
      this.visit(function(node) {
        if (!node.length) do ++size; while (node = node.next)
      });
      return size;
    }

    function tree_visit(callback) {
      var quads = [], q, node = this._root, child, x0, y0, x1, y1;
      if (node) quads.push(new Quad(node, this._x0, this._y0, this._x1, this._y1));
      while (q = quads.pop()) {
        if (!callback(node = q.node, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1) && node.length) {
          var xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
          if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
          if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
          if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
          if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
        }
      }
      return this;
    }

    function tree_visitAfter(callback) {
      var quads = [], next = [], q;
      if (this._root) quads.push(new Quad(this._root, this._x0, this._y0, this._x1, this._y1));
      while (q = quads.pop()) {
        var node = q.node;
        if (node.length) {
          var child, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1, xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
          if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
          if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
          if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
          if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
        }
        next.push(q);
      }
      while (q = next.pop()) {
        callback(q.node, q.x0, q.y0, q.x1, q.y1);
      }
      return this;
    }

    function defaultX(d) {
      return d[0];
    }

    function tree_x(_) {
      return arguments.length ? (this._x = _, this) : this._x;
    }

    function defaultY(d) {
      return d[1];
    }

    function tree_y(_) {
      return arguments.length ? (this._y = _, this) : this._y;
    }

    function quadtree(nodes, x, y) {
      var tree = new Quadtree(x == null ? defaultX : x, y == null ? defaultY : y, NaN, NaN, NaN, NaN);
      return nodes == null ? tree : tree.addAll(nodes);
    }

    function Quadtree(x, y, x0, y0, x1, y1) {
      this._x = x;
      this._y = y;
      this._x0 = x0;
      this._y0 = y0;
      this._x1 = x1;
      this._y1 = y1;
      this._root = undefined;
    }

    function leaf_copy(leaf) {
      var copy = {data: leaf.data}, next = copy;
      while (leaf = leaf.next) next = next.next = {data: leaf.data};
      return copy;
    }

    var treeProto = quadtree.prototype = Quadtree.prototype;

    treeProto.copy = function() {
      var copy = new Quadtree(this._x, this._y, this._x0, this._y0, this._x1, this._y1),
          node = this._root,
          nodes,
          child;

      if (!node) return copy;

      if (!node.length) return copy._root = leaf_copy(node), copy;

      nodes = [{source: node, target: copy._root = new Array(4)}];
      while (node = nodes.pop()) {
        for (var i = 0; i < 4; ++i) {
          if (child = node.source[i]) {
            if (child.length) nodes.push({source: child, target: node.target[i] = new Array(4)});
            else node.target[i] = leaf_copy(child);
          }
        }
      }

      return copy;
    };

    treeProto.add = tree_add;
    treeProto.addAll = addAll;
    treeProto.cover = tree_cover;
    treeProto.data = tree_data;
    treeProto.extent = tree_extent;
    treeProto.find = tree_find;
    treeProto.remove = tree_remove;
    treeProto.removeAll = removeAll;
    treeProto.root = tree_root;
    treeProto.size = tree_size;
    treeProto.visit = tree_visit;
    treeProto.visitAfter = tree_visitAfter;
    treeProto.x = tree_x;
    treeProto.y = tree_y;

    function constant(x) {
      return function() {
        return x;
      };
    }

    function jiggle(random) {
      return (random() - 0.5) * 1e-6;
    }

    function x(d) {
      return d.x + d.vx;
    }

    function y(d) {
      return d.y + d.vy;
    }

    function forceCollide(radius) {
      var nodes,
          radii,
          random,
          strength = 1,
          iterations = 1;

      if (typeof radius !== "function") radius = constant(radius == null ? 1 : +radius);

      function force() {
        var i, n = nodes.length,
            tree,
            node,
            xi,
            yi,
            ri,
            ri2;

        for (var k = 0; k < iterations; ++k) {
          tree = quadtree(nodes, x, y).visitAfter(prepare);
          for (i = 0; i < n; ++i) {
            node = nodes[i];
            ri = radii[node.index], ri2 = ri * ri;
            xi = node.x + node.vx;
            yi = node.y + node.vy;
            tree.visit(apply);
          }
        }

        function apply(quad, x0, y0, x1, y1) {
          var data = quad.data, rj = quad.r, r = ri + rj;
          if (data) {
            if (data.index > node.index) {
              var x = xi - data.x - data.vx,
                  y = yi - data.y - data.vy,
                  l = x * x + y * y;
              if (l < r * r) {
                if (x === 0) x = jiggle(random), l += x * x;
                if (y === 0) y = jiggle(random), l += y * y;
                l = (r - (l = Math.sqrt(l))) / l * strength;
                node.vx += (x *= l) * (r = (rj *= rj) / (ri2 + rj));
                node.vy += (y *= l) * r;
                data.vx -= x * (r = 1 - r);
                data.vy -= y * r;
              }
            }
            return;
          }
          return x0 > xi + r || x1 < xi - r || y0 > yi + r || y1 < yi - r;
        }
      }

      function prepare(quad) {
        if (quad.data) return quad.r = radii[quad.data.index];
        for (var i = quad.r = 0; i < 4; ++i) {
          if (quad[i] && quad[i].r > quad.r) {
            quad.r = quad[i].r;
          }
        }
      }

      function initialize() {
        if (!nodes) return;
        var i, n = nodes.length, node;
        radii = new Array(n);
        for (i = 0; i < n; ++i) node = nodes[i], radii[node.index] = +radius(node, i, nodes);
      }

      force.initialize = function(_nodes, _random) {
        nodes = _nodes;
        random = _random;
        initialize();
      };

      force.iterations = function(_) {
        return arguments.length ? (iterations = +_, force) : iterations;
      };

      force.strength = function(_) {
        return arguments.length ? (strength = +_, force) : strength;
      };

      force.radius = function(_) {
        return arguments.length ? (radius = typeof _ === "function" ? _ : constant(+_), initialize(), force) : radius;
      };

      return force;
    }

    var noop = {value: () => {}};

    function dispatch() {
      for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
        if (!(t = arguments[i] + "") || (t in _) || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
        _[t] = [];
      }
      return new Dispatch(_);
    }

    function Dispatch(_) {
      this._ = _;
    }

    function parseTypenames(typenames, types) {
      return typenames.trim().split(/^|\s+/).map(function(t) {
        var name = "", i = t.indexOf(".");
        if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
        if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
        return {type: t, name: name};
      });
    }

    Dispatch.prototype = dispatch.prototype = {
      constructor: Dispatch,
      on: function(typename, callback) {
        var _ = this._,
            T = parseTypenames(typename + "", _),
            t,
            i = -1,
            n = T.length;

        // If no callback was specified, return the callback of the given type and name.
        if (arguments.length < 2) {
          while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
          return;
        }

        // If a type was specified, set the callback for the given type and name.
        // Otherwise, if a null callback was specified, remove callbacks of the given name.
        if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
        while (++i < n) {
          if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
          else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
        }

        return this;
      },
      copy: function() {
        var copy = {}, _ = this._;
        for (var t in _) copy[t] = _[t].slice();
        return new Dispatch(copy);
      },
      call: function(type, that) {
        if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
        if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
        for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
      },
      apply: function(type, that, args) {
        if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
        for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
      }
    };

    function get(type, name) {
      for (var i = 0, n = type.length, c; i < n; ++i) {
        if ((c = type[i]).name === name) {
          return c.value;
        }
      }
    }

    function set(type, name, callback) {
      for (var i = 0, n = type.length; i < n; ++i) {
        if (type[i].name === name) {
          type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
          break;
        }
      }
      if (callback != null) type.push({name: name, value: callback});
      return type;
    }

    var frame = 0, // is an animation frame pending?
        timeout = 0, // is a timeout pending?
        interval = 0, // are any timers active?
        pokeDelay = 1000, // how frequently we check for clock skew
        taskHead,
        taskTail,
        clockLast = 0,
        clockNow = 0,
        clockSkew = 0,
        clock = typeof performance === "object" && performance.now ? performance : Date,
        setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) { setTimeout(f, 17); };

    function now() {
      return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
    }

    function clearNow() {
      clockNow = 0;
    }

    function Timer() {
      this._call =
      this._time =
      this._next = null;
    }

    Timer.prototype = timer.prototype = {
      constructor: Timer,
      restart: function(callback, delay, time) {
        if (typeof callback !== "function") throw new TypeError("callback is not a function");
        time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
        if (!this._next && taskTail !== this) {
          if (taskTail) taskTail._next = this;
          else taskHead = this;
          taskTail = this;
        }
        this._call = callback;
        this._time = time;
        sleep();
      },
      stop: function() {
        if (this._call) {
          this._call = null;
          this._time = Infinity;
          sleep();
        }
      }
    };

    function timer(callback, delay, time) {
      var t = new Timer;
      t.restart(callback, delay, time);
      return t;
    }

    function timerFlush() {
      now(); // Get the current time, if not already set.
      ++frame; // Pretend we’ve set an alarm, if we haven’t already.
      var t = taskHead, e;
      while (t) {
        if ((e = clockNow - t._time) >= 0) t._call.call(null, e);
        t = t._next;
      }
      --frame;
    }

    function wake() {
      clockNow = (clockLast = clock.now()) + clockSkew;
      frame = timeout = 0;
      try {
        timerFlush();
      } finally {
        frame = 0;
        nap();
        clockNow = 0;
      }
    }

    function poke() {
      var now = clock.now(), delay = now - clockLast;
      if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
    }

    function nap() {
      var t0, t1 = taskHead, t2, time = Infinity;
      while (t1) {
        if (t1._call) {
          if (time > t1._time) time = t1._time;
          t0 = t1, t1 = t1._next;
        } else {
          t2 = t1._next, t1._next = null;
          t1 = t0 ? t0._next = t2 : taskHead = t2;
        }
      }
      taskTail = t0;
      sleep(time);
    }

    function sleep(time) {
      if (frame) return; // Soonest alarm already set, or will be.
      if (timeout) timeout = clearTimeout(timeout);
      var delay = time - clockNow; // Strictly less than if we recomputed clockNow.
      if (delay > 24) {
        if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
        if (interval) interval = clearInterval(interval);
      } else {
        if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
        frame = 1, setFrame(wake);
      }
    }

    // https://en.wikipedia.org/wiki/Linear_congruential_generator#Parameters_in_common_use
    const a = 1664525;
    const c = 1013904223;
    const m = 4294967296; // 2^32

    function lcg() {
      let s = 1;
      return () => (s = (a * s + c) % m) / m;
    }

    var initialRadius = 10,
        initialAngle = Math.PI * (3 - Math.sqrt(5));

    function forceSimulation(nodes) {
      var simulation,
          alpha = 1,
          alphaMin = 0.001,
          alphaDecay = 1 - Math.pow(alphaMin, 1 / 300),
          alphaTarget = 0,
          velocityDecay = 0.6,
          forces = new Map(),
          stepper = timer(step),
          event = dispatch("tick", "end"),
          random = lcg();

      if (nodes == null) nodes = [];

      function step() {
        tick();
        event.call("tick", simulation);
        if (alpha < alphaMin) {
          stepper.stop();
          event.call("end", simulation);
        }
      }

      function tick(iterations) {
        var i, n = nodes.length, node;

        if (iterations === undefined) iterations = 1;

        for (var k = 0; k < iterations; ++k) {
          alpha += (alphaTarget - alpha) * alphaDecay;

          forces.forEach(function(force) {
            force(alpha);
          });

          for (i = 0; i < n; ++i) {
            node = nodes[i];
            if (node.fx == null) node.x += node.vx *= velocityDecay;
            else node.x = node.fx, node.vx = 0;
            if (node.fy == null) node.y += node.vy *= velocityDecay;
            else node.y = node.fy, node.vy = 0;
          }
        }

        return simulation;
      }

      function initializeNodes() {
        for (var i = 0, n = nodes.length, node; i < n; ++i) {
          node = nodes[i], node.index = i;
          if (node.fx != null) node.x = node.fx;
          if (node.fy != null) node.y = node.fy;
          if (isNaN(node.x) || isNaN(node.y)) {
            var radius = initialRadius * Math.sqrt(0.5 + i), angle = i * initialAngle;
            node.x = radius * Math.cos(angle);
            node.y = radius * Math.sin(angle);
          }
          if (isNaN(node.vx) || isNaN(node.vy)) {
            node.vx = node.vy = 0;
          }
        }
      }

      function initializeForce(force) {
        if (force.initialize) force.initialize(nodes, random);
        return force;
      }

      initializeNodes();

      return simulation = {
        tick: tick,

        restart: function() {
          return stepper.restart(step), simulation;
        },

        stop: function() {
          return stepper.stop(), simulation;
        },

        nodes: function(_) {
          return arguments.length ? (nodes = _, initializeNodes(), forces.forEach(initializeForce), simulation) : nodes;
        },

        alpha: function(_) {
          return arguments.length ? (alpha = +_, simulation) : alpha;
        },

        alphaMin: function(_) {
          return arguments.length ? (alphaMin = +_, simulation) : alphaMin;
        },

        alphaDecay: function(_) {
          return arguments.length ? (alphaDecay = +_, simulation) : +alphaDecay;
        },

        alphaTarget: function(_) {
          return arguments.length ? (alphaTarget = +_, simulation) : alphaTarget;
        },

        velocityDecay: function(_) {
          return arguments.length ? (velocityDecay = 1 - _, simulation) : 1 - velocityDecay;
        },

        randomSource: function(_) {
          return arguments.length ? (random = _, forces.forEach(initializeForce), simulation) : random;
        },

        force: function(name, _) {
          return arguments.length > 1 ? ((_ == null ? forces.delete(name) : forces.set(name, initializeForce(_))), simulation) : forces.get(name);
        },

        find: function(x, y, radius) {
          var i = 0,
              n = nodes.length,
              dx,
              dy,
              d2,
              node,
              closest;

          if (radius == null) radius = Infinity;
          else radius *= radius;

          for (i = 0; i < n; ++i) {
            node = nodes[i];
            dx = x - node.x;
            dy = y - node.y;
            d2 = dx * dx + dy * dy;
            if (d2 < radius) closest = node, radius = d2;
          }

          return closest;
        },

        on: function(name, _) {
          return arguments.length > 1 ? (event.on(name, _), simulation) : event.on(name);
        }
      };
    }

    function forceX(x) {
      var strength = constant(0.1),
          nodes,
          strengths,
          xz;

      if (typeof x !== "function") x = constant(x == null ? 0 : +x);

      function force(alpha) {
        for (var i = 0, n = nodes.length, node; i < n; ++i) {
          node = nodes[i], node.vx += (xz[i] - node.x) * strengths[i] * alpha;
        }
      }

      function initialize() {
        if (!nodes) return;
        var i, n = nodes.length;
        strengths = new Array(n);
        xz = new Array(n);
        for (i = 0; i < n; ++i) {
          strengths[i] = isNaN(xz[i] = +x(nodes[i], i, nodes)) ? 0 : +strength(nodes[i], i, nodes);
        }
      }

      force.initialize = function(_) {
        nodes = _;
        initialize();
      };

      force.strength = function(_) {
        return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initialize(), force) : strength;
      };

      force.x = function(_) {
        return arguments.length ? (x = typeof _ === "function" ? _ : constant(+_), initialize(), force) : x;
      };

      return force;
    }

    function forceY(y) {
      var strength = constant(0.1),
          nodes,
          strengths,
          yz;

      if (typeof y !== "function") y = constant(y == null ? 0 : +y);

      function force(alpha) {
        for (var i = 0, n = nodes.length, node; i < n; ++i) {
          node = nodes[i], node.vy += (yz[i] - node.y) * strengths[i] * alpha;
        }
      }

      function initialize() {
        if (!nodes) return;
        var i, n = nodes.length;
        strengths = new Array(n);
        yz = new Array(n);
        for (i = 0; i < n; ++i) {
          strengths[i] = isNaN(yz[i] = +y(nodes[i], i, nodes)) ? 0 : +strength(nodes[i], i, nodes);
        }
      }

      force.initialize = function(_) {
        nodes = _;
        initialize();
      };

      force.strength = function(_) {
        return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initialize(), force) : strength;
      };

      force.y = function(_) {
        return arguments.length ? (y = typeof _ === "function" ? _ : constant(+_), initialize(), force) : y;
      };

      return force;
    }

    function updateData(k,n) {
      const data = range(0,(k*n),1).map((f)=>{
        const fold = Math.floor(f/n) + 1;
        const subFold = (f % (k)) + 1;
        const category = () => {
          if (fold === subFold) { return "validate" } else {return 'train'}
        };
          return {
            category:category(),
            fold,
            subFold
        }
      });
      return data
    }

    /* scripts/forcePackCircles.svelte generated by Svelte v3.46.4 */
    const file$7 = "scripts/forcePackCircles.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[29] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[35] = list[i];
    	return child_ctx;
    }

    // (93:0) {#each range(0,foldsCount,1) as tick}
    function create_each_block_2(ctx) {
    	let text_1;
    	let t_value = `${/*foldsCount*/ ctx[2] <= 10 ? 'fold ' : ''}${/*tick*/ ctx[35] + 1}` + "";
    	let t;
    	let text_1_x_value;

    	const block = {
    		c: function create() {
    			text_1 = svg_element("text");
    			t = text(t_value);
    			attr_dev(text_1, "x", text_1_x_value = /*$xScale*/ ctx[6](/*tick*/ ctx[35] + 1));
    			attr_dev(text_1, "y", /*$height*/ ctx[8]);
    			attr_dev(text_1, "class", "error-axis-text");
    			attr_dev(text_1, "text-anchor", "middle");
    			add_location(text_1, file$7, 94, 4, 3604);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, text_1, anchor);
    			append_dev(text_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*foldsCount*/ 4 && t_value !== (t_value = `${/*foldsCount*/ ctx[2] <= 10 ? 'fold ' : ''}${/*tick*/ ctx[35] + 1}` + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*$xScale, foldsCount*/ 68 && text_1_x_value !== (text_1_x_value = /*$xScale*/ ctx[6](/*tick*/ ctx[35] + 1))) {
    				attr_dev(text_1, "x", text_1_x_value);
    			}

    			if (dirty[0] & /*$height*/ 256) {
    				attr_dev(text_1, "y", /*$height*/ ctx[8]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(text_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(93:0) {#each range(0,foldsCount,1) as tick}",
    		ctx
    	});

    	return block;
    }

    // (104:0) {#each range(1,foldsCount+1,1) as highlight}
    function create_each_block_1(ctx) {
    	let circle;
    	let circle_r_value;
    	let circle_cx_value;
    	let circle_cy_value;
    	let circle_stroke_value;
    	let circle_stroke_width_value;
    	let circle_intro;
    	let circle_outro;
    	let current;

    	const block = {
    		c: function create() {
    			circle = svg_element("circle");
    			attr_dev(circle, "class", "highlightCircle");
    			attr_dev(circle, "r", circle_r_value = /*$xScale*/ ctx[6].range()[1] / /*foldsCount*/ ctx[2] / 3);
    			attr_dev(circle, "cx", circle_cx_value = /*$xScale*/ ctx[6](/*highlight*/ ctx[32]));
    			attr_dev(circle, "cy", circle_cy_value = /*$yScale*/ ctx[5](/*highlight*/ ctx[32]));
    			attr_dev(circle, "stroke", circle_stroke_value = /*$zScale*/ ctx[9]('validate'));
    			attr_dev(circle, "stroke-width", circle_stroke_width_value = /*circleRadius*/ ctx[4] * .2);
    			attr_dev(circle, "fill", "none");
    			add_location(circle, file$7, 104, 0, 3842);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, circle, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (!current || dirty[0] & /*$xScale, foldsCount*/ 68 && circle_r_value !== (circle_r_value = /*$xScale*/ ctx[6].range()[1] / /*foldsCount*/ ctx[2] / 3)) {
    				attr_dev(circle, "r", circle_r_value);
    			}

    			if (!current || dirty[0] & /*$xScale, foldsCount*/ 68 && circle_cx_value !== (circle_cx_value = /*$xScale*/ ctx[6](/*highlight*/ ctx[32]))) {
    				attr_dev(circle, "cx", circle_cx_value);
    			}

    			if (!current || dirty[0] & /*$yScale, foldsCount*/ 36 && circle_cy_value !== (circle_cy_value = /*$yScale*/ ctx[5](/*highlight*/ ctx[32]))) {
    				attr_dev(circle, "cy", circle_cy_value);
    			}

    			if (!current || dirty[0] & /*$zScale*/ 512 && circle_stroke_value !== (circle_stroke_value = /*$zScale*/ ctx[9]('validate'))) {
    				attr_dev(circle, "stroke", circle_stroke_value);
    			}

    			if (!current || dirty[0] & /*circleRadius*/ 16 && circle_stroke_width_value !== (circle_stroke_width_value = /*circleRadius*/ ctx[4] * .2)) {
    				attr_dev(circle, "stroke-width", circle_stroke_width_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (circle_outro) circle_outro.end(1);

    				circle_intro = create_in_transition(circle, draw, {
    					duration: 1000,
    					delay: /*interactive*/ ctx[3]
    					? 1000
    					: /*highlight*/ ctx[32] * 2000 / /*foldsCount*/ ctx[2]
    				});

    				circle_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (circle_intro) circle_intro.invalidate();
    			circle_outro = create_out_transition(circle, scale, /*scaleOutTransition*/ ctx[17]);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(circle);
    			if (detaching && circle_outro) circle_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(104:0) {#each range(1,foldsCount+1,1) as highlight}",
    		ctx
    	});

    	return block;
    }

    // (120:2) {#each nodes as point}
    function create_each_block$1(ctx) {
    	let circle;
    	let circle_fill_value;
    	let circle_stroke_width_value;
    	let circle_cx_value;
    	let circle_cy_value;
    	let circle_intro;
    	let circle_outro;
    	let current;

    	const block = {
    		c: function create() {
    			circle = svg_element("circle");
    			attr_dev(circle, "class", "node svelte-fzf10u");
    			attr_dev(circle, "r", /*circleRadius*/ ctx[4]);
    			attr_dev(circle, "fill", circle_fill_value = /*$zGet*/ ctx[10](/*point*/ ctx[29]) || /*nodeColor*/ ctx[0]);
    			attr_dev(circle, "stroke", /*nodeStroke*/ ctx[1]);
    			attr_dev(circle, "stroke-width", circle_stroke_width_value = /*circleRadius*/ ctx[4] * .1);
    			attr_dev(circle, "cx", circle_cx_value = /*point*/ ctx[29].x);
    			attr_dev(circle, "cy", circle_cy_value = /*point*/ ctx[29].y);
    			add_location(circle, file$7, 120, 4, 4229);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, circle, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (!current || dirty[0] & /*circleRadius*/ 16) {
    				attr_dev(circle, "r", /*circleRadius*/ ctx[4]);
    			}

    			if (!current || dirty[0] & /*$zGet, nodes, nodeColor*/ 1153 && circle_fill_value !== (circle_fill_value = /*$zGet*/ ctx[10](/*point*/ ctx[29]) || /*nodeColor*/ ctx[0])) {
    				attr_dev(circle, "fill", circle_fill_value);
    			}

    			if (!current || dirty[0] & /*nodeStroke*/ 2) {
    				attr_dev(circle, "stroke", /*nodeStroke*/ ctx[1]);
    			}

    			if (!current || dirty[0] & /*circleRadius*/ 16 && circle_stroke_width_value !== (circle_stroke_width_value = /*circleRadius*/ ctx[4] * .1)) {
    				attr_dev(circle, "stroke-width", circle_stroke_width_value);
    			}

    			if (!current || dirty[0] & /*nodes*/ 128 && circle_cx_value !== (circle_cx_value = /*point*/ ctx[29].x)) {
    				attr_dev(circle, "cx", circle_cx_value);
    			}

    			if (!current || dirty[0] & /*nodes*/ 128 && circle_cy_value !== (circle_cy_value = /*point*/ ctx[29].y)) {
    				attr_dev(circle, "cy", circle_cy_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (circle_outro) circle_outro.end(1);
    				circle_intro = create_in_transition(circle, scale, /*scaleInTransition*/ ctx[16]);
    				circle_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (circle_intro) circle_intro.invalidate();
    			circle_outro = create_out_transition(circle, scale, /*scaleOutTransition*/ ctx[17]);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(circle);
    			if (detaching && circle_outro) circle_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(120:2) {#each nodes as point}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let t0;
    	let t1;
    	let each2_anchor;
    	let current;
    	let each_value_2 = range(0, /*foldsCount*/ ctx[2], 1);
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value_1 = range(1, /*foldsCount*/ ctx[2] + 1, 1);
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*nodes*/ ctx[7];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out_1 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t0 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each2_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(target, anchor);
    			}

    			insert_dev(target, t0, anchor);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each2_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$xScale, foldsCount, $height*/ 324) {
    				each_value_2 = range(0, /*foldsCount*/ ctx[2], 1);
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_2(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(t0.parentNode, t0);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_2.length;
    			}

    			if (dirty[0] & /*$xScale, foldsCount, $yScale, $zScale, circleRadius, scaleOutTransition*/ 131700) {
    				each_value_1 = range(1, /*foldsCount*/ ctx[2] + 1, 1);
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(t1.parentNode, t1);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty[0] & /*circleRadius, $zGet, nodes, nodeColor, nodeStroke, scaleOutTransition*/ 132243) {
    				each_value = /*nodes*/ ctx[7];
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
    						each_blocks[i].m(each2_anchor.parentNode, each2_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks_2, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each2_anchor);
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
    	let circleRadius;
    	let data;
    	let simulation;
    	let $yScale;
    	let $xScale;
    	let $height;
    	let $zScale;
    	let $zGet;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ForcePackCircles', slots, []);
    	const { width, height, xScale, yScale, zScale, xGet, yGet, zGet } = getContext('LayerCake');
    	validate_store(height, 'height');
    	component_subscribe($$self, height, value => $$invalidate(8, $height = value));
    	validate_store(xScale, 'xScale');
    	component_subscribe($$self, xScale, value => $$invalidate(6, $xScale = value));
    	validate_store(yScale, 'yScale');
    	component_subscribe($$self, yScale, value => $$invalidate(5, $yScale = value));
    	validate_store(zScale, 'zScale');
    	component_subscribe($$self, zScale, value => $$invalidate(9, $zScale = value));
    	validate_store(zGet, 'zGet');
    	component_subscribe($$self, zGet, value => $$invalidate(10, $zGet = value));
    	let { manyBodyStrength = 5 } = $$props;
    	let { xStrength = 0.1 } = $$props;
    	let { yStrength = 0.1 } = $$props;
    	let { nodeColor = undefined } = $$props;
    	let { nodeStroke = '#fff' } = $$props;
    	let { nodeStrokeWidth = 1 } = $$props;
    	let { foldsCount = 5 } = $$props;
    	let { datasetSize = 50 } = $$props;
    	let { radius } = $$props;
    	let { interactive = false } = $$props;

    	/* --------------------------------------------
    * Make a copy because the simulation will alter the objects
    */
    	let nodes = [];

    	let scaleInTransition = {
    		duration: 100,
    		easing: quintIn,
    		opacity: .8
    	};

    	let scaleOutTransition = {
    		duration: 200,
    		easing: quintOut,
    		opacity: .8
    	};

    	const writable_props = [
    		'manyBodyStrength',
    		'xStrength',
    		'yStrength',
    		'nodeColor',
    		'nodeStroke',
    		'nodeStrokeWidth',
    		'foldsCount',
    		'datasetSize',
    		'radius',
    		'interactive'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ForcePackCircles> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('manyBodyStrength' in $$props) $$invalidate(18, manyBodyStrength = $$props.manyBodyStrength);
    		if ('xStrength' in $$props) $$invalidate(19, xStrength = $$props.xStrength);
    		if ('yStrength' in $$props) $$invalidate(20, yStrength = $$props.yStrength);
    		if ('nodeColor' in $$props) $$invalidate(0, nodeColor = $$props.nodeColor);
    		if ('nodeStroke' in $$props) $$invalidate(1, nodeStroke = $$props.nodeStroke);
    		if ('nodeStrokeWidth' in $$props) $$invalidate(21, nodeStrokeWidth = $$props.nodeStrokeWidth);
    		if ('foldsCount' in $$props) $$invalidate(2, foldsCount = $$props.foldsCount);
    		if ('datasetSize' in $$props) $$invalidate(22, datasetSize = $$props.datasetSize);
    		if ('radius' in $$props) $$invalidate(23, radius = $$props.radius);
    		if ('interactive' in $$props) $$invalidate(3, interactive = $$props.interactive);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		scale,
    		draw,
    		quintIn,
    		quintOut,
    		forceSimulation,
    		forceX,
    		forceY,
    		forceCollide,
    		range,
    		updateData,
    		width,
    		height,
    		xScale,
    		yScale,
    		zScale,
    		xGet,
    		yGet,
    		zGet,
    		manyBodyStrength,
    		xStrength,
    		yStrength,
    		nodeColor,
    		nodeStroke,
    		nodeStrokeWidth,
    		foldsCount,
    		datasetSize,
    		radius,
    		interactive,
    		nodes,
    		scaleInTransition,
    		scaleOutTransition,
    		circleRadius,
    		simulation,
    		data,
    		$yScale,
    		$xScale,
    		$height,
    		$zScale,
    		$zGet
    	});

    	$$self.$inject_state = $$props => {
    		if ('manyBodyStrength' in $$props) $$invalidate(18, manyBodyStrength = $$props.manyBodyStrength);
    		if ('xStrength' in $$props) $$invalidate(19, xStrength = $$props.xStrength);
    		if ('yStrength' in $$props) $$invalidate(20, yStrength = $$props.yStrength);
    		if ('nodeColor' in $$props) $$invalidate(0, nodeColor = $$props.nodeColor);
    		if ('nodeStroke' in $$props) $$invalidate(1, nodeStroke = $$props.nodeStroke);
    		if ('nodeStrokeWidth' in $$props) $$invalidate(21, nodeStrokeWidth = $$props.nodeStrokeWidth);
    		if ('foldsCount' in $$props) $$invalidate(2, foldsCount = $$props.foldsCount);
    		if ('datasetSize' in $$props) $$invalidate(22, datasetSize = $$props.datasetSize);
    		if ('radius' in $$props) $$invalidate(23, radius = $$props.radius);
    		if ('interactive' in $$props) $$invalidate(3, interactive = $$props.interactive);
    		if ('nodes' in $$props) $$invalidate(7, nodes = $$props.nodes);
    		if ('scaleInTransition' in $$props) $$invalidate(16, scaleInTransition = $$props.scaleInTransition);
    		if ('scaleOutTransition' in $$props) $$invalidate(17, scaleOutTransition = $$props.scaleOutTransition);
    		if ('circleRadius' in $$props) $$invalidate(4, circleRadius = $$props.circleRadius);
    		if ('simulation' in $$props) $$invalidate(24, simulation = $$props.simulation);
    		if ('data' in $$props) $$invalidate(25, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*radius, foldsCount*/ 8388612) {
    			$$invalidate(4, circleRadius = radius || 40 / foldsCount);
    		}

    		if ($$self.$$.dirty[0] & /*foldsCount, datasetSize*/ 4194308) {
    			$$invalidate(25, data = updateData(foldsCount, datasetSize));
    		}

    		if ($$self.$$.dirty[0] & /*data*/ 33554432) {
    			$$invalidate(24, simulation = forceSimulation(data));
    		}

    		if ($$self.$$.dirty[0] & /*simulation*/ 16777216) {
    			{
    				simulation.on("tick", () => {
    					$$invalidate(7, nodes = simulation.nodes());
    				});
    			}
    		}

    		if ($$self.$$.dirty[0] & /*simulation, circleRadius, $xScale, xStrength, $yScale, yStrength*/ 18350192) {
    			/* ----------------------------------------------
    * When variables change, set forces and restart the simulation
    */
    			{
    				simulation.//  .force('center',forceCenter([200, 200]))
    				//  .force('charge', forceManyBody().strength(manyBodyStrength))
    				force('collision', forceCollide().radius(circleRadius * .95)).force('x', forceX().x(d => $xScale(d.fold)).strength(xStrength)).force('y', forceY().y(d => $yScale(d.subFold)).strength(yStrength)).alpha(.8);
    			} //  .restart()
    		}
    	};

    	return [
    		nodeColor,
    		nodeStroke,
    		foldsCount,
    		interactive,
    		circleRadius,
    		$yScale,
    		$xScale,
    		nodes,
    		$height,
    		$zScale,
    		$zGet,
    		height,
    		xScale,
    		yScale,
    		zScale,
    		zGet,
    		scaleInTransition,
    		scaleOutTransition,
    		manyBodyStrength,
    		xStrength,
    		yStrength,
    		nodeStrokeWidth,
    		datasetSize,
    		radius,
    		simulation,
    		data
    	];
    }

    class ForcePackCircles extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$8,
    			create_fragment$8,
    			safe_not_equal,
    			{
    				manyBodyStrength: 18,
    				xStrength: 19,
    				yStrength: 20,
    				nodeColor: 0,
    				nodeStroke: 1,
    				nodeStrokeWidth: 21,
    				foldsCount: 2,
    				datasetSize: 22,
    				radius: 23,
    				interactive: 3
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ForcePackCircles",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*radius*/ ctx[23] === undefined && !('radius' in props)) {
    			console.warn("<ForcePackCircles> was created without expected prop 'radius'");
    		}
    	}

    	get manyBodyStrength() {
    		throw new Error("<ForcePackCircles>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set manyBodyStrength(value) {
    		throw new Error("<ForcePackCircles>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xStrength() {
    		throw new Error("<ForcePackCircles>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xStrength(value) {
    		throw new Error("<ForcePackCircles>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yStrength() {
    		throw new Error("<ForcePackCircles>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yStrength(value) {
    		throw new Error("<ForcePackCircles>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nodeColor() {
    		throw new Error("<ForcePackCircles>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nodeColor(value) {
    		throw new Error("<ForcePackCircles>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nodeStroke() {
    		throw new Error("<ForcePackCircles>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nodeStroke(value) {
    		throw new Error("<ForcePackCircles>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nodeStrokeWidth() {
    		throw new Error("<ForcePackCircles>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nodeStrokeWidth(value) {
    		throw new Error("<ForcePackCircles>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get foldsCount() {
    		throw new Error("<ForcePackCircles>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set foldsCount(value) {
    		throw new Error("<ForcePackCircles>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get datasetSize() {
    		throw new Error("<ForcePackCircles>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set datasetSize(value) {
    		throw new Error("<ForcePackCircles>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get radius() {
    		throw new Error("<ForcePackCircles>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set radius(value) {
    		throw new Error("<ForcePackCircles>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get interactive() {
    		throw new Error("<ForcePackCircles>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set interactive(value) {
    		throw new Error("<ForcePackCircles>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/KFoldInteractive.svelte generated by Svelte v3.46.4 */
    const file$6 = "src/Components/KFoldInteractive.svelte";

    // (69:6) <Svg>
    function create_default_slot_1$2(ctx) {
    	let forcepackcircles;
    	let updating_foldsCount;
    	let current;

    	function forcepackcircles_foldsCount_binding(value) {
    		/*forcepackcircles_foldsCount_binding*/ ctx[10](value);
    	}

    	let forcepackcircles_props = {
    		manyBodyStrength: /*manyBodyStrength*/ ctx[5],
    		xStrength: /*xStrength*/ ctx[6],
    		yStrength: /*yStrength*/ ctx[7],
    		datasetSize: /*datasetSize*/ ctx[4],
    		interactive: /*interactive*/ ctx[8],
    		nodeStroke: "#000"
    	};

    	if (/*foldsCount*/ ctx[2] !== void 0) {
    		forcepackcircles_props.foldsCount = /*foldsCount*/ ctx[2];
    	}

    	forcepackcircles = new ForcePackCircles({
    			props: forcepackcircles_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(forcepackcircles, 'foldsCount', forcepackcircles_foldsCount_binding));

    	const block = {
    		c: function create() {
    			create_component(forcepackcircles.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(forcepackcircles, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const forcepackcircles_changes = {};

    			if (!updating_foldsCount && dirty & /*foldsCount*/ 4) {
    				updating_foldsCount = true;
    				forcepackcircles_changes.foldsCount = /*foldsCount*/ ctx[2];
    				add_flush_callback(() => updating_foldsCount = false);
    			}

    			forcepackcircles.$set(forcepackcircles_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(forcepackcircles.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(forcepackcircles.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(forcepackcircles, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(69:6) <Svg>",
    		ctx
    	});

    	return block;
    }

    // (55:4) <LayerCake       x={xKey}       y={yKey}       z={zKey}       xScale={scalePoint()}       xDomain={range(0, foldsCount + 2, 1)}       xRange={[0, width - margin.right]}       yScale={scalePoint()}       yDomain={range(0, foldsCount + 2, 1)}       yRange={[height - margin.bottom, margin.top]}       zScale={scaleOrdinal()}       zDomain={["test", "train", "validate"]}       zRange={["limegreen", "darkslateblue", "hotpink"]}     >
    function create_default_slot$2(ctx) {
    	let svg;
    	let current;

    	svg = new Svg({
    			props: {
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(svg.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(svg, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const svg_changes = {};

    			if (dirty & /*$$scope, foldsCount*/ 16388) {
    				svg_changes.$$scope = { dirty, ctx };
    			}

    			svg.$set(svg_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(svg.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(svg.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(svg, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(55:4) <LayerCake       x={xKey}       y={yKey}       z={zKey}       xScale={scalePoint()}       xDomain={range(0, foldsCount + 2, 1)}       xRange={[0, width - margin.right]}       yScale={scalePoint()}       yDomain={range(0, foldsCount + 2, 1)}       yRange={[height - margin.bottom, margin.top]}       zScale={scaleOrdinal()}       zDomain={[\\\"test\\\", \\\"train\\\", \\\"validate\\\"]}       zRange={[\\\"limegreen\\\", \\\"darkslateblue\\\", \\\"hotpink\\\"]}     >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let h1;
    	let t1;
    	let p0;
    	let t3;
    	let div2;
    	let div0;
    	let input;
    	let t4;
    	let p1;
    	let t5;
    	let t6;
    	let t7;
    	let div1;
    	let layercake;
    	let div1_resize_listener;
    	let div2_resize_listener;
    	let t8;
    	let br0;
    	let t9;
    	let br1;
    	let t10;
    	let p2;
    	let current;
    	let mounted;
    	let dispose;

    	layercake = new LayerCake({
    			props: {
    				x: xKey$2,
    				y: yKey$2,
    				z: zKey$2,
    				xScale: point(),
    				xDomain: range(0, /*foldsCount*/ ctx[2] + 2, 1),
    				xRange: [0, /*width*/ ctx[1] - /*margin*/ ctx[3].right],
    				yScale: point(),
    				yDomain: range(0, /*foldsCount*/ ctx[2] + 2, 1),
    				yRange: [/*height*/ ctx[0] - /*margin*/ ctx[3].bottom, /*margin*/ ctx[3].top],
    				zScale: ordinal(),
    				zDomain: ["test", "train", "validate"],
    				zRange: ["limegreen", "darkslateblue", "hotpink"],
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Try For Yourself";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "To k-folds cross-validation more clear, we’ll see how the process works\n  directly. Let’s assume that we’d like to use a one-dimensional linear\n  regression model to predict the price of a house from its square-footage. Drag\n  the value of k for yourself to set the number of folds. Observe that each fold\n  results in a new data split alongside a newly trained model.";
    			t3 = space();
    			div2 = element("div");
    			div0 = element("div");
    			input = element("input");
    			t4 = space();
    			p1 = element("p");
    			t5 = text(/*foldsCount*/ ctx[2]);
    			t6 = text(" folds");
    			t7 = space();
    			div1 = element("div");
    			create_component(layercake.$$.fragment);
    			t8 = space();
    			br0 = element("br");
    			t9 = space();
    			br1 = element("br");
    			t10 = space();
    			p2 = element("p");
    			p2.textContent = "When exploring the fit models above, you may have observed something\n  interesting! The lines of best fit across our folds vary more for lower values\n  of k than for higher values of k. This is a result of our old friend, the bias\n  variance tradeoff (https://mlu-explain.github.io/bias-variance/). Read on to\n  learn more!";
    			attr_dev(h1, "class", "body-header");
    			add_location(h1, file$6, 30, 0, 768);
    			attr_dev(p0, "class", "body-text");
    			add_location(p0, file$6, 31, 0, 814);
    			attr_dev(input, "type", "range");
    			attr_dev(input, "min", "2");
    			attr_dev(input, "max", "10");
    			attr_dev(input, "step", "1");
    			attr_dev(input, "id", "foldsCountSelector");
    			add_location(input, file$6, 41, 4, 1297);
    			attr_dev(p1, "x", "20");
    			attr_dev(p1, "y", "0");
    			attr_dev(p1, "class", "error-axis-label");
    			add_location(p1, file$6, 49, 4, 1438);
    			add_location(div0, file$6, 40, 2, 1287);
    			attr_dev(div1, "id", "chart-container");
    			attr_dev(div1, "class", "svelte-1a1qo9t");
    			add_render_callback(() => /*div1_elementresize_handler*/ ctx[11].call(div1));
    			add_location(div1, file$6, 53, 2, 1529);
    			attr_dev(div2, "id", "cv-chart");
    			attr_dev(div2, "class", "svelte-1a1qo9t");
    			add_render_callback(() => /*div2_elementresize_handler*/ ctx[12].call(div2));
    			add_location(div2, file$6, 39, 0, 1213);
    			add_location(br0, file$6, 82, 0, 2314);
    			add_location(br1, file$6, 83, 0, 2321);
    			attr_dev(p2, "class", "body-text");
    			add_location(p2, file$6, 84, 0, 2328);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, input);
    			set_input_value(input, /*foldsCount*/ ctx[2]);
    			append_dev(div0, t4);
    			append_dev(div0, p1);
    			append_dev(p1, t5);
    			append_dev(p1, t6);
    			append_dev(div2, t7);
    			append_dev(div2, div1);
    			mount_component(layercake, div1, null);
    			div1_resize_listener = add_resize_listener(div1, /*div1_elementresize_handler*/ ctx[11].bind(div1));
    			div2_resize_listener = add_resize_listener(div2, /*div2_elementresize_handler*/ ctx[12].bind(div2));
    			insert_dev(target, t8, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, p2, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*input_change_input_handler*/ ctx[9]),
    					listen_dev(input, "input", /*input_change_input_handler*/ ctx[9])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*foldsCount*/ 4) {
    				set_input_value(input, /*foldsCount*/ ctx[2]);
    			}

    			if (!current || dirty & /*foldsCount*/ 4) set_data_dev(t5, /*foldsCount*/ ctx[2]);
    			const layercake_changes = {};
    			if (dirty & /*foldsCount*/ 4) layercake_changes.xDomain = range(0, /*foldsCount*/ ctx[2] + 2, 1);
    			if (dirty & /*width*/ 2) layercake_changes.xRange = [0, /*width*/ ctx[1] - /*margin*/ ctx[3].right];
    			if (dirty & /*foldsCount*/ 4) layercake_changes.yDomain = range(0, /*foldsCount*/ ctx[2] + 2, 1);
    			if (dirty & /*height*/ 1) layercake_changes.yRange = [/*height*/ ctx[0] - /*margin*/ ctx[3].bottom, /*margin*/ ctx[3].top];

    			if (dirty & /*$$scope, foldsCount*/ 16388) {
    				layercake_changes.$$scope = { dirty, ctx };
    			}

    			layercake.$set(layercake_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layercake.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layercake.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div2);
    			destroy_component(layercake);
    			div1_resize_listener();
    			div2_resize_listener();
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t10);
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

    const xKey$2 = "fold";
    const yKey$2 = "subFold";
    const zKey$2 = "category";

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('KFoldInteractive', slots, []);
    	let height = 500;
    	let width = 500;

    	// responsive margins
    	const mobile = window.innerWidth <= 700;

    	const margin = {
    		top: mobile ? 40 : 50,
    		bottom: mobile ? 10 : 25,
    		left: mobile ? 0 : 80,
    		right: mobile ? 0 : 10
    	};

    	let foldsCount = 2;
    	let datasetSize = 100;
    	let manyBodyStrength = -1;
    	let xStrength = 0.5;
    	let yStrength = 0.1;
    	let interactive = true;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<KFoldInteractive> was created with unknown prop '${key}'`);
    	});

    	function input_change_input_handler() {
    		foldsCount = to_number(this.value);
    		$$invalidate(2, foldsCount);
    	}

    	function forcepackcircles_foldsCount_binding(value) {
    		foldsCount = value;
    		$$invalidate(2, foldsCount);
    	}

    	function div1_elementresize_handler() {
    		width = this.offsetWidth;
    		height = this.offsetHeight;
    		$$invalidate(1, width);
    		$$invalidate(0, height);
    	}

    	function div2_elementresize_handler() {
    		width = this.offsetWidth;
    		height = this.offsetHeight;
    		$$invalidate(1, width);
    		$$invalidate(0, height);
    	}

    	$$self.$capture_state = () => ({
    		scalePoint: point,
    		scaleOrdinal: ordinal,
    		range,
    		LayerCake,
    		Svg,
    		ForcePackCircles,
    		height,
    		width,
    		mobile,
    		margin,
    		xKey: xKey$2,
    		yKey: yKey$2,
    		zKey: zKey$2,
    		foldsCount,
    		datasetSize,
    		manyBodyStrength,
    		xStrength,
    		yStrength,
    		interactive
    	});

    	$$self.$inject_state = $$props => {
    		if ('height' in $$props) $$invalidate(0, height = $$props.height);
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    		if ('foldsCount' in $$props) $$invalidate(2, foldsCount = $$props.foldsCount);
    		if ('datasetSize' in $$props) $$invalidate(4, datasetSize = $$props.datasetSize);
    		if ('manyBodyStrength' in $$props) $$invalidate(5, manyBodyStrength = $$props.manyBodyStrength);
    		if ('xStrength' in $$props) $$invalidate(6, xStrength = $$props.xStrength);
    		if ('yStrength' in $$props) $$invalidate(7, yStrength = $$props.yStrength);
    		if ('interactive' in $$props) $$invalidate(8, interactive = $$props.interactive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		height,
    		width,
    		foldsCount,
    		margin,
    		datasetSize,
    		manyBodyStrength,
    		xStrength,
    		yStrength,
    		interactive,
    		input_change_input_handler,
    		forcepackcircles_foldsCount_binding,
    		div1_elementresize_handler,
    		div2_elementresize_handler
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

    /* src/Components/Conclusion.svelte generated by Svelte v3.46.4 */

    const file$5 = "src/Components/Conclusion.svelte";

    function create_fragment$6(ctx) {
    	let section;
    	let h1;
    	let t1;
    	let p;
    	let t2;
    	let br0;
    	let br1;
    	let t3;
    	let a0;
    	let t5;
    	let a1;
    	let t7;
    	let br2;
    	let br3;
    	let t8;
    	let span;
    	let t10;

    	const block = {
    		c: function create() {
    			section = element("section");
    			h1 = element("h1");
    			h1.textContent = "The End";
    			t1 = space();
    			p = element("p");
    			t2 = text("Thanks for reading! We hope that the article is insightful no matter where\n    you are along your Machine Learning journey, and that you came away with a\n    better understanding of k-folds cross-validation in machine learning.\n    ");
    			br0 = element("br");
    			br1 = element("br");
    			t3 = text("\n    To learn more about Machine Learning, check out our self-paced courses, our YouTube\n    videos, and the Dive into Deep Learning textbook. If you have any comments or\n    ideas related to MLU-Explain articles, feel free to reach out directly to\n    ");
    			a0 = element("a");
    			a0.textContent = "Jared";
    			t5 = text("\n    or ");
    			a1 = element("a");
    			a1.textContent = "Jasper";
    			t7 = text(". The code\n    for this article is available here.\n    ");
    			br2 = element("br");
    			br3 = element("br");
    			t8 = text("\n    A special thanks goes out to ");
    			span = element("span");
    			span.textContent = "Brent Werness";
    			t10 = text(" for valuable\n    contributions to this article.");
    			attr_dev(h1, "class", "body-header");
    			add_location(h1, file$5, 4, 2, 32);
    			add_location(br0, file$5, 9, 4, 329);
    			add_location(br1, file$5, 9, 10, 335);
    			attr_dev(a0, "href", "https://twitter.com/jdwlbr");
    			add_location(a0, file$5, 13, 4, 594);
    			attr_dev(a1, "href", "https://www.linkedin.com/in/jaspercroome/");
    			add_location(a1, file$5, 14, 7, 648);
    			add_location(br2, file$5, 16, 4, 765);
    			add_location(br3, file$5, 16, 10, 771);
    			attr_dev(span, "class", "bold");
    			add_location(span, file$5, 17, 33, 811);
    			attr_dev(p, "class", "body-text");
    			add_location(p, file$5, 5, 2, 71);
    			add_location(section, file$5, 3, 0, 20);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h1);
    			append_dev(section, t1);
    			append_dev(section, p);
    			append_dev(p, t2);
    			append_dev(p, br0);
    			append_dev(p, br1);
    			append_dev(p, t3);
    			append_dev(p, a0);
    			append_dev(p, t5);
    			append_dev(p, a1);
    			append_dev(p, t7);
    			append_dev(p, br2);
    			append_dev(p, br3);
    			append_dev(p, t8);
    			append_dev(p, span);
    			append_dev(p, t10);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
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

    /* src/Components/Resources.svelte generated by Svelte v3.46.4 */

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
    	let t5;
    	let p0;
    	let t7;
    	let br4;
    	let t8;
    	let p1;
    	let a0;
    	let br5;
    	let t10;
    	let t11;
    	let p2;
    	let a1;
    	let br6;
    	let t13;
    	let t14;
    	let p3;
    	let a2;
    	let br7;
    	let t16;
    	let t17;
    	let p4;
    	let a3;
    	let br8;
    	let t19;
    	let t20;
    	let p5;
    	let a4;
    	let t22;
    	let br9;
    	let t23;
    	let t24;
    	let p6;
    	let a5;
    	let br10;
    	let t26;
    	let t27;
    	let br11;
    	let t28;
    	let br12;
    	let t29;
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
    			h3.textContent = "References + Open Source";
    			t5 = space();
    			p0 = element("p");
    			p0.textContent = "This article is a product of the following resources + the awesome people\n    who made (and contributed to) them:";
    			t7 = space();
    			br4 = element("br");
    			t8 = space();
    			p1 = element("p");
    			a0 = element("a");
    			a0.textContent = "Evaluation: From Precision, Recall and F-Factor to ROC, Informedness,\n      Markedness & Correlation";
    			br5 = element("br");
    			t10 = text("\n    (David Martin Ward Powers, 2008).");
    			t11 = space();
    			p2 = element("p");
    			a1 = element("a");
    			a1.textContent = "Classification assessment methods";
    			br6 = element("br");
    			t13 = text("\n    (John Ross Quinlan, 1986).");
    			t14 = space();
    			p3 = element("p");
    			a2 = element("a");
    			a2.textContent = "D3.js";
    			br7 = element("br");
    			t16 = text("(Mike Bostock &\n    Philippe Rivière)");
    			t17 = space();
    			p4 = element("p");
    			a3 = element("a");
    			a3.textContent = "LayerCake";
    			br8 = element("br");
    			t19 = text("(Michael Keller)");
    			t20 = space();
    			p5 = element("p");
    			a4 = element("a");
    			a4.textContent = "KaTeX";
    			t22 = space();
    			br9 = element("br");
    			t23 = text("(Emily Eisenberg\n    & Sophie Alpert)");
    			t24 = space();
    			p6 = element("p");
    			a5 = element("a");
    			a5.textContent = "Svelte";
    			br10 = element("br");
    			t26 = text("(Rich Harris)");
    			t27 = space();
    			br11 = element("br");
    			t28 = space();
    			br12 = element("br");
    			t29 = space();
    			br13 = element("br");
    			add_location(br0, file$4, 3, 0, 33);
    			add_location(br1, file$4, 4, 0, 40);
    			add_location(br2, file$4, 5, 0, 47);
    			add_location(br3, file$4, 7, 2, 81);
    			attr_dev(h3, "class", "body-header");
    			add_location(h3, file$4, 8, 2, 90);
    			attr_dev(p0, "class", "body-text");
    			add_location(p0, file$4, 9, 2, 146);
    			add_location(br4, file$4, 13, 2, 295);
    			attr_dev(a0, "class", "on-end svelte-fcszas");
    			attr_dev(a0, "href", "https://www.researchgate.net/publication/228529307_Evaluation_From_Precision_Recall_and_F-Factor_to_ROC_Informedness_Markedness_Correlation");
    			add_location(a0, file$4, 15, 4, 334);
    			add_location(br5, file$4, 20, 5, 627);
    			attr_dev(p1, "class", "resource-item svelte-fcszas");
    			add_location(p1, file$4, 14, 2, 304);
    			attr_dev(a1, "class", "on-end svelte-fcszas");
    			attr_dev(a1, "href", "https://link.springer.com/article/10.1007/BF00116251");
    			add_location(a1, file$4, 24, 4, 711);
    			add_location(br6, file$4, 28, 5, 850);
    			attr_dev(p2, "class", "resource-item svelte-fcszas");
    			add_location(p2, file$4, 23, 2, 681);
    			attr_dev(a2, "class", "on-end svelte-fcszas");
    			attr_dev(a2, "href", "https://d3js.org/");
    			add_location(a2, file$4, 32, 4, 927);
    			add_location(br7, file$4, 32, 56, 979);
    			attr_dev(p3, "class", "resource-item svelte-fcszas");
    			add_location(p3, file$4, 31, 2, 897);
    			attr_dev(a3, "class", "on-end svelte-fcszas");
    			attr_dev(a3, "href", "https://layercake.graphics/");
    			add_location(a3, file$4, 36, 4, 1062);
    			add_location(br8, file$4, 36, 70, 1128);
    			attr_dev(p4, "class", "resource-item svelte-fcszas");
    			add_location(p4, file$4, 35, 2, 1032);
    			attr_dev(a4, "class", "on-end svelte-fcszas");
    			attr_dev(a4, "href", "https://katex.org/");
    			add_location(a4, file$4, 40, 4, 1194);
    			add_location(br9, file$4, 40, 58, 1248);
    			attr_dev(p5, "class", "resource-item svelte-fcszas");
    			add_location(p5, file$4, 39, 2, 1164);
    			attr_dev(a5, "class", "on-end svelte-fcszas");
    			attr_dev(a5, "href", "https://svelte.dev/");
    			add_location(a5, file$4, 44, 4, 1331);
    			add_location(br10, file$4, 44, 59, 1386);
    			attr_dev(p6, "class", "resource-item svelte-fcszas");
    			add_location(p6, file$4, 43, 2, 1301);
    			add_location(br11, file$4, 46, 2, 1415);
    			add_location(br12, file$4, 47, 2, 1424);
    			add_location(br13, file$4, 48, 2, 1433);
    			attr_dev(section, "id", "resources");
    			attr_dev(section, "class", "svelte-fcszas");
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
    			append_dev(section, t5);
    			append_dev(section, p0);
    			append_dev(section, t7);
    			append_dev(section, br4);
    			append_dev(section, t8);
    			append_dev(section, p1);
    			append_dev(p1, a0);
    			append_dev(p1, br5);
    			append_dev(p1, t10);
    			append_dev(section, t11);
    			append_dev(section, p2);
    			append_dev(p2, a1);
    			append_dev(p2, br6);
    			append_dev(p2, t13);
    			append_dev(section, t14);
    			append_dev(section, p3);
    			append_dev(p3, a2);
    			append_dev(p3, br7);
    			append_dev(p3, t16);
    			append_dev(section, t17);
    			append_dev(section, p4);
    			append_dev(p4, a3);
    			append_dev(p4, br8);
    			append_dev(p4, t19);
    			append_dev(section, t20);
    			append_dev(section, p5);
    			append_dev(p5, a4);
    			append_dev(p5, t22);
    			append_dev(p5, br9);
    			append_dev(p5, t23);
    			append_dev(section, t24);
    			append_dev(section, p6);
    			append_dev(p6, a5);
    			append_dev(p6, br10);
    			append_dev(p6, t26);
    			append_dev(section, t27);
    			append_dev(section, br11);
    			append_dev(section, t28);
    			append_dev(section, br12);
    			append_dev(section, t29);
    			append_dev(section, br13);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
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

    /* src/Components/ValidationSet.svelte generated by Svelte v3.46.4 */
    const file$3 = "src/Components/ValidationSet.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	child_ctx[14] = i;
    	return child_ctx;
    }

    // (94:4) {#each nodes as cell, ndx}
    function create_each_block(ctx) {
    	let circle;
    	let circle_cx_value;
    	let circle_cy_value;
    	let circle_fill_value;

    	const block = {
    		c: function create() {
    			circle = svg_element("circle");
    			attr_dev(circle, "cx", circle_cx_value = /*cell*/ ctx[12].x);
    			attr_dev(circle, "cy", circle_cy_value = /*cell*/ ctx[12].y);
    			attr_dev(circle, "r", 10);
    			attr_dev(circle, "fill", circle_fill_value = /*colorScale*/ ctx[5](/*cell*/ ctx[12].category));
    			attr_dev(circle, "fill-opacity", ".8");
    			attr_dev(circle, "stroke", "black");
    			attr_dev(circle, "stroke-width", "1");
    			add_location(circle, file$3, 95, 8, 2558);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, circle, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*nodes*/ 4 && circle_cx_value !== (circle_cx_value = /*cell*/ ctx[12].x)) {
    				attr_dev(circle, "cx", circle_cx_value);
    			}

    			if (dirty & /*nodes*/ 4 && circle_cy_value !== (circle_cy_value = /*cell*/ ctx[12].y)) {
    				attr_dev(circle, "cy", circle_cy_value);
    			}

    			if (dirty & /*nodes*/ 4 && circle_fill_value !== (circle_fill_value = /*colorScale*/ ctx[5](/*cell*/ ctx[12].category))) {
    				attr_dev(circle, "fill", circle_fill_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(circle);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(94:4) {#each nodes as cell, ndx}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let h1;
    	let t1;
    	let p0;
    	let t2;
    	let a;
    	let t4;
    	let span0;
    	let t6;
    	let t7;
    	let br0;
    	let t8;
    	let ul;
    	let li0;
    	let span1;
    	let t10;
    	let t11;
    	let li1;
    	let span2;
    	let t13;
    	let t14;
    	let li2;
    	let span3;
    	let t16;
    	let t17;
    	let br1;
    	let t18;
    	let div;
    	let svg;
    	let g;
    	let text0;
    	let t19;
    	let text0_x_value;
    	let text1;
    	let t20;
    	let text1_y_value;
    	let text2;
    	let t21;
    	let text2_y_value;
    	let text3;
    	let t22;
    	let text3_y_value;
    	let svg_width_value;
    	let svg_height_value;
    	let div_resize_listener;
    	let t23;
    	let br2;
    	let br3;
    	let t24;
    	let p1;
    	let each_value = /*nodes*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Our Previous Approach";
    			t1 = space();
    			p0 = element("p");
    			t2 = text("In ");
    			a = element("a");
    			a.textContent = "a previous article";
    			t4 = text(", we described a standard technique for\n  solving this problem: ");
    			span0 = element("span");
    			span0.textContent = "The Validation Set Approach";
    			t6 = text(".\n  Recall this involved randomly splitting our data into three mutually exclusive\n  sets:");
    			t7 = space();
    			br0 = element("br");
    			t8 = space();
    			ul = element("ul");
    			li0 = element("li");
    			span1 = element("span");
    			span1.textContent = "The Training Set";
    			t10 = text(" is used to learn the model parameters.");
    			t11 = space();
    			li1 = element("li");
    			span2 = element("span");
    			span2.textContent = "The Validation Set";
    			t13 = text(" is used to select which model or\n    set of hyperparameters you’d like to use.");
    			t14 = space();
    			li2 = element("li");
    			span3 = element("span");
    			span3.textContent = "The Test Set";
    			t16 = text(" is used to evaluate how your model will\n    perform on unseen data.");
    			t17 = space();
    			br1 = element("br");
    			t18 = space();
    			div = element("div");
    			svg = svg_element("svg");
    			g = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			text0 = svg_element("text");
    			t19 = text("The Validation Set Approach");
    			text1 = svg_element("text");
    			t20 = text("Train");
    			text2 = svg_element("text");
    			t21 = text("Validate");
    			text3 = svg_element("text");
    			t22 = text("Test");
    			t23 = space();
    			br2 = element("br");
    			br3 = element("br");
    			t24 = space();
    			p1 = element("p");
    			p1.textContent = "The Validation Set Approach is still widely used, especially when resource\n  constraints prohibit alternatives that require resampling (like cross\n  validation). But the approach is perfect! The obvious issues is that our\n  estimate of the test error can be highly variable depending on which\n  particular observations are included in the training set and which are\n  included in the validation set. That is, how do we know that the 30% we\n  selected is the best way to split the data? What if we’d used a different\n  split instead? Another issue is that this approach tends to overestimate the\n  test error for models fit on our entire dataset. This is because more training\n  data usually means better accuracy, but the validation set approach reserves a\n  decent-sized chunk of data for validation and testing (and not training). If\n  only there was a better resampling method for assessing how the results of a\n  statistical analysis will generalize to an independent data set...";
    			attr_dev(h1, "class", "body-header");
    			add_location(h1, file$3, 61, 0, 1489);
    			attr_dev(a, "href", "");
    			add_location(a, file$3, 63, 5, 1567);
    			attr_dev(span0, "class", "bold");
    			add_location(span0, file$3, 64, 24, 1664);
    			attr_dev(p0, "class", "body-text");
    			add_location(p0, file$3, 62, 0, 1540);
    			add_location(br0, file$3, 68, 0, 1813);
    			attr_dev(span1, "class", "bold");
    			add_location(span1, file$3, 71, 4, 1854);
    			attr_dev(li0, "class", "svelte-1nkz3b2");
    			add_location(li0, file$3, 70, 2, 1845);
    			attr_dev(span2, "class", "bold");
    			add_location(span2, file$3, 74, 4, 1955);
    			attr_dev(li1, "class", "svelte-1nkz3b2");
    			add_location(li1, file$3, 73, 2, 1946);
    			attr_dev(span3, "class", "bold");
    			add_location(span3, file$3, 79, 4, 2099);
    			attr_dev(li2, "class", "svelte-1nkz3b2");
    			add_location(li2, file$3, 78, 2, 2090);
    			attr_dev(ul, "class", "body-text svelte-1nkz3b2");
    			add_location(ul, file$3, 69, 0, 1820);
    			add_location(br1, file$3, 83, 0, 2220);
    			add_location(g, file$3, 92, 4, 2459);
    			attr_dev(text0, "class", "error-axis-label svelte-1nkz3b2");
    			attr_dev(text0, "y", /*margin*/ ctx[3].top / 2);
    			attr_dev(text0, "x", text0_x_value = (/*width*/ ctx[1] + /*margin*/ ctx[3].left) / 2);
    			attr_dev(text0, "text-anchor", "middle");
    			add_location(text0, file$3, 108, 4, 2820);
    			attr_dev(text1, "class", "annotation svelte-1nkz3b2");
    			attr_dev(text1, "y", text1_y_value = /*height*/ ctx[0] / 2);
    			attr_dev(text1, "x", /*dotXScale*/ ctx[4]('train'));
    			attr_dev(text1, "text-anchor", "middle");
    			add_location(text1, file$3, 114, 4, 2979);
    			attr_dev(text2, "class", "annotation svelte-1nkz3b2");
    			attr_dev(text2, "y", text2_y_value = /*height*/ ctx[0] / 2);
    			attr_dev(text2, "x", /*dotXScale*/ ctx[4]('validate'));
    			attr_dev(text2, "text-anchor", "middle");
    			add_location(text2, file$3, 121, 6, 3120);
    			attr_dev(text3, "class", "annotation svelte-1nkz3b2");
    			attr_dev(text3, "y", text3_y_value = /*height*/ ctx[0] / 2);
    			attr_dev(text3, "x", /*dotXScale*/ ctx[4]('test'));
    			attr_dev(text3, "dx", "-2");
    			attr_dev(text3, "text-anchor", "middle");
    			add_location(text3, file$3, 128, 6, 3267);
    			attr_dev(svg, "width", svg_width_value = /*width*/ ctx[1] + /*margin*/ ctx[3].left + /*margin*/ ctx[3].right);
    			attr_dev(svg, "height", svg_height_value = /*height*/ ctx[0] + /*margin*/ ctx[3].top + /*margin*/ ctx[3].bottom);
    			attr_dev(svg, "overflow", "visible");
    			add_location(svg, file$3, 86, 2, 2302);
    			attr_dev(div, "id", "cv-chart");
    			attr_dev(div, "class", "svelte-1nkz3b2");
    			add_render_callback(() => /*div_elementresize_handler*/ ctx[6].call(div));
    			add_location(div, file$3, 85, 0, 2228);
    			add_location(br2, file$3, 138, 0, 3422);
    			add_location(br3, file$3, 138, 6, 3428);
    			attr_dev(p1, "class", "body-text");
    			add_location(p1, file$3, 139, 0, 3435);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p0, anchor);
    			append_dev(p0, t2);
    			append_dev(p0, a);
    			append_dev(p0, t4);
    			append_dev(p0, span0);
    			append_dev(p0, t6);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, ul, anchor);
    			append_dev(ul, li0);
    			append_dev(li0, span1);
    			append_dev(li0, t10);
    			append_dev(ul, t11);
    			append_dev(ul, li1);
    			append_dev(li1, span2);
    			append_dev(li1, t13);
    			append_dev(ul, t14);
    			append_dev(ul, li2);
    			append_dev(li2, span3);
    			append_dev(li2, t16);
    			insert_dev(target, t17, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t18, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, g);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}

    			append_dev(svg, text0);
    			append_dev(text0, t19);
    			append_dev(svg, text1);
    			append_dev(text1, t20);
    			append_dev(svg, text2);
    			append_dev(text2, t21);
    			append_dev(svg, text3);
    			append_dev(text3, t22);
    			div_resize_listener = add_resize_listener(div, /*div_elementresize_handler*/ ctx[6].bind(div));
    			insert_dev(target, t23, anchor);
    			insert_dev(target, br2, anchor);
    			insert_dev(target, br3, anchor);
    			insert_dev(target, t24, anchor);
    			insert_dev(target, p1, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*nodes, colorScale*/ 36) {
    				each_value = /*nodes*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(g, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*width*/ 2 && text0_x_value !== (text0_x_value = (/*width*/ ctx[1] + /*margin*/ ctx[3].left) / 2)) {
    				attr_dev(text0, "x", text0_x_value);
    			}

    			if (dirty & /*height*/ 1 && text1_y_value !== (text1_y_value = /*height*/ ctx[0] / 2)) {
    				attr_dev(text1, "y", text1_y_value);
    			}

    			if (dirty & /*height*/ 1 && text2_y_value !== (text2_y_value = /*height*/ ctx[0] / 2)) {
    				attr_dev(text2, "y", text2_y_value);
    			}

    			if (dirty & /*height*/ 1 && text3_y_value !== (text3_y_value = /*height*/ ctx[0] / 2)) {
    				attr_dev(text3, "y", text3_y_value);
    			}

    			if (dirty & /*width*/ 2 && svg_width_value !== (svg_width_value = /*width*/ ctx[1] + /*margin*/ ctx[3].left + /*margin*/ ctx[3].right)) {
    				attr_dev(svg, "width", svg_width_value);
    			}

    			if (dirty & /*height*/ 1 && svg_height_value !== (svg_height_value = /*height*/ ctx[0] + /*margin*/ ctx[3].top + /*margin*/ ctx[3].bottom)) {
    				attr_dev(svg, "height", svg_height_value);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(ul);
    			if (detaching) detach_dev(t17);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t18);
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			div_resize_listener();
    			if (detaching) detach_dev(t23);
    			if (detaching) detach_dev(br2);
    			if (detaching) detach_dev(br3);
    			if (detaching) detach_dev(t24);
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

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ValidationSet', slots, []);
    	let height = 500;
    	let width = 500;

    	// responsive margins
    	const mobile = window.innerWidth <= 700;

    	const margin = {
    		top: mobile ? 40 : 50,
    		bottom: mobile ? 10 : 25,
    		left: mobile ? 0 : 80,
    		right: mobile ? 0 : 10
    	};

    	// scales
    	let dotXScale = band().domain(['', 'train', 'validate', 'test', '']).range([0, width - margin.right]);

    	let colorScale = ordinal().domain(['train', 'validate', 'test']).range(['darkslateblue', 'hotpink', 'limegreen']);

    	// simulation data
    	let xStrength = 1;

    	let yStrength = 1;
    	let nodes = [];

    	let data = range(1, 100, 1).map((d, dNdx) => ({
    		value: d,
    		category: dNdx <= 70 ? 'train' : dNdx <= 90 ? 'validate' : 'test'
    	}));

    	let simulation = forceSimulation(data);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ValidationSet> was created with unknown prop '${key}'`);
    	});

    	function div_elementresize_handler() {
    		width = this.offsetWidth;
    		height = this.offsetHeight;
    		$$invalidate(1, width);
    		$$invalidate(0, height);
    	}

    	$$self.$capture_state = () => ({
    		scaleBand: band,
    		scaleOrdinal: ordinal,
    		range,
    		scale,
    		draw,
    		quintIn,
    		quintOut,
    		forceSimulation,
    		forceX,
    		forceY,
    		forceCollide,
    		each,
    		height,
    		width,
    		mobile,
    		margin,
    		dotXScale,
    		colorScale,
    		xStrength,
    		yStrength,
    		nodes,
    		data,
    		simulation
    	});

    	$$self.$inject_state = $$props => {
    		if ('height' in $$props) $$invalidate(0, height = $$props.height);
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    		if ('dotXScale' in $$props) $$invalidate(4, dotXScale = $$props.dotXScale);
    		if ('colorScale' in $$props) $$invalidate(5, colorScale = $$props.colorScale);
    		if ('xStrength' in $$props) $$invalidate(8, xStrength = $$props.xStrength);
    		if ('yStrength' in $$props) $$invalidate(9, yStrength = $$props.yStrength);
    		if ('nodes' in $$props) $$invalidate(2, nodes = $$props.nodes);
    		if ('data' in $$props) data = $$props.data;
    		if ('simulation' in $$props) $$invalidate(11, simulation = $$props.simulation);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*height*/ 1) {
    			{
    				simulation.force('collision', forceCollide().radius(9.5)).force('x', forceX().x(d => dotXScale(d.category)).strength(xStrength)).force('y', forceY().y(height / 2).strength(yStrength)).alpha(.8);
    			}
    		}
    	};

    	{
    		simulation.on("tick", () => {
    			$$invalidate(2, nodes = simulation.nodes());
    		});
    	}

    	return [height, width, nodes, margin, dotXScale, colorScale, div_elementresize_handler];
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

    /* src/Components/KFoldCV.svelte generated by Svelte v3.46.4 */
    const file$2 = "src/Components/KFoldCV.svelte";

    // (64:4) <Svg>
    function create_default_slot_1$1(ctx) {
    	let forcepackcircles;
    	let current;

    	forcepackcircles = new ForcePackCircles({
    			props: {
    				manyBodyStrength: /*manyBodyStrength*/ ctx[6],
    				xStrength: /*xStrength*/ ctx[7],
    				yStrength: /*yStrength*/ ctx[8],
    				datasetSize: /*datasetSize*/ ctx[5],
    				foldsCount: /*foldsCount*/ ctx[3],
    				radius: /*radius*/ ctx[4],
    				nodeStroke: "#000"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(forcepackcircles.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(forcepackcircles, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(forcepackcircles.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(forcepackcircles.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(forcepackcircles, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(64:4) <Svg>",
    		ctx
    	});

    	return block;
    }

    // (50:2) <LayerCake     x={xKey}     y={yKey}     z={zKey}     xScale={scalePoint()}     xDomain={range(0, foldsCount + 2, 1)}     xRange={[0, width - margin.right]}     yScale={scalePoint()}     yDomain={range(0, foldsCount + 2, 1)}     yRange={[height - margin.bottom, margin.top]}     zScale={scaleOrdinal()}     zDomain={["test", "train", "validate"]}     zRange={["limegreen", "darkslateblue", "hotpink"]}   >
    function create_default_slot$1(ctx) {
    	let svg;
    	let current;

    	svg = new Svg({
    			props: {
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(svg.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(svg, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const svg_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				svg_changes.$$scope = { dirty, ctx };
    			}

    			svg.$set(svg_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(svg.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(svg.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(svg, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(50:2) <LayerCake     x={xKey}     y={yKey}     z={zKey}     xScale={scalePoint()}     xDomain={range(0, foldsCount + 2, 1)}     xRange={[0, width - margin.right]}     yScale={scalePoint()}     yDomain={range(0, foldsCount + 2, 1)}     yRange={[height - margin.bottom, margin.top]}     zScale={scaleOrdinal()}     zDomain={[\\\"test\\\", \\\"train\\\", \\\"validate\\\"]}     zRange={[\\\"limegreen\\\", \\\"darkslateblue\\\", \\\"hotpink\\\"]}   >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let h1;
    	let t1;
    	let p0;
    	let t3;
    	let br0;
    	let t4;
    	let br1;
    	let t5;
    	let div;
    	let layercake;
    	let div_resize_listener;
    	let t6;
    	let br2;
    	let br3;
    	let t7;
    	let p1;
    	let current;

    	layercake = new LayerCake({
    			props: {
    				x: xKey$1,
    				y: yKey$1,
    				z: zKey$1,
    				xScale: point(),
    				xDomain: range(0, /*foldsCount*/ ctx[3] + 2, 1),
    				xRange: [0, /*width*/ ctx[1] - /*margin*/ ctx[2].right],
    				yScale: point(),
    				yDomain: range(0, /*foldsCount*/ ctx[3] + 2, 1),
    				yRange: [/*height*/ ctx[0] - /*margin*/ ctx[2].bottom, /*margin*/ ctx[2].top],
    				zScale: ordinal(),
    				zDomain: ["test", "train", "validate"],
    				zRange: ["limegreen", "darkslateblue", "hotpink"],
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "K-Folds Cross-Validation";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "Rather than worrying about which split of data to use for training versus\n  validation, we’ll use them all in turn. Our strategy will be to iteratively\n  use different portions of our data to test and train our model. The exact\n  process is actually quite simple: We’ll randomly split our dataset into k\n  sets, or folds, of equal size, reserving one fold for the validation set\n  (often called the holdout set) and the remaining k - 1 folds for the training\n  set. The training folds will fit our models parameters, and the validation\n  fold will be used for evaluation. This process will be repeated on our data k\n  times, using a different fold for the validation set at each iteration. This\n  process is known as *k-folds cross validation*, and requires re-fitting our\n  data k times (once for each fold):";
    			t3 = space();
    			br0 = element("br");
    			t4 = space();
    			br1 = element("br");
    			t5 = space();
    			div = element("div");
    			create_component(layercake.$$.fragment);
    			t6 = space();
    			br2 = element("br");
    			br3 = element("br");
    			t7 = space();
    			p1 = element("p");
    			p1.textContent = "This simple extension to the validation approach is very effective at\n  overcoming the shortcomings of the validation set approach. Because we train\n  our model on multiple instances of our data and take the average of their\n  evaluation scores, our evaluation estimates have lower variance. Additionally,\n  each fold itself uses more data than previously, so test error estimates are\n  more accurate. Even for modest values (e.g. k = 5), our training set comprises\n  80% of our data. Compare that with the validation set approach, where our\n  model is typically trained on around only 50-60 percent of the original\n  dataset. This means that the K-fold approach typically doesn’t overestimate\n  the test error as much as the validation set approach does.";
    			attr_dev(h1, "class", "body-header");
    			add_location(h1, file$2, 30, 0, 762);
    			attr_dev(p0, "class", "body-text");
    			add_location(p0, file$2, 31, 0, 816);
    			add_location(br0, file$2, 44, 0, 1655);
    			add_location(br1, file$2, 46, 0, 1663);
    			attr_dev(div, "id", "cv-chart");
    			attr_dev(div, "class", "svelte-1lgmdv5");
    			add_render_callback(() => /*div_elementresize_handler*/ ctx[9].call(div));
    			add_location(div, file$2, 48, 0, 1671);
    			add_location(br2, file$2, 76, 0, 2380);
    			add_location(br3, file$2, 76, 6, 2386);
    			attr_dev(p1, "class", "body-text");
    			add_location(p1, file$2, 77, 0, 2393);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(layercake, div, null);
    			div_resize_listener = add_resize_listener(div, /*div_elementresize_handler*/ ctx[9].bind(div));
    			insert_dev(target, t6, anchor);
    			insert_dev(target, br2, anchor);
    			insert_dev(target, br3, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, p1, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const layercake_changes = {};
    			if (dirty & /*width*/ 2) layercake_changes.xRange = [0, /*width*/ ctx[1] - /*margin*/ ctx[2].right];
    			if (dirty & /*height*/ 1) layercake_changes.yRange = [/*height*/ ctx[0] - /*margin*/ ctx[2].bottom, /*margin*/ ctx[2].top];

    			if (dirty & /*$$scope*/ 2048) {
    				layercake_changes.$$scope = { dirty, ctx };
    			}

    			layercake.$set(layercake_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layercake.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layercake.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div);
    			destroy_component(layercake);
    			div_resize_listener();
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(br2);
    			if (detaching) detach_dev(br3);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(p1);
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

    const xKey$1 = "fold";
    const yKey$1 = "subFold";
    const zKey$1 = "category";

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('KFoldCV', slots, []);
    	let height = 500;
    	let width = 500;

    	// responsive margins
    	const mobile = window.innerWidth <= 700;

    	const margin = {
    		top: mobile ? 40 : 50,
    		bottom: mobile ? 10 : 25,
    		left: mobile ? 0 : 80,
    		right: mobile ? 0 : 10
    	};

    	let foldsCount = 5;
    	let radius = 10;
    	let datasetSize = 100;
    	let manyBodyStrength = 0.1;
    	let xStrength = 0.5;
    	let yStrength = 0.1;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<KFoldCV> was created with unknown prop '${key}'`);
    	});

    	function div_elementresize_handler() {
    		width = this.offsetWidth;
    		height = this.offsetHeight;
    		$$invalidate(1, width);
    		$$invalidate(0, height);
    	}

    	$$self.$capture_state = () => ({
    		scalePoint: point,
    		scaleOrdinal: ordinal,
    		range,
    		LayerCake,
    		Svg,
    		ForcePackCircles,
    		height,
    		width,
    		mobile,
    		margin,
    		xKey: xKey$1,
    		yKey: yKey$1,
    		zKey: zKey$1,
    		foldsCount,
    		radius,
    		datasetSize,
    		manyBodyStrength,
    		xStrength,
    		yStrength
    	});

    	$$self.$inject_state = $$props => {
    		if ('height' in $$props) $$invalidate(0, height = $$props.height);
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    		if ('foldsCount' in $$props) $$invalidate(3, foldsCount = $$props.foldsCount);
    		if ('radius' in $$props) $$invalidate(4, radius = $$props.radius);
    		if ('datasetSize' in $$props) $$invalidate(5, datasetSize = $$props.datasetSize);
    		if ('manyBodyStrength' in $$props) $$invalidate(6, manyBodyStrength = $$props.manyBodyStrength);
    		if ('xStrength' in $$props) $$invalidate(7, xStrength = $$props.xStrength);
    		if ('yStrength' in $$props) $$invalidate(8, yStrength = $$props.yStrength);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		height,
    		width,
    		margin,
    		foldsCount,
    		radius,
    		datasetSize,
    		manyBodyStrength,
    		xStrength,
    		yStrength,
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

    /* src/Components/LOOCV.svelte generated by Svelte v3.46.4 */
    const file$1 = "src/Components/LOOCV.svelte";

    // (64:6) <Svg>
    function create_default_slot_1(ctx) {
    	let forcepackcircles;
    	let current;

    	forcepackcircles = new ForcePackCircles({
    			props: {
    				manyBodyStrength: /*manyBodyStrength*/ ctx[6],
    				xStrength: /*xStrength*/ ctx[7],
    				yStrength: /*yStrength*/ ctx[8],
    				foldsCount: /*foldsCount*/ ctx[3],
    				radius: /*radius*/ ctx[5],
    				datasetSize: /*datasetSize*/ ctx[4],
    				nodeStroke: "none"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(forcepackcircles.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(forcepackcircles, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(forcepackcircles.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(forcepackcircles.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(forcepackcircles, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(64:6) <Svg>",
    		ctx
    	});

    	return block;
    }

    // (50:4) <LayerCake       x={xKey}       y={yKey}       z={zKey}       xScale={scalePoint()}       xDomain={range(0, foldsCount + 2, 1)}       xRange={[0, width - margin.right]}       yScale={scalePoint()}       yDomain={range(0, foldsCount + 2, 1)}       yRange={[height - margin.bottom, margin.top]}       zScale={scaleOrdinal()}       zDomain={["test", "train", "validate"]}       zRange={["limegreen", "darkslateblue", "hotpink"]}     >
    function create_default_slot(ctx) {
    	let svg;
    	let current;

    	svg = new Svg({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(svg.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(svg, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const svg_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
    				svg_changes.$$scope = { dirty, ctx };
    			}

    			svg.$set(svg_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(svg.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(svg.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(svg, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(50:4) <LayerCake       x={xKey}       y={yKey}       z={zKey}       xScale={scalePoint()}       xDomain={range(0, foldsCount + 2, 1)}       xRange={[0, width - margin.right]}       yScale={scalePoint()}       yDomain={range(0, foldsCount + 2, 1)}       yRange={[height - margin.bottom, margin.top]}       zScale={scaleOrdinal()}       zDomain={[\\\"test\\\", \\\"train\\\", \\\"validate\\\"]}       zRange={[\\\"limegreen\\\", \\\"darkslateblue\\\", \\\"hotpink\\\"]}     >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let h1;
    	let t1;
    	let p0;
    	let t3;
    	let br0;
    	let t4;
    	let div2;
    	let div0;
    	let p1;
    	let t5;
    	let t6;
    	let t7;
    	let p1_x_value;
    	let t8;
    	let div1;
    	let layercake;
    	let div1_resize_listener;
    	let div2_resize_listener;
    	let t9;
    	let br1;
    	let br2;
    	let t10;
    	let p2;
    	let t11;
    	let br3;
    	let br4;
    	let t12;
    	let current;

    	layercake = new LayerCake({
    			props: {
    				x: xKey,
    				y: yKey,
    				z: zKey,
    				xScale: point(),
    				xDomain: range(0, /*foldsCount*/ ctx[3] + 2, 1),
    				xRange: [0, /*width*/ ctx[1] - /*margin*/ ctx[2].right],
    				yScale: point(),
    				yDomain: range(0, /*foldsCount*/ ctx[3] + 2, 1),
    				yRange: [/*height*/ ctx[0] - /*margin*/ ctx[2].bottom, /*margin*/ ctx[2].top],
    				zScale: ordinal(),
    				zDomain: ["test", "train", "validate"],
    				zRange: ["limegreen", "darkslateblue", "hotpink"],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Leave-One-Out Cross-Validation (LOOCV)";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "A special case of k-fold cross-validation, called *leave one out cv*, occurs\n  when we set k equal to n, the number of observations in our dataset. In\n  leave-one-out cross-validation, our data is repeatedly split into a training\n  set containing all but one observations, and a validation set containing the\n  remaining left out observation. That is, the training set consists of n-1\n  observations, and the validation set consists of just one individual\n  observation:";
    			t3 = space();
    			br0 = element("br");
    			t4 = space();
    			div2 = element("div");
    			div0 = element("div");
    			p1 = element("p");
    			t5 = text(/*foldsCount*/ ctx[3]);
    			t6 = text(" folds, n: ");
    			t7 = text(/*datasetSize*/ ctx[4]);
    			t8 = space();
    			div1 = element("div");
    			create_component(layercake.$$.fragment);
    			t9 = space();
    			br1 = element("br");
    			br2 = element("br");
    			t10 = space();
    			p2 = element("p");
    			t11 = text("LOOCV carries all the same benefits mentioned above. But it’s extreme value of\n  k carries some additional costs, most notably those related to resource-use.\n  This is expensive both resource-wise and time-wise, doubly so when the model\n  is large and time-consuming to fit. However, all hope is not lost! [JC - do we\n  want this last sentence? Seems like a leftover fragment.] For linear models,\n  not the case for linear models which have a closed-form solution pg 203).\n  ");
    			br3 = element("br");
    			br4 = element("br");
    			t12 = text("\n  Up to this point, we’ve talked about k-folds cross-validation in the general sense,\n  along with its two most-extreme cases: LOOCV (k-folds with k = n) and the Validation\n  Set Approach (k-folds with k = 2). Given the multitude of options for selecting\n  k, how do we select the best value?");
    			attr_dev(h1, "class", "body-header");
    			add_location(h1, file$1, 30, 0, 757);
    			attr_dev(p0, "class", "body-text");
    			add_location(p0, file$1, 31, 0, 825);
    			add_location(br0, file$1, 40, 0, 1325);
    			attr_dev(p1, "x", p1_x_value = /*margin*/ ctx[2].left + /*width*/ ctx[1] / 2);
    			attr_dev(p1, "y", "0");
    			attr_dev(p1, "class", "error-axis-label");
    			add_location(p1, file$1, 44, 4, 1417);
    			add_location(div0, file$1, 43, 2, 1407);
    			attr_dev(div1, "id", "chart-container");
    			attr_dev(div1, "class", "svelte-152c00z");
    			add_render_callback(() => /*div1_elementresize_handler*/ ctx[9].call(div1));
    			add_location(div1, file$1, 48, 2, 1545);
    			attr_dev(div2, "id", "cv-chart");
    			attr_dev(div2, "class", "svelte-152c00z");
    			add_render_callback(() => /*div2_elementresize_handler*/ ctx[10].call(div2));
    			add_location(div2, file$1, 42, 0, 1333);
    			add_location(br1, file$1, 77, 0, 2322);
    			add_location(br2, file$1, 77, 6, 2328);
    			add_location(br3, file$1, 85, 2, 2834);
    			add_location(br4, file$1, 85, 8, 2840);
    			attr_dev(p2, "class", "body-text");
    			add_location(p2, file$1, 78, 0, 2335);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, p1);
    			append_dev(p1, t5);
    			append_dev(p1, t6);
    			append_dev(p1, t7);
    			append_dev(div2, t8);
    			append_dev(div2, div1);
    			mount_component(layercake, div1, null);
    			div1_resize_listener = add_resize_listener(div1, /*div1_elementresize_handler*/ ctx[9].bind(div1));
    			div2_resize_listener = add_resize_listener(div2, /*div2_elementresize_handler*/ ctx[10].bind(div2));
    			insert_dev(target, t9, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, br2, anchor);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, p2, anchor);
    			append_dev(p2, t11);
    			append_dev(p2, br3);
    			append_dev(p2, br4);
    			append_dev(p2, t12);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*width*/ 2 && p1_x_value !== (p1_x_value = /*margin*/ ctx[2].left + /*width*/ ctx[1] / 2)) {
    				attr_dev(p1, "x", p1_x_value);
    			}

    			const layercake_changes = {};
    			if (dirty & /*width*/ 2) layercake_changes.xRange = [0, /*width*/ ctx[1] - /*margin*/ ctx[2].right];
    			if (dirty & /*height*/ 1) layercake_changes.yRange = [/*height*/ ctx[0] - /*margin*/ ctx[2].bottom, /*margin*/ ctx[2].top];

    			if (dirty & /*$$scope*/ 4096) {
    				layercake_changes.$$scope = { dirty, ctx };
    			}

    			layercake.$set(layercake_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layercake.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layercake.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div2);
    			destroy_component(layercake);
    			div1_resize_listener();
    			div2_resize_listener();
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(br2);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(p2);
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

    const xKey = "fold";
    const yKey = "subFold";
    const zKey = "category";

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LOOCV', slots, []);
    	let height = 500;
    	let width = 500;

    	// responsive margins
    	const mobile = window.innerWidth <= 700;

    	const margin = {
    		top: mobile ? 40 : 50,
    		bottom: mobile ? 10 : 25,
    		left: mobile ? 0 : 80,
    		right: mobile ? 0 : 10
    	};

    	let foldsCount = 50;
    	let datasetSize = 50;
    	let radius = 4;
    	let manyBodyStrength = 0.1;
    	let xStrength = 1;
    	let yStrength = 1;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LOOCV> was created with unknown prop '${key}'`);
    	});

    	function div1_elementresize_handler() {
    		width = this.offsetWidth;
    		height = this.offsetHeight;
    		$$invalidate(1, width);
    		$$invalidate(0, height);
    	}

    	function div2_elementresize_handler() {
    		width = this.offsetWidth;
    		height = this.offsetHeight;
    		$$invalidate(1, width);
    		$$invalidate(0, height);
    	}

    	$$self.$capture_state = () => ({
    		scalePoint: point,
    		scaleOrdinal: ordinal,
    		range,
    		LayerCake,
    		Svg,
    		ForcePackCircles,
    		height,
    		width,
    		mobile,
    		margin,
    		xKey,
    		yKey,
    		zKey,
    		foldsCount,
    		datasetSize,
    		radius,
    		manyBodyStrength,
    		xStrength,
    		yStrength
    	});

    	$$self.$inject_state = $$props => {
    		if ('height' in $$props) $$invalidate(0, height = $$props.height);
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    		if ('foldsCount' in $$props) $$invalidate(3, foldsCount = $$props.foldsCount);
    		if ('datasetSize' in $$props) $$invalidate(4, datasetSize = $$props.datasetSize);
    		if ('radius' in $$props) $$invalidate(5, radius = $$props.radius);
    		if ('manyBodyStrength' in $$props) $$invalidate(6, manyBodyStrength = $$props.manyBodyStrength);
    		if ('xStrength' in $$props) $$invalidate(7, xStrength = $$props.xStrength);
    		if ('yStrength' in $$props) $$invalidate(8, yStrength = $$props.yStrength);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		height,
    		width,
    		margin,
    		foldsCount,
    		datasetSize,
    		radius,
    		manyBodyStrength,
    		xStrength,
    		yStrength,
    		div1_elementresize_handler,
    		div2_elementresize_handler
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

    /* src/Components/BiasVariance.svelte generated by Svelte v3.46.4 */

    const file = "src/Components/BiasVariance.svelte";

    function create_fragment$1(ctx) {
    	let section;
    	let h1;
    	let t1;
    	let p;

    	const block = {
    		c: function create() {
    			section = element("section");
    			h1 = element("h1");
    			h1.textContent = "Selecting K and The Bias Variance Tradeoff - It’s Complicated";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Let's start first with how k affects bias. Recall that the Validation Set\n    Approach suffered from only using a handful of available data for model\n    training. For most commonly used models, the more data the model has to\n    train on, the less bias it will have. Taken to the extreme end, we can use\n    LOOCV to minimize the contribution of bias. Variance is a bit more subtle.\n    Classical arguments [XX] claim that the variance should be higher for larger\n    k since each model is trained on nearly identical data meaning that every\n    model should be nearly the same. However in [XX, YY, ZZ] it has been shown\n    that in many cases the variance can either decrease for larger k as well\n    depending on the model---no one is completely sure what to expect! One thing\n    that is certain: larger values of k require training more models, so often\n    k=5 or k=10 is the largest you might be able to do in practice (if you can\n    use it at all)!";
    			attr_dev(h1, "class", "body-header");
    			add_location(h1, file, 4, 2, 32);
    			attr_dev(p, "class", "body-text");
    			add_location(p, file, 7, 2, 133);
    			add_location(section, file, 3, 0, 20);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h1);
    			append_dev(section, t1);
    			append_dev(section, p);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
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

    /* src/App.svelte generated by Svelte v3.46.4 */

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
    	let loocv;
    	let t5;
    	let kfoldinteractive;
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
    	loocv = new LOOCV({ $$inline: true });
    	kfoldinteractive = new KFoldInteractive({ $$inline: true });
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
    			create_component(loocv.$$.fragment);
    			t5 = space();
    			create_component(kfoldinteractive.$$.fragment);
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
    			mount_component(loocv, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(kfoldinteractive, target, anchor);
    			insert_dev(target, t6, anchor);
    			mount_component(biasvariance, target, anchor);
    			insert_dev(target, t7, anchor);
    			mount_component(conclusion, target, anchor);
    			insert_dev(target, t8, anchor);
    			mount_component(resources, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro$1(local) {
    			if (current) return;
    			transition_in(logo.$$.fragment, local);
    			transition_in(title.$$.fragment, local);
    			transition_in(intro.$$.fragment, local);
    			transition_in(validationset.$$.fragment, local);
    			transition_in(kfoldcv.$$.fragment, local);
    			transition_in(loocv.$$.fragment, local);
    			transition_in(kfoldinteractive.$$.fragment, local);
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
    			transition_out(loocv.$$.fragment, local);
    			transition_out(kfoldinteractive.$$.fragment, local);
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
    			destroy_component(loocv, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(kfoldinteractive, detaching);
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
