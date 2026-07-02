export interface DrawerTabOption<T extends string = string> {
  id: T;
  label: string;
  count?: number;
}

interface DrawerTabsProps<T extends string> {
  tabs: DrawerTabOption<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
}

export default function DrawerTabs<T extends string>({
  tabs,
  activeTab,
  onChange,
}: DrawerTabsProps<T>) {
  if (!tabs.length) return null;

  return (
    <div className="px-5 pb-4 md:px-6">
      <div
        className="flex gap-1 overflow-x-auto rounded-xl bg-muted p-1"
        role="tablist"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={`flex shrink-0 items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm transition-all ${
                isActive
                  ? 'bg-surface font-semibold text-foreground shadow-sm ring-1 ring-border/70'
                  : 'font-medium text-subtle hover:text-foreground'
              }`}
            >
              <span>{tab.label}</span>
              {typeof tab.count === 'number' ? (
                <span
                  className="text-xs tabular-nums text-subtle"
                >
                  {tab.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
