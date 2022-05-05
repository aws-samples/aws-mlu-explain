'use strict';

var livereload$1 = require('livereload');
var path = require('path');
require('child_process');
var net = require('net');

let promise;

function weird() {
	if (!promise) {
		promise = get_weird(9000);
	}
	return promise;
}

function get_weird(port) {
	return new Promise(fulfil => {
		const server = net.createServer();

		server.unref();

		server.on('error', () => {
			fulfil(get_weird(port + 1));
		});

		server.listen({ port }, () => {
			const server2 = net.createServer();

			server2.unref();

			server2.on('error', () => {
				server.close(() => {
					fulfil(false);
				});
			});

			server2.listen({ port }, () => {
				server2.close(() => {
					server.close(() => {
						fulfil(true);
					});
				});
			});
		});
	});
}

function find(port) {
	return weird().then(weird => {
		if (weird) {
			return new Promise(fulfil => {
				get_port_weird(port, fulfil);
			});
		}
		return new Promise(fulfil => {
			get_port(port, fulfil);
		});
	});
}

function get_port(port, cb) {
	const server = net.createServer();

	server.unref();

	server.on('error', () => {
		get_port(port + 1, cb);
	});

	server.listen({ port }, () => {
		server.close(() => {
			cb(port);
		});
	});
}

function get_port_weird(port, cb) {
	const client = net.createConnection({ port }, () => {
			client.end();
			get_port(port + 1, cb);
		})
		.on('error', () => {
			cb(port);
		});
}

const state = (global.PLUGIN_LIVERELOAD = global.PLUGIN_LIVERELOAD || {
  server: null,
});

function livereload(options = { watch: '' }) {
  if (typeof options === 'string') {
    options = {
      watch: options,
    };
  } else {
    options.watch = options.watch || '';
  }

  // release previous server instance if rollup is reloading configuration
  // in watch mode
  if (state.server) {
    state.server.close();
  }

  let enabled = options.verbose === false;
  const portPromise = find(options.port || 35729);

  portPromise.then(port => {
    state.server = livereload$1.createServer({ ...options, port });

    // Start watching
    if (Array.isArray(options.watch)) {
      state.server.watch(options.watch.map(w => path.resolve(process.cwd(), w)));
    } else {
      state.server.watch(path.resolve(process.cwd(), options.watch));
    }
  });

  return {
    name: 'livereload',
    async banner() {
      if (options.inject === false) {
        return
      }
      const port = await portPromise;
      const snippetSrc = options.clientUrl
        ? JSON.stringify(options.clientUrl)
        : process.env.CODESANDBOX_SSE
        ? `'//' + (self.location.host.replace(/^([^.]+)-\\d+/,"$1").replace(/^([^.]+)/, "$1-${port}")).split(':')[0] + '/livereload.js?snipver=1&port=443'`
        : `'//' + (self.location.host || 'localhost').split(':')[0] + ':${port}/livereload.js?snipver=1'`;
      return `(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = ${snippetSrc}; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);`
    },
    async generateBundle() {
      if (!enabled) {
        enabled = true;
        const port = await portPromise;
        const customPort = port !== 35729 ? ' on port ' + port : '';
        console.log(green('LiveReload enabled' + customPort));
      }
    },
  }
}

function green(text) {
  return '\u001b[1m\u001b[32m' + text + '\u001b[39m\u001b[22m'
}

module.exports = livereload;
