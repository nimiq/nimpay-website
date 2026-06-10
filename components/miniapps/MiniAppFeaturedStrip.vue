<script setup lang="ts">
import type { MiniApp } from '~~/server/utils/miniapps'
import { motion } from 'motion-v'
import { themeForType } from '~/utils/miniAppType'

defineProps<{ apps: MiniApp[] }>()

const { t } = useI18n()
const localePath = useLocalePath()
const { select, vtStyle } = useMiniAppViewTransition()
</script>

<template>
  <section v-if="apps.length" class="flex flex-col gap-5">
    <header>
      <p class="m-0 text-xs uppercase tracking-[0.1em] text-label flex items-center gap-1.5">
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M6 0.5 L7.5 4 L11.5 4.5 L8.5 7 L9.5 11 L6 9 L2.5 11 L3.5 7 L0.5 4.5 L4.5 4 Z" fill="var(--colors-gold)" />
        </svg>
        {{ t('home.featured.title') }}
      </p>
      <h2 class="mt-1.5 mb-0 text-[22px] sm:text-[26px] font-semibold tracking-[-0.01em]">
        {{ t('home.featured.subtitle') }}
      </h2>
    </header>
    <ul
      class="list-none p-0 m-0 grid grid-cols-1 gap-4"
      :class="apps.length === 1 ? '' : apps.length === 2 ? 'sm:grid-cols-2 lg:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'"
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
          class="group relative flex flex-col gap-4 h-full min-h-[180px] p-5 rounded-3xl overflow-hidden text-white no-underline shadow-[0_20px_56px_-22px_var(--card-glow)] hover:shadow-[0_36px_80px_-18px_var(--card-glow)] transition-shadow duration-300 focus-ring"
          :style="{ background: themeForType(app.type).gradient, '--card-glow': themeForType(app.type).glow }"
          @pointerdown="select(app, 'featured')"
          @click="select(app, 'featured')"
        >
          <HexField color="rgba(255,255,255,0.14)" :size="22" />
          <div
            class="absolute inset-0 pointer-events-none"
            :style="{ background: 'linear-gradient(to top, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.44) 22%, rgba(0,0,0,0.28) 45%, rgba(0,0,0,0.12) 68%, transparent 100%)' }"
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
            <span class="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-[10px] font-bold tracking-[0.1em] uppercase text-white bg-black/45 backdrop-blur-sm" :style="vtStyle(app, 'featured', 'badge')">
              {{ themeForType(app.type).label }}
            </span>
          </div>
          <div class="relative mt-auto flex flex-col gap-1.5 text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.18)]">
            <p v-if="app.developer" class="m-0 text-[10px] font-bold tracking-[0.1em] uppercase text-white opacity-95" :style="vtStyle(app, 'featured', 'developer')">
              {{ app.developer }}
            </p>
            <h3 class="m-0 text-[22px] font-extrabold leading-[1.05] tracking-[-0.02em] text-white line-clamp-2 break-words" :style="vtStyle(app, 'featured', 'name')">
              {{ app.name }}
            </h3>
            <p class="m-0 text-[13px] font-medium leading-snug line-clamp-2 text-white" :style="vtStyle(app, 'featured', 'description')">
              {{ app.description }}
            </p>
          </div>
        </NuxtLink>
      </motion.li>
    </ul>
  </section>
</template>
