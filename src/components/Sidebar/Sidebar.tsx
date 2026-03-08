import { Button, DocumentList, ThemeSwitcher } from '@/components';
import { db } from '@/indexeddb/db';
import { addOrUpdateDocument } from '@/indexeddb/helperMethods';
import { useMarkdownStore } from '@/store/markdownStore';
import { cn } from '@/util';
import { useHotkey } from '@tanstack/react-hotkeys';
import { useLiveQuery } from 'dexie-react-hooks';
import { motion } from 'motion/react';

function Sidebar() {
  const { setDocumentId, setFilename, setMarkdownContent } = useMarkdownStore();
  const defaultDocument = useLiveQuery(() => db.table('defaultDocument').toCollection().first());

  const handleNewDocument = () => {
    const title = defaultDocument?.title || 'untitled.md';
    const content = defaultDocument?.content || '';

    addOrUpdateDocument(title, content, '', setDocumentId);

    // Load the new document into the editor
    setFilename(title);
    setMarkdownContent(content);
  };

  useHotkey('N', () => {
    handleNewDocument();
  });

  return (
    <motion.aside
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut',
      }}
      exit={{
        x: '-100%',
      }}
      className={cn('bg-markdown-zinc-900 fixed inset-0 flex h-full w-62.5 flex-col p-6')}
    >
      <div className="flex flex-1 flex-col gap-6">
        <div className="lg:hidden">
          <img src="/assets/logo.svg" alt="markdown logo" loading="lazy" />
        </div>
        <div>
          <span className="text-roboto-regularhs text-markdown-zinc-500 uppercase">
            My Documents
          </span>
        </div>
        <DocumentList />
        <div>
          <Button isMobile={true} title="New Document" handleEvent={handleNewDocument} />
        </div>
      </div>

      <div>
        <ThemeSwitcher />
      </div>
    </motion.aside>
  );
}

export default Sidebar;
