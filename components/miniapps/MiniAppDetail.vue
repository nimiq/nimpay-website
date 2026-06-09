<script setup lang="ts">
import type { MiniApp } from '~~/server/utils/miniapps'
import { motion } from 'motion-v'
import { buildOpenPath, hostOf } from '~~/utils/deeplink'

const props = defineProps<{ app: MiniApp }>()
const { t } = useI18n()
const localePath = useLocalePath()
const { data: apps } = useNuxtData<MiniApp[]>('miniapps')

const deeplinkPath = computed(() => buildOpenPath(props.app.url))
const websiteHost = computed(() => hostOf(props.app.url) ?? props.app.url)
const sourceLabel = computed(() => props.app.source?.replace(/^https?:\/\//, '') ?? null)

const related = computed(() => (apps.value ?? [])
  .filter(a => a.type === props.app.type && a.slug !== props.app.slug)
  .slice(0, 3))
</script>

<template>
  <article class="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-8 md:gap-10 max-w-[1100px] mx-auto pb-32 md:pb-0">
    <div class="flex flex-col gap-8 min-w-0">
      <motion.span
        :while-hover="{ x: -3 }"
        :transition="{ type: 'spring', stiffness: 400, damping: 22 }"
      >
        <NuxtLink :to="localePath('/miniapps')" class="text-sm text-tertiary no-underline self-start hover:text-[var(--text-primary)] focus-ring rounded">
          ← {{ t('detail.back') }}
        </NuxtLink>
      </motion.span>

      <header class="flex flex-col sm:flex-row gap-6 items-start">
        <MiniAppLogo :logo="app.logo" :url="app.url" :name="app.name" size="lg" />
        <div class="flex flex-col gap-2.5 min-w-0">
          <MiniAppTypeBadge :type="app.type" />
          <h1 class="m-0 text-4xl sm:text-5xl font-bold leading-[1.02] tracking-[-0.025em]">
            {{ app.name }}
          </h1>
          <p v-if="app.developer" class="m-0 text-sm text-tertiary">
            {{ t('detail.by', { developer: app.developer }) }}
          </p>
        </div>
      </header>

      <section class="flex flex-col gap-3">
        <h2 class="m-0 text-[11px] font-bold tracking-[0.1em] uppercase text-label">
          {{ t('detail.about') }}
        </h2>
        <p class="m-0 text-base leading-[1.6] text-secondary max-w-[60ch]">
          {{ app.description }}
        </p>
      </section>

      <section v-if="related.length" class="flex flex-col gap-4">
        <h2 class="m-0 text-[11px] font-bold tracking-[0.1em] uppercase text-label">
          {{ t('detail.related') }}
        </h2>
        <ul class="list-none p-0 m-0 flex flex-col gap-2">
          <li v-for="r in related" :key="`${r.type}/${r.slug}`">
            <NuxtLink
              :to="localePath(`/miniapps/${r.type}/${r.slug}`)"
              class="group flex items-center gap-3 p-3 rounded-xl bg-[var(--surface-1)] border border-[var(--border-subtle)] text-inherit no-underline transition-[background,border-color] duration-150 hover:bg-[var(--surface-2)] hover:border-[var(--border-default)] focus-ring"
            >
              <MiniAppLogo :logo="r.logo" :url="r.url" :name="r.name" size="sm" />
              <div class="flex-1 min-w-0 flex flex-col gap-0.5">
                <span class="text-[15px] font-semibold leading-tight truncate">{{ r.name }}</span>
                <MiniAppTypeBadge :type="r.type" variant="dot" />
              </div>
              <span class="text-tertiary transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true">→</span>
            </NuxtLink>
          </li>
        </ul>
      </section>
    </div>

    <aside class="hidden md:flex flex-col gap-4 self-start md:sticky md:top-24">
      <section class="p-6 rounded-2xl bg-[var(--surface-1)] border border-[var(--border-subtle)]">
        <OpenInPayCTA :deeplink="deeplinkPath" :fallback-url="app.url" :type="app.type" />
      </section>
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
    </aside>

    <div class="md:hidden fixed bottom-0 left-0 right-0 z-40 px-5 pt-8 pb-[max(1rem,env(safe-area-inset-bottom))] pointer-events-none" aria-hidden="false">
      <div class="absolute inset-0 bg-gradient-to-t from-[var(--app-bg)] via-[var(--app-bg)] to-transparent" aria-hidden="true" />
      <div class="relative pointer-events-auto">
        <OpenInPayCTA :deeplink="deeplinkPath" :fallback-url="app.url" :type="app.type" compact />
      </div>
    </div>
  </article>
</template>
