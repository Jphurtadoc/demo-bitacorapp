import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { ThemeModeSegment } from '@/components/UI/theme'
import { getAccentEmphasisStyle } from '@/components/UI/emphasis'
import { Surface } from '@/components/UI/surface'
import SecuritySettings from '@/pages/settings/SecuritySettings'
import AdminUsersPage from '@/pages/AdminUsersPage'
import AdminRolesPage from '@/pages/AdminRolesPage'
import { pushOverlayEscape } from '@/hooks/useOverlayEscape'
import {
  Check,
  ChevronDown,
  KeyRound,
  Settings,
  Shield,
  Users,
} from 'lucide-react'

const SETTINGS_TAB_IDS = [
  'general',
  'users',
  'roles',
  'security',
] as const

type SettingsTabId = (typeof SETTINGS_TAB_IDS)[number]

function isSettingsTabId(value: string | null): value is SettingsTabId {
  return value !== null && (SETTINGS_TAB_IDS as readonly string[]).includes(value)
}

const themeRowDescription = 'Elige el comportamiento del tema'

const LANGUAGE_OPTIONS = [
  { value: 'es', label: 'Español', flag: '🇨🇴' },
] as const

interface LanguageSelectProps {
  value: string
  onChange: (value: string) => void
}

/**
 * Compact language dropdown with flag emoji (single option for now).
 */
const LanguageSelect = ({ value, onChange }: LanguageSelectProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const selected =
    LANGUAGE_OPTIONS.find((option) => option.value === value) ?? LANGUAGE_OPTIONS[0]

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    const removeEscape = pushOverlayEscape(() => setOpen(false))

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      removeEscape()
    }
  }, [open])

  const handleSelect = (nextValue: string) => {
    onChange(nextValue)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="Idioma"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex min-w-[160px] items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground outline-none transition-colors hover:bg-muted focus:ring-2 focus:ring-brand/10"
      >
        <span className="flex items-center gap-2">
          <span aria-hidden="true">{selected.flag}</span>
          <span>{selected.label}</span>
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-subtle transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-1.5 min-w-full overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
          <ul role="listbox" aria-label="Idioma" className="py-1">
            {LANGUAGE_OPTIONS.map((option) => {
              const isSelected = option.value === value

              return (
                <li key={option.value} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors ${
                      isSelected
                        ? 'bg-brand/5 font-medium text-brand dark:bg-primary/10 dark:text-primary'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span aria-hidden="true">{option.flag}</span>
                      <span>{option.label}</span>
                    </span>
                    {isSelected ? <Check size={14} className="shrink-0" /> : null}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

const SystemSettings = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const activeTab: SettingsTabId = isSettingsTabId(tabParam) ? tabParam : 'general'
  const [language, setLanguage] = useState('es')

  const tabs = [
    { id: 'general', label: 'General', icon: <Settings size={18} /> },
    { id: 'users', label: 'Usuarios', icon: <Users size={18} /> },
    { id: 'roles', label: 'Roles', icon: <KeyRound size={18} /> },
    { id: 'security', label: 'Seguridad', icon: <Shield size={18} /> },
  ]

  const handleTabChange = (tabId: SettingsTabId) => {
    setSearchParams(tabId === 'general' ? {} : { tab: tabId }, { replace: true })
  }

  return (
    <DashboardLayout>
      <div className="page-shell pb-10">
        <h1 className="page-header-title page-header-title-md mb-2">
          Configuración del Sistema
        </h1>
        <p className="page-header-subtitle mb-8">
          Ajusta las opciones y parámetros globales de la aplicación
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1">
            <div className="flex flex-col gap-2" role="tablist" aria-label="Secciones de configuración">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                  onClick={() => handleTabChange(tab.id as SettingsTabId)}
                  style={
                    activeTab === tab.id
                      ? getAccentEmphasisStyle('var(--color-primary)')
                      : undefined
                  }
                  className={`flex items-center gap-3 rounded-lg border px-4 py-3.5 text-left text-sm font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'emphasis-accent font-bold'
                      : 'border-transparent text-subtle hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="col-span-1 md:col-span-3">
            {activeTab === 'users' ? (
              <AdminUsersPage embedded />
            ) : activeTab === 'roles' ? (
              <AdminRolesPage embedded />
            ) : (
              <Surface padding="xl" radius="xl" className="min-h-[500px]">
                {activeTab === 'general' && (
                  <div className="animate-fade-in">
                    <div>
                      <h3 className="page-section-title mb-1 text-xl">Personalización</h3>
                      <p className="mb-4 text-sm text-subtle">
                        Ajusta el tema y el idioma de la interfaz.
                      </p>
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-3 rounded-xl border border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-foreground">Tema</p>
                            <p className="text-xs text-subtle">{themeRowDescription}</p>
                          </div>
                          <div className="shrink-0">
                            <ThemeModeSegment size="sm" className="!w-[148px]" />
                          </div>
                        </div>
                        <div className="flex flex-col gap-3 rounded-xl border border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-foreground">Idioma</p>
                            <p className="text-xs text-subtle">Elige el idioma de la interfaz</p>
                          </div>
                          <div className="shrink-0">
                            <LanguageSelect value={language} onChange={setLanguage} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-10">
                      <button
                        type="button"
                        className="rounded-lg bg-primary px-7 py-3.5 text-sm font-bold text-[#ffffff] shadow-sm transition-opacity hover:opacity-90"
                      >
                        Guardar Cambios
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && <SecuritySettings />}
              </Surface>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default SystemSettings
