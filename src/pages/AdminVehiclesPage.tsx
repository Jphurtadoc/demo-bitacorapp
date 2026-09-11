import { useMemo, useRef, useState, type ChangeEvent } from 'react';
import {
  Camera,
  CarFront,
  Download,
  ImageUp,
  Pencil,
  Plus,
  Trash2,
  UserCheck,
  UserX,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Drawer } from '@/components/UI/drawer';
import { ModalDrawer } from '@/components/UI/modal-drawer';
import { SearchableSelect } from '@/components/UI/searchable-select';
import { Surface } from '@/components/UI/surface';
import { EmphasisIcon } from '@/components/UI/emphasis';
import {
  DataTable,
  TableActions,
  TableBadge,
  TableRowActions,
  type TableBadgeTone,
  type TableColumn,
  type TableSortDirection,
} from '@/components/UI/table';
import mockVehiclesData from '@/data/mockVehicles.json';
import type { AdminVehicle } from '@/types/adminVehicle';
import {
  ConfirmModalContent,
  ConfirmModalFooter,
  PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  RegistryAvatarEditor,
  RegistryDetailField,
  RegistryFormField,
  getDefaultPhoto,
  inputClassName,
  inputErrorClassName,
  nextRecordId,
  type DrawerMode,
  type StatusFilter,
} from '@/pages/adminRegistryShared';

const TIPO_OPTIONS = ['Automóvil', 'Motocicleta', 'Camioneta', 'Van', 'Camión'] as const;

const tipoToneMap: Record<string, TableBadgeTone> = {
  Automóvil: 'info',
  Motocicleta: 'warning',
  Camioneta: 'primary',
  Van: 'neutral',
  Camión: 'success',
};

function createEmptyVehicle(clienteDefault = ''): AdminVehicle {
  return {
    id: '',
    photo: getDefaultPhoto('Nuevo Vehiculo'),
    placa: '',
    tipo: '',
    marca: '',
    modelo: '',
    color: '',
    cliente: clienteDefault,
    propietario: '',
    documento: '',
    ciudad: '',
    activo: true,
  };
}

function validateVehicleDraft(draft: AdminVehicle): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!draft.placa.trim()) errors.placa = 'Este campo es requerido';
  if (!draft.tipo.trim()) errors.tipo = 'Este campo es requerido';
  if (!draft.marca.trim()) errors.marca = 'Este campo es requerido';
  if (!draft.modelo.trim()) errors.modelo = 'Este campo es requerido';
  if (!draft.cliente.trim()) errors.cliente = 'Este campo es requerido';
  if (!draft.propietario.trim()) errors.propietario = 'Este campo es requerido';
  if (!draft.documento.trim()) errors.documento = 'Este campo es requerido';
  if (!draft.ciudad.trim()) errors.ciudad = 'Este campo es requerido';

  return errors;
}

