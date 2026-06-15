<script setup lang="ts">
import type { MiniApp } from '~~/server/utils/miniapps'
import { motion } from 'motion-v'
import { themeForType } from '~/utils/miniAppType'

withDefaults(defineProps<{
  apps: MiniApp[]
  /** Hide the built-in "Featured" header when the parent supplies its own. */
  hideHeader?: boolean
}>(), { hideHeader: false })

const { t } = useI18n()
const localePath = useLocalePath()
const { select, vtStyle } = useMiniAppViewTransition()
</script>

<template>
  <section v-if="apps.length" class="flex flex-col gap-6">
    <header v-if="!hideHeader">
      <p class="m-0 text-xs uppercase tracking-[0.1em] text-label flex items-center gap-1.5">
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M6 0.5 L7.5 4 L11.5 4.5 L8.5 7 L9.5 11 L6 9 L2.5 11 L3.5 7 L0.5 4.5 L4.5 4 Z" fill="var(--colors-gold)" />
        </svg>
        {{ t('home.featured.title') }}
      </p>
      <h2 class="mt-1.5 mb-0 text-[28px] sm:text-[34px] font-black tracking-[-0.02em] text-[var(--text-primary)]">
        {{ t('home.featured.subtitle') }}
      </h2>
    </header>
    <ul
      class="list-none p-0 m-0 grid grid-cols-1 gap-4"
      :class="apps.length === 1 ? '' : 'lg:grid-cols-2'"
    >
      <motion.li
        v-for="app in apps"
        :key="`${app.type}/${app.slug}`"
        class="h-full"
        :while-hover="{ y: -4 }"
        :transition="{ type: 'spring', stiffness: 320, damping: 22 }"
      >
        <NuxtLink
          :to="localePath(`/miniapps/${app.type}/${app.slug}`)"
          :aria-label="t('card.linkLabel', { name: app.name, type: themeForType(app.type).label })"
          class="group relative flex flex-col gap-7 h-full min-h-[300px] p-8 sm:p-10 rounded-[32px] overflow-hidden text-white no-underline shadow-[0_24px_70px_-32px_var(--card-glow)] hover:shadow-[0_36px_90px_-28px_var(--card-glow)] transition-shadow duration-300 focus-ring"
          :style="{ background: themeForType(app.type).gradient, '--card-glow': themeForType(app.type).glow }"
          @pointerdown="select(app, 'featured')"
          @click="select(app, 'featured')"
        >
          <HexField color="rgba(255,255,255,0.14)" :size="22" />
          <div
            class="absolute inset-0 pointer-events-none"
            :style="{ background: 'linear-gradient(to top, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.58) 26%, rgba(0,0,0,0.34) 52%, rgba(0,0,0,0.12) 72%, transparent 100%)' }"
            aria-hidden="true"
          />
          <div class="relative flex items-start justify-between gap-3">
            <MiniAppLogo
              :logo="app.logo"
              :url="app.url"
              :name="app.name"
              size="sm"
              :style="vtStyle(app, 'featured', 'logo')"
            />
            <span class="inline-flex items-center gap-1.5 py-2 px-4 rounded-full text-[10px] font-extrabold tracking-[0.1em] uppercase text-white bg-white/18 backdrop-blur-sm" :style="vtStyle(app, 'featured', 'badge')">
              {{ themeForType(app.type).label }}
            </span>
          </div>
          <div class="relative mt-auto flex flex-col gap-1.5 text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.18)]">
            <p v-if="app.developer" class="m-0 text-xs font-extrabold tracking-[0.1em] uppercase text-white/90" :style="vtStyle(app, 'featured', 'developer')">
              {{ app.developer }}
            </p>
            <h3 class="m-0 text-[34px] sm:text-[40px] font-black leading-[1.02] tracking-[-0.025em] text-white line-clamp-2 break-words" :style="vtStyle(app, 'featured', 'name')">
              {{ app.name }}
            </h3>
            <p class="m-0 text-base sm:text-lg font-semibold leading-[1.45] line-clamp-3 text-white" :style="vtStyle(app, 'featured', 'description')">
              {{ app.description }}
            </p>
          </div>
        </NuxtLink>
      </motion.li>
    </ul>
  </section>
</template>
