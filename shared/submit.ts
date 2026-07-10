import type { MiniAppType } from '~~/server/utils/miniapps'
import { MINI_APP_TYPES } from '~~/server/utils/miniapps'

// Single source of truth for the type list lives in server/utils/miniapps.ts;
// re-export so submit code has one import surface.
export { MINI_APP_TYPES }
export type { MiniAppType }

// build.ts validates `description.length <= 200`.
export const MAX_DESCRIPTION_LENGTH = 200

// SVG-only logos; keep uploads small. Served later via <img src>, never inlined.
export const MAX_LOGO_BYTES = 100_000

export const SUBMIT_CONFIRMATION = 'I confirm this app is functional at the URL above and that I have the right to submit it.'

// Verbatim copy of generateSlug() from nimiq/awesome → src/scripts/build.ts so
// the slug we validate/uniqueness-check matches the slug CI generates.
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
}

export interface SubmitPayload {
  name: string
  url: string
  type: MiniAppType
  description: string
  source?: string
  /** Raw SVG markup of the app logo. Optional. */
  logoSvg?: string
  confirmation: true
  turnstileToken: string
  /** Honeypot — real users leave this empty. */
  company?: string
}
