import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import type { ThemePreference } from '@/lib/theme';

export type ThemeModeSegmentSize = 'sm' | 'md';

interface ThemeModeSegmentProps {
  size?: ThemeModeSegmentSize;
  className?: string;
  showLabels?: boolean;
}

const options: Array<{
  value: ThemePreference;
  label: string;
  icon: typeof Sun;
}> = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

export default function ThemeModeSegment({
  size = 'md',
  className = '',
  showLabels = true,
}: ThemeModeSegmentProps) {
  const { preference, setTheme } = useTheme();

  const sizeClasses =
    size === 'sm'
      ? 'h-9 gap-0.5 rounded-xl p-1'
      : 'h-11 gap-1 rounded-2xl p-1.5';

  const buttonClasses =
    size === 'sm'
      ? 'rounded-lg px-2.5 py-1.5 text-[11px]'
      : 'rounded-xl px-3 py-2 text-xs';

  const iconSize = size === 'sm' ? 14 : 16;

  return (
    <div
      className={`inline-flex w-full items-center bg-muted/80 ${sizeClasses} ${className}`}
      role="group"
      aria-label="Seleccionar tema"
    >
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = preference === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            aria-pressed={isActive}
            className={`flex flex-1 items-center justify-center gap-1.5 font-semibold transition-all ${buttonClasses} ${
              isActive
                ? 'bg-surface text-brand shadow-sm ring-1 ring-border dark:bg-primary dark:text-[#ffffff] dark:ring-primary/40'
                : 'text-subtle hover:text-foreground'
            }`}
          >
            <Icon size={iconSize} strokeWidth={2.25} />
            {showLabels ? <span>{option.label}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
