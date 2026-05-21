export const APP_STORE_URL = 'https://apps.apple.com/app/nimiq-pay/id6471844738'
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.nimiq.pay'

export function joinQuery(targetUrl: string, extraQuery: Record<string, string | string[]>): string {
  const url = new URL(targetUrl)
  for (const [k, v] of Object.entries(extraQuery)) {
    if (Array.isArray(v)) v.forEach(item => url.searchParams.append(k, item))
    else url.searchParams.set(k, v)
  }
  return url.toString()
}

export function normalizeHost(host: string): string {
  return host.toLowerCase().replace(/^www\./, '')
}

export function hostOf(url: string): string | null {
  try { return normalizeHost(new URL(url).host) }
  catch { return null }
}

/** Builds the pretty `/miniapps/open/{host}[/path][?qs]` path for a mini-app URL. */
export function buildOpenPath(targetUrl: string): string {
  const u = new URL(targetUrl)
  const path = u.pathname === '/' ? '' : u.pathname
  return `/miniapps/open/${u.host}${path}${u.search}`
}

export function getFaviconUrl(url: string, size = 128): string {
  try {
    const { origin } = new URL(url)
    return `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&drop_404_icon=true&url=${origin}&size=${size}`
  }
  catch {
    return ''
  }
}

export function parseOpenPath(raw: string | string[] | undefined): { host: string, path: string, full: string } | null {
  if (!raw) return null
  const segments = Array.isArray(raw) ? raw : [raw]
  const joined = segments.filter(Boolean).join('/').replace(/^\/+/, '')
  if (!joined) return null
  const cleaned = joined.replace(/^https?:\/\//i, '')
  const slashIdx = cleaned.indexOf('/')
  const host = slashIdx === -1 ? cleaned : cleaned.slice(0, slashIdx)
  const path = slashIdx === -1 ? '' : cleaned.slice(slashIdx)
  if (!host || !/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(host)) return null
  return { host: normalizeHost(host), path, full: `https://${host}${path}` }
}
