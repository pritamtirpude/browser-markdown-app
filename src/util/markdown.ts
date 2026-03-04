// utils/markdown.ts
import type { Schema } from 'hast-util-sanitize';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import rehypeStarryNight from 'rehype-starry-night';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import rehypeMermaid from './rehype-mermaid';

// Extend the default sanitize schema to allow mermaid pre elements through
const sanitizeSchema: Schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    pre: [
      ...(defaultSchema.attributes?.pre || []),
      ['className', 'mermaid'],
      'dataMermaidSource',
    ],
  },
};

export type MarkdownResult = {
  markup: string;
};

export async function renderMarkdown(markdown: string): Promise<MarkdownResult> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStarryNight)
    .use(rehypeMermaid)
    .use(rehypeSlug)
    .use(rehypeSanitize, sanitizeSchema)
    .use(rehypeStringify)
    .process(markdown);

  return {
    markup: String(result),
  };
}
