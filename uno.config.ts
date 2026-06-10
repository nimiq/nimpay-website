import { presetNimiq } from 'nimiq-css/unocss'
import { defineConfig, presetWind4 } from 'unocss'

export default defineConfig({
  // ':' only, so the dash-variant parser can't shadow the focus-ring shortcut as focus:ring
  separators: [':'],
  presets: [
    presetWind4(),
    presetNimiq({
      preflight: true,
      utilities: true,
    }),
  ],
  shortcuts: {
    'focus-ring': 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--colors-orange-1100)]',
    'text-secondary': 'text-[var(--text-secondary)]',
    'text-tertiary': 'text-[var(--text-tertiary)]',
    'text-label': 'text-[var(--text-label)]',
    'scrollbar-none': '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]',
  },
})
