<script setup lang="ts">
// Dedicated landing/home hero OG card. 1200x630, Satori CSS subset (flexbox +
// inline hardcoded hex). The Nimiq mark is always gold.
import { ARROW_PATH, NIMIQ_HEX } from './_brand'

defineProps<{ title: string }>()
</script>

<template>
  <div :style="{ width: '1200px', height: '630px', display: 'flex', flexDirection: 'row', background: '#f6f7f9', fontFamily: 'Mulish' }">
    <!-- content -->
    <div :style="{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, padding: '88px' }">
      <div :style="{ display: 'flex', alignItems: 'center' }">
        <svg width="50" height="44" viewBox="0 0 63 56" :style="{ marginRight: '18px' }">
          <defs>
            <linearGradient id="lc-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#EC991C" />
              <stop offset="1" stop-color="#E9B213" />
            </linearGradient>
          </defs>
          <path :d="NIMIQ_HEX" fill="url(#lc-gold)" />
        </svg>
        <span :style="{ fontSize: '32px', fontWeight: 800, color: '#20234b' }">Nimiq Pay</span>
      </div>

      <div :style="{ display: 'flex', maxWidth: '740px' }">
        <div :style="{ fontSize: '64px', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.02em', color: '#20234b' }">
          {{ title }}
        </div>
      </div>

      <div :style="{ display: 'flex', flexDirection: 'row', alignItems: 'center' }">
        <div :style="{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '18px 34px', borderRadius: '18px', background: '#20234b', color: '#ffffff', fontSize: '26px', fontWeight: 700 }">
          <span>Get the app</span>
          <svg width="21" height="21" viewBox="0 0 24 24" :style="{ marginLeft: '13px' }"><path :d="ARROW_PATH" fill="#ffffff" /></svg>
        </div>
        <span :style="{ marginLeft: '24px', fontSize: '24px', fontWeight: 600, color: 'rgba(32,37,54,0.5)' }">nimpay.app</span>
      </div>
    </div>

    <!-- gold mark anchor (always gold) -->
    <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '300px', paddingRight: '56px' }">
      <svg width="200" height="178" viewBox="0 0 63 56">
        <defs>
          <linearGradient id="lc-gold-big" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#EC991C" />
            <stop offset="1" stop-color="#E9B213" />
          </linearGradient>
        </defs>
        <path :d="NIMIQ_HEX" fill="url(#lc-gold-big)" />
      </svg>
    </div>
  </div>
</template>
