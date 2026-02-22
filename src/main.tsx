import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { NuqsAdapter } from 'nuqs/adapters/react';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from '@/contexts/theme-provider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NuqsAdapter>
      <ThemeProvider defaultTheme="light">
        <App />
      </ThemeProvider>
    </NuqsAdapter>
  </StrictMode>,
);
