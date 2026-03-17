export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'guest';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}
