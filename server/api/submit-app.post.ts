import type { MiniApp } from '../utils/miniapps'
import { z } from 'zod'
import {
  generateSlug,
  MAX_DESCRIPTION_LENGTH,
  MINI_APP_CATEGORIES,
  MINI_APP_TYPES,
} from '~~/shared/submit'
import {
  createBranch,
  createPullRequest,
  deleteBranch,
  getBranchSha,
  getFile,
  getInstallationToken,
  putFile,
} from '../utils/github-app'
import { sanitizeSvg } from '../utils/svg'

const MINI_APPS_PATH = 'src/data/nimiq-mini-apps.json'
const ASSETS_DIR = 'src/data/assets/mini-apps'

const httpsUrl = z.string().trim().url().startsWith('https://', 'Must be an https:// URL')

const submitSchema = z.object({
  name: z.string().trim().min(1).max(80),
  url: httpsUrl,
  type: z.enum(MINI_APP_TYPES),
  category: z.enum(MINI_APP_CATEGORIES),
  description: z.string().trim().min(1).max(MAX_DESCRIPTION_LENGTH),
  source: httpsUrl.optional(),
  logoSvg: z.string().optional(),
  confirmation: z.literal(true),
  turnstileToken: z.string().min(1),
  company: z.string().optional(), // honeypot
})
  .refine(d => generateSlug(d.name).length > 0, { path: ['name'], message: 'Name produces an empty slug' })

// Source entry shape — the catalog model minus the build-generated `slug`.
type MiniAppEntry = Omit<MiniApp, 'slug'>

function buildPrBody(entry: MiniAppEntry): string {
  return [
    // The mention subscribes the submitter to maintainer replies.
    `Mini app submitted by ${entry.developer}.`,
    '',
    '## New Mini App Submission',
    '',
    '### App Details',
    '',
    `- **Name**: ${entry.name}`,
    `- **URL**: ${entry.url}`,
    `- **Type**: ${entry.type}`,
    `- **Category**: ${entry.category}`,
    `- **Description**: ${entry.description}`,
    `- **Logo**: ${entry.logo || 'Not provided'}`,
    `- **Source Code**: ${entry.source ?? 'N/A'}`,
    `- **Developer**: ${entry.developer ?? 'N/A'}`,
    '',
    '---',
    '_Submitted via the [Nimiq Pay mini app submission form](https://nimpay.app/miniapps/submit); the submitter confirmed the app is functional. CI validates formatting, alphabetical order, and the logo convention._',
  ].join('\n')
}

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  if (getHeader(event, 'origin') !== getRequestURL(event).origin) {
    throw createError({ statusCode: 403, statusMessage: 'Request rejected' })
  }

  const body = await readBody(event)
  const parsed = submitSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid submission' })
  }
  const data = parsed.data

  // Honeypot: real users never fill this.
  if (data.company) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid submission' })
  }

  const turnstile = await verifyTurnstileToken(data.turnstileToken, event)
  if (!turnstile.success) {
    throw createError({ statusCode: 403, statusMessage: 'Captcha verification failed' })
  }

  const config = useRuntimeConfig(event)
  if (!config.githubAppId || !config.githubAppPrivateKey || !config.githubAppInstallationId) {
    throw createError({ statusCode: 500, statusMessage: 'Submissions are not configured' })
  }

  const repo = { owner: config.submitRepoOwner, repo: config.submitRepoName }
  const baseBranch = config.submitRepoBranch

  const slug = generateSlug(data.name)
  const developer = `@${user.login}`

  // Sanitize the logo up front; derive its filename per nimiq/awesome's convention.
  let logo: { svg: string, fileName: string } | null = null
  if (data.logoSvg) {
    let svg: string
    try {
      svg = sanitizeSvg(data.logoSvg)
    }
    catch {
      throw createError({ statusCode: 400, statusMessage: 'Invalid SVG logo' })
    }
    const developerSlug = generateSlug(user.login)
    logo = { svg, fileName: `${developerSlug}-${slug}.svg` }
  }

  const entry: MiniAppEntry = {
    name: data.name.trim(),
    url: data.url.trim(),
    type: data.type,
    category: data.category,
    description: data.description.trim(),
    logo: logo ? `./assets/mini-apps/${logo.fileName}` : '',
    source: data.source?.trim() || null,
    developer,
    featured: false,
  }

  let token: string
  try {
    token = await getInstallationToken({
      appId: config.githubAppId,
      privateKey: config.githubAppPrivateKey,
      installationId: config.githubAppInstallationId,
    })
  }
  catch (err) {
    console.error('[submit] failed to mint installation token', err)
    throw createError({ statusCode: 502, statusMessage: 'Could not open the submission' })
  }

  let pr: { url: string, number: number }
  let branch = ''
  try {
    // Reads only depend on the base branch — fetch the file (for its blob sha +
    // contents) and the branch tip sha concurrently.
    const [file, baseSha] = await Promise.all([
      getFile(token, repo, MINI_APPS_PATH, baseBranch),
      getBranchSha(token, repo, baseBranch),
    ])

    const apps = JSON.parse(file.content) as MiniAppEntry[]
    if (apps.some(a => generateSlug(a.name) === slug)) {
      throw createError({ statusCode: 409, statusMessage: 'A mini app with this name already exists' })
    }

    const insertAt = apps.findIndex(a => a.name.toLowerCase().localeCompare(entry.name.toLowerCase()) > 0)
    if (insertAt === -1) apps.push(entry)
    else apps.splice(insertAt, 0, entry)
    const updatedJson = `${JSON.stringify(apps, null, 2)}\n`

    // Link the commits to the participant without requesting their email.
    const author = { name: user.name, email: `${user.id}+${user.login}@users.noreply.github.com` }

    branch = `submit-app/${slug}-${globalThis.crypto.randomUUID().slice(0, 8)}`
    await createBranch(token, repo, branch, baseSha)

    await putFile(token, repo, {
      path: MINI_APPS_PATH,
      content: updatedJson,
      message: `feat: add ${entry.name} mini app`,
      branch,
      sha: file.sha,
      author,
    })

    if (logo) {
      await putFile(token, repo, {
        path: `${ASSETS_DIR}/${logo.fileName}`,
        content: logo.svg,
        message: `feat: add ${entry.name} logo`,
        branch,
        author,
      })
    }

    pr = await createPullRequest(token, repo, {
      title: `Add mini app: ${entry.name}`,
      head: branch,
      base: baseBranch,
      body: buildPrBody(entry),
    })
  }
  catch (err) {
    // Re-throw the duplicate 409 as-is; wrap GitHub failures and clean up the branch.
    if (err && typeof err === 'object' && (err as { statusCode?: number }).statusCode === 409) {
      throw err
    }
    console.error('[submit] failed to open pull request', err)
    if (branch) await deleteBranch(token, repo, branch)
    throw createError({ statusCode: 502, statusMessage: 'Could not open the submission' })
  }

  return { url: pr.url, number: pr.number }
})
