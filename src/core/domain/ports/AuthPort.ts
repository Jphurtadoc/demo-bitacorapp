import type { User } from '@/core/domain/entities/User';

export interface AuthPort {
  login(username: string, password: string): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}
