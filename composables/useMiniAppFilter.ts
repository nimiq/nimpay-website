import type { Ref } from 'vue'
import type { LocationQueryRaw } from 'vue-router'
import type { MiniApp, MiniAppType } from '~~/server/utils/miniapps'
import { isMiniAppType } from '~~/server/utils/miniapps'

export type TypeFilter = 'all' | MiniAppType

const SEARCH_DEBOUNCE_MS = 150

function firstParam(value: unknown): string | undefined {
  const v = Array.isArray(value) ? value[0] : value
  return typeof v === 'string' ? v : undefined
}

export function useMiniAppFilter(apps: Ref<MiniApp[]>) {
  const route = useRoute()
  const router = useRouter()

  const search = ref('')
  const type = ref<TypeFilter>('all')

  function readFromRoute() {
    const q = firstParam(route.query.q) ?? firstParam(route.query.search) ?? ''
    if (q !== search.value.trim()) search.value = q
    const rawType = firstParam(route.query.type)
    type.value = rawType && isMiniAppType(rawType) ? rawType : 'all'
  }

  function queryForState(): LocationQueryRaw {
    const { q: _q, search: _search, type: _type, ...rest } = route.query
    const q = search.value.trim()
    return {
      ...rest,
      ...(q ? { q } : {}),
      ...(type.value !== 'all' ? { type: type.value } : {}),
    }
  }

  let searchTimer: ReturnType<typeof setTimeout> | undefined
  if (import.meta.client) {
    // Sync after hydration only: the prerendered HTML is queryless, so the
    // first client render must match it before the filter kicks in.
    onMounted(readFromRoute)
    watch(() => [route.query.q, route.query.type], readFromRoute)
    watch(search, () => {
      clearTimeout(searchTimer)
      searchTimer = setTimeout(() => router.replace({ query: queryForState() }), SEARCH_DEBOUNCE_MS)
    })
    watch(type, () => {
      clearTimeout(searchTimer)
      router.replace({ query: queryForState() })
    })
  }

  const filtered = computed(() => {
    const q = search.value.trim().toLowerCase()
    return apps.value.filter((app) => {
      if (type.value !== 'all' && app.type !== type.value) return false
      if (!q) return true
      return (
        app.name.toLowerCase().includes(q)
        || app.description.toLowerCase().includes(q)
        || (app.developer?.toLowerCase().includes(q) ?? false)
      )
    })
  })

  const isFiltering = computed(() => search.value.trim() !== '' || type.value !== 'all')

  function clear() {
    clearTimeout(searchTimer)
    search.value = ''
    type.value = 'all'
  }

  return { search, type, filtered, isFiltering, clear }
}
