import type { ElementType, ReactNode } from 'react';
import type { EmphasisTone } from './emphasisTokens';
import { emphasisToneClasses, getAccentEmphasisStyle } from './emphasisTokens';

export type EmphasisSize = 'sm' | 'md' | 'lg' | 'icon';

export interface EmphasisProps {
  children: ReactNode;
  tone?: EmphasisTone;
  accentColor?: string;
  active?: boolean;
  size?: EmphasisSize;
  as?: 'div' | 'span' | 'button';
  className?: string;
  onClick?: () => void;
  title?: string;
}

const sizeClasses: Record<EmphasisSize, string> = {
  sm: 'gap-1 rounded-md px-2 py-1 text-[11px]',
  md: 'gap-1.5 rounded-lg px-2.5 py-1.5 text-xs',
  lg: 'gap-2 rounded-xl px-3 py-2 text-sm',
  icon: 'rounded-lg p-0',
};

const iconSizeClasses: Record<EmphasisSize, string> = {
  sm: 'h-7 w-7',
  md: 'h-8 w-8',
  lg: 'h-9 w-9',
  icon: 'h-9 w-9',
};

export default function Emphasis({
  children,
  tone = 'primary',
  accentColor,
  active = true,
  size = 'md',
  as: Component = 'span',
  className = '',
  onClick,
  title,
}: EmphasisProps) {
  const Tag = Component as ElementType;
  const usesAccent = Boolean(accentColor && active);

  return (
    <Tag
      type={Component === 'button' ? 'button' : undefined}
      title={title}
      onClick={onClick}
      style={usesAccent ? getAccentEmphasisStyle(accentColor!) : undefined}
      className={[
        'inline-flex items-center justify-center border font-semibold transition-colors',
        sizeClasses[size],
        usesAccent
          ? 'emphasis-accent'
          : active
            ? emphasisToneClasses[tone]
            : 'border-transparent bg-transparent text-subtle',
        size === 'icon' || usesAccent ? iconSizeClasses[size] : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Tag>
  );
}
