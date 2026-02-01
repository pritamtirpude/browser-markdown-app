import { cn } from '@/util';
import { motion } from 'motion/react';

function Sidebar() {
  return (
    <motion.aside
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      transition={{
        duration: 0.5,
        ease: 'easeInOut',
      }}
      exit={{
        x: '-100%',
      }}
      className={cn('bg-markdown-zinc-900 fixed min-h-screen w-62.5')}
    >
      Sidebar
    </motion.aside>
  );
}

export default Sidebar;
