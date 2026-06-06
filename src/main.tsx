import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { LocaleProvider } from './context/LocaleProvider';
import { applyTheme, loadTheme } from './lib/theme';

applyTheme(loadTheme());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocaleProvider>
      <App />
    </LocaleProvider>
  </StrictMode>,
);
