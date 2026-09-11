import ThemeModeSegment from './ThemeModeSegment'

interface ThemeModeSelectorProps {
  className?: string
}

export default function ThemeModeSelector({ className = '' }: ThemeModeSelectorProps) {
  return (
    <div className={className}>
      <ThemeModeSegment />
    </div>
  )
}
