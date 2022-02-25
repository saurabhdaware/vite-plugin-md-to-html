# vite-plugin-md-to-html

Vite plugin to convert markdown to html.


**TODO:**
- [x] Markdown to HTML
- [x] Front Matter Extraction
- [ ] Syntax Highlighting for Codeblocks

## Installation

```sh
npm install --save-dev vite-plugin-md-to-html
```

## Setup and Usage

```ts
// vite.config.js
import { defineConfig } from 'vite';
import { vitePluginMdToHTML } from 'vite-plugin-md-to-html';

export default defineConfig({
  plugins: [vitePluginMdToHTML()]
})
```

```ts
import testHTML, { attributes } from "./test.md";

document.title = attributes.title;
document.querySelector("#app").innerHTML = testHTML;
```

## Type Declaration

```ts
// global.d.ts
declare module "*.md" {
  export const html: string;
  export const attributes: Record<string, any>;
  export default html;
}
```

## Why New Plugin?

There are other plugins that you can use if you want to convert markdown to framework components.
- [vite-plugin-md](https://www.npmjs.com/package/vite-plugin-md) for markdown to Vue component
- [vite-plugin-svelte-md](https://www.npmjs.com/package/vite-plugin-svelte-md) for markdown to Svelte component
- [vite-plugin-markdown](https://www.npmjs.com/package/vite-plugin-markdown) for markdown to HTML, Vue, React, TOC


[vite-plugin-markdown](https://www.npmjs.com/package/vite-plugin-markdown) in particular also supports turning markdown into HTML. However I was looking for a plugin where I can get markdown-to-html working without specifying any configurations and something that has better API, and comes with default configs.

I built this to make markdown integration easy with [abell](https://github.com/abelljs/abell). however, the plugin itself is generic and not built for abell.