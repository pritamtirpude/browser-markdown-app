import useClickOutside from '@/hooks/useClickOutside';
import { useMarkdownStore } from '@/store/markdownStore';
import { useNavbarStore } from '@/store/navbarStore';
import { exportAsMarkdown, exportAsPDF, exportAsStyledHTML } from '@/util/export';
import { Code, FileDown, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { useRef, useState } from 'react';

type ExportOption = {
  label: string;
  description: string;
  icon: React.ReactNode;
  action: () => Promise<void>;
};

function DownloadDropdown() {
  const { markdownContent, filename } = useMarkdownStore();
  const { setIsDownloadDocumentOpen } = useNavbarStore();
  const [loading, setLoading] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const handleExport = async (label: string, action: () => Promise<void>) => {
    setLoading(label);
    try {
      await action();
    } finally {
      setLoading(null);
      setIsDownloadDocumentOpen(false);
    }
  };

  const options: ExportOption[] = [
    {
      label: 'Styled HTML',
      description: 'Full HTML file with CSS styles',
      icon: <Code size={16} />,
      action: () => exportAsStyledHTML(markdownContent, filename),
    },
    {
      label: 'Markdown',
      description: 'Raw .md source file',
      icon: <FileText size={16} />,
      action: () => exportAsMarkdown(markdownContent, filename),
    },
    {
      label: 'PDF',
      description: 'Exports exactly what you see in the preview',
      icon: <FileDown size={16} />,
      action: async () => exportAsPDF(filename),
    },
  ];

  useClickOutside(ref, () => setIsDownloadDocumentOpen(false), true);

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
      ref={ref}
      className="dark:bg-markdown-neutral-900 absolute top-full left-1/2 z-50 mt-2 w-56 -translate-x-1/2 rounded-md bg-white p-1.5 shadow-lg ring-1 ring-black/5 dark:ring-white/10"
    >
      <p className="text-markdown-zinc-500 dark:text-markdown-neutral-300 px-2 pt-1 pb-1.5 text-xs font-semibold tracking-widest uppercase">
        Export as
      </p>
      <ul className="flex flex-col gap-0.5">
        {options.map(({ label, description, icon, action }) => (
          <li key={label}>
            <button
              onClick={() => handleExport(label, action)}
              disabled={loading !== null}
              className="hover:bg-markdown-neutral-100 dark:hover:bg-markdown-zinc-800 flex w-full cursor-pointer items-center gap-3 rounded px-2 py-2 transition-colors duration-200 disabled:opacity-50"
            >
              <span className="text-markdown-orange-500 dark:text-markdown-orange-300 shrink-0">
                {icon}
              </span>
              <div className="text-left">
                <p className="text-markdown-neutral-700 dark:text-markdown-neutral-300 text-sm leading-none font-medium">
                  {loading === label ? 'Exporting…' : label}
                </p>
                <p className="text-markdown-zinc-500 mt-0.5 text-xs">{description}</p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default DownloadDropdown;
