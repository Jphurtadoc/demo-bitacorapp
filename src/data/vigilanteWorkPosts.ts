import type { WorkPost } from '@/types/workPost';

const workPostPool: readonly WorkPost[] = [
  {
    id: 'wp-1',
    nombre: 'Manitoba S. A. - Industrial',
    direccion: 'Calle 26 #92-32, Zona Industrial, Bogotá',
    tipo: 'industrial',
  },
  {
    id: 'wp-2',
    nombre: 'Conjunto Residencial Acacias',
    direccion: 'Carrera 15 #128-45, Usaquén, Bogotá',
    tipo: 'residencial',
  },
  {
    id: 'wp-3',
    nombre: 'Centro Empresarial Norte',
    direccion: 'Autopista Norte Km 18, Chía',
    tipo: 'comercial',
  },
  {
    id: 'wp-4',
    nombre: 'Bodega Logística Fontibón',
    direccion: 'Calle 17 #106-20, Fontibón, Bogotá',
    tipo: 'industrial',
  },
  {
    id: 'wp-5',
    nombre: 'Clínica del Country - Portería Sur',
    direccion: 'Carrera 16 #82-57, Chapinero, Bogotá',
    tipo: 'comercial',
  },
  {
    id: 'wp-6',
    nombre: 'Parque Industrial Yumbo',
    direccion: 'Km 4 Vía Yumbo–Aeropuerto, Valle del Cauca',
    tipo: 'industrial',
  },
  {
    id: 'wp-7',
    nombre: 'Edificio Torre Prosegur',
    direccion: 'Av. 6N #28N-21, Cali',
    tipo: 'comercial',
  },
  {
    id: 'wp-8',
    nombre: 'Conjunto Residencial El Poblado',
    direccion: 'Calle 10 #43A-50, El Poblado, Medellín',
    tipo: 'residencial',
  },
];

const assignmentsByVigilante: Record<string, readonly string[]> = {
  'vigilante-1': ['wp-1', 'wp-2', 'wp-3', 'wp-4', 'wp-5'],
  'vigilante-2': ['wp-6', 'wp-7', 'wp-8', 'wp-1'],
};

/**
 * Returns work posts assigned to the given vigilante user id.
 */
export function getVigilanteWorkPosts(userId: string): WorkPost[] {
  const ids = assignmentsByVigilante[userId] ?? [];
  return ids
    .map((id) => workPostPool.find((post) => post.id === id))
    .filter((post): post is WorkPost => Boolean(post));
}

/**
 * Looks up a work post by id from the demo pool.
 */
export function getWorkPostById(workPostId: string): WorkPost | null {
  return workPostPool.find((post) => post.id === workPostId) ?? null;
}
