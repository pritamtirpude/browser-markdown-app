import type { Element, Root, Text } from 'hast';
import { visit } from 'unist-util-visit';

/**
 * A rehype plugin that converts fenced code blocks with language "mermaid"
 * into `<pre class="mermaid">` elements so the Mermaid library can
 * render them client-side.
 *
 * Transforms: <pre><code class="language-mermaid">graph TD; A-->B;</code></pre>
 * Into:       <pre class="mermaid">graph TD; A-->B;</pre>
 */
export default function rehypeMermaid() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (
        node.tagName !== 'pre' ||
        !parent ||
        index === undefined
      ) {
        return;
      }

      const codeEl = node.children.find(
        (child): child is Element =>
          child.type === 'element' && child.tagName === 'code',
      );

      if (!codeEl) return;

      const classNames = codeEl.properties?.className;
      const isMermaid =
        Array.isArray(classNames) &&
        classNames.some((c) => String(c) === 'language-mermaid');

      if (!isMermaid) return;

      // Extract the raw text content from the code element
      const text = codeEl.children
        .filter((c): c is Text => c.type === 'text')
        .map((c) => c.value)
        .join('');

      // Replace the <pre> node's children, add the mermaid class, and store
      // the raw source in a data attribute so the client can always restore it
      // before calling mermaid.run() (React may not update the DOM node if it
      // considers the virtual DOM unchanged, but mermaid has already mutated it).
      node.properties = { className: ['mermaid'], dataMermaidSource: text };
      node.children = [{ type: 'text', value: text }];
    });
  };
}
