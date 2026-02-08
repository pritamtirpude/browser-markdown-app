import { db } from '@/indexeddb/db';
import { useMarkdownStore } from '@/store/markdownStore';
import { renderMarkdown } from '@/util/markdown';
import { useLiveQuery } from 'dexie-react-hooks';
import parse from 'html-react-parser';
import { useCallback, useEffect, useState } from 'react';

function MarkdownPreview() {
  const { markdownContent, documentId, setFilename, setMarkdownContent, setDocumentId } =
    useMarkdownStore();
  const defaultDocument = useLiveQuery(() => db.table('defaultDocument').toCollection().first());
  const documents = useLiveQuery(() =>
    db.table('documents').orderBy('createdAt').reverse().toArray(),
  );

  const [html, setHtml] = useState('');

  // Memoized render function - returns the rendered result without setting state
  const parseMarkdown = useCallback(async (content: string) => {
    if (!content) return '';
    const res = await renderMarkdown(content);
    return res.markup;
  }, []);

  // Initialize with default document on page load
  useEffect(() => {
    if (!documentId && documents && documents.length > 0) {
      if (documents.length === 1) {
        // Only one document - use default document
        setDocumentId(defaultDocument?.id || '');
        setFilename(defaultDocument?.title);
        setMarkdownContent(defaultDocument?.content);
        parseMarkdown(defaultDocument?.content || '').then(setHtml);
      } else {
        // Multiple documents - load the first one (newest)
        const firstDocument = documents[0];
        setDocumentId(firstDocument.id);
        setFilename(firstDocument.title);
        setMarkdownContent(firstDocument.content);
        parseMarkdown(firstDocument.content || '').then(setHtml);
      }
    }
  }, [
    defaultDocument,
    documents,
    setFilename,
    setMarkdownContent,
    setDocumentId,
    documentId,
    parseMarkdown,
  ]);

  // Render markdown when content changes
  useEffect(() => {
    if (markdownContent) {
      parseMarkdown(markdownContent).then(setHtml);
    }
  }, [markdownContent, parseMarkdown]);

  useEffect(() => {
    const document = documents?.find((doc) => doc.id === documentId);

    if (document) {
      setFilename(document.title);
      setMarkdownContent(document.content);
      parseMarkdown(document.content).then(setHtml);
    }
  }, [documents, documentId, setFilename, setMarkdownContent, parseMarkdown]);

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
