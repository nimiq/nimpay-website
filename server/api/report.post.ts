import { z } from 'zod'
import { REPORT_CATEGORIES, REPORT_CONFIRMATION, REPORT_SEVERITIES } from '~~/shared/report'
import { createIssue, getInstallationToken } from '../utils/github-app'

const reportSchema = z.object({
  appName: z.string().min(1),
  appType: z.string().min(1),
  appSlug: z.string().min(1),
  target: z.string().url(),
  category: z.enum(REPORT_CATEGORIES),
  summary: z.string().trim().min(1).max(5000),
  evidence: z.string().trim().max(5000).optional(),
  severity: z.enum(REPORT_SEVERITIES),
  contact: z.string().trim().max(200).optional(),
  confirmation: z.literal(true),
  turnstileToken: z.string().min(1),
  company: z.string().optional(), // honeypot
})

type ReportInput = z.infer<typeof reportSchema>

const NO_RESPONSE = '_No response_'

// Mirror the rendered output of nimiq/awesome → report-abuse.yml: a `### <label>`
// heading per field, `_No response_` for empty optionals, `- [X]` for the checkbox.
function buildIssueBody(data: ReportInput): string {
  return [
    '### Affected listing type', '', 'Mini app', '',
    '### Repo location or listed URL', '', data.target, '',
    '### Report category', '', data.category, '',
    '### What is the issue?', '', data.summary, '',
    '### Supporting links or evidence', '', data.evidence || NO_RESPONSE, '',
    '### Impact or severity', '', data.severity, '',
    '### Reporter contact (optional)', '', data.contact || NO_RESPONSE, '',
    '### Confirmation', '', `- [X] ${REPORT_CONFIRMATION}`, '',
  ].join('\n')
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = reportSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid report' })
  }
  const data = parsed.data

  // Honeypot: real users never fill this.
  if (data.company) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid report' })
  }

  const turnstile = await verifyTurnstileToken(data.turnstileToken, event)
  if (!turnstile.success) {
    throw createError({ statusCode: 403, statusMessage: 'Captcha verification failed' })
  }

  const config = useRuntimeConfig(event)
  if (!config.githubAppId || !config.githubAppPrivateKey || !config.githubAppInstallationId) {
    throw createError({ statusCode: 500, statusMessage: 'Reporting is not configured' })
  }

  let issue: { url: string, number: number }
  try {
    const token = await getInstallationToken({
      appId: config.githubAppId,
      privateKey: config.githubAppPrivateKey,
      installationId: config.githubAppInstallationId,
    })
    issue = await createIssue(token, {
      owner: config.reportRepoOwner,
      repo: config.reportRepoName,
      title: `[Abuse report]: ${data.appName}`,
      body: buildIssueBody(data),
      labels: ['abuse-report'],
    })
  }
  catch (err) {
    console.error('[report] failed to create GitHub issue', err)
    throw createError({ statusCode: 502, statusMessage: 'Could not file the report' })
  }

  return { url: issue.url, number: issue.number }
})
