import type { SwitchProps } from './types';

export default function Switch({
  checked,
  onChange,
  disabled = false,
  id,
  className = '',
  'aria-label': ariaLabel,
}: SwitchProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? 'bg-brand dark:bg-primary' : 'bg-muted'
      } ${className}`}
    >
      <span
        aria-hidden
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-surface shadow-sm transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-1'
        }`}
      />
    </button>
  );
}
