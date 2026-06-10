<script setup lang="ts">
import type { MiniAppType } from '~~/server/utils/miniapps'
import { MINI_APP_TYPES } from '~~/server/utils/miniapps'
import { featuredFirst } from '~/composables/useMiniApps'

const { t } = useI18n()
const { data: apps } = await useMiniApps()

const summary = computed(() => {
  const featured: typeof apps.value = []
  const counts = Object.fromEntries(MINI_APP_TYPES.map(t => [t, 0])) as Record<MiniAppType, number>
  for (const a of apps.value) {
    if (a.featured) featured.push(a)
    counts[a.type]++
  }
  return { featured, counts }
})
const sorted = computed(() => featuredFirst(apps.value))

const { search, type, filtered, isFiltering, clear } = useMiniAppFilter(sorted)

useSeoMeta({
  title: () => `${t('home.title')} · Nimiq Pay`,
  description: () => t('home.metaDescription'),
  ogTitle: () => t('home.title'),
  ogDescription: () => t('home.metaDescription'),
  ogType: 'website',
})
</script>

<template>
  <div class="flex flex-col gap-14">
    <section class="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-8 items-end">
      <div class="flex flex-col gap-3 max-w-[640px]">
        <p class="m-0 text-xs font-bold tracking-[0.12em] uppercase text-label">
          {{ t('home.eyebrow') }}
        </p>
        <h1 class="m-0 text-[34px] sm:text-[44px] font-bold leading-[1.05] tracking-[-0.025em]">
          {{ t('home.title') }}
        </h1>
        <p class="m-0 text-base sm:text-lg text-secondary leading-[1.5]">
          {{ t('home.subtitle') }}
        </p>
      </div>
      <dl class="hidden sm:flex flex-col gap-1 pl-6 border-l border-[var(--border-subtle)] min-w-[180px]">
        <div class="flex items-baseline justify-between gap-4">
          <dt class="text-xs text-tertiary">
            {{ t('home.stats.total') }}
          </dt>
          <dd class="m-0 text-lg font-bold tracking-[-0.02em]">
            {{ apps.length }}
          </dd>
        </div>
        <div v-for="kind in MINI_APP_TYPES" :key="kind" class="flex items-baseline justify-between gap-4">
          <dt class="text-xs text-tertiary">
            {{ t(`home.stats.${kind}`) }}
          </dt>
          <dd class="m-0 text-lg font-bold tracking-[-0.02em]">
            {{ summary.counts[kind] }}
          </dd>
        </div>
      </dl>
    </section>

    <MiniAppFeaturedStrip v-if="summary.featured.length && !(isFiltering && filtered.length === 0)" :apps="summary.featured" />

    <section class="flex flex-col gap-6">
      <h2 class="sr-only">
        {{ t('home.allApps') }}
      </h2>
      <MiniAppFilter
        v-model:search="search"
        v-model:type="type"
        :total="apps.length"
        :visible="filtered.length"
      />
      <MiniAppGrid :apps="filtered" :query="search" @clear="clear" />
    </section>
  </div>
</template>
