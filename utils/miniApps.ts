export const MINI_APP_TYPES = ['nimiq', 'evm'] as const
export type MiniAppType = (typeof MINI_APP_TYPES)[number]

export const MINI_APP_CATEGORIES = [
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
] as const

export type MiniAppCategory = (typeof MINI_APP_CATEGORIES)[number]

export function isMiniAppCategory(value: unknown): value is MiniAppCategory {
  return typeof value === 'string' && (MINI_APP_CATEGORIES as readonly string[]).includes(value)
}

export function isMiniAppType(value: unknown): value is MiniAppType {
  return typeof value === 'string' && (MINI_APP_TYPES as readonly string[]).includes(value)
}

interface FilterableMiniApp {
  name: string
  description: string
  developer: string | null
  type: MiniAppType
  category: MiniAppCategory
}

export interface MiniAppFilters {
  search: string
  type: 'all' | MiniAppType
  category: 'all' | MiniAppCategory
}

export function matchesMiniAppFilters(
  app: FilterableMiniApp,
  filters: MiniAppFilters,
  categoryLabel: (category: MiniAppCategory) => string,
): boolean {
  if (filters.type !== 'all' && app.type !== filters.type)
    return false
  if (filters.category !== 'all' && app.category !== filters.category)
    return false

  const query = filters.search.trim().toLowerCase()
  if (!query)
    return true

  return [app.name, app.description, app.developer ?? '', categoryLabel(app.category)]
    .some(value => value.toLowerCase().includes(query))
}
