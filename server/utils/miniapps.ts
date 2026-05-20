import { normalizeHost } from '../../utils/deeplink'

export const MINI_APP_TYPES = ['nimiq', 'evm'] as const
export type MiniAppType = (typeof MINI_APP_TYPES)[number]

export interface MiniApp {
  name: string
  url: string
  type: MiniAppType
  description: string
  logo: string
  source: string | null
  developer: string | null
  featured: boolean
  slug: string
}

export type MiniAppsData = Record<MiniAppType, MiniApp[]>

const SOURCE_URL = 'https://raw.githubusercontent.com/nimiq/awesome/main/src/data/dist/nimiq-mini-apps.json'

let cache: MiniApp[] | null = null

export async function fetchMiniApps(): Promise<MiniApp[]> {
  if (cache) return cache
  const res = await fetch(SOURCE_URL, { headers: { accept: 'application/json' } })
  if (!res.ok) throw new Error(`Failed to fetch mini apps: ${res.status} ${res.statusText}`)
  const data = (await res.json()) as MiniAppsData
  const flat: MiniApp[] = []
  for (const type of MINI_APP_TYPES) {
    const entries = data[type] ?? []
    for (const entry of entries) flat.push({ ...entry, type })
  }
  cache = flat
  return flat
}

export function findMiniApp(apps: MiniApp[], type: string, slug: string): MiniApp | undefined {
  return apps.find(a => a.type === type && a.slug === slug)
}

export function findByHost(apps: MiniApp[], host: string): MiniApp | undefined {
  const normalized = normalizeHost(host)
  return apps.find((a) => {
    try {
      return normalizeHost(new URL(a.url).host) === normalized
    }
    catch {
      return false
    }
  })
}

export function isMiniAppType(value: string): value is MiniAppType {
  return (MINI_APP_TYPES as readonly string[]).includes(value)
}
