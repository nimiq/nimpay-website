<script setup lang="ts">
import { featuredFirst } from '~/composables/useMiniApps'

const { t } = useI18n()
const { data: apps } = await useMiniApps()

const featured = computed(() => apps.value.filter(a => a.featured))
const sorted = computed(() => featuredFirst(apps.value))
const counts = computed(() => {
  let nimiq = 0
  let evm = 0
  for (const a of apps.value) {
    if (a.type === 'nimiq') nimiq++
    else if (a.type === 'evm') evm++
  }
  return { nimiq, evm }
})

const { search, type, filtered } = useMiniAppFilter(sorted)

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
        <div class="flex items-baseline justify-between gap-4">
          <dt class="text-xs text-tertiary">
            {{ t('home.stats.nimiq') }}
          </dt>
          <dd class="m-0 text-lg font-bold tracking-[-0.02em]">
            {{ counts.nimiq }}
          </dd>
        </div>
        <div class="flex items-baseline justify-between gap-4">
          <dt class="text-xs text-tertiary">
            {{ t('home.stats.evm') }}
          </dt>
          <dd class="m-0 text-lg font-bold tracking-[-0.02em]">
            {{ counts.evm }}
          </dd>
        </div>
      </dl>
    </section>

    <MiniAppFeaturedStrip v-if="featured.length" :apps="featured" />

    <section class="flex flex-col gap-6">
      <MiniAppFilter
        v-model:search="search"
        v-model:type="type"
        :total="apps.length"
        :visible="filtered.length"
      />
      <MiniAppGrid :apps="filtered" />
    </section>
  </div>
</template>
