import Dexie, { type EntityTable } from 'dexie';
import { v4 as uuid } from 'uuid';

export type MarkdownDocument = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

export type DefaultMarkdownDocument = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

export const db = new Dexie('MarkdownEditorDB') as Dexie & {
  documents: EntityTable<MarkdownDocument, 'id'>;
  defaultDocument: EntityTable<DefaultMarkdownDocument, 'id'>;
};

db.version(1).stores({
  documents: '++id, title, content, createdAt',
  defaultDocument: 'id, title, content, createdAt',
});

const defaultContent = `# Welcome to Markdown

Markdown is a lightweight markup language that you can use to add formatting elements to plaintext text documents an the Pritam Tirpude is awesome man.

## How to use this?

1. Write markdown in the markdown editor window
2. See the rendered markdown in the preview window

### Features

- Create headings, paragraphs, links, blockquotes, inline-code, code blocks, and lists
- Name and save the document to access again later
- Choose between Light or Dark mode depending on your preference

> This is an example of a blockquote. If you would like to learn more about markdown syntax, you can visit this [markdown cheatsheet](https://www.markdownguide.org/cheat-sheet/).

[Kuiper belt](https://en.wikipedia.org/wiki/Kuiper_belt).

#### Headings

To create a heading, add the hash sign (#) before the heading. The number of number signs you use should correspond to the heading level. You'll see in this guide that we've used all six heading levels (not necessarily in the correct way you should use headings!) to illustrate how they should look.

##### Lists

You can see examples of ordered and unordered lists above.

###### Code Blocks

This markdown editor allows for inline-code snippets, like this:

\`\`\`
<main>
  <h1>This is a larger code block</h1>
</main>
\`\`\`
`;

db.on('populate', (tx) => {
  const defaultId = uuid();
  tx.table('defaultDocument').put({
    id: defaultId,
    title: 'untitled.md',
    content: defaultContent,
    createdAt: new Date().toISOString(),
  });
  tx.table('documents').put({
    id: defaultId,
    title: 'untitled.md',
    content: defaultContent,
    createdAt: new Date().toISOString(),
  });
});
