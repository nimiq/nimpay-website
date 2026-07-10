import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const cardUrl = new URL('../components/miniapps/MiniAppCard.vue', import.meta.url)
const previewUrl = new URL('../components/miniapps/MiniAppSubmitPreview.vue', import.meta.url)
const surfaceUrl = new URL('../components/miniapps/MiniAppCardSurface.vue', import.meta.url)
const surfacePath = fileURLToPath(surfaceUrl)

assert.equal(existsSync(surfacePath), true, 'card and submission preview should share a card surface')

const card = readFileSync(cardUrl, 'utf8')
const preview = readFileSync(previewUrl, 'utf8')
const surface = readFileSync(surfaceUrl, 'utf8')

assert.match(card, /<MiniAppCardSurface/)
assert.match(preview, /<MiniAppCardSurface/)
assert.match(surface, /flex flex-wrap items-center justify-end gap-2/)
assert.ok(surface.indexOf('<MiniAppCategoryBadge') < surface.indexOf('<MiniAppTypeBadge'))
assert.match(surface, /<MiniAppTypeBadge[\s\S]*class="!self-center"/)
