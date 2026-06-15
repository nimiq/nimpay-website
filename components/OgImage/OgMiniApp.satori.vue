<script setup lang="ts">
// Per mini-app OG card. 1200x630, Satori CSS subset (flexbox + inline hardcoded
// hex). The Nimiq mark is always gold; the type badge carries the app's own
// gradient identity. Named Og* to avoid colliding with
// components/miniapps/MiniAppCard.vue (components register without path prefix).
import { getFaviconUrl } from '~~/utils/deeplink'
import { ARROW_PATH, gradientForType, NIMIQ_HEX } from './_brand'

const props = withDefaults(defineProps<{
  title: string
  description?: string
  developer?: string
  logo?: string
  url?: string
  type: 'nimiq' | 'evm'
}>(), {
  description: '',
  developer: '',
  logo: '',
  url: '',
})

const badge = gradientForType(props.type)
// Mirror components/miniapps/MiniAppLogo.vue: logo → favicon → initial.
const src = props.logo || (props.url ? getFaviconUrl(props.url) : '')
const hasLogo = !!src
const initial = (props.title || '?').slice(0, 1).toUpperCase()
</script>

<template>
  <div :style="{ width: '1200px', height: '630px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '84px', background: '#f6f7f9', fontFamily: 'Mulish' }">
    <div :style="{ display: 'flex', alignItems: 'center' }">
      <svg width="42" height="38" viewBox="0 0 63 56" :style="{ marginRight: '16px' }">
        <defs>
          <linearGradient id="ma-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#EC991C" />
            <stop offset="1" stop-color="#E9B213" />
          </linearGradient>
        </defs>
        <path :d="NIMIQ_HEX" fill="url(#ma-gold)" />
      </svg>
      <span :style="{ fontSize: '23px', fontWeight: 700, letterSpacing: '3px', color: 'rgba(32,37,54,0.55)' }">NIMIQ PAY · MINI APPS</span>
    </div>

    <div :style="{ display: 'flex', flexDirection: 'row', alignItems: 'center' }">
      <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '176px', height: '176px', borderRadius: '40px', marginRight: '48px', flexShrink: 0, background: hasLogo ? '#ffffff' : badge, boxShadow: '0 24px 70px rgba(32,35,75,0.10)' }">
        <img v-if="hasLogo" :src="src" width="120" height="120" :style="{ objectFit: 'contain' }">
        <span v-else :style="{ fontSize: '88px', fontWeight: 800, color: '#ffffff' }">{{ initial }}</span>
      </div>
      <div :style="{ display: 'flex', flexDirection: 'column', maxWidth: '760px' }">
        <div :style="{ fontSize: '60px', fontWeight: 800, lineHeight: 1.03, letterSpacing: '-0.02em', color: '#20234b' }">
          {{ title }}
        </div>
        <div v-if="description" :style="{ marginTop: '18px', fontSize: '28px', fontWeight: 400, lineHeight: 1.34, color: 'rgba(32,37,54,0.66)' }">
          {{ description }}
        </div>
      </div>
    </div>

    <div :style="{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }">
      <div :style="{ display: 'flex', flexDirection: 'row', alignItems: 'center' }">
        <span :style="{ display: 'flex', alignItems: 'center', padding: '12px 26px', borderRadius: '999px', background: badge, color: '#ffffff', fontSize: '22px', fontWeight: 700, letterSpacing: '2px' }">{{ type.toUpperCase() }}</span>
        <span v-if="developer" :style="{ marginLeft: '22px', fontSize: '25px', fontWeight: 600, color: 'rgba(32,37,54,0.55)' }">by {{ developer }}</span>
      </div>
      <div :style="{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '15px 30px', borderRadius: '18px', background: '#20234b', color: '#ffffff', fontSize: '24px', fontWeight: 700 }">
        <span>Open in Nimiq Pay</span>
        <svg width="20" height="20" viewBox="0 0 24 24" :style="{ marginLeft: '12px' }"><path :d="ARROW_PATH" fill="#ffffff" /></svg>
      </div>
    </div>
  </div>
</template>
