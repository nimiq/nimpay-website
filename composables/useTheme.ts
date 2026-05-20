export type ThemeMode = 'light' | 'dark'

const THEME_COOKIE = 'nimpay_theme'

function isThemeMode(v: unknown): v is ThemeMode {
  return v === 'light' || v === 'dark'
}

function readSystemPrefersDark(): boolean {
  if (import.meta.server)
    return true
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

let listenerAttached = false

function useSystemPrefersDark() {
  const prefersDark = useState<boolean>('theme:systemDark', readSystemPrefersDark)
  if (import.meta.client && !listenerAttached) {
    listenerAttached = true
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', () => { prefersDark.value = mq.matches })
  }
  return prefersDark
}

function applyToDom(mode: ThemeMode | null) {
  if (import.meta.server)
    return
  if (mode)
    document.documentElement.setAttribute('data-theme', mode)
  else
    document.documentElement.removeAttribute('data-theme')
}

export function useTheme() {
  const cookie = useCookie<ThemeMode | null>(THEME_COOKIE, {
    default: () => null,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  })

  const mode = computed<ThemeMode | null>({
    get: () => (isThemeMode(cookie.value) ? cookie.value : null),
    set: (v) => { cookie.value = v },
  })

  const systemDark = useSystemPrefersDark()
  const resolved = computed<ThemeMode>(() =>
    mode.value ?? (systemDark.value ? 'dark' : 'light'),
  )

  watch(mode, applyToDom, { immediate: true })

  function toggle() {
    mode.value = resolved.value === 'light' ? 'dark' : 'light'
  }

  return { mode, resolved, toggle }
}
