import { Editor, Navbar, Sidebar } from '@/components';
import { AnimatePresence, motion } from 'motion/react';
import { useNavbarStore } from './store/navbarStore';

function App() {
  const { isHamburgerMenuOpen } = useNavbarStore();

  return (
    <div>
      <AnimatePresence mode="wait">{isHamburgerMenuOpen && <Sidebar />}</AnimatePresence>
      <motion.main
        animate={{ x: isHamburgerMenuOpen ? 250 : 0 }}
        transition={{ ease: 'easeInOut', duration: 0.3 }}
      >
        <Navbar />
        <Editor />
      </motion.main>
    </div>
  );
}

export default App;
