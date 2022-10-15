/**
 *
 * @typedef {import('./index').PluginOptions} PluginOptions
 */

import { resolve, dirname } from "path";
import { mdToHTML } from "./md-to-html.js";

const HTML_SRC_PICK_REGEX = /<img(.*?)src="(.*?)"/g;

/**
 * Resolves the image links in `<img src="" />`
 *
 * - Changes the `<img src="./example.png" />` to `<img src="${variableName}" />`
 * - Returns the import declarations for variableName
 */
const getAssetImports = (html, markdownFilePath) => {
  let importDeclarations = "";
  let variableNameCount = 0;
  const htmlWithImportLinks = html.replace(HTML_SRC_PICK_REGEX, (...picks) => {
    const restAttributes = picks[1];
    const imgUrl = picks[2];

    // If absolute web URL, return the same matched content
    if (imgUrl.startsWith("http")) {
      return picks[0];
    }

    const fullImgURL = resolve(dirname(markdownFilePath), imgUrl);
    const variableName = `mdLink${variableNameCount}`;
    variableNameCount++;
    importDeclarations += `import ${variableName} from "${fullImgURL}?url";\n`;
    return `<img${restAttributes}src="\${${variableName}}"`;
  });

  return { htmlWithImportLinks, importDeclarations };
};

const createJSExports = ({
  html,
  attributes,
  importDeclarations,
  clientSideImageImportScript,
}) => {
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

let pluginOptionsGlobal = undefined;

/**
 *
 * @param {PluginOptions} pluginOptions
 */
export const vitePluginMdToHTML = (pluginOptions) => {
  /** @type {boolean} */
  let isSSRBuild = false;
  pluginOptionsGlobal = pluginOptions;
  return {
    name: "vite-plugin-md-to-html",
    configResolved(resolvedConfig) {
      isSSRBuild = !!resolvedConfig.build.ssr;
    },
    transform(source, id) {
      if (id.endsWith(".md")) {
        const { html, attributes } = mdToHTML(source, pluginOptions);
        let htmlWithImportLinks = html;
        let importDeclarations = "";
        let clientSideImageImportScript = "";
        if (pluginOptions?.resolveImageLinks) {
          ({ htmlWithImportLinks, importDeclarations } = getAssetImports(
            html,
            id
          ));

          if (isSSRBuild) {
            clientSideImageImportScript = `<script type="module">${importDeclarations.replace(
              /import.*?from/g,
              "import" // Turning `import xyz from './file.svg';` statements to `import './file.svg'` statements
            )}</script>`;
          }
        }

        const jsSrc = createJSExports({
          html: htmlWithImportLinks,
          attributes,
          importDeclarations,
          clientSideImageImportScript,
        });
        return { code: jsSrc };
      }
    },
  };
};

export const getPluginOptionsGlobal = () => pluginOptionsGlobal;
export const clearMemo = () => {
  pluginOptionsGlobal = undefined;
};
