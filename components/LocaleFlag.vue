<script setup lang="ts">
import type { LocaleCode } from '~~/nuxt.config'

withDefaults(defineProps<{ code: LocaleCode, size?: number }>(), {
  size: 20,
})

const clipId = useId()
</script>

<template>
  <svg
    :width="size"
    :height="size * (2 / 3)"
    viewBox="0 0 24 16"
    role="img"
    :aria-label="`${code} flag`"
    class="block flex-shrink-0"
  >
    <defs>
      <clipPath :id="clipId">
        <rect x="0" y="0" width="24" height="16" rx="2.4" />
      </clipPath>
    </defs>
    <g :clip-path="`url(#${clipId})`">
      <!-- United States (en) -->
      <template v-if="code === 'en'">
        <rect width="24" height="16" fill="#bf0a30" />
        <rect y="1.23" width="24" height="1.23" fill="#fff" />
        <rect y="3.69" width="24" height="1.23" fill="#fff" />
        <rect y="6.15" width="24" height="1.23" fill="#fff" />
        <rect y="8.62" width="24" height="1.23" fill="#fff" />
        <rect y="11.08" width="24" height="1.23" fill="#fff" />
        <rect y="13.54" width="24" height="1.23" fill="#fff" />
        <rect width="10" height="8.62" fill="#002868" />
      </template>

      <!-- Spain (es) -->
      <template v-else-if="code === 'es'">
        <rect width="24" height="16" fill="#c60b1e" />
        <rect y="4" width="24" height="8" fill="#ffc400" />
      </template>

      <!-- Portugal (pt) -->
      <template v-else-if="code === 'pt'">
        <rect width="24" height="16" fill="#da291c" />
        <rect width="9.6" height="16" fill="#046a38" />
        <circle cx="9.6" cy="8" r="2" fill="#ffe17c" stroke="#9c6300" stroke-width="0.6" />
      </template>

      <!-- France (fr) -->
      <template v-else-if="code === 'fr'">
        <rect width="8" height="16" fill="#0055a4" />
        <rect x="8" width="8" height="16" fill="#fff" />
        <rect x="16" width="8" height="16" fill="#ef4135" />
      </template>

      <!-- Germany (de) -->
      <template v-else-if="code === 'de'">
        <rect width="24" height="5.33" fill="#000" />
        <rect y="5.33" width="24" height="5.34" fill="#dd0000" />
        <rect y="10.67" width="24" height="5.33" fill="#ffce00" />
      </template>
    </g>
    <rect
      x="0.25"
      y="0.25"
      width="23.5"
      height="15.5"
      rx="2.15"
      fill="none"
      stroke="rgba(0, 0, 0, 0.15)"
      stroke-width="0.5"
    />
  </svg>
</template>
