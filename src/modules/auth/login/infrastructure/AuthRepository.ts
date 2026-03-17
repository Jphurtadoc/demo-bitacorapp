import type { AuthPort } from '@/core/domain/ports/AuthPort';
import type { User } from '@/core/domain/entities/User';

export class AuthRepository implements AuthPort {
  private DEMO_EMAIL = 'bitacorapp@demo.answertic.co';
  private DEMO_PASSWORD = 'Admin123*';

  async login(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === this.DEMO_EMAIL && password === this.DEMO_PASSWORD) {
          resolve({
            id: '1',
            email: this.DEMO_EMAIL,
            name: 'Bitacorapp Admin',
            role: 'admin',
          });
        } else {
          reject(new Error('Credenciales incorrectas'));
        }
      }, 1000);
    });
  }

  async logout(): Promise<void> {
    return Promise.resolve();
  }

  async getCurrentUser(): Promise<User | null> {
    return Promise.resolve(null);
  }
}
