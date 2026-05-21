import type { MiniAppType } from '~~/server/utils/miniapps'
import type { TypeFilter } from '~/composables/useMiniAppFilter'

interface TypeTheme {
  label: string
  gradient: string
  glow: string
  ctaShadow: string
}

const TYPE_THEME: Record<MiniAppType, TypeTheme> = {
  nimiq: {
    label: 'Nimiq',
    gradient: 'var(--colors-gold-gradient)',
    glow: 'var(--colors-gold-1100)',
    ctaShadow: '0 10px 28px -14px oklch(0.7924 0.1593 85.61 / 0.5)',
  },
  evm: {
    label: 'EVM',
    gradient: 'var(--colors-evm-gradient)',
    glow: 'var(--colors-blue-1100)',
    ctaShadow: '0 10px 28px -14px oklch(0.5849 0.1438 244.29 / 0.5)',
  },
}

const ALL_FILTER_GRADIENT = 'var(--colors-green-gradient)'

export function themeForType(type: MiniAppType): TypeTheme {
  return TYPE_THEME[type]
}

export function backgroundForType(type: MiniAppType): string {
  return TYPE_THEME[type].gradient
}

export function backgroundForFilter(type: TypeFilter): string {
  return type === 'all' ? ALL_FILTER_GRADIENT : TYPE_THEME[type].gradient
}

export function labelForType(type: MiniAppType): string {
  return TYPE_THEME[type].label
}
