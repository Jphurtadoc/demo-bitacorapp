export interface AdminPerson {
  id: string;
  photo: string;
  nombre: string;
  documento: string;
  tipoUnidad: 'Unidad residencial' | 'Empresa';
  cliente: string;
  unidad: string;
  rol: string;
  telefono: string;
  email: string;
  ciudad: string;
  activo: boolean;
}
