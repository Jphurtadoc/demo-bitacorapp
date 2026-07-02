import type { ReactNode } from 'react';

interface TableTooltipProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export default function TableTooltip({ label, children, className = '' }: TableTooltipProps) {
  return (
    <div className={`group/tooltip relative inline-flex ${className}`}>
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover/tooltip:opacity-100"
      >
        {label}
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
      </span>
    </div>
  );
}
