export interface AdminUser {
  id: string;
  photo: string;
  nombre: string;
  perfil: string;
  cliente: string;
  documento: string;
  estructura: string;
  sede?: string;
  cargo: string;
  email: string;
  nombreUsuario: string;
  ciudad: string;
  clientesAsignados: number;
  activo: boolean;
}

export function isClienteAdminUser(user: Pick<AdminUser, 'perfil'>) {
  return user.perfil === 'Cliente Admin';
}
