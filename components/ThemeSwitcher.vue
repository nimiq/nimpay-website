<script setup lang="ts">
import { AnimatePresence, motion } from 'motion-v'

const { t } = useI18n()
const { resolved, toggle } = useTheme()

const label = computed(() =>
  resolved.value === 'light' ? t('nav.themeLight') : t('nav.themeDark'),
)
const ariaLabel = computed(() => t('nav.themeToggle', { mode: label.value }))
</script>

<template>
  <motion.button
    type="button"
    class="inline-flex items-center justify-center w-11 h-11 rounded-[10px] border border-[var(--border-default)] bg-[var(--surface-1)] text-inherit cursor-pointer transition-colors duration-150 hover:bg-[var(--surface-3)] hover:border-[var(--border-strong)] focus-ring"
    :aria-label="ariaLabel"
    :title="label"
    :while-hover="{ y: -1 }"
    :while-press="{ scale: 0.92 }"
    :transition="{ type: 'spring', stiffness: 380, damping: 22 }"
    @click="toggle"
  >
    <AnimatePresence mode="popLayout" :initial="false">
      <motion.span
        :key="resolved"
        class="grid place-items-center"
        :initial="{ opacity: 0, rotate: -90, scale: 0.75 }"
        :animate="{ opacity: 1, rotate: 0, scale: 1 }"
        :exit="{ opacity: 0, rotate: 90, scale: 0.75 }"
        :transition="{ type: 'spring', stiffness: 360, damping: 22 }"
      >
        <svg
          v-if="resolved === 'light'"
          viewBox="0 0 24 24"
          class="w-4 h-4"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" fill="currentColor" />
          <g stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="m4.93 19.07 1.41-1.41" />
            <path d="m17.66 6.34 1.41-1.41" />
          </g>
        </svg>
        <svg
          v-else
          viewBox="0 0 24 24"
          class="w-4 h-4"
          aria-hidden="true"
        >
          <path
            d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"
            fill="currentColor"
          />
        </svg>
      </motion.span>
    </AnimatePresence>
  </motion.button>
</template>
