import { db } from '@/indexeddb/db';
import { useMarkdownStore } from '@/store/markdownStore';
import { cn } from '@/util';
import { useLiveQuery } from 'dexie-react-hooks';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

function MarkdownEditor() {
  const { setMarkdownContent, markdownContent, isPreviewOpen, setIsPreviewOpen } =
    useMarkdownStore();
  const defaultDocument = useLiveQuery(() => db.table('defaultDocument').toCollection().first());

  return (
    <motion.div layout layoutId='editor' className={cn('size-full flex-1', isPreviewOpen ? 'hidden' : 'block')}>
      <motion.div layout layoutId='editor-header' className="bg-markdown-neutral-100 dark:bg-markdown-zinc-900 flex items-center justify-between px-4 py-3">
        <motion.h3 layout layoutId='editor-header-title' className="text-markdown-zinc-500 dark:text-markdown-neutral-300  text-roboto-regularhs uppercase">Markdown</motion.h3>

        <motion.div layout layoutId='editor-header-icon' className="block md:hidden">
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
        </motion.div>
      </motion.div>
      <motion.textarea
        layout
        layoutId='editor-content'
        id="markdown"
        name="markdown"
        value={markdownContent || defaultDocument?.content || ''}
        onChange={(e) => setMarkdownContent(e.target.value)}
        className="text-robotomono-regular dark:bg-markdown-neutral-900 dark:text-markdown-neutral-300 font-robotomono text-markdown-neutral-700 min-h-screen w-full resize-none p-4 focus:outline-none"
      />
    </motion.div>
  );
}

export default MarkdownEditor;
