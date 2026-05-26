export const APP_STORE_URL = 'https://apps.apple.com/app/nimiq-pay/id6471844738'
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.nimiq.pay'
export const IOS_APP_ID = '6471844738'
export const APP_PACKAGE_NAME = 'com.nimiq.pay'
// If the custom scheme dispatch did not launch the app within this window, the
// tab is still visible and we redirect to the App Store as a fallback.
export const IOS_STORE_FALLBACK_MS = 1500

/**
 * Same-origin Universal Links / App Links are not honoured by Safari or Chrome
 * (anti-loop). On Android we use Chrome's intent:// scheme — it bypasses the
 * same-origin block and provides a built-in store fallback via
 * `S.browser_fallback_url`.
 *
 * `host` defaults to the current origin so non-production deploys build an
 * intent that resolves against the same host as the page.
 */
export function buildAndroidIntentUrl(targetMiniAppUrl: string, host?: string): string {
  const resolvedHost = host ?? (typeof window !== 'undefined' ? window.location.host : 'nimpay.app')
  // The intent URI uses `;` as a parameter separator and `#` to start the Intent
  // section, so any raw `;`/`#` in the embedded path/query would corrupt parsing.
  const path = buildOpenPath(targetMiniAppUrl)
    .replace(/;/g, '%3B')
    .replace(/#/g, '%23')
  return `intent://${resolvedHost}${path}#Intent;scheme=https;package=${APP_PACKAGE_NAME};S.browser_fallback_url=${encodeURIComponent(PLAY_STORE_URL)};end`
}

/**
 * iOS Safari ignores same-origin Universal Links but always honours registered
 * custom schemes. The app registers `nimiqpay://miniapp?url=…` and handles it
 * via the same launch path as the https Universal Link.
 */
export function buildIosCustomSchemeUrl(targetMiniAppUrl: string): string {
  return `nimiqpay://miniapp?url=${encodeURIComponent(targetMiniAppUrl)}`
}

export function detectMobilePlatform(): 'ios' | 'android' | null {
  if (typeof navigator === 'undefined') return null
  const ua = navigator.userAgent
  if (/Android/i.test(ua)) return 'android'
  if (/iPad|iPhone|iPod/i.test(ua)) return 'ios'
  // iPadOS 13+ defaults to a desktop UA (`Macintosh`) but exposes touch points.
  if (/Macintosh/i.test(ua) && typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 1) {
    return 'ios'
  }
  return null
}

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
