export type PluginOptions = {
  markdownIt?: any;
  syntaxHighlighting?: boolean;
  /** If you have local reference to <img src="./someimage.png" />, this option will add import for the image on top and add dynamic url */
  resolveImgImports?: boolean;
  highlightJs?: {
    register?: Record<string, any>;
  };
};

export declare function vitePluginMdToHTML(pluginOptions?: PluginOptions): any;
export default function vitePluginMdToHTML(pluginOptions?: PluginOptions): any;
