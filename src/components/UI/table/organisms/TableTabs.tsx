import TableTab from '../molecules/TableTab';
import type { TableTabItem } from '../types';

interface TableTabsProps {
  tabs: TableTabItem[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export default function TableTabs({ tabs, activeTab, onTabChange }: TableTabsProps) {
  if (!tabs.length) return null;

  return (
    <div
      className="flex items-end gap-1 border-b border-border bg-muted/60 px-5 pt-3"
      role="tablist"
    >
      {tabs.map((tab) => (
        <TableTab
          key={tab.id}
          {...tab}
          active={activeTab === tab.id}
          onClick={() => onTabChange?.(tab.id)}
        />
      ))}
    </div>
  );
}
