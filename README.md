# vite-plugin-md-to-html

Vite plugin to convert markdown to html with front-matter extraction, build-time syntax highlighting, and relative image resolutions.

Try it out on [StackBlitz](https://stackblitz.com/edit/vitejs-vite-urnt3m?file=src%2Fmain.js&terminal=dev)

---
**Table of Content**
- [Installation](#🐥-installation)
- [Setup and Usage](#👷🏻-setup-and-usage)
- [Options](#⚙️-options)
- [Type Declarations](#💙-type-declaration)
- [Features](#✨-features)
  - [Image Path Resolutions](#🏞-image-path-resolutions)
  - [Build-Time Syntax Highlighting](#🖊-build-time-syntax-highlighting)
- [Why New Plugin?](#🤔-why-new-plugin)
---

## 🐥 Installation

```sh
npm install --save-dev vite-plugin-md-to-html

# OR

yarn add vite-plugin-md-to-html -D
```

## 👷🏻 Setup and Usage

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

## ⚙️ Options

Options type
```ts
export type PluginOptions = {
  markdownIt?: any; // markdown-it configurations
  syntaxHighlighting?: boolean; // set true to enable syntax highlighting. default false.
  resolveImageLinks?: boolean; // set true to resolve relative images in markdown. default false.
  highlightJs?: {
    register?: Record<string, any>; // to register new language to syntax highlighting.
  };
};
```


## 💙 Type Declaration

Add this to your `global.d.ts` to remove TS errors in markdown imports.

```ts
// global.d.ts
declare module "*.md" {
  export const html: string;
  export const attributes: Record<string, any>;
  export default html;
}
```

## ✨ Features

### 🏞  Image Path Resolutions

The relative paths in markdown will not work by default.

E.g. the following markdown will not render image because vite won't know about `example.png` file.

```markdown
![Example](./example.png) # Where example.png is in the same directory
```

You can enable this using `resolveImageLinks` option.

```ts
import { defineConfig } from 'vite';
import { vitePluginMdToHTML } from 'vite-plugin-md-to-html';

export default defineConfig({
  plugins: [
    vitePluginMdToHTML({
      resolveImageLinks: true
    })
  ]
})
```

The above code will work as expected after this 🥳

### 🖊 Build-Time Syntax Highlighting!!
```ts
import { defineConfig } from 'vite';
import { vitePluginMdToHTML } from 'vite-plugin-md-to-html';

export default defineConfig({
  plugins: [
    vitePluginMdToHTML({
      syntaxHighlighting: true
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

## 🤔 Why New Plugin?

There are other plugins that you can use if you want to convert markdown to framework components.
- [vite-plugin-md](https://www.npmjs.com/package/vite-plugin-md) for markdown to Vue component
- [vite-plugin-svelte-md](https://www.npmjs.com/package/vite-plugin-svelte-md) for markdown to Svelte component
- [vite-plugin-markdown](https://www.npmjs.com/package/vite-plugin-markdown) for markdown to HTML, Vue, React, TOC\
  This one in particular also supports turning markdown into HTML. However I was looking for a plugin where I can get markdown-to-html working without specifying any configurations and something that comes with default configs and is built for HTML output specifically.

- [vite-plugin-md2html](https://www.npmjs.com/package/vite-plugin-md2html) for markdown to HTML\
  I found about this after building `vite-plugin-md-to-html`. It also supports markdown to HTML. Although, I countinue to maintain `vite-plugin-md-to-html` for features like syntax highlighting based on just boolean, or path resolutions in markdown.


I built this to make markdown integration easy with [abell](https://github.com/abelljs/abell). however, the plugin itself is generic and not built for abell.