import { Editor, Navbar, Sidebar } from '@/components';
import { AnimatePresence, motion } from 'motion/react';
import { useNavbarStore } from './store/navbarStore';

function App() {
  const { isHamburgerMenuOpen } = useNavbarStore();

  return (
    <div className='relative'>
      <AnimatePresence mode="wait">{isHamburgerMenuOpen && <Sidebar />}</AnimatePresence>
      <main className='dark:bg-markdown-neutral-900 overflow-x-hidden'>
        <motion.div animate={{
          x: isHamburgerMenuOpen ? 250 : 0,
        }}
          transition={{ ease: 'easeInOut', duration: 0.3 }}>
          <Navbar />
          <Editor />
        </motion.div>
      </main>
    </div>
  );
}

export default App;
