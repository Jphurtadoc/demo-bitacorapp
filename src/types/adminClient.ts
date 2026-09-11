/**
 * Site category for a platform tenant (cliente).
 */
export type AdminClientTipo = 'fabrica' | 'comercio' | 'conjunto_residencial'

/**
 * Platform tenant (cliente) managed by root / super-admin.
 */
export interface AdminClient {
  readonly id: string
  readonly nombre: string
  readonly nit: string
  readonly ciudad: string
  readonly contacto: string
  readonly email: string
  /** Site category used for the type favicon. */
  readonly tipo: AdminClientTipo
  readonly plan: 'Starter' | 'Business' | 'Enterprise'
  readonly estadoSuscripcion: 'activo' | 'mora' | 'inactivo'
  /** Monthly recurring revenue contribution in COP millions. */
  readonly mrrMillones: number
  /** ISO date when the tenant was created. */
  readonly creadoEn: string
  readonly activo: boolean
}
