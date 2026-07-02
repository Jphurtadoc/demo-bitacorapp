import type { ReactNode } from 'react';
import Emphasis from './Emphasis';
import type { EmphasisSize, EmphasisProps } from './Emphasis';
import type { EmphasisTone } from './emphasisTokens';

interface EmphasisIconProps {
  children: ReactNode;
  tone?: EmphasisTone;
  accentColor?: string;
  size?: EmphasisSize;
  className?: string;
}

export default function EmphasisIcon({
  children,
  tone = 'primary',
  accentColor,
  size = 'md',
  className = '',
}: EmphasisIconProps) {
  const emphasisProps: Pick<EmphasisProps, 'tone' | 'accentColor' | 'size' | 'className'> = {
    tone,
    accentColor,
    size: 'icon',
    className: `${className} ${size === 'sm' ? '!h-7 !w-7' : size === 'lg' ? '!h-10 !w-10' : '!h-9 !w-9'}`,
  };

  return <Emphasis {...emphasisProps}>{children}</Emphasis>;
}
