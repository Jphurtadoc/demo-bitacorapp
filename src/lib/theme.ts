export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'bitacorapp-theme';

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getStoredPreference(): ThemePreference {
  if (typeof window === 'undefined') return 'system';

  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;

  return 'system';
}

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference === 'system') return getSystemTheme();
  return preference;
}

export function applyThemePreference(preference: ThemePreference): ResolvedTheme {
  const resolved = resolveTheme(preference);

  document.documentElement.classList.toggle('dark', resolved === 'dark');
  document.documentElement.style.colorScheme = resolved;
  document.documentElement.dataset.themePreference = preference;

  return resolved;
}

export function initTheme(): ResolvedTheme {
  const preference = getStoredPreference();
  return applyThemePreference(preference);
}

/** @deprecated Use ThemePreference */
export type ThemeMode = ThemePreference;
