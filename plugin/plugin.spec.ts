import path from "path";
import { vitePluginMdToHTML } from "./index";
import { describe, expect, test } from "vitest";
import { default as d } from "dedent";

/**
 * Removes the absolute links from snapshot.
 *
 * We don't want to add `/Users/saurabh.daware/` kind of URL in snapshot since it might be different in everyone's machine
 */
const removeAbsLinks = (codeString: string): string => {
  const absolutePathRegExp = new RegExp(
    path.resolve(".").replace(/\\/g, "\\\\"),
    "g"
  );
  return codeString
    .replace(absolutePathRegExp, ".")
    .replace(new RegExp("\\\\", "g"), "/");
};

describe("plugin.transform()", () => {
  test("should add expected exports", () => {
    const plugin = vitePluginMdToHTML();

    const mdSource = d`
    ---
    hi: hello
    ---

    ## Hello

    Hello **Vitest**
    `;

    const mdPath = "./hello.md";
    expect(plugin.transform(mdSource, mdPath).code).toMatchInlineSnapshot(`
      "
      export const attributes = {\\"hi\\":\\"hello\\"};
      export const html = \\"<h2>Hello</h2>\\\\n<p>Hello <strong>Vitest</strong></p>\\\\n\\"
      export default html;
      "
    `);
  });

  test("should support syntax highlighting", () => {
    const mdSource = d`
    # Hello
  
    \`\`\`js
    const a = 3;
    \`\`\`
    `;

    const pluginWithSyntaxHighlighting = vitePluginMdToHTML({
      syntaxHighlighting: true,
    });

    expect(pluginWithSyntaxHighlighting.transform(mdSource, "./hello.md").code)
      .toMatchInlineSnapshot(`
        "
        export const attributes = {};
        export const html = \\"<h1>Hello</h1>\\\\n<pre><code class=\\\\\\"hljs language-js\\\\\\"><span class=\\\\\\"hljs-keyword\\\\\\">const</span> a = <span class=\\\\\\"hljs-number\\\\\\">3</span>;\\\\n</code></pre>\\\\n\\"
        export default html;
        "
      `);

    const pluginWithoutSyntaxHighlighting = vitePluginMdToHTML({
      syntaxHighlighting: false,
    });

    expect(
      pluginWithoutSyntaxHighlighting.transform(mdSource, "./hello.md").code
    ).toMatchInlineSnapshot(`
      "
      export const attributes = {};
      export const html = \\"<h1>Hello</h1>\\\\n<pre><code class=\\\\\\"language-js\\\\\\">const a = 3;\\\\n</code></pre>\\\\n\\"
      export default html;
      "
    `);
  });

  test.only("should add imports based on resolveImageLinks option", () => {
    const mdSource = d`
    ## Hello

    ![example](./example.png)

    <img alt="hello" src="./hello.jpeg" />
    `;

    const mdPath = "./hello.md";

    const pluginWithResolves = vitePluginMdToHTML({
      resolveImageLinks: true,
    });

    console.log("DEBUG LOGS============");
    console.log(path.resolve("."));
    console.log("DEBUG LOGS END============");
    pluginWithResolves.configResolved({ build: { ssr: true } });
    expect(removeAbsLinks(pluginWithResolves.transform(mdSource, mdPath).code))
      .toMatchInlineSnapshot(`
        "import mdLink0 from \\"./example.png?url\\";
        import mdLink1 from \\"./hello.jpeg?url\\";
        
        export const attributes = {};
        export const html = \`<script type=\\"module\\">import \\"./example.png?url\\";
        import \\"./hello.jpeg?url\\";
        </script><h2>Hello</h2>
        <p><img src=\\"\${mdLink0}\\" alt=\\"example\\"></p>
        <img alt=\\"hello\\" src=\\"\${mdLink1}\\" />\`;
        export default html;
        "
      `);

    const pluginWithoutResolves = vitePluginMdToHTML({
      resolveImageLinks: false,
    });

    expect(pluginWithoutResolves.transform(mdSource, mdPath).code)
      .toMatchInlineSnapshot(`
        "
        export const attributes = {};
        export const html = \\"<h2>Hello</h2>\\\\n<p><img src=\\\\\\"./example.png\\\\\\" alt=\\\\\\"example\\\\\\"></p>\\\\n<img alt=\\\\\\"hello\\\\\\" src=\\\\\\"./hello.jpeg\\\\\\" />\\"
        export default html;
        "
      `);
  });

  test("should not add imports when image has absolute url", () => {
    const mdSource = d`
    ## Hello

    ![example](https://hello.com/example.png)
    ![example](./example.png)

    <img alt="hello" src="https://example.com/hello.jpeg" />
    `;

    const mdPath = "./hello.md";

    const pluginWithResolves = vitePluginMdToHTML({
      resolveImageLinks: true,
    });

    pluginWithResolves.configResolved({ build: { ssr: true } });
    expect(removeAbsLinks(pluginWithResolves.transform(mdSource, mdPath).code))
      .toMatchInlineSnapshot(`
        "import mdLink0 from \\"./example.png?url\\";
        
        export const attributes = {};
        export const html = \`<script type=\\"module\\">import \\"./example.png?url\\";
        </script><h2>Hello</h2>
        <p><img src=\\"https://hello.com/example.png\\" alt=\\"example\\">
        <img src=\\"\${mdLink0}\\" alt=\\"example\\"></p>
        <img alt=\\"hello\\" src=\\"https://example.com/hello.jpeg\\" />\`;
        export default html;
        "
      `);
  });

  test("should not add script import on client-side", () => {
    const mdSource = d`
    ## Hello
    ![example](./example.png)
    `;

    const mdPath = "./hello.md";

    const pluginWithResolves = vitePluginMdToHTML({
      resolveImageLinks: true,
    });

    pluginWithResolves.configResolved({ build: { ssr: false } });
    expect(removeAbsLinks(pluginWithResolves.transform(mdSource, mdPath).code))
      .toMatchInlineSnapshot(`
        "import mdLink0 from \\"./example.png?url\\";
        
        export const attributes = {};
        export const html = \`<h2>Hello</h2>
        <p><img src=\\"\${mdLink0}\\" alt=\\"example\\"></p>
        \`;
        export default html;
        "
      `);
  });
});
