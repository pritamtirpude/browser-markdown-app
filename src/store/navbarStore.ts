import { create } from 'zustand';

type NavbarStoreState = {
  isHamburgerMenuOpen: boolean;
  toggleHamburgerMenu: () => void;
};

export const useNavbarStore = create<NavbarStoreState>((set) => ({
  isHamburgerMenuOpen: false,
  toggleHamburgerMenu: () => set((state) => ({ isHamburgerMenuOpen: !state.isHamburgerMenuOpen })),
}));
