import { mdToHTML } from ".";
import { describe, expect, test } from "vitest";
import { default as d } from "dedent";

describe("markdownToHTML()", () => {
  test("should return html", () => {
    expect(mdToHTML(`# Hello\n\ntest **hello**`).html).toMatchInlineSnapshot(`
      "<h1>Hello</h1>
      <p>test <strong>hello</strong></p>
      "
    `);
  });

  test("should return front-matter", () => {
    const testMd = d`
    ---
    title: hello
    ---

    hello _there_!
    `;

    const { attributes, html } = mdToHTML(testMd);

    expect(attributes).toEqual({
      title: "hello",
    });

    expect(html).toMatchInlineSnapshot(`
      "<p>hello <em>there</em>!</p>
      "
    `);
  });

  test("should keep html in markdown", () => {
    const testMd = d`
    # Hello

    <div>hi</div>
    `;

    expect(mdToHTML(testMd).html).toMatchInlineSnapshot(`
      "<h1>Hello</h1>
      <div>hi</div>"
    `);
  });

  test("should support syntax highlighters", () => {
    const testMd = d`
    # Hello

    \`\`\`js
    const a = 3;
    \`\`\`
    `;

    expect(mdToHTML(testMd).html).toMatchInlineSnapshot(`
      "<h1>Hello</h1>
      <pre><code class=\\"language-js\\">const a = 3;
      </code></pre>
      "
    `);
  });

  test("should work with custom options", () => {
    const testMd = d`
    # Hello

    https://abelljs.org/

    `;

    expect(mdToHTML(testMd).html).toMatchInlineSnapshot(`
      "<h1>Hello</h1>
      <p><a href=\\"https://abelljs.org/\\">https://abelljs.org/</a></p>
      "
    `);

    expect(
      mdToHTML(testMd, {
        markdownIt: {
          linkify: false,
        },
      }).html
    ).toMatchInlineSnapshot(`
      "<h1>Hello</h1>
      <p>https://abelljs.org/</p>
      "
    `);
  });

  test("should syntax highlight the codeblock", () => {
    const testMd = d`
    # Hello

    \`\`\`js
    const a = 3;
    \`\`\`

    `;

    expect(
      mdToHTML(testMd, {
        syntaxHighlighting: true,
      }).html
    ).toMatchInlineSnapshot(`
      "<h1>Hello</h1>
      <pre><code class=\\"hljs language-js\\"><span class=\\"hljs-keyword\\">const</span> a = <span class=\\"hljs-number\\">3</span>;
      </code></pre>
      "
    `);
  });
});
