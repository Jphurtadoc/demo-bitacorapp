import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from 'react';
import {
  Camera,
  Download,
  ImageUp,
  KeyRound,
  Pencil,
  Plus,
  ScrollText,
  Trash2,
  UserCheck,
  UserX,
  Users,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Drawer, DrawerTabs, type DrawerTabOption } from '@/components/UI/drawer';
import { ModalDrawer } from '@/components/UI/modal-drawer';
import { SearchableSelect } from '@/components/UI/searchable-select';
import { Surface } from '@/components/UI/surface';
import { EmphasisIcon } from '@/components/UI/emphasis';
import {
  DataTable,
  TableActions,
  TableBadge,
  TableRowActions,
  TableSearchInput,
  type TableBadgeTone,
  type TableColumn,
  type TableSortDirection,
} from '@/components/UI/table';
import { getUserAssignedClients } from '@/data/userAssignedClients';
import mockUsersData from '@/data/mockUsers.json';
import { type AdminUser, isClienteAdminUser } from '@/types/adminUser';
import type { AssignedClient } from '@/types/assignedClient';
import type { UserLog, UserLogType } from '@/types/userLog';
import { getUserLogs } from '@/data/userLogs';

const PAGE_SIZE = 5;

const PERFIL_OPTIONS = [
  'Super Admin',
  'Administrador',
  'Cliente Admin',
  'Supervisor',
  'Administrativo',
  'Seguridad y salud en el trabajo SST',
  'Contratista',
  'Vigilante',
  'Escolta',
  'Cliente Movil',
  'Miembro asociado',
] as const;

const inputClassName =
  'w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-border focus:ring-2 focus:ring-brand/10';

const inputErrorClassName =
  'w-full rounded-xl border border-red-300 bg-red-50/40 px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-red-400 focus:ring-2 focus:ring-red-100';

type StatusFilter = 'all' | 'active' | 'inactive';
type DrawerMode = 'detail' | 'create';
type DrawerTab = 'detalles' | 'clientes' | 'logs';
type ConfirmModalType = 'delete' | 'password';

interface PendingDrawerRestore {
  user: AdminUser;
  tab: DrawerTab;
}

const logTypeToneMap: Record<UserLogType, TableBadgeTone> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
};

const profileToneMap: Record<string, TableBadgeTone> = {
  'Super Admin': 'danger',
  Administrador: 'primary',
  'Cliente Admin': 'primary',
  Supervisor: 'info',
  Administrativo: 'neutral',
  'Seguridad y salud en el trabajo SST': 'warning',
  Contratista: 'info',
  Vigilante: 'success',
  Escolta: 'success',
  'Cliente Movil': 'neutral',
  'Miembro asociado': 'neutral',
};

function getProfileTone(perfil: string): TableBadgeTone {
  return profileToneMap[perfil] ?? 'neutral';
}

function getDefaultUserPhoto(nombre: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre)}&background=3C4070&color=fff`;
}

function createEmptyUser(clienteDefault = ''): AdminUser {
  return {
    id: '',
    photo: getDefaultUserPhoto('Nuevo Usuario'),
    nombre: '',
    perfil: '',
    cliente: clienteDefault,
    documento: '',
    estructura: '',
    cargo: '',
    email: '',
    nombreUsuario: '',
    ciudad: '',
    clientesAsignados: 0,
    activo: true,
  };
}

function formatCompactLogDate(fecha: string) {
  const [datePart, timePart] = fecha.split(' ');
  const [year, month, day] = datePart.split('-');

  return {
    date: `${day}/${month}/${year.slice(2)}`,
    time: timePart,
  };
}

function DrawerPanelFilters({ children }: { children: ReactNode }) {
  return (
    <Surface variant="muted" padding="sm" radius="xl" className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      {children}
    </Surface>
  );
}

function DrawerFilterField({
  label,
  children,
  className = '',
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`min-w-[140px] flex-1 ${className}`}>
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-subtle">
        {label}
      </p>
      {children}
    </div>
  );
}

function ConfirmModalContent({
  icon,
  iconClassName,
  children,
}: {
  icon: ReactNode;
  iconClassName: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-2 py-2 text-center">
      <div
        className={`flex h-20 w-20 items-center justify-center rounded-full ${iconClassName}`}
      >
        {icon}
      </div>
      <div className="mt-6 max-w-md">{children}</div>
    </div>
  );
}

function ConfirmModalFooter({
  onCancel,
  onConfirm,
  confirmLabel,
  confirmIcon,
  confirmClassName,
  confirmDisabled = false,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel: string;
  confirmIcon: ReactNode;
  confirmClassName: string;
  confirmDisabled?: boolean;
}) {
  return (
    <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-xl border border-border bg-surface px-5 py-3 text-base font-semibold text-foreground hover:bg-muted"
      >
        Cancelar
      </button>
      <button
        type="button"
        onClick={onConfirm}
        disabled={confirmDisabled}
        className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${confirmClassName}`}
      >
        {confirmIcon}
        {confirmLabel}
      </button>
    </div>
  );
}

