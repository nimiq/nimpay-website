import { hostOf, normalizeHost } from '../../utils/deeplink'

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
const FETCH_TIMEOUT_MS = 10_000

let cache: MiniApp[] | null = null
let pending: Promise<MiniApp[]> | null = null

async function load(): Promise<MiniApp[]> {
  const res = await fetch(SOURCE_URL, {
    headers: { accept: 'application/json' },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  })
  if (!res.ok) throw new Error(`Failed to fetch mini apps: ${res.status} ${res.statusText}`)
  const data = (await res.json()) as MiniAppsData
  const flat: MiniApp[] = []
  for (const type of MINI_APP_TYPES) {
    for (const entry of data[type] ?? []) flat.push({ ...entry, type })
  }
  return flat
}

export async function fetchMiniApps(): Promise<MiniApp[]> {
  if (cache) return cache
  pending ||= load().then((apps) => { cache = apps; pending = null; return apps }).catch((e) => { pending = null; throw e })
  return pending
}

export function findMiniApp(apps: MiniApp[], type: string, slug: string): MiniApp | undefined {
  return apps.find(a => a.type === type && a.slug === slug)
}

export function findByHost(apps: MiniApp[], host: string): MiniApp | undefined {
  const target = normalizeHost(host)
  return apps.find(a => hostOf(a.url) === target)
}

export function isMiniAppType(value: string): value is MiniAppType {
  return (MINI_APP_TYPES as readonly string[]).includes(value)
}
