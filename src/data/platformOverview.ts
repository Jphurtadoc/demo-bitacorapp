/**
 * Demo data for the system-root platform overview (tenant administration).
 */

export interface PlatformActivity {
  readonly id: string
  readonly title: string
  readonly sub: string
  readonly time: string
  readonly accentColor: string
  readonly kind: 'tenant' | 'user' | 'billing' | 'system'
}

export interface PlatformTransaction {
  readonly id: string
  readonly tenant: string
  readonly plan: string
  readonly amount: string
  readonly status: 'pagado' | 'pendiente' | 'fallido'
  readonly time: string
}

export interface PlatformQuickAction {
  readonly id: string
  readonly label: string
  readonly description: string
  readonly path: string
  readonly accentColor: string
}

export interface PlatformMetricTab {
  readonly id: string
  readonly label: string
  readonly value: string
  readonly sub: string
}

/** Balance tabs: system income from tenant payments. */
export const platformBalanceTabs: readonly PlatformMetricTab[] = [
  {
    id: 'ingresos',
    label: 'Ingresos',
    value: '86.400.000 COP',
    sub: 'Inicio del mes 78.200.000 COP',
  },
  {
    id: 'recibido',
    label: 'Recibido',
    value: '72.150.000 COP',
    sub: 'Pagos confirmados este mes',
  },
  {
    id: 'pendiente',
    label: 'Pendiente',
    value: '9.850.000 COP',
    sub: 'Cobros en proceso',
  },
  {
    id: 'mora',
    label: 'Mora',
    value: '4.400.000 COP',
    sub: 'Suscripciones vencidas',
  },
]

/** Mis estadísticas tabs: active tenants vs new tenants this month. */
export const platformStatsTabs: readonly PlatformMetricTab[] = [
  {
    id: 'active-clients',
    label: 'Clientes activos',
    value: '128',
    sub: 'Tenants con suscripción vigente',
  },
  {
    id: 'new-clients-month',
    label: 'Clientes nuevos',
    value: '14',
    sub: 'Altas en septiembre 2026',
  },
]

/** Recent platform user-management events. */
export const platformActivities: readonly PlatformActivity[] = [
  {
    id: 'act-1',
    title: 'Usuario creado',
    sub: 'Ana Gómez · admin@seguridad-andina.com',
    time: '09:12',
    accentColor: '#5b67c7',
    kind: 'user',
  },
  {
    id: 'act-2',
    title: 'Usuario invitado',
    sub: 'ops@vigilancia-norte.com · pendiente',
    time: '08:40',
    accentColor: '#6b9be8',
    kind: 'user',
  },
  {
    id: 'act-3',
    title: 'Rol actualizado',
    sub: 'Carlos Ruiz · editor → admin',
    time: '08:05',
    accentColor: '#ff8f47',
    kind: 'user',
  },
  {
    id: 'act-4',
    title: 'Usuario modificado',
    sub: 'María López · datos de perfil',
    time: '07:48',
    accentColor: '#e88840',
    kind: 'user',
  },
  {
    id: 'act-5',
    title: 'Usuario eliminado',
    sub: 'tmp.ops@custodia-express.com',
    time: '07:15',
    accentColor: '#7a84d8',
    kind: 'user',
  },
]

/** Recent tenant payment transactions. */
export const platformTransactions: readonly PlatformTransaction[] = [
  {
    id: 'tx-1',
    tenant: 'Seguridad Shatter',
    plan: 'Enterprise',
    amount: '$4.8M',
    status: 'pagado',
    time: 'Hoy · 10:22',
  },
  {
    id: 'tx-2',
    tenant: 'Prosegur Andina',
    plan: 'Enterprise',
    amount: '$6.2M',
    status: 'pagado',
    time: 'Hoy · 09:01',
  },
  {
    id: 'tx-3',
    tenant: 'Custodia Express',
    plan: 'Pro',
    amount: '$1.1M',
    status: 'pendiente',
    time: 'Ayer · 18:40',
  },
  {
    id: 'tx-4',
    tenant: 'Vigilancia Norte',
    plan: 'Starter',
    amount: '$420K',
    status: 'fallido',
    time: 'Ayer · 14:12',
  },
  {
    id: 'tx-5',
    tenant: 'Grupo Atlas Seguridad',
    plan: 'Pro',
    amount: '$1.9M',
    status: 'pagado',
    time: '10 sep · 11:05',
  },
]

/** Quick links for platform tenant administration. */
export const platformQuickActions: readonly PlatformQuickAction[] = [
  {
    id: 'qa-tenants',
    label: 'Gestionar tenants',
    description: 'Alta, planes y estado de clientes',
    path: '/admin/clients',
    accentColor: '#6b9be8',
  },
  {
    id: 'qa-users',
    label: 'Usuarios de plataforma',
    description: 'Cuentas root y acceso global',
    path: '/settings?tab=users',
    accentColor: '#ff8f47',
  },
  {
    id: 'qa-roles',
    label: 'Roles del sistema',
    description: 'Roles de plataforma y defaults de tenant',
    path: '/settings?tab=roles',
    accentColor: '#6b9be8',
  },
  {
    id: 'qa-settings',
    label: 'Configuración del sistema',
    description: 'Parámetros globales y facturación',
    path: '/settings',
    accentColor: '#ff8f47',
  },
]