function matchesSearch(user: AdminUser, query: string) {
  const value = query.trim().toLowerCase();
  if (!value) return true;

  return (
    user.nombre.toLowerCase().includes(value) ||
    user.documento.includes(query.trim()) ||
    user.nombreUsuario.toLowerCase().includes(value)
  );
}

function UserDetailField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Surface variant="muted" padding="sm" radius="xl">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-subtle">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </Surface>
  );
}

function UserFormField({
  label,
  required = false,
  error,
  className = '',
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-subtle">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>
      {children}
      {error ? <p className="mt-1 text-xs font-medium text-red-500">{error}</p> : null}
    </div>
  );
}

function validateUserDraft(draft: AdminUser): Record<string, string> {
  if (isClienteAdminUser(draft)) {
    return {};
  }

  const errors: Record<string, string> = {};

  if (!draft.perfil.trim()) errors.perfil = 'Este campo es requerido';
  if (!draft.cliente.trim()) errors.cliente = 'Este campo es requerido';
  if (!draft.documento.trim()) errors.documento = 'Este campo es requerido';
  if (!draft.nombre.trim()) errors.nombre = 'Este campo es requerido';
  if (!draft.email.trim()) errors.email = 'Este campo es requerido';
  if (!draft.nombreUsuario.trim()) errors.nombreUsuario = 'Este campo es requerido';
  if (!draft.ciudad.trim()) errors.ciudad = 'Este campo es requerido';

  return errors;
}

function UserAvatarEditor({
  photo,
  alt,
  editing,
  onPhotoClick,
}: {
  photo: string;
  alt: string;
  editing: boolean;
  onPhotoClick: () => void;
}) {
  return (
    <div className="relative w-fit">
      <div className="rounded-full border-2 border-dashed border-border p-1.5">
        <img
          src={photo}
          alt={alt}
          className="h-24 w-24 rounded-full border border-border object-cover"
        />
      </div>
      {editing ? (
        <button
          type="button"
          onClick={onPhotoClick}
          title="Cambiar foto de perfil"
          className="absolute bottom-2 right-0 flex h-9 w-9 translate-x-3 -translate-y-2 items-center justify-center rounded-full border-2 border-white bg-brand text-white shadow-md transition-colors hover:bg-brand-hover"
        >
          <Camera size={16} />
        </button>
      ) : null}
    </div>
  );
}

interface UserDetailsContentProps {
  user: AdminUser;
  editing: boolean;
  draft: AdminUser;
  errors: Record<string, string>;
  clienteOptions: string[];
  ciudadOptions: string[];
  creating?: boolean;
  onDraftChange: (draft: AdminUser) => void;
  onPhotoClick: () => void;
}

