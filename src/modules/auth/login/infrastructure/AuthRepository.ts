import type { AuthPort } from '@/core/domain/ports/AuthPort';
import type { User } from '@/core/domain/entities/User';

/** Shared demo password for all seeded login accounts. */
export const DEMO_PASSWORD = '$Admin123$';

/** Session storage key for the authenticated demo user. */
const AUTH_SESSION_KEY = 'bitacorapp_auth_user';

/**
 * Reads the persisted demo session user synchronously for UI consumers.
 */
export function getStoredUser(): User | null {
  const raw = sessionStorage.getItem(AUTH_SESSION_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as User;
  } catch {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    return null;
  }
}

/**
 * Clears the persisted demo session.
 */
export function clearStoredUser(): void {
  sessionStorage.removeItem(AUTH_SESSION_KEY);
  sessionStorage.removeItem('bitacorapp_active_shift');
}

/**
 * Persists the authenticated demo user for the browser tab session.
 */
function persistUser(user: User): void {
  sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user));
}

const DEMO_USERS: ReadonlyArray<User & { password: string }> = [
  {
    id: 'root-1',
    username: 'root',
    email: 'root@bitacorapp.com',
    name: 'Root Sistema',
    role: 'root',
    tenant: null,
    password: DEMO_PASSWORD,
  },
  {
    id: 'root-2',
    username: 'root2',
    email: 'root2@bitacorapp.com',
    name: 'Root Operaciones',
    role: 'root',
    tenant: null,
    password: DEMO_PASSWORD,
  },
  {
    id: 'admin-1',
    username: 'admin',
    email: 'admin@shatter.bitacorapp.com',
    name: 'Admin Shatter',
    role: 'admin',
    tenant: 'Seguridad Shatter',
    password: DEMO_PASSWORD,
  },
  {
    id: 'admin-2',
    username: 'admin2',
    email: 'admin@prosegur.bitacorapp.com',
    name: 'Admin Prosegur',
    role: 'admin',
    tenant: 'Prosegur Andina',
    password: DEMO_PASSWORD,
  },
  {
    id: 'supervisor-1',
    username: 'supervisor',
    email: 'supervisor@shatter.bitacorapp.com',
    name: 'Supervisor Shatter',
    role: 'supervisor',
    tenant: 'Seguridad Shatter',
    password: DEMO_PASSWORD,
  },
  {
    id: 'supervisor-2',
    username: 'supervisor2',
    email: 'supervisor@prosegur.bitacorapp.com',
    name: 'Supervisor Prosegur',
    role: 'supervisor',
    tenant: 'Prosegur Andina',
    password: DEMO_PASSWORD,
  },
  {
    id: 'vigilante-1',
    username: 'vigilante',
    email: 'vigilante@shatter.bitacorapp.com',
    name: 'Vigilante Shatter',
    role: 'vigilante',
    tenant: 'Seguridad Shatter',
    password: DEMO_PASSWORD,
  },
  {
    id: 'vigilante-2',
    username: 'vigilante2',
    email: 'vigilante@prosegur.bitacorapp.com',
    name: 'Vigilante Prosegur',
    role: 'vigilante',
    tenant: 'Prosegur Andina',
    password: DEMO_PASSWORD,
  },
];

/**
 * Demo auth adapter. Validates username + shared password against seeded accounts.
 */
export class AuthRepository implements AuthPort {
  async login(username: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const normalizedUsername = username.trim().toLowerCase();
        const match = DEMO_USERS.find(
          (account) =>
            account.username === normalizedUsername && account.password === password,
        );

        if (!match) {
          reject(new Error('Credenciales incorrectas'));
          return;
        }

        const { password: _password, ...user } = match;
        persistUser(user);
        resolve(user);
      }, 1000);
    });
  }

  async logout(): Promise<void> {
    clearStoredUser();
    return Promise.resolve();
  }

  async getCurrentUser(): Promise<User | null> {
    return Promise.resolve(getStoredUser());
  }
}
