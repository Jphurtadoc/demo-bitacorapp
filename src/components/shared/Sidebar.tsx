import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut } from 'lucide-react';

import { modules, menuData, flattenMenuEntries } from '@/config/menuData';
import { getAccentEmphasisStyle } from '@/components/UI/emphasis';
import { SidebarModuleItem } from './SidebarModuleItem';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedModule, setExpandedModule] = useState<string | null>('administracion');

  useEffect(() => {
    const currentPath = location.pathname;
    const foundModule = Object.entries(menuData).find(([, items]) =>
      flattenMenuEntries(items).some(
        (item) =>
          currentPath === item.path || currentPath.startsWith(`${item.path}/`),
      ),
    );
    if (foundModule) {
      setExpandedModule(foundModule[0]);
    }
  }, [location.pathname]);

  const isGlobalDashboardActive = location.pathname === '/dashboard' || location.pathname === '/admin/dashboard';

  return (
    <aside
      className="fixed left-0 z-40 flex flex-col border-r border-border bg-surface shadow-xl transition-all duration-300 ease-in-out"
      style={{
        top: '64px',
        height: 'calc(100vh - 64px)',
        width: isCollapsed ? '72px' : '260px',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 py-3">
        
        {/* Global Dashboard */}
        <div className="flex flex-col mb-0.5">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            title={isCollapsed ? 'Overview' : ''}
            style={isGlobalDashboardActive ? getAccentEmphasisStyle('var(--color-primary)') : undefined}
            className={`flex w-full items-center justify-between rounded-md border transition-all duration-200 ${
              isGlobalDashboardActive
                ? 'emphasis-accent font-bold'
                : 'border-transparent text-subtle hover:bg-muted hover:text-foreground'
            } ${isCollapsed ? 'justify-center px-2 py-2.5' : 'px-2.5 py-2'}`}
          >
            <div className="flex items-center gap-2.5">
              <span className="shrink-0 transition-colors [&>svg]:h-[17px] [&>svg]:w-[17px]">
                <LayoutDashboard size={17} />
              </span>
              {!isCollapsed && (
                <span
                  className={`text-[13px] ${isGlobalDashboardActive ? 'font-bold' : 'font-semibold'}`}
                >
                  Overview
                </span>
              )}
            </div>
          </button>
        </div>

        {modules.map((mod) => (
          <SidebarModuleItem
            key={mod.id}
            id={mod.id}
            label={mod.label}
            icon={mod.icon}
            color={mod.color}
            isExpanded={expandedModule === mod.id}
            isCollapsed={isCollapsed}
            subItems={menuData[mod.id] || []}
            currentPath={location.pathname}
            onNavigate={navigate}
            onToggle={() => {
              if (isCollapsed) {
                setIsCollapsed(false);
                setExpandedModule(mod.id);
              } else {
                setExpandedModule(expandedModule === mod.id ? null : mod.id);
              }
            }}
          />
        ))}
      </div>

      {/* Footer / Logout */}
      <div className="mt-auto border-t border-border p-3">
        <button
          onClick={() => navigate('/login')}
          className={`flex w-full items-center rounded-md font-semibold text-subtle transition-colors hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300 ${isCollapsed ? 'justify-center p-2' : 'gap-2.5 px-3 py-2'}`}
        >
          <LogOut size={17} />
          {!isCollapsed && <span className="text-[13px]">Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
