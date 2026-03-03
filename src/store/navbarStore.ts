import { create } from 'zustand';

type NavbarStoreState = {
  isHamburgerMenuOpen: boolean;
  toggleHamburgerMenu: () => void;
  isDeleteConfirmationOpen: boolean;
  setDeleteConfirmation: (deleteConfirmation: boolean) => void;
};

export const useNavbarStore = create<NavbarStoreState>((set) => ({
  isHamburgerMenuOpen: false,
  toggleHamburgerMenu: () => set((state) => ({ isHamburgerMenuOpen: !state.isHamburgerMenuOpen })),
  isDeleteConfirmationOpen: false,
  setDeleteConfirmation: (deleteConfirmation: boolean) =>
    set({ isDeleteConfirmationOpen: deleteConfirmation }),
}));
