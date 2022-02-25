import markdownIt from "markdown-it";
import fm from "front-matter";

/**
 *
 * @typedef {import('./index').PluginOptions} PluginOptions
 */

let md;

/**
 *
 * @param {string} mdSource
 * @param {PluginOptions} pluginOptions
 * @returns {{html: string, attributes: any}}
 */
export const markdownToHTML = (mdSource, pluginOptions = {}) => {
  // In test environment, we're changing configs on every call
  if (!md || process.env.NODE_ENV === "test") {
    md = markdownIt({
      html: true,
      ...pluginOptions.markdownIt,
    });
  }

  const fmObject = fm(mdSource);

  return {
    html: md.render(fmObject.body),
    attributes: fmObject.attributes,
  };
};
