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
