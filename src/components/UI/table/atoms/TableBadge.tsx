import { emphasisToneClasses } from '@/components/UI/emphasis';
import type { TableBadgeTone } from '../types';

const toneStyles: Record<TableBadgeTone, string> = {
  default: emphasisToneClasses.neutral,
  primary: emphasisToneClasses.brand,
  success: emphasisToneClasses.success,
  warning: emphasisToneClasses.warning,
  danger: emphasisToneClasses.danger,
  info: emphasisToneClasses.info,
  neutral: emphasisToneClasses.neutral,
};

interface TableBadgeProps {
  children: React.ReactNode;
  tone?: TableBadgeTone;
  className?: string;
}

export default function TableBadge({
  children,
  tone = 'default',
  className = '',
}: TableBadgeProps) {
  return (
    <span
      className={`inline-flex min-w-[1.25rem] items-center justify-center rounded-full border px-2 py-0.5 text-[11px] font-bold leading-none ${toneStyles[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
