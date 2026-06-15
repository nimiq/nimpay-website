<script setup lang="ts">
// Generic OG card (catalog + any rendered page). 1200x630, Satori CSS subset
// (flexbox + inline hardcoded hex). The Nimiq mark is always gold.
import { ARROW_PATH, NIMIQ_HEX } from './_brand'

withDefaults(defineProps<{ title: string, description?: string, cta?: string }>(), {
  description: '',
  cta: 'Open Nimiq Pay',
})
</script>

<template>
  <div :style="{ width: '1200px', height: '630px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '88px', background: '#f6f7f9', fontFamily: 'Mulish' }">
    <div :style="{ display: 'flex', alignItems: 'center' }">
      <svg width="58" height="52" viewBox="0 0 63 56" :style="{ marginRight: '20px' }">
        <defs>
          <linearGradient id="sc-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#EC991C" />
            <stop offset="1" stop-color="#E9B213" />
          </linearGradient>
        </defs>
        <path :d="NIMIQ_HEX" fill="url(#sc-gold)" />
      </svg>
      <span :style="{ fontSize: '34px', fontWeight: 800, color: '#20234b' }">Nimiq Pay</span>
    </div>

    <div :style="{ display: 'flex', flexDirection: 'column', maxWidth: '920px' }">
      <div :style="{ fontSize: '76px', fontWeight: 800, lineHeight: 1.04, letterSpacing: '-0.02em', color: '#20234b' }">
        {{ title }}
      </div>
      <div v-if="description" :style="{ marginTop: '24px', fontSize: '30px', fontWeight: 400, lineHeight: 1.4, color: 'rgba(32,37,54,0.66)' }">
        {{ description }}
      </div>
    </div>

    <div :style="{ display: 'flex', flexDirection: 'row', alignItems: 'center' }">
      <div :style="{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '18px 34px', borderRadius: '18px', background: '#20234b', color: '#ffffff', fontSize: '26px', fontWeight: 700 }">
        <span>{{ cta }}</span>
        <svg width="21" height="21" viewBox="0 0 24 24" :style="{ marginLeft: '13px' }"><path :d="ARROW_PATH" fill="#ffffff" /></svg>
      </div>
      <span :style="{ marginLeft: '24px', fontSize: '24px', fontWeight: 600, color: 'rgba(32,37,54,0.5)' }">nimpay.app</span>
    </div>
  </div>
</template>
