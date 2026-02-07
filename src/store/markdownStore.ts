import { create } from 'zustand';

type MarkdownStoreState = {
  markdownContent: string;
  setMarkdownContent: (content: string) => void;
  filename: string;
  setFilename: (filename: string) => void;
};

export const useMarkdownStore = create<MarkdownStoreState>((set) => ({
  markdownContent: '',
  setMarkdownContent: (content) => set({ markdownContent: content }),
  filename: 'Untitled Document',
  setFilename: (filename) => set({ filename }),
}));
