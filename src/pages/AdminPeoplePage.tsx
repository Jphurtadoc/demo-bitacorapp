import { useMemo, useRef, useState, type ChangeEvent } from 'react';
import {
  Camera,
  Download,
  ImageUp,
  Pencil,
  Plus,
  Trash2,
  UserCheck,
  UserRound,
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
import mockPeopleData from '@/data/mockPeople.json';
import type { AdminPerson } from '@/types/adminPerson';
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

const TIPO_UNIDAD_OPTIONS = ['Unidad residencial', 'Empresa'] as const;
const ROL_RESIDENCIAL_OPTIONS = ['Propietario', 'Arrendatario', 'Familiar', 'Autorizado'] as const;
const ROL_EMPRESA_OPTIONS = ['Empleado', 'Contratista', 'Directivo', 'Visitante autorizado'] as const;

const tipoUnidadToneMap: Record<string, TableBadgeTone> = {
  'Unidad residencial': 'info',
  Empresa: 'primary',
};

const rolToneMap: Record<string, TableBadgeTone> = {
  Propietario: 'success',
  Arrendatario: 'info',
  Familiar: 'neutral',
  Autorizado: 'warning',
  Empleado: 'primary',
  Contratista: 'warning',
  Directivo: 'danger',
  'Visitante autorizado': 'neutral',
};

function rolOptionsFor(tipoUnidad: string): readonly string[] {
  return tipoUnidad === 'Empresa' ? ROL_EMPRESA_OPTIONS : ROL_RESIDENCIAL_OPTIONS;
}

function createEmptyPerson(clienteDefault = ''): AdminPerson {
  return {
    id: '',
    photo: getDefaultPhoto('Nueva Persona'),
    nombre: '',
    documento: '',
    tipoUnidad: 'Unidad residencial',
    cliente: clienteDefault,
    unidad: '',
    rol: '',
    telefono: '',
    email: '',
    ciudad: '',
    activo: true,
  };
}

function validatePersonDraft(draft: AdminPerson): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!draft.nombre.trim()) errors.nombre = 'Este campo es requerido';
  if (!draft.documento.trim()) errors.documento = 'Este campo es requerido';
  if (!draft.tipoUnidad.trim()) errors.tipoUnidad = 'Este campo es requerido';
  if (!draft.cliente.trim()) errors.cliente = 'Este campo es requerido';
  if (!draft.unidad.trim()) errors.unidad = 'Este campo es requerido';
  if (!draft.rol.trim()) errors.rol = 'Este campo es requerido';
  if (!draft.ciudad.trim()) errors.ciudad = 'Este campo es requerido';

  return errors;
}

