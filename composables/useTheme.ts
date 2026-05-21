export type ThemeMode = 'light' | 'dark'

const THEME_COOKIE = 'nimpay_theme'

function isThemeMode(v: unknown): v is ThemeMode {
  return v === 'light' || v === 'dark'
}

let mediaQueryAttached = false

function useSystemPrefersDark() {
  const prefersDark = useState<boolean>('theme:systemDark', () =>
    import.meta.client ? window.matchMedia('(prefers-color-scheme: dark)').matches : true,
  )
  if (import.meta.client && !mediaQueryAttached) {
    mediaQueryAttached = true
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', e => prefersDark.value = e.matches)
  }
  return prefersDark
}

export function useTheme() {
  const mode = useCookie<ThemeMode | null>(THEME_COOKIE, {
    default: () => null,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    decode: v => (isThemeMode(v) ? v : null),
  })

  const systemDark = useSystemPrefersDark()
  const resolved = computed<ThemeMode>(() =>
    mode.value ?? (systemDark.value ? 'dark' : 'light'),
  )

  function toggle() {
    mode.value = resolved.value === 'light' ? 'dark' : 'light'
  }

  return { mode, resolved, toggle }
}
