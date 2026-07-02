import { useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import TableTooltip from '../atoms/TableTooltip';
import type { TableActionItem, TableActionVariant } from '../types';

export interface TableActionButtonProps extends TableActionItem {
  icon: LucideIcon;
}

const variantStyles: Record<TableActionVariant, string> = {
  primary:
    'bg-brand text-white shadow-sm hover:bg-brand-hover border border-transparent',
  secondary:
    'bg-surface text-foreground border border-border hover:bg-muted shadow-sm',
  ghost: 'bg-transparent text-subtle border border-transparent hover:bg-muted',
  danger: 'danger-action-btn',
};

export default function TableActionButton({
  label,
  icon: Icon,
  tooltip,
  to,
  onClick,
  variant = 'secondary',
  disabled = false,
  showLabel = false,
}: TableActionButtonProps) {
  const navigate = useNavigate();
  const tooltipLabel = tooltip ?? label;

  const handleClick = () => {
    if (disabled) return;
    if (onClick) {
      onClick();
      return;
    }
    if (to) {
      navigate(to);
    }
  };

  const button = (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-label={tooltipLabel}
      className={`inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        showLabel ? 'px-4 py-2.5' : 'h-10 w-10'
      } ${variantStyles[variant]}`}
    >
      <Icon size={showLabel ? 16 : 18} />
      {showLabel ? <span>{label}</span> : null}
    </button>
  );

  if (showLabel) {
    return button;
  }

  return <TableTooltip label={tooltipLabel}>{button}</TableTooltip>;
}
