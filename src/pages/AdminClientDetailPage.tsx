import { useMemo, useState } from 'react'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import DashboardLayout from '@/components/layout/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import { ModalDrawer } from '@/components/UI/modal-drawer'
import { Surface } from '@/components/UI/surface'
import { TableBadge, type TableBadgeTone } from '@/components/UI/table'
import {
  deleteAdminClient,
  getAdminClientById,
  upsertAdminClient,
} from '@/data/adminClientsStore'
import type { AdminClient } from '@/types/adminClient'
import {
  ClientDetailsContent,
  ClientTypeFavicon,
  estadoLabelMap,
  formatMrr,
  tipoMeta,
  validateClientDraft,
} from '@/pages/adminClientShared'
import {
  ConfirmModalContent,
  ConfirmModalFooter,
} from '@/pages/adminRegistryShared'

const planToneMap: Record<AdminClient['plan'], TableBadgeTone> = {
  Starter: 'neutral',
  Business: 'info',
  Enterprise: 'primary',
}

const estadoToneMap: Record<AdminClient['estadoSuscripcion'], TableBadgeTone> = {
  activo: 'success',
  mora: 'warning',
  inactivo: 'danger',
}

interface ClientDetailLocationState {
  edit?: boolean
}

/**
 * Full-page detail view for a platform client (tenant).
 */
export default function AdminClientDetailPage() {
  const { clientId = '' } = useParams<{ clientId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = (location.state as ClientDetailLocationState | null) ?? null
  const storedClient = getAdminClientById(clientId)
  const [client, setClient] = useState<AdminClient | null>(storedClient)
  const [editing, setEditing] = useState(Boolean(locationState?.edit))
  const [draft, setDraft] = useState<AdminClient>(storedClient ?? ({} as AdminClient))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [confirmDelete, setConfirmDelete] = useState(false)

  const ciudadOptions = useMemo(() => {
    if (!client) return []
    return [
      ...new Set([
        client.ciudad,
        'Bogotá',
        'Medellín',
        'Cali',
        'Barranquilla',
        'Cartagena',
        'Pereira',
        'Bucaramanga',
      ]),
    ]
      .filter(Boolean)
      .sort()
  }, [client])

  if (!client) {
    return <Navigate to="/admin/clients" replace />
  }

  const handleBack = () => {
    navigate('/admin/clients')
  }

  const handleSave = () => {
    const nextErrors = validateClientDraft(draft)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    const updated: AdminClient = {
      ...draft,
      id: client.id,
      activo: draft.estadoSuscripcion !== 'inactivo',
      creadoEn: client.creadoEn,
    }
    upsertAdminClient(updated)
    setClient(updated)
    setDraft(updated)
    setEditing(false)
  }

  const handleConfirmDelete = () => {
    deleteAdminClient(client.id)
    setConfirmDelete(false)
    navigate('/admin/clients')
  }

  return (
    <DashboardLayout>
      <div className="page-shell pb-6">
        <button
          type="button"
          onClick={handleBack}
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-subtle transition-colors hover:text-foreground"
          aria-label="Volver al listado de clientes"
        >
          <ArrowLeft size={16} />
          Volver a clientes
        </button>

        <PageHeader
          className="mb-6 animate-fade-in"
          title={
            <span className="inline-flex items-center gap-3">
              <ClientTypeFavicon tipo={client.tipo} size="md" />
              <span>{client.nombre}</span>
            </span>
          }
          subtitle={`${tipoMeta[client.tipo].label} · NIT ${client.nit}`}
          actions={
            editing ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setDraft(client)
                    setErrors({})
                    setEditing(false)
                  }}
                  className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
                >
                  Guardar cambios
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10"
                >
                  <Trash2 size={16} />
                  Eliminar
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
                >
                  <Pencil size={16} />
                  Editar
                </button>
              </>
            )
          }
        />

        <div className="mb-4 flex flex-wrap gap-2">
          <TableBadge tone={planToneMap[client.plan]}>{client.plan}</TableBadge>
          <TableBadge tone={estadoToneMap[client.estadoSuscripcion]}>
            {estadoLabelMap[client.estadoSuscripcion]}
          </TableBadge>
          <TableBadge tone="neutral">MRR {formatMrr(client.mrrMillones)}</TableBadge>
        </div>

        <Surface padding="lg" radius="xl" className="animate-fade-in">
          <ClientDetailsContent
            client={client}
            editing={editing}
            draft={draft}
            errors={errors}
            ciudadOptions={ciudadOptions}
            onDraftChange={setDraft}
          />
        </Surface>

        <ModalDrawer
          open={confirmDelete}
          onClose={() => setConfirmDelete(false)}
          title="Eliminar cliente"
          size="sm"
          footer={
            <ConfirmModalFooter
              onCancel={() => setConfirmDelete(false)}
              onConfirm={handleConfirmDelete}
              confirmLabel="Eliminar cliente"
              confirmIcon={<Trash2 size={16} />}
              confirmClassName="bg-red-600 hover:bg-red-700"
            />
          }
        >
          <ConfirmModalContent
            icon={<Trash2 size={36} strokeWidth={1.75} />}
            iconClassName="danger-icon-badge"
          >
            <p className="text-base leading-relaxed text-subtle">
              ¿Está seguro de que desea eliminar a{' '}
              <span className="font-semibold text-foreground">{client.nombre}</span>? Esta acción no se
              puede deshacer.
            </p>
          </ConfirmModalContent>
        </ModalDrawer>
      </div>
    </DashboardLayout>
  )
}
