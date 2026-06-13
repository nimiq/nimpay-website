<script setup lang="ts">
import type { MiniApp } from '~~/server/utils/miniapps'
import { motion } from 'motion-v'
import { buildOpenPath, hostOf } from '~~/utils/deeplink'
import { labelForType } from '~/utils/miniAppType'

const props = defineProps<{ app: MiniApp }>()
const { t } = useI18n()
const localePath = useLocalePath()
const { data: apps } = useNuxtData<MiniApp[]>('miniapps')
const { select, vtStyle, vtDetailStyle } = useMiniAppViewTransition()

const deeplinkPath = computed(() => buildOpenPath(props.app.url))
const typeLabel = computed(() => labelForType(props.app.type))
const websiteHost = computed(() => hostOf(props.app.url) ?? props.app.url)
const sourceLabel = computed(() => props.app.source?.replace(/^https?:\/\//, '') ?? null)

const related = computed(() => (apps.value ?? [])
  .filter(a => a.type === props.app.type && a.slug !== props.app.slug)
  .slice(0, 3))
</script>

<template>
  <article class="flex flex-col gap-16 max-w-[1280px] mx-auto pb-32 md:pb-0">
    <nav class="flex items-center gap-2 text-sm font-bold text-tertiary">
      <NuxtLink :to="localePath('/miniapps')" class="text-tertiary no-underline hover:text-[var(--text-primary)] focus-ring rounded">
        {{ t('detail.directory') }}
      </NuxtLink>
      <span aria-hidden="true">/</span>
      <span>{{ typeLabel }}</span>
      <span aria-hidden="true">/</span>
      <span class="text-[var(--text-primary)]">{{ app.name }}</span>
    </nav>

    <div class="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-12 lg:gap-20 items-start">
      <div class="flex flex-col gap-10 min-w-0">
        <header class="flex flex-col sm:flex-row gap-8 items-start">
          <div>
            <MiniAppLogo :logo="app.logo" :url="app.url" :name="app.name" size="lg" :style="vtDetailStyle(app, 'logo')" />
          </div>
          <div class="flex flex-col gap-4 min-w-0 pt-1">
            <div class="flex flex-wrap gap-3 items-center">
              <MiniAppTypeBadge :type="app.type" :style="vtDetailStyle(app, 'badge')" />
            </div>
            <h1 class="m-0 text-[48px] sm:text-[64px] font-black leading-[0.95] tracking-[-0.03em] text-[var(--heading-contrast)]" :style="vtDetailStyle(app, 'name')">
              {{ app.name }}
            </h1>
            <p v-if="app.developer" class="m-0 text-base font-bold text-secondary" :style="vtDetailStyle(app, 'developer')">
              {{ t('detail.by', { developer: app.developer }) }}
            </p>
          </div>
        </header>

        <section class="flex flex-col gap-5">
          <h2 class="m-0 text-[26px] sm:text-[30px] font-black tracking-[-0.02em] text-[var(--heading-contrast)]">
            {{ t('detail.aboutNamed', { name: app.name }) }}
          </h2>
          <p class="m-0 text-lg leading-[1.65] text-secondary max-w-[72ch]" :style="vtDetailStyle(app, 'description')">
            {{ app.description }}
          </p>
        </section>

        <MiniAppMetaPanel :app="app" class="lg:hidden" />
      </div>

      <aside class="hidden lg:flex flex-col gap-8 self-start lg:sticky lg:top-28">
        <section class="rounded-[32px] bg-[var(--surface-1)] border-2 border-[var(--cta-edge)] p-8 shadow-[14px_14px_0_var(--cta-edge)]">
          <OpenInPayCTA :deeplink="deeplinkPath" :fallback-url="app.url" :type="app.type" />
          <dl class="mt-8 pt-6 border-t border-[var(--border-subtle)] m-0 flex flex-col gap-3">
            <div class="flex items-center justify-between gap-4">
              <dt class="text-sm text-secondary">
                {{ t('detail.category') }}
              </dt>
              <dd class="m-0 font-black">
                {{ typeLabel }}
              </dd>
            </div>
            <div class="flex items-center justify-between gap-4 min-w-0">
              <dt class="text-sm text-secondary shrink-0">
                {{ t('detail.url') }}
              </dt>
              <dd class="m-0 min-w-0">
                <a :href="app.url" target="_blank" rel="noopener" class="block font-mono text-[13px] font-bold truncate text-inherit no-underline hover:underline focus-ring rounded">{{ websiteHost }}</a>
              </dd>
            </div>
            <div v-if="app.source" class="flex items-center justify-between gap-4 min-w-0">
              <dt class="text-sm text-secondary shrink-0">
                {{ t('detail.source') }}
              </dt>
              <dd class="m-0 min-w-0">
                <a :href="app.source" target="_blank" rel="noopener" class="block font-mono text-[13px] font-bold truncate text-inherit no-underline hover:underline focus-ring rounded">{{ sourceLabel }}</a>
              </dd>
            </div>
          </dl>
        </section>
        <MiniAppMetaPanel :app="app" report-only />
      </aside>
    </div>

    <section v-if="related.length" class="flex flex-col gap-6">
      <div class="flex items-end justify-between gap-4">
        <h2 class="m-0 text-[34px] sm:text-[40px] font-black tracking-[-0.025em] text-[var(--heading-contrast)]">
          {{ t('detail.related') }}
        </h2>
        <NuxtLink :to="localePath('/miniapps')" class="group inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-black text-[light-dark(#9a6400,#ffd66e)] no-underline hover:underline focus-ring rounded">
          {{ t('detail.viewAll') }}
          <ArrowIcon class="transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
        </NuxtLink>
      </div>
      <ul class="list-none p-0 m-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <li v-for="r in related" :key="`${r.type}/${r.slug}`" class="h-full">
          <motion.div
            class="h-full rounded-[28px]"
            tabindex="-1"
            :while-hover="{ y: -2 }"
            :while-press="{ scale: 0.99 }"
            :transition="{ type: 'spring', stiffness: 340, damping: 24 }"
          >
            <NuxtLink
              :to="localePath(`/miniapps/${r.type}/${r.slug}`)"
              class="group flex flex-col gap-6 p-6 h-full min-h-[170px] rounded-[28px] bg-[var(--surface-1)] border border-[var(--border-subtle)] shadow-[var(--card-shadow)] text-inherit no-underline transition-[background,border-color] duration-150 hover:bg-[var(--card-hover-bg)] hover:border-[var(--border-default)] focus-ring"
              @pointerdown="select(r, 'related')"
              @click="select(r, 'related')"
            >
              <MiniAppLogo :logo="r.logo" :url="r.url" :name="r.name" size="sm" :style="vtStyle(r, 'related', 'logo')" />
              <div class="flex-1 min-w-0 flex flex-col gap-2">
                <span class="text-lg font-black leading-tight truncate text-[var(--text-primary)]" :style="vtStyle(r, 'related', 'name')">{{ r.name }}</span>
                <span class="text-sm text-secondary line-clamp-2">{{ r.description }}</span>
              </div>
            </NuxtLink>
          </motion.div>
        </li>
      </ul>
    </section>

    <div class="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-5 pt-8 pb-[max(1rem,env(safe-area-inset-bottom))] pointer-events-none">
      <div class="absolute inset-0 bg-gradient-to-t from-[var(--app-bg)] via-[var(--app-bg)] to-transparent" aria-hidden="true" />
      <div class="relative pointer-events-auto">
        <OpenInPayCTA :deeplink="deeplinkPath" :fallback-url="app.url" :type="app.type" compact />
      </div>
    </div>
  </article>
</template>
