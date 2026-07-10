<script setup lang="ts">
import { featuredFirst } from '~/composables/useMiniApps'

const { t } = useI18n()
const { data: apps, status } = await useMiniApps()

const featured = computed(() => apps.value.filter(a => a.featured))
const sorted = computed(() => featuredFirst(apps.value))

const { search, type, category, filtered, isFiltering, clear } = useMiniAppFilter(sorted)
const isPending = computed(() => status.value === 'pending')

useSeoMeta({
  title: () => `${t('home.title')} · Nimiq Pay`,
  description: () => t('home.metaDescription'),
  ogTitle: () => t('home.title'),
  ogDescription: () => clampDescription(t('home.metaDescription')),
})

defineOgImage('SiteCard', {
  title: t('home.title'),
  description: t('home.metaDescription'),
  cta: 'Browse mini apps',
})
</script>

<template>
  <div class="flex flex-col gap-20">
    <section class="pt-10 sm:pt-16 flex flex-col gap-12">
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-end">
        <div class="flex flex-col gap-5 max-w-[680px]">
          <p class="m-0 text-[11px] font-extrabold tracking-[0.16em] uppercase text-[#1769e0]">
            {{ t('home.eyebrow') }}
          </p>
          <h1 class="m-0 text-[48px] sm:text-[66px] font-black leading-[0.96] tracking-[-0.03em] text-balance text-[var(--text-primary)]">
            {{ t('home.title') }}
          </h1>
          <p class="m-0 text-lg sm:text-xl text-secondary leading-[1.5]">
            {{ t('home.subtitle') }}
          </p>
        </div>
        <div class="text-left lg:text-right">
          <p class="m-0 text-base font-black text-[var(--text-primary)]">
            {{ t('home.available', { count: apps.length }) }}
          </p>
          <p class="m-0 text-xs text-tertiary">
            {{ t('home.updated') }}
          </p>
        </div>
      </div>
    </section>

    <section v-if="isPending" class="flex flex-col gap-6">
      <div class="flex items-end justify-between gap-4">
        <div>
          <div class="h-8 w-44 rounded-xl skeleton" />
          <div class="h-4 w-32 rounded-lg skeleton mt-2" />
        </div>
        <div class="hidden sm:flex gap-3">
          <div class="w-11 h-11 rounded-full skeleton" />
          <div class="w-11 h-11 rounded-full skeleton" />
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="min-h-[360px] rounded-[32px] skeleton" />
        <div class="grid gap-6">
          <div class="min-h-[180px] rounded-[32px] skeleton" />
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="min-h-[180px] rounded-[28px] skeleton" />
            <div class="min-h-[180px] rounded-[28px] skeleton" />
          </div>
        </div>
      </div>
    </section>

    <MiniAppFeaturedStrip v-else-if="featured.length && !(isFiltering && filtered.length === 0)" :apps="featured" />

    <MiniAppFilter
      v-model:search="search"
      v-model:type="type"
      v-model:category="category"
      :total="apps.length"
      :visible="filtered.length"
      :is-filtering="isFiltering"
    />

    <section class="flex flex-col gap-6">
      <h2 class="m-0 text-[28px] sm:text-[34px] font-black tracking-[-0.02em] text-[var(--text-primary)]">
        {{ t('home.allApps') }}
      </h2>
      <MiniAppGrid :apps="filtered" :query="search" @clear="clear" />
    </section>
  </div>
</template>

<style scoped>
.skeleton {
  position: relative;
  overflow: hidden;
  background: linear-gradient(90deg, rgb(32 35 75 / 0.04), rgb(32 35 75 / 0.08), rgb(32 35 75 / 0.04));
}

.skeleton::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, rgb(255 255 255 / 0.55), transparent);
  animation: skeleton-shimmer 1.4s ease-in-out infinite;
}

@keyframes skeleton-shimmer {
  to { transform: translateX(100%); }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton::after {
    animation: none;
  }
}
</style>
