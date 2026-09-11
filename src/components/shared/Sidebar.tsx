import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut } from 'lucide-react';

import {
  flattenMenuEntries,
  getMenuDataForRole,
  getModulesForRole,
} from '@/config/menuData';
import { getAccentEmphasisStyle } from '@/components/UI/emphasis';
import { useTheme } from '@/context/ThemeContext';
import { clearStoredUser, getStoredUser } from '@/modules/auth/login/infrastructure/AuthRepository';
import { SidebarModuleItem } from './SidebarModuleItem';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMobile?: boolean;
  isMobileNavOpen?: boolean;
  onMobileNavClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  isMobile = false,
  isMobileNavOpen = false,
  onMobileNavClose,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const currentUser = getStoredUser();
  const role = currentUser?.role;
  const isRoot = role === 'root';
  const visibleModules = getModulesForRole(role);
  const visibleMenuData = getMenuDataForRole(role);
  const [expandedModule, setExpandedModule] = useState<string | null>(
    isRoot ? null : 'administracion',
  );

  const brandSrc = isMobile
    ? isDark
      ? '/favicon_secondary.svg'
      : '/favicon.svg'
    : isCollapsed
      ? isDark
        ? '/favicon_secondary.svg'
        : '/favicon.svg'
      : isDark
        ? '/logo_secondary.svg'
        : '/logo.svg';

  useEffect(() => {
    const currentPath = location.pathname;
    const foundModule = Object.entries(visibleMenuData).find(([, items]) =>
      flattenMenuEntries(items).some(
        (item) =>
          currentPath === item.path || currentPath.startsWith(`${item.path}/`),
      ),
    );
    if (foundModule) {
      setExpandedModule(foundModule[0]);
    }
  }, [location.pathname, visibleMenuData]);

  const isGlobalDashboardActive =
    location.pathname === '/dashboard' || location.pathname === '/admin/dashboard';

  const handleLogout = () => {
    clearStoredUser();
    onMobileNavClose?.();
    navigate('/login');
  };

  const handleNavigate = (path: string) => {
    onMobileNavClose?.();
    navigate(path);
  };

  return (
    <>
      {isMobile && isMobileNavOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          className="fixed inset-0 z-[45] bg-black/40 md:hidden"
          onClick={onMobileNavClose}
        />
      )}
      <aside
        className={`fixed left-0 flex flex-col border-r border-border bg-surface shadow-xl transition-all duration-300 ease-in-out ${
          isMobile ? 'z-[60]' : 'z-40'
        } ${isMobile && !isMobileNavOpen ? '-translate-x-full' : 'translate-x-0'}`}
        style={{
          top: '0',
          height: '100vh',
          width: isMobile ? '260px' : isCollapsed ? '72px' : '260px',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
        onMouseEnter={() => {
          if (!isMobile) setIsCollapsed(false);
        }}
        onMouseLeave={() => {
          if (!isMobile) setIsCollapsed(true);
        }}
      >
      <div className="flex h-16 shrink-0">
        <button
          type="button"
          onClick={() => handleNavigate('/dashboard')}
          aria-label="Ir al dashboard"
          className="flex h-full w-full items-center justify-center p-1.5 transition-opacity hover:opacity-90"
        >
          <img
            src={brandSrc}
            alt="Bitacorapp"
            className="h-full w-full object-contain object-center"
          />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 py-3">
        <div className="mb-0.5 flex flex-col">
          <button
            type="button"
            onClick={() => handleNavigate('/dashboard')}
            title={isCollapsed ? 'Overview' : ''}
            aria-label="Overview"
            style={
              isGlobalDashboardActive
                ? getAccentEmphasisStyle('var(--color-primary)')
                : undefined
            }
            className={`flex w-full items-center justify-between rounded-md border transition-all duration-200 ${
              isGlobalDashboardActive
                ? 'emphasis-accent font-bold'
                : 'border-transparent text-subtle hover:bg-muted hover:text-foreground'
            } ${isCollapsed ? 'justify-center px-2 py-2.5' : 'px-2 py-2.5'}`}
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

        {visibleModules.map((mod) => (
          <SidebarModuleItem
            key={mod.id}
            id={mod.id}
            label={mod.label}
            icon={mod.icon}
            color={mod.color}
            isExpanded={expandedModule === mod.id}
            isCollapsed={isCollapsed}
            subItems={visibleMenuData[mod.id] || []}
            currentPath={location.pathname}
            onNavigate={handleNavigate}
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

      <div className="mt-auto border-t border-border p-3">
        <button
          type="button"
          onClick={handleLogout}
          className={`flex w-full items-center rounded-md font-semibold text-subtle transition-colors hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300 ${isCollapsed ? 'justify-center p-2' : 'gap-2.5 px-3 py-2'}`}
        >
          <LogOut size={17} />
          {!isCollapsed && <span className="text-[13px]">Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
