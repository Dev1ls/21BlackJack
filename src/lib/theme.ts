export type AppTheme = 'classic' | 'casino';

export const THEME_STORAGE_KEY = 'bj-live-helper-theme';
export const DEFAULT_THEME: AppTheme = 'classic';

export function loadTheme(): AppTheme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'classic' || stored === 'casino') return stored;
  } catch {
    /* ignore */
  }
  return DEFAULT_THEME;
}

export function saveTheme(theme: AppTheme): void {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function applyTheme(theme: AppTheme): void {
  document.documentElement.dataset.theme = theme === 'casino' ? 'casino' : 'classic';
  const meta = document.querySelector('meta[name="theme-color"]');
  meta?.setAttribute('content', theme === 'casino' ? '#071510' : '#111827');
}