function PersonDetailsContent({
  person,
  editing,
  draft,
  errors,
  clienteOptions,
  ciudadOptions,
  creating = false,
  onDraftChange,
  onPhotoClick,
}: {
  person: AdminPerson;
  editing: boolean;
  draft: AdminPerson;
  errors: Record<string, string>;
  clienteOptions: string[];
  ciudadOptions: string[];
  creating?: boolean;
  onDraftChange: (draft: AdminPerson) => void;
  onPhotoClick: () => void;
}) {
  const display = editing ? draft : person;
  const unidadLabel = display.tipoUnidad === 'Empresa' ? 'Sede / área' : 'Unidad / inmueble';
  const clienteLabel = display.tipoUnidad === 'Empresa' ? 'Empresa' : 'Unidad residencial';

  const updateDraft = (patch: Partial<AdminPerson>) => {
    const next = { ...draft, ...patch };
    if (creating && patch.nombre !== undefined) {
      next.photo = getDefaultPhoto(patch.nombre.trim() || 'Nueva Persona');
    }
    if (patch.tipoUnidad && patch.tipoUnidad !== draft.tipoUnidad) {
      const allowed = rolOptionsFor(patch.tipoUnidad);
      if (!allowed.includes(next.rol)) {
        next.rol = '';
      }
    }
    onDraftChange(next);
  };

  return (
    <div className="space-y-5">
      <Surface variant="muted" padding="lg" className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <RegistryAvatarEditor
          photo={display.photo}
          alt={display.nombre}
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
                <TableBadge tone={tipoUnidadToneMap[display.tipoUnidad] ?? 'neutral'}>
                  {display.tipoUnidad}
                </TableBadge>
                <TableBadge tone={rolToneMap[display.rol] ?? 'neutral'}>{display.rol}</TableBadge>
                <TableBadge tone={display.activo ? 'success' : 'danger'}>
                  {display.activo ? 'Activo' : 'Inactivo'}
                </TableBadge>
              </>
            )}
          </div>
          <p className="mt-2 text-sm font-semibold text-foreground">
            {display.nombre || (creating ? 'Persona sin nombre' : display.nombre)}
          </p>
          <p className="mt-1 text-sm text-subtle">
            {display.cliente && display.unidad
              ? `${display.cliente} · ${display.unidad}`
              : creating
                ? 'Complete los datos del formulario'
                : display.cliente}
          </p>
        </div>
      </Surface>

      {editing ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <RegistryFormField label="Nombre completo" required error={errors.nombre}>
            <input
              type="text"
              value={draft.nombre}
              onChange={(event) => updateDraft({ nombre: event.target.value })}
              className={errors.nombre ? inputErrorClassName : inputClassName}
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
          <RegistryFormField label="Tipo de sitio" required error={errors.tipoUnidad}>
            <SearchableSelect
              value={draft.tipoUnidad}
              options={TIPO_UNIDAD_OPTIONS.map((tipo) => ({ label: tipo, value: tipo }))}
              placeholder="Seleccionar tipo"
              searchPlaceholder="Buscar tipo..."
              emptyOptionLabel="Seleccionar"
              onChange={(value) =>
                updateDraft({ tipoUnidad: value as AdminPerson['tipoUnidad'] })
              }
            />
          </RegistryFormField>
          <RegistryFormField label="Rol" required error={errors.rol}>
            <SearchableSelect
              value={draft.rol}
              options={rolOptionsFor(draft.tipoUnidad).map((rol) => ({ label: rol, value: rol }))}
              placeholder="Seleccionar rol"
              searchPlaceholder="Buscar rol..."
              emptyOptionLabel="Seleccionar"
              onChange={(value) => updateDraft({ rol: value })}
            />
          </RegistryFormField>
          <RegistryFormField label={clienteLabel} required error={errors.cliente}>
            <SearchableSelect
              value={draft.cliente}
              options={clienteOptions.map((cliente) => ({ label: cliente, value: cliente }))}
              placeholder={`Seleccionar ${clienteLabel.toLowerCase()}`}
              searchPlaceholder="Buscar..."
              emptyOptionLabel="Seleccionar"
              onChange={(value) => updateDraft({ cliente: value })}
            />
          </RegistryFormField>
          <RegistryFormField label={unidadLabel} required error={errors.unidad}>
            <input
              type="text"
              value={draft.unidad}
              onChange={(event) => updateDraft({ unidad: event.target.value })}
              className={errors.unidad ? inputErrorClassName : inputClassName}
              placeholder={
                draft.tipoUnidad === 'Empresa' ? 'Sede Norte / Área de operaciones' : 'Torre A · Apto 301'
              }
            />
          </RegistryFormField>
          <RegistryFormField label="Teléfono">
            <input
              type="text"
              value={draft.telefono}
              onChange={(event) => updateDraft({ telefono: event.target.value })}
              className={inputClassName}
            />
          </RegistryFormField>
          <RegistryFormField label="E-mail">
            <input
              type="email"
              value={draft.email}
              onChange={(event) => updateDraft({ email: event.target.value })}
              className={inputClassName}
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
          <RegistryDetailField label="Nombre completo" value={person.nombre} />
          <RegistryDetailField label="Documento" value={person.documento} />
          <RegistryDetailField label="Tipo de sitio" value={person.tipoUnidad} />
          <RegistryDetailField label="Rol" value={person.rol} />
          <RegistryDetailField label={clienteLabel} value={person.cliente} />
          <RegistryDetailField label={unidadLabel} value={person.unidad} />
          <RegistryDetailField label="Teléfono" value={person.telefono || '—'} />
          <RegistryDetailField label="E-mail" value={person.email || '—'} />
          <RegistryDetailField label="Ciudad" value={person.ciudad} />
        </div>
      )}
    </div>
  );
}

