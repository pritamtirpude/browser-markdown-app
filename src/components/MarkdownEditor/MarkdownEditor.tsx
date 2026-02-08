import { db } from '@/indexeddb/db';
import { useMarkdownStore } from '@/store/markdownStore';
import { useLiveQuery } from 'dexie-react-hooks';

function MarkdownEditor() {
  const { setMarkdownContent, markdownContent } = useMarkdownStore();
  const defaultDocument = useLiveQuery(() => db.table('defaultDocument').toCollection().first());

  return (
    <div className="min-h-screen flex-1">
      <div className="bg-markdown-neutral-100 px-4 py-3">
        <h3 className="text-markdown-zinc-500 text-roboto-regularhs uppercase">Markdown</h3>
      </div>
      <textarea
        id="markdown"
        name="markdown"
        value={markdownContent || defaultDocument?.content || ''}
        onChange={(e) => setMarkdownContent(e.target.value)}
        className="text-robotomono-regular font-robotomono text-markdown-neutral-700 min-h-screen w-full resize-none p-4 focus:outline-none"
      />
    </div>
  );
}

export default MarkdownEditor;
