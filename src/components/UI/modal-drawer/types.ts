import type { ReactNode } from 'react';

export type ModalDrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalDrawerProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  subtitle?: ReactNode;
  headerActions?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  size?: ModalDrawerSize;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  className?: string;
  contentClassName?: string;
}

export const modalDrawerSizeClass: Record<ModalDrawerSize, string> = {
  sm: 'md:max-w-md',
  md: 'md:max-w-lg',
  lg: 'md:max-w-2xl',
  xl: 'md:max-w-4xl',
  full: 'md:max-w-[min(96vw,1200px)]',
};
