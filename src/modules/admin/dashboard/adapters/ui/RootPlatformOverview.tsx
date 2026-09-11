import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Calendar,
  CheckCircle2,
  CreditCard,
  Eye,
  EyeOff,
  Settings,
  UserPlus,
  Users,
  Wallet,
  XCircle,
  Clock3,
  AlertCircle,
} from 'lucide-react'
import { Surface } from '@/components/UI/surface'
import { EmphasisIcon, getAccentEmphasisStyle } from '@/components/UI/emphasis'
import { getStoredUser } from '@/modules/auth/login/infrastructure/AuthRepository'
import {
  platformActivities,
  platformBalanceTabs,
  platformQuickActions,
  platformStatsTabs,
  platformTransactions,
  type PlatformActivity,
  type PlatformTransaction,
} from '@/data/platformOverview'

const ACTIVITY_ICONS: Record<PlatformActivity['kind'], React.ReactNode> = {
  tenant: <Building2 size={14} />,
  user: <Users size={14} />,
  billing: <CreditCard size={14} />,
  system: <Settings size={14} />,
}

const TX_STATUS_META: Record<
  PlatformTransaction['status'],
  { label: string; color: string; icon: React.ReactNode }
> = {
  pagado: {
    label: 'Pagado',
    color: '#5b67c7',
    icon: <CheckCircle2 size={12} />,
  },
  pendiente: {
    label: 'Pendiente',
    color: '#ff8f47',
    icon: <Clock3 size={12} />,
  },
  fallido: {
    label: 'Fallido',
    color: '#ef4444',
    icon: <XCircle size={12} />,
  },
}

const BALANCE_TAB_ICONS: Record<string, React.ReactNode> = {
  ingresos: <Wallet size={14} />,
  recibido: <ArrowRight size={14} className="-rotate-45" />,
  pendiente: <Clock3 size={14} />,
  mora: <AlertCircle size={14} />,
}

const STATS_TAB_ICONS: Record<string, React.ReactNode> = {
  'active-clients': <Building2 size={14} />,
  'new-clients-month': <UserPlus size={14} />,
}

/**
 * System-root platform overview: balance, tenant stats, activity, and admin shortcuts.
 */
