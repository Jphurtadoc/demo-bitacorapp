import React from 'react';
import { getAccentEmphasisStyle } from '@/components/UI/emphasis';

interface SidebarSubmenuItemProps {
  label: string;
  isActive: boolean;
  accentColor?: string;
  onClick: () => void;
}

export const SidebarSubmenuItem: React.FC<SidebarSubmenuItemProps> = ({
  label,
  isActive,
  accentColor = '#ea580c',
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      style={isActive ? getAccentEmphasisStyle(accentColor) : undefined}
      className={`relative flex w-full items-center rounded px-2 py-1.5 text-left text-[12.5px] transition-all duration-200 ${
        isActive
          ? 'emphasis-accent border font-bold'
          : 'border border-transparent font-medium text-subtle hover:bg-muted hover:text-foreground'
      }`}
    >
      {isActive ? (
        <div
          className="absolute left-[-11px] h-3 w-0.5 rounded-r-sm"
          style={{ backgroundColor: accentColor }}
        />
      ) : null}
      <span className={isActive ? 'ml-0.5' : ''}>{label}</span>
    </button>
  );
};
