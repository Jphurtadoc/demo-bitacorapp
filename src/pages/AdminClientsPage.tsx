import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  Building2,
  Download,
  Pencil,
  Plus,
  Trash2,
  TrendingUp,
  UserCheck,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '@/components/layout/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import { Drawer } from '@/components/UI/drawer'
import { ModalDrawer } from '@/components/UI/modal-drawer'
import { Surface } from '@/components/UI/surface'
import { EmphasisIcon } from '@/components/UI/emphasis'
import {
  DataTable,
  TableBadge,
  TableRowActions,
  type TableBadgeTone,
  type TableColumn,
  type TableSortDirection,
} from '@/components/UI/table'
import {
  deleteAdminClient,
  getAdminClients,
  setAdminClients,
  upsertAdminClient,
} from '@/data/adminClientsStore'
import type { AdminClient } from '@/types/adminClient'
import {
  ClientDetailsContent,
  ClientTypeFavicon,
  ESTADO_OPTIONS,
  PLAN_OPTIONS,
  TIPO_OPTIONS,
  createEmptyClient,
  estadoLabelMap,
  formatMrr,
  isCreatedThisMonth,
  tipoMeta,
  validateClientDraft,
} from '@/pages/adminClientShared'
import {
  ConfirmModalContent,
  ConfirmModalFooter,
  PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  nextRecordId,
  type StatusFilter,
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

/**
 * Root/admin clients registry with KPIs and full-width DataTable.
 */
export default function AdminClientsPage() {
  const navigate = useNavigate()
  const [clients, setClients] = useState<AdminClient[]>(() => getAdminClients())
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [sortKey, setSortKey] = useState<string | null>('nombre')
  const [sortDirection, setSortDirection] = useState<TableSortDirection>('asc')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('')
  const [estadoFilter, setEstadoFilter] = useState('')
  const [tipoFilter, setTipoFilter] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [draft, setDraft] = useState<AdminClient>(createEmptyClient())
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [confirmDeleteClient, setConfirmDeleteClient] = useState<AdminClient | null>(null)

  const persistClients = (next: AdminClient[]) => {
    setAdminClients(next)
    setClients(next)
  }

  const ciudadOptions = useMemo(() => {
    const fromData = clients.map((client) => client.ciudad).filter(Boolean)
    return [
      ...new Set([
        ...fromData,
        'Bogotá',
        'Medellín',
        'Cali',
        'Barranquilla',
        'Cartagena',
        'Pereira',
        'Bucaramanga',
      ]),
    ].sort()
  }, [clients])

  const stats = useMemo(() => {
    const activos = clients.filter((client) => client.estadoSuscripcion === 'activo').length
    const enMora = clients.filter((client) => client.estadoSuscripcion === 'mora').length
    const nuevosMes = clients.filter((client) => isCreatedThisMonth(client.creadoEn)).length
    const mrrTotal = clients
      .filter((client) => client.estadoSuscripcion !== 'inactivo')
      .reduce((sum, client) => sum + client.mrrMillones, 0)
    return {
      total: clients.length,
      activos,
      enMora,
      nuevosMes,
      mrrTotal,
      inactivos: clients.filter((client) => !client.activo).length,
    }
  }, [clients])

  const filteredClients = useMemo(() => {
    const query = search.trim().toLowerCase()
    return clients.filter((client) => {
      if (statusFilter === 'active' && !client.activo) return false
      if (statusFilter === 'inactive' && client.activo) return false
      if (planFilter && client.plan !== planFilter) return false
      if (estadoFilter && client.estadoSuscripcion !== estadoFilter) return false
      if (tipoFilter && client.tipo !== tipoFilter) return false
      if (!query) return true
      return [
        client.nombre,
        client.nit,
        client.ciudad,
        client.contacto,
        client.email,
        client.plan,
        tipoMeta[client.tipo].label,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query)
    })
  }, [clients, search, statusFilter, planFilter, estadoFilter, tipoFilter])

  const sortedClients = useMemo(() => {
    if (!sortKey || !sortDirection) return filteredClients
    const direction = sortDirection === 'asc' ? 1 : -1
    return [...filteredClients].sort((left, right) => {
      const leftValue = left[sortKey as keyof AdminClient]
      const rightValue = right[sortKey as keyof AdminClient]
      if (typeof leftValue === 'number' && typeof rightValue === 'number') {
        return (leftValue - rightValue) * direction
      }
      return String(leftValue ?? '').localeCompare(String(rightValue ?? ''), 'es') * direction
    })
  }, [filteredClients, sortKey, sortDirection])

  const currentPage = Math.min(page, Math.max(1, Math.ceil(sortedClients.length / pageSize) || 1))
  const paginatedClients = sortedClients.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const resetPage = () => setPage(1)

  const openClientPage = (client: AdminClient, edit = false) => {
    navigate(`/admin/clients/${client.id}`, edit ? { state: { edit: true } } : undefined)
  }

  const openCreateDrawer = () => {
    setDraft(createEmptyClient())
    setErrors({})
    setDrawerOpen(true)
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
    setErrors({})
  }

  const saveCreate = () => {
    const nextErrors = validateClientDraft(draft)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    const created: AdminClient = {
      ...draft,
      id: nextRecordId(clients.map((client) => client.id)),
      activo: draft.estadoSuscripcion !== 'inactivo',
      creadoEn: new Date().toISOString().slice(0, 10),
    }
    upsertAdminClient(created)
    persistClients(getAdminClients())
    closeDrawer()
    navigate(`/admin/clients/${created.id}`)
  }

  const handleConfirmDelete = () => {
    if (!confirmDeleteClient) return
    deleteAdminClient(confirmDeleteClient.id)
    persistClients(getAdminClients())
    setSelectedIds((prev) => prev.filter((id) => id !== confirmDeleteClient.id))
    setConfirmDeleteClient(null)
  }

  const columns: TableColumn<AdminClient>[] = [
    {
      key: 'nombre',
      label: 'Cliente',
      sortable: true,
      render: (client) => (
        <div className="flex min-w-0 items-center gap-3">
          <ClientTypeFavicon tipo={client.tipo} />
          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground">{client.nombre}</p>
            <p className="truncate text-xs text-subtle">
              {tipoMeta[client.tipo].label} · {client.email}
            </p>
          </div>
        </div>
      ),
    },
    { key: 'nit', label: 'NIT', sortable: true, width: '130px' },
    { key: 'ciudad', label: 'Ciudad', sortable: true, width: '120px' },
    { key: 'contacto', label: 'Contacto', sortable: true, width: '150px' },
    {
      key: 'plan',
      label: 'Plan',
      sortable: true,
      width: '120px',
      render: (client) => <TableBadge tone={planToneMap[client.plan]}>{client.plan}</TableBadge>,
    },
    {
      key: 'estadoSuscripcion',
      label: 'Suscripción',
      sortable: true,
      width: '120px',
      render: (client) => (
        <TableBadge tone={estadoToneMap[client.estadoSuscripcion]}>
          {estadoLabelMap[client.estadoSuscripcion]}
        </TableBadge>
      ),
    },
    {
      key: 'mrrMillones',
      label: 'MRR',
      sortable: true,
      width: '100px',
      render: (client) => formatMrr(client.mrrMillones),
    },
    {
      key: 'actions',
      label: 'Acciones',
      width: '120px',
      align: 'right',
      render: (client) => (
        <TableRowActions
          items={[
            {
              label: 'Editar',
              icon: Pencil,
              tooltip: 'Editar cliente',
              onClick: () => openClientPage(client, true),
            },
            {
              label: 'Eliminar',
              icon: Trash2,
              tooltip: 'Eliminar cliente',
              variant: 'danger',
              onClick: () => setConfirmDeleteClient(client),
            },
          ]}
        />
      ),
    },
  ]

  return (
    <DashboardLayout>
      <div className="page-shell pb-6">
        <PageHeader
          className="mb-6 animate-fade-in"
          title="Clientes"
          subtitle="Administración de clientes de plataforma: altas, planes y estado de suscripción."
          actions={
            <>
              <button
                type="button"
                onClick={() => undefined}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                aria-label="Exportar listado de clientes"
              >
                <Download size={16} />
                Exportar
              </button>
              <button
                type="button"
                onClick={openCreateDrawer}
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
                aria-label="Crear nuevo cliente"
              >
                <Plus size={16} />
                Nuevo cliente
              </button>
            </>
          }
        />

        <DataTable
          columns={columns}
          data={paginatedClients}
          onRowClick={(client) => openClientPage(client)}
          tabs={[
            { id: 'all', label: 'Todos', count: stats.total, badgeTone: 'neutral' },
            { id: 'active', label: 'Activos', count: stats.activos, badgeTone: 'success' },
            { id: 'inactive', label: 'Inactivos', count: stats.inactivos, badgeTone: 'danger' },
          ]}
          activeTab={statusFilter}
          onTabChange={(tabId) => {
            setStatusFilter(tabId as StatusFilter)
            resetPage()
          }}
          headerSlot={
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                {
                  label: 'Activos',
                  value: String(stats.activos),
                  icon: <UserCheck size={15} />,
                  tone: 'success' as const,
                },
                {
                  label: 'Nuevos mes',
                  value: String(stats.nuevosMes),
                  icon: <TrendingUp size={15} />,
                  tone: 'info' as const,
                },
                {
                  label: 'En mora',
                  value: String(stats.enMora),
                  icon: <AlertTriangle size={15} />,
                  tone: 'warning' as const,
                },
                {
                  label: 'MRR',
                  value: formatMrr(stats.mrrTotal),
                  icon: <Building2 size={15} />,
                  tone: 'brand' as const,
                },
              ].map((stat) => (
                <Surface
                  key={stat.label}
                  padding="sm"
                  radius="lg"
                  interactive
                  className="flex items-center gap-3"
                >
                  <EmphasisIcon tone={stat.tone} size="sm">
                    {stat.icon}
                  </EmphasisIcon>
                  <div className="min-w-0">
                    <p className="text-lg font-bold leading-none text-foreground">{stat.value}</p>
                    <p className="mt-1 text-[11px] font-medium text-subtle">{stat.label}</p>
                  </div>
                </Surface>
              ))}
            </div>
          }
          searchValue={search}
          searchPlaceholder="Buscar por nombre, NIT, ciudad o contacto..."
          onSearchChange={(value) => {
            setSearch(value)
            resetPage()
          }}
          filters={[
            {
              id: 'tipo',
              label: 'Tipo',
              type: 'select',
              value: tipoFilter,
              options: TIPO_OPTIONS.map((tipo) => ({
                label: tipoMeta[tipo].label,
                value: tipo,
              })),
              onChange: (value) => {
                setTipoFilter(value)
                resetPage()
              },
            },
            {
              id: 'plan',
              label: 'Plan',
              type: 'select',
              value: planFilter,
              options: PLAN_OPTIONS.map((plan) => ({ label: plan, value: plan })),
              onChange: (value) => {
                setPlanFilter(value)
                resetPage()
              },
            },
            {
              id: 'estado',
              label: 'Suscripción',
              type: 'select',
              value: estadoFilter,
              options: ESTADO_OPTIONS.map((estado) => ({
                label: estadoLabelMap[estado],
                value: estado,
              })),
              onChange: (value) => {
                setEstadoFilter(value)
                resetPage()
              },
            },
          ]}
          selectable
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSortChange={(key, direction) => {
            setSortKey(direction ? key : null)
            setSortDirection(direction)
          }}
          pagination={{
            page: currentPage,
            pageSize,
            total: sortedClients.length,
            onPageChange: setPage,
            pageSizeOptions: [...PAGE_SIZE_OPTIONS],
            onPageSizeChange: (size: number) => {
              setPageSize(size)
              setPage(1)
            },
          }}
          emptyMessage="No se encontraron clientes con los filtros aplicados."
        />

        <Drawer
          open={drawerOpen}
          onClose={closeDrawer}
          title="Nuevo cliente"
          subtitle="Registre un tenant de plataforma con plan y suscripción."
          size="lg"
          footer={
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-subtle">Los campos marcados con * son obligatorios</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={saveCreate}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
                >
                  <Plus size={16} />
                  Crear cliente
                </button>
              </div>
            </div>
          }
        >
          <ClientDetailsContent
            client={draft}
            editing
            draft={draft}
            errors={errors}
            ciudadOptions={ciudadOptions}
            creating
            onDraftChange={setDraft}
          />
        </Drawer>

        <ModalDrawer
          open={Boolean(confirmDeleteClient)}
          onClose={() => setConfirmDeleteClient(null)}
          title="Eliminar cliente"
          size="sm"
          footer={
            <ConfirmModalFooter
              onCancel={() => setConfirmDeleteClient(null)}
              onConfirm={handleConfirmDelete}
              confirmLabel="Eliminar cliente"
              confirmIcon={<Trash2 size={16} />}
              confirmClassName="bg-red-600 hover:bg-red-700"
            />
          }
        >
          {confirmDeleteClient ? (
            <ConfirmModalContent
              icon={<Trash2 size={36} strokeWidth={1.75} />}
              iconClassName="danger-icon-badge"
            >
              <p className="text-base leading-relaxed text-subtle">
                ¿Está seguro de que desea eliminar a{' '}
                <span className="font-semibold text-foreground">{confirmDeleteClient.nombre}</span>? Esta
                acción no se puede deshacer.
              </p>
            </ConfirmModalContent>
          ) : null}
        </ModalDrawer>
      </div>
    </DashboardLayout>
  )
}
