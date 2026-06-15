import { Buffer } from 'node:buffer'
import { importPKCS8, SignJWT } from 'jose'

const GITHUB_API = 'https://api.github.com'
const USER_AGENT = 'nimpay-website'

interface AppConfig {
  appId: string
  privateKey: string
  installationId: string
}

interface InstallationTokenResponse {
  token: string
  expires_at: string
}

let cached: { token: string, expiresAt: number } | null = null

// GitHub App private keys ship as PKCS#1 ("BEGIN RSA PRIVATE KEY"); jose needs
// PKCS#8 ("BEGIN PRIVATE KEY"). Convert once with:
//   openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in app.private-key.pem
function normalizePem(raw: string): string {
  const pem = raw.replace(/\\n/g, '\n').trim()
  if (pem.includes('BEGIN RSA PRIVATE KEY')) {
    throw new Error('GitHub App key is PKCS#1; convert to PKCS#8 (openssl pkcs8 -topk8 -nocrypt).')
  }
  return pem
}

async function createAppJwt(config: AppConfig): Promise<string> {
  const key = await importPKCS8(normalizePem(config.privateKey), 'RS256')
  const now = Math.floor(Date.now() / 1000)
  return new SignJWT({})
    .setProtectedHeader({ alg: 'RS256' })
    .setIssuedAt(now - 30) // allow for clock drift
    .setExpirationTime(now + 540) // 9 min (GitHub max is 10)
    .setIssuer(config.appId)
    .sign(key)
}

// Mints (and caches) a short-lived installation access token for the GitHub App.
export async function getInstallationToken(config: AppConfig): Promise<string> {
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token

  const jwt = await createAppJwt(config)
  const res = await $fetch<InstallationTokenResponse>(
    `${GITHUB_API}/app/installations/${config.installationId}/access_tokens`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': USER_AGENT,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  )

  cached = { token: res.token, expiresAt: new Date(res.expires_at).getTime() }
  return res.token
}

export interface CreateIssueInput {
  owner: string
  repo: string
  title: string
  body: string
  labels: string[]
}

// Creates an issue with the bot identity and returns its public URL + number.
export async function createIssue(token: string, input: CreateIssueInput): Promise<{ url: string, number: number }> {
  const res = await $fetch<{ html_url: string, number: number }>(
    `${GITHUB_API}/repos/${input.owner}/${input.repo}/issues`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': USER_AGENT,
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: { title: input.title, body: input.body, labels: input.labels },
    },
  )
  return { url: res.html_url, number: res.number }
}

// ---------------------------------------------------------------------------
// Pull-request helpers (require the App to have Contents: write + Pull
// requests: write on the target repo). Used by server/api/submit-app.post.ts to
// open a PR adding a mini app. Same auth/headers as createIssue; no Octokit.
// ---------------------------------------------------------------------------

function ghHeaders(token: string): Record<string, string> {
  return {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github+json',
    'User-Agent': USER_AGENT,
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

interface RepoRef {
  owner: string
  repo: string
}

// Latest commit SHA of a branch.
export async function getBranchSha(token: string, { owner, repo }: RepoRef, branch: string): Promise<string> {
  const res = await $fetch<{ object: { sha: string } }>(
    `${GITHUB_API}/repos/${owner}/${repo}/git/ref/heads/${branch}`,
    { headers: ghHeaders(token) },
  )
  return res.object.sha
}

// Creates a new branch pointing at `fromSha`.
export async function createBranch(token: string, { owner, repo }: RepoRef, branch: string, fromSha: string): Promise<void> {
  await $fetch(`${GITHUB_API}/repos/${owner}/${repo}/git/refs`, {
    method: 'POST',
    headers: ghHeaders(token),
    body: { ref: `refs/heads/${branch}`, sha: fromSha },
  })
}

// Best-effort branch cleanup; never throws.
export async function deleteBranch(token: string, { owner, repo }: RepoRef, branch: string): Promise<void> {
  try {
    await $fetch(`${GITHUB_API}/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
      method: 'DELETE',
      headers: ghHeaders(token),
    })
  }
  catch {
    // ignore — cleanup is opportunistic
  }
}

// Reads a file's UTF-8 content + blob sha at a given ref.
export async function getFile(token: string, { owner, repo }: RepoRef, path: string, ref: string): Promise<{ content: string, sha: string }> {
  const res = await $fetch<{ content: string, encoding: string, sha: string }>(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}?ref=${encodeURIComponent(ref)}`,
    { headers: ghHeaders(token) },
  )
  const content = Buffer.from(res.content, res.encoding as BufferEncoding).toString('utf8')
  return { content, sha: res.sha }
}

export interface PutFileInput {
  path: string
  content: string
  message: string
  branch: string
  /** Blob sha of the file being replaced; omit when creating a new file. */
  sha?: string
}

// Creates or updates a single file on `branch` (one commit per call).
export async function putFile(token: string, { owner, repo }: RepoRef, input: PutFileInput): Promise<void> {
  await $fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${input.path}`, {
    method: 'PUT',
    headers: ghHeaders(token),
    body: {
      message: input.message,
      content: Buffer.from(input.content, 'utf8').toString('base64'),
      branch: input.branch,
      ...(input.sha ? { sha: input.sha } : {}),
    },
  })
}

export interface CreatePullRequestInput {
  title: string
  head: string
  base: string
  body: string
}

export async function createPullRequest(token: string, { owner, repo }: RepoRef, input: CreatePullRequestInput): Promise<{ url: string, number: number }> {
  const res = await $fetch<{ html_url: string, number: number }>(
    `${GITHUB_API}/repos/${owner}/${repo}/pulls`,
    {
      method: 'POST',
      headers: ghHeaders(token),
      body: { title: input.title, head: input.head, base: input.base, body: input.body },
    },
  )
  return { url: res.html_url, number: res.number }
}
