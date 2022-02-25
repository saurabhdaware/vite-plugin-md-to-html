export type PluginOptions = {
  markdownIt?: any;
  syntaxHighlighting?: boolean;
  highlightJs?: {
    register?: Record<string, any>;
  };
};

export declare function vitePluginMdToHTML(pluginOptions?: PluginOptions): any;
