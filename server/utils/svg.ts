import { Buffer } from 'node:buffer'
import { MAX_LOGO_BYTES } from '~~/shared/submit'

// Defense-in-depth check for user-uploaded SVG logos. The logo is later served
// via <img src> (scripts don't execute there) and nimiq/awesome runs SVGO on
// build, but we still reject obviously dangerous or malformed markup before
// committing it to a PR. Throws on rejection; returns the trimmed SVG on success.
export function sanitizeSvg(raw: string): string {
  // trim() also strips a leading BOM (U+FEFF counts as whitespace).
  const svg = raw.trim()

  if (!svg) throw new Error('Empty SVG')
  if (Buffer.byteLength(svg, 'utf8') > MAX_LOGO_BYTES) throw new Error('SVG too large')

  // Root element must be <svg> (after an optional XML prolog / comments / doctype).
  const head = svg
    .replace(/<\?xml[\s\S]*?\?>/i, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<!DOCTYPE[^>]*>/i, '')
    .trim()
  if (!/^<svg[\s>]/i.test(head)) throw new Error('Not an SVG document')

  const forbidden: Array<[RegExp, string]> = [
    [/<script[\s>]/i, 'inline scripts'],
    [/<foreignObject[\s>]/i, 'foreignObject'],
    [/\son\w+\s*=/i, 'event handlers'],
    [/javascript:/i, 'javascript: URLs'],
    [/(?:xlink:href|href)\s*=\s*["']\s*https?:/i, 'external references'],
  ]
  for (const [pattern, label] of forbidden) {
    if (pattern.test(svg)) throw new Error(`SVG contains ${label}`)
  }

  return svg
}
