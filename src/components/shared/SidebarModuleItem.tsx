import React from 'react';
import { ChevronDown } from 'lucide-react';
import { getAccentEmphasisStyle } from '@/components/UI/emphasis';
import type { MenuEntry } from '@/config/menuData';
import {
  flattenMenuEntries,
  isMenuGroup,
  modules,
  rootModules,
} from '@/config/menuData';
import { SidebarSubmenuItem } from './SidebarSubmenuItem';

interface SidebarModuleItemProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  isExpanded: boolean;
  isCollapsed: boolean;
  subItems: MenuEntry[];
  currentPath: string;
  onToggle: () => void;
  onNavigate: (path: string) => void;
  /** Leaf module path: click navigates, no chevron/submenu. */
  directPath?: string;
}

/**
 * Resolves an optional leaf path from module catalogs when `directPath` is omitted.
 */
function resolveDirectPath(id: string, directPath?: string): string | undefined {
  if (directPath) return directPath;
  return (
    rootModules.find((item) => item.id === id)?.path ??
    modules.find((item) => item.id === id)?.path
  );
}

export const SidebarModuleItem: React.FC<SidebarModuleItemProps> = ({
  id,
  label,
  icon,
  color,
  isExpanded,
  isCollapsed,
  subItems,
  currentPath,
  onToggle,
  onNavigate,
  directPath: directPathProp,
}) => {
  const directPath = resolveDirectPath(id, directPathProp);
  const flatItems = flattenMenuEntries(subItems);
  const isDirectActive =
    directPath != null &&
    (currentPath === directPath || currentPath.startsWith(`${directPath}/`));
  const isAnySubActive =
    isDirectActive ||
    flatItems.some(
      (item) => currentPath === item.path || currentPath.startsWith(`${item.path}/`),
    );

  const handleClick = () => {
    if (directPath) {
      onNavigate(directPath);
      return;
    }
    onToggle();
  };

  return (
    <div className="flex flex-col mb-0.5">
      <button
        type="button"
        onClick={handleClick}
        title={isCollapsed ? label : ''}
        aria-label={label}
        style={isAnySubActive ? getAccentEmphasisStyle(color) : undefined}
        className={`flex w-full items-center justify-between rounded-md border transition-all duration-200 ${
          isAnySubActive
            ? 'emphasis-accent'
            : isExpanded && !isCollapsed && !directPath
              ? 'border-transparent bg-muted text-foreground'
              : 'border-transparent text-subtle hover:bg-muted hover:text-foreground'
        } ${isCollapsed ? 'justify-center px-2 py-2.5' : 'px-2 py-2.5'}`}
      >
        <div className="flex items-center gap-2.5">
          <span className="shrink-0 transition-colors [&>svg]:h-[17px] [&>svg]:w-[17px]">
            {icon}
          </span>
          {!isCollapsed && (
            <span
              className={`text-[13px] ${
                (!directPath && isExpanded) || isAnySubActive ? 'font-bold' : 'font-semibold'
              }`}
            >
              {label}
            </span>
          )}
        </div>
        {!isCollapsed && !directPath && (
          <ChevronDown
            size={13}
            className={`flex-shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            style={{ color: 'var(--color-text-muted)' }}
          />
        )}
      </button>

      {!directPath && isExpanded && !isCollapsed && (
        <div
          className="ml-8 mt-0.5 flex flex-col border-l-2 pl-2.5 py-0.5"
          style={{ borderColor: `${color}30` }}
        >
          {subItems.map((entry) => {
            if (isMenuGroup(entry)) {
              return (
                <div key={entry.label} className="mb-1">
                  <p className="px-2 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wide text-subtle">
                    {entry.label}
                  </p>
                  {entry.children.map((child) => (
                    <SidebarSubmenuItem
                      key={child.path}
                      label={child.label}
                      isActive={currentPath === child.path}
                      accentColor={color}
                      onClick={() => onNavigate(child.path)}
                    />
                  ))}
                </div>
              );
            }

            return (
              <SidebarSubmenuItem
                key={entry.path}
                label={entry.label}
                isActive={currentPath === entry.path}
                accentColor={color}
                onClick={() => onNavigate(entry.path)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
