import type { RouterConfig } from '@nuxt/schema'

export default {
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition)
      return savedPosition

    // Same path, only query changed (e.g. filter state) — keep scroll position.
    if (to.path === from.path && !to.hash)
      return false

    if (to.hash) {
      const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth'

      return {
        el: to.hash,
        behavior,
      }
    }

    return { left: 0, top: 0 }
  },
} satisfies RouterConfig
