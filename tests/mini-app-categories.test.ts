import assert from 'node:assert/strict'

async function testCategoryContract() {
  let miniApps: typeof import('../utils/miniApps.ts') | undefined

  try {
    miniApps = await import('../utils/miniApps.ts')
  }
  catch {
    assert.fail('shared mini-app category module should exist')
  }

  assert.deepEqual(miniApps.MINI_APP_CATEGORIES, [
    'defi',
    'exchanges',
    'games',
    'marketplaces',
    'nfts',
    'social',
    'utilities',
    'wallets',
  ])
  assert.equal(miniApps.isMiniAppCategory('social'), true)
  assert.equal(miniApps.isMiniAppCategory('art'), false)
  assert.equal(miniApps.isMiniAppCategory(['nfts']), false)
  assert.deepEqual(miniApps.MINI_APP_TYPES, ['nimiq', 'evm'])
  assert.equal(miniApps.isMiniAppType('evm'), true)
  assert.equal(miniApps.isMiniAppType('bitcoin'), false)
}

async function testCombinedFilters() {
  const miniApps = await import('../utils/miniApps.ts')
  assert.equal(typeof miniApps.matchesMiniAppFilters, 'function')
  const { matchesMiniAppFilters } = miniApps
  const app = {
    name: 'OpenSea',
    description: 'Discover digital collectibles',
    developer: '@opensea',
    type: 'evm' as const,
    category: 'nfts' as const,
  }
  const categoryLabel = () => 'Coleccionables'

  assert.equal(matchesMiniAppFilters(app, {
    search: '',
    type: 'evm',
    category: 'nfts',
  }, categoryLabel), true)
  assert.equal(matchesMiniAppFilters(app, {
    search: '',
    type: 'nimiq',
    category: 'nfts',
  }, categoryLabel), false)
  assert.equal(matchesMiniAppFilters(app, {
    search: '',
    type: 'evm',
    category: 'games',
  }, categoryLabel), false)
  assert.equal(matchesMiniAppFilters(app, {
    search: 'coleccion',
    type: 'all',
    category: 'all',
  }, categoryLabel), true)
}

await testCategoryContract()
await testCombinedFilters()
