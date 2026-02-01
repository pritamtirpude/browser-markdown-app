import { useState } from 'react';

const initialMarkdown = `# Welcome to Markdown

Markdown is a lightweight markup language that you can use to add formatting elements to plaintext text documents.

## How to use this?

1. Write markdown in the markdown editor window
2. See the rendered markdown in the preview window
`;

function MarkdownEditor() {
  const [content, setContent] = useState(initialMarkdown);

  return (
    <div className="min-h-screen flex-1">
      <div className="bg-markdown-neutral-100 px-4 py-3">
        <h3 className="text-markdown-zinc-500 text-roboto-regularhs uppercase">Markdown</h3>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="text-robotomono-regular font-robotomono text-markdown-neutral-700 min-h-screen w-full resize-none p-4 focus:outline-none"
      />
    </div>
  );
}

export default MarkdownEditor;
