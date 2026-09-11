import { useMemo, useState } from 'react';
import { Pencil, Plus, Settings, Trash2 } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Drawer } from '@/components/UI/drawer';
import { ModalDrawer } from '@/components/UI/modal-drawer';
import { Switch } from '@/components/UI/switch';
import {
  DataTable,
  TableBadge,
  TableRowActions,
  type TableColumn,
  type TableSortDirection,
} from '@/components/UI/table';
import mockRequestTypes from '@/data/mockPqrsRequestTypes.json';
import type { PqrsRequestType } from '@/types/pqrs';
import {
  ConfirmModalContent,
  ConfirmModalFooter,
  PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  RegistryFormField,
  inputClassName,
  inputErrorClassName,
  nextRecordId,
} from '@/pages/adminRegistryShared';

function emptyType(): PqrsRequestType {
  return { id: '', codigo: '', nombre: '', slaHoras: 48, activa: true };
}

function slugFromName(nombre: string) {
  return nombre
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function PqrsSettingsPage() {
  const [types, setTypes] = useState<PqrsRequestType[]>(mockRequestTypes as PqrsRequestType[]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>('nombre');
  const [sortDirection, setSortDirection] = useState<TableSortDirection>('asc');

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [draft, setDraft] = useState<PqrsRequestType | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmDelete, setConfirmDelete] = useState<PqrsRequestType | null>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return types.filter((item) => {
      if (!query) return true;
      return [item.nombre, item.codigo, String(item.slaHoras)].join(' ').toLowerCase().includes(query);
    });
  }, [search, types]);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDirection) return filtered;
    return [...filtered].sort((a, b) => {
      const left = String(a[sortKey as keyof PqrsRequestType] ?? '').toLowerCase();
      const right = String(b[sortKey as keyof PqrsRequestType] ?? '').toLowerCase();
      if (left < right) return sortDirection === 'asc' ? -1 : 1;
      if (left > right) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortDirection, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [currentPage, pageSize, sorted]);

  const closeDrawer = () => {
    setDrawerOpen(false);
    setDraft(null);
    setErrors({});
  };

  const openCreate = () => {
    setDraft(emptyType());
    setErrors({});
    setDrawerOpen(true);
  };

  const openEdit = (item: PqrsRequestType) => {
    setDraft({ ...item });
    setErrors({});
    setDrawerOpen(true);
  };

  const saveType = () => {
    if (!draft) return;
    const nextErrors: Record<string, string> = {};
    if (!draft.nombre.trim()) nextErrors.nombre = 'Este campo es requerido';
    if (!draft.codigo.trim()) nextErrors.codigo = 'Este campo es requerido';
    if (!draft.slaHoras || draft.slaHoras < 1) nextErrors.slaHoras = 'Indique un SLA válido en horas';

    const codigo = draft.codigo.trim().toUpperCase();
    const duplicated = types.some(
      (item) => item.id !== draft.id && item.codigo.toUpperCase() === codigo,
    );
    if (duplicated) nextErrors.codigo = 'Ya existe un tipo con este código';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (!draft.id) {
      const id = slugFromName(draft.nombre) || nextRecordId(types.map((item) => item.id));
      const uniqueId = types.some((item) => item.id === id) ? `${id}-${nextRecordId(types.map((item) => item.id))}` : id;
      setTypes((current) => [{ ...draft, id: uniqueId, codigo, nombre: draft.nombre.trim() }, ...current]);
    } else {
      setTypes((current) =>
        current.map((item) =>
          item.id === draft.id ? { ...draft, codigo, nombre: draft.nombre.trim() } : item,
        ),
      );
    }
    closeDrawer();
  };

  const columns: TableColumn<PqrsRequestType>[] = [
    {
      key: 'codigo',
      label: 'Código',
      sortable: true,
      width: '120px',
      render: (item) => <span className="font-semibold text-foreground">{item.codigo}</span>,
    },
    { key: 'nombre', label: 'Tipo de solicitud', sortable: true },
    {
      key: 'slaHoras',
      label: 'SLA (horas)',
      sortable: true,
      width: '140px',
      render: (item) => `${item.slaHoras} h`,
    },
    {
      key: 'activa',
      label: 'Estado',
      sortable: true,
      width: '140px',
      render: (item) => (
        <TableBadge tone={item.activa ? 'success' : 'neutral'}>{item.activa ? 'Activo' : 'Inactivo'}</TableBadge>
      ),
    },
    {
      key: 'actions',
      label: '',
      width: '88px',
      align: 'right',
      render: (item) => (
        <TableRowActions
          items={[
            {
              label: 'Editar',
              icon: Pencil,
              tooltip: 'Editar tipo',
              onClick: () => openEdit(item),
            },
            {
              label: 'Eliminar',
              icon: Trash2,
              tooltip: 'Eliminar tipo',
              variant: 'danger',
              onClick: () => setConfirmDelete(item),
            },
          ]}
        />
      ),
    },
  ];

  const isEditing = Boolean(draft?.id);

  return (
    <DashboardLayout>
      <div className="page-shell pb-6">
        <DataTable
          title="Configuraciones"
          subtitle="Parametrice los tipos de solicitud que se podrán radicar en PQRS."
          columns={columns}
          data={paginated}
          searchValue={search}
          searchPlaceholder="Buscar tipo o código..."
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          metaLabel={`${sorted.length} tipos de solicitud`}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSortChange={(key, direction) => {
            setSortKey(direction ? key : null);
            setSortDirection(direction);
          }}
          onRowClick={openEdit}
          actionItems={[
            {
              label: 'Nuevo tipo',
              icon: Plus,
              tooltip: 'Crear tipo de solicitud',
              variant: 'primary',
              showLabel: true,
              onClick: openCreate,
            },
          ]}
          pagination={{
            page: currentPage,
            pageSize,
            total: sorted.length,
            onPageChange: setPage,
            pageSizeOptions: [...PAGE_SIZE_OPTIONS],
            onPageSizeChange: (size: number) => {
              setPageSize(size);
              setPage(1);
            },
          }}
          emptyMessage="No hay tipos de solicitud parametrizados."
        />

        <Drawer
          open={drawerOpen}
          onClose={closeDrawer}
          size="md"
          title={isEditing ? 'Editar tipo de solicitud' : 'Nuevo tipo de solicitud'}
          subtitle="Estos tipos aparecerán al crear y filtrar PQRS."
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
                  onClick={saveType}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover dark:bg-primary dark:hover:bg-primary-hover"
                >
                  <Settings size={16} />
                  Guardar
                </button>
              </div>
            </div>
          }
        >
          {draft ? (
            <div className="space-y-5">
              <RegistryFormField label="Nombre" required error={errors.nombre}>
                <input
                  value={draft.nombre}
                  onChange={(event) => setDraft({ ...draft, nombre: event.target.value })}
                  className={errors.nombre ? inputErrorClassName : inputClassName}
                  placeholder="Ej. Felicitación"
                />
              </RegistryFormField>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <RegistryFormField label="Código" required error={errors.codigo}>
                  <input
                    value={draft.codigo}
                    onChange={(event) => setDraft({ ...draft, codigo: event.target.value.toUpperCase() })}
                    className={errors.codigo ? inputErrorClassName : inputClassName}
                    placeholder="FEL"
                    maxLength={6}
                  />
                </RegistryFormField>
                <RegistryFormField label="SLA (horas)" required error={errors.slaHoras}>
                  <input
                    type="number"
                    min={1}
                    value={draft.slaHoras}
                    onChange={(event) => setDraft({ ...draft, slaHoras: Number(event.target.value) })}
                    className={errors.slaHoras ? inputErrorClassName : inputClassName}
                  />
                </RegistryFormField>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">Activo</p>
                  <p className="text-xs text-subtle">Si está inactivo no se podrá seleccionar al radicar.</p>
                </div>
                <Switch
                  checked={draft.activa}
                  onChange={(checked) => setDraft({ ...draft, activa: checked })}
                  aria-label="Tipo activo"
                />
              </div>
            </div>
          ) : null}
        </Drawer>

        <ModalDrawer
          open={Boolean(confirmDelete)}
          onClose={() => setConfirmDelete(null)}
          showCloseButton={false}
          size="sm"
          footer={
            <ConfirmModalFooter
              onCancel={() => setConfirmDelete(null)}
              onConfirm={() => {
                if (!confirmDelete) return;
                setTypes((current) => current.filter((item) => item.id !== confirmDelete.id));
                setConfirmDelete(null);
              }}
              confirmLabel="Eliminar"
              confirmIcon={<Trash2 size={18} />}
              confirmClassName="danger-confirm-btn"
            />
          }
        >
          <ConfirmModalContent icon={<Trash2 size={36} strokeWidth={1.75} />} iconClassName="danger-icon-badge">
            <p className="text-base leading-relaxed text-subtle">
              ¿Eliminar el tipo{' '}
              <span className="font-semibold text-foreground">{confirmDelete?.nombre}</span>? Los radicados
              existentes conservarán el valor actual.
            </p>
          </ConfirmModalContent>
        </ModalDrawer>
      </div>
    </DashboardLayout>
  );
}
