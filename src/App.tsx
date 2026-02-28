import { Editor, Navbar, Sidebar, SplashScreen } from '@/components';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useNavbarStore } from './store/navbarStore';

function App() {
  const { isHamburgerMenuOpen } = useNavbarStore();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000); // Show splash for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <AnimatePresence mode="wait">
        <SplashScreen />
      </AnimatePresence>
    );
  }

  return (
    <div className="h-screen overflow-hidden">
      <AnimatePresence mode="wait">{isHamburgerMenuOpen && <Sidebar />}</AnimatePresence>
      <main className="dark:bg-markdown-neutral-900 flex h-screen flex-col overflow-hidden">
        <motion.div
          className="flex h-full flex-col"
          animate={{
            x: isHamburgerMenuOpen ? 250 : 0,
          }}
          transition={{ ease: 'easeInOut', duration: 0.3 }}
        >
          <Navbar />
          <Editor />
        </motion.div>
      </main>
    </div>
  );
}

export default App;