function VehicleDetailsContent({
  vehicle,
  editing,
  draft,
  errors,
  clienteOptions,
  ciudadOptions,
  creating = false,
  onDraftChange,
  onPhotoClick,
}: {
  vehicle: AdminVehicle;
  editing: boolean;
  draft: AdminVehicle;
  errors: Record<string, string>;
  clienteOptions: string[];
  ciudadOptions: string[];
  creating?: boolean;
  onDraftChange: (draft: AdminVehicle) => void;
  onPhotoClick: () => void;
}) {
  const display = editing ? draft : vehicle;

  const updateDraft = (patch: Partial<AdminVehicle>) => {
    const next = { ...draft, ...patch };
    if (creating && patch.placa !== undefined) {
      next.photo = getDefaultPhoto(patch.placa.trim() || 'Nuevo Vehiculo');
    }
    onDraftChange(next);
  };

  return (
    <div className="space-y-5">
      <Surface variant="muted" padding="lg" className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <RegistryAvatarEditor
          photo={display.photo}
          alt={display.placa}
          editing={editing}
          onPhotoClick={onPhotoClick}
        />
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            {creating ? (
              <>
                <TableBadge tone="primary">Nuevo</TableBadge>
                <TableBadge tone="success">Activo</TableBadge>
              </>
            ) : (
              <>
                <TableBadge tone={tipoToneMap[display.tipo] ?? 'neutral'}>{display.tipo}</TableBadge>
                <TableBadge tone={display.activo ? 'success' : 'danger'}>
                  {display.activo ? 'Activo' : 'Inactivo'}
                </TableBadge>
              </>
            )}
          </div>
          <p className="mt-2 text-sm font-semibold text-foreground">
            {display.placa || (creating ? 'Vehículo sin placa' : display.placa)}
          </p>
          <p className="mt-1 text-sm text-subtle">
            {display.marca && display.modelo
              ? `${display.marca} ${display.modelo}`
              : creating
                ? 'Complete los datos del formulario'
                : display.marca}
          </p>
        </div>
      </Surface>

      {editing ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <RegistryFormField label="Placa" required error={errors.placa}>
            <input
              type="text"
              value={draft.placa}
              onChange={(event) => updateDraft({ placa: event.target.value.toUpperCase() })}
              className={errors.placa ? inputErrorClassName : inputClassName}
              placeholder="ABC-123"
            />
          </RegistryFormField>
          <RegistryFormField label="Tipo" required error={errors.tipo}>
            <SearchableSelect
              value={draft.tipo}
              options={TIPO_OPTIONS.map((tipo) => ({ label: tipo, value: tipo }))}
              placeholder="Seleccionar tipo"
              searchPlaceholder="Buscar tipo..."
              emptyOptionLabel="Seleccionar"
              onChange={(value) => updateDraft({ tipo: value })}
            />
          </RegistryFormField>
          <RegistryFormField label="Marca" required error={errors.marca}>
            <input
              type="text"
              value={draft.marca}
              onChange={(event) => updateDraft({ marca: event.target.value })}
              className={errors.marca ? inputErrorClassName : inputClassName}
            />
          </RegistryFormField>
          <RegistryFormField label="Modelo" required error={errors.modelo}>
            <input
              type="text"
              value={draft.modelo}
              onChange={(event) => updateDraft({ modelo: event.target.value })}
              className={errors.modelo ? inputErrorClassName : inputClassName}
            />
          </RegistryFormField>
          <RegistryFormField label="Color">
            <input
              type="text"
              value={draft.color}
              onChange={(event) => updateDraft({ color: event.target.value })}
              className={inputClassName}
            />
          </RegistryFormField>
          <RegistryFormField label="Cliente" required error={errors.cliente}>
            <SearchableSelect
              value={draft.cliente}
              options={clienteOptions.map((cliente) => ({ label: cliente, value: cliente }))}
              placeholder="Seleccionar cliente"
              searchPlaceholder="Buscar cliente..."
              emptyOptionLabel="Seleccionar"
              onChange={(value) => updateDraft({ cliente: value })}
            />
          </RegistryFormField>
          <RegistryFormField label="Propietario" required error={errors.propietario}>
            <input
              type="text"
              value={draft.propietario}
              onChange={(event) => updateDraft({ propietario: event.target.value })}
              className={errors.propietario ? inputErrorClassName : inputClassName}
            />
          </RegistryFormField>
          <RegistryFormField label="Documento" required error={errors.documento}>
            <input
              type="text"
              value={draft.documento}
              onChange={(event) => updateDraft({ documento: event.target.value })}
              className={errors.documento ? inputErrorClassName : inputClassName}
            />
          </RegistryFormField>
          <RegistryFormField label="Ciudad" required error={errors.ciudad} className="sm:col-span-2">
            <SearchableSelect
              value={draft.ciudad}
              options={ciudadOptions.map((ciudad) => ({ label: ciudad, value: ciudad }))}
              placeholder="Seleccionar ciudad"
              searchPlaceholder="Buscar ciudad..."
              emptyOptionLabel="Seleccionar"
              onChange={(value) => updateDraft({ ciudad: value })}
            />
          </RegistryFormField>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <RegistryDetailField label="Placa" value={vehicle.placa} />
          <RegistryDetailField label="Tipo" value={vehicle.tipo} />
          <RegistryDetailField label="Marca" value={vehicle.marca} />
          <RegistryDetailField label="Modelo" value={vehicle.modelo} />
          <RegistryDetailField label="Color" value={vehicle.color} />
          <RegistryDetailField label="Cliente" value={vehicle.cliente} />
          <RegistryDetailField label="Propietario" value={vehicle.propietario} />
          <RegistryDetailField label="Documento" value={vehicle.documento} />
          <RegistryDetailField label="Ciudad" value={vehicle.ciudad} />
        </div>
      )}
    </div>
  );
}

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<AdminVehicle[]>(mockVehiclesData as AdminVehicle[]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<string | null>('placa');
  const [sortDirection, setSortDirection] = useState<TableSortDirection>('asc');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');
  const [clienteFilter, setClienteFilter] = useState('');
  const [ciudadFilter, setCiudadFilter] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<AdminVehicle | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('detail');
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<AdminVehicle | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [photoModalVehicle, setPhotoModalVehicle] = useState<AdminVehicle | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoRemoved, setPhotoRemoved] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [confirmDeleteVehicle, setConfirmDeleteVehicle] = useState<AdminVehicle | null>(null);

  const clienteOptions = useMemo(
    () => [...new Set(vehicles.map((vehicle) => vehicle.cliente))].sort(),
    [vehicles],
  );
  const ciudadOptions = useMemo(
    () => [...new Set(vehicles.map((vehicle) => vehicle.ciudad))].sort(),
    [vehicles],
  );
  const stats = useMemo(
    () => ({
      total: vehicles.length,
      activos: vehicles.filter((vehicle) => vehicle.activo).length,
      inactivos: vehicles.filter((vehicle) => !vehicle.activo).length,
    }),
    [vehicles],
  );

  const filteredVehicles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return vehicles.filter((vehicle) => {
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && vehicle.activo) ||
        (statusFilter === 'inactive' && !vehicle.activo);
      const matchesSearch =
        !query ||
        vehicle.placa.toLowerCase().includes(query) ||
        vehicle.propietario.toLowerCase().includes(query) ||
        vehicle.documento.includes(search.trim()) ||
        vehicle.marca.toLowerCase().includes(query);

      return (
        matchesStatus &&
        matchesSearch &&
        (!tipoFilter || vehicle.tipo === tipoFilter) &&
        (!clienteFilter || vehicle.cliente === clienteFilter) &&
        (!ciudadFilter || vehicle.ciudad === ciudadFilter)
      );
    });
  }, [ciudadFilter, clienteFilter, search, statusFilter, tipoFilter, vehicles]);

  const sortedVehicles = useMemo(() => {
    if (!sortKey || !sortDirection) return filteredVehicles;

    return [...filteredVehicles].sort((a, b) => {
      const aValue = a[sortKey as keyof AdminVehicle];
      const bValue = b[sortKey as keyof AdminVehicle];

      if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        return sortDirection === 'asc'
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      }

      const left = String(aValue).toLowerCase();
      const right = String(bValue).toLowerCase();
      if (left < right) return sortDirection === 'asc' ? -1 : 1;
      if (left > right) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredVehicles, sortDirection, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sortedVehicles.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedVehicles.slice(start, start + pageSize);
  }, [currentPage, pageSize, sortedVehicles]);

  const resetPage = () => setPage(1);

  const openVehicleDrawer = (vehicle: AdminVehicle) => {
    setDrawerMode('detail');
    setSelectedVehicle(vehicle);
    setIsEditing(false);
    setDraft(null);
    setFormErrors({});
    setDrawerOpen(true);
  };

  const openCreateDrawer = () => {
    setDrawerMode('create');
    setSelectedVehicle(null);
    setIsEditing(true);
    setDraft(createEmptyVehicle(clienteOptions[0] ?? ''));
    setFormErrors({});
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setDrawerMode('detail');
    setSelectedVehicle(null);
    setIsEditing(false);
    setDraft(null);
    setFormErrors({});
    setPhotoModalOpen(false);
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoRemoved(false);
    setPhotoModalVehicle(null);
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const startEditing = () => {
    if (!selectedVehicle) return;
    setDraft({ ...selectedVehicle });
    setFormErrors({});
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setDraft(null);
    setFormErrors({});
  };

  const saveEditing = () => {
    if (!draft || !selectedVehicle) return;
    const errors = validateVehicleDraft(draft);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setVehicles((current) => current.map((vehicle) => (vehicle.id === draft.id ? draft : vehicle)));
    setSelectedVehicle(draft);
    setIsEditing(false);
    setDraft(null);
    setFormErrors({});
  };

  const saveCreate = () => {
    if (!draft || drawerMode !== 'create') return;
    const errors = validateVehicleDraft(draft);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const newVehicle: AdminVehicle = {
      ...draft,
      id: nextRecordId(vehicles.map((vehicle) => vehicle.id)),
      photo: draft.photo || getDefaultPhoto(draft.placa),
    };

    setVehicles((current) => [newVehicle, ...current]);
    closeDrawer();
    openVehicleDrawer(newVehicle);
  };

  const openPhotoModalForVehicle = (vehicle: AdminVehicle) => {
    setPhotoModalVehicle(vehicle);
    setPhotoFile(null);
    setPhotoRemoved(false);
    setPhotoPreview(vehicle.photo);
    setPhotoModalOpen(true);
  };

  const closePhotoModal = () => {
    setPhotoModalOpen(false);
    setPhotoModalVehicle(null);
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoRemoved(false);
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const handlePhotoFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    setPhotoFile(file);
    setPhotoRemoved(false);
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(typeof reader.result === 'string' ? reader.result : null);
    };
    reader.readAsDataURL(file);
  };

  const confirmPhotoUpload = () => {
    const target = photoModalVehicle ?? draft;
    if (!target) return;

    let newPhoto = target.photo;
    if (photoRemoved) {
      newPhoto = getDefaultPhoto(target.placa || 'Vehiculo');
    } else if (photoPreview) {
      newPhoto = photoPreview;
    } else {
      return;
    }

    const updated = { ...target, photo: newPhoto };
    if (isEditing && draft?.id === updated.id) {
      setDraft(updated);
    } else {
      setVehicles((current) => current.map((vehicle) => (vehicle.id === updated.id ? updated : vehicle)));
      if (selectedVehicle?.id === updated.id) setSelectedVehicle(updated);
    }
    closePhotoModal();
  };

  const confirmDelete = () => {
    if (!confirmDeleteVehicle) return;
    setVehicles((current) => current.filter((vehicle) => vehicle.id !== confirmDeleteVehicle.id));
    if (selectedVehicle?.id === confirmDeleteVehicle.id) closeDrawer();
    setConfirmDeleteVehicle(null);
  };

  const columns: TableColumn<AdminVehicle>[] = [
    {
      key: 'photo',
      label: 'Foto',
      width: '72px',
      render: (vehicle) => (
        <img
          src={vehicle.photo}
          alt={vehicle.placa}
          className="h-9 w-9 rounded-full border border-border object-cover"
        />
      ),
    },
    { key: 'placa', label: 'Placa', sortable: true, width: '110px' },
    {
      key: 'tipo',
      label: 'Tipo',
      sortable: true,
      width: '130px',
      render: (vehicle) => (
        <TableBadge tone={tipoToneMap[vehicle.tipo] ?? 'neutral'}>{vehicle.tipo}</TableBadge>
      ),
    },
    { key: 'marca', label: 'Marca', sortable: true, width: '120px' },
    { key: 'modelo', label: 'Modelo', sortable: true, width: '140px' },
    { key: 'color', label: 'Color', sortable: true, width: '110px' },
    { key: 'cliente', label: 'Cliente', sortable: true, width: '150px' },
    { key: 'propietario', label: 'Propietario', sortable: true, width: '160px' },
    { key: 'documento', label: 'Documento', sortable: true, width: '120px' },
    { key: 'ciudad', label: 'Ciudad', sortable: true, width: '120px' },
    {
      key: 'activo',
      label: 'Estado',
      sortable: true,
      width: '100px',
      render: (vehicle) => (
        <TableBadge tone={vehicle.activo ? 'success' : 'danger'}>
          {vehicle.activo ? 'Activo' : 'Inactivo'}
        </TableBadge>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      width: '160px',
      align: 'right',
      render: (vehicle) => (
        <TableRowActions
          items={[
            {
              label: 'Editar',
              icon: Pencil,
              tooltip: 'Editar vehículo',
              onClick: () => openVehicleDrawer(vehicle),
            },
            {
              label: 'Eliminar',
              icon: Trash2,
              tooltip: 'Eliminar vehículo',
              variant: 'danger',
              onClick: () => setConfirmDeleteVehicle(vehicle),
            },
            {
              label: 'Actualizar foto',
              icon: Camera,
              tooltip: 'Actualizar foto',
              onClick: () => openPhotoModalForVehicle(vehicle),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="page-shell pb-6">
        <DataTable
          title="Vehículos"
          subtitle="Registro de vehículos autorizados por cliente y propietario."
          columns={columns}
          data={paginatedVehicles}
          onRowClick={openVehicleDrawer}
          tabs={[
            { id: 'all', label: 'Todos', count: stats.total, badgeTone: 'neutral' },
            { id: 'active', label: 'Activos', count: stats.activos, badgeTone: 'success' },
            { id: 'inactive', label: 'Inactivos', count: stats.inactivos, badgeTone: 'danger' },
          ]}
          activeTab={statusFilter}
          onTabChange={(tabId) => {
            setStatusFilter(tabId as StatusFilter);
            resetPage();
          }}
          headerSlot={
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Total', value: stats.total, icon: <CarFront size={15} />, tone: 'brand' as const },
                { label: 'Activos', value: stats.activos, icon: <UserCheck size={15} />, tone: 'success' as const },
                { label: 'Inactivos', value: stats.inactivos, icon: <UserX size={15} />, tone: 'danger' as const },
              ].map((stat) => (
                <Surface key={stat.label} padding="sm" radius="lg" interactive className="flex items-center gap-3">
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
          searchPlaceholder="Buscar por placa, propietario, documento o marca..."
          onSearchChange={(value) => {
            setSearch(value);
            resetPage();
          }}
          filters={[
            {
              id: 'tipo',
              label: 'Tipo',
              type: 'select',
              value: tipoFilter,
              options: TIPO_OPTIONS.map((tipo) => ({ label: tipo, value: tipo })),
              onChange: (value) => {
                setTipoFilter(value);
                resetPage();
              },
            },
            {
              id: 'cliente',
              label: 'Cliente',
              type: 'select',
              value: clienteFilter,
              options: clienteOptions.map((cliente) => ({ label: cliente, value: cliente })),
              onChange: (value) => {
                setClienteFilter(value);
                resetPage();
              },
            },
            {
              id: 'ciudad',
              label: 'Ciudad',
              type: 'select',
              value: ciudadFilter,
              options: ciudadOptions.map((ciudad) => ({ label: ciudad, value: ciudad })),
              onChange: (value) => {
                setCiudadFilter(value);
                resetPage();
              },
            },
          ]}
          metaLabel={`Mostrando ${sortedVehicles.length} de ${vehicles.length} vehículos`}
          selectable
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSortChange={(key, direction) => {
            setSortKey(direction ? key : null);
            setSortDirection(direction);
          }}
          actionItems={[
            {
              label: 'Exportar',
              icon: Download,
              tooltip: 'Exportar listado de vehículos',
              onClick: () => undefined,
            },
            {
              label: 'Nuevo vehículo',
              icon: Plus,
              tooltip: 'Registrar un nuevo vehículo',
              variant: 'primary',
              showLabel: true,
              onClick: openCreateDrawer,
            },
          ]}
          pagination={{
            page: currentPage,
            pageSize,
            total: sortedVehicles.length,
            onPageChange: setPage,
            pageSizeOptions: [...PAGE_SIZE_OPTIONS],
            onPageSizeChange: (size: number) => {
              setPageSize(size);
              setPage(1);
            },
          }}
          emptyMessage="No se encontraron vehículos con los filtros aplicados."
        />

        <Drawer
          open={drawerOpen}
          onClose={closeDrawer}
          title={drawerMode === 'create' ? 'Nuevo vehículo' : 'Detalles de vehículo'}
          subtitle={
            drawerMode === 'create'
              ? 'Complete la información para registrar un nuevo vehículo.'
              : undefined
          }
          size="lg"
          footer={
            drawerMode === 'create' ? (
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
                    Crear vehículo
                  </button>
                </div>
              </div>
            ) : selectedVehicle ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                {isEditing ? (
                  <>
                    <p className="text-sm font-medium text-subtle">Editando información del vehículo</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={saveEditing}
                        className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
                      >
                        Guardar cambios
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <TableActions
                      items={[
                        { label: 'Editar', icon: Pencil, tooltip: 'Editar vehículo', onClick: startEditing },
                        {
                          label: 'Eliminar',
                          icon: Trash2,
                          tooltip: 'Eliminar vehículo',
                          variant: 'danger',
                          onClick: () => setConfirmDeleteVehicle(selectedVehicle),
                        },
                      ]}
                    />
                    <button
                      type="button"
                      onClick={closeDrawer}
                      className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
                    >
                      Cerrar
                    </button>
                  </>
                )}
              </div>
            ) : null
          }
        >
          {drawerMode === 'create' && draft ? (
            <VehicleDetailsContent
              vehicle={draft}
              editing
              creating
              draft={draft}
              errors={formErrors}
              clienteOptions={clienteOptions}
              ciudadOptions={ciudadOptions}
              onDraftChange={setDraft}
              onPhotoClick={() => openPhotoModalForVehicle(draft)}
            />
          ) : selectedVehicle ? (
            <VehicleDetailsContent
              vehicle={selectedVehicle}
              editing={isEditing}
              draft={draft ?? selectedVehicle}
              errors={formErrors}
              clienteOptions={clienteOptions}
              ciudadOptions={ciudadOptions}
              onDraftChange={setDraft}
              onPhotoClick={() => openPhotoModalForVehicle(draft ?? selectedVehicle)}
            />
          ) : null}
        </Drawer>

        <ModalDrawer
          open={Boolean(confirmDeleteVehicle)}
          onClose={() => setConfirmDeleteVehicle(null)}
          showCloseButton={false}
          size="sm"
          footer={
            <ConfirmModalFooter
              onCancel={() => setConfirmDeleteVehicle(null)}
              onConfirm={confirmDelete}
              confirmLabel="Eliminar"
              confirmIcon={<Trash2 size={18} />}
              confirmClassName="danger-confirm-btn"
            />
          }
        >
          {confirmDeleteVehicle ? (
            <ConfirmModalContent
              icon={<Trash2 size={36} strokeWidth={1.75} />}
              iconClassName="danger-icon-badge"
            >
              <p className="text-base leading-relaxed text-subtle">
                ¿Está seguro de que desea eliminar el vehículo{' '}
                <span className="font-semibold text-foreground">{confirmDeleteVehicle.placa}</span>? Esta
                acción no se puede deshacer.
              </p>
            </ConfirmModalContent>
          ) : null}
        </ModalDrawer>

        <ModalDrawer
          open={photoModalOpen}
          onClose={closePhotoModal}
          showCloseButton={false}
          size="sm"
          footer={
            <ConfirmModalFooter
              onCancel={closePhotoModal}
              onConfirm={confirmPhotoUpload}
              confirmLabel={photoRemoved ? 'Eliminar imagen' : 'Cargar imagen'}
              confirmIcon={photoRemoved ? <Trash2 size={18} /> : <ImageUp size={18} />}
              confirmClassName={photoRemoved ? 'danger-confirm-btn' : 'bg-brand hover:bg-brand-hover'}
              confirmDisabled={!photoFile && !photoRemoved}
            />
          }
        >
          <div className="flex flex-col items-center px-2 py-2 text-center">
            <p className="max-w-md text-base leading-relaxed text-subtle">
              Seleccione una imagen para actualizar la foto del vehículo.
            </p>
            <div className="relative mt-6 w-fit">
              <div className="rounded-full border-2 border-dashed border-border p-1.5">
                {photoPreview && !photoRemoved ? (
                  <img
                    src={photoPreview}
                    alt="Vista previa"
                    className="h-24 w-24 rounded-full border border-border object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border border-border bg-muted">
                    <Camera size={28} className="text-subtle" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                title="Cambiar foto"
                className="absolute bottom-2 right-0 flex h-9 w-9 translate-x-3 -translate-y-2 items-center justify-center rounded-full border-2 border-white bg-brand text-white shadow-md transition-colors hover:bg-brand-hover"
              >
                <Camera size={16} />
              </button>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handlePhotoFileChange}
                className="hidden"
              />
            </div>
            {photoFile ? (
              <p className="mt-3 max-w-xs truncate text-xs text-subtle">{photoFile.name}</p>
            ) : (
              <p className="mt-3 text-xs text-subtle">PNG, JPG o WEBP</p>
            )}
            {photoPreview && !photoRemoved ? (
              <button
                type="button"
                onClick={() => {
                  setPhotoFile(null);
                  setPhotoPreview(null);
                  setPhotoRemoved(true);
                  if (photoInputRef.current) photoInputRef.current.value = '';
                }}
                className="danger-outline-btn mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"
              >
                <Trash2 size={16} />
                Eliminar imagen
              </button>
            ) : null}
          </div>
        </ModalDrawer>
      </div>
    </DashboardLayout>
  );
}
