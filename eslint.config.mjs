// @ts-check
import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

// eslint-disable-next-line jsdoc/check-types
Object.groupBy ||= /** @type {typeof Object.groupBy} */ ((items, callback) => {
  return Array.from(items).reduce((groups, item, index) => {
    const key = callback(item, index)
    groups[key] ||= []
    groups[key].push(item)
    return groups
  }, /** @type {Record<PropertyKey, unknown[]>} */ ({}))
})

export default withNuxt(
  antfu({
    ignores: ['.playwright-mcp/**'],
    jsonc: false,
    lessOpinionated: true,
    pnpm: false,
    stylistic: false,
    typescript: true,
    vue: true,
    yaml: false,
  }),
)
