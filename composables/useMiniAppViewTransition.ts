import type { MiniApp } from '~~/server/utils/miniapps'

export type MiniAppSurface = 'grid' | 'featured' | 'related'
export type MiniAppVtElement = 'logo' | 'name' | 'badge' | 'description' | 'developer'

interface Selection { key: string, surface: MiniAppSurface }

type AppRef = Pick<MiniApp, 'type' | 'slug'>

const appKey = (app: AppRef) => `${app.type}/${app.slug}`

// Shared-element view transitions: `view-transition-name` must be unique per
// page, but featured apps render in both the strip and the grid. So static
// pair names (miniapp-logo / miniapp-name) are applied to exactly one element,
// chosen by which link the user clicked.
export function useMiniAppViewTransition() {
  const selected = useState<Selection | null>('miniapp-vt-selected', () => null)

  function select(app: AppRef, surface: MiniAppSurface) {
    selected.value = { key: appKey(app), surface }
  }

  // List/related elements: named only when this exact element was clicked
  function vtStyle(app: AppRef, surface: MiniAppSurface, el: MiniAppVtElement) {
    const isActive = selected.value?.key === appKey(app) && selected.value.surface === surface
    return isActive ? { viewTransitionName: `miniapp-${el}` } : undefined
  }

  // Detail header: named unless another app was just selected (related row click)
  function vtDetailStyle(app: AppRef, el: MiniAppVtElement) {
    const sel = selected.value
    const isActive = sel === null || sel.key === appKey(app)
    return isActive ? { viewTransitionName: `miniapp-${el}` } : undefined
  }

  return { select, vtStyle, vtDetailStyle }
}
