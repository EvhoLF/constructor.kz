'use client';

import * as React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from '@/styles/ThemeMUI';

export function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');

  // Загружаем тему из localStorage при монтировании
  React.useLayoutEffect(() => {
    const savedMode = localStorage.getItem('themeMode') as 'light' | 'dark' | null;
    if (savedMode) {
      setMode(savedMode);
    } else {
      // Используем системную тему, если ничего не сохранено
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Сохраняем тему в localStorage при изменении
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const toggleMode = React.useCallback(() => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ThemeContext.Provider value={{ mode, toggleMode }}>
        {children}
      </ThemeContext.Provider>
    </ThemeProvider>
  );
}

// Контекст для доступа к toggleMode
export const ThemeContext = React.createContext({
  mode: 'light' as 'light' | 'dark',
  toggleMode: () => {},
});