export default function AdminPeoplePage() {
  const [people, setPeople] = useState<AdminPerson[]>(mockPeopleData as AdminPerson[]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<string | null>('nombre');
  const [sortDirection, setSortDirection] = useState<TableSortDirection>('asc');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [tipoUnidadFilter, setTipoUnidadFilter] = useState('');
  const [rolFilter, setRolFilter] = useState('');
  const [clienteFilter, setClienteFilter] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<AdminPerson | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('detail');
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<AdminPerson | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [photoModalPerson, setPhotoModalPerson] = useState<AdminPerson | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoRemoved, setPhotoRemoved] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [confirmDeletePerson, setConfirmDeletePerson] = useState<AdminPerson | null>(null);

  const clienteOptions = useMemo(() => [...new Set(people.map((person) => person.cliente))].sort(), [people]);
  const ciudadOptions = useMemo(() => [...new Set(people.map((person) => person.ciudad))].sort(), [people]);
  const rolOptions = useMemo(() => [...new Set(people.map((person) => person.rol))].sort(), [people]);
  const stats = useMemo(
    () => ({
      total: people.length,
      activos: people.filter((person) => person.activo).length,
      inactivos: people.filter((person) => !person.activo).length,
    }),
    [people],
  );

  const filteredPeople = useMemo(() => {
    const query = search.trim().toLowerCase();

    return people.filter((person) => {
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && person.activo) ||
        (statusFilter === 'inactive' && !person.activo);
      const matchesSearch =
        !query ||
        person.nombre.toLowerCase().includes(query) ||
        person.documento.includes(search.trim()) ||
        person.cliente.toLowerCase().includes(query) ||
        person.unidad.toLowerCase().includes(query);

      return (
        matchesStatus &&
        matchesSearch &&
        (!tipoUnidadFilter || person.tipoUnidad === tipoUnidadFilter) &&
        (!rolFilter || person.rol === rolFilter) &&
        (!clienteFilter || person.cliente === clienteFilter)
      );
    });
  }, [clienteFilter, people, rolFilter, search, statusFilter, tipoUnidadFilter]);

  const sortedPeople = useMemo(() => {
    if (!sortKey || !sortDirection) return filteredPeople;

    return [...filteredPeople].sort((a, b) => {
      const aValue = a[sortKey as keyof AdminPerson];
      const bValue = b[sortKey as keyof AdminPerson];

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
  }, [filteredPeople, sortDirection, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sortedPeople.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedPeople = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedPeople.slice(start, start + pageSize);
  }, [currentPage, pageSize, sortedPeople]);

  const resetPage = () => setPage(1);

  const openPersonDrawer = (person: AdminPerson) => {
    setDrawerMode('detail');
    setSelectedPerson(person);
    setIsEditing(false);
    setDraft(null);
    setFormErrors({});
    setDrawerOpen(true);
  };

  const openCreateDrawer = () => {
    setDrawerMode('create');
    setSelectedPerson(null);
    setIsEditing(true);
    setDraft(createEmptyPerson(clienteOptions[0] ?? ''));
    setFormErrors({});
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setDrawerMode('detail');
    setSelectedPerson(null);
    setIsEditing(false);
    setDraft(null);
    setFormErrors({});
    setPhotoModalOpen(false);
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoRemoved(false);
    setPhotoModalPerson(null);
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const startEditing = () => {
    if (!selectedPerson) return;
    setDraft({ ...selectedPerson });
    setFormErrors({});
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setDraft(null);
    setFormErrors({});
  };

  const saveEditing = () => {
    if (!draft || !selectedPerson) return;
    const errors = validatePersonDraft(draft);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setPeople((current) => current.map((person) => (person.id === draft.id ? draft : person)));
    setSelectedPerson(draft);
    setIsEditing(false);
    setDraft(null);
    setFormErrors({});
  };

  const saveCreate = () => {
    if (!draft || drawerMode !== 'create') return;
    const errors = validatePersonDraft(draft);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const newPerson: AdminPerson = {
      ...draft,
      id: nextRecordId(people.map((person) => person.id)),
      photo: draft.photo || getDefaultPhoto(draft.nombre),
    };

    setPeople((current) => [newPerson, ...current]);
    closeDrawer();
    openPersonDrawer(newPerson);
  };

  const openPhotoModalForPerson = (person: AdminPerson) => {
    setPhotoModalPerson(person);
    setPhotoFile(null);
    setPhotoRemoved(false);
    setPhotoPreview(person.photo);
    setPhotoModalOpen(true);
  };

  const closePhotoModal = () => {
    setPhotoModalOpen(false);
    setPhotoModalPerson(null);
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
    const target = photoModalPerson ?? draft;
    if (!target) return;

    let newPhoto = target.photo;
    if (photoRemoved) {
      newPhoto = getDefaultPhoto(target.nombre || 'Persona');
    } else if (photoPreview) {
      newPhoto = photoPreview;
    } else {
      return;
    }

    const updated = { ...target, photo: newPhoto };
    if (isEditing && draft?.id === updated.id) {
      setDraft(updated);
    } else {
      setPeople((current) => current.map((person) => (person.id === updated.id ? updated : person)));
      if (selectedPerson?.id === updated.id) setSelectedPerson(updated);
    }
    closePhotoModal();
  };

  const confirmDelete = () => {
    if (!confirmDeletePerson) return;
    setPeople((current) => current.filter((person) => person.id !== confirmDeletePerson.id));
    if (selectedPerson?.id === confirmDeletePerson.id) closeDrawer();
    setConfirmDeletePerson(null);
  };

  const columns: TableColumn<AdminPerson>[] = [
    {
      key: 'photo',
      label: 'Foto',
      width: '72px',
      render: (person) => (
        <img
          src={person.photo}
          alt={person.nombre}
          className="h-9 w-9 rounded-full border border-border object-cover"
        />
      ),
    },
    { key: 'nombre', label: 'Nombre', sortable: true, width: '170px' },
    { key: 'documento', label: 'Documento', sortable: true, width: '120px' },
    {
      key: 'tipoUnidad',
      label: 'Tipo de sitio',
      sortable: true,
      width: '160px',
      render: (person) => (
        <TableBadge tone={tipoUnidadToneMap[person.tipoUnidad] ?? 'neutral'}>
          {person.tipoUnidad}
        </TableBadge>
      ),
    },
    { key: 'cliente', label: 'Sitio', sortable: true, width: '190px' },
    { key: 'unidad', label: 'Unidad / sede', sortable: true, width: '170px' },
    {
      key: 'rol',
      label: 'Rol',
      sortable: true,
      width: '150px',
      render: (person) => (
        <TableBadge tone={rolToneMap[person.rol] ?? 'neutral'}>{person.rol}</TableBadge>
      ),
    },
    { key: 'telefono', label: 'Teléfono', sortable: true, width: '130px' },
    { key: 'ciudad', label: 'Ciudad', sortable: true, width: '120px' },
    {
      key: 'activo',
      label: 'Estado',
      sortable: true,
      width: '100px',
      render: (person) => (
        <TableBadge tone={person.activo ? 'success' : 'danger'}>
          {person.activo ? 'Activo' : 'Inactivo'}
        </TableBadge>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      width: '160px',
      align: 'right',
      render: (person) => (
        <TableRowActions
          items={[
            {
              label: 'Editar',
              icon: Pencil,
              tooltip: 'Editar persona',
              onClick: () => openPersonDrawer(person),
            },
            {
              label: 'Eliminar',
              icon: Trash2,
              tooltip: 'Eliminar persona',
              variant: 'danger',
              onClick: () => setConfirmDeletePerson(person),
            },
            {
              label: 'Actualizar foto',
              icon: Camera,
              tooltip: 'Actualizar foto',
              onClick: () => openPhotoModalForPerson(person),
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
          title="Personas"
          subtitle="Residentes de una unidad residencial o personas de una empresa."
          columns={columns}
          data={paginatedPeople}
          onRowClick={openPersonDrawer}
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
                { label: 'Total', value: stats.total, icon: <UserRound size={15} />, tone: 'brand' as const },
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
          searchPlaceholder="Buscar por nombre, documento, sitio o unidad..."
          onSearchChange={(value) => {
            setSearch(value);
            resetPage();
          }}
          filters={[
            {
              id: 'tipoUnidad',
              label: 'Tipo de sitio',
              type: 'select',
              value: tipoUnidadFilter,
              options: TIPO_UNIDAD_OPTIONS.map((tipo) => ({ label: tipo, value: tipo })),
              onChange: (value) => {
                setTipoUnidadFilter(value);
                resetPage();
              },
            },
            {
              id: 'rol',
              label: 'Rol',
              type: 'select',
              value: rolFilter,
              options: rolOptions.map((rol) => ({ label: rol, value: rol })),
              onChange: (value) => {
                setRolFilter(value);
                resetPage();
              },
            },
            {
              id: 'cliente',
              label: 'Sitio',
              type: 'select',
              value: clienteFilter,
              options: clienteOptions.map((cliente) => ({ label: cliente, value: cliente })),
              onChange: (value) => {
                setClienteFilter(value);
                resetPage();
              },
            },
          ]}
          metaLabel={`Mostrando ${sortedPeople.length} de ${people.length} personas`}
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
              tooltip: 'Exportar listado de personas',
              onClick: () => undefined,
            },
            {
              label: 'Nueva persona',
              icon: Plus,
              tooltip: 'Registrar una nueva persona',
              variant: 'primary',
              showLabel: true,
              onClick: openCreateDrawer,
            },
          ]}
          pagination={{
            page: currentPage,
            pageSize,
            total: sortedPeople.length,
            onPageChange: setPage,
            pageSizeOptions: [...PAGE_SIZE_OPTIONS],
            onPageSizeChange: (size: number) => {
              setPageSize(size);
              setPage(1);
            },
          }}
          emptyMessage="No se encontraron personas con los filtros aplicados."
        />

        <Drawer
          open={drawerOpen}
          onClose={closeDrawer}
          title={drawerMode === 'create' ? 'Nueva persona' : 'Detalles de persona'}
          subtitle={
            drawerMode === 'create'
              ? 'Registre un residente, familiar o persona de una empresa.'
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
                    Crear persona
                  </button>
                </div>
              </div>
            ) : selectedPerson ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                {isEditing ? (
                  <>
                    <p className="text-sm font-medium text-subtle">Editando información de la persona</p>
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
                        { label: 'Editar', icon: Pencil, tooltip: 'Editar persona', onClick: startEditing },
                        {
                          label: 'Eliminar',
                          icon: Trash2,
                          tooltip: 'Eliminar persona',
                          variant: 'danger',
                          onClick: () => setConfirmDeletePerson(selectedPerson),
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
            <PersonDetailsContent
              person={draft}
              editing
              creating
              draft={draft}
              errors={formErrors}
              clienteOptions={clienteOptions}
              ciudadOptions={ciudadOptions}
              onDraftChange={setDraft}
              onPhotoClick={() => openPhotoModalForPerson(draft)}
            />
          ) : selectedPerson ? (
            <PersonDetailsContent
              person={selectedPerson}
              editing={isEditing}
              draft={draft ?? selectedPerson}
              errors={formErrors}
              clienteOptions={clienteOptions}
              ciudadOptions={ciudadOptions}
              onDraftChange={setDraft}
              onPhotoClick={() => openPhotoModalForPerson(draft ?? selectedPerson)}
            />
          ) : null}
        </Drawer>

        <ModalDrawer
          open={Boolean(confirmDeletePerson)}
          onClose={() => setConfirmDeletePerson(null)}
          showCloseButton={false}
          size="sm"
          footer={
            <ConfirmModalFooter
              onCancel={() => setConfirmDeletePerson(null)}
              onConfirm={confirmDelete}
              confirmLabel="Eliminar"
              confirmIcon={<Trash2 size={18} />}
              confirmClassName="danger-confirm-btn"
            />
          }
        >
          {confirmDeletePerson ? (
            <ConfirmModalContent
              icon={<Trash2 size={36} strokeWidth={1.75} />}
              iconClassName="danger-icon-badge"
            >
              <p className="text-base leading-relaxed text-subtle">
                ¿Está seguro de que desea eliminar a{' '}
                <span className="font-semibold text-foreground">{confirmDeletePerson.nombre}</span>? Esta
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
              Seleccione una imagen para actualizar la foto de la persona.
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
