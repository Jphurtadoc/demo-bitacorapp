export type UserRole = 'root' | 'admin' | 'supervisor' | 'vigilante';

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: UserRole;
  /** Tenant name for tenant-scoped roles; null for system root. */
  tenant: string | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}
