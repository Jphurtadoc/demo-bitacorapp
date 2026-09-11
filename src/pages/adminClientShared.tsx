import { Building2, Factory, Home } from 'lucide-react'
import { SearchableSelect } from '@/components/UI/searchable-select'
import { Surface } from '@/components/UI/surface'
import { EmphasisIcon, type EmphasisTone } from '@/components/UI/emphasis'
import type { AdminClient, AdminClientTipo } from '@/types/adminClient'
import {
  RegistryDetailField,
  RegistryFormField,
  inputClassName,
  inputErrorClassName,
} from '@/pages/adminRegistryShared'

export const PLAN_OPTIONS = ['Starter', 'Business', 'Enterprise'] as const
export const ESTADO_OPTIONS = ['activo', 'mora', 'inactivo'] as const
export const TIPO_OPTIONS = ['fabrica', 'comercio', 'conjunto_residencial'] as const

export const tipoMeta: Record<
  AdminClientTipo,
  { label: string; Icon: typeof Factory; tone: EmphasisTone }
> = {
  fabrica: { label: 'Fábrica', Icon: Factory, tone: 'warning' },
  comercio: { label: 'Comercio', Icon: Building2, tone: 'info' },
  conjunto_residencial: { label: 'Conjunto residencial', Icon: Home, tone: 'success' },
}

export const estadoLabelMap: Record<AdminClient['estadoSuscripcion'], string> = {
  activo: 'Activo',
  mora: 'En mora',
  inactivo: 'Inactivo',
}

/**
 * Favicon-style badge for a client site type.
 */
export function ClientTypeFavicon({
  tipo,
  size = 'sm',
}: {
  tipo: AdminClientTipo
  size?: 'sm' | 'md'
}) {
  const meta = tipoMeta[tipo]
  const Icon = meta.Icon
  return (
    <span title={meta.label} aria-label={meta.label} className="inline-flex shrink-0">
      <EmphasisIcon tone={meta.tone} size={size} className="shrink-0">
        <Icon size={size === 'md' ? 18 : 15} aria-hidden />
      </EmphasisIcon>
    </span>
  )
}

/**
 * Builds an empty client draft for create flows.
 */
export function createEmptyClient(): AdminClient {
  return {
    id: '',
    nombre: '',
    nit: '',
    ciudad: '',
    contacto: '',
    email: '',
    tipo: 'comercio',
    plan: 'Starter',
    estadoSuscripcion: 'activo',
    mrrMillones: 0,
    creadoEn: new Date().toISOString().slice(0, 10),
    activo: true,
  }
}

/**
 * Validates required fields on a client draft.
 */
export function validateClientDraft(draft: AdminClient): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!draft.nombre.trim()) errors.nombre = 'Este campo es requerido'
  if (!draft.nit.trim()) errors.nit = 'Este campo es requerido'
  if (!draft.ciudad.trim()) errors.ciudad = 'Este campo es requerido'
  if (!draft.contacto.trim()) errors.contacto = 'Este campo es requerido'
  if (!draft.email.trim()) errors.email = 'Este campo es requerido'
  return errors
}

/**
 * Formats MRR millions as a short currency label.
 */
export function formatMrr(value: number): string {
  if (value <= 0) return '—'
  return `$${value.toFixed(1)}M`
}

/**
 * Returns true when the ISO date falls in the current calendar month.
 */
export function isCreatedThisMonth(isoDate: string, now = new Date()): boolean {
  const created = new Date(isoDate)
  if (Number.isNaN(created.getTime())) return false
  return created.getFullYear() === now.getFullYear() && created.getMonth() === now.getMonth()
}

/**
 * Shared create/edit/view form for admin clients.
 */
