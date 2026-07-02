import type { CSSProperties } from 'react';

export type EmphasisTone =
  | 'brand'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral';

export const emphasisToneClasses: Record<EmphasisTone, string> = {
  brand:
    'bg-brand/10 text-brand border-brand/20 dark:bg-brand/12 dark:text-orange-200 dark:border-brand/25',
  primary:
    'bg-primary/10 text-primary border-primary/20 dark:bg-primary/12 dark:text-orange-300 dark:border-primary/25',
  success:
    'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:bg-emerald-500/12 dark:text-emerald-300 dark:border-emerald-500/25',
  warning:
    'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:bg-amber-500/12 dark:text-amber-300 dark:border-amber-500/25',
  danger:
    'bg-red-500/10 text-red-700 border-red-500/20 dark:bg-red-500/12 dark:text-red-300 dark:border-red-500/25',
  info: 'bg-sky-500/10 text-sky-700 border-sky-500/20 dark:bg-sky-500/12 dark:text-sky-300 dark:border-sky-500/25',
  neutral:
    'bg-slate-500/10 text-slate-600 border-slate-500/15 dark:bg-white/8 dark:text-slate-200 dark:border-white/12',
};

export function getAccentEmphasisStyle(accentColor: string): CSSProperties {
  return {
    ['--emphasis-color' as string]: accentColor,
  };
}
