export type PluginOptions =
  | {
      markdownIt?: any;
      syntaxHighlighting?: boolean;
      /** If you have local reference to <img src="./someimage.png" />, this option will add import for the image on top and add dynamic url */
      resolveImageLinks?: boolean;
      highlightJs?: {
        register?: Record<string, any>;
      };
    }
  | undefined;

export declare function vitePluginMdToHTML(pluginOptions?: PluginOptions): any;
export default function vitePluginMdToHTML(pluginOptions?: PluginOptions): any;
export declare function mdToHTML(
  mdSource: string,
  pluginOptions?: PluginOptions
): { html: string; attributes: any };
export declare function EXPERIMENTAL_md(mdSource: TemplateStringsArray): string;
