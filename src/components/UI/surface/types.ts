import type { HTMLAttributes } from 'react';

export type SurfaceVariant = 'default' | 'muted' | 'elevated' | 'inset' | 'ghost';
export type SurfacePadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type SurfaceRadius = 'lg' | 'xl' | '2xl' | '3xl';

export interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SurfaceVariant;
  padding?: SurfacePadding;
  radius?: SurfaceRadius;
  interactive?: boolean;
  as?: 'div' | 'section' | 'article';
}
