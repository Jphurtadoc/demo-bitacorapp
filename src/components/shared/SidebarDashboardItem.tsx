import React from 'react';
import { LayoutDashboard } from 'lucide-react';
import { getAccentEmphasisStyle } from '@/components/UI/emphasis';

interface SidebarDashboardItemProps {
  isCollapsed: boolean;
  isActive: boolean;
  onClick: () => void;
}

export const SidebarDashboardItem: React.FC<SidebarDashboardItemProps> = ({
  isCollapsed,
  isActive,
  onClick
}) => {
  return (
    <button 
      onClick={onClick}
      title={isCollapsed ? 'Overview' : ''}
      style={isActive ? getAccentEmphasisStyle('var(--color-primary)') : undefined}
      className={`w-full flex items-center rounded-lg transition-all duration-200 shadow-sm border ${
        isActive 
          ? 'emphasis-accent font-bold'
          : 'text-subtle hover:bg-muted hover:text-foreground font-semibold border-transparent'
      } ${isCollapsed ? 'justify-center px-3 py-3' : 'gap-3 px-3 py-2.5'}`}
    >
      <LayoutDashboard size={20} className={isActive ? '' : 'text-subtle'} />
      {!isCollapsed && <span className="text-[13.5px]">Overview</span>}
    </button>
  );
};
