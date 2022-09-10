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
    const restAttributes = picks[1];
    const imgUrl = picks[2];
    if (imgUrl.startsWith("http")) {
      return picks[0];
    }

    const variableName = `mdLink${variableNameCount}`;
    variableNameCount++;
    importDeclarations += `import ${variableName} from "${imgUrl}?url";\n`;
    return `<img${restAttributes}src="\${${variableName}}"`;
  });

  return { htmlWithImportLinks, importDeclarations };
};

const createJSExports = ({ html, attributes, importDeclarations }) => {
  const clientSideImageImportScript = `<script type="module">${importDeclarations.replace(
    /import.*?from/g,
    "import" // Turning `import xyz from './file.svg';` statements to `import './file.svg'` statements
  )}</script>`;
  const htmlExport = importDeclarations
    ? `export const html = \`${clientSideImageImportScript}${html}\`;`
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
        if (pluginOptions?.resolveImageLinks) {
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
