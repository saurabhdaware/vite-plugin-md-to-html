export type PluginOptions = {
  markdownIt?: any;
  syntaxHighlight?: boolean;
  highlightJs?: {
    register?: Record<string, any>;
  };
};

export declare function vitePluginMdToHTML(pluginOptions?: PluginOptions): any;
