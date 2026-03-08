import { db } from '@/indexeddb/db';
import { useMarkdownStore } from '@/store/markdownStore';
import { cn } from '@/util';
import { useLiveQuery } from 'dexie-react-hooks';
import { Eye, EyeOff } from 'lucide-react';
import { useEffect } from 'react';

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
  const documents = useLiveQuery(() =>
    db.table('documents').orderBy('createdAt').reverse().toArray(),
  );
  const defaultDocument = useLiveQuery(() => db.table('defaultDocument').toCollection().first());

  // Initialize store with the most recent document, falling back to the default
  useEffect(() => {
    if (!documentId && documents !== undefined) {
      if (documents.length > 0) {
        const firstDoc = documents[0];
        setDocumentId(firstDoc.id);
        setMarkdownContent(firstDoc.content);
        setFilename(firstDoc.title);
      } else if (defaultDocument) {
        setDocumentId(defaultDocument.id);
        setMarkdownContent(defaultDocument.content);
        setFilename(defaultDocument.title);
      }
    }
  }, [documents, defaultDocument, documentId, setDocumentId, setMarkdownContent, setFilename]);

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
        className="text-robotomono-regular dark:bg-markdown-neutral-900 dark:text-markdown-neutral-300 font-robotomono text-markdown-neutral-700 w-full flex-1 resize-none overflow-auto p-4 focus:outline-none"
      />
    </div>
  );
}

export default MarkdownEditor;