export function ClientDetailsContent({
  client,
  editing,
  draft,
  errors,
  ciudadOptions,
  creating = false,
  onDraftChange,
}: {
  client: AdminClient
  editing: boolean
  draft: AdminClient
  errors: Record<string, string>
  ciudadOptions: string[]
  creating?: boolean
  onDraftChange: (draft: AdminClient) => void
}) {
  const updateDraft = (patch: Partial<AdminClient>) => {
    onDraftChange({ ...draft, ...patch })
  }

  if (editing || creating) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <RegistryFormField label="Razón social" required error={errors.nombre} className="sm:col-span-2">
          <input
            type="text"
            value={draft.nombre}
            onChange={(event) => updateDraft({ nombre: event.target.value })}
            className={errors.nombre ? inputErrorClassName : inputClassName}
            placeholder="Nombre del cliente / tenant"
          />
        </RegistryFormField>
        <RegistryFormField label="Tipo de cliente" required className="sm:col-span-2">
          <div className="flex items-center gap-3">
            <ClientTypeFavicon tipo={draft.tipo} size="md" />
            <div className="min-w-0 flex-1">
              <SearchableSelect
                value={draft.tipo}
                options={TIPO_OPTIONS.map((tipo) => ({
                  label: tipoMeta[tipo].label,
                  value: tipo,
                }))}
                placeholder="Seleccionar tipo"
                searchPlaceholder="Buscar tipo..."
                emptyOptionLabel="Seleccionar"
                onChange={(value) => updateDraft({ tipo: value as AdminClientTipo })}
              />
            </div>
          </div>
        </RegistryFormField>
        <RegistryFormField label="NIT" required error={errors.nit}>
          <input
            type="text"
            value={draft.nit}
            onChange={(event) => updateDraft({ nit: event.target.value })}
            className={errors.nit ? inputErrorClassName : inputClassName}
            placeholder="900123456-1"
          />
        </RegistryFormField>
        <RegistryFormField label="Ciudad" required error={errors.ciudad}>
          <SearchableSelect
            value={draft.ciudad}
            options={ciudadOptions.map((ciudad) => ({ label: ciudad, value: ciudad }))}
            placeholder="Seleccionar ciudad"
            searchPlaceholder="Buscar ciudad..."
            emptyOptionLabel="Seleccionar"
            onChange={(value) => updateDraft({ ciudad: value })}
          />
        </RegistryFormField>
        <RegistryFormField label="Contacto" required error={errors.contacto}>
          <input
            type="text"
            value={draft.contacto}
            onChange={(event) => updateDraft({ contacto: event.target.value })}
            className={errors.contacto ? inputErrorClassName : inputClassName}
          />
        </RegistryFormField>
        <RegistryFormField label="E-mail" required error={errors.email}>
          <input
            type="email"
            value={draft.email}
            onChange={(event) => updateDraft({ email: event.target.value })}
            className={errors.email ? inputErrorClassName : inputClassName}
          />
        </RegistryFormField>
        <RegistryFormField label="Plan">
          <SearchableSelect
            value={draft.plan}
            options={PLAN_OPTIONS.map((plan) => ({ label: plan, value: plan }))}
            placeholder="Seleccionar plan"
            searchPlaceholder="Buscar plan..."
            emptyOptionLabel="Seleccionar"
            onChange={(value) => updateDraft({ plan: value as AdminClient['plan'] })}
          />
        </RegistryFormField>
        <RegistryFormField label="Suscripción">
          <SearchableSelect
            value={draft.estadoSuscripcion}
            options={ESTADO_OPTIONS.map((estado) => ({
              label: estadoLabelMap[estado],
              value: estado,
            }))}
            placeholder="Seleccionar estado"
            searchPlaceholder="Buscar..."
            emptyOptionLabel="Seleccionar"
            onChange={(value) => {
              const estadoSuscripcion = value as AdminClient['estadoSuscripcion']
              updateDraft({
                estadoSuscripcion,
                activo: estadoSuscripcion !== 'inactivo',
              })
            }}
          />
        </RegistryFormField>
        <RegistryFormField label="MRR (millones COP)" className="sm:col-span-2">
          <input
            type="number"
            min={0}
            step={0.1}
            value={draft.mrrMillones}
            onChange={(event) => updateDraft({ mrrMillones: Number(event.target.value) || 0 })}
            className={inputClassName}
          />
        </RegistryFormField>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Surface variant="muted" padding="sm" radius="xl" className="flex items-center gap-3">
          <ClientTypeFavicon tipo={client.tipo} size="md" />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-subtle">Tipo de cliente</p>
            <p className="mt-1 text-sm font-semibold text-foreground">{tipoMeta[client.tipo].label}</p>
          </div>
        </Surface>
      </div>
      <RegistryDetailField label="Razón social" value={client.nombre} />
      <RegistryDetailField label="NIT" value={client.nit} />
      <RegistryDetailField label="Ciudad" value={client.ciudad} />
      <RegistryDetailField label="Contacto" value={client.contacto} />
      <RegistryDetailField label="E-mail" value={client.email} />
      <RegistryDetailField label="Plan" value={client.plan} />
      <RegistryDetailField label="Suscripción" value={estadoLabelMap[client.estadoSuscripcion]} />
      <RegistryDetailField label="MRR" value={formatMrr(client.mrrMillones)} />
      <RegistryDetailField label="Alta" value={client.creadoEn} />
    </div>
  )
}
