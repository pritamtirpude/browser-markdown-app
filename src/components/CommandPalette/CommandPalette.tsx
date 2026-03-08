import { motion } from 'motion/react';

function CommandPalette() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        type: 'spring',
        bounce: 0,
        duration: 0.35,
      }}
      className="dark:bg-markdown-neutral-900 absolute top-full left-1/2 z-50 mt-2 w-70 -translate-x-1/2 rounded-md bg-white p-2 shadow-lg"
    >
      <ul className="flex flex-col gap-1">
        <li className="text-markdown-zinc-500 font-robotomono dark:text-markdown-neutral-300 flex items-center gap-1 text-sm">
          <div className="bg-markdown-neutral-200 dark:bg-markdown-neutral-700 rounded-sm p-0.5">
            Ctrl
          </div>
          <span>+</span>
          <div className="bg-markdown-neutral-200 dark:bg-markdown-neutral-700 rounded-sm p-0.5">
            S
          </div>
          - Save Document
        </li>
        <li className="text-markdown-zinc-500 font-robotomono dark:text-markdown-neutral-300 flex items-center gap-1 text-sm">
          <div className="bg-markdown-neutral-200 dark:bg-markdown-neutral-700 rounded-sm p-0.5">
            N
          </div>
          - New Document
        </li>
        <li className="text-markdown-zinc-500 font-robotomono dark:text-markdown-neutral-300 flex items-center gap-1 text-sm">
          <div className="bg-markdown-neutral-200 dark:bg-markdown-neutral-700 rounded-sm p-0.5">
            D
          </div>
          - Delete Document
        </li>
        <li className="text-markdown-zinc-500 font-robotomono dark:text-markdown-neutral-300 flex items-center gap-1 text-sm">
          <div className="bg-markdown-neutral-200 dark:bg-markdown-neutral-700 rounded-sm p-0.5">
            Alt
          </div>
          <span>+</span>
          <div className="bg-markdown-neutral-200 dark:bg-markdown-neutral-700 rounded-sm p-0.5">
            Backspace
          </div>
          - Close Sidebar
        </li>
      </ul>
    </motion.div>
  );
}

export default CommandPalette;
