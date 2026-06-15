<script setup lang="ts">
// Per mini-app OG card. 1200x630, flexbox + inline hardcoded brand hex only
// (Satori/Takumi CSS subset). Named Og* to avoid colliding with
// components/miniapps/MiniAppCard.vue (components register without path prefix).
import { ARROW_PATH, gradientForType, NIMIQ_HEX } from './_brand'

const props = withDefaults(defineProps<{
  title: string
  description?: string
  developer?: string
  logo?: string
  type: 'nimiq' | 'evm'
}>(), {
  description: '',
  developer: '',
  logo: '',
})

const badge = gradientForType(props.type)
const hasLogo = !!props.logo
const initial = (props.title || '?').slice(0, 1).toUpperCase()
</script>

<template>
  <div :style="{ width: '1200px', height: '630px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '72px', background: '#f6f7f9', fontFamily: 'Mulish' }">
    <!-- eyebrow (og:site_name in-image) -->
    <div :style="{ display: 'flex', alignItems: 'center' }">
      <svg width="40" height="36" viewBox="0 0 63 56" :style="{ marginRight: '16px' }">
        <defs>
          <linearGradient id="ma-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#EC991C" />
            <stop offset="1" stop-color="#E9B213" />
          </linearGradient>
        </defs>
        <path :d="NIMIQ_HEX" fill="url(#ma-gold)" />
      </svg>
      <span :style="{ fontSize: '23px', fontWeight: 700, letterSpacing: '3px', color: 'rgba(32,37,54,0.6)' }">NIMIQ PAY · MINI APPS</span>
    </div>

    <!-- logo + name/description (headline) -->
    <div :style="{ display: 'flex', flexDirection: 'row', alignItems: 'center' }">
      <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '160px', height: '160px', borderRadius: '38px', marginRight: '44px', flexShrink: 0, background: hasLogo ? '#ffffff' : badge, boxShadow: '0 22px 70px rgba(32,35,75,0.10)' }">
        <img v-if="hasLogo" :src="logo" width="110" height="110" :style="{ objectFit: 'contain' }">
        <span v-else :style="{ fontSize: '80px', fontWeight: 700, color: '#ffffff' }">{{ initial }}</span>
      </div>
      <div :style="{ display: 'flex', flexDirection: 'column', maxWidth: '780px' }">
        <div :style="{ fontSize: '58px', fontWeight: 700, lineHeight: 1.03, color: '#20234b' }">
          {{ title }}
        </div>
        <div v-if="description" :style="{ marginTop: '16px', fontSize: '28px', fontWeight: 400, lineHeight: 1.3, color: 'rgba(32,37,54,0.66)' }">
          {{ description }}
        </div>
      </div>
    </div>

    <!-- type badge + developer (left) · CTA (right) -->
    <div :style="{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }">
      <div :style="{ display: 'flex', flexDirection: 'row', alignItems: 'center' }">
        <span :style="{ display: 'flex', alignItems: 'center', padding: '11px 24px', borderRadius: '999px', background: badge, color: '#ffffff', fontSize: '22px', fontWeight: 700, letterSpacing: '2px' }">{{ type.toUpperCase() }}</span>
        <span v-if="developer" :style="{ marginLeft: '22px', fontSize: '25px', fontWeight: 600, color: 'rgba(32,37,54,0.55)' }">by {{ developer }}</span>
      </div>
      <div :style="{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '14px 28px', borderRadius: '999px', background: '#20234b', color: '#ffffff', fontSize: '24px', fontWeight: 700 }">
        <span>Open in Nimiq Pay</span>
        <svg width="19" height="19" viewBox="0 0 24 24" :style="{ marginLeft: '11px' }"><path :d="ARROW_PATH" fill="#ffffff" /></svg>
      </div>
    </div>
  </div>
</template>
