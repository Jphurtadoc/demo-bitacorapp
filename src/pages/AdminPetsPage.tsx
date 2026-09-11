import { useMemo, useRef, useState, type ChangeEvent } from 'react';
import {
  Camera,
  Download,
  ImageUp,
  PawPrint,
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
import mockPetsData from '@/data/mockPets.json';
import type { AdminPet } from '@/types/adminPet';
import {
  ConfirmModalContent,
  ConfirmModalFooter,
  PAGE_SIZE,
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

const ESPECIE_OPTIONS = ['Canino', 'Felino', 'Otro'] as const;

const especieToneMap: Record<string, TableBadgeTone> = {
  Canino: 'primary',
  Felino: 'warning',
  Otro: 'neutral',
};

function createEmptyPet(clienteDefault = ''): AdminPet {
  return {
    id: '',
    photo: getDefaultPhoto('Nueva Mascota'),
    nombre: '',
    especie: '',
    raza: '',
    color: '',
    cliente: clienteDefault,
    propietario: '',
    identificacion: '',
    ciudad: '',
    activo: true,
  };
}

function validatePetDraft(draft: AdminPet): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!draft.nombre.trim()) errors.nombre = 'Este campo es requerido';
  if (!draft.especie.trim()) errors.especie = 'Este campo es requerido';
  if (!draft.raza.trim()) errors.raza = 'Este campo es requerido';
  if (!draft.cliente.trim()) errors.cliente = 'Este campo es requerido';
  if (!draft.propietario.trim()) errors.propietario = 'Este campo es requerido';
  if (!draft.identificacion.trim()) errors.identificacion = 'Este campo es requerido';
  if (!draft.ciudad.trim()) errors.ciudad = 'Este campo es requerido';

  return errors;
}

function PetDetailsContent({
  pet,
  editing,
  draft,
  errors,
  clienteOptions,
  ciudadOptions,
  creating = false,
  onDraftChange,
  onPhotoClick,
}: {
  pet: AdminPet;
  editing: boolean;
  draft: AdminPet;
  errors: Record<string, string>;
  clienteOptions: string[];
  ciudadOptions: string[];
  creating?: boolean;
  onDraftChange: (draft: AdminPet) => void;
  onPhotoClick: () => void;
}) {
  const display = editing ? draft : pet;

  const updateDraft = (patch: Partial<AdminPet>) => {
    const next = { ...draft, ...patch };
    if (creating && patch.nombre !== undefined) {
      next.photo = getDefaultPhoto(patch.nombre.trim() || 'Nueva Mascota');
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
                <TableBadge tone={especieToneMap[display.especie] ?? 'neutral'}>{display.especie}</TableBadge>
                <TableBadge tone={display.activo ? 'success' : 'danger'}>
                  {display.activo ? 'Activo' : 'Inactivo'}
                </TableBadge>
              </>
            )}
          </div>
          <p className="mt-2 text-sm font-semibold text-foreground">
            {display.nombre || (creating ? 'Mascota sin nombre' : display.nombre)}
          </p>
          <p className="mt-1 text-sm text-subtle">
            {display.raza || (creating ? 'Complete los datos del formulario' : display.raza)}
          </p>
        </div>
      </Surface>

      {editing ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <RegistryFormField label="Nombre" required error={errors.nombre}>
            <input
              type="text"
              value={draft.nombre}
              onChange={(event) => updateDraft({ nombre: event.target.value })}
              className={errors.nombre ? inputErrorClassName : inputClassName}
            />
          </RegistryFormField>
          <RegistryFormField label="Especie" required error={errors.especie}>
            <SearchableSelect
              value={draft.especie}
              options={ESPECIE_OPTIONS.map((especie) => ({ label: especie, value: especie }))}
              placeholder="Seleccionar especie"
              searchPlaceholder="Buscar especie..."
              emptyOptionLabel="Seleccionar"
              onChange={(value) => updateDraft({ especie: value })}
            />
          </RegistryFormField>
          <RegistryFormField label="Raza" required error={errors.raza}>
            <input
              type="text"
              value={draft.raza}
              onChange={(event) => updateDraft({ raza: event.target.value })}
              className={errors.raza ? inputErrorClassName : inputClassName}
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
          <RegistryFormField label="Identificación / chip" required error={errors.identificacion}>
            <input
              type="text"
              value={draft.identificacion}
              onChange={(event) => updateDraft({ identificacion: event.target.value.toUpperCase() })}
              className={errors.identificacion ? inputErrorClassName : inputClassName}
              placeholder="CHIP-000000"
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
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <RegistryDetailField label="Nombre" value={pet.nombre} />
          <RegistryDetailField label="Especie" value={pet.especie} />
          <RegistryDetailField label="Raza" value={pet.raza} />
          <RegistryDetailField label="Color" value={pet.color} />
          <RegistryDetailField label="Identificación" value={pet.identificacion} />
          <RegistryDetailField label="Cliente" value={pet.cliente} />
          <RegistryDetailField label="Propietario" value={pet.propietario} />
          <RegistryDetailField label="Ciudad" value={pet.ciudad} />
        </div>
      )}
    </div>
  );
}

