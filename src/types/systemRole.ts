/**
 * Scope of a system role catalog.
 * - platform: roles of the Bitacorapp root company (e.g. Super Admin).
 * - tenant: default roles seeded for each client organization.
 */
export type SystemRoleScope = 'platform' | 'tenant';

/**
 * Atomic permission that can be assigned to a role.
 */
export interface SystemPermission {
  readonly id: string;
  readonly code: string;
  readonly label: string;
  readonly module: string;
  readonly scope: SystemRoleScope;
}

/**
 * Role definition managed by the platform root admin.
 */
export interface SystemRole {
  readonly id: string;
  name: string;
  code: string;
  description: string;
  scope: SystemRoleScope;
  permissionIds: string[];
  /** Built-in roles cannot be deleted. */
  isSystem: boolean;
  activo: boolean;
}
