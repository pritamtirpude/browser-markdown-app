import { db } from '@/indexeddb/db';
import { useMarkdownStore } from '@/store/markdownStore';
import { cn } from '@/util';
import { useLiveQuery } from 'dexie-react-hooks';
import { Eye, EyeOff } from 'lucide-react';

function MarkdownEditor() {
  const { setMarkdownContent, markdownContent, isPreviewOpen, setIsPreviewOpen } =
    useMarkdownStore();
  const defaultDocument = useLiveQuery(() => db.table('defaultDocument').toCollection().first());

  return (
    <div className={cn('flex-1', isPreviewOpen ? 'hidden' : 'block')}>
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
        value={markdownContent || defaultDocument?.content || ''}
        onChange={(e) => setMarkdownContent(e.target.value)}
        className="text-robotomono-regular dark:bg-markdown-neutral-900 dark:text-markdown-neutral-300 font-robotomono text-markdown-neutral-700 size-full resize-none p-4 focus:outline-none"
      />
    </div>
  );
}

export default MarkdownEditor;
