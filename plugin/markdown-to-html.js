import markdownIt from "markdown-it";
import fm from "front-matter";
import markdownItHljs from "markdown-it-highlightjs";

/**
 *
 * @typedef {import('./index').PluginOptions} PluginOptions
 */

let md;

/** @type {PluginOptions} */
const defaultPluginOptions = {
  syntaxHighlighting: false,
  markdownIt: {
    html: true,
    linkify: true,
  },
  highlightJs: {},
};

/**
 *
 * @param {string} mdSource
 * @param {PluginOptions} userPluginOptions
 * @returns {{html: string, attributes: any}}
 */
export const markdownToHTML = (mdSource, userPluginOptions = {}) => {
  // In test environment, we're changing configs on every call
  /** @type {PluginOptions} */
  const pluginOptions = {
    ...defaultPluginOptions,
    ...userPluginOptions,
    markdownIt: {
      ...defaultPluginOptions.markdownIt,
      ...userPluginOptions.markdownIt,
    },
    highlightJs: {
      ...defaultPluginOptions.highlightJs,
      ...userPluginOptions.highlightJs,
    },
  };
  if (!md || process.env.NODE_ENV === "test") {
    md = markdownIt(pluginOptions.markdownIt);

    if (pluginOptions.syntaxHighlighting) {
      md.use(markdownItHljs, {
        register: pluginOptions.highlightJs.register || {},
      });
    }
  }

  const fmObject = fm(mdSource);

  return {
    html: md.render(fmObject.body),
    attributes: fmObject.attributes,
  };
};
