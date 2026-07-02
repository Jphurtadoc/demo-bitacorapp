import { Palette } from 'lucide-react';
import { Surface } from '@/components/UI/surface';
import { EmphasisIcon } from '@/components/UI/emphasis';
import ThemeModeSegment from './ThemeModeSegment';

interface ThemeModeSelectorProps {
  className?: string;
}

const appearanceOptions = [
  {
    mode: 'light' as const,
    title: 'Modo claro',
    description: 'Énfasis en púrpura oscuro de marca (#3C4070) con acentos naranja.',
  },
  {
    mode: 'dark' as const,
    title: 'Modo oscuro',
    description: 'Superficies sutiles con transparencias y énfasis principal en naranja.',
  },
  {
    mode: 'system' as const,
    title: 'Sistema',
    description: 'Sigue la preferencia de apariencia de tu dispositivo.',
  },
];

export default function ThemeModeSelector({ className = '' }: ThemeModeSelectorProps) {
  return (
    <div className={`space-y-5 ${className}`}>
      <ThemeModeSegment />

      <div className="grid gap-3 sm:grid-cols-3">
        {appearanceOptions.map((option) => (
          <Surface key={option.mode} variant="muted" padding="md" radius="2xl">
            <EmphasisIcon tone="brand" size="sm" className="mb-2 !rounded-lg">
              <Palette size={16} />
            </EmphasisIcon>
            <p className="text-sm font-semibold text-foreground">{option.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-subtle">{option.description}</p>
          </Surface>
        ))}
      </div>
    </div>
  );
}
