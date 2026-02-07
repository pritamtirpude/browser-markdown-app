import { db } from '@/indexeddb/db';
import { useMarkdownStore } from '@/store/markdownStore';
import { renderMarkdown } from '@/util/markdown';
import { useLiveQuery } from 'dexie-react-hooks';
import parse from 'html-react-parser';
import { useEffect, useState } from 'react';

function MarkdownPreview() {
  const { markdownContent } = useMarkdownStore();
  const defaultDocument = useLiveQuery(() => db.table('defaultDocument').toCollection().first());
  const documents = useLiveQuery(() => db.table('documents').toArray());

  const theDocument = documents?.find((doc) => doc.id === defaultDocument?.id);

  const [html, setHtml] = useState('');

  useEffect(() => {
    if (theDocument) {
      renderMarkdown(markdownContent || theDocument.content).then((res) => {
        setHtml(res.markup);
      });
    }
  }, [theDocument, markdownContent]);

  return (
    <div className="min-h-screen flex-1">
      <div className="bg-markdown-neutral-100 px-4 py-3">
        <h3 className="text-markdown-zinc-500 text-roboto-regularhs uppercase">Preview</h3>
      </div>

      <div className="markdown-preview min-h-screen p-6">{parse(html)}</div>
    </div>
  );
}

export default MarkdownPreview;
