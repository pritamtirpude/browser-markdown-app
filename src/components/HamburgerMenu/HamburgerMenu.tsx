import { useNavbarStore } from '@/store/navbarStore';
import { useHotkey } from '@tanstack/react-hotkeys';
import { motion, MotionConfig } from 'motion/react';

function HamburgerMenu() {
  const { toggleHamburgerMenu, isHamburgerMenuOpen } = useNavbarStore();
  useHotkey('Alt+Backspace', () => {
    toggleHamburgerMenu();
  });
  return (
    <MotionConfig transition={{ duration: 0.2 }}>
      <button
        className="bg-markdown-neutral-700 hover:bg-markdown-orange-500 flex cursor-pointer flex-col items-center justify-center gap-1.5 px-5 py-7 transition-all duration-200"
        aria-label={isHamburgerMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isHamburgerMenuOpen}
        onClick={toggleHamburgerMenu}
      >
        <motion.span
          animate={isHamburgerMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
          className="h-0.5 w-8 bg-white"
        />
        <motion.span
          className="h-0.5 w-8 bg-white"
          animate={isHamburgerMenuOpen ? { opacity: 0 } : { opacity: 1 }}
        />
        <motion.span
          className="h-0.5 w-8 bg-white"
          animate={isHamburgerMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
        />
      </button>
    </MotionConfig>
  );
}

export default HamburgerMenu;
