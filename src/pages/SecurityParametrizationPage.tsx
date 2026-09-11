import { useMemo, useState } from 'react';
import { MapPinned, Pencil, Plus, Shield, Trash2, UserRound } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Drawer } from '@/components/UI/drawer';
import { ModalDrawer } from '@/components/UI/modal-drawer';
import { SearchableSelect } from '@/components/UI/searchable-select';
import { Surface } from '@/components/UI/surface';
import { Switch } from '@/components/UI/switch';
import { EmphasisIcon } from '@/components/UI/emphasis';
import {
  DataTable,
  TableActions,
  TableBadge,
  TableRowActions,
  type TableColumn,
  type TableSortDirection,
} from '@/components/UI/table';
import mockUsersData from '@/data/mockUsers.json';
import mockAssignmentsData from '@/data/mockSecurityAssignments.json';
import mockRoundsData from '@/data/mockSecurityRounds.json';
import type { AdminUser } from '@/types/adminUser';
import type {
  SecurityAssignment,
  SecurityRound,
  SecurityRoundShift,
  WeekDay,
} from '@/types/securityParametrization';
import {
  ConfirmModalContent,
  ConfirmModalFooter,
  PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  RegistryDetailField,
  RegistryFormField,
  inputClassName,
  inputErrorClassName,
  nextRecordId,
  type DrawerMode,
  type StatusFilter,
} from '@/pages/adminRegistryShared';

type MainTab = 'asignaciones' | 'rondas';

const GUARD_PROFILES = new Set(['Vigilante', 'Escolta', 'Supervisor']);

const WEEK_DAYS: { id: WeekDay; label: string }[] = [
  { id: 'L', label: 'Lun' },
  { id: 'M', label: 'Mar' },
  { id: 'X', label: 'Mié' },
  { id: 'J', label: 'Jue' },
  { id: 'V', label: 'Vie' },
  { id: 'S', label: 'Sáb' },
  { id: 'D', label: 'Dom' },
];

const MAIN_TABS = [
  { id: 'asignaciones', label: 'Asignaciones' },
  { id: 'rondas', label: 'Rondas' },
];

function emptyAssignment(): SecurityAssignment {
  return { id: '', guardaId: '', rondaId: '', turnoId: '', dias: ['L', 'M', 'X', 'J', 'V'], activa: true };
}

function emptyRound(): SecurityRound {
  return { id: '', nombre: '', cliente: '', sede: '', puntos: [], turnos: [], activa: true };
}

function emptyShift(): Omit<SecurityRoundShift, 'id'> {
  return { nombre: '', horaInicio: '06:00', horaFin: '14:00' };
}

function formatDays(dias: WeekDay[]) {
  return WEEK_DAYS.filter((day) => dias.includes(day.id))
    .map((day) => day.label)
    .join(' · ');
}

function formatShiftHours(shift?: SecurityRoundShift | null) {
  if (!shift) return '—';
  return `${shift.horaInicio} – ${shift.horaFin}`;
}

