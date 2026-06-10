<script setup lang="ts">
import type { MiniApp } from '~~/server/utils/miniapps'
import { hostOf } from '~~/utils/deeplink'

const props = defineProps<{ app: MiniApp }>()
const { t } = useI18n()
const localePath = useLocalePath()

const websiteHost = computed(() => hostOf(props.app.url) ?? props.app.url)
const sourceLabel = computed(() => props.app.source?.replace(/^https?:\/\//, '') ?? null)
</script>

<template>
  <div class="flex flex-col gap-4">
    <dl class="m-0 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-1)] overflow-hidden">
      <div class="flex justify-between items-center gap-3 px-4 py-3 border-b border-[var(--border-subtle)] min-w-0">
        <dt class="text-[11px] font-bold tracking-[0.08em] uppercase text-label">
          {{ t('detail.url') }}
        </dt>
        <dd class="m-0 text-[13px] font-semibold truncate text-right min-w-0">
          <a :href="app.url" target="_blank" rel="noopener" class="font-mono text-inherit no-underline hover:underline">{{ websiteHost }}</a>
        </dd>
      </div>
      <div v-if="app.source" class="flex justify-between items-center gap-3 px-4 py-3 min-w-0">
        <dt class="text-[11px] font-bold tracking-[0.08em] uppercase text-label">
          {{ t('detail.source') }}
        </dt>
        <dd class="m-0 text-[13px] font-semibold truncate text-right min-w-0">
          <a :href="app.source" target="_blank" rel="noopener" class="font-mono text-inherit no-underline hover:underline">{{ sourceLabel }}</a>
        </dd>
      </div>
    </dl>
    <NuxtLink
      :to="localePath(`/miniapps/${app.type}/${app.slug}/report`)"
      class="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[var(--surface-1)] border border-[var(--border-subtle)] text-tertiary font-medium text-[13px] no-underline transition-[background,border-color,color] duration-150 hover:bg-[var(--surface-2)] hover:border-[var(--border-default)] hover:text-[var(--text-secondary)] focus-ring"
    >
      <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      </svg>
      {{ t('detail.report') }}
    </NuxtLink>
  </div>
</template>
