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
    activeIndicator: 'bg-gray-500',
    activeCount: 'text-subtle',
    inactiveCount: 'text-subtle',
  },
  primary: {
    activeText: 'text-brand',
    activeIndicator: 'bg-brand',
    activeCount: 'text-brand/80',
    inactiveCount: 'text-brand/60',
  },
  success: {
    activeText: 'text-emerald-700',
    activeIndicator: 'bg-emerald-500',
    activeCount: 'text-emerald-600',
    inactiveCount: 'text-emerald-500/80',
  },
  warning: {
    activeText: 'text-amber-700',
    activeIndicator: 'bg-amber-500',
    activeCount: 'text-amber-600',
    inactiveCount: 'text-amber-500/80',
  },
  danger: {
    activeText: 'text-red-700 dark:text-red-300',
    activeIndicator: 'bg-red-500',
    activeCount: 'text-red-600 dark:text-red-300',
    inactiveCount: 'text-red-500/80 dark:text-red-400/80',
  },
  info: {
    activeText: 'text-sky-700',
    activeIndicator: 'bg-sky-500',
    activeCount: 'text-sky-600',
    inactiveCount: 'text-sky-500/80',
  },
  neutral: {
    activeText: 'text-foreground',
    activeIndicator: 'bg-gray-500',
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
          ? `z-10 border-border border-b-surface bg-surface shadow-[0_-1px_0_0_#e5e7eb_inset] ${tone.activeText}`
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
