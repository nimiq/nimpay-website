<script setup lang="ts">
import type { MiniAppCategory, MiniAppType } from '~/utils/miniApps'

const props = defineProps<{
  logo: string
  url: string
  name: string
  type: MiniAppType | null
  category: MiniAppCategory | null
  description: string
  developer: string | null
}>()

const { t } = useI18n()
const displayName = computed(() => props.name || t('submit.previewName'))
const displayDescription = computed(() => props.description || t('submit.previewDescription'))
</script>

<template>
  <div class="flex flex-col gap-4">
    <p class="self-start m-0 px-3 py-1.5 rounded-full bg-[var(--chip-blue-bg)] text-[var(--chip-blue-text)] text-[11px] font-extrabold uppercase tracking-[0.12em]">
      {{ t('submit.previewLabel') }}
    </p>
    <MiniAppCardSurface
      :logo="logo"
      :url="url"
      :name="displayName"
      :type="type"
      :category="category"
      :description="displayDescription"
      :developer="developer"
    />
  </div>
</template>
