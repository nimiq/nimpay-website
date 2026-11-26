import assert from 'node:assert/strict'

import { buildAndroidIntentUrl, buildIosCustomSchemeUrl, buildOpenPath, parseOpenPath } from '../utils/deeplink.ts'

// Mirrors handleDeepLink + normalizeMiniAppUrl in nimiq-pay-app src/lib/deep-link.ts.
function appMiniAppUrl(link: string): string | undefined {
  const url = new URL(link)
  const target = url.pathname.match(/^\/miniapps\/open\/(.+)$/)?.[1]
  const raw = url.protocol === 'nimiqpay:'
    ? url.searchParams.get('url')
    : target && decodeURIComponent(target) + url.search + url.hash
  if (!raw) return undefined
  return new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`).href
}

// Android Intent.parseUri: data is everything before the last `#`, with `intent:` swapped for the scheme.
function intentData(intent: string): string {
  const scheme = intent.match(/;scheme=([^;]+);/)?.[1]
  return `${scheme}:${intent.slice('intent:'.length, intent.lastIndexOf('#'))}`
}

const sharedLinks: [string, string][] = [
  ['/miniapps/open/app.uniswap.org/swap?flag', 'https://app.uniswap.org/swap?flag'],
  ['/miniapps/open/evm-mini-wallet.vercel.app/%23/swap', 'https://evm-mini-wallet.vercel.app/#/swap'],
  ['/es/miniapps/open/evm-mini-wallet.vercel.app/%23/swap?x=1', 'https://evm-mini-wallet.vercel.app/#/swap?x=1'],
  ['/miniapps/open/app.uniswap.org/swap?a=1&a=2&b=%20c', 'https://app.uniswap.org/swap?a=1&a=2&b=%20c'],
  ['/miniapps/open/app.uniswap.org', 'https://app.uniswap.org/'],
  ['/miniapps/open/user.github.io/app/', 'https://user.github.io/app/'],
  ['/miniapps/open/app.uniswap.org/a//b', 'https://app.uniswap.org/a//b'],
  ['/MiniApps/Open/app.uniswap.org/swap', 'https://app.uniswap.org/swap'],
]

for (const [sharedLink, miniAppUrl] of sharedLinks) {
  const { pathname, search } = new URL(sharedLink, 'https://nimpay.app')
  const openPath = pathname.replace(/^\/es(?=\/)/, '').replace(/^\/miniapps\/open\//i, '/miniapps/open/')
  assert.equal(appMiniAppUrl(`https://nimpay.app${openPath}${search}`), miniAppUrl, sharedLink)

  const deeplinkPath = `${openPath}${search}`
  const routeParams = openPath.slice('/miniapps/open/'.length).split('/').map(decodeURIComponent)
  const fullUrl = `${parseOpenPath(routeParams)?.full}${search}`

  assert.equal(appMiniAppUrl(intentData(buildAndroidIntentUrl(deeplinkPath, 'nimpay.app'))), miniAppUrl, `android ${sharedLink}`)
  assert.equal(appMiniAppUrl(buildIosCustomSchemeUrl(fullUrl)), miniAppUrl, `ios ${sharedLink}`)
}

assert.equal(
  buildAndroidIntentUrl(buildOpenPath('https://app.uniswap.org'), 'nimpay.app'),
  `intent://nimpay.app/miniapps/open/app.uniswap.org#Intent;scheme=https;package=com.nimiq.pay;S.browser_fallback_url=${encodeURIComponent('https://play.google.com/store/apps/details?id=com.nimiq.pay')};end`,
)
