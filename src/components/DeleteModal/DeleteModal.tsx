import { Button } from '@/components';
import useClickOutside from '@/hooks/useClickOutside';
import { db } from '@/indexeddb/db';
import { deleteDocument } from '@/indexeddb/helperMethods';
import { useMarkdownStore } from '@/store/markdownStore';
import { useNavbarStore } from '@/store/navbarStore';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

function DeleteModal() {
  const { filename } = useMarkdownStore();
  const { setDeleteConfirmation } = useNavbarStore();
  const { documentId, setMarkdownContent, setDocumentId, setFilename } = useMarkdownStore();

  const ref = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    dialog.showModal();
    // Enable click-outside detection after dialog opens
    setTimeout(() => setIsOpen(true), 100);

    return () => dialog.close();
  }, [ref]);

  const handleClose = () => {
    setDeleteConfirmation(false);
  };

  const handleDeleteDocument = async () => {
    await deleteDocument(documentId);
    await handleDBChange();
    handleClose();
  };

  const handleDBChange = async () => {
    // Fetch remaining documents after deletion
    const remainingDocuments = await db.table('documents').orderBy('createdAt').reverse().toArray();

    if (remainingDocuments.length > 0) {
      // Load the first remaining document
      const nextDoc = remainingDocuments[0];
      setDocumentId(nextDoc.id);
      setFilename(nextDoc.title);
      setMarkdownContent(nextDoc.content);
    } else {
      // No documents left - load default document
      const defaultDoc = await db.table('defaultDocument').toCollection().first();
      if (defaultDoc) {
        // Add default document to documents table
        setDocumentId(defaultDoc.id);
        setFilename(defaultDoc.title);
        setMarkdownContent(defaultDoc.content);
        await db.table('documents').put({
          id: defaultDoc.id,
          title: defaultDoc.title,
          content: defaultDoc.content,
          createdAt: defaultDoc.createdAt,
        });
      } else {
        // No default document - clear everything
        setDocumentId('');
        setFilename('');
        setMarkdownContent('');
      }
    }
  };

  // Only attach listener after dialog is fully open
  useClickOutside(ref, handleClose, isOpen);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999px] bg-black/75 backdrop-blur-xs"
      />
      <motion.dialog
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onCancel={(event) => {
          event.preventDefault();
          handleClose();
        }}
        ref={ref}
        className="fixed top-1/2 left-1/2 z-[10000px] flex max-w-85 -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-lg bg-white p-6 focus:outline-none"
      >
        <h2 className="font-robotoslab text-robotoslab-h4 text-markdown-neutral-700 font-bold">
          Delete this Document?
        </h2>
        <p className="font-robotoslab text-robotoslab-regular text-markdown-zinc-500">
          Are you sure you want to delete the '{filename}' document and its contents? This action
          cannot be reversed.
        </p>
        <Button title="Confirm & Delete" handleEvent={handleDeleteDocument} />
      </motion.dialog>
    </>
  );
}

export default DeleteModal;
