import { Button, FilenameInput, HamburgerMenu } from '@/components';
import { db } from '@/indexeddb/db';
import { addOrUpdateDocument } from '@/indexeddb/helperMethods';
import { useMarkdownStore } from '@/store/markdownStore';
import { useLiveQuery } from 'dexie-react-hooks';
import { Trash2 } from 'lucide-react';

function Navbar() {
  const { markdownContent, filename, documentId, setDocumentId } = useMarkdownStore(
    (state) => state,
  );
  const defaultDocument = useLiveQuery(() => db.table('defaultDocument').toCollection().first());
  const documents = useLiveQuery(() => db.table('documents').orderBy('createdAt').reverse().toArray());

  const markdownDocument = documents?.find((doc) => doc.id === documentId || defaultDocument?.id);

  const handleSave = async () => {
    if (!filename && !markdownContent) {
      alert('Please enter a filename and content before saving.');
      return;
    }

    await addOrUpdateDocument(
      filename,
      markdownContent,
      markdownDocument?.id ?? undefined,
      setDocumentId,
    );
  };

  return (
    <nav className="bg-markdown-zinc-800 flex w-full">
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
        <div className="flex items-center gap-2.5">
          <Trash2 className="hover:text-markdown-orange-500 text-markdown-gray-600 cursor-pointer transition-all duration-200" />
          <Button title="Save Changes" icon="/assets/icon-save.svg" handleEvent={handleSave} />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
