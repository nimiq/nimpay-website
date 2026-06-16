<script setup lang="ts">
import type { MiniAppType } from '~~/server/utils/miniapps'

defineProps<{
  logo: string
  url: string
  name: string
  type: MiniAppType | null
  description: string
}>()

const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col gap-4">
    <p class="self-start m-0 px-3 py-1.5 rounded-full bg-[var(--chip-blue-bg)] text-[var(--chip-blue-text)] text-[11px] font-extrabold uppercase tracking-[0.12em]">
      {{ t('submit.previewLabel') }}
    </p>
    <div class="rounded-[32px] bg-[var(--surface-1)] border border-[var(--border-subtle)] p-8 shadow-[var(--card-shadow)] flex items-center gap-6">
      <MiniAppLogo :logo="logo" :url="url" :name="name || 'A'" size="lg" />
      <div class="flex flex-col gap-2 min-w-0">
        <MiniAppTypeBadge v-if="type" :type="type" variant="dot" />
        <h2 class="m-0 text-2xl font-black text-[var(--heading-contrast)] truncate">
          {{ name || t('submit.previewName') }}
        </h2>
        <p class="m-0 text-sm text-secondary leading-[1.45] line-clamp-3">
          {{ description || t('submit.previewDescription') }}
        </p>
      </div>
    </div>
  </div>
</template>
