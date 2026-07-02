import type { ReactNode } from 'react';

export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  subtitle?: ReactNode;
  headerActions?: ReactNode;
  headerBottom?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  size?: DrawerSize;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  showHandle?: boolean;
  className?: string;
  contentClassName?: string;
}

export const drawerDesktopWidthClass: Record<DrawerSize, string> = {
  sm: 'md:w-[min(100vw,360px)]',
  md: 'md:w-[min(100vw,480px)]',
  lg: 'md:w-[min(100vw,640px)]',
  xl: 'md:w-[min(100vw,820px)]',
  full: 'md:w-[min(100vw,960px)]',
};
