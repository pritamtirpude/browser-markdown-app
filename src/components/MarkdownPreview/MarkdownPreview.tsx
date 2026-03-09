import { db } from '@/indexeddb/db';
import { useMarkdownStore } from '@/store/markdownStore';
import { cn } from '@/util';
import { renderMarkdown } from '@/util/markdown';
import { markdownParserOptions } from '@/util/markdownStyles';
import { useLiveQuery } from 'dexie-react-hooks';
import parse from 'html-react-parser';
import { Eye, EyeOff } from 'lucide-react';
import mermaid from 'mermaid';
import { useCallback, useEffect, useRef, useState } from 'react';

function MarkdownPreview() {
  const {
    markdownContent,
    documentId,
    setFilename,
    setMarkdownContent,
    setDocumentId,
    setIsPreviewOpen,
    isPreviewOpen,
  } = useMarkdownStore();
  const defaultDocument = useLiveQuery(() => db.table('defaultDocument').toCollection().first());
  const documents = useLiveQuery(() =>
    db.table('documents').orderBy('createdAt').reverse().toArray(),
  );

  const [html, setHtml] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);

  // Helper: re-initialize mermaid with the correct theme, then run
  const runMermaid = useCallback(() => {
    if (!previewRef.current) return;
    const mermaidElements = previewRef.current.querySelectorAll<HTMLElement>('pre.mermaid');
    if (mermaidElements.length === 0) return;

    const isDark = document.documentElement.classList.contains('dark');
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'base',
    });

    mermaidElements.forEach((el) => {
      const source = el.getAttribute('data-mermaid-source');
      if (source) el.textContent = source;
      el.removeAttribute('data-processed');
    });
    mermaid.run({ nodes: mermaidElements });
  }, []);

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

  // Run mermaid rendering after HTML is updated in the DOM
  useEffect(() => {
    if (html) runMermaid();
  }, [html, runMermaid]);

  // Re-render mermaid diagrams when the dark/light theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => runMermaid());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, [runMermaid]);

  useEffect(() => {
    const document = documents?.find((doc) => doc.id === documentId);

    if (document) {
      setFilename(document.title);
      setMarkdownContent(document.content);
      parseMarkdown(document.content).then(setHtml);
    }
  }, [documents, documentId, setFilename, setMarkdownContent, parseMarkdown]);

  return (
    <div className={cn('hidden flex-1 flex-col md:flex', isPreviewOpen ? 'flex' : 'hidden')}>
      <div className="bg-markdown-neutral-100 dark:bg-markdown-zinc-900 flex items-center justify-between px-4 py-3">
        <h3 className="text-markdown-zinc-500 dark:text-markdown-neutral-300 text-roboto-regularhs uppercase">
          Preview
        </h3>
        <div title="Preview Markdown">
          {isPreviewOpen ? (
            <EyeOff
              className="text-markdown-zinc-500 hover:text-markdown-orange-500 cursor-pointer transition-all duration-200"
              onClick={() => setIsPreviewOpen(false)}
            />
          ) : (
            <Eye
              className="text-markdown-zinc-500 hover:text-markdown-orange-500 cursor-pointer transition-all duration-200"
              onClick={() => setIsPreviewOpen(true)}
            />
          )}
        </div>
      </div>

      <div
        ref={previewRef}
        data-print-preview
        className={cn(
          'dark:bg-markdown-neutral-900 flex-1 overflow-auto px-4 py-3 md:p-6',
          isPreviewOpen ? 'lg:mx-auto lg:max-w-3xl' : 'block',
        )}
      >
        {parse(html, markdownParserOptions)}
      </div>
    </div>
  );
}

export default MarkdownPreview;