export default function SecurityParametrizationPage() {
  const guards = useMemo(
    () => (mockUsersData as AdminUser[]).filter((user) => GUARD_PROFILES.has(user.perfil)),
    [],
  );
  const [rounds, setRounds] = useState<SecurityRound[]>(mockRoundsData as SecurityRound[]);
  const [assignments, setAssignments] = useState<SecurityAssignment[]>(
    mockAssignmentsData as SecurityAssignment[],
  );

  const [mainTab, setMainTab] = useState<MainTab>('asignaciones');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<TableSortDirection>('asc');

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('create');
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [selectedAssignment, setSelectedAssignment] = useState<SecurityAssignment | null>(null);
  const [assignmentDraft, setAssignmentDraft] = useState<SecurityAssignment | null>(null);

  const [selectedRound, setSelectedRound] = useState<SecurityRound | null>(null);
  const [roundDraft, setRoundDraft] = useState<SecurityRound | null>(null);
  const [checkpointInput, setCheckpointInput] = useState('');
  const [shiftDraft, setShiftDraft] = useState(emptyShift());

  const [confirmDeleteAssignment, setConfirmDeleteAssignment] = useState<SecurityAssignment | null>(null);
  const [confirmDeleteRound, setConfirmDeleteRound] = useState<SecurityRound | null>(null);

  const clienteOptions = useMemo(
    () => [...new Set(rounds.map((round) => round.cliente))].sort(),
    [rounds],
  );
  const guardsById = useMemo(() => new Map(guards.map((guard) => [guard.id, guard])), [guards]);
  const roundsById = useMemo(() => new Map(rounds.map((round) => [round.id, round])), [rounds]);

  const assignmentStats = useMemo(
    () => ({
      total: assignments.length,
      activas: assignments.filter((item) => item.activa).length,
      inactivas: assignments.filter((item) => !item.activa).length,
      guardas: new Set(assignments.map((item) => item.guardaId)).size,
    }),
    [assignments],
  );

  const roundStats = useMemo(
    () => ({
      total: rounds.length,
      activas: rounds.filter((item) => item.activa).length,
      inactivas: rounds.filter((item) => !item.activa).length,
      turnos: rounds.reduce((sum, round) => sum + round.turnos.length, 0),
    }),
    [rounds],
  );

  const resetPage = () => setPage(1);

  const changeMainTab = (tabId: string) => {
    setMainTab(tabId as MainTab);
    setSearch('');
    setStatusFilter('all');
    setSortKey(null);
    setSortDirection('asc');
    resetPage();
    closeDrawer();
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setDrawerMode('detail');
    setIsEditing(false);
    setFormErrors({});
    setSelectedAssignment(null);
    setAssignmentDraft(null);
    setSelectedRound(null);
    setRoundDraft(null);
    setCheckpointInput('');
    setShiftDraft(emptyShift());
  };

  const matchesStatus = (activa: boolean) =>
    statusFilter === 'all' ||
    (statusFilter === 'active' && activa) ||
    (statusFilter === 'inactive' && !activa);

  const filteredAssignments = useMemo(() => {
    const query = search.trim().toLowerCase();
    return assignments.filter((item) => {
      const guard = guardsById.get(item.guardaId);
      const round = roundsById.get(item.rondaId);
      const shift = round?.turnos.find((turno) => turno.id === item.turnoId);
      const haystack = [guard?.nombre, guard?.perfil, round?.nombre, round?.cliente, shift?.nombre]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return matchesStatus(item.activa) && (!query || haystack.includes(query));
    });
  }, [assignments, guardsById, roundsById, search, statusFilter]);

  const filteredRounds = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rounds.filter((round) => {
      const haystack = [round.nombre, round.cliente, round.sede, ...round.puntos, ...round.turnos.map((turno) => turno.nombre)]
        .join(' ')
        .toLowerCase();
      return matchesStatus(round.activa) && (!query || haystack.includes(query));
    });
  }, [rounds, search, statusFilter]);

  const sortedAssignments = useMemo(() => {
    if (!sortKey || !sortDirection) return filteredAssignments;
    return [...filteredAssignments].sort((a, b) => {
      const guardA = guardsById.get(a.guardaId);
      const guardB = guardsById.get(b.guardaId);
      const roundA = roundsById.get(a.rondaId);
      const roundB = roundsById.get(b.rondaId);
      const values: Record<string, string | boolean> = {
        guarda: guardA?.nombre ?? '',
        ronda: roundA?.nombre ?? '',
        turno: roundA?.turnos.find((turno) => turno.id === a.turnoId)?.nombre ?? '',
        cliente: roundA?.cliente ?? '',
        activa: a.activa,
      };
      const other: Record<string, string | boolean> = {
        guarda: guardB?.nombre ?? '',
        ronda: roundB?.nombre ?? '',
        turno: roundB?.turnos.find((turno) => turno.id === b.turnoId)?.nombre ?? '',
        cliente: roundB?.cliente ?? '',
        activa: b.activa,
      };
      const left = values[sortKey];
      const right = other[sortKey];
      if (typeof left === 'boolean' && typeof right === 'boolean') {
        return sortDirection === 'asc' ? Number(left) - Number(right) : Number(right) - Number(left);
      }
      const leftText = String(left).toLowerCase();
      const rightText = String(right).toLowerCase();
      if (leftText < rightText) return sortDirection === 'asc' ? -1 : 1;
      if (leftText > rightText) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredAssignments, guardsById, roundsById, sortDirection, sortKey]);

  const sortedRounds = useMemo(() => {
    if (!sortKey || !sortDirection) return filteredRounds;
    return [...filteredRounds].sort((a, b) => {
      const leftValue = a[sortKey as keyof SecurityRound];
      const rightValue = b[sortKey as keyof SecurityRound];
      if (typeof leftValue === 'boolean' && typeof rightValue === 'boolean') {
        return sortDirection === 'asc'
          ? Number(leftValue) - Number(rightValue)
          : Number(rightValue) - Number(leftValue);
      }
      const left = Array.isArray(leftValue) ? String(leftValue.length) : String(leftValue).toLowerCase();
      const right = Array.isArray(rightValue) ? String(rightValue.length) : String(rightValue).toLowerCase();
      if (left < right) return sortDirection === 'asc' ? -1 : 1;
      if (left > right) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredRounds, sortDirection, sortKey]);

  const currentList = mainTab === 'asignaciones' ? sortedAssignments : sortedRounds;
  const totalPages = Math.max(1, Math.ceil(currentList.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedAssignments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedAssignments.slice(start, start + pageSize);
  }, [currentPage, pageSize, sortedAssignments]);
  const paginatedRounds = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRounds.slice(start, start + pageSize);
  }, [currentPage, pageSize, sortedRounds]);

  const openAssignmentDrawer = (assignment: SecurityAssignment) => {
    setDrawerMode('detail');
    setSelectedAssignment(assignment);
    setAssignmentDraft(null);
    setSelectedRound(null);
    setRoundDraft(null);
    setIsEditing(false);
    setFormErrors({});
    setDrawerOpen(true);
  };

  const openCreateAssignment = () => {
    setDrawerMode('create');
    setSelectedAssignment(null);
    setAssignmentDraft(emptyAssignment());
    setSelectedRound(null);
    setRoundDraft(null);
    setIsEditing(true);
    setFormErrors({});
    setDrawerOpen(true);
  };

  const openRoundDrawer = (round: SecurityRound) => {
    setDrawerMode('detail');
    setSelectedRound(round);
    setRoundDraft(null);
    setSelectedAssignment(null);
    setAssignmentDraft(null);
    setIsEditing(false);
    setFormErrors({});
    setCheckpointInput('');
    setShiftDraft(emptyShift());
    setDrawerOpen(true);
  };

  const openCreateRound = () => {
    setDrawerMode('create');
    setSelectedRound(null);
    setRoundDraft(emptyRound());
    setSelectedAssignment(null);
    setAssignmentDraft(null);
    setIsEditing(true);
    setFormErrors({});
    setCheckpointInput('');
    setShiftDraft(emptyShift());
    setDrawerOpen(true);
  };

  const currentAssignment = isEditing ? assignmentDraft : selectedAssignment;
  const currentRound = isEditing ? roundDraft : selectedRound;
  const assignmentRound = currentAssignment ? roundsById.get(currentAssignment.rondaId) : undefined;
  const assignmentShift = assignmentRound?.turnos.find((turno) => turno.id === currentAssignment?.turnoId);
  const assignmentGuard = currentAssignment ? guardsById.get(currentAssignment.guardaId) : undefined;

  const validateAssignment = (draft: SecurityAssignment) => {
    const errors: Record<string, string> = {};
    if (!draft.guardaId) errors.guardaId = 'Este campo es requerido';
    if (!draft.rondaId) errors.rondaId = 'Este campo es requerido';
    if (!draft.turnoId) errors.turnoId = 'Este campo es requerido';
    if (!draft.dias.length) errors.dias = 'Seleccione al menos un día';
    return errors;
  };

  const validateRound = (draft: SecurityRound) => {
    const errors: Record<string, string> = {};
    if (!draft.nombre.trim()) errors.nombre = 'Este campo es requerido';
    if (!draft.cliente.trim()) errors.cliente = 'Este campo es requerido';
    if (!draft.sede.trim()) errors.sede = 'Este campo es requerido';
    if (!draft.turnos.length) errors.turnos = 'Agregue al menos un turno';
    return errors;
  };

  const saveAssignmentCreate = () => {
    if (!assignmentDraft) return;
    const errors = validateAssignment(assignmentDraft);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    const created: SecurityAssignment = {
      ...assignmentDraft,
      id: nextRecordId(assignments.map((item) => item.id)),
    };
    setAssignments((current) => [created, ...current]);
    closeDrawer();
    openAssignmentDrawer(created);
  };

  const saveAssignmentEdit = () => {
    if (!assignmentDraft) return;
    const errors = validateAssignment(assignmentDraft);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setAssignments((current) =>
      current.map((item) => (item.id === assignmentDraft.id ? assignmentDraft : item)),
    );
    setSelectedAssignment(assignmentDraft);
    setIsEditing(false);
    setAssignmentDraft(null);
    setFormErrors({});
  };

  const saveRoundCreate = () => {
    if (!roundDraft) return;
    const errors = validateRound(roundDraft);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    const created: SecurityRound = {
      ...roundDraft,
      id: nextRecordId(rounds.map((item) => item.id)),
    };
    setRounds((current) => [created, ...current]);
    closeDrawer();
    openRoundDrawer(created);
  };

  const saveRoundEdit = () => {
    if (!roundDraft) return;
    const errors = validateRound(roundDraft);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    const removedShiftIds = new Set(
      (selectedRound?.turnos ?? [])
        .filter((turno) => !roundDraft.turnos.some((item) => item.id === turno.id))
        .map((turno) => turno.id),
    );
    setRounds((current) => current.map((item) => (item.id === roundDraft.id ? roundDraft : item)));
    if (removedShiftIds.size > 0) {
      setAssignments((current) =>
        current.filter((item) => item.rondaId !== roundDraft.id || !removedShiftIds.has(item.turnoId)),
      );
    }
    setSelectedRound(roundDraft);
    setIsEditing(false);
    setRoundDraft(null);
    setFormErrors({});
  };

  const confirmDelete = () => {
    if (confirmDeleteAssignment) {
      setAssignments((current) => current.filter((item) => item.id !== confirmDeleteAssignment.id));
      if (selectedAssignment?.id === confirmDeleteAssignment.id) closeDrawer();
      setConfirmDeleteAssignment(null);
      return;
    }
    if (confirmDeleteRound) {
      setRounds((current) => current.filter((item) => item.id !== confirmDeleteRound.id));
      setAssignments((current) => current.filter((item) => item.rondaId !== confirmDeleteRound.id));
      if (selectedRound?.id === confirmDeleteRound.id) closeDrawer();
      setConfirmDeleteRound(null);
    }
  };

  const addCheckpoint = () => {
    if (!roundDraft) return;
    const value = checkpointInput.trim();
    if (!value || roundDraft.puntos.includes(value)) return;
    setRoundDraft({ ...roundDraft, puntos: [...roundDraft.puntos, value] });
    setCheckpointInput('');
  };

  const addShift = () => {
    if (!roundDraft) return;
    if (!shiftDraft.nombre.trim() || !shiftDraft.horaInicio || !shiftDraft.horaFin) {
      setFormErrors((current) => ({ ...current, turnos: 'Complete el nombre y el horario del turno' }));
      return;
    }
    setRoundDraft({
      ...roundDraft,
      turnos: [
        ...roundDraft.turnos,
        { ...shiftDraft, id: nextRecordId(roundDraft.turnos.map((turno) => turno.id)) },
      ],
    });
    setShiftDraft(emptyShift());
    setFormErrors((current) => ({ ...current, turnos: '' }));
  };

  const assignmentColumns: TableColumn<SecurityAssignment>[] = [
    {
      key: 'guarda',
      label: 'Guarda',
      sortable: true,
      width: '220px',
      render: (item) => {
        const guard = guardsById.get(item.guardaId);
        if (!guard) return '—';
        return (
          <div className="flex items-center gap-3">
            <img src={guard.photo} alt={guard.nombre} className="h-9 w-9 rounded-full border border-border object-cover" />
            <div>
              <p className="font-semibold text-foreground">{guard.nombre}</p>
              <p className="text-xs text-subtle">{guard.perfil}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'ronda',
      label: 'Ronda',
      sortable: true,
      render: (item) => roundsById.get(item.rondaId)?.nombre ?? '—',
    },
    {
      key: 'turno',
      label: 'Turno',
      sortable: true,
      width: '160px',
      render: (item) => {
        const shift = roundsById.get(item.rondaId)?.turnos.find((turno) => turno.id === item.turnoId);
        return shift ? (
          <div>
            <p className="font-semibold text-foreground">{shift.nombre}</p>
            <p className="text-xs text-subtle">{formatShiftHours(shift)}</p>
          </div>
        ) : (
          '—'
        );
      },
    },
    {
      key: 'dias',
      label: 'Días',
      width: '180px',
      render: (item) => formatDays(item.dias),
    },
    {
      key: 'cliente',
      label: 'Cliente',
      sortable: true,
      render: (item) => roundsById.get(item.rondaId)?.cliente ?? '—',
    },
    {
      key: 'activa',
      label: 'Estado',
      sortable: true,
      width: '100px',
      render: (item) => (
        <TableBadge tone={item.activa ? 'success' : 'danger'}>{item.activa ? 'Activa' : 'Inactiva'}</TableBadge>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      width: '120px',
      align: 'right',
      render: (item) => (
        <TableRowActions
          items={[
            { label: 'Editar', icon: Pencil, tooltip: 'Editar asignación', onClick: () => openAssignmentDrawer(item) },
            {
              label: 'Eliminar',
              icon: Trash2,
              tooltip: 'Eliminar asignación',
              variant: 'danger',
              onClick: () => setConfirmDeleteAssignment(item),
            },
          ]}
        />
      ),
    },
  ];

  const roundColumns: TableColumn<SecurityRound>[] = [
    { key: 'nombre', label: 'Ronda', sortable: true },
    { key: 'cliente', label: 'Cliente', sortable: true },
    { key: 'sede', label: 'Sede', sortable: true, width: '150px' },
    {
      key: 'puntos',
      label: 'Puntos',
      sortable: true,
      width: '90px',
      render: (round) => round.puntos.length,
    },
    {
      key: 'turnos',
      label: 'Turnos',
      sortable: true,
      render: (round) => round.turnos.map((turno) => turno.nombre).join(', ') || '—',
    },
    {
      key: 'activa',
      label: 'Estado',
      sortable: true,
      width: '100px',
      render: (round) => (
        <TableBadge tone={round.activa ? 'success' : 'danger'}>{round.activa ? 'Activa' : 'Inactiva'}</TableBadge>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      width: '120px',
      align: 'right',
      render: (round) => (
        <TableRowActions
          items={[
            { label: 'Editar', icon: Pencil, tooltip: 'Editar ronda', onClick: () => openRoundDrawer(round) },
            {
              label: 'Eliminar',
              icon: Trash2,
              tooltip: 'Eliminar ronda',
              variant: 'danger',
              onClick: () => setConfirmDeleteRound(round),
            },
          ]}
        />
      ),
    },
  ];

  const stats =
    mainTab === 'asignaciones'
      ? [
          { label: 'Asignaciones', value: assignmentStats.total, icon: <UserRound size={15} />, tone: 'brand' as const },
          { label: 'Activas', value: assignmentStats.activas, icon: <Shield size={15} />, tone: 'success' as const },
          { label: 'Guardas', value: assignmentStats.guardas, icon: <UserRound size={15} />, tone: 'info' as const },
        ]
      : [
          { label: 'Rondas', value: roundStats.total, icon: <MapPinned size={15} />, tone: 'brand' as const },
          { label: 'Activas', value: roundStats.activas, icon: <Shield size={15} />, tone: 'success' as const },
          { label: 'Turnos', value: roundStats.turnos, icon: <MapPinned size={15} />, tone: 'info' as const },
        ];

  const sharedTableProps = {
    title: 'Parametrización',
    subtitle:
      mainTab === 'asignaciones'
        ? 'Asigne guardas a rondas y turnos.'
        : 'Construya rondas y defina los turnos de cada una.',
    tabs: MAIN_TABS.map((tab) => ({
      ...tab,
      count: tab.id === 'asignaciones' ? assignmentStats.total : roundStats.total,
      badgeTone: 'neutral' as const,
    })),
    activeTab: mainTab,
    onTabChange: changeMainTab,
    headerSlot: (
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
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
    ),
    searchValue: search,
    onSearchChange: (value: string) => {
      setSearch(value);
      resetPage();
    },
    filters: [
      {
        id: 'estado',
        label: 'Estado',
        type: 'select' as const,
        value: statusFilter === 'all' ? '' : statusFilter,
        options: [
          { label: 'Activas', value: 'active' },
          { label: 'Inactivas', value: 'inactive' },
        ],
        onChange: (value: string) => {
          setStatusFilter((value || 'all') as StatusFilter);
          resetPage();
        },
      },
    ],
    sortKey,
    sortDirection,
    onSortChange: (key: string, direction: TableSortDirection) => {
      setSortKey(direction ? key : null);
      setSortDirection(direction);
    },
    pagination: {
      page: currentPage,
      pageSize,
      total: currentList.length,
      onPageChange: setPage,
      pageSizeOptions: [...PAGE_SIZE_OPTIONS],
      onPageSizeChange: (size: number) => {
        setPageSize(size);
        setPage(1);
      },
    },
  };

  const assignmentForm = currentAssignment ? (
    isEditing && assignmentDraft ? (
      <div className="grid grid-cols-1 gap-4">
        <RegistryFormField label="Guarda" required error={formErrors.guardaId}>
          <SearchableSelect
            value={assignmentDraft.guardaId}
            options={guards.map((guard) => ({ label: `${guard.nombre} · ${guard.perfil}`, value: guard.id }))}
            placeholder="Seleccionar guarda"
            searchPlaceholder="Buscar guarda..."
            emptyOptionLabel="Seleccionar"
            onChange={(value) => setAssignmentDraft({ ...assignmentDraft, guardaId: value })}
          />
        </RegistryFormField>
        <RegistryFormField label="Ronda" required error={formErrors.rondaId}>
          <SearchableSelect
            value={assignmentDraft.rondaId}
            options={rounds.filter((round) => round.activa || round.id === assignmentDraft.rondaId).map((round) => ({
              label: `${round.nombre} · ${round.cliente}`,
              value: round.id,
            }))}
            placeholder="Seleccionar ronda"
            searchPlaceholder="Buscar ronda..."
            emptyOptionLabel="Seleccionar"
            onChange={(value) => setAssignmentDraft({ ...assignmentDraft, rondaId: value, turnoId: '' })}
          />
        </RegistryFormField>
        <RegistryFormField label="Turno" required error={formErrors.turnoId}>
          <SearchableSelect
            value={assignmentDraft.turnoId}
            options={(assignmentRound?.turnos ?? []).map((turno) => ({
              label: `${turno.nombre} (${formatShiftHours(turno)})`,
              value: turno.id,
            }))}
            placeholder={assignmentDraft.rondaId ? 'Seleccionar turno' : 'Primero seleccione una ronda'}
            searchPlaceholder="Buscar turno..."
            emptyOptionLabel="Seleccionar"
            disabled={!assignmentDraft.rondaId}
            onChange={(value) => setAssignmentDraft({ ...assignmentDraft, turnoId: value })}
          />
        </RegistryFormField>
        <RegistryFormField label="Días" required error={formErrors.dias}>
          <div className="flex flex-wrap gap-2">
            {WEEK_DAYS.map((day) => {
              const selected = assignmentDraft.dias.includes(day.id);
              return (
                <button
                  key={day.id}
                  type="button"
                  onClick={() =>
                    setAssignmentDraft({
                      ...assignmentDraft,
                      dias: selected
                        ? assignmentDraft.dias.filter((item) => item !== day.id)
                        : [...assignmentDraft.dias, day.id],
                    })
                  }
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${
                    selected
                      ? 'border-brand bg-brand/5 text-foreground'
                      : 'border-border bg-surface text-subtle hover:bg-muted'
                  }`}
                >
                  {day.label}
                </button>
              );
            })}
          </div>
        </RegistryFormField>
        <RegistryFormField label="Estado">
          <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-3 py-2.5">
            <span className="text-sm font-medium text-foreground">
              {assignmentDraft.activa ? 'Asignación activa' : 'Asignación inactiva'}
            </span>
            <Switch
              checked={assignmentDraft.activa}
              onChange={(checked) => setAssignmentDraft({ ...assignmentDraft, activa: checked })}
              aria-label="Estado de la asignación"
            />
          </div>
        </RegistryFormField>
      </div>
    ) : (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <RegistryDetailField label="Guarda" value={assignmentGuard?.nombre ?? '—'} />
        <RegistryDetailField label="Perfil" value={assignmentGuard?.perfil ?? '—'} />
        <RegistryDetailField label="Ronda" value={assignmentRound?.nombre ?? '—'} />
        <RegistryDetailField label="Turno" value={assignmentShift ? `${assignmentShift.nombre} · ${formatShiftHours(assignmentShift)}` : '—'} />
        <RegistryDetailField label="Cliente" value={assignmentRound?.cliente ?? '—'} />
        <RegistryDetailField label="Sede" value={assignmentRound?.sede ?? '—'} />
        <RegistryDetailField label="Días" value={formatDays(currentAssignment.dias)} />
        <RegistryDetailField
          label="Estado"
          value={currentAssignment.activa ? 'Activa' : 'Inactiva'}
        />
      </div>
    )
  ) : null;

  const roundForm = currentRound ? (
    isEditing && roundDraft ? (
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <RegistryFormField label="Nombre" required error={formErrors.nombre} className="sm:col-span-2">
            <input
              type="text"
              value={roundDraft.nombre}
              onChange={(event) => setRoundDraft({ ...roundDraft, nombre: event.target.value })}
              className={formErrors.nombre ? inputErrorClassName : inputClassName}
              placeholder="Ronda Complejo Industrial"
            />
          </RegistryFormField>
          <RegistryFormField label="Cliente" required error={formErrors.cliente}>
            <SearchableSelect
              value={roundDraft.cliente}
              options={clienteOptions.map((cliente) => ({ label: cliente, value: cliente }))}
              placeholder="Seleccionar cliente"
              searchPlaceholder="Buscar cliente..."
              emptyOptionLabel="Seleccionar"
              onChange={(value) => setRoundDraft({ ...roundDraft, cliente: value })}
            />
          </RegistryFormField>
          <RegistryFormField label="Sede" required error={formErrors.sede}>
            <input
              type="text"
              value={roundDraft.sede}
              onChange={(event) => setRoundDraft({ ...roundDraft, sede: event.target.value })}
              className={formErrors.sede ? inputErrorClassName : inputClassName}
            />
          </RegistryFormField>
        </div>

        <RegistryFormField label="Puntos de control">
          <div className="flex gap-2">
            <input
              type="text"
              value={checkpointInput}
              onChange={(event) => setCheckpointInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  addCheckpoint();
                }
              }}
              className={inputClassName}
              placeholder="Portería, bodega, lobby..."
            />
            <button
              type="button"
              onClick={addCheckpoint}
              className="rounded-xl border border-border bg-surface px-3 text-sm font-semibold text-foreground hover:bg-muted"
            >
              Agregar
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {roundDraft.puntos.map((punto) => (
              <button
                key={punto}
                type="button"
                onClick={() =>
                  setRoundDraft({ ...roundDraft, puntos: roundDraft.puntos.filter((item) => item !== punto) })
                }
                className="rounded-lg border border-border bg-muted px-2.5 py-1 text-xs font-semibold text-foreground"
              >
                {punto} ×
              </button>
            ))}
          </div>
        </RegistryFormField>

        <RegistryFormField label="Turnos" required error={formErrors.turnos}>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_110px_110px_auto]">
            <input
              type="text"
              value={shiftDraft.nombre}
              onChange={(event) => setShiftDraft({ ...shiftDraft, nombre: event.target.value })}
              className={inputClassName}
              placeholder="Nombre del turno"
            />
            <input
              type="time"
              value={shiftDraft.horaInicio}
              onChange={(event) => setShiftDraft({ ...shiftDraft, horaInicio: event.target.value })}
              className={inputClassName}
            />
            <input
              type="time"
              value={shiftDraft.horaFin}
              onChange={(event) => setShiftDraft({ ...shiftDraft, horaFin: event.target.value })}
              className={inputClassName}
            />
            <button
              type="button"
              onClick={addShift}
              className="rounded-xl border border-border bg-surface px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
            >
              Agregar
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {roundDraft.turnos.map((turno) => (
              <Surface key={turno.id} variant="muted" padding="sm" radius="xl" className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{turno.nombre}</p>
                  <p className="text-xs text-subtle">{formatShiftHours(turno)}</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setRoundDraft({
                      ...roundDraft,
                      turnos: roundDraft.turnos.filter((item) => item.id !== turno.id),
                    })
                  }
                  className="text-xs font-semibold text-red-500 hover:text-red-600"
                >
                  Quitar
                </button>
              </Surface>
            ))}
          </div>
        </RegistryFormField>

        <RegistryFormField label="Estado">
          <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-3 py-2.5">
            <span className="text-sm font-medium text-foreground">
              {roundDraft.activa ? 'Ronda activa' : 'Ronda inactiva'}
            </span>
            <Switch
              checked={roundDraft.activa}
              onChange={(checked) => setRoundDraft({ ...roundDraft, activa: checked })}
              aria-label="Estado de la ronda"
            />
          </div>
        </RegistryFormField>
      </div>
    ) : (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <RegistryDetailField label="Nombre" value={currentRound.nombre} />
          <RegistryDetailField label="Cliente" value={currentRound.cliente} />
          <RegistryDetailField label="Sede" value={currentRound.sede} />
          <RegistryDetailField label="Estado" value={currentRound.activa ? 'Activa' : 'Inactiva'} />
        </div>
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-subtle">Puntos de control</p>
          <div className="flex flex-wrap gap-2">
            {currentRound.puntos.length ? (
              currentRound.puntos.map((punto) => (
                <TableBadge key={punto} tone="neutral">
                  {punto}
                </TableBadge>
              ))
            ) : (
              <p className="text-sm text-subtle">Sin puntos definidos</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-subtle">Turnos</p>
          {currentRound.turnos.map((turno) => (
            <Surface key={turno.id} variant="muted" padding="sm" radius="xl">
              <p className="text-sm font-semibold text-foreground">{turno.nombre}</p>
              <p className="mt-1 text-xs text-subtle">{formatShiftHours(turno)}</p>
            </Surface>
          ))}
        </div>
      </div>
    )
  ) : null;

  const isAssignmentDrawer = Boolean(selectedAssignment || (drawerMode === 'create' && assignmentDraft && mainTab === 'asignaciones'));
  const isRoundDrawer = Boolean(selectedRound || (drawerMode === 'create' && roundDraft && mainTab === 'rondas'));

  return (
    <DashboardLayout>
      <div className="page-shell pb-6">
        {mainTab === 'asignaciones' ? (
          <DataTable
            {...sharedTableProps}
            columns={assignmentColumns}
            data={paginatedAssignments}
            onRowClick={openAssignmentDrawer}
            searchPlaceholder="Buscar por guarda, ronda, turno o cliente..."
            metaLabel={`Mostrando ${sortedAssignments.length} de ${assignments.length} asignaciones`}
            actionItems={[
              {
                label: 'Nueva asignación',
                icon: Plus,
                tooltip: 'Asignar un guarda a una ronda y turno',
                variant: 'primary',
                showLabel: true,
                onClick: openCreateAssignment,
              },
            ]}
            emptyMessage="No hay asignaciones con los filtros aplicados."
          />
        ) : (
          <DataTable
            {...sharedTableProps}
            columns={roundColumns}
            data={paginatedRounds}
            onRowClick={openRoundDrawer}
            searchPlaceholder="Buscar por ronda, cliente, sede o turno..."
            metaLabel={`Mostrando ${sortedRounds.length} de ${rounds.length} rondas`}
            actionItems={[
              {
                label: 'Nueva ronda',
                icon: Plus,
                tooltip: 'Crear ronda y turnos',
                variant: 'primary',
                showLabel: true,
                onClick: openCreateRound,
              },
            ]}
            emptyMessage="No hay rondas con los filtros aplicados."
          />
        )}

        <Drawer
          open={drawerOpen}
          onClose={closeDrawer}
          title={
            isRoundDrawer
              ? drawerMode === 'create'
                ? 'Nueva ronda'
                : 'Detalles de ronda'
              : drawerMode === 'create'
                ? 'Nueva asignación'
                : 'Detalles de asignación'
          }
          subtitle={
            drawerMode === 'create'
              ? isRoundDrawer
                ? 'Defina la ronda, sus puntos de control y los turnos.'
                : 'Asigne un guarda a una ronda y un turno.'
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
                    onClick={isRoundDrawer ? saveRoundCreate : saveAssignmentCreate}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
                  >
                    <Plus size={16} />
                    {isRoundDrawer ? 'Crear ronda' : 'Crear asignación'}
                  </button>
                </div>
              </div>
            ) : selectedAssignment || selectedRound ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                {isEditing ? (
                  <>
                    <p className="text-sm font-medium text-subtle">
                      {isRoundDrawer ? 'Editando ronda y turnos' : 'Editando asignación'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setAssignmentDraft(null);
                          setRoundDraft(null);
                          setFormErrors({});
                          setCheckpointInput('');
                          setShiftDraft(emptyShift());
                        }}
                        className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={isRoundDrawer ? saveRoundEdit : saveAssignmentEdit}
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
                        {
                          label: 'Editar',
                          icon: Pencil,
                          tooltip: isRoundDrawer ? 'Editar ronda' : 'Editar asignación',
                          onClick: () => {
                            setIsEditing(true);
                            if (selectedAssignment) setAssignmentDraft({ ...selectedAssignment });
                            if (selectedRound) setRoundDraft({ ...selectedRound });
                          },
                        },
                        {
                          label: 'Eliminar',
                          icon: Trash2,
                          tooltip: isRoundDrawer ? 'Eliminar ronda' : 'Eliminar asignación',
                          variant: 'danger',
                          onClick: () => {
                            if (selectedAssignment) setConfirmDeleteAssignment(selectedAssignment);
                            if (selectedRound) setConfirmDeleteRound(selectedRound);
                          },
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
          {isAssignmentDrawer ? assignmentForm : isRoundDrawer ? roundForm : null}
        </Drawer>

        <ModalDrawer
          open={Boolean(confirmDeleteAssignment || confirmDeleteRound)}
          onClose={() => {
            setConfirmDeleteAssignment(null);
            setConfirmDeleteRound(null);
          }}
          showCloseButton={false}
          size="sm"
          footer={
            <ConfirmModalFooter
              onCancel={() => {
                setConfirmDeleteAssignment(null);
                setConfirmDeleteRound(null);
              }}
              onConfirm={confirmDelete}
              confirmLabel="Eliminar"
              confirmIcon={<Trash2 size={18} />}
              confirmClassName="danger-confirm-btn"
            />
          }
        >
          <ConfirmModalContent icon={<Trash2 size={36} strokeWidth={1.75} />} iconClassName="danger-icon-badge">
            <p className="text-base leading-relaxed text-subtle">
              {confirmDeleteRound ? (
                <>
                  ¿Eliminar la ronda{' '}
                  <span className="font-semibold text-foreground">{confirmDeleteRound.nombre}</span>? También se
                  quitarán las asignaciones asociadas.
                </>
              ) : confirmDeleteAssignment ? (
                <>
                  ¿Eliminar la asignación de{' '}
                  <span className="font-semibold text-foreground">
                    {guardsById.get(confirmDeleteAssignment.guardaId)?.nombre ?? 'este guarda'}
                  </span>
                  ?
                </>
              ) : null}
            </p>
          </ConfirmModalContent>
        </ModalDrawer>
      </div>
    </DashboardLayout>
  );
}
