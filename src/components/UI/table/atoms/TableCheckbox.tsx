import { Check, Minus } from 'lucide-react';

interface TableCheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  ariaLabel?: string;
}

export default function TableCheckbox({
  checked = false,
  indeterminate = false,
  disabled = false,
  onChange,
  ariaLabel,
}: TableCheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
        checked || indeterminate
          ? 'border-brand bg-brand text-white'
          : 'border-gray-300 bg-surface text-transparent hover:border-gray-400'
      } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
    >
      {indeterminate ? <Minus size={12} strokeWidth={3} /> : checked ? <Check size={12} strokeWidth={3} /> : null}
    </button>
  );
}
