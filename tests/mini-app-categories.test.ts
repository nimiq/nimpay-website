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
    'Games',
    'Social',
    'Earning',
    'Marketplaces',
    'Productivity',
    'Creator tools',
    'Education',
    'Health & fitness',
    'Food & dining',
    'Shopping & deals',
    'Lifestyle',
  ])
  assert.equal(miniApps.isMiniAppCategory('Social'), true)
  assert.equal(miniApps.isMiniAppCategory('art'), false)
  assert.equal(miniApps.isMiniAppCategory(['Marketplaces']), false)
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
    category: 'Marketplaces' as const,
  }
  const categoryLabel = () => 'Coleccionables'

  assert.equal(matchesMiniAppFilters(app, {
    search: '',
    type: 'evm',
    category: 'Marketplaces',
  }, categoryLabel), true)
  assert.equal(matchesMiniAppFilters(app, {
    search: '',
    type: 'nimiq',
    category: 'Marketplaces',
  }, categoryLabel), false)
  assert.equal(matchesMiniAppFilters(app, {
    search: '',
    type: 'evm',
    category: 'Games',
  }, categoryLabel), false)
  assert.equal(matchesMiniAppFilters(app, {
    search: 'coleccion',
    type: 'all',
    category: 'all',
  }, categoryLabel), true)
}

await testCategoryContract()
await testCombinedFilters()
