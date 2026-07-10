<script setup lang="ts">
import type { MiniAppCategory } from '~/utils/miniApps'

defineProps<{ category: MiniAppCategory }>()

const { t } = useI18n()
</script>

<template>
  <span class="inline-flex items-center max-w-full px-2.5 py-1 rounded-full bg-[var(--surface-2)] text-[var(--text-secondary)] text-[11px] leading-4 font-extrabold whitespace-nowrap">
    {{ t(`categories.${category}`) }}
  </span>
</template>
