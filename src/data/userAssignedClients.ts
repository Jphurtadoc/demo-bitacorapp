import type { AssignedClient } from '@/types/assignedClient';

const clientPool: AssignedClient[] = [
  {
    id: 'cl-1',
    nombre: 'Seguridad Shatter - Sede Norte',
    nit: '900123456-1',
    ciudad: 'Bogotá',
    contacto: 'Carlos Mejía',
    activo: true,
  },
  {
    id: 'cl-2',
    nombre: 'Seguridad Shatter - Centro Logístico',
    nit: '900123456-2',
    ciudad: 'Bogotá',
    contacto: 'Patricia Ríos',
    activo: true,
  },
  {
    id: 'cl-3',
    nombre: 'Prosegur Andina - Planta Cali',
    nit: '800234567-3',
    ciudad: 'Cali',
    contacto: 'Jorge Herrera',
    activo: true,
  },
  {
    id: 'cl-4',
    nombre: 'Prosegur Andina - Oficinas Pereira',
    nit: '800234567-4',
    ciudad: 'Pereira',
    contacto: 'Mónica Salazar',
    activo: false,
  },
  {
    id: 'cl-5',
    nombre: 'Alpha Security - Puerto Cartagena',
    nit: '700345678-5',
    ciudad: 'Cartagena',
    contacto: 'Ricardo Peña',
    activo: true,
  },
  {
    id: 'cl-6',
    nombre: 'Alpha Security - Torre Empresarial',
    nit: '700345678-6',
    ciudad: 'Barranquilla',
    contacto: 'Diana Molina',
    activo: true,
  },
  {
    id: 'cl-7',
    nombre: 'Centro Comercial Andino',
    nit: '860456789-7',
    ciudad: 'Bogotá',
    contacto: 'Felipe Arango',
    activo: true,
  },
  {
    id: 'cl-8',
    nombre: 'Parque Industrial Zona Franca',
    nit: '860456789-8',
    ciudad: 'Medellín',
    contacto: 'Laura Cárdenas',
    activo: true,
  },
  {
    id: 'cl-9',
    nombre: 'Conjunto Residencial Los Pinos',
    nit: '900567890-9',
    ciudad: 'Bucaramanga',
    contacto: 'Santiago Ortiz',
    activo: false,
  },
  {
    id: 'cl-10',
    nombre: 'Bodega Nacional - Zona Sur',
    nit: '900567890-0',
    ciudad: 'Bogotá',
    contacto: 'Valentina Duque',
    activo: true,
  },
  {
    id: 'cl-11',
    nombre: 'Hospital San Rafael',
    nit: '800678901-1',
    ciudad: 'Medellín',
    contacto: 'Andrés Londoño',
    activo: true,
  },
  {
    id: 'cl-12',
    nombre: 'Universidad del Norte',
    nit: '800678901-2',
    ciudad: 'Barranquilla',
    contacto: 'Claudia Vargas',
    activo: true,
  },
];

const assignmentsByUser: Record<string, number[]> = {
  '1': [0, 1, 2, 6, 7, 9, 10, 11],
  '2': [0, 1, 7, 10, 11],
  '3': [2, 3, 8],
  '5': [4, 5, 11, 6, 9, 10],
  '6': [8, 9],
  '7': [0, 1, 6, 10],
  '8': [2, 3, 4, 5, 6, 7, 9],
  '9': [4],
  '10': [0, 1, 2, 3, 4, 5, 6, 7, 11],
};

export function getUserAssignedClients(userId: string): AssignedClient[] {
  const indexes = assignmentsByUser[userId] ?? [];
  return indexes.map((index) => clientPool[index]);
}
