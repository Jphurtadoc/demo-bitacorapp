import mockClientsData from '@/data/mockClients.json'
import type { AdminClient } from '@/types/adminClient'

const STORAGE_KEY = 'bitacorapp_admin_clients'

/**
 * Returns the demo client list, preferring session overrides.
 */
export function getAdminClients(): AdminClient[] {
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return [...(mockClientsData as AdminClient[])]
  }
  try {
    const parsed = JSON.parse(raw) as AdminClient[]
    return Array.isArray(parsed) ? parsed : [...(mockClientsData as AdminClient[])]
  } catch {
    return [...(mockClientsData as AdminClient[])]
  }
}

/**
 * Persists the demo client list for the current browser session.
 */
export function setAdminClients(clients: AdminClient[]): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(clients))
}

/**
 * Finds a client by id in the demo store.
 */
export function getAdminClientById(clientId: string): AdminClient | null {
  return getAdminClients().find((client) => client.id === clientId) ?? null
}

/**
 * Inserts or replaces a client in the demo store.
 */
export function upsertAdminClient(client: AdminClient): void {
  const clients = getAdminClients()
  const index = clients.findIndex((item) => item.id === client.id)
  if (index >= 0) {
    clients[index] = client
  } else {
    clients.unshift(client)
  }
  setAdminClients(clients)
}

/**
 * Removes a client from the demo store.
 */
export function deleteAdminClient(clientId: string): void {
  setAdminClients(getAdminClients().filter((client) => client.id !== clientId))
}
