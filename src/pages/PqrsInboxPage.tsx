import { useMemo, useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ClipboardList,
  Columns3,
  Eye,
  FileText,
  Inbox,
  LayoutList,
  Paperclip,
  Plus,
  Reply,
  Settings,
  Trash2,
  UserPlus,
  UserRound,
  UserX,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Drawer } from '@/components/UI/drawer';
import { SearchableSelect } from '@/components/UI/searchable-select';
import { Surface } from '@/components/UI/surface';
import { EmphasisIcon } from '@/components/UI/emphasis';
import {
  DataTable,
  TableActions,
  TableBadge,
  TableEmptyState,
  TableFilters,
  TableRowActions,
  TableToolbar,
  type TableBadgeTone,
  type TableColumn,
  type TableSortDirection,
} from '@/components/UI/table';
import mockPqrsData from '@/data/mockPqrs.json';
import mockUsersData from '@/data/mockUsers.json';
import type { AdminUser } from '@/types/adminUser';
import {
  PQRS_CHANNEL_LABEL,
  PQRS_SLA_LABEL,
  PQRS_STATUS_LABEL,
  PQRS_TYPE_LABEL,
  formatPqrsDate,
  formatPqrsFileSize,
  fromDatetimeLocal,
  getPqrsAssigneeKind,
  getPqrsSlaLevel,
  isPqrsImageAttachment,
  nextPqrsRadicado,
  toDatetimeLocal,
  type PqrsAssigneeKind,
  type PqrsAttachment,
  type PqrsChannel,
  type PqrsSlaLevel,
  type PqrsStatus,
  type PqrsTicket,
  type PqrsType,
  type PqrsViewMode,
} from '@/types/pqrs';
import {
  PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  RegistryDetailField,
  RegistryFormField,
  inputClassName,
  inputErrorClassName,
  nextRecordId,
} from '@/pages/adminRegistryShared';
import type { EmphasisTone } from '@/components/UI/emphasis/emphasisTokens';
import { useNotifications } from '@/context/NotificationContext';

type StackFilter = 'all' | 'unassigned' | 'en_proceso' | 'rojo' | 'amarillo';
type DrawerMode = 'detail' | 'create' | 'assign' | 'respond' | null;

const TYPE_TONE: Record<PqrsType, TableBadgeTone> = {
  peticion: 'info',
  queja: 'warning',
  reclamo: 'danger',
  sugerencia: 'primary',
};

const STATUS_TONE: Record<PqrsStatus, TableBadgeTone> = {
  nuevo: 'info',
  en_proceso: 'warning',
  respondido: 'success',
  cerrado: 'neutral',
};

const SLA_TONE: Record<PqrsSlaLevel, TableBadgeTone> = {
  verde: 'success',
  amarillo: 'warning',
  rojo: 'danger',
};

const SLA_COLUMNS: {
  id: PqrsSlaLevel;
  title: string;
  hint: string;
  tone: EmphasisTone;
  accent: string;
}[] = [
  { id: 'verde', title: 'A tiempo', hint: 'Dentro del plazo', tone: 'success', accent: '#22c55e' },
  { id: 'amarillo', title: 'Riesgo', hint: 'Menos de 24 h', tone: 'warning', accent: '#ff8f47' },
  { id: 'rojo', title: 'Vencidos', hint: 'Fuera de plazo', tone: 'danger', accent: '#ef4444' },
];

