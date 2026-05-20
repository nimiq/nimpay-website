import type { MiniApp } from '~~/server/utils/miniapps'

export function useMiniApps() {
  return useAsyncData('miniapps', () => $fetch<MiniApp[]>('/api/miniapps'), {
    default: () => [] as MiniApp[],
  })
}

export function featuredFirst(apps: MiniApp[]): MiniApp[] {
  return [...apps].sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name))
}
