import { Parser } from 'htmlparser2'

export interface SiteMetadata {
  name: string
  description: string
  icon: string
}

const HOST_PATTERN = /^[a-z0-9.-]+\.[a-z]{2,}$/i
const FETCH_TIMEOUT_MS = 5000
const MAX_REDIRECTS = 3
const MAX_HTML_BYTES = 256 * 1024
const MAX_NAME_LENGTH = 60
const MAX_DESCRIPTION_LENGTH = 300

export function toPublicHttpsUrl(raw: string, base?: string): URL | null {
  try {
    const url = new URL(raw, base)
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return null
    if (!HOST_PATTERN.test(url.hostname)) return null
    return url
  }
  catch {
    return null
  }
}

const MAX_ICON_URL_LENGTH = 2048

function clean(text: string | undefined, maxLength: number): string {
  const normalized = (text ?? '').replace(/\s+/g, ' ').trim()
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength - 1).trimEnd()}…` : normalized
}

function siteNameFromTitle(title: string): string {
  return clean(title, Number.POSITIVE_INFINITY).split(/ [|–—-] /)[0]!
}

function iconSize(sizes: string | undefined): number {
  if (!sizes) return 0
  if (/\bany\b/i.test(sizes)) return Number.POSITIVE_INFINITY
  return sizes.split(/\s+/).reduce((max, token) => Math.max(max, Number.parseInt(token, 10) || 0), 0)
}

export function parseSiteMetadata(html: string, pageUrl: string): SiteMetadata {
  const meta = new Map<string, string>()
  const appleIcons: string[] = []
  const icons: { href: string, size: number }[] = []
  let title = ''
  let inTitle = false
  let inHead = true

  const parser = new Parser({
    onopentag(name, attributes) {
      if (!inHead) return
      if (name === 'body') {
        inHead = false
      }
      else if (name === 'title') {
        inTitle = true
      }
      else if (name === 'meta') {
        const key = (attributes.property ?? attributes.name)?.toLowerCase()
        if (key && attributes.content && !meta.has(key)) meta.set(key, attributes.content)
      }
      else if (name === 'link' && attributes.href && attributes.href.length <= MAX_ICON_URL_LENGTH) {
        const rel = attributes.rel?.toLowerCase().split(/\s+/) ?? []
        if (rel.includes('apple-touch-icon') || rel.includes('apple-touch-icon-precomposed')) appleIcons.push(attributes.href)
        else if (rel.includes('icon')) icons.push({ href: attributes.href, size: iconSize(attributes.sizes) })
      }
    },
    ontext(text) {
      if (inTitle) title += text
    },
    onclosetag(name) {
      if (name === 'title') inTitle = false
      else if (name === 'head') inHead = false
    },
  })
  parser.end(html)

  const iconCandidates = [...appleIcons, ...icons.sort((a, b) => b.size - a.size).map(icon => icon.href)]
  const icon = iconCandidates.map(href => toPublicHttpsUrl(href, pageUrl)).find(Boolean)?.href ?? ''

  return {
    name: clean(meta.get('application-name') || meta.get('og:site_name') || siteNameFromTitle(meta.get('og:title') || title), MAX_NAME_LENGTH),
    description: clean(meta.get('description') || meta.get('og:description'), MAX_DESCRIPTION_LENGTH),
    icon,
  }
}

async function readCapped(response: Response): Promise<string> {
  if (!response.body) return ''
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let html = ''
  let bytes = 0
  while (bytes < MAX_HTML_BYTES) {
    const { done, value } = await reader.read()
    if (done) return html + decoder.decode()
    bytes += value.byteLength
    html += decoder.decode(value, { stream: true })
    if (/<\/head>/i.test(html)) break
  }
  await reader.cancel()
  return html
}

export async function fetchSiteMetadata(rawUrl: string): Promise<SiteMetadata | null> {
  let url = toPublicHttpsUrl(rawUrl)
  for (let hop = 0; url && hop <= MAX_REDIRECTS; hop++) {
    const response = await fetch(url, {
      redirect: 'manual',
      headers: { 'accept': 'text/html', 'user-agent': 'NimiqPayBot/1.0 (+https://nimpay.app)' },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })
    if (response.status >= 300 && response.status < 400) {
      await response.body?.cancel()
      const location = response.headers.get('location')
      url = location ? toPublicHttpsUrl(location, url.href) : null
      continue
    }
    if (!response.ok || !response.headers.get('content-type')?.toLowerCase().includes('text/html')) {
      await response.body?.cancel()
      return null
    }
    return parseSiteMetadata(await readCapped(response), url.href)
  }
  return null
}
