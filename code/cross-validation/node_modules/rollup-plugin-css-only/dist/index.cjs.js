'use strict';

var pluginutils = require('@rollup/pluginutils');

function css(options) {
  if ( options === void 0 ) options = {};

  var filter = pluginutils.createFilter(options.include || ['**/*.css'], options.exclude);
  var styles = {};
  var order = [];
  var dest = options.output;
  var changes = 0;

  return {
    name: 'css',
    transform: function transform(code, id) {
      if (!filter(id)) {
        return
      }

      // When output is disabled, the stylesheet is exported as a string
      if (options.output === false) {
        return {
          code: 'export default ' + JSON.stringify(code),
          map: { mappings: '' }
        }
      }

      // Track the order that each stylesheet is imported.
      if (!order.includes(id)) {
        order.push(id);
      }

      // Keep track of every stylesheet
      // Check if it changed since last render
      if (styles[id] !== code && (styles[id] || code)) {
        styles[id] = code;
        changes++;
      }

      return ''
    },
    generateBundle: function generateBundle(opts, bundle) {
      // No stylesheet needed
      if (!changes || options.output === false) {
        return
      }
      changes = 0;

      // Combine all stylesheets, respecting import order
      var css = '';
      for (var x = 0; x < order.length; x++) {
        var id = order[x];
        css += styles[id] || '';
      }

      // Emit styles through callback
      if (typeof options.output === 'function') {
        options.output(css, styles, bundle);
        return
      }

      if (typeof dest !== 'string') {
        // Don't create unwanted empty stylesheets
        if (!css.length) {
          return
        }

        // Guess destination filename
        dest =
          opts.file ||
          (Array.isArray(opts.output)
            ? opts.output[0].file
            : opts.output && opts.output.file) ||
          opts.dest ||
          'bundle.js';
        if (dest.endsWith('.js')) {
          dest = dest.slice(0, -3);
        }
        dest = dest + '.css';
      }

      // Emit styles to file
      this.emitFile({ type: 'asset', fileName: dest, source: css });
    }
  }
}

module.exports = css;
