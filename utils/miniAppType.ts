import type { MiniAppType } from '~~/server/utils/miniapps'
import type { TypeFilter } from '~/composables/useMiniAppFilter'

const EVM_GRADIENT = 'var(--colors-evm-gradient)'

export function backgroundForType(type: MiniAppType): string {
  return type === 'nimiq' ? 'var(--colors-gold-gradient)' : EVM_GRADIENT
}

export function backgroundForFilter(type: TypeFilter): string {
  switch (type) {
    case 'nimiq': return 'var(--colors-gold-gradient)'
    case 'evm': return EVM_GRADIENT
    default: return 'var(--colors-green-gradient)'
  }
}

export function labelForType(type: MiniAppType): string {
  return type === 'nimiq' ? 'Nimiq' : 'EVM'
}
