import { useMemo, useState, type ReactNode } from 'react';
import { CarFront, LogIn, LogOut, Plus, UserRound } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Drawer } from '@/components/UI/drawer';
import { SearchableSelect } from '@/components/UI/searchable-select';
import { Surface } from '@/components/UI/surface';
import { EmphasisIcon } from '@/components/UI/emphasis';
import {
  DataTable,
  TableBadge,
  type TableBadgeTone,
  type TableColumn,
  type TableSortDirection,
} from '@/components/UI/table';
import mockUsersData from '@/data/mockUsers.json';
import mockVehiclesData from '@/data/mockVehicles.json';
import mockMovementsData from '@/data/mockSecurityMovements.json';
import type { AdminUser } from '@/types/adminUser';
import type { AdminVehicle } from '@/types/adminVehicle';
import type {
  SecurityMovement,
  SecurityMovementKind,
  SecuritySubjectType,
} from '@/types/securityMovement';
import {
  PAGE_SIZE,
  RegistryFormField,
  inputClassName,
  inputErrorClassName,
  nextRecordId,
} from '@/pages/adminRegistryShared';

type MovementTab = 'all' | 'ingreso' | 'salida';

interface MovementDraft {
  subjectType: SecuritySubjectType;
  movement: SecurityMovementKind;
  subjectId: string;
  observacion: string;
}

const emptyDraft: MovementDraft = {
  subjectType: 'persona',
  movement: 'ingreso',
  subjectId: '',
  observacion: '',
};

function formatRegisteredAt(value: string) {
  const [datePart, timePart] = value.split(' ');
  const [year, month, day] = datePart.split('-');
  return `${day}/${month}/${year} ${timePart}`;
}