export default function AdminPetsPage() {
  const [pets, setPets] = useState<AdminPet[]>(mockPetsData as AdminPet[]);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<string | null>('nombre');
  const [sortDirection, setSortDirection] = useState<TableSortDirection>('asc');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [especieFilter, setEspecieFilter] = useState('');
  const [clienteFilter, setClienteFilter] = useState('');
  const [ciudadFilter, setCiudadFilter] = useState('');
  const [selectedPet, setSelectedPet] = useState<AdminPet | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('detail');
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<AdminPet | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [photoModalPet, setPhotoModalPet] = useState<AdminPet | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoRemoved, setPhotoRemoved] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [confirmDeletePet, setConfirmDeletePet] = useState<AdminPet | null>(null);

  const clienteOptions = useMemo(() => [...new Set(pets.map((pet) => pet.cliente))].sort(), [pets]);
  const ciudadOptions = useMemo(() => [...new Set(pets.map((pet) => pet.ciudad))].sort(), [pets]);
  const stats = useMemo(
    () => ({
      total: pets.length,
      activos: pets.filter((pet) => pet.activo).length,
      inactivos: pets.filter((pet) => !pet.activo).length,
    }),
    [pets],
  );

  const filteredPets = useMemo(() => {
    const query = search.trim().toLowerCase();

    return pets.filter((pet) => {
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && pet.activo) ||
        (statusFilter === 'inactive' && !pet.activo);
      const matchesSearch =
        !query ||
        pet.nombre.toLowerCase().includes(query) ||
        pet.propietario.toLowerCase().includes(query) ||
        pet.identificacion.toLowerCase().includes(query) ||
        pet.raza.toLowerCase().includes(query);

      return (
        matchesStatus &&
        matchesSearch &&
        (!especieFilter || pet.especie === especieFilter) &&
        (!clienteFilter || pet.cliente === clienteFilter) &&
        (!ciudadFilter || pet.ciudad === ciudadFilter)
      );
    });
  }, [ciudadFilter, clienteFilter, especieFilter, pets, search, statusFilter]);

  const sortedPets = useMemo(() => {
    if (!sortKey || !sortDirection) return filteredPets;

    return [...filteredPets].sort((a, b) => {
      const aValue = a[sortKey as keyof AdminPet];
      const bValue = b[sortKey as keyof AdminPet];

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
  }, [filteredPets, sortDirection, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sortedPets.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedPets = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedPets.slice(start, start + PAGE_SIZE);
  }, [currentPage, sortedPets]);

  const resetPage = () => setPage(1);

  const openPetDrawer = (pet: AdminPet) => {
    setDrawerMode('detail');
    setSelectedPet(pet);
    setIsEditing(false);
    setDraft(null);
    setFormErrors({});
    setDrawerOpen(true);
  };

  const openCreateDrawer = () => {
    setDrawerMode('create');
    setSelectedPet(null);
    setIsEditing(true);
    setDraft(createEmptyPet(clienteOptions[0] ?? ''));
    setFormErrors({});
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setDrawerMode('detail');
    setSelectedPet(null);
    setIsEditing(false);
    setDraft(null);
    setFormErrors({});
    setPhotoModalOpen(false);
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoRemoved(false);
    setPhotoModalPet(null);
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const startEditing = () => {
    if (!selectedPet) return;
    setDraft({ ...selectedPet });
    setFormErrors({});
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setDraft(null);
    setFormErrors({});
  };

  const saveEditing = () => {
    if (!draft || !selectedPet) return;
    const errors = validatePetDraft(draft);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setPets((current) => current.map((pet) => (pet.id === draft.id ? draft : pet)));
    setSelectedPet(draft);
    setIsEditing(false);
    setDraft(null);
    setFormErrors({});
  };

  const saveCreate = () => {
    if (!draft || drawerMode !== 'create') return;
    const errors = validatePetDraft(draft);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const newPet: AdminPet = {
      ...draft,
      id: nextRecordId(pets.map((pet) => pet.id)),
      photo: draft.photo || getDefaultPhoto(draft.nombre),
    };

    setPets((current) => [newPet, ...current]);
    closeDrawer();
    openPetDrawer(newPet);
  };

  const openPhotoModalForPet = (pet: AdminPet) => {
    setPhotoModalPet(pet);
    setPhotoFile(null);
    setPhotoRemoved(false);
    setPhotoPreview(pet.photo);
    setPhotoModalOpen(true);
  };

  const closePhotoModal = () => {
    setPhotoModalOpen(false);
    setPhotoModalPet(null);
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
    const target = photoModalPet ?? draft;
    if (!target) return;

    let newPhoto = target.photo;
    if (photoRemoved) {
      newPhoto = getDefaultPhoto(target.nombre || 'Mascota');
    } else if (photoPreview) {
      newPhoto = photoPreview;
    } else {
      return;
    }

    const updated = { ...target, photo: newPhoto };
    if (isEditing && draft?.id === updated.id) {
      setDraft(updated);
    } else {
      setPets((current) => current.map((pet) => (pet.id === updated.id ? updated : pet)));
      if (selectedPet?.id === updated.id) setSelectedPet(updated);
    }
    closePhotoModal();
  };

  const confirmDelete = () => {
    if (!confirmDeletePet) return;
    setPets((current) => current.filter((pet) => pet.id !== confirmDeletePet.id));
    if (selectedPet?.id === confirmDeletePet.id) closeDrawer();
    setConfirmDeletePet(null);
  };

  const columns: TableColumn<AdminPet>[] = [
    {
      key: 'photo',
      label: 'Foto',
      width: '72px',
      render: (pet) => (
        <img
          src={pet.photo}
          alt={pet.nombre}
          className="h-9 w-9 rounded-full border border-border object-cover"
        />
      ),
    },
    { key: 'nombre', label: 'Nombre', sortable: true, width: '130px' },
    {
      key: 'especie',
      label: 'Especie',
      sortable: true,
      width: '110px',
      render: (pet) => (
        <TableBadge tone={especieToneMap[pet.especie] ?? 'neutral'}>{pet.especie}</TableBadge>
      ),
    },
    { key: 'raza', label: 'Raza', sortable: true, width: '160px' },
    { key: 'color', label: 'Color', sortable: true, width: '130px' },
    { key: 'identificacion', label: 'Identificación', sortable: true, width: '140px' },
    { key: 'cliente', label: 'Cliente', sortable: true, width: '150px' },
    { key: 'propietario', label: 'Propietario', sortable: true, width: '160px' },
    { key: 'ciudad', label: 'Ciudad', sortable: true, width: '120px' },
    {
      key: 'activo',
      label: 'Estado',
      sortable: true,
      width: '100px',
      render: (pet) => (
        <TableBadge tone={pet.activo ? 'success' : 'danger'}>
          {pet.activo ? 'Activo' : 'Inactivo'}
        </TableBadge>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      width: '160px',
      align: 'right',
      render: (pet) => (
        <TableRowActions
          items={[
            {
              label: 'Editar',
              icon: Pencil,
              tooltip: 'Editar mascota',
              onClick: () => openPetDrawer(pet),
            },
            {
              label: 'Eliminar',
              icon: Trash2,
              tooltip: 'Eliminar mascota',
              variant: 'danger',
              onClick: () => setConfirmDeletePet(pet),
            },
            {
              label: 'Actualizar foto',
              icon: Camera,
              tooltip: 'Actualizar foto',
              onClick: () => openPhotoModalForPet(pet),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1600px] pb-6">
        <DataTable
          title="Mascotas"
          subtitle="Registro de mascotas autorizadas por cliente y propietario."
          columns={columns}
          data={paginatedPets}
          onRowClick={openPetDrawer}
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
                { label: 'Total', value: stats.total, icon: <PawPrint size={15} />, tone: 'brand' as const },
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
          searchPlaceholder="Buscar por nombre, propietario, chip o raza..."
          onSearchChange={(value) => {
            setSearch(value);
            resetPage();
          }}
          filters={[
            {
              id: 'especie',
              label: 'Especie',
              type: 'select',
              value: especieFilter,
              options: ESPECIE_OPTIONS.map((especie) => ({ label: especie, value: especie })),
              onChange: (value) => {
                setEspecieFilter(value);
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
          metaLabel={`Mostrando ${sortedPets.length} de ${pets.length} mascotas`}
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
              tooltip: 'Exportar listado de mascotas',
              onClick: () => undefined,
            },
            {
              label: 'Nueva mascota',
              icon: Plus,
              tooltip: 'Registrar una nueva mascota',
              variant: 'primary',
              showLabel: true,
              onClick: openCreateDrawer,
            },
          ]}
          pagination={{
            page: currentPage,
            pageSize: PAGE_SIZE,
            total: sortedPets.length,
            onPageChange: setPage,
          }}
          emptyMessage="No se encontraron mascotas con los filtros aplicados."
        />

        <Drawer
          open={drawerOpen}
          onClose={closeDrawer}
          title={drawerMode === 'create' ? 'Nueva mascota' : 'Detalles de mascota'}
          subtitle={
            drawerMode === 'create'
              ? 'Complete la información para registrar una nueva mascota.'
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
                    Crear mascota
                  </button>
                </div>
              </div>
            ) : selectedPet ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                {isEditing ? (
                  <>
                    <p className="text-sm font-medium text-subtle">Editando información de la mascota</p>
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
                        { label: 'Editar', icon: Pencil, tooltip: 'Editar mascota', onClick: startEditing },
                        {
                          label: 'Eliminar',
                          icon: Trash2,
                          tooltip: 'Eliminar mascota',
                          variant: 'danger',
                          onClick: () => setConfirmDeletePet(selectedPet),
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
            <PetDetailsContent
              pet={draft}
              editing
              creating
              draft={draft}
              errors={formErrors}
              clienteOptions={clienteOptions}
              ciudadOptions={ciudadOptions}
              onDraftChange={setDraft}
              onPhotoClick={() => openPhotoModalForPet(draft)}
            />
          ) : selectedPet ? (
            <PetDetailsContent
              pet={selectedPet}
              editing={isEditing}
              draft={draft ?? selectedPet}
              errors={formErrors}
              clienteOptions={clienteOptions}
              ciudadOptions={ciudadOptions}
              onDraftChange={setDraft}
              onPhotoClick={() => openPhotoModalForPet(draft ?? selectedPet)}
            />
          ) : null}
        </Drawer>

        <ModalDrawer
          open={Boolean(confirmDeletePet)}
          onClose={() => setConfirmDeletePet(null)}
          showCloseButton={false}
          size="sm"
          footer={
            <ConfirmModalFooter
              onCancel={() => setConfirmDeletePet(null)}
              onConfirm={confirmDelete}
              confirmLabel="Eliminar"
              confirmIcon={<Trash2 size={18} />}
              confirmClassName="danger-confirm-btn"
            />
          }
        >
          {confirmDeletePet ? (
            <ConfirmModalContent
              icon={<Trash2 size={36} strokeWidth={1.75} />}
              iconClassName="danger-icon-badge"
            >
              <p className="text-base leading-relaxed text-subtle">
                ¿Está seguro de que desea eliminar a{' '}
                <span className="font-semibold text-foreground">{confirmDeletePet.nombre}</span>? Esta
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
              Seleccione una imagen para actualizar la foto de la mascota.
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
              <p className="max-w-xs truncate text-xs text-subtle mt-3">{photoFile.name}</p>
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
