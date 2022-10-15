import markdownIt from "markdown-it";
import fm from "front-matter";
import markdownItHljs from "markdown-it-highlightjs";
import dedent from "dedent";
import { getPluginOptionsGlobal } from "./vite-plugin.js";

/**
 *
 * @typedef {import('./index').PluginOptions} PluginOptions
 */

let markdown;
/** @type {PluginOptions} */
let pluginOptions;

/** @type {PluginOptions} */
const defaultPluginOptions = {
  syntaxHighlighting: false,
  resolveImageLinks: false,
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
export const mdToHTML = (mdSource, userPluginOptions = {}) => {
  // In test environment, we're changing configs on every call
  pluginOptions = {
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
  if (!markdown || process.env.NODE_ENV === "test") {
    markdown = markdownIt(pluginOptions.markdownIt);

    if (pluginOptions.syntaxHighlighting) {
      markdown.use(markdownItHljs, {
        register: pluginOptions.highlightJs.register || {},
      });
    }
  }

  const fmObject = fm(mdSource);

  return {
    html: markdown.render(fmObject.body),
    attributes: fmObject.attributes,
  };
};

/**
 * Currently meant to be used in static-site-generators only
 *
 * @param {TemplateStringsArray} mdSource
 * @returns {string}
 */
export const EXPERIMENTAL_md = (mdSource) => {
  return mdToHTML(dedent(mdSource[0]), getPluginOptionsGlobal()).html;
};
