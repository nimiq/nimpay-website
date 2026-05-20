<script setup lang="ts">
withDefaults(defineProps<{
  size?: number
}>(), {
  size: 140,
})

const gradientId = useId()
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 140 140"
    aria-hidden="true"
    class="drop-shadow-[0_8px_24px_rgba(31,35,72,0.18)]"
  >
    <defs>
      <linearGradient :id="gradientId" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="var(--colors-blue-1100)" />
        <stop offset="100%" stop-color="var(--colors-gold-1100)" />
      </linearGradient>
    </defs>
    <g transform="translate(70 70)">
      <path
        d="M0 -56 L48 -28 L48 0 L-10 0 L-48 -28 Z"
        :fill="`url(#${gradientId})`"
        transform="translate(-6 -4)"
      />
      <path
        d="M0 -10 L48 -10 L48 28 L0 56 L-48 28 L-48 -10 L-10 -10"
        fill="none"
        :stroke="`url(#${gradientId})`"
        stroke-width="3"
        stroke-linejoin="round"
        transform="translate(6 4)"
      />
      <circle cx="-6" cy="-4" r="3" fill="var(--app-bg)" stroke="var(--colors-blue-1100)" stroke-width="1.5" />
    </g>
  </svg>
</template>