function UserDetailsContent({
  user,
  editing,
  draft,
  errors,
  clienteOptions,
  ciudadOptions,
  creating = false,
  onDraftChange,
  onPhotoClick,
}: UserDetailsContentProps) {
  const displayUser = editing ? draft : user;
  const isClienteAdmin = isClienteAdminUser(displayUser);

  const updateDraft = (patch: Partial<AdminUser>) => {
    const next = { ...draft, ...patch };
    if (creating && patch.nombre !== undefined) {
      next.photo = getDefaultUserPhoto(patch.nombre.trim() || 'Nuevo Usuario');
    }
    onDraftChange(next);
  };

  return (
    <div className="space-y-5">
      <Surface variant="muted" padding="lg" className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <UserAvatarEditor
          photo={displayUser.photo}
          alt={displayUser.nombre}
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
                <TableBadge tone={getProfileTone(displayUser.perfil)}>{displayUser.perfil}</TableBadge>
                <TableBadge tone={displayUser.activo ? 'success' : 'danger'}>
                  {displayUser.activo ? 'Activo' : 'Inactivo'}
                </TableBadge>
              </>
            )}
          </div>
          <p className="mt-2 text-sm font-semibold text-foreground">
            {displayUser.nombre || (creating ? 'Usuario sin nombre' : displayUser.nombre)}
          </p>
          <p className="mt-1 text-sm text-subtle">
            {displayUser.cargo || (creating ? 'Complete los datos del formulario' : displayUser.cargo)}
          </p>
        </div>
      </Surface>

      {editing ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <UserFormField label="Perfil" error={errors.perfil}>
            <SearchableSelect
              value={draft.perfil}
              options={PERFIL_OPTIONS.map((perfil) => ({ label: perfil, value: perfil }))}
              placeholder="Seleccionar perfil"
              searchPlaceholder="Buscar perfil..."
              emptyOptionLabel="Seleccionar"
              onChange={(value) => updateDraft({ perfil: value })}
            />
          </UserFormField>

          <UserFormField label="Cliente" error={errors.cliente}>
            <SearchableSelect
              value={draft.cliente}
              options={clienteOptions.map((cliente) => ({ label: cliente, value: cliente }))}
              placeholder="Seleccionar cliente"
              searchPlaceholder="Buscar cliente..."
              emptyOptionLabel="Seleccionar"
              onChange={(value) => updateDraft({ cliente: value })}
            />
          </UserFormField>

          {isClienteAdmin ? (
            <UserFormField label="Sede" className="sm:col-span-2">
              <input
                type="text"
                value={draft.sede ?? ''}
                onChange={(event) => updateDraft({ sede: event.target.value })}
                className={errors.sede ? inputErrorClassName : inputClassName}
                placeholder="Sede asignada"
              />
            </UserFormField>
          ) : (
            <>
              <UserFormField label="Documento" required error={errors.documento}>
                <input
                  type="text"
                  value={draft.documento}
                  onChange={(event) => updateDraft({ documento: event.target.value })}
                  className={errors.documento ? inputErrorClassName : inputClassName}
                />
              </UserFormField>

              <UserFormField label="Nombre completo" required error={errors.nombre}>
                <input
                  type="text"
                  value={draft.nombre}
                  onChange={(event) => updateDraft({ nombre: event.target.value })}
                  className={errors.nombre ? inputErrorClassName : inputClassName}
                />
              </UserFormField>

              <UserFormField label="E-mail" required error={errors.email}>
                <input
                  type="email"
                  value={draft.email}
                  onChange={(event) => updateDraft({ email: event.target.value })}
                  className={errors.email ? inputErrorClassName : inputClassName}
                />
              </UserFormField>

              <UserFormField label="Nombre de usuario" required error={errors.nombreUsuario}>
                <input
                  type="text"
                  value={draft.nombreUsuario}
                  onChange={(event) => updateDraft({ nombreUsuario: event.target.value })}
                  className={errors.nombreUsuario ? inputErrorClassName : inputClassName}
                />
              </UserFormField>

              <UserFormField label="Ciudad" required error={errors.ciudad}>
                <SearchableSelect
                  value={draft.ciudad}
                  options={ciudadOptions.map((ciudad) => ({ label: ciudad, value: ciudad }))}
                  placeholder="Seleccionar ciudad"
                  searchPlaceholder="Buscar ciudad..."
                  emptyOptionLabel="Seleccionar"
                  onChange={(value) => updateDraft({ ciudad: value })}
                />
              </UserFormField>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <UserDetailField label="Perfil" value={user.perfil} />
          <UserDetailField label="Cliente" value={user.cliente} />
          {isClienteAdminUser(user) ? (
            <UserDetailField label="Sede" value={user.sede ?? '—'} />
          ) : (
            <>
              <UserDetailField label="Documento" value={user.documento} />
              <UserDetailField label="Nombre completo" value={user.nombre} />
              <UserDetailField label="E-mail" value={user.email} />
              <UserDetailField label="Nombre de usuario" value={`@${user.nombreUsuario}`} />
              <UserDetailField label="Ciudad" value={user.ciudad} />
              <UserDetailField label="Estructura" value={user.estructura} />
              <UserDetailField label="Clientes asignados" value={user.clientesAsignados} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

type DrawerTabItem = DrawerTabOption<DrawerTab>;

function UserAssignedClientsContent({
  clients,
  onAssignClient,
}: {
  clients: AssignedClient[];
  onAssignClient: () => void;
}) {
  const [search, setSearch] = useState('');
  const [ciudadFilter, setCiudadFilter] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');

  useEffect(() => {
    setSearch('');
    setCiudadFilter('');
    setEstadoFilter('');
  }, [clients]);

  const ciudadOptions = useMemo(
    () => [...new Set(clients.map((client) => client.ciudad))].sort(),
    [clients],
  );

  const filteredClients = useMemo(() => {
    const query = search.trim().toLowerCase();

    return clients.filter((client) => {
      const matchesSearch =
        !query ||
        client.nombre.toLowerCase().includes(query) ||
        client.nit.toLowerCase().includes(query) ||
        client.contacto.toLowerCase().includes(query);

      const matchesCiudad = !ciudadFilter || client.ciudad === ciudadFilter;
      const matchesEstado =
        !estadoFilter ||
        (estadoFilter === 'active' && client.activo) ||
        (estadoFilter === 'inactive' && !client.activo);

      return matchesSearch && matchesCiudad && matchesEstado;
    });
  }, [ciudadFilter, clients, estadoFilter, search]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-subtle">
          {filteredClients.length} de {clients.length} cliente
          {clients.length === 1 ? '' : 's'} asignado
          {clients.length === 1 ? '' : 's'}
        </p>
        <button
          type="button"
          onClick={onAssignClient}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-3.5 py-2 text-sm font-semibold text-white hover:bg-brand-hover"
        >
          <Plus size={16} />
          Asignar cliente
        </button>
      </div>

      <DrawerPanelFilters>
        <DrawerFilterField label="Buscar" className="sm:min-w-[220px] sm:flex-[1.4]">
          <TableSearchInput
            value={search}
            placeholder="Buscar por nombre, NIT o contacto..."
            onChange={setSearch}
            className="max-w-none"
          />
        </DrawerFilterField>
        <DrawerFilterField label="Ciudad">
          <SearchableSelect
            value={ciudadFilter}
            options={ciudadOptions.map((ciudad) => ({ label: ciudad, value: ciudad }))}
            placeholder="Todos"
            searchPlaceholder="Buscar ciudad..."
            onChange={setCiudadFilter}
          />
        </DrawerFilterField>
        <DrawerFilterField label="Estado">
          <SearchableSelect
            value={estadoFilter}
            options={[
              { label: 'Activos', value: 'active' },
              { label: 'Inactivos', value: 'inactive' },
            ]}
            placeholder="Todos"
            searchPlaceholder="Buscar estado..."
            emptyOptionLabel="Todos"
            onChange={setEstadoFilter}
          />
        </DrawerFilterField>
      </DrawerPanelFilters>

      <Surface radius="xl" className="overflow-hidden">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/80">
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-subtle">
                Cliente
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-subtle">
                NIT
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-subtle">
                Ciudad
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-subtle">
                Estado
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length ? (
              filteredClients.map((client) => (
                <tr key={client.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-foreground">{client.nombre}</p>
                    <p className="mt-0.5 text-xs text-subtle">{client.contacto}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-subtle">{client.nit}</td>
                  <td className="px-4 py-3 text-sm text-subtle">{client.ciudad}</td>
                  <td className="px-4 py-3">
                    <TableBadge tone={client.activo ? 'success' : 'danger'}>
                      {client.activo ? 'Activo' : 'Inactivo'}
                    </TableBadge>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-subtle">
                  No se encontraron clientes con los filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Surface>
    </div>
  );
}

function UserLogsContent({ logs }: { logs: UserLog[] }) {
  const [search, setSearch] = useState('');
  const [moduloFilter, setModuloFilter] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');

  useEffect(() => {
    setSearch('');
    setModuloFilter('');
    setTipoFilter('');
  }, [logs]);

  const moduloOptions = useMemo(
    () => [...new Set(logs.map((log) => log.modulo))].sort(),
    [logs],
  );

  const filteredLogs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return logs.filter((log) => {
      const matchesSearch =
        !query ||
        log.accion.toLowerCase().includes(query) ||
        log.detalle.toLowerCase().includes(query) ||
        log.modulo.toLowerCase().includes(query) ||
        log.ip.includes(query);

      const matchesModulo = !moduloFilter || log.modulo === moduloFilter;
      const matchesTipo = !tipoFilter || log.tipo === tipoFilter;

      return matchesSearch && matchesModulo && matchesTipo;
    });
  }, [logs, moduloFilter, search, tipoFilter]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-subtle">
        {filteredLogs.length} de {logs.length} registro
        {logs.length === 1 ? '' : 's'} de actividad
      </p>

      <DrawerPanelFilters>
        <DrawerFilterField label="Buscar" className="sm:min-w-[220px] sm:flex-[1.4]">
          <TableSearchInput
            value={search}
            placeholder="Buscar por acción, detalle, módulo o IP..."
            onChange={setSearch}
            className="max-w-none"
          />
        </DrawerFilterField>
        <DrawerFilterField label="Módulo">
          <SearchableSelect
            value={moduloFilter}
            options={moduloOptions.map((modulo) => ({ label: modulo, value: modulo }))}
            placeholder="Todos"
            searchPlaceholder="Buscar módulo..."
            onChange={setModuloFilter}
          />
        </DrawerFilterField>
        <DrawerFilterField label="Tipo">
          <SearchableSelect
            value={tipoFilter}
            options={[
              { label: 'Éxito', value: 'success' },
              { label: 'Información', value: 'info' },
              { label: 'Advertencia', value: 'warning' },
              { label: 'Crítico', value: 'danger' },
            ]}
            placeholder="Todos"
            searchPlaceholder="Buscar tipo..."
            emptyOptionLabel="Todos"
            onChange={setTipoFilter}
          />
        </DrawerFilterField>
      </DrawerPanelFilters>

      <Surface radius="xl" className="overflow-hidden">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/80">
              <th className="w-[72px] px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-subtle">
                Fecha
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-subtle">
                Acción
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-subtle">
                Módulo
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-subtle">
                Detalle
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-subtle">
                IP
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length ? (
              filteredLogs.map((log) => {
                const { date, time } = formatCompactLogDate(log.fecha);

                return (
                  <tr key={log.id} className="border-b border-border last:border-b-0">
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <p className="text-[11px] font-semibold leading-tight text-foreground">{date}</p>
                      <p className="text-[10px] leading-tight text-subtle">{time}</p>
                    </td>
                    <td className="px-4 py-3">
                      <TableBadge tone={logTypeToneMap[log.tipo]}>{log.accion}</TableBadge>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">{log.modulo}</td>
                    <td className="px-4 py-3 text-sm text-subtle">{log.detalle}</td>
                    <td className="px-4 py-3 text-xs font-mono text-subtle">{log.ip}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-subtle">
                  No se encontraron logs con los filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Surface>
    </div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(mockUsersData as AdminUser[]);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<string | null>('nombre');
  const [sortDirection, setSortDirection] = useState<TableSortDirection>('asc');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [rolFilter, setRolFilter] = useState('');
  const [clienteFilter, setClienteFilter] = useState('');
  const [ciudadFilter, setCiudadFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('detail');
  const [drawerTab, setDrawerTab] = useState<DrawerTab>('detalles');
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [userDraft, setUserDraft] = useState<AdminUser | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [photoModalUser, setPhotoModalUser] = useState<AdminUser | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoRemoved, setPhotoRemoved] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [confirmModalType, setConfirmModalType] = useState<ConfirmModalType | null>(null);
  const [confirmModalUser, setConfirmModalUser] = useState<AdminUser | null>(null);
  const [pendingDrawerRestore, setPendingDrawerRestore] = useState<PendingDrawerRestore | null>(
    null,
  );

  const rolOptions = useMemo(() => {
    const extraProfiles = users
      .map((user) => user.perfil)
      .filter((perfil) => !PERFIL_OPTIONS.includes(perfil as (typeof PERFIL_OPTIONS)[number]));

    return [...PERFIL_OPTIONS, ...extraProfiles];
  }, [users]);

  const clienteOptions = useMemo(
    () => [...new Set(users.map((user) => user.cliente))].sort(),
    [users],
  );

  const ciudadOptions = useMemo(
    () => [...new Set(users.map((user) => user.ciudad))].sort(),
    [users],
  );

  const userStats = useMemo(
    () => ({
      total: users.length,
      activos: users.filter((user) => user.activo).length,
      inactivos: users.filter((user) => !user.activo).length,
    }),
    [users],
  );

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && user.activo) ||
        (statusFilter === 'inactive' && !user.activo);

      return (
        matchesStatus &&
        matchesSearch(user, search) &&
        (!rolFilter || user.perfil === rolFilter) &&
        (!clienteFilter || user.cliente === clienteFilter) &&
        (!ciudadFilter || user.ciudad === ciudadFilter)
      );
    });
  }, [ciudadFilter, clienteFilter, rolFilter, search, statusFilter, users]);

  const sortedUsers = useMemo(() => {
    if (!sortKey || !sortDirection) return filteredUsers;

    return [...filteredUsers].sort((a, b) => {
      const aValue = a[sortKey as keyof AdminUser];
      const bValue = b[sortKey as keyof AdminUser];

      if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        const left = aValue ? 1 : 0;
        const right = bValue ? 1 : 0;
        return sortDirection === 'asc' ? left - right : right - left;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const left = String(aValue).toLowerCase();
      const right = String(bValue).toLowerCase();
      if (left < right) return sortDirection === 'asc' ? -1 : 1;
      if (left > right) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredUsers, sortDirection, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedUsers.slice(start, start + PAGE_SIZE);
  }, [currentPage, sortedUsers]);

  const resetPage = () => setPage(1);

  const openUserDrawer = (user: AdminUser, tab: DrawerTab = 'detalles') => {
    setDrawerMode('detail');
    setSelectedUser(user);
    setDrawerTab(tab);
    setIsEditingUser(false);
    setUserDraft(null);
    setFormErrors({});
    setDrawerOpen(true);
  };

  const openCreateUserDrawer = () => {
    setDrawerMode('create');
    setSelectedUser(null);
    setDrawerTab('detalles');
    setIsEditingUser(true);
    setUserDraft(createEmptyUser(clienteOptions[0] ?? ''));
    setFormErrors({});
    setDrawerOpen(true);
  };

  const closeUserDrawer = () => {
    setDrawerOpen(false);
    setDrawerMode('detail');
    setSelectedUser(null);
    setDrawerTab('detalles');
    setIsEditingUser(false);
    setUserDraft(null);
    setFormErrors({});
    setPhotoModalOpen(false);
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoRemoved(false);
    setPhotoModalUser(null);
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const startEditingUser = () => {
    if (!selectedUser) return;
    setUserDraft({ ...selectedUser });
    setFormErrors({});
    setIsEditingUser(true);
  };

  const cancelEditingUser = () => {
    setIsEditingUser(false);
    setUserDraft(null);
    setFormErrors({});
  };

  const saveEditingUser = () => {
    if (!userDraft || !selectedUser) return;

    const errors = validateUserDraft(userDraft);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const updatedUser = { ...userDraft };
    setUsers((current) =>
      current.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
    );
    setSelectedUser(updatedUser);
    setIsEditingUser(false);
    setUserDraft(null);
    setFormErrors({});
  };

  const saveCreateUser = () => {
    if (!userDraft || drawerMode !== 'create') return;

    const errors = validateUserDraft(userDraft);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const nextId = String(
      users.reduce((max, user) => Math.max(max, Number.parseInt(user.id, 10) || 0), 0) + 1,
    );

    const newUser: AdminUser = {
      ...userDraft,
      id: nextId,
      photo: userDraft.photo || getDefaultUserPhoto(userDraft.nombre),
      estructura: userDraft.estructura || 'Sin asignar',
      cargo: userDraft.cargo || userDraft.perfil,
    };

    setUsers((current) => [newUser, ...current]);
    closeUserDrawer();
    openUserDrawer(newUser);
  };

  const openPhotoModalForUser = (user: AdminUser) => {
    setPhotoModalUser(user);
    setPhotoFile(null);
    setPhotoRemoved(false);
    setPhotoPreview(user.photo);
    setPhotoModalOpen(true);
  };

  const openPhotoModal = () => {
    if (!isEditingUser || !userDraft) return;
    openPhotoModalForUser(userDraft);
  };

  const closePhotoModal = () => {
    setPhotoModalOpen(false);
    setPhotoModalUser(null);
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoRemoved(false);
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const handlePhotoFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) return;

    setPhotoFile(file);
    setPhotoRemoved(false);
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(typeof reader.result === 'string' ? reader.result : null);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoRemoved(true);
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const confirmPhotoUpload = () => {
    const targetUser = photoModalUser ?? userDraft;
    if (!targetUser) return;

    let newPhoto = targetUser.photo;

    if (photoRemoved) {
      newPhoto = getDefaultUserPhoto(targetUser.nombre);
    } else if (photoPreview) {
      newPhoto = photoPreview;
    } else {
      return;
    }

    const updatedUser = { ...targetUser, photo: newPhoto };

    if (isEditingUser && userDraft?.id === updatedUser.id) {
      setUserDraft(updatedUser);
    } else {
      setUsers((current) =>
        current.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
      );

      if (selectedUser?.id === updatedUser.id) {
        setSelectedUser(updatedUser);
      }
    }

    closePhotoModal();
  };

  const restoreDrawerIfNeeded = () => {
    if (!pendingDrawerRestore) return;

    setSelectedUser(pendingDrawerRestore.user);
    setDrawerTab(pendingDrawerRestore.tab);
    setDrawerOpen(true);
    setPendingDrawerRestore(null);
  };

  const openConfirmModal = (type: ConfirmModalType, user: AdminUser) => {
    setConfirmModalType(type);
    setConfirmModalUser(user);

    if (drawerOpen && selectedUser) {
      setPendingDrawerRestore({ user: selectedUser, tab: drawerTab });
      setDrawerOpen(false);
      return;
    }

    setPendingDrawerRestore(null);
  };

  const closeConfirmModal = () => {
    setConfirmModalType(null);
    setConfirmModalUser(null);
    restoreDrawerIfNeeded();
  };

  const handleConfirmModalAction = () => {
    setConfirmModalType(null);
    setConfirmModalUser(null);
    restoreDrawerIfNeeded();
  };

  const getDrawerUserActions = () => [
    {
      label: 'Editar',
      icon: Pencil,
      tooltip: 'Editar usuario',
      onClick: startEditingUser,
    },
    {
      label: 'Eliminar',
      icon: Trash2,
      tooltip: 'Eliminar usuario',
      variant: 'danger' as const,
      onClick: () => {
        if (selectedUser) openConfirmModal('delete', selectedUser);
      },
    },
    {
      label: 'Cambiar contraseña',
      icon: KeyRound,
      tooltip: 'Cambiar contraseña',
      onClick: () => {
        if (selectedUser) openConfirmModal('password', selectedUser);
      },
    },
  ];

  const selectedUserClients = useMemo(
    () => (selectedUser ? getUserAssignedClients(selectedUser.id) : []),
    [selectedUser],
  );

  const selectedUserLogs = useMemo(
    () => (selectedUser ? getUserLogs(selectedUser.id) : []),
    [selectedUser],
  );

  const showAssignedClientsTab = Boolean(
    selectedUser && selectedUser.clientesAsignados > 0 && selectedUserClients.length > 0,
  );

  const drawerTabs = useMemo<DrawerTabItem[]>(() => {
    const tabs: DrawerTabItem[] = [{ id: 'detalles', label: 'Detalles' }];

    if (showAssignedClientsTab) {
      tabs.push({
        id: 'clientes',
        label: 'Clientes asignados',
        count: selectedUserClients.length,
      });
    }

    tabs.push({
      id: 'logs',
      label: 'Logs',
      count: selectedUserLogs.length,
    });

    return tabs;
  }, [selectedUserClients.length, selectedUserLogs.length, showAssignedClientsTab]);

  useEffect(() => {
    if (!drawerOpen) return;

    const availableTabIds = drawerTabs.map((tab) => tab.id);
    if (!availableTabIds.includes(drawerTab)) {
      setDrawerTab('detalles');
    }
  }, [drawerOpen, drawerTab, drawerTabs]);

  const handleDrawerTabChange = (tab: DrawerTab) => {
    setDrawerTab(tab);

    if (isEditingUser) {
      setIsEditingUser(false);
      setUserDraft(null);
      setFormErrors({});
    }
  };

  const renderDrawerTabContent = () => {
    if (drawerMode === 'create' && userDraft) {
      return (
        <UserDetailsContent
          user={userDraft}
          editing
          creating
          draft={userDraft}
          errors={formErrors}
          clienteOptions={clienteOptions}
          ciudadOptions={ciudadOptions}
          onDraftChange={setUserDraft}
          onPhotoClick={openPhotoModal}
        />
      );
    }

    if (!selectedUser) return null;

    if (drawerTab === 'clientes' && showAssignedClientsTab) {
      return (
        <UserAssignedClientsContent
          clients={selectedUserClients}
          onAssignClient={() => undefined}
        />
      );
    }

    if (drawerTab === 'logs') {
      return <UserLogsContent logs={selectedUserLogs} />;
    }

    return (
      <UserDetailsContent
        user={selectedUser}
        editing={isEditingUser}
        draft={userDraft ?? selectedUser}
        errors={formErrors}
        clienteOptions={clienteOptions}
        ciudadOptions={ciudadOptions}
        onDraftChange={setUserDraft}
        onPhotoClick={openPhotoModal}
      />
    );
  };

  const getRowActions = (user: AdminUser) => [
    {
      label: 'Editar',
      icon: Pencil,
      tooltip: 'Editar usuario',
      onClick: () => openUserDrawer(user),
    },
    {
      label: 'Eliminar',
      icon: Trash2,
      tooltip: 'Eliminar usuario',
      variant: 'danger' as const,
      onClick: () => openConfirmModal('delete', user),
    },
    {
      label: 'Cambiar contraseña',
      icon: KeyRound,
      tooltip: 'Cambiar contraseña',
      onClick: () => openConfirmModal('password', user),
    },
    {
      label: 'Logs del usuario',
      icon: ScrollText,
      tooltip: 'Ver logs del usuario',
      onClick: () => openUserDrawer(user, 'logs'),
    },
    {
      label: 'Actualizar foto',
      icon: Camera,
      tooltip: 'Actualizar foto de perfil',
      onClick: () => openPhotoModalForUser(user),
    },
  ];

  const statCards = [
    {
      label: 'Total',
      value: userStats.total,
      icon: <Users size={15} />,
      tone: 'brand' as const,
    },
    {
      label: 'Activos',
      value: userStats.activos,
      icon: <UserCheck size={15} />,
      tone: 'success' as const,
    },
    {
      label: 'Inactivos',
      value: userStats.inactivos,
      icon: <UserX size={15} />,
      tone: 'danger' as const,
    },
  ];

  const columns: TableColumn<AdminUser>[] = [
    {
      key: 'photo',
      label: 'Foto',
      width: '72px',
      render: (user) => (
        <img
          src={user.photo}
          alt={user.nombre}
          className="h-9 w-9 rounded-full border border-border object-cover"
        />
      ),
    },
    { key: 'nombre', label: 'Nombre', sortable: true, width: '170px' },
    {
      key: 'perfil',
      label: 'Perfil',
      sortable: true,
      width: '130px',
      render: (user) => <TableBadge tone={getProfileTone(user.perfil)}>{user.perfil}</TableBadge>,
    },
    { key: 'cliente', label: 'Cliente', sortable: true, width: '150px' },
    { key: 'documento', label: 'Documento', sortable: true, width: '120px' },
    { key: 'estructura', label: 'Estructura', sortable: true, width: '170px' },
    { key: 'cargo', label: 'Cargo', sortable: true, width: '160px' },
    {
      key: 'email',
      label: 'E-mail',
      sortable: true,
      width: '210px',
      render: (user) => (
        <a
          href={`mailto:${user.email}`}
          className="text-brand hover:underline"
          onClick={(event) => event.stopPropagation()}
        >
          {user.email}
        </a>
      ),
    },
    { key: 'nombreUsuario', label: 'Nombre de usuario', sortable: true, width: '140px' },
    { key: 'ciudad', label: 'Ciudad', sortable: true, width: '120px' },
    {
      key: 'clientesAsignados',
      label: 'Clientes asignados',
      sortable: true,
      align: 'center',
      width: '130px',
      render: (user) => (
        <TableBadge tone={user.clientesAsignados >= 8 ? 'primary' : 'neutral'}>
          {user.clientesAsignados}
        </TableBadge>
      ),
    },
    {
      key: 'activo',
      label: 'Estado',
      sortable: true,
      width: '100px',
      render: (user) => (
        <TableBadge tone={user.activo ? 'success' : 'danger'}>
          {user.activo ? 'Activo' : 'Inactivo'}
        </TableBadge>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      width: '220px',
      align: 'right',
      render: (user) => <TableRowActions items={getRowActions(user)} />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1600px] pb-6">
        <DataTable
          title="Usuarios"
          subtitle="Gestión de usuarios, perfiles y asignación de clientes."
          columns={columns}
          data={paginatedUsers}
          onRowClick={openUserDrawer}
          tabs={[
            { id: 'all', label: 'Todos', count: userStats.total, badgeTone: 'neutral' },
            { id: 'active', label: 'Activos', count: userStats.activos, badgeTone: 'success' },
            { id: 'inactive', label: 'Inactivos', count: userStats.inactivos, badgeTone: 'danger' },
          ]}
          activeTab={statusFilter}
          onTabChange={(tabId) => {
            setStatusFilter(tabId as StatusFilter);
            resetPage();
          }}
          headerSlot={
            <div className="grid grid-cols-3 gap-3">
              {statCards.map((stat) => (
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
          searchPlaceholder="Buscar por nombre, documento o nombre de usuario..."
          onSearchChange={(value) => {
            setSearch(value);
            resetPage();
          }}
          filters={[
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
          metaLabel={`Mostrando ${sortedUsers.length} de ${users.length} usuarios`}
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
              tooltip: 'Exportar listado de usuarios',
              onClick: () => undefined,
            },
            {
              label: 'Nuevo usuario',
              icon: Plus,
              tooltip: 'Crear un nuevo usuario',
              variant: 'primary',
              showLabel: true,
              onClick: () => openCreateUserDrawer(),
            },
          ]}
          pagination={{
            page: currentPage,
            pageSize: PAGE_SIZE,
            total: sortedUsers.length,
            onPageChange: setPage,
          }}
          emptyMessage="No se encontraron usuarios con los filtros aplicados."
        />

        <Drawer
          open={drawerOpen}
          onClose={closeUserDrawer}
          title={drawerMode === 'create' ? 'Nuevo usuario' : 'Detalles de usuario'}
          subtitle={
            drawerMode === 'create'
              ? 'Complete la información para registrar un nuevo usuario.'
              : undefined
          }
          size="lg"
          headerBottom={
            drawerMode === 'detail' && selectedUser ? (
              <DrawerTabs
                tabs={drawerTabs}
                activeTab={drawerTab}
                onChange={handleDrawerTabChange}
              />
            ) : undefined
          }
          footer={
            drawerMode === 'create' ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-medium text-subtle">
                  Los campos marcados con * son obligatorios
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={closeUserDrawer}
                    className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={saveCreateUser}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-[#ffffff] hover:bg-brand-hover dark:bg-primary dark:hover:bg-primary-hover"
                  >
                    <Plus size={16} />
                    Crear usuario
                  </button>
                </div>
              </div>
            ) : selectedUser ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                {isEditingUser ? (
                  <>
                    <p className="text-sm font-medium text-subtle">
                      Editando información del usuario
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={cancelEditingUser}
                        className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={saveEditingUser}
                        className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
                      >
                        Guardar cambios
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <TableActions items={getDrawerUserActions()} />
                    <button
                      type="button"
                      onClick={closeUserDrawer}
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
          {renderDrawerTabContent()}
        </Drawer>

        <ModalDrawer
          open={confirmModalType === 'delete'}
          onClose={closeConfirmModal}
          showCloseButton={false}
          size="sm"
          footer={
            <ConfirmModalFooter
              onCancel={closeConfirmModal}
              onConfirm={handleConfirmModalAction}
              confirmLabel="Eliminar"
              confirmIcon={<Trash2 size={18} />}
              confirmClassName="danger-confirm-btn"
            />
          }
        >
          {confirmModalUser ? (
            <ConfirmModalContent
              icon={<Trash2 size={36} strokeWidth={1.75} />}
              iconClassName="danger-icon-badge"
            >
              <p className="text-base leading-relaxed text-subtle">
                ¿Está seguro de que desea eliminar a{' '}
                <span className="font-semibold text-foreground">{confirmModalUser.nombre}</span>? Esta
                acción no se puede deshacer.
              </p>
            </ConfirmModalContent>
          ) : null}
        </ModalDrawer>

        <ModalDrawer
          open={confirmModalType === 'password'}
          onClose={closeConfirmModal}
          showCloseButton={false}
          size="sm"
          footer={
            <ConfirmModalFooter
              onCancel={closeConfirmModal}
              onConfirm={handleConfirmModalAction}
              confirmLabel="Restablecer"
              confirmIcon={<KeyRound size={18} />}
              confirmClassName="bg-brand hover:bg-brand-hover"
            />
          }
        >
          {confirmModalUser ? (
            <ConfirmModalContent
              icon={<KeyRound size={36} strokeWidth={1.75} />}
              iconClassName="bg-brand/10 text-brand"
            >
              <p className="text-base leading-relaxed text-subtle">
                Se restablecerá la contraseña de{' '}
                <span className="font-semibold text-foreground">{confirmModalUser.nombre}</span> y se
                enviará un enlace temporal a{' '}
                <span className="font-semibold text-foreground">{confirmModalUser.email}</span>.
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
              confirmClassName={
                photoRemoved ? 'danger-confirm-btn' : 'bg-brand hover:bg-brand-hover'
              }
              confirmDisabled={!photoFile && !photoRemoved}
            />
          }
        >
          <div className="flex flex-col items-center px-2 py-2 text-center">
            <p className="max-w-md text-base leading-relaxed text-subtle">
              Seleccione una imagen para actualizar la foto de perfil del usuario.
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
                title="Cambiar foto de perfil"
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
                onClick={handleRemovePhoto}
                className="danger-outline-btn mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"
              >
                <Trash2 size={16} />
                Eliminar imagen
              </button>
            ) : null}

            {photoRemoved ? (
              <p className="mt-4 text-sm text-subtle">
                La imagen se eliminará al confirmar. Puede seleccionar otra si lo desea.
              </p>
            ) : null}
          </div>
        </ModalDrawer>
      </div>
    </DashboardLayout>
  );
}
