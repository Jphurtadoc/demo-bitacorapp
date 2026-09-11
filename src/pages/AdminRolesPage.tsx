import { useMemo, useState } from 'react';
import { KeyRound, Pencil, Plus, Shield, ShieldCheck, ShieldOff, Trash2 } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Drawer } from '@/components/UI/drawer';
import { ModalDrawer } from '@/components/UI/modal-drawer';
import { EmphasisIcon } from '@/components/UI/emphasis';
import { Surface } from '@/components/UI/surface';
import { Switch } from '@/components/UI/switch';
import { TransferList } from '@/components/UI/transfer-list';
import {
  DataTable,
  TableBadge,
  TableRowActions,
  type TableColumn,
  type TableSortDirection,
} from '@/components/UI/table';
import mockSystemRolesData from '@/data/mockSystemRoles.json';
import type { SystemPermission, SystemRole, SystemRoleScope } from '@/types/systemRole';
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

type ScopeTab = SystemRoleScope;

interface AdminRolesPageProps {
  embedded?: boolean;
}

interface SystemRolesCatalog {
  permissions: SystemPermission[];
  roles: SystemRole[];
}

const catalog = mockSystemRolesData as SystemRolesCatalog;

function createEmptyRole(scope: SystemRoleScope): SystemRole {
  return {
    id: '',
    name: '',
    code: '',
    description: '',
    scope,
    permissionIds: [],
    isSystem: false,
    activo: true,
  };
}

function validateRoleDraft(draft: SystemRole): Record<string, string> {
  const errors: Record<string, string> = {};
  const code = draft.code.trim();
  if (!draft.name.trim()) errors.name = 'Este campo es requerido';
  if (!code) {
    errors.code = 'Este campo es requerido';
  } else if (!/^[a-z][a-z0-9_]*$/.test(code)) {
    errors.code = 'Usa minúsculas, números y guion bajo';
  }
  return errors;
}

