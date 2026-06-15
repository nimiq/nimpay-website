<script setup lang="ts">
// Generic OG card (catalog + any rendered page). 1200x630, flexbox + inline
// hardcoded brand hex only (Satori/Takumi CSS subset).
import { ARROW_PATH, NIMIQ_HEX } from './_brand'

withDefaults(defineProps<{ title: string, description?: string, cta?: string }>(), {
  description: '',
  cta: 'Open Nimiq Pay',
})
</script>

<template>
  <div :style="{ width: '1200px', height: '630px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '76px', background: '#f6f7f9', fontFamily: 'Mulish' }">
    <!-- brand row (og:site_name in-image) -->
    <div :style="{ display: 'flex', alignItems: 'center' }">
      <svg width="56" height="50" viewBox="0 0 63 56" :style="{ marginRight: '20px' }">
        <defs>
          <linearGradient id="sc-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#EC991C" />
            <stop offset="1" stop-color="#E9B213" />
          </linearGradient>
        </defs>
        <path :d="NIMIQ_HEX" fill="url(#sc-gold)" />
      </svg>
      <span :style="{ fontSize: '34px', fontWeight: 700, color: '#20234b' }">Nimiq Pay</span>
    </div>

    <!-- title + description -->
    <div :style="{ display: 'flex', flexDirection: 'column', maxWidth: '1000px' }">
      <div :style="{ fontSize: '68px', fontWeight: 700, lineHeight: 1.05, color: '#20234b' }">
        {{ title }}
      </div>
      <div v-if="description" :style="{ marginTop: '20px', fontSize: '30px', fontWeight: 400, lineHeight: 1.32, color: 'rgba(32,37,54,0.66)' }">
        {{ description }}
      </div>
    </div>

    <!-- CTA -->
    <div :style="{ display: 'flex', flexDirection: 'row', alignItems: 'center' }">
      <div :style="{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '15px 30px', borderRadius: '999px', background: '#20234b', color: '#ffffff', fontSize: '25px', fontWeight: 700 }">
        <span>{{ cta }}</span>
        <svg width="20" height="20" viewBox="0 0 24 24" :style="{ marginLeft: '12px' }"><path :d="ARROW_PATH" fill="#ffffff" /></svg>
      </div>
      <span :style="{ marginLeft: '22px', fontSize: '23px', fontWeight: 600, color: 'rgba(32,37,54,0.5)' }">nimpay.app</span>
    </div>
  </div>
</template>