function nowTimestamp() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function OptionCard({
  selected,
  title,
  description,
  icon,
  onClick,
}: {
  selected: boolean;
  title: string;
  description: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors ${
        selected
          ? 'border-brand bg-brand/5 ring-2 ring-brand/10'
          : 'border-border bg-surface hover:bg-muted'
      }`}
    >
      <EmphasisIcon tone={selected ? 'brand' : 'neutral'} size="sm">
        {icon}
      </EmphasisIcon>
      <span>
        <span className="block text-sm font-semibold text-foreground">{title}</span>
        <span className="mt-0.5 block text-xs text-subtle">{description}</span>
      </span>
    </button>
  );
}

export default function SecurityOperationPage() {
  const people = useMemo(
    () => (mockUsersData as AdminUser[]).filter((user) => user.activo),
    [],
  );
  const vehicles = useMemo(
    () => (mockVehiclesData as AdminVehicle[]).filter((vehicle) => vehicle.activo),
    [],
  );

  const [movements, setMovements] = useState<SecurityMovement[]>(
    mockMovementsData as SecurityMovement[],
  );
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>('registeredAt');
  const [sortDirection, setSortDirection] = useState<TableSortDirection>('desc');
  const [tab, setTab] = useState<MovementTab>('all');
  const [search, setSearch] = useState('');
  const [subjectTypeFilter, setSubjectTypeFilter] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [draft, setDraft] = useState<MovementDraft>(emptyDraft);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const stats = useMemo(
    () => ({
      total: movements.length,
      ingresos: movements.filter((item) => item.movement === 'ingreso').length,
      salidas: movements.filter((item) => item.movement === 'salida').length,
      personas: movements.filter((item) => item.subjectType === 'persona').length,
      vehiculos: movements.filter((item) => item.subjectType === 'vehiculo').length,
    }),
    [movements],
  );

  const subjectOptions = useMemo(() => {
    if (draft.subjectType === 'persona') {
      return people.map((person) => ({
        label: `${person.nombre} · ${person.documento}`,
        value: person.id,
      }));
    }

    return vehicles.map((vehicle) => ({
      label: `${vehicle.placa} · ${vehicle.marca} ${vehicle.modelo}`,
      value: vehicle.id,
    }));
  }, [draft.subjectType, people, vehicles]);

  const selectedSubject = useMemo(() => {
    if (!draft.subjectId) return null;
    if (draft.subjectType === 'persona') {
      return people.find((person) => person.id === draft.subjectId) ?? null;
    }
    return vehicles.find((vehicle) => vehicle.id === draft.subjectId) ?? null;
  }, [draft.subjectId, draft.subjectType, people, vehicles]);

  const filteredMovements = useMemo(() => {
    const query = search.trim().toLowerCase();

    return movements.filter((item) => {
      const matchesTab = tab === 'all' || item.movement === tab;
      const matchesType = !subjectTypeFilter || item.subjectType === subjectTypeFilter;
      const matchesSearch =
        !query ||
        item.subjectName.toLowerCase().includes(query) ||
        item.documento.includes(search.trim()) ||
        item.cliente.toLowerCase().includes(query) ||
        item.subjectDetail.toLowerCase().includes(query);

      return matchesTab && matchesType && matchesSearch;
    });
  }, [movements, search, subjectTypeFilter, tab]);

  const sortedMovements = useMemo(() => {
    if (!sortKey || !sortDirection) return filteredMovements;

    return [...filteredMovements].sort((a, b) => {
      const left = String(a[sortKey as keyof SecurityMovement]).toLowerCase();
      const right = String(b[sortKey as keyof SecurityMovement]).toLowerCase();
      if (left < right) return sortDirection === 'asc' ? -1 : 1;
      if (left > right) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredMovements, sortDirection, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sortedMovements.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedMovements = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedMovements.slice(start, start + PAGE_SIZE);
  }, [currentPage, sortedMovements]);

  const resetPage = () => setPage(1);

  const openDrawer = () => {
    setDraft(emptyDraft);
    setErrors({});
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setDraft(emptyDraft);
    setErrors({});
  };

  const saveMovement = () => {
    const nextErrors: Record<string, string> = {};
    if (!draft.subjectId) {
      nextErrors.subjectId =
        draft.subjectType === 'persona'
          ? 'Seleccione una persona'
          : 'Seleccione un vehículo';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const person = draft.subjectType === 'persona' ? (selectedSubject as AdminUser) : null;
    const vehicle = draft.subjectType === 'vehiculo' ? (selectedSubject as AdminVehicle) : null;

    const movement: SecurityMovement = {
      id: nextRecordId(movements.map((item) => item.id)),
      subjectType: draft.subjectType,
      movement: draft.movement,
      subjectId: draft.subjectId,
      subjectName: person?.nombre ?? vehicle?.placa ?? '',
      subjectDetail: person?.perfil ?? (vehicle ? `${vehicle.marca} ${vehicle.modelo}` : ''),
      photo: person?.photo ?? vehicle?.photo ?? '',
      documento: person?.documento ?? vehicle?.documento ?? '',
      cliente: person?.cliente ?? vehicle?.cliente ?? '',
      observacion: draft.observacion.trim(),
      registeredAt: nowTimestamp(),
    };

    setMovements((current) => [movement, ...current]);
    closeDrawer();
    setTab('all');
    setPage(1);
  };

  const columns: TableColumn<SecurityMovement>[] = [
    {
      key: 'photo',
      label: 'Foto',
      width: '72px',
      render: (item) => (
        <img
          src={item.photo}
          alt={item.subjectName}
          className="h-9 w-9 rounded-full border border-border object-cover"
        />
      ),
    },
    {
      key: 'movement',
      label: 'Movimiento',
      sortable: true,
      width: '120px',
      render: (item) => (
        <TableBadge tone={item.movement === 'ingreso' ? 'success' : 'warning'}>
          {item.movement === 'ingreso' ? 'Ingreso' : 'Salida'}
        </TableBadge>
      ),
    },
    {
      key: 'subjectType',
      label: 'Tipo',
      sortable: true,
      width: '110px',
      render: (item) => (
        <TableBadge tone={item.subjectType === 'persona' ? 'info' : 'primary'}>
          {item.subjectType === 'persona' ? 'Persona' : 'Vehículo'}
        </TableBadge>
      ),
    },
    { key: 'subjectName', label: 'Registro', sortable: true, width: '180px' },
    { key: 'subjectDetail', label: 'Detalle', sortable: true, width: '160px' },
    { key: 'documento', label: 'Documento', sortable: true, width: '130px' },
    { key: 'cliente', label: 'Cliente', sortable: true, width: '160px' },
    {
      key: 'registeredAt',
      label: 'Fecha',
      sortable: true,
      width: '160px',
      render: (item) => formatRegisteredAt(item.registeredAt),
    },
    {
      key: 'observacion',
      label: 'Observación',
      render: (item) => item.observacion || '—',
    },
  ];

  const movementTone: TableBadgeTone = draft.movement === 'ingreso' ? 'success' : 'warning';

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1600px] pb-6">
        <DataTable
          title="Operación"
          subtitle="Registro de ingresos y salidas de personas y vehículos."
          columns={columns}
          data={paginatedMovements}
          tabs={[
            { id: 'all', label: 'Todos', count: stats.total, badgeTone: 'neutral' },
            { id: 'ingreso', label: 'Ingresos', count: stats.ingresos, badgeTone: 'success' },
            { id: 'salida', label: 'Salidas', count: stats.salidas, badgeTone: 'warning' },
          ]}
          activeTab={tab}
          onTabChange={(tabId) => {
            setTab(tabId as MovementTab);
            resetPage();
          }}
          headerSlot={
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Total', value: stats.total, icon: <LogIn size={15} />, tone: 'brand' as const },
                { label: 'Ingresos', value: stats.ingresos, icon: <LogIn size={15} />, tone: 'success' as const },
                { label: 'Salidas', value: stats.salidas, icon: <LogOut size={15} />, tone: 'warning' as const },
                {
                  label: 'Personas / Vehículos',
                  value: `${stats.personas}/${stats.vehiculos}`,
                  icon: <UserRound size={15} />,
                  tone: 'info' as const,
                },
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
          searchPlaceholder="Buscar por nombre, placa, documento o cliente..."
          onSearchChange={(value) => {
            setSearch(value);
            resetPage();
          }}
          filters={[
            {
              id: 'subjectType',
              label: 'Tipo',
              type: 'select',
              value: subjectTypeFilter,
              options: [
                { label: 'Persona', value: 'persona' },
                { label: 'Vehículo', value: 'vehiculo' },
              ],
              onChange: (value) => {
                setSubjectTypeFilter(value);
                resetPage();
              },
            },
          ]}
          metaLabel={`Mostrando ${sortedMovements.length} de ${movements.length} movimientos`}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSortChange={(key, direction) => {
            setSortKey(direction ? key : null);
            setSortDirection(direction);
          }}
          actionItems={[
            {
              label: 'Registrar movimiento',
              icon: Plus,
              tooltip: 'Registrar ingreso o salida',
              variant: 'primary',
              showLabel: true,
              onClick: openDrawer,
            },
          ]}
          pagination={{
            page: currentPage,
            pageSize: PAGE_SIZE,
            total: sortedMovements.length,
            onPageChange: setPage,
          }}
          emptyMessage="No hay movimientos registrados con los filtros aplicados."
        />

        <Drawer
          open={drawerOpen}
          onClose={closeDrawer}
          title="Registrar movimiento"
          subtitle="Registre únicamente el ingreso o la salida de una persona o un vehículo."
          size="md"
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
                  onClick={saveMovement}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
                >
                  {draft.movement === 'ingreso' ? <LogIn size={16} /> : <LogOut size={16} />}
                  Registrar {draft.movement}
                </button>
              </div>
            </div>
          }
        >
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <OptionCard
                selected={draft.subjectType === 'persona'}
                title="Persona"
                description="Visitante, empleado o contratista"
                icon={<UserRound size={15} />}
                onClick={() => setDraft({ ...draft, subjectType: 'persona', subjectId: '' })}
              />
              <OptionCard
                selected={draft.subjectType === 'vehiculo'}
                title="Vehículo"
                description="Automóvil, moto u otro"
                icon={<CarFront size={15} />}
                onClick={() => setDraft({ ...draft, subjectType: 'vehiculo', subjectId: '' })}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <OptionCard
                selected={draft.movement === 'ingreso'}
                title="Ingreso"
                description="Entrada al predio"
                icon={<LogIn size={15} />}
                onClick={() => setDraft({ ...draft, movement: 'ingreso' })}
              />
              <OptionCard
                selected={draft.movement === 'salida'}
                title="Salida"
                description="Salida del predio"
                icon={<LogOut size={15} />}
                onClick={() => setDraft({ ...draft, movement: 'salida' })}
              />
            </div>

            <RegistryFormField
              label={draft.subjectType === 'persona' ? 'Persona' : 'Vehículo'}
              required
              error={errors.subjectId}
            >
              <SearchableSelect
                value={draft.subjectId}
                options={subjectOptions}
                placeholder={
                  draft.subjectType === 'persona' ? 'Seleccionar persona' : 'Seleccionar vehículo'
                }
                searchPlaceholder={
                  draft.subjectType === 'persona' ? 'Buscar por nombre o documento...' : 'Buscar por placa...'
                }
                emptyOptionLabel="Seleccionar"
                onChange={(value) => {
                  setDraft({ ...draft, subjectId: value });
                  setErrors((current) => ({ ...current, subjectId: '' }));
                }}
              />
            </RegistryFormField>

            {selectedSubject ? (
              <Surface variant="muted" padding="lg" className="flex items-center gap-4">
                <img
                  src={'photo' in selectedSubject ? selectedSubject.photo : ''}
                  alt={'nombre' in selectedSubject ? selectedSubject.nombre : selectedSubject.placa}
                  className="h-14 w-14 rounded-full border border-border object-cover"
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <TableBadge tone={movementTone}>
                      {draft.movement === 'ingreso' ? 'Ingreso' : 'Salida'}
                    </TableBadge>
                    <TableBadge tone={draft.subjectType === 'persona' ? 'info' : 'primary'}>
                      {draft.subjectType === 'persona' ? 'Persona' : 'Vehículo'}
                    </TableBadge>
                  </div>
                  <p className="mt-2 truncate text-sm font-semibold text-foreground">
                    {'nombre' in selectedSubject ? selectedSubject.nombre : selectedSubject.placa}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-subtle">
                    {'perfil' in selectedSubject
                      ? `${selectedSubject.perfil} · ${selectedSubject.documento}`
                      : `${selectedSubject.marca} ${selectedSubject.modelo} · ${selectedSubject.propietario}`}
                  </p>
                </div>
              </Surface>
            ) : null}

            <RegistryFormField label="Observación">
              <textarea
                value={draft.observacion}
                onChange={(event) => setDraft({ ...draft, observacion: event.target.value })}
                rows={3}
                placeholder="Opcional"
                className={`${errors.observacion ? inputErrorClassName : inputClassName} resize-none`}
              />
            </RegistryFormField>
          </div>
        </Drawer>
      </div>
    </DashboardLayout>
  );
}
