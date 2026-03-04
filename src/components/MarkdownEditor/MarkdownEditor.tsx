import { db } from '@/indexeddb/db';
import { useMarkdownStore } from '@/store/markdownStore';
import { cn } from '@/util';
import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';

function MarkdownEditor() {
  const {
    setMarkdownContent,
    markdownContent,
    isPreviewOpen,
    documentId,
    setIsPreviewOpen,
    setDocumentId,
    setFilename,
  } = useMarkdownStore();
  const defaultDocument = useLiveQuery(() => db.table('defaultDocument').toCollection().first());

  // Initialize store with default document on first load
  useEffect(() => {
    if (!documentId && defaultDocument) {
      setDocumentId(defaultDocument.id);
      setMarkdownContent(defaultDocument.content);
      setFilename(defaultDocument.title);
    }
  }, [defaultDocument, documentId, setDocumentId, setMarkdownContent, setFilename]);

  return (
    <div className={cn('flex flex-1 flex-col', isPreviewOpen ? 'hidden' : 'flex')}>
      <div className="bg-markdown-neutral-100 dark:bg-markdown-zinc-900 flex items-center justify-between px-4 py-3">
        <h3 className="text-markdown-zinc-500 dark:text-markdown-neutral-300 text-roboto-regularhs uppercase">
          Markdown
        </h3>

        <div className="block md:hidden">
          {isPreviewOpen ? (
            <EyeOff
              className="text-markdown-zinc-500 cursor-pointer"
              onClick={() => setIsPreviewOpen(false)}
            />
          ) : (
            <Eye
              className="text-markdown-zinc-500 cursor-pointer"
              onClick={() => setIsPreviewOpen(true)}
            />
          )}
        </div>
      </div>
      <textarea
        id="markdown"
        name="markdown"
        value={markdownContent}
        onChange={(e) => setMarkdownContent(e.target.value)}
        className="text-robotomono-regular dark:bg-markdown-neutral-900 dark:text-markdown-neutral-300 font-robotomono text-markdown-neutral-700 flex-1 w-full resize-none overflow-auto p-4 focus:outline-none"
      />
    </div>
  );
}

export default MarkdownEditor;
