import { create } from 'zustand';

type MarkdownStoreState = {
  markdownContent: string;
  setMarkdownContent: (content: string) => void;
  filename: string;
  setFilename: (filename: string) => void;
  documentId: string;
  setDocumentId: (id: string) => void;
  isPreviewOpen: boolean;
  setIsPreviewOpen: (isOpen: boolean) => void;
  isSavingDocument: boolean;
  setIsSavingDocument: (isSaving: boolean) => void;
};

export const useMarkdownStore = create<MarkdownStoreState>((set) => ({
  markdownContent: '',
  setMarkdownContent: (content) => set({ markdownContent: content }),
  filename: '',
  setFilename: (filename) => set({ filename }),
  documentId: '',
  setDocumentId: (id) => set({ documentId: id }),
  isPreviewOpen: false,
  setIsPreviewOpen: (isOpen) => set({ isPreviewOpen: isOpen }),
  isSavingDocument: false,
  setIsSavingDocument: (isSaving) => set({ isSavingDocument: isSaving }),
}));