const RootPlatformOverview: React.FC = () => {
  const navigate = useNavigate()
  const currentUser = getStoredUser()
  const firstName = currentUser?.name?.split(' ')[0] ?? 'Root'
  const today = new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const [balanceTabId, setBalanceTabId] = useState(platformBalanceTabs[0].id)
  const [statsTabId, setStatsTabId] = useState(platformStatsTabs[0].id)
  const [isBalanceVisible, setIsBalanceVisible] = useState(true)

  const activeBalance =
    platformBalanceTabs.find((tab) => tab.id === balanceTabId) ??
    platformBalanceTabs[0]
  const activeStats =
    platformStatsTabs.find((tab) => tab.id === statsTabId) ??
    platformStatsTabs[0]

  return (
    <div className="page-shell space-y-6 pb-6">
      <header
        className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
        aria-label="Resumen de plataforma"
      >
        <div className="min-w-0 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Hola, {firstName}
          </h1>
          <p className="inline-flex rounded-xl bg-muted px-3 py-1.5 text-sm font-medium text-subtle">
            Resumen general de tu plataforma.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 self-start rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm">
          <Calendar size={16} className="text-subtle" aria-hidden />
          <span className="capitalize">{today}</span>
        </div>
      </header>

      <section
        className="grid grid-cols-1 gap-4 lg:grid-cols-2"
        aria-label="Balance y estadísticas"
      >
        <article
          className="relative flex min-h-[280px] flex-col overflow-hidden rounded-3xl bg-[#002a56] p-5 text-white shadow-lg sm:p-6 dark:bg-[#ff761c] dark:text-[#002a56]"
          aria-label="Balance de ingresos"
        >
          <div
            className="pointer-events-none absolute -right-10 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full border-[28px] border-white/15 dark:border-[#002a56]/15"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-2 top-[38%] h-36 w-36 -translate-y-1/2 rounded-full border-[22px] border-white/15 dark:border-[#002a56]/15"
            aria-hidden
          />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Wallet size={18} aria-hidden />
              Balance
            </div>
            <button
              type="button"
              onClick={() => navigate('/admin/clients')}
              className="rounded-full p-1.5 transition-colors hover:bg-white/10 dark:hover:bg-[#002a56]/10"
              aria-label="Ver detalle de ingresos"
            >
              <ArrowUpRight size={18} aria-hidden />
            </button>
          </div>

          <div className="relative z-10 mt-6 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold tracking-tight sm:text-4xl">
                {isBalanceVisible ? activeBalance.value : '•••••••• COP'}
              </p>
              <button
                type="button"
                onClick={() => setIsBalanceVisible((prev) => !prev)}
                className="rounded-full p-1.5 transition-colors hover:bg-white/10 dark:hover:bg-[#002a56]/10"
                aria-label={
                  isBalanceVisible ? 'Ocultar monto' : 'Mostrar monto'
                }
              >
                {isBalanceVisible ? (
                  <Eye size={18} aria-hidden />
                ) : (
                  <EyeOff size={18} aria-hidden />
                )}
              </button>
            </div>
            <p className="mt-2 text-sm font-medium text-white/75 dark:text-[#002a56]/75">
              {activeBalance.sub}
            </p>
          </div>

          <div
            className="relative z-10 mt-6 flex flex-wrap gap-2"
            aria-label="Vistas de balance"
          >
            {platformBalanceTabs.map((tab) => {
              const isActive = tab.id === balanceTabId
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setBalanceTabId(tab.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[12px] font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#ff761c] text-white dark:bg-[#002a56] dark:text-white'
                      : 'bg-white/15 text-white hover:bg-white/25 dark:bg-[#002a56]/12 dark:text-[#002a56] dark:hover:bg-[#002a56]/20'
                  }`}
                >
                  {BALANCE_TAB_ICONS[tab.id]}
                  {tab.label}
                </button>
              )
            })}
          </div>
        </article>

        <article
          className="relative flex min-h-[280px] flex-col overflow-hidden rounded-3xl border border-border bg-surface p-5 shadow-sm sm:p-6"
          aria-label="Mis estadísticas"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Users size={18} className="text-primary" aria-hidden />
              Mis estadísticas
            </div>
            <button
              type="button"
              onClick={() => navigate('/admin/clients')}
              className="rounded-full p-1.5 text-subtle transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Ver detalle de clientes"
            >
              <ArrowUpRight size={18} aria-hidden />
            </button>
          </div>

          <div className="mt-6 flex-1">
            <p className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {activeStats.value}
            </p>
            <p className="mt-2 text-sm font-medium text-subtle">
              {activeStats.sub}
            </p>
          </div>

          <div
            className="mt-6 flex flex-wrap gap-2"
            aria-label="Vistas de estadísticas"
          >
            {platformStatsTabs.map((tab) => {
              const isActive = tab.id === statsTabId
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setStatsTabId(tab.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-[12px] font-semibold transition-colors ${
                    isActive
                      ? 'border-transparent bg-primary text-white'
                      : 'border-border bg-muted text-subtle hover:text-foreground'
                  }`}
                >
                  {STATS_TAB_ICONS[tab.id]}
                  {tab.label}
                </button>
              )
            })}
          </div>
        </article>
      </section>

      <section
        className="grid grid-cols-1 gap-4 lg:grid-cols-3"
        aria-label="Actividad, transacciones y acciones"
      >
        <Surface padding="lg" radius="xl">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div>
              <h2 className="dashboard-section-title">Actividades recientes</h2>
              <p className="mt-0.5 text-[11px] text-subtle">
                Altas, cambios y bajas de usuarios
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/settings?tab=users')}
              className="dashboard-section-link flex shrink-0 items-center gap-1 text-[11px] font-semibold"
              aria-label="Ver usuarios"
            >
              Ver usuarios <ArrowRight size={12} aria-hidden />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {platformActivities.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <EmphasisIcon
                  accentColor={item.accentColor}
                  size="sm"
                  className="!rounded-full mt-0.5"
                >
                  {ACTIVITY_ICONS[item.kind]}
                </EmphasisIcon>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-semibold leading-tight text-foreground">
                    {item.title}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-subtle">
                    {item.sub}
                  </p>
                </div>
                <span className="shrink-0 text-[11px] font-medium text-subtle">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </Surface>

        <Surface padding="lg" radius="xl">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div>
              <h2 className="dashboard-section-title">Transacciones</h2>
              <p className="mt-0.5 text-[11px] text-subtle">
                Pagos de suscripción por tenant
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/admin/clients')}
              className="dashboard-section-link flex shrink-0 items-center gap-1 text-[11px] font-semibold"
              aria-label="Ver cobros por tenant"
            >
              Ver cobros <ArrowRight size={12} aria-hidden />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {platformTransactions.map((tx) => {
              const status = TX_STATUS_META[tx.status]
              return (
                <div
                  key={tx.id}
                  className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 px-3 py-2.5"
                >
                  <EmphasisIcon accentColor={status.color} size="sm">
                    <CreditCard size={14} />
                  </EmphasisIcon>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12.5px] font-semibold leading-tight text-foreground">
                      {tx.tenant}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-subtle">
                      {tx.plan} · {tx.time}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[12.5px] font-bold text-foreground">
                      {tx.amount}
                    </p>
                    <span
                      className="mt-0.5 inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-bold"
                      style={getAccentEmphasisStyle(status.color)}
                    >
                      {status.icon}
                      {status.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </Surface>

        <Surface padding="lg" radius="xl">
          <div className="mb-4">
            <h2 className="dashboard-section-title">Acciones rápidas</h2>
            <p className="mt-0.5 text-[11px] text-subtle">
              Atajos de administración de plataforma
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {platformQuickActions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => navigate(action.path)}
                style={getAccentEmphasisStyle(action.accentColor)}
                className="emphasis-accent flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 hover:scale-[1.01]"
                aria-label={action.label}
              >
                <EmphasisIcon
                  accentColor={action.accentColor}
                  size="sm"
                  className="!border-0 !bg-transparent !shadow-none"
                >
                  {action.id === 'qa-tenants' ? (
                    <Building2 size={16} />
                  ) : action.id === 'qa-users' ? (
                    <Users size={16} />
                  ) : (
                    <Settings size={16} />
                  )}
                </EmphasisIcon>
                <span className="min-w-0 flex-1">
                  <span className="block text-[12.5px] font-semibold leading-tight">
                    {action.label}
                  </span>
                  <span className="mt-0.5 block text-[11px] opacity-80">
                    {action.description}
                  </span>
                </span>
                <ArrowRight
                  size={14}
                  className="shrink-0 opacity-70"
                  aria-hidden
                />
              </button>
            ))}
          </div>
        </Surface>
      </section>
    </div>
  )
}

export default RootPlatformOverview