function defaultDueAt() {
  const date = new Date();
  date.setDate(date.getDate() + 5);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} 17:00`;
}

function nowTimestamp() {
  const date = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function emptyCreateDraft(): Omit<PqrsTicket, 'id' | 'radicado' | 'estado'> {
  return {
    tipo: 'peticion',
    asunto: '',
    descripcion: '',
    solicitante: '',
    email: '',
    telefono: '',
    cliente: '',
    sede: '',
    canal: 'web',
    createdAt: nowTimestamp(),
    dueAt: defaultDueAt(),
    assignedKind: null,
    assignedToId: null,
    assignedToName: null,
    assignmentNote: '',
    attachments: [],
    respuesta: '',
    respuestaAt: '',
    respuestaAttachments: [],
  };
}

function ticketAttachments(ticket: Pick<PqrsTicket, 'attachments'>) {
  return ticket.attachments ?? [];
}

function readFilesAsAttachments(files: FileList | File[]): Promise<PqrsAttachment[]> {
  return Promise.all(
    [...files].map(
      (file) =>
        new Promise<PqrsAttachment>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              id: `${Date.now()}-${file.name}`,
              name: file.name,
              size: file.size,
              type: file.type || 'application/octet-stream',
              url: typeof reader.result === 'string' ? reader.result : undefined,
              uploadedAt: nowTimestamp(),
            });
          };
          reader.onerror = () => {
            resolve({
              id: `${Date.now()}-${file.name}`,
              name: file.name,
              size: file.size,
              type: file.type || 'application/octet-stream',
              uploadedAt: nowTimestamp(),
            });
          };
          reader.readAsDataURL(file);
        }),
    ),
  );
}

function PqrsAttachmentsField({
  files,
  onAdd,
  onRemove,
}: {
  files: PqrsAttachment[];
  onAdd: (files: PqrsAttachment[]) => void;
  onRemove: (id: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = async (list: FileList | null) => {
    if (!list?.length) return;
    const next = await readFilesAsAttachments(list);
    onAdd(next);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <RegistryFormField label="Archivos">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void handleFiles(event.dataTransfer.files);
        }}
        className={`flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors ${
          dragging ? 'border-brand bg-brand/5' : 'border-border bg-muted/40 hover:border-brand/40 hover:bg-muted'
        }`}
      >
        <Paperclip size={18} className="text-subtle" />
        <p className="mt-2 text-sm font-semibold text-foreground">Adjuntar archivos</p>
        <p className="mt-1 text-xs text-subtle">Imágenes, PDF, Word o Excel. Arrastre o haga clic.</p>
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
        className="hidden"
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          void handleFiles(event.target.files);
        }}
      />
      {files.length ? (
        <ul className="mt-3 space-y-2">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2.5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                {file.url && isPqrsImageAttachment(file) ? (
                  <img src={file.url} alt={file.name} className="h-full w-full object-cover" />
                ) : (
                  <FileText size={16} className="text-subtle" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                {file.url ? (
                  <a
                    href={file.url}
                    download={file.name}
                    className="block truncate text-sm font-semibold text-brand hover:underline"
                  >
                    {file.name}
                  </a>
                ) : (
                  <p className="truncate text-sm font-semibold text-foreground">{file.name}</p>
                )}
                <p className="text-[11px] font-medium text-subtle">{formatPqrsFileSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(file.id)}
                title="Quitar archivo"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-subtle hover:bg-muted hover:text-red-500"
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-xs text-subtle">Ningún archivo adjunto.</p>
      )}
    </RegistryFormField>
  );
}

function PqrsAttachmentList({ files, emptyLabel = 'Sin archivos adjuntos' }: { files: PqrsAttachment[]; emptyLabel?: string }) {
  if (!files.length) {
    return <p className="text-sm text-subtle">{emptyLabel}</p>;
  }

  return (
    <ul className="space-y-2">
      {files.map((file) => (
        <li
          key={file.id}
          className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2.5"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
            {file.url && isPqrsImageAttachment(file) ? (
              <img src={file.url} alt={file.name} className="h-full w-full object-cover" />
            ) : (
              <FileText size={16} className="text-subtle" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            {file.url ? (
              <a
                href={file.url}
                download={file.name}
                className="block truncate text-sm font-semibold text-brand hover:underline"
              >
                {file.name}
              </a>
            ) : (
              <p className="truncate text-sm font-semibold text-foreground">{file.name}</p>
            )}
            <p className="text-[11px] font-medium text-subtle">{formatPqrsFileSize(file.size)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function PqrsDetailView({ ticket, now }: { ticket: PqrsTicket; now: number }) {
  const sla = getPqrsSlaLevel(ticket, now);
  const files = ticketAttachments(ticket);
  const respuestaFiles = ticket.respuestaAttachments ?? [];

  return (
    <div className="space-y-5">
      <Surface variant="muted" padding="md" radius="xl" className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <TableBadge tone={TYPE_TONE[ticket.tipo]}>{PQRS_TYPE_LABEL[ticket.tipo]}</TableBadge>
          <TableBadge tone={STATUS_TONE[ticket.estado]}>{PQRS_STATUS_LABEL[ticket.estado]}</TableBadge>
          <TableBadge tone={SLA_TONE[sla]}>{PQRS_SLA_LABEL[sla]}</TableBadge>
        </div>
        <p className="text-base font-semibold text-foreground">{ticket.asunto}</p>
        <p className="text-sm leading-relaxed text-subtle">{ticket.descripcion}</p>
      </Surface>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <RegistryDetailField label="Radicado" value={ticket.radicado} />
        <RegistryDetailField label="Canal" value={PQRS_CHANNEL_LABEL[ticket.canal]} />
        <RegistryDetailField label="Solicitante" value={ticket.solicitante} />
        <RegistryDetailField label="Correo" value={ticket.email || '—'} />
        <RegistryDetailField label="Teléfono" value={ticket.telefono || '—'} />
        <RegistryDetailField label="Cliente" value={ticket.cliente} />
        <RegistryDetailField label="Sede" value={ticket.sede || '—'} />
        <RegistryDetailField label="Asignado" value={assignmentLabel(ticket) ?? 'Sin asignar'} />
        <RegistryDetailField label="Creado" value={formatPqrsDate(ticket.createdAt)} />
        <RegistryDetailField label="Vence" value={formatPqrsDate(ticket.dueAt)} />
      </div>

      {ticket.assignmentNote ? (
        <Surface variant="muted" padding="md" radius="xl">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-subtle">Nota de asignación</p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">{ticket.assignmentNote}</p>
        </Surface>
      ) : null}

      <Surface variant="muted" padding="md" radius="xl">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-subtle">Archivos</p>
        <PqrsAttachmentList files={files} />
      </Surface>

      {ticket.respuesta ? (
        <Surface variant="muted" padding="md" radius="xl" className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-subtle">Respuesta oficial</p>
          {ticket.respuestaAt ? (
            <p className="text-xs text-subtle">Enviada el {formatPqrsDate(ticket.respuestaAt)}</p>
          ) : null}
          <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">{ticket.respuesta}</p>
          {respuestaFiles.length ? <PqrsAttachmentList files={respuestaFiles} /> : null}
        </Surface>
      ) : null}
    </div>
  );
}

function assignmentLabel(ticket: PqrsTicket) {
  const kind = getPqrsAssigneeKind(ticket);
  if (!ticket.assignedToName || !kind) return null;
  return kind === 'area' ? `Área · ${ticket.assignedToName}` : ticket.assignedToName;
}

function PqrsResponseForm({
  ticket,
  respuesta,
  error,
  files,
  onRespuestaChange,
  onAddFiles,
  onRemoveFile,
}: {
  ticket?: Pick<PqrsTicket, 'radicado' | 'tipo' | 'asunto' | 'solicitante' | 'cliente' | 'sede' | 'estado'> | null;
  respuesta: string;
  error?: string;
  files: PqrsAttachment[];
  onRespuestaChange: (value: string) => void;
  onAddFiles: (files: PqrsAttachment[]) => void;
  onRemoveFile: (id: string) => void;
}) {
  return (
    <div className="space-y-5">
      {ticket ? (
        <Surface variant="muted" padding="md" radius="xl" className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {ticket.radicado ? (
              <span className="text-xs font-semibold text-subtle">{ticket.radicado}</span>
            ) : null}
            <TableBadge tone={TYPE_TONE[ticket.tipo]}>{PQRS_TYPE_LABEL[ticket.tipo]}</TableBadge>
            <TableBadge tone={STATUS_TONE[ticket.estado]}>{PQRS_STATUS_LABEL[ticket.estado]}</TableBadge>
          </div>
          <p className="text-sm font-semibold text-foreground">{ticket.asunto || 'Nueva PQRS'}</p>
          <p className="text-xs text-subtle">
            {ticket.solicitante || 'Solicitante pendiente'}
            {ticket.cliente ? ` · ${ticket.cliente}` : ''}
            {ticket.sede ? ` · ${ticket.sede}` : ''}
          </p>
        </Surface>
      ) : null}

      <RegistryFormField label="Respuesta oficial" required error={error}>
        <textarea
          value={respuesta}
          onChange={(event) => onRespuestaChange(event.target.value)}
          rows={6}
          placeholder="Redacte la respuesta que se enviará al solicitante..."
          className={`${error ? inputErrorClassName : inputClassName} resize-none`}
        />
      </RegistryFormField>

      <PqrsAttachmentsField files={files} onAdd={onAddFiles} onRemove={onRemoveFile} />
    </div>
  );
}

function ResponseFormButton({ onClick, disabled = false }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Reply size={16} />
      Formulario de respuesta
    </button>
  );
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

function ViewToggle({ view, onChange }: { view: PqrsViewMode; onChange: (view: PqrsViewMode) => void }) {
  return (
    <div className="inline-flex rounded-xl border border-border bg-surface p-1">
      {(
        [
          { id: 'tabla', label: 'Tabla', icon: LayoutList },
          { id: 'semaforo', label: 'Semáforo', icon: Columns3 },
        ] as const
      ).map((option) => {
        const active = view === option.id;
        const Icon = option.icon;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
              active
                ? 'bg-brand text-white shadow-sm dark:bg-primary'
                : 'text-subtle hover:bg-muted hover:text-foreground'
            }`}
          >
            <Icon size={15} />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function StatStack({
  label,
  value,
  icon,
  tone,
  active,
  onClick,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  tone: EmphasisTone;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="text-left">
      <Surface
        padding="sm"
        radius="lg"
        interactive
        className={`flex items-center gap-3 ${active ? 'border-brand ring-2 ring-brand/15' : ''}`}
      >
        <EmphasisIcon tone={tone} size="sm">
          {icon}
        </EmphasisIcon>
        <div className="min-w-0">
          <p className="text-lg font-bold leading-none text-foreground">{value}</p>
          <p className="mt-1 text-[11px] font-medium text-subtle">{label}</p>
        </div>
      </Surface>
    </button>
  );
}

