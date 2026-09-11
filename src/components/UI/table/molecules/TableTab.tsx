import type { TableBadgeTone, TableTabItem } from '../types';

const tabToneStyles: Record<
  TableBadgeTone,
  {
    activeText: string;
    activeIndicator: string;
    activeCount: string;
    inactiveCount: string;
  }
> = {
  default: {
    activeText: 'text-foreground',
    activeIndicator: 'bg-subtle',
    activeCount: 'text-subtle',
    inactiveCount: 'text-subtle',
  },
  primary: {
    activeText: 'text-brand dark:text-primary',
    activeIndicator: 'bg-brand dark:bg-primary',
    activeCount: 'text-brand/80 dark:text-primary/80',
    inactiveCount: 'text-brand/60 dark:text-primary/60',
  },
  success: {
    activeText: 'text-emerald-700 dark:text-emerald-300',
    activeIndicator: 'bg-emerald-500',
    activeCount: 'text-emerald-600 dark:text-emerald-300',
    inactiveCount: 'text-emerald-500/80 dark:text-emerald-400/80',
  },
  warning: {
    activeText: 'text-amber-700 dark:text-amber-300',
    activeIndicator: 'bg-amber-500',
    activeCount: 'text-amber-600 dark:text-amber-300',
    inactiveCount: 'text-amber-500/80 dark:text-amber-400/80',
  },
  danger: {
    activeText: 'text-red-700 dark:text-red-300',
    activeIndicator: 'bg-red-500',
    activeCount: 'text-red-600 dark:text-red-300',
    inactiveCount: 'text-red-500/80 dark:text-red-400/80',
  },
  info: {
    activeText: 'text-sky-700 dark:text-sky-300',
    activeIndicator: 'bg-sky-500',
    activeCount: 'text-sky-600 dark:text-sky-300',
    inactiveCount: 'text-sky-500/80 dark:text-sky-400/80',
  },
  neutral: {
    activeText: 'text-foreground',
    activeIndicator: 'bg-subtle',
    activeCount: 'text-subtle',
    inactiveCount: 'text-subtle',
  },
};

interface TableTabProps extends TableTabItem {
  active?: boolean;
  onClick?: () => void;
}

export default function TableTab({
  label,
  count,
  badgeTone = 'primary',
  active = false,
  onClick,
}: TableTabProps) {
  const tone = tabToneStyles[badgeTone];

  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`relative -mb-px inline-flex items-center gap-1.5 rounded-t-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
        active
          ? `z-10 border-border border-b-surface bg-surface ${tone.activeText}`
          : 'border-transparent bg-transparent text-subtle hover:bg-surface/50 hover:text-foreground'
      }`}
    >
      {active ? (
        <span
          className={`absolute inset-x-3 top-0 h-0.5 rounded-full ${tone.activeIndicator}`}
          aria-hidden
        />
      ) : null}
      <span>{label}</span>
      {typeof count === 'number' ? (
        <span
          className={`text-xs font-semibold tabular-nums ${
            active ? tone.activeCount : tone.inactiveCount
          }`}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}
