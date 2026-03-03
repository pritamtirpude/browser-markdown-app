import { ScrambleText } from 'motion-plus/react';
import { motion, stagger } from 'motion/react';

export default function SplashScreen() {
  return (
    <motion.div
      className="bg-markdown-neutral-900 fixed inset-0 z-50 flex items-center justify-center"
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      animate={{ clipPath: 'inset(0 0 0 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 1.15, ease: 'easeInOut' }}
    >
      <ScrambleText
        as="h1"
        className="font-robotoslab text-markdown-orange-500 text-4xl font-bold uppercase md:text-6xl lg:text-9xl"
        duration={stagger(0.05, { startDelay: 1, from: 'center' })}
        chars="!@#$%^&*()_+-=[]{}|;:,.<>?/~`░▒▓█▀▄■□▪▫●○◆◇◈◊※†‡"
      >
        Markdown
      </ScrambleText>
    </motion.div>
  );
}
