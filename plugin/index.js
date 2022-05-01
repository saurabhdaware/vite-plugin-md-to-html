/**
 *
 * @typedef {import('./index').PluginOptions} PluginOptions
 */

const { markdownToHTML } = require("./markdown-to-html");

const createJSExports = ({ html, attributes }) => {
  const jsSrc = `
export const attributes = ${JSON.stringify(attributes)};
export const html = ${JSON.stringify(html)};
export default html;
`;

  return jsSrc;
};

/**
 *
 * @param {PluginOptions} pluginOptions
 */
const vitePluginMdToHTML = (pluginOptions) => {
  return {
    name: "vite-plugin-md-to-html",
    transform(source, id) {
      if (id.endsWith(".md")) {
        const { html, attributes } = markdownToHTML(source, pluginOptions);
        const jsSrc = createJSExports({ html, attributes });
        return { code: jsSrc };
      }
    },
  };
};

vitePluginMdToHTML.vitePluginMdToHTML = vitePluginMdToHTML;
module.exports = vitePluginMdToHTML;
