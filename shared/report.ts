// Canonical option values for the Mini App abuse report. These MUST match the
// option text in nimiq/awesome → .github/ISSUE_TEMPLATE/report-abuse.yml verbatim,
// since the issue body we build mirrors that form. Shared by the client form
// (option values) and the server route (validation).

export const REPORT_CATEGORIES = [
  'Malicious app or wallet drainer',
  'Scam or phishing',
  'Malware or unsafe downloads',
  'Impersonation or deceptive branding',
  'Offensive or hateful content',
  'Other policy violation',
] as const

export const REPORT_SEVERITIES = [
  'Critical - active theft, malware, or severe abuse',
  'High - credible risk to users or clearly harmful content',
  'Medium - suspicious or misleading content that needs review',
  'Low - policy concern with limited immediate risk',
] as const

export const REPORT_CONFIRMATION = 'I am reporting this in good faith and have not included sensitive personal data in this public issue.'

export type ReportCategory = (typeof REPORT_CATEGORIES)[number]
export type ReportSeverity = (typeof REPORT_SEVERITIES)[number]

export interface ReportPayload {
  appName: string
  appType: string
  appSlug: string
  target: string
  category: ReportCategory
  summary: string
  evidence?: string
  severity: ReportSeverity
  contact?: string
  confirmation: true
  turnstileToken: string
  /** Honeypot — real users leave this empty. */
  company?: string
}
