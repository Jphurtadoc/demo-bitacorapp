import React from 'react';
import { LayoutDashboard } from 'lucide-react';

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
      className={`w-full flex items-center rounded-lg transition-all duration-200 shadow-sm border ${
        isActive 
          ? 'bg-orange-50 text-orange-600 font-bold border-orange-100/50' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-semibold border-transparent'
      } ${isCollapsed ? 'justify-center px-3 py-3' : 'gap-3 px-3 py-2.5'}`}
    >
      <LayoutDashboard size={20} className={isActive ? 'text-orange-600' : 'text-gray-400'} />
      {!isCollapsed && <span className="text-[13.5px]">Overview</span>}
    </button>
  );
};
