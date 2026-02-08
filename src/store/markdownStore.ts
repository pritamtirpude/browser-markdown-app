import { create } from 'zustand';

type MarkdownStoreState = {
  markdownContent: string;
  setMarkdownContent: (content: string) => void;
  filename: string;
  setFilename: (filename: string) => void;
  documentId: string;
  setDocumentId: (id: string) => void;
};

export const useMarkdownStore = create<MarkdownStoreState>((set) => ({
  markdownContent: '',
  setMarkdownContent: (content) => set({ markdownContent: content }),
  filename: '',
  setFilename: (filename) => set({ filename }),
  documentId: '',
  setDocumentId: (id) => set({ documentId: id }),
}));
