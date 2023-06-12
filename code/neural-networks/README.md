# A Svelte Template with SASS Support

This Svelte app is based on the project template at [https://github.com/sveltejs/template](https://github.com/sveltejs/template), with the addition of SASS/SCSS support from [svelte-preprocess](https://github.com/kaisermann/svelte-preprocess).

It supports VSCode syntax highlighting out of the box, with the `svelte.config.js` file. For more on how this works, read [Svelte with SASS/SCSS in VSCode](https://daveceddia.com/svelte-with-sass-in-vscode/).

It also should handle the other processors enabled by `svelte-preprocess`:

- pug
- coffeescript or coffee
- less
- scss or sass
- stylus
- postcss
- globalStyle (transform `<style global>` into global styles.)

This project comes with `node-sass` as a dependency, for SASS support, but you'll need to install other packages if you want to support e.g. PostCSS.

## What to Change

Starting fresh? Clone this template with `degit dceddia/svelte-template-sass` and you're all set.

Got an existing project? There are only a few changes to make:

- `npm install svelte-preprocess node-sass`
- Update `rollup.config.js` to add "preprocess" to the `svelte` plugin (you'll also need to import `autoPreprocess`)

```js
/// rollup.config.js

// At the top, add this import:
import preprocess from 'svelte-preprocess';


/* ... */


// Add preprocess to the plugins:
export default {
  /* ... */
  plugins: [
    svelte({
      /* ... */
      preprocess: preprocess()
  }),
  /* ... */
}
```

- Create `svelte.config.js` for VSCode support, and install the [Svelte for VSCode](https://marketplace.visualstudio.com/items?itemName=JamesBirtles.svelte-vscode) extension.

```js
// svelte.config.js
const preprocess = require('svelte-preprocess');

module.exports = {
  preprocess: preprocess()
};
```
