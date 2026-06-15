<script setup lang="ts">
// Dedicated landing/home hero OG card (replaces readme-header.png). 1200x630,
// flexbox + inline hardcoded brand hex only (Satori/Takumi CSS subset).
import { ARROW_PATH, GOLD_GRADIENT, NIMIQ_HEX } from './_brand'

withDefaults(defineProps<{ title: string, description?: string }>(), {
  description: '',
})

const chips = ['NIM', 'USDT', 'BTC Lightning', 'NAKA card']
</script>

<template>
  <div :style="{ width: '1200px', height: '630px', display: 'flex', flexDirection: 'row', background: '#f6f7f9', fontFamily: 'Mulish' }">
    <!-- left: content -->
    <div :style="{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, padding: '72px' }">
      <!-- brand row (og:site_name in-image) -->
      <div :style="{ display: 'flex', alignItems: 'center' }">
        <svg width="46" height="41" viewBox="0 0 63 56" :style="{ marginRight: '18px' }">
          <defs>
            <linearGradient id="lc-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#EC991C" />
              <stop offset="1" stop-color="#E9B213" />
            </linearGradient>
          </defs>
          <path :d="NIMIQ_HEX" fill="url(#lc-gold)" />
        </svg>
        <span :style="{ fontSize: '31px', fontWeight: 700, color: '#20234b' }">Nimiq Pay</span>
      </div>

      <!-- headline + tagline + chips -->
      <div :style="{ display: 'flex', flexDirection: 'column', maxWidth: '660px' }">
        <div :style="{ fontSize: '60px', fontWeight: 700, lineHeight: 1.04, color: '#20234b' }">
          {{ title }}
        </div>
        <div v-if="description" :style="{ marginTop: '18px', fontSize: '26px', fontWeight: 400, lineHeight: 1.34, color: 'rgba(32,37,54,0.64)' }">
          {{ description }}
        </div>
        <div :style="{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '26px' }">
          <div
            v-for="c in chips" :key="c"
            :style="{ display: 'flex', alignItems: 'center', marginRight: '12px', padding: '9px 18px', borderRadius: '999px', border: '1px solid rgba(32,35,75,0.14)', background: '#ffffff', fontSize: '21px', fontWeight: 600, color: '#20234b' }"
          >
            {{ c }}
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div :style="{ display: 'flex', flexDirection: 'row', alignItems: 'center' }">
        <div :style="{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '16px 30px', borderRadius: '999px', background: '#20234b', color: '#ffffff', fontSize: '25px', fontWeight: 700 }">
          <span>Get the app</span>
          <svg width="20" height="20" viewBox="0 0 24 24" :style="{ marginLeft: '12px' }"><path :d="ARROW_PATH" fill="#ffffff" /></svg>
        </div>
        <span :style="{ marginLeft: '22px', fontSize: '23px', fontWeight: 600, color: 'rgba(32,37,54,0.5)' }">nimpay.app</span>
      </div>
    </div>

    <!-- right: gold panel with mark -->
    <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '404px', background: GOLD_GRADIENT }">
      <svg width="228" height="203" viewBox="0 0 63 56">
        <path :d="NIMIQ_HEX" fill="#20234b" />
      </svg>
    </div>
  </div>
</template>