function slugifyRoleCode(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/**
 * Root-admin page to manage platform roles and default tenant roles.
 * Permissions are assigned with a left/right transfer list.
 */
export default function AdminRolesPage({ embedded = false }: AdminRolesPageProps) {
  const [roles, setRoles] = useState<SystemRole[]>(catalog.roles);
  const permissions = catalog.permissions;

  const [scopeTab, setScopeTab] = useState<ScopeTab>('platform');
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
  const [selectedRole, setSelectedRole] = useState<SystemRole | null>(null);
  const [roleDraft, setRoleDraft] = useState<SystemRole | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<SystemRole | null>(null);

  const scopePermissions = useMemo(
    () => permissions.filter((permission) => permission.scope === scopeTab),
    [permissions, scopeTab],
  );

  const scopedRoles = useMemo(
    () => roles.filter((role) => role.scope === scopeTab),
    [roles, scopeTab],
  );

  const filteredRoles = useMemo(() => {
    const query = search.trim().toLowerCase();
    let next = scopedRoles.filter((role) => {
      if (statusFilter === 'active' && !role.activo) return false;
      if (statusFilter === 'inactive' && role.activo) return false;
      if (!query) return true;
      const haystack = `${role.name} ${role.code} ${role.description}`.toLowerCase();
      return haystack.includes(query);
    });

    if (sortKey) {
      next = [...next].sort((left, right) => {
        const leftValue = String(left[sortKey as keyof SystemRole] ?? '');
        const rightValue = String(right[sortKey as keyof SystemRole] ?? '');
        const comparison = leftValue.localeCompare(rightValue, 'es', { sensitivity: 'base' });
        return sortDirection === 'desc' ? -comparison : comparison;
      });
    }

    return next;
  }, [scopedRoles, search, statusFilter, sortKey, sortDirection]);

  const paginatedRoles = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRoles.slice(start, start + pageSize);
  }, [filteredRoles, page, pageSize]);

  const stats = useMemo(() => {
    const total = scopedRoles.length;
    const activos = scopedRoles.filter((role) => role.activo).length;
    return { total, activos, inactivos: total - activos };
  }, [scopedRoles]);

  const statCards = [
    {
      label: 'Total',
      value: stats.total,
      icon: <KeyRound size={15} />,
      tone: 'brand' as const,
    },
    {
      label: 'Activos',
      value: stats.activos,
      icon: <ShieldCheck size={15} />,
      tone: 'success' as const,
    },
    {
      label: 'Inactivos',
      value: stats.inactivos,
      icon: <ShieldOff size={15} />,
      tone: 'danger' as const,
    },
  ];

  const resetPage = () => setPage(1);

  const openCreateDrawer = () => {
    setDrawerMode('create');
    setIsEditing(true);
    setFormErrors({});
    setSelectedRole(null);
    setRoleDraft(createEmptyRole(scopeTab));
    setDrawerOpen(true);
  };

  const openRoleDrawer = (role: SystemRole) => {
    setDrawerMode('detail');
    setIsEditing(false);
    setFormErrors({});
    setSelectedRole(role);
    setRoleDraft({ ...role, permissionIds: [...role.permissionIds] });
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedRole(null);
    setRoleDraft(null);
    setFormErrors({});
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!roleDraft) return;
    const errors = validateRoleDraft(roleDraft);
    const duplicate = roles.some(
      (role) =>
        role.scope === roleDraft.scope &&
        role.code === roleDraft.code.trim() &&
        role.id !== roleDraft.id,
    );
    if (duplicate) errors.code = 'Ya existe un rol con este código';
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const payload: SystemRole = {
      ...roleDraft,
      name: roleDraft.name.trim(),
      code: roleDraft.code.trim(),
      description: roleDraft.description.trim(),
      permissionIds: [...roleDraft.permissionIds],
    };

    if (drawerMode === 'create') {
      const id = nextRecordId(roles.map((role) => role.id));
      setRoles((current) => [...current, { ...payload, id }]);
    } else {
      setRoles((current) =>
        current.map((role) => (role.id === payload.id ? { ...payload, isSystem: role.isSystem } : role)),
      );
    }

    closeDrawer();
  };

  const handleToggleActive = (role: SystemRole) => {
    setRoles((current) =>
      current.map((item) => (item.id === role.id ? { ...item, activo: !item.activo } : item)),
    );
  };

  const handleConfirmDelete = () => {
    if (!confirmDelete || confirmDelete.isSystem) return;
    setRoles((current) => {
      const next = current.filter((role) => role.id !== confirmDelete.id);
      const remainingInScope = next.filter((role) => role.scope === scopeTab).length;
      const maxPage = Math.max(1, Math.ceil(remainingInScope / pageSize));
      setPage((currentPage) => Math.min(currentPage, maxPage));
      return next;
    });
    if (selectedRole?.id === confirmDelete.id) closeDrawer();
    setConfirmDelete(null);
  };

  const permissionLabelById = useMemo(() => {
    const map = new Map(permissions.map((permission) => [permission.id, permission.label]));
    return map;
  }, [permissions]);

  const transferItems = useMemo(
    () =>
      scopePermissions.map((permission) => ({
        id: permission.id,
        label: permission.label,
        description: permission.code,
        group: permission.module,
      })),
    [scopePermissions],
  );

  const columns: TableColumn<SystemRole>[] = [
    {
      key: 'name',
      label: 'Rol',
      sortable: true,
      render: (role) => (
        <div>
          <p className="font-semibold text-foreground">{role.name}</p>
          <p className="text-xs text-subtle">{role.code}</p>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Descripción',
      sortable: true,
      render: (role) => <span className="text-sm text-subtle">{role.description || '—'}</span>,
    },
    {
      key: 'permissionIds',
      label: 'Permisos',
      align: 'center',
      width: '110px',
      render: (role) => (
        <TableBadge tone="primary">{role.permissionIds.length}</TableBadge>
      ),
    },
    {
      key: 'isSystem',
      label: 'Tipo',
      width: '120px',
      render: (role) => (
        <TableBadge tone={role.isSystem ? 'neutral' : 'info'}>
          {role.isSystem ? 'Sistema' : 'Personalizado'}
        </TableBadge>
      ),
    },
    {
      key: 'activo',
      label: 'Estado',
      sortable: true,
      width: '100px',
      render: (role) => (
        <TableBadge tone={role.activo ? 'success' : 'danger'}>
          {role.activo ? 'Activo' : 'Inactivo'}
        </TableBadge>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      width: '180px',
      align: 'right',
      render: (role) => (
        <TableRowActions
          items={[
            {
              label: 'Editar',
              icon: Pencil,
              tooltip: 'Editar rol',
              onClick: () => {
                openRoleDrawer(role);
                setIsEditing(true);
              },
            },
            {
              label: role.activo ? 'Desactivar' : 'Activar',
              icon: Shield,
              tooltip: role.activo ? 'Desactivar' : 'Activar',
              onClick: () => handleToggleActive(role),
            },
            {
              label: 'Eliminar',
              icon: Trash2,
              tooltip: role.isSystem ? 'Rol de sistema' : 'Eliminar',
              variant: 'danger',
              disabled: role.isSystem,
              onClick: () => setConfirmDelete(role),
            },
          ]}
        />
      ),
    },
  ];

  const tableSubtitle =
    scopeTab === 'platform'
      ? 'Roles de la empresa dueña de la plataforma (root / operaciones).'
      : 'Roles por defecto que se asignan a los tenants al crearlos.';

  const displayRole = isEditing ? roleDraft : selectedRole;
  const canEditPermissions = isEditing && roleDraft != null;

  const pageContent = (
    <div className={embedded ? 'pb-2' : 'mx-auto max-w-[1600px] pb-6'}>
      <DataTable
        title="Roles del sistema"
        subtitle={tableSubtitle}
        columns={columns}
        data={paginatedRoles}
        onRowClick={openRoleDrawer}
        tabs={[
          {
            id: 'platform',
            label: 'Roles de plataforma',
            count: roles.filter((role) => role.scope === 'platform').length,
            badgeTone: 'primary',
          },
          {
            id: 'tenant',
            label: 'Roles de tenant',
            count: roles.filter((role) => role.scope === 'tenant').length,
            badgeTone: 'info',
          },
        ]}
        activeTab={scopeTab}
        onTabChange={(tabId) => {
          setScopeTab(tabId as ScopeTab);
          setStatusFilter('all');
          setSearch('');
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
        filters={[
          {
            id: 'status',
            label: 'Estado',
            type: 'select',
            value: statusFilter,
            options: [
              { label: 'Todos', value: 'all' },
              { label: 'Activos', value: 'active' },
              { label: 'Inactivos', value: 'inactive' },
            ],
            onChange: (value) => {
              setStatusFilter(value as StatusFilter);
              resetPage();
            },
          },
        ]}
        searchValue={search}
        searchPlaceholder="Buscar por nombre o código…"
        onSearchChange={(value) => {
          setSearch(value);
          resetPage();
        }}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSortChange={(key, direction) => {
          setSortKey(key);
          setSortDirection(direction);
        }}
        actionItems={[
          {
            label: 'Nuevo rol',
            icon: Plus,
            variant: 'primary',
            showLabel: true,
            onClick: openCreateDrawer,
          },
        ]}
        emptyMessage="No hay roles en este catálogo."
        pagination={{
          page,
          pageSize,
          total: filteredRoles.length,
          onPageChange: setPage,
          pageSizeOptions: [...PAGE_SIZE_OPTIONS],
          onPageSizeChange: (size) => {
            setPageSize(size);
            resetPage();
          },
        }}
      />

      <Drawer
        open={drawerOpen}
        onClose={closeDrawer}
        size="xl"
        title={
          drawerMode === 'create'
            ? 'Nuevo rol'
            : displayRole?.name ?? 'Detalle del rol'
        }
        subtitle={
          scopeTab === 'platform'
            ? 'Rol de plataforma'
            : 'Rol por defecto de tenant'
        }
        headerActions={
          drawerMode === 'detail' && !isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted"
            >
              <Pencil size={16} />
              Editar
            </button>
          ) : null
        }
        footer={
          isEditing ? (
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  if (drawerMode === 'create') {
                    closeDrawer();
                    return;
                  }
                  setIsEditing(false);
                  setFormErrors({});
                  if (selectedRole) {
                    setRoleDraft({
                      ...selectedRole,
                      permissionIds: [...selectedRole.permissionIds],
                    });
                  }
                }}
                className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover dark:bg-primary"
              >
                Guardar
              </button>
            </div>
          ) : null
        }
      >
        {displayRole && roleDraft ? (
          <div className="space-y-5">
            <Surface variant="muted" padding="lg" radius="xl" className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand dark:bg-primary/15 dark:text-primary">
                <KeyRound size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap gap-2">
                  <TableBadge tone={displayRole.scope === 'platform' ? 'primary' : 'info'}>
                    {displayRole.scope === 'platform' ? 'Plataforma' : 'Tenant'}
                  </TableBadge>
                  <TableBadge tone={displayRole.activo ? 'success' : 'danger'}>
                    {displayRole.activo ? 'Activo' : 'Inactivo'}
                  </TableBadge>
                  {displayRole.isSystem ? <TableBadge tone="neutral">Sistema</TableBadge> : null}
                </div>
                <p className="mt-2 text-sm text-subtle">
                  Asigna permisos moviendo elementos de la izquierda (disponibles) a la derecha
                  (asignados).
                </p>
              </div>
            </Surface>

            {isEditing ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <RegistryFormField label="Nombre" required error={formErrors.name}>
                  <input
                    type="text"
                    value={roleDraft.name}
                    onChange={(event) => {
                      const name = event.target.value;
                      setRoleDraft((current) => {
                        if (!current) return current;
                        const shouldSlug =
                          drawerMode === 'create' &&
                          (!current.code || current.code === slugifyRoleCode(current.name));
                        return {
                          ...current,
                          name,
                          code: shouldSlug ? slugifyRoleCode(name) : current.code,
                        };
                      });
                    }}
                    className={formErrors.name ? inputErrorClassName : inputClassName}
                  />
                </RegistryFormField>
                <RegistryFormField label="Código" required error={formErrors.code}>
                  <input
                    type="text"
                    value={roleDraft.code}
                    disabled={roleDraft.isSystem}
                    onChange={(event) =>
                      setRoleDraft((current) =>
                        current
                          ? { ...current, code: slugifyRoleCode(event.target.value) }
                          : current,
                      )
                    }
                    className={formErrors.code ? inputErrorClassName : inputClassName}
                  />
                </RegistryFormField>
                <RegistryFormField label="Descripción" className="sm:col-span-2">
                  <textarea
                    value={roleDraft.description}
                    rows={2}
                    onChange={(event) =>
                      setRoleDraft((current) =>
                        current ? { ...current, description: event.target.value } : current,
                      )
                    }
                    className={inputClassName}
                  />
                </RegistryFormField>
                <RegistryFormField label="Estado">
                  <div className="flex items-center gap-3 pt-1">
                    <Switch
                      checked={roleDraft.activo}
                      onChange={(checked) =>
                        setRoleDraft((current) =>
                          current ? { ...current, activo: checked } : current,
                        )
                      }
                      aria-label="Rol activo"
                    />
                    <span className="text-sm text-foreground">
                      {roleDraft.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </RegistryFormField>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <RegistryDetailField label="Código" value={displayRole.code} />
                <RegistryDetailField
                  label="Permisos"
                  value={`${displayRole.permissionIds.length} asignados`}
                />
                <RegistryDetailField
                  label="Descripción"
                  value={displayRole.description || 'Sin descripción'}
                />
                <RegistryDetailField
                  label="Permisos clave"
                  value={
                    displayRole.permissionIds.length === 0
                      ? 'Ninguno'
                      : displayRole.permissionIds
                          .slice(0, 4)
                          .map((id) => permissionLabelById.get(id) ?? id)
                          .join(', ') +
                        (displayRole.permissionIds.length > 4
                          ? ` (+${displayRole.permissionIds.length - 4})`
                          : '')
                  }
                />
              </div>
            )}

            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-subtle">
                Permisos
              </p>
              <TransferList
                items={transferItems}
                selectedIds={roleDraft.permissionIds}
                onChange={(permissionIds) =>
                  setRoleDraft((current) => (current ? { ...current, permissionIds } : current))
                }
                leftTitle="Disponibles"
                rightTitle="Asignados"
                searchPlaceholder="Buscar permiso…"
                disabled={!canEditPermissions}
              />
            </div>
          </div>
        ) : null}
      </Drawer>

      <ModalDrawer
        open={confirmDelete != null}
        onClose={() => setConfirmDelete(null)}
        title="Eliminar rol"
        size="sm"
        footer={
          <ConfirmModalFooter
            onCancel={() => setConfirmDelete(null)}
            onConfirm={handleConfirmDelete}
            confirmLabel="Eliminar"
            confirmIcon={<Trash2 size={16} />}
            confirmClassName="bg-red-500 hover:bg-red-600"
          />
        }
      >
        <ConfirmModalContent icon={<Trash2 size={28} />} iconClassName="bg-red-500/10 text-red-500">
          <p className="text-base font-semibold text-foreground">
            ¿Eliminar el rol «{confirmDelete?.name}»?
          </p>
          <p className="mt-2 text-sm text-subtle">
            Esta acción solo afecta el catálogo demo. Los roles de sistema no se pueden eliminar.
          </p>
        </ConfirmModalContent>
      </ModalDrawer>
    </div>
  );

  if (embedded) {
    return pageContent;
  }

  return <DashboardLayout>{pageContent}</DashboardLayout>;
}
