import {
  Button,
  CommandPalette,
  DeleteModal,
  DownloadDropdown,
  FilenameInput,
  HamburgerMenu,
} from '@/components';
import { db } from '@/indexeddb/db';
import { addOrUpdateDocument } from '@/indexeddb/helperMethods';
import { useMarkdownStore } from '@/store/markdownStore';
import { useNavbarStore } from '@/store/navbarStore';
import { useHotkey } from '@tanstack/react-hotkeys';
import { useLiveQuery } from 'dexie-react-hooks';
import { Command, Download, Trash2 } from 'lucide-react';
import { AnimatePresence } from 'motion/react';

function Navbar() {
  const { markdownContent, filename, documentId, setDocumentId, setIsSavingDocument } =
    useMarkdownStore((state) => state);
  const {
    isDeleteConfirmationOpen,
    setDeleteConfirmation,
    setIsCommandPaletteOpen,
    isCommandPaletteOpen,
    setIsDownloadDocumentOpen,
    isDownloadDocumentOpen,
  } = useNavbarStore();
  const defaultDocument = useLiveQuery(() => db.table('defaultDocument').toCollection().first());
  const documents = useLiveQuery(() =>
    db.table('documents').orderBy('createdAt').reverse().toArray(),
  );

  const markdownDocument = documents?.find((doc) => doc.id === (documentId || defaultDocument?.id));

  const handleSave = async () => {
    if (!filename && !markdownContent) {
      alert('Please enter a filename and content before saving.');
      return;
    }

    setIsSavingDocument(true);
    await addOrUpdateDocument(
      filename,
      markdownContent,
      markdownDocument?.id ?? undefined,
      setDocumentId,
    );
    setTimeout(() => setIsSavingDocument(false), 1500);
  };

  useHotkey('Mod+S', () => {
    handleSave();
  });

  return (
    <nav className="bg-markdown-zinc-800 sticky inset-0 z-50 flex w-full">
      <HamburgerMenu />
      <div className="flex w-full items-center justify-between p-4">
        <div className="flex items-center gap-7.5">
          <div className="hidden lg:block">
            <img src="/assets/logo.svg" alt="markdown logo" loading="lazy" />
          </div>
          <div className="flex items-center gap-6">
            <div className="bg-markdown-gray-600 hidden h-10 w-px lg:block" />
            <div className="flex items-center gap-4">
              <div>
                <img src="/assets/icon-document.svg" alt="icon document" loading="lazy" />
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="text-roboto-lightbody text-markdown-zinc-500 hidden md:block">
                  Document Name
                </h1>
                <FilenameInput />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-6">
          <div
            onClick={() => setIsDownloadDocumentOpen(true)}
            title="Export Document"
            className="relative"
          >
            <Download className="hover:text-markdown-orange-500 text-markdown-gray-600 size-4 cursor-pointer transition-all duration-200 md:size-6" />
            <AnimatePresence mode="wait">
              {isDownloadDocumentOpen && <DownloadDropdown />}
            </AnimatePresence>
          </div>
          <div
            title="Keyboard Shortcuts"
            className="relative"
            onMouseEnter={() => setIsCommandPaletteOpen(true)}
            onMouseLeave={() => setIsCommandPaletteOpen(false)}
          >
            <Command className="hover:text-markdown-orange-500 text-markdown-gray-600 size-4 cursor-pointer transition-all duration-200 md:size-6" />

            <AnimatePresence mode="wait">
              {isCommandPaletteOpen && <CommandPalette />}
            </AnimatePresence>
          </div>
          <div title="Delete Document">
            <Trash2
              onClick={() => setDeleteConfirmation(true)}
              className="hover:text-markdown-orange-500 text-markdown-gray-600 size-4 cursor-pointer transition-all duration-200 md:size-6"
            />
          </div>
          <Button title="Save Changes" icon="/assets/icon-save.svg" handleEvent={handleSave} />
        </div>
      </div>
      <AnimatePresence>{isDeleteConfirmationOpen ? <DeleteModal /> : null}</AnimatePresence>
    </nav>
  );
}

export default Navbar;
