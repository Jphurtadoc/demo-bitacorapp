import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { pushOverlayEscape } from '@/hooks/useOverlayEscape';
import type { TableActionItem, TableActionVariant } from '../types';

interface TableRowActionsProps {
  items: TableActionItem[];
}

interface MenuPosition {
  top: number;
  left: number;
}

const itemToneClass: Record<TableActionVariant, string> = {
  primary: 'text-brand hover:bg-brand/10',
  secondary: 'text-foreground hover:bg-muted',
  ghost: 'text-subtle hover:bg-muted',
  danger: 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10',
};

/**
 * Renders row actions as a three-dot overflow menu.
 */
export default function TableRowActions({ items }: TableRowActionsProps) {
  const navigate = useNavigate();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition>({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;

    const updatePosition = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const menuWidth = menuRef.current?.offsetWidth ?? 176;
      const menuHeight = menuRef.current?.offsetHeight ?? 0;
      const gap = 6;
      const preferredTop = rect.bottom + gap;
      const fitsBelow = preferredTop + menuHeight <= window.innerHeight - 8;
      const top = fitsBelow
        ? preferredTop
        : Math.max(8, rect.top - gap - menuHeight);
      const left = Math.min(
        Math.max(8, rect.right - menuWidth),
        window.innerWidth - menuWidth - 8,
      );
      setPosition({ top, left });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, items.length]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    const removeEscape = pushOverlayEscape(() => setOpen(false));

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      removeEscape();
    };
  }, [open]);

  if (!items.length) return null;

  const handleItemClick = (item: TableActionItem) => {
    if (item.disabled) return;
    setOpen(false);
    if (item.onClick) {
      item.onClick();
      return;
    }
    if (item.to) {
      navigate(item.to);
    }
  };

  return (
    <div
      className="relative flex items-center justify-end"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={open ? (event) => event.stopPropagation() : undefined}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-label="Abrir acciones"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-subtle transition-colors hover:bg-muted hover:text-foreground"
      >
        <MoreVertical size={18} />
      </button>

      {open
        ? createPortal(
            <div
              ref={menuRef}
              role="menu"
              style={{ top: position.top, left: position.left }}
              className="fixed z-[80] min-w-[11rem] overflow-hidden rounded-xl border border-border bg-surface py-1 shadow-lg"
            >
              {items.map((item, index) => {
                const Icon = item.icon;
                const variant = item.variant ?? 'secondary';

                return (
                  <button
                    key={item.id ?? `${item.label}-${index}`}
                    type="button"
                    role="menuitem"
                    disabled={item.disabled}
                    onClick={() => handleItemClick(item)}
                    className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${itemToneClass[variant]}`}
                  >
                    <Icon size={16} className="shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
