import type { ElementType } from 'react';
import type { SurfacePadding, SurfaceProps, SurfaceRadius, SurfaceVariant } from './types';

const variantClasses: Record<SurfaceVariant, string> = {
  default: 'bg-surface',
  muted: 'bg-muted',
  elevated: 'bg-surface shadow-md',
  inset: 'border-dashed bg-muted',
  ghost: 'border-transparent bg-transparent shadow-none ring-0',
};

const paddingClasses: Record<SurfacePadding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
  xl: 'p-8',
};

const radiusClasses: Record<SurfaceRadius, string> = {
  lg: 'rounded-xl',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
};

const surfaceChrome =
  'border border-[var(--surface-border)] ring-1 ring-inset ring-[var(--surface-ring)] shadow-sm';

export default function Surface({
  variant = 'default',
  padding = 'none',
  radius = '2xl',
  interactive = false,
  as: Component = 'div',
  className = '',
  children,
  ...props
}: SurfaceProps) {
  const Tag = Component as ElementType;

  return (
    <Tag
      className={[
        variant !== 'ghost' ? surfaceChrome : '',
        variantClasses[variant],
        paddingClasses[padding],
        radiusClasses[radius],
        interactive
          ? 'transition-all hover:border-[var(--surface-border-strong)] hover:shadow-md'
          : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </Tag>
  );
}
