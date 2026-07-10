import type { Ref } from 'vue'
import type { LocationQueryRaw } from 'vue-router'
import type { MiniApp } from '~~/server/utils/miniapps'
import type { MiniAppFilters } from '~/utils/miniApps'
import { isMiniAppCategory, isMiniAppType, matchesMiniAppFilters } from '~/utils/miniApps'

export type TypeFilter = MiniAppFilters['type']
export type CategoryFilter = MiniAppFilters['category']

const SEARCH_DEBOUNCE_MS = 150

function firstParam(value: unknown): string | undefined {
  const v = Array.isArray(value) ? value[0] : value
  return typeof v === 'string' ? v : undefined
}

export function useMiniAppFilter(apps: Ref<MiniApp[]>) {
  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()

  const search = shallowRef('')
  const type = shallowRef<TypeFilter>('all')
  const category = shallowRef<CategoryFilter>('all')

  function readFromRoute() {
    const q = firstParam(route.query.q) ?? firstParam(route.query.search) ?? ''
    if (q !== search.value.trim()) search.value = q
    const rawType = firstParam(route.query.type)
    type.value = rawType && isMiniAppType(rawType) ? rawType : 'all'
    const rawCategory = firstParam(route.query.category)
    category.value = rawCategory && isMiniAppCategory(rawCategory) ? rawCategory : 'all'
  }

  function queryForState(): LocationQueryRaw {
    const { q: _q, search: _search, type: _type, category: _category, ...rest } = route.query
    const q = search.value.trim()
    return {
      ...rest,
      ...(q ? { q } : {}),
      ...(type.value !== 'all' ? { type: type.value } : {}),
      ...(category.value !== 'all' ? { category: category.value } : {}),
    }
  }

  let searchTimer: ReturnType<typeof setTimeout> | undefined
  if (import.meta.client) {
    // Sync after hydration only: the prerendered HTML is queryless, so the
    // first client render must match it before the filter kicks in.
    onMounted(readFromRoute)
    watch(() => [route.query.q, route.query.search, route.query.type, route.query.category], readFromRoute)
    watch(search, () => {
      clearTimeout(searchTimer)
      searchTimer = setTimeout(() => router.replace({ query: queryForState() }), SEARCH_DEBOUNCE_MS)
    })
    watch([type, category], () => {
      clearTimeout(searchTimer)
      router.replace({ query: queryForState() })
    })
  }

  const filtered = computed(() => {
    return apps.value.filter(app => matchesMiniAppFilters(app, {
      search: search.value,
      type: type.value,
      category: category.value,
    }, value => t(`categories.${value}`)))
  })

  const isFiltering = computed(() => search.value.trim() !== '' || type.value !== 'all' || category.value !== 'all')

  function clear() {
    clearTimeout(searchTimer)
    search.value = ''
    type.value = 'all'
    category.value = 'all'
  }

  return { search, type, category, filtered, isFiltering, clear }
}
