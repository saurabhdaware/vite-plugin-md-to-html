/**
 *
 * @typedef {import('./index').PluginOptions} PluginOptions
 */

import { markdownToHTML } from "./markdown-to-html";

const createJSExports = ({ html, attributes }) => {
  const jsSrc = `
export const attributes = ${JSON.stringify(attributes)};
export const html = \`${html}\`;
export default html;
`;

  return jsSrc;
};

/**
 *
 * @param {PluginOptions} pluginOptions
 */
export function vitePluginMdToHTML(pluginOptions) {
  return {
    name: "vite-plugin-md-to-html",
    transform(mdSrc, id) {
      // This is hack for dynamic global imports. We can't do dynamic global imports in current codebase
      // resolve pages directory in default entry build
      if (id.endsWith(".md")) {
        const { html, attributes } = markdownToHTML(mdSrc, pluginOptions);
        const jsSrc = createJSExports({ html, attributes });
        return { code: jsSrc };
      }
    },
  };
}
