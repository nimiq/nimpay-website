import type { Ref } from 'vue'
import type { MiniApp, MiniAppType } from '~~/server/utils/miniapps'

export type TypeFilter = 'all' | MiniAppType

export function useMiniAppFilter(apps: Ref<MiniApp[]>) {
  const search = ref('')
  const type = ref<TypeFilter>('all')

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

  return { search, type, filtered }
}