export default function PqrsInboxPage() {
  const { notifyPqrsNueva, notifyPqrsAsignada, notifyPqrsRespondida } = useNotifications();
  const users = useMemo(
    () => (mockUsersData as AdminUser[]).filter((user) => user.activo),
    [],
  );
  const areas = useMemo(() => {
    const names = [...new Set(users.map((user) => user.estructura).filter(Boolean))];
    return names.sort().map((name) => ({ id: name, label: name }));
  }, [users]);

  const [tickets, setTickets] = useState<PqrsTicket[]>(mockPqrsData as PqrsTicket[]);
  const [view, setView] = useState<PqrsViewMode>('tabla');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [sortKey, setSortKey] = useState<string | null>('dueAt');
  const [sortDirection, setSortDirection] = useState<TableSortDirection>('asc');
  const [search, setSearch] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');
  const [stackFilter, setStackFilter] = useState<StackFilter>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null);
  const [assignTicket, setAssignTicket] = useState<PqrsTicket | null>(null);
  const [assigneeKind, setAssigneeKind] = useState<PqrsAssigneeKind>('persona');
  const [assigneeId, setAssigneeId] = useState('');
  const [assignmentNote, setAssignmentNote] = useState('');
  const [assignAttachments, setAssignAttachments] = useState<PqrsAttachment[]>([]);
  const [assignStep, setAssignStep] = useState<1 | 2>(1);
  const [assignFromTable, setAssignFromTable] = useState(false);
  const [assignPickError, setAssignPickError] = useState('');
  const [createDraft, setCreateDraft] = useState(emptyCreateDraft);
  const [createErrors, setCreateErrors] = useState<Record<string, string>>({});
  const [showCreateResponse, setShowCreateResponse] = useState(false);
  const [responseDraft, setResponseDraft] = useState('');
  const [responseAttachments, setResponseAttachments] = useState<PqrsAttachment[]>([]);
  const [responseError, setResponseError] = useState('');

  const now = useMemo(() => Date.now(), []);
  const clienteOptions = useMemo(
    () => [...new Set(tickets.map((ticket) => ticket.cliente))].sort(),
    [tickets],
  );

  const selectedTicket = useMemo(
    () => (selectedIds.length === 1 ? tickets.find((ticket) => ticket.id === selectedIds[0]) ?? null : null),
    [selectedIds, tickets],
  );

  const stats = useMemo(() => {
    const withSla = tickets.map((ticket) => ({ ticket, sla: getPqrsSlaLevel(ticket, now) }));
    return {
      total: tickets.length,
      unassigned: tickets.filter((ticket) => !ticket.assignedToId).length,
      enProceso: tickets.filter((ticket) => ticket.estado === 'en_proceso').length,
      amarillo: withSla.filter((item) => item.sla === 'amarillo').length,
      rojo: withSla.filter((item) => item.sla === 'rojo').length,
    };
  }, [now, tickets]);

  const filteredTickets = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const sla = getPqrsSlaLevel(ticket, now);
      const matchesTipo = !tipoFilter || ticket.tipo === tipoFilter;
      const matchesEstado = !estadoFilter || ticket.estado === estadoFilter;
      const matchesStack =
        stackFilter === 'all' ||
        (stackFilter === 'unassigned' && !ticket.assignedToId) ||
        (stackFilter === 'en_proceso' && ticket.estado === 'en_proceso') ||
        (stackFilter === 'rojo' && sla === 'rojo') ||
        (stackFilter === 'amarillo' && sla === 'amarillo');
      const haystack = [
        ticket.radicado,
        ticket.asunto,
        ticket.solicitante,
        ticket.cliente,
        ticket.sede,
        ticket.assignedToName ?? '',
        PQRS_TYPE_LABEL[ticket.tipo],
        ...ticketAttachments(ticket).map((file) => file.name),
      ]
        .join(' ')
        .toLowerCase();

      return matchesTipo && matchesEstado && matchesStack && (!query || haystack.includes(query));
    });
  }, [estadoFilter, now, search, stackFilter, tickets, tipoFilter]);

  const sortedTickets = useMemo(() => {
    if (!sortKey || !sortDirection) return filteredTickets;

    return [...filteredTickets].sort((a, b) => {
      const slaOrder: Record<PqrsSlaLevel, number> = { rojo: 0, amarillo: 1, verde: 2 };
      const left =
        sortKey === 'sla'
          ? slaOrder[getPqrsSlaLevel(a, now)]
          : String(a[sortKey as keyof PqrsTicket] ?? '').toLowerCase();
      const right =
        sortKey === 'sla'
          ? slaOrder[getPqrsSlaLevel(b, now)]
          : String(b[sortKey as keyof PqrsTicket] ?? '').toLowerCase();

      if (left < right) return sortDirection === 'asc' ? -1 : 1;
      if (left > right) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredTickets, now, sortDirection, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sortedTickets.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedTickets.slice(start, start + pageSize);
  }, [currentPage, pageSize, sortedTickets]);

  const semaphoreGroups = useMemo(() => {
    const groups: Record<PqrsSlaLevel, PqrsTicket[]> = { verde: [], amarillo: [], rojo: [] };
    sortedTickets.forEach((ticket) => {
      groups[getPqrsSlaLevel(ticket, now)].push(ticket);
    });
    return groups;
  }, [now, sortedTickets]);

  const resetPage = () => setPage(1);

  const toggleStack = (next: StackFilter) => {
    setStackFilter((current) => (current === next ? 'all' : next));
    resetPage();
  };

  const closeDrawer = () => {
    setDrawerMode(null);
    setAssignTicket(null);
    setAssigneeKind('persona');
    setAssigneeId('');
    setAssignmentNote('');
    setAssignAttachments([]);
    setAssignStep(1);
    setAssignFromTable(false);
    setAssignPickError('');
    setCreateDraft(emptyCreateDraft());
    setCreateErrors({});
    setShowCreateResponse(false);
    setResponseDraft('');
    setResponseAttachments([]);
    setResponseError('');
  };

  const openCreateDrawer = () => {
    setAssignTicket(null);
    setCreateDraft(emptyCreateDraft());
    setCreateErrors({});
    setShowCreateResponse(false);
    setDrawerMode('create');
  };

  const openDetailDrawer = (ticket: PqrsTicket) => {
    setAssignTicket(ticket);
    setSelectedIds([ticket.id]);
    setDrawerMode('detail');
  };

  const fillAssignment = (target: PqrsTicket) => {
    const kind = getPqrsAssigneeKind(target) ?? 'persona';
    setAssignTicket(target);
    setAssigneeKind(kind);
    setAssigneeId(target.assignedToId ?? '');
    setAssignmentNote(target.assignmentNote);
    setAssignAttachments(ticketAttachments(target));
    setSelectedIds([target.id]);
    setAssignPickError('');
  };

  const openAssignPicker = () => {
    setAssignFromTable(false);
    setAssignStep(1);
    setAssignPickError('');
    if (selectedTicket) {
      fillAssignment(selectedTicket);
    } else {
      setAssignTicket(null);
      setAssigneeKind('persona');
      setAssigneeId('');
      setAssignmentNote('');
      setAssignAttachments([]);
    }
    setDrawerMode('assign');
  };

  const openAssignDrawer = (ticket: PqrsTicket) => {
    setAssignFromTable(true);
    setAssignStep(2);
    fillAssignment(ticket);
    setDrawerMode('assign');
  };

  const continueAssign = () => {
    if (!assignTicket) {
      setAssignPickError('Seleccione una PQRS');
      return;
    }
    setAssignStep(2);
  };

  const openResponseDrawer = (ticket?: PqrsTicket | null) => {
    const target = ticket ?? selectedTicket;
    if (!target) return;

    setAssignTicket(target);
    setResponseDraft(target.respuesta ?? '');
    setResponseAttachments(target.respuestaAttachments ?? []);
    setResponseError('');
    setDrawerMode('respond');
    setSelectedIds([target.id]);
  };

  const saveResponse = () => {
    if (!assignTicket) return;
    if (!responseDraft.trim()) {
      setResponseError('La respuesta oficial es requerida');
      return;
    }

    const answeredAt = nowTimestamp();
    setTickets((current) =>
      current.map((ticket) =>
        ticket.id === assignTicket.id
          ? {
              ...ticket,
              respuesta: responseDraft.trim(),
              respuestaAt: answeredAt,
              respuestaAttachments: responseAttachments,
              estado: 'respondido',
            }
          : ticket,
      ),
    );
    notifyPqrsRespondida(assignTicket);
    closeDrawer();
  };

  const saveAssignment = () => {
    if (!assignTicket || !assigneeId) return;

    const assigneeName =
      assigneeKind === 'area'
        ? areas.find((area) => area.id === assigneeId)?.label
        : users.find((user) => user.id === assigneeId)?.nombre;

    if (!assigneeName) return;

    setTickets((current) =>
      current.map((ticket) =>
        ticket.id === assignTicket.id
          ? {
              ...ticket,
              assignedKind: assigneeKind,
              assignedToId: assigneeId,
              assignedToName: assigneeName,
              assignmentNote: assignmentNote.trim(),
              attachments: assignAttachments,
              estado: ticket.estado === 'nuevo' ? 'en_proceso' : ticket.estado,
            }
          : ticket,
      ),
    );
    notifyPqrsAsignada(assignTicket, assigneeName);
    closeDrawer();
  };

  const saveCreate = () => {
    const errors: Record<string, string> = {};
    if (!createDraft.asunto.trim()) errors.asunto = 'Este campo es requerido';
    if (!createDraft.solicitante.trim()) errors.solicitante = 'Este campo es requerido';
    if (!createDraft.cliente.trim()) errors.cliente = 'Este campo es requerido';
    if (!createDraft.descripcion.trim()) errors.descripcion = 'Este campo es requerido';
    if (!createDraft.dueAt.trim()) errors.dueAt = 'Este campo es requerido';
    if (showCreateResponse && !createDraft.respuesta?.trim()) {
      errors.respuesta = 'La respuesta oficial es requerida';
    }
    setCreateErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const hasResponse = Boolean(showCreateResponse && createDraft.respuesta?.trim());
    const created: PqrsTicket = {
      ...createDraft,
      id: nextRecordId(tickets.map((ticket) => ticket.id)),
      radicado: nextPqrsRadicado(tickets.map((ticket) => ticket.radicado)),
      estado: hasResponse ? 'respondido' : 'nuevo',
      createdAt: nowTimestamp(),
      assignedKind: null,
      assignedToId: null,
      assignedToName: null,
      assignmentNote: '',
      attachments: createDraft.attachments ?? [],
      respuesta: hasResponse ? createDraft.respuesta?.trim() : '',
      respuestaAt: hasResponse ? nowTimestamp() : '',
      respuestaAttachments: hasResponse ? createDraft.respuestaAttachments ?? [] : [],
    };

    setTickets((current) => [created, ...current]);
    notifyPqrsNueva(created);
    if (hasResponse) notifyPqrsRespondida(created);
    closeDrawer();
    resetPage();
    setSelectedIds([created.id]);
  };

  const filterFields = [
    {
      id: 'tipo',
      label: 'Tipo',
      type: 'select' as const,
      value: tipoFilter,
      options: (Object.keys(PQRS_TYPE_LABEL) as PqrsType[]).map((tipo) => ({
        label: PQRS_TYPE_LABEL[tipo],
        value: tipo,
      })),
      onChange: (value: string) => {
        setTipoFilter(value);
        resetPage();
      },
    },
    {
      id: 'estado',
      label: 'Estado',
      type: 'select' as const,
      value: estadoFilter,
      options: (Object.keys(PQRS_STATUS_LABEL) as PqrsStatus[]).map((estado) => ({
        label: PQRS_STATUS_LABEL[estado],
        value: estado,
      })),
      onChange: (value: string) => {
        setEstadoFilter(value);
        resetPage();
      },
    },
  ];

  const toolbarActions = (
    <>
      <ViewToggle view={view} onChange={setView} />
      <TableActions
        items={[
          {
            label: 'Configuraciones',
            icon: Settings,
            tooltip: 'Parametrizar tipos de solicitud',
            variant: 'secondary',
            showLabel: true,
            to: '/pqrs/config',
          },
          {
            label: 'Formulario de respuesta',
            icon: Reply,
            tooltip: selectedTicket
              ? 'Abrir formulario de respuesta'
              : 'Seleccione una PQRS para responder',
            variant: 'secondary',
            showLabel: true,
            disabled: !selectedTicket,
            onClick: () => openResponseDrawer(selectedTicket),
          },
          {
            label: 'Asignar',
            icon: UserPlus,
            tooltip: 'Asignar una PQRS a un área o persona',
            variant: 'secondary',
            showLabel: true,
            onClick: openAssignPicker,
          },
          {
            label: 'Crear',
            icon: Plus,
            tooltip: 'Crear PQRS',
            variant: 'primary',
            showLabel: true,
            onClick: openCreateDrawer,
          },
        ]}
      />
    </>
  );

  const stacks = (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
      <StatStack
        label="Recibidos"
        value={stats.total}
        icon={<Inbox size={15} />}
        tone="brand"
        active={stackFilter === 'all'}
        onClick={() => {
          setStackFilter('all');
          resetPage();
        }}
      />
      <StatStack
        label="Sin asignar"
        value={stats.unassigned}
        icon={<UserX size={15} />}
        tone="info"
        active={stackFilter === 'unassigned'}
        onClick={() => toggleStack('unassigned')}
      />
      <StatStack
        label="En proceso"
        value={stats.enProceso}
        icon={<ClipboardList size={15} />}
        tone="warning"
        active={stackFilter === 'en_proceso'}
        onClick={() => toggleStack('en_proceso')}
      />
      <StatStack
        label="Riesgo"
        value={stats.amarillo}
        icon={<AlertTriangle size={15} />}
        tone="primary"
        active={stackFilter === 'amarillo'}
        onClick={() => toggleStack('amarillo')}
      />
      <StatStack
        label="Vencidos"
        value={stats.rojo}
        icon={<AlertTriangle size={15} />}
        tone="danger"
        active={stackFilter === 'rojo'}
        onClick={() => toggleStack('rojo')}
      />
    </div>
  );

  const columns: TableColumn<PqrsTicket>[] = [
    {
      key: 'radicado',
      label: 'Radicado',
      sortable: true,
      width: '150px',
      render: (ticket) => <span className="font-semibold text-foreground">{ticket.radicado}</span>,
    },
    {
      key: 'tipo',
      label: 'Tipo',
      sortable: true,
      width: '120px',
      render: (ticket) => <TableBadge tone={TYPE_TONE[ticket.tipo]}>{PQRS_TYPE_LABEL[ticket.tipo]}</TableBadge>,
    },
    { key: 'asunto', label: 'Asunto', sortable: true },
    { key: 'solicitante', label: 'Solicitante', sortable: true, width: '150px' },
    { key: 'cliente', label: 'Cliente', sortable: true, width: '170px' },
    {
      key: 'estado',
      label: 'Estado',
      sortable: true,
      width: '130px',
      render: (ticket) => (
        <TableBadge tone={STATUS_TONE[ticket.estado]}>{PQRS_STATUS_LABEL[ticket.estado]}</TableBadge>
      ),
    },
    {
      key: 'sla',
      label: 'SLA',
      sortable: true,
      width: '120px',
      render: (ticket) => {
        const sla = getPqrsSlaLevel(ticket, now);
        return <TableBadge tone={SLA_TONE[sla]}>{PQRS_SLA_LABEL[sla]}</TableBadge>;
      },
    },
    {
      key: 'assignedToName',
      label: 'Asignado',
      sortable: true,
      width: '180px',
      render: (ticket) => {
        const label = assignmentLabel(ticket);
        if (!label) return <span className="text-subtle">Sin asignar</span>;
        const kind = getPqrsAssigneeKind(ticket);
        return (
          <span className="inline-flex items-center gap-1.5">
            {kind === 'area' ? <Building2 size={13} className="text-subtle" /> : <UserRound size={13} className="text-subtle" />}
            {label}
          </span>
        );
      },
    },
    {
      key: 'attachments',
      label: 'Archivos',
      sortable: true,
      width: '100px',
      align: 'center',
      render: (ticket) => {
        const count = ticketAttachments(ticket).length;
        return (
          <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${count ? 'text-foreground' : 'text-subtle'}`}>
            <Paperclip size={14} />
            {count}
          </span>
        );
      },
    },
    {
      key: 'dueAt',
      label: 'Vence',
      sortable: true,
      width: '150px',
      render: (ticket) => formatPqrsDate(ticket.dueAt),
    },
    {
      key: 'actions',
      label: '',
      width: '128px',
      align: 'right',
      render: (ticket) => (
        <TableRowActions
          items={[
            {
              label: 'Ver detalle',
              icon: Eye,
              tooltip: 'Ver detalle de la PQRS',
              onClick: () => openDetailDrawer(ticket),
            },
            {
              label: 'Asignar',
              icon: UserPlus,
              tooltip: 'Asignar a un área o persona',
              onClick: () => openAssignDrawer(ticket),
            },
            {
              label: 'Formulario de respuesta',
              icon: Reply,
              tooltip: 'Formulario de respuesta',
              onClick: () => openResponseDrawer(ticket),
            },
          ]}
        />
      ),
    },
  ];

  const drawerOpen = drawerMode !== null;

  return (
    <DashboardLayout>
      <div className="page-shell pb-6">
        {view === 'tabla' ? (
          <DataTable
            title="PQRS recibidos"
            subtitle="Gestione peticiones, quejas, reclamos y sugerencias según el semáforo de SLA."
            columns={columns}
            data={paginatedTickets}
            headerSlot={stacks}
            actions={toolbarActions}
            selectable
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            searchValue={search}
            searchPlaceholder="Buscar radicado, asunto, cliente o responsable..."
            onSearchChange={(value) => {
              setSearch(value);
              resetPage();
            }}
            filters={filterFields}
            metaLabel={`Mostrando ${sortedTickets.length} de ${tickets.length} radicados`}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSortChange={(key, direction) => {
              setSortKey(direction ? key : null);
              setSortDirection(direction);
            }}
            onRowClick={openDetailDrawer}
            pagination={{
              page: currentPage,
              pageSize,
              total: sortedTickets.length,
              onPageChange: setPage,
              pageSizeOptions: [...PAGE_SIZE_OPTIONS],
              onPageSizeChange: (size: number) => {
                setPageSize(size);
                setPage(1);
              },
            }}
            emptyMessage="No hay PQRS con los filtros aplicados."
          />
        ) : (
          <div className="flex flex-col gap-5">
            <TableToolbar
              title="PQRS recibidos"
              subtitle="Vista semáforo: priorice vencidos y casos en riesgo de incumplimiento."
              actions={toolbarActions}
            />
            {stacks}
            <TableFilters
              filters={filterFields}
              searchValue={search}
              searchPlaceholder="Buscar radicado, asunto, cliente o responsable..."
              onSearchChange={(value) => {
                setSearch(value);
                resetPage();
              }}
              metaLabel={`${sortedTickets.length} radicados en el tablero`}
            />
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              {SLA_COLUMNS.map((column) => {
                const items = semaphoreGroups[column.id];
                return (
                  <Surface key={column.id} padding="none" radius="xl" className="flex min-h-[420px] flex-col">
                    <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <EmphasisIcon tone={column.tone} size="sm">
                          {column.id === 'verde' ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
                        </EmphasisIcon>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{column.title}</p>
                          <p className="text-[11px] font-medium text-subtle">{column.hint}</p>
                        </div>
                      </div>
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                        style={{
                          backgroundColor: `color-mix(in srgb, ${column.accent} 16%, var(--color-surface))`,
                          color: column.accent,
                        }}
                      >
                        {items.length}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col gap-3 p-3">
                      {items.length === 0 ? (
                        <TableEmptyState message="Sin casos en este nivel." />
                      ) : (
                        items.map((ticket) => {
                          const selected = selectedIds.includes(ticket.id);
                          return (
                            <div
                              key={ticket.id}
                              className={`rounded-xl border bg-surface p-3 text-left transition-colors ${
                                selected
                                  ? 'border-brand ring-2 ring-brand/15'
                                  : 'border-border hover:border-[var(--surface-border-strong)] hover:bg-muted'
                              }`}
                            >
                              <button type="button" className="w-full text-left" onClick={() => openDetailDrawer(ticket)}>
                                <div className="mb-2 flex items-start justify-between gap-2">
                                  <p className="text-xs font-semibold text-subtle">{ticket.radicado}</p>
                                  <TableBadge tone={TYPE_TONE[ticket.tipo]}>{PQRS_TYPE_LABEL[ticket.tipo]}</TableBadge>
                                </div>
                                <p className="text-sm font-semibold leading-snug text-foreground">{ticket.asunto}</p>
                                <p className="mt-1 text-xs text-subtle">
                                  {ticket.cliente} · {ticket.sede}
                                </p>
                                <div className="mt-3 flex items-center justify-between gap-2">
                                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-subtle">
                                    {getPqrsAssigneeKind(ticket) === 'area' ? <Building2 size={13} /> : <UserRound size={13} />}
                                    {assignmentLabel(ticket) ?? 'Sin asignar'}
                                  </span>
                                  <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-subtle">
                                    {ticketAttachments(ticket).length ? (
                                      <span className="inline-flex items-center gap-1">
                                        <Paperclip size={12} />
                                        {ticketAttachments(ticket).length}
                                      </span>
                                    ) : null}
                                    Vence {formatPqrsDate(ticket.dueAt)}
                                  </span>
                                </div>
                              </button>
                              <button
                                type="button"
                                onClick={() => openAssignDrawer(ticket)}
                                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                              >
                                <UserPlus size={14} />
                                Asignar
                              </button>
                              <button
                                type="button"
                                onClick={() => openResponseDrawer(ticket)}
                                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                              >
                                <Reply size={14} />
                                Formulario de respuesta
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </Surface>
                );
              })}
            </div>
          </div>
        )}

        <Drawer
          open={drawerOpen}
          onClose={closeDrawer}
          size={drawerMode === 'assign' ? 'md' : 'lg'}
          title={
            drawerMode === 'detail'
              ? 'Detalle de PQRS'
              : drawerMode === 'create'
                ? 'Crear PQRS'
                : drawerMode === 'respond'
                  ? 'Formulario de respuesta'
                  : assignStep === 1
                    ? 'Asignar PQRS'
                    : assignTicket?.assignedToId
                      ? 'Reasignar PQRS'
                      : 'Asignar PQRS'
          }
          subtitle={
            drawerMode === 'detail'
              ? assignTicket?.radicado
              : drawerMode === 'create'
                ? 'Registre una petición, queja, reclamo o sugerencia.'
                : drawerMode === 'respond'
                  ? assignTicket?.radicado
                  : assignFromTable
                    ? assignTicket?.radicado
                    : assignStep === 1
                      ? 'Paso 1 de 2 · Seleccione el radicado'
                      : assignTicket
                        ? `Paso 2 de 2 · ${assignTicket.radicado}`
                        : 'Paso 2 de 2'
          }
          footer={
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-subtle">
                {drawerMode === 'detail'
                  ? 'Consulta el radicado y continúe con asignación o respuesta'
                  : drawerMode === 'assign' && assignStep === 1
                    ? 'Seleccione la PQRS que desea asignar'
                    : 'Los campos marcados con * son obligatorios'}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
                >
                  {drawerMode === 'detail' ? 'Cerrar' : 'Cancelar'}
                </button>
                {drawerMode === 'assign' && assignStep === 2 && !assignFromTable ? (
                  <button
                    type="button"
                    onClick={() => setAssignStep(1)}
                    className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
                  >
                    Atrás
                  </button>
                ) : null}
                {drawerMode === 'detail' && assignTicket ? (
                  <>
                    <button
                      type="button"
                      onClick={() => openAssignDrawer(assignTicket)}
                      className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
                    >
                      <UserPlus size={16} />
                      Asignar
                    </button>
                    <button
                      type="button"
                      onClick={() => openResponseDrawer(assignTicket)}
                      className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover dark:bg-primary dark:hover:bg-primary-hover"
                    >
                      <Reply size={16} />
                      Formulario de respuesta
                    </button>
                  </>
                ) : drawerMode === 'create' ? (
                  <button
                    type="button"
                    onClick={saveCreate}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover dark:bg-primary dark:hover:bg-primary-hover"
                  >
                    <Plus size={16} />
                    {showCreateResponse ? 'Crear y responder' : 'Crear radicado'}
                  </button>
                ) : drawerMode === 'respond' ? (
                  <button
                    type="button"
                    onClick={saveResponse}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover dark:bg-primary dark:hover:bg-primary-hover"
                  >
                    <Reply size={16} />
                    Enviar respuesta
                  </button>
                ) : assignStep === 1 ? (
                  <button
                    type="button"
                    onClick={continueAssign}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover dark:bg-primary dark:hover:bg-primary-hover"
                  >
                    Continuar
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={saveAssignment}
                    disabled={!assigneeId}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary dark:hover:bg-primary-hover"
                  >
                    <UserPlus size={16} />
                    Guardar asignación
                  </button>
                )}
              </div>
            </div>
          }
        >
          {drawerMode === 'detail' && assignTicket ? (
            <PqrsDetailView ticket={tickets.find((item) => item.id === assignTicket.id) ?? assignTicket} now={now} />
          ) : drawerMode === 'create' ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <RegistryFormField label="Tipo" required>
                  <select
                    value={createDraft.tipo}
                    onChange={(event) =>
                      setCreateDraft({ ...createDraft, tipo: event.target.value as PqrsType })
                    }
                    className={inputClassName}
                  >
                    {(Object.keys(PQRS_TYPE_LABEL) as PqrsType[]).map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {PQRS_TYPE_LABEL[tipo]}
                      </option>
                    ))}
                  </select>
                </RegistryFormField>
                <RegistryFormField label="Canal" required>
                  <select
                    value={createDraft.canal}
                    onChange={(event) =>
                      setCreateDraft({ ...createDraft, canal: event.target.value as PqrsChannel })
                    }
                    className={inputClassName}
                  >
                    {(Object.keys(PQRS_CHANNEL_LABEL) as PqrsChannel[]).map((canal) => (
                      <option key={canal} value={canal}>
                        {PQRS_CHANNEL_LABEL[canal]}
                      </option>
                    ))}
                  </select>
                </RegistryFormField>
              </div>

              <RegistryFormField label="Asunto" required error={createErrors.asunto}>
                <input
                  value={createDraft.asunto}
                  onChange={(event) => setCreateDraft({ ...createDraft, asunto: event.target.value })}
                  className={createErrors.asunto ? inputErrorClassName : inputClassName}
                  placeholder="Resumen del caso"
                />
              </RegistryFormField>

              <RegistryFormField label="Descripción" required error={createErrors.descripcion}>
                <textarea
                  value={createDraft.descripcion}
                  onChange={(event) => setCreateDraft({ ...createDraft, descripcion: event.target.value })}
                  rows={4}
                  className={`${createErrors.descripcion ? inputErrorClassName : inputClassName} resize-none`}
                  placeholder="Detalle de la PQRS"
                />
              </RegistryFormField>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <RegistryFormField label="Solicitante" required error={createErrors.solicitante}>
                  <input
                    value={createDraft.solicitante}
                    onChange={(event) => setCreateDraft({ ...createDraft, solicitante: event.target.value })}
                    className={createErrors.solicitante ? inputErrorClassName : inputClassName}
                  />
                </RegistryFormField>
                <RegistryFormField label="Correo">
                  <input
                    type="email"
                    value={createDraft.email}
                    onChange={(event) => setCreateDraft({ ...createDraft, email: event.target.value })}
                    className={inputClassName}
                  />
                </RegistryFormField>
                <RegistryFormField label="Teléfono">
                  <input
                    value={createDraft.telefono}
                    onChange={(event) => setCreateDraft({ ...createDraft, telefono: event.target.value })}
                    className={inputClassName}
                  />
                </RegistryFormField>
                <RegistryFormField label="Cliente" required error={createErrors.cliente}>
                  <input
                    list="pqrs-clientes"
                    value={createDraft.cliente}
                    onChange={(event) => setCreateDraft({ ...createDraft, cliente: event.target.value })}
                    className={createErrors.cliente ? inputErrorClassName : inputClassName}
                    placeholder="Nombre del cliente"
                  />
                  <datalist id="pqrs-clientes">
                    {clienteOptions.map((cliente) => (
                      <option key={cliente} value={cliente} />
                    ))}
                  </datalist>
                </RegistryFormField>
                <RegistryFormField label="Sede">
                  <input
                    value={createDraft.sede}
                    onChange={(event) => setCreateDraft({ ...createDraft, sede: event.target.value })}
                    className={inputClassName}
                  />
                </RegistryFormField>
                <RegistryFormField label="Fecha de vencimiento" required error={createErrors.dueAt}>
                  <input
                    type="datetime-local"
                    value={toDatetimeLocal(createDraft.dueAt)}
                    onChange={(event) =>
                      setCreateDraft({ ...createDraft, dueAt: fromDatetimeLocal(event.target.value) })
                    }
                    className={createErrors.dueAt ? inputErrorClassName : inputClassName}
                  />
                </RegistryFormField>
              </div>

              <PqrsAttachmentsField
                files={createDraft.attachments ?? []}
                onAdd={(files) =>
                  setCreateDraft({
                    ...createDraft,
                    attachments: [...(createDraft.attachments ?? []), ...files],
                  })
                }
                onRemove={(id) =>
                  setCreateDraft({
                    ...createDraft,
                    attachments: (createDraft.attachments ?? []).filter((file) => file.id !== id),
                  })
                }
              />

              <ResponseFormButton onClick={() => setShowCreateResponse(true)} />

              {showCreateResponse ? (
                <PqrsResponseForm
                  ticket={{
                    radicado: '',
                    tipo: createDraft.tipo,
                    asunto: createDraft.asunto,
                    solicitante: createDraft.solicitante,
                    cliente: createDraft.cliente,
                    sede: createDraft.sede,
                    estado: 'nuevo',
                  }}
                  respuesta={createDraft.respuesta ?? ''}
                  error={createErrors.respuesta}
                  files={createDraft.respuestaAttachments ?? []}
                  onRespuestaChange={(value) => setCreateDraft({ ...createDraft, respuesta: value })}
                  onAddFiles={(files) =>
                    setCreateDraft({
                      ...createDraft,
                      respuestaAttachments: [...(createDraft.respuestaAttachments ?? []), ...files],
                    })
                  }
                  onRemoveFile={(id) =>
                    setCreateDraft({
                      ...createDraft,
                      respuestaAttachments: (createDraft.respuestaAttachments ?? []).filter((file) => file.id !== id),
                    })
                  }
                />
              ) : null}
            </div>
          ) : drawerMode === 'respond' && assignTicket ? (
            <PqrsResponseForm
              ticket={assignTicket}
              respuesta={responseDraft}
              error={responseError}
              files={responseAttachments}
              onRespuestaChange={(value) => {
                setResponseDraft(value);
                setResponseError('');
              }}
              onAddFiles={(files) => setResponseAttachments((current) => [...current, ...files])}
              onRemoveFile={(id) =>
                setResponseAttachments((current) => current.filter((file) => file.id !== id))
              }
            />
          ) : drawerMode === 'assign' && assignStep === 1 ? (
            <div className="space-y-5">
              <RegistryFormField label="PQRS" required error={assignPickError}>
                <SearchableSelect
                  value={assignTicket?.id ?? ''}
                  options={tickets.map((ticket) => ({
                    label: `${ticket.radicado} · ${ticket.asunto}`,
                    value: ticket.id,
                  }))}
                  placeholder="Seleccionar radicado"
                  searchPlaceholder="Buscar por radicado, asunto o cliente..."
                  emptyOptionLabel="Seleccionar"
                  onChange={(value) => {
                    const ticket = tickets.find((item) => item.id === value);
                    if (ticket) fillAssignment(ticket);
                  }}
                />
              </RegistryFormField>

              {assignTicket ? (
                <Surface variant="muted" padding="md" radius="xl" className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <TableBadge tone={TYPE_TONE[assignTicket.tipo]}>{PQRS_TYPE_LABEL[assignTicket.tipo]}</TableBadge>
                    <TableBadge tone={STATUS_TONE[assignTicket.estado]}>
                      {PQRS_STATUS_LABEL[assignTicket.estado]}
                    </TableBadge>
                    <TableBadge tone={SLA_TONE[getPqrsSlaLevel(assignTicket, now)]}>
                      {PQRS_SLA_LABEL[getPqrsSlaLevel(assignTicket, now)]}
                    </TableBadge>
                  </div>
                  <p className="text-base font-semibold text-foreground">{assignTicket.asunto}</p>
                  <p className="text-sm leading-relaxed text-subtle">{assignTicket.descripcion}</p>
                  <p className="text-xs text-subtle">
                    Cliente
                    <span className="mt-0.5 block text-sm font-semibold text-foreground">
                      {assignTicket.cliente} · {assignTicket.sede}
                    </span>
                  </p>
                  <p className="text-xs text-subtle">
                    Asignado
                    <span className="mt-0.5 block text-sm font-semibold text-foreground">
                      {assignmentLabel(assignTicket) ?? 'Sin asignar'}
                    </span>
                  </p>
                </Surface>
              ) : (
                <p className="text-sm text-subtle">Elija un radicado para continuar con la asignación.</p>
              )}
            </div>
          ) : assignTicket ? (
            <div className="space-y-5">
              <Surface variant="muted" padding="md" radius="xl" className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <TableBadge tone={TYPE_TONE[assignTicket.tipo]}>{PQRS_TYPE_LABEL[assignTicket.tipo]}</TableBadge>
                  <TableBadge tone={STATUS_TONE[assignTicket.estado]}>
                    {PQRS_STATUS_LABEL[assignTicket.estado]}
                  </TableBadge>
                  <TableBadge tone={SLA_TONE[getPqrsSlaLevel(assignTicket, now)]}>
                    {PQRS_SLA_LABEL[getPqrsSlaLevel(assignTicket, now)]}
                  </TableBadge>
                </div>
                <p className="text-base font-semibold text-foreground">{assignTicket.asunto}</p>
                <p className="text-sm leading-relaxed text-subtle">{assignTicket.descripcion}</p>
                <p className="text-xs text-subtle">
                  Cliente
                  <span className="mt-0.5 block text-sm font-semibold text-foreground">
                    {assignTicket.cliente} · {assignTicket.sede}
                  </span>
                </p>
              </Surface>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <OptionCard
                  selected={assigneeKind === 'persona'}
                  title="Persona"
                  description="Asignar a un responsable"
                  icon={<UserRound size={15} />}
                  onClick={() => {
                    setAssigneeKind('persona');
                    setAssigneeId('');
                  }}
                />
                <OptionCard
                  selected={assigneeKind === 'area'}
                  title="Área"
                  description="Asignar a una estructura"
                  icon={<Building2 size={15} />}
                  onClick={() => {
                    setAssigneeKind('area');
                    setAssigneeId('');
                  }}
                />
              </div>

              {assigneeKind === 'persona' ? (
                <RegistryFormField label="Persona" required>
                  <SearchableSelect
                    value={assigneeId}
                    options={users.map((user) => ({
                      label: `${user.nombre} · ${user.cargo}`,
                      value: user.id,
                    }))}
                    placeholder="Seleccionar persona"
                    searchPlaceholder="Buscar persona..."
                    emptyOptionLabel="Sin asignar"
                    onChange={setAssigneeId}
                  />
                </RegistryFormField>
              ) : (
                <RegistryFormField label="Área" required>
                  <SearchableSelect
                    value={assigneeId}
                    options={areas.map((area) => ({
                      label: area.label,
                      value: area.id,
                    }))}
                    placeholder="Seleccionar área"
                    searchPlaceholder="Buscar área..."
                    emptyOptionLabel="Sin asignar"
                    onChange={setAssigneeId}
                  />
                </RegistryFormField>
              )}

              <RegistryFormField label="Nota de asignación">
                <textarea
                  value={assignmentNote}
                  onChange={(event) => setAssignmentNote(event.target.value)}
                  rows={3}
                  placeholder="Indicaciones para el área o la persona..."
                  className={`${inputClassName} resize-none`}
                />
              </RegistryFormField>

              <PqrsAttachmentsField
                files={assignAttachments}
                onAdd={(files) => setAssignAttachments((current) => [...current, ...files])}
                onRemove={(id) => setAssignAttachments((current) => current.filter((file) => file.id !== id))}
              />

              <ResponseFormButton onClick={() => openResponseDrawer(assignTicket)} />
            </div>
          ) : null}
        </Drawer>
      </div>
    </DashboardLayout>
  );
}
