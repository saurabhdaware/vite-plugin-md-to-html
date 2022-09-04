import { defineConfig } from "vite";
import vitePluginMdToHTML from "./plugin";

export default defineConfig({
  plugins: [
    vitePluginMdToHTML({
      syntaxHighlighting: true,
      resolveImageLinks: true,
    }),
  ],
});
