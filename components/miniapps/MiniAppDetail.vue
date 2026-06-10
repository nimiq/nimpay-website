<script setup lang="ts">
import type { MiniApp } from '~~/server/utils/miniapps'
import { motion } from 'motion-v'
import { buildOpenPath } from '~~/utils/deeplink'

const props = defineProps<{ app: MiniApp }>()
const { t } = useI18n()
const localePath = useLocalePath()
const { data: apps } = useNuxtData<MiniApp[]>('miniapps')
const { select, vtStyle, vtDetailStyle } = useMiniAppViewTransition()

const deeplinkPath = computed(() => buildOpenPath(props.app.url))

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
        <MiniAppLogo :logo="app.logo" :url="app.url" :name="app.name" size="lg" :style="vtDetailStyle(app, 'logo')" />
        <div class="flex flex-col gap-2.5 min-w-0">
          <MiniAppTypeBadge :type="app.type" :style="vtDetailStyle(app, 'badge')" />
          <h1 class="m-0 text-4xl sm:text-5xl font-bold leading-[1.02] tracking-[-0.025em]" :style="vtDetailStyle(app, 'name')">
            {{ app.name }}
          </h1>
          <p v-if="app.developer" class="m-0 text-sm text-tertiary" :style="vtDetailStyle(app, 'developer')">
            {{ t('detail.by', { developer: app.developer }) }}
          </p>
        </div>
      </header>

      <section class="flex flex-col gap-3">
        <h2 class="m-0 text-[11px] font-bold tracking-[0.1em] uppercase text-label">
          {{ t('detail.about') }}
        </h2>
        <p class="m-0 text-base leading-[1.6] text-secondary max-w-[60ch]" :style="vtDetailStyle(app, 'description')">
          {{ app.description }}
        </p>
      </section>

      <MiniAppMetaPanel :app="app" class="md:hidden" />

      <section v-if="related.length" class="flex flex-col gap-4">
        <h2 class="m-0 text-[11px] font-bold tracking-[0.1em] uppercase text-label">
          {{ t('detail.related') }}
        </h2>
        <ul class="list-none p-0 m-0 flex flex-col gap-2">
          <li v-for="r in related" :key="`${r.type}/${r.slug}`">
            <motion.div
              class="rounded-xl"
              tabindex="-1"
              :while-hover="{ y: -2 }"
              :while-press="{ scale: 0.99 }"
              :transition="{ type: 'spring', stiffness: 340, damping: 24 }"
            >
              <NuxtLink
                :to="localePath(`/miniapps/${r.type}/${r.slug}`)"
                class="group flex items-center gap-3 p-3 rounded-xl bg-[var(--surface-1)] border border-[var(--border-subtle)] text-inherit no-underline transition-[background,border-color] duration-150 hover:bg-[var(--surface-2)] hover:border-[var(--border-default)] focus-ring"
                @pointerdown="select(r, 'related')"
                @click="select(r, 'related')"
              >
                <MiniAppLogo :logo="r.logo" :url="r.url" :name="r.name" size="sm" :style="vtStyle(r, 'related', 'logo')" />
                <div class="flex-1 min-w-0 flex flex-col gap-0.5">
                  <span class="text-[15px] font-semibold leading-tight truncate" :style="vtStyle(r, 'related', 'name')">{{ r.name }}</span>
                  <MiniAppTypeBadge :type="r.type" variant="dot" :style="vtStyle(r, 'related', 'badge')" />
                </div>
                <span class="text-tertiary transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true">→</span>
              </NuxtLink>
            </motion.div>
          </li>
        </ul>
      </section>
    </div>

    <aside class="hidden md:flex flex-col gap-4 self-start md:sticky md:top-24">
      <section class="p-6 rounded-2xl bg-[var(--surface-1)] border border-[var(--border-subtle)]">
        <OpenInPayCTA :deeplink="deeplinkPath" :fallback-url="app.url" :type="app.type" />
      </section>
      <MiniAppMetaPanel :app="app" />
    </aside>

    <div class="md:hidden fixed bottom-0 left-0 right-0 z-40 px-5 pt-8 pb-[max(1rem,env(safe-area-inset-bottom))] pointer-events-none">
      <div class="absolute inset-0 bg-gradient-to-t from-[var(--app-bg)] via-[var(--app-bg)] to-transparent" aria-hidden="true" />
      <div class="relative pointer-events-auto">
        <OpenInPayCTA :deeplink="deeplinkPath" :fallback-url="app.url" :type="app.type" compact />
      </div>
    </div>
  </article>
</template>
