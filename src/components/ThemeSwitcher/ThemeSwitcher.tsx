import { cn } from '@/util';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '@/contexts/theme-provider';

const MotionMoon = motion.create(Moon);
const MotionSun = motion.create(Sun);

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center  gap-2.5">
      <MotionSun
        animate={{
          color: theme === "dark" ? "var(--color-markdown-gray-600)" : "white",
        }}
        className="text-markdown-gray-600"
      />
      <motion.button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        animate={{
          backgroundColor: 'var(--color-markdown-orange-500)',
        }}
        className={cn(
          'bg-markdown-gray-600 flex h-6 w-12 cursor-pointer items-center rounded-full p-1.5',
          theme === "dark" ? 'justify-end' : 'justify-start',
        )}
      >
        <motion.div
          key={theme === "dark" ? 'on' : 'off'}
          layoutId="theme-switcher-indicator"
          layout
          transition={{
            type: 'spring',
            visualDuration: 0.2,
            bounce: 0.2,
          }}
          className="size-3 rounded-full bg-white"
        />
      </motion.button>
      <MotionMoon
        animate={{
          color: theme === "dark" ? "white" : "var(--color-markdown-gray-600)",
        }}
        className="text-markdown-gray-600"
      />
    </div>
  );
}

export default ThemeSwitcher;
