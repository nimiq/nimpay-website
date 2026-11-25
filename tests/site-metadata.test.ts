import assert from 'node:assert/strict'

import { fetchSiteMetadata, parseSiteMetadata, toPublicHttpsUrl } from '../server/utils/site-metadata.ts'

const page = 'https://app.example.com/game/'

assert.deepEqual(parseSiteMetadata(`<!doctype html><html><head>
  <title> Fallback   title </title>
  <meta name="description" content="Play &amp; earn NIM">
  <meta property="og:site_name" content="Example Game">
  <link rel="icon" href="/small.png" sizes="16x16">
  <link rel="icon" href="/large.png" sizes="192x192">
</head><body><meta name="description" content="ignored"></body></html>`, page), {
  name: 'Example Game',
  description: 'Play & earn NIM',
  icon: 'https://app.example.com/large.png',
})

assert.deepEqual(parseSiteMetadata(`<head><title>Only title</title>
  <meta property='og:description' content='From OG'>
  <link rel="apple-touch-icon" href="touch.png"><link rel="icon" href="/icon.svg" sizes="any">
</head>`, page), {
  name: 'Only title',
  description: 'From OG',
  icon: 'https://app.example.com/game/touch.png',
})

assert.equal(
  parseSiteMetadata('<head><link rel="icon" href="http://app.example.com/x.png"><link rel="icon" href="javascript:alert(1)"></head>', page).icon,
  '',
  'only https icons are used',
)
assert.equal(parseSiteMetadata('<head></head>', page).name, '')
assert.equal(parseSiteMetadata('<head><title>OpticPay — AI-Verified Rewards</title></head>', page).name, 'OpticPay')
assert.equal(parseSiteMetadata('<head><meta property="og:title" content="Nimiq Space | Social World"></head>', page).name, 'Nimiq Space')
assert.equal(parseSiteMetadata('<head><title>Pay-Per-View</title></head>', page).name, 'Pay-Per-View')
assert.equal(parseSiteMetadata(`<head><title>${'a'.repeat(100)}</title></head>`, page).name.length, 60)

for (const hostile of [
  `<meta ${'a'.repeat(262144)}>`,
  '<meta '.repeat(43690),
  '<title '.repeat(37449),
  '<title>'.repeat(37449),
  `<title>a${' '.repeat(262144)}b</title>`,
  `<link rel="icon" sizes="${'1 '.repeat(131072)}" href="/x.png">`,
]) {
  const started = performance.now()
  parseSiteMetadata(hostile, page)
  assert.ok(performance.now() - started < 1000, `parsing ${hostile.slice(0, 12)}… must stay linear`)
}

assert.equal(toPublicHttpsUrl('https://app.example.com/path')?.href, 'https://app.example.com/path')
for (const url of [
  'http://app.example.com',
  'https://127.0.0.1',
  'https://localhost',
  'https://[::1]',
  'https://user:pass@app.example.com',
  'https://app.example.com:8443',
  'file:///etc/passwd',
  'not a url',
])
  assert.equal(toPublicHttpsUrl(url), null, url)

const originalFetch = globalThis.fetch
const requested: string[] = []
function respond(responses: Record<string, Response>) {
  globalThis.fetch = (async (input: URL | string) => {
    const url = String(input)
    requested.push(url)
    return responses[url] ?? new Response('missing', { status: 404 })
  }) as typeof fetch
}

try {
  respond({
    'https://short.example.com/': new Response(null, { status: 302, headers: { location: 'https://app.example.com/' } }),
    'https://app.example.com/': new Response('<head><title>Redirected</title></head>', { headers: { 'content-type': 'text/html; charset=utf-8' } }),
  })
  assert.equal((await fetchSiteMetadata('https://short.example.com/'))?.name, 'Redirected')

  requested.length = 0
  respond({
    'https://evil.example.com/': new Response(null, { status: 302, headers: { location: 'http://169.254.169.254/latest' } }),
  })
  assert.equal(await fetchSiteMetadata('https://evil.example.com/'), null)
  assert.deepEqual(requested, ['https://evil.example.com/'], 'unsafe redirect targets are never fetched')

  respond({ 'https://json.example.com/': new Response('{}', { headers: { 'content-type': 'application/json' } }) })
  assert.equal(await fetchSiteMetadata('https://json.example.com/'), null)
}
finally {
  globalThis.fetch = originalFetch
}
