import type { DOMNode, HTMLReactParserOptions } from 'html-react-parser';
import { domToReact, Element } from 'html-react-parser';
import { cn } from './index';

// Tailwind class mappings for markdown elements (light and dark mode)
const markdownClasses = {
  h1: 'text-[2rem] font-robotoslab font-bold text-markdown-neutral-700 dark:text-white mb-5',
  h2: 'text-[1.75rem] font-robotoslab font-light text-markdown-neutral-900 dark:text-white mb-4',
  h3: 'text-[1.5rem] font-robotoslab font-bold text-markdown-neutral-900 dark:text-white mb-4',
  h4: 'text-[1.25rem] font-robotoslab font-bold text-markdown-neutral-900 dark:text-white mb-3',
  h5: 'text-[1rem] font-robotoslab font-bold text-markdown-neutral-900 dark:text-white mb-3',
  h6: 'text-[0.875rem] font-robotoslab font-bold text-markdown-neutral-900 dark:text-white mb-2',
  p: 'text-[0.875rem] leading-[1.5rem] text-markdown-zinc-500 dark:text-markdown-neutral-300 mb-4',
  ul: 'list-disc list-inside mb-4 text-markdown-zinc-500 dark:text-markdown-neutral-300 space-y-2',
  ol: 'list-decimal list-inside mb-4 text-markdown-zinc-500 dark:text-markdown-neutral-300 space-y-2',
  li: 'text-[0.875rem] leading-[1.5rem]',
  blockquote:
    'border-l-4 bg-markdown-neutral-100 flex dark:bg-markdown-zinc-800 font-robotoslab font-bold border-markdown-orange-500 dark:border-markdown-orange-300 pl-4 py-2 mb-4 text-markdown-zinc-500 dark:text-markdown-neutral-300',
  code: 'bg-markdown-neutral-200 dark:bg-markdown-zinc-800 text-markdown-orange-500 dark:text-markdown-orange-300 px-1.5 py-0.5 rounded font-robotomono text-[0.875rem]',
  pre: 'bg-markdown-neutral-100 dark:bg-markdown-zinc-800 text-markdown-neutral-900 dark:text-markdown-neutral-100 p-4 rounded-lg mb-4 overflow-x-auto',
  a: 'text-markdown-orange-500 cursor-pointer dark:text-markdown-orange-300 hover:underline',
  strong: 'font-bold text-markdown-neutral-900 dark:text-white',
  em: 'italic',
  hr: 'border-t border-markdown-neutral-300 dark:border-markdown-gray-600 my-6',
  table: 'w-full border-collapse mb-4 text-markdown-zinc-500 dark:text-markdown-neutral-300',
  thead: 'bg-markdown-neutral-200 dark:bg-markdown-zinc-800',
  th: 'border border-markdown-neutral-300 dark:border-markdown-gray-600 px-4 py-2 text-left font-bold text-markdown-neutral-900 dark:text-white',
  td: 'border border-markdown-neutral-300 dark:border-markdown-gray-600 px-4 py-2',
  tr: 'border-b border-markdown-neutral-300 dark:border-markdown-gray-600',
  img: 'max-w-full h-auto rounded-lg my-4',
};

// Parser options to add Tailwind classes to markdown elements
export const markdownParserOptions: HTMLReactParserOptions = {
  replace: (node: DOMNode) => {
    if (node instanceof Element && node.name in markdownClasses) {
      const elementName = node.name as keyof typeof markdownClasses;
      const className = markdownClasses[elementName];

      // Special handling for pre > code blocks
      if (elementName === 'pre') {
        // Mermaid blocks: preserve as-is so the mermaid library can render them
        if (node.attribs?.class?.includes('mermaid')) {
          // Pass data-mermaid-source through so MarkdownPreview can restore
          // the original source before each mermaid.run() call.
          return (
            <pre className="mermaid" data-mermaid-source={node.attribs['data-mermaid-source']}>
              {domToReact(node.children as DOMNode[], markdownParserOptions)}
            </pre>
          );
        }

        const codeChild = node.children.find(
          (child) => child instanceof Element && child.name === 'code',
        );

        if (codeChild) {
          return (
            <pre className={className}>
              {domToReact(node.children as DOMNode[], markdownParserOptions)}
            </pre>
          );
        }
      }

      // For code elements inside pre, don't apply the inline code styling
      if (
        elementName === 'code' &&
        node.parent &&
        node.parent instanceof Element &&
        node.parent.name === 'pre'
      ) {
        return (
          <code className="font-robotomono block text-sm">
            {domToReact(node.children as DOMNode[], markdownParserOptions)}
          </code>
        );
      }

      // Special handling for anchor tags to open in new tab
      if (elementName === 'a') {
        return (
          <a
            className={cn(className, node.attribs?.class)}
            href={node.attribs?.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {domToReact(node.children as DOMNode[], markdownParserOptions)}
          </a>
        );
      }

      // Apply class to the element and recursively process children
      const Tag = elementName;
      return (
        <Tag className={cn(className, node.attribs?.class)}>
          {domToReact(node.children as DOMNode[], markdownParserOptions)}
        </Tag>
      );
    }
  },
};
