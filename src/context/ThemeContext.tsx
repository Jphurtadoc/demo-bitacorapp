import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  applyThemePreference,
  getStoredPreference,
  getSystemTheme,
  resolveTheme,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type ThemePreference,
} from '@/lib/theme';

interface ThemeContextValue {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  isDark: boolean;
  setTheme: (preference: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [preference, setPreference] = useState<ThemePreference>(() => getStoredPreference());
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    resolveTheme(getStoredPreference()),
  );

  const setTheme = useCallback((nextPreference: ThemePreference) => {
    setPreference(nextPreference);
    const resolved = applyThemePreference(nextPreference);
    setResolvedTheme(resolved);
    localStorage.setItem(THEME_STORAGE_KEY, nextPreference);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemChange = () => {
      if (preference !== 'system') return;
      setResolvedTheme(getSystemTheme());
      applyThemePreference('system');
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [preference]);

  const value = useMemo(
    () => ({
      preference,
      resolvedTheme,
      isDark: resolvedTheme === 'dark',
      setTheme,
    }),
    [preference, resolvedTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
