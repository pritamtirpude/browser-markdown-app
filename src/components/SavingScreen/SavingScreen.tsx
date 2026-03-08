import { motion } from 'motion/react';

function SavingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-markdown-neutral-900/75 fixed inset-0 z-50 flex size-full flex-col items-center justify-center gap-3"
    >
      <motion.div
        className="border-t-markdown-orange-300 size-12 rounded-full border-8 border-white will-change-transform"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, ease: 'linear', repeat: Infinity }}
      />
      <h1 className="text-roboto-regular text-white">Saving your document...</h1>
    </motion.div>
  );
}

export default SavingScreen;
