/**
 *
 * @typedef {import('./index').PluginOptions} PluginOptions
 */

const { markdownToHTML } = require("./markdown-to-html");

const HTML_SRC_PICK_REGEX = /<img(.*?)src="(.*?)"/g;

/**
 * Resolves the image links in `<img src="" />`
 *
 * - Changes the `<img src="./example.png" />` to `<img src="${variableName}" />`
 * - Returns the import declarations for variableName
 */
const getAssetImports = (html) => {
  let importDeclarations = "";
  let variableNameCount = 0;
  const htmlWithImportLinks = html.replace(HTML_SRC_PICK_REGEX, (...picks) => {
    const variableName = `mdLink${variableNameCount}`;
    importDeclarations += `import ${variableName} from "${picks[2]}?url";\n`;
    return `<img${picks[1]}src="\${${variableName}}"`;
  });

  return { htmlWithImportLinks, importDeclarations };
};

const createJSExports = ({ html, attributes, importDeclarations }) => {
  const htmlExport = importDeclarations
    ? `export const html = \`${html}\`;`
    : `export const html = ${JSON.stringify(html)}`;
  const jsSrc = `${importDeclarations}
export const attributes = ${JSON.stringify(attributes)};
${htmlExport}
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
        let htmlWithImportLinks = html;
        let importDeclarations = "";
        if (pluginOptions.resolveImgImports) {
          ({ htmlWithImportLinks, importDeclarations } = getAssetImports(html));
        }

        const jsSrc = createJSExports({
          html: htmlWithImportLinks,
          attributes,
          importDeclarations,
        });
        return { code: jsSrc };
      }
    },
  };
};

vitePluginMdToHTML.vitePluginMdToHTML = vitePluginMdToHTML;
module.exports = vitePluginMdToHTML;
