# vite-plugin-md-to-html

Vite plugin to convert markdown to html with front-matter extraction and build-time syntax highlighting.


**Features**
- [x] Markdown to HTML
- [x] Front Matter Extraction
- [x] Build-Time Syntax Highlighting for Codeblocks

## Installation

```sh
npm install --save-dev vite-plugin-md-to-html
```

## Setup and Usage

_`vite.config.js`_
```ts
// vite.config.js
import { defineConfig } from 'vite';
import { vitePluginMdToHTML } from 'vite-plugin-md-to-html';

export default defineConfig({
  plugins: [vitePluginMdToHTML()]
})
```

_`test.md`_
```md
---
title: Hello from front-matter
---

# Markdown File
```

_`main.js`_
```ts
// main.js
import testHTML, { attributes } from "./test.md";

document.title = attributes.title; // Hello from front-matter
document.querySelector("#app").innerHTML = testHTML; // <h1>Markdown File</h1>
```

## Options

Options type
```ts
export type PluginOptions = {
  markdownIt?: any; // markdown-it configurations
  syntaxHighlight?: boolean; // true to enable syntax highlighting. default false.
  highlightJs?: {
    register?: Record<string, any>; // to register new language to syntax highlighting.
  };
};
```

### Build-Time Syntax Highlighting!!
```ts
import { defineConfig } from 'vite';
import { vitePluginMdToHTML } from 'vite-plugin-md-to-html';

export default defineConfig({
  plugins: [
    vitePluginMdToHTML({
      syntaxHighlight: true
    })
  ]
})
```

This will not include the CSS of syntax highlighting. You can-

Either import css from `highlight.js` npm package
```sh
import 'highlight.js/styles/github.css';
```

Or use it from CDN
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/styles/default.min.css">
```

Check out https://highlightjs.org/usage/ for more details.

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