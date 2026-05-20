<script setup lang="ts">
withDefaults(defineProps<{
  color?: string
  size?: number
  strokeWidth?: number
}>(), {
  color: 'currentColor',
  size: 24,
  strokeWidth: 1,
})

const patternId = useId()
</script>

<template>
  <svg
    class="absolute inset-0 w-full h-full pointer-events-none"
    aria-hidden="true"
    :style="{ color }"
  >
    <defs>
      <pattern
        :id="patternId"
        x="0"
        y="0"
        :width="size * 1.5"
        :height="size * 0.866 * 2"
        patternUnits="userSpaceOnUse"
      >
        <path
          :d="`M${size * 0.5} 0 L${size} ${size * 0.433} L${size} ${size * 1.299} L${size * 0.5} ${size * 1.732} L0 ${size * 1.299} L0 ${size * 0.433} Z`"
          fill="none"
          stroke="currentColor"
          :stroke-width="strokeWidth"
        />
        <path
          :d="`M${size * 1.5} ${size * 0.866} L${size * 2} ${size * 1.299} L${size * 2} ${size * 2.165} L${size * 1.5} ${size * 2.598} L${size} ${size * 2.165} L${size} ${size * 1.299} Z`"
          fill="none"
          stroke="currentColor"
          :stroke-width="strokeWidth"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" :fill="`url(#${patternId})`" />
  </svg>
</template>
