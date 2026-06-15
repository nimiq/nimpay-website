// Shared constants for the build-time OG image templates (Satori). Kept here
// as hardcoded values — not app.vue CSS vars or nimiq-css — because Satori only
// reads literal values, not CSS custom properties. Mirrors utils/miniAppType.ts
// (which returns `var(--colors-*)` gradients that Satori can't resolve).

// Nimiq hexagon mark outline, viewBox "0 0 63 56".
export const NIMIQ_HEX = 'M62.1102 25.375L49.0238 2.625C48.0816 0.9975 46.3542 0 44.4872 0H18.3144C16.4474 0 14.72 0.9975 13.7865 2.625L0.700122 25.375C-0.233374 27.0025 -0.233374 28.9975 0.700122 30.625L13.7865 53.375C14.72 55.0025 16.4474 56 18.3144 56H44.4872C46.3542 56 48.0816 55.0025 49.0151 53.375L62.1015 30.625C63.0437 28.9975 63.0437 27.0025 62.1102 25.375Z'

// Filled right-arrow for CTA buttons, viewBox "0 0 24 24".
export const ARROW_PATH = 'M2 10H14V6L22 12L14 18V14H2Z'

// Mini-app type gradients (gold for nimiq, EVM blue for evm).
export const GOLD_GRADIENT = 'linear-gradient(135deg,#ffc72c 0%,#f2b600 100%)'
export const EVM_GRADIENT = 'linear-gradient(135deg,#3451D1 0%,#4D66DE 100%)'

export function gradientForType(type: 'nimiq' | 'evm'): string {
  return type === 'nimiq' ? GOLD_GRADIENT : EVM_GRADIENT
}
