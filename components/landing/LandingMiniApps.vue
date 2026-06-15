<script setup lang="ts">
import type { MiniApp } from '~~/server/utils/miniapps'

defineProps<{
  apps: MiniApp[]
  total: number
}>()

const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <section id="mini-apps" class="scroll-mt-28 flex flex-col gap-8">
    <header class="flex flex-col gap-4 max-w-[760px]">
      <p class="m-0 text-[11px] font-extrabold tracking-[0.16em] uppercase text-[#1769e0]">
        {{ t('landing.miniapps.eyebrow') }}
      </p>
      <h2 class="m-0 text-[44px] sm:text-[64px] font-black leading-[0.95] tracking-[-0.025em] text-balance text-[var(--text-primary)]">
        {{ t('landing.miniapps.title') }}
      </h2>
      <p class="m-0 text-lg text-secondary leading-[1.5]">
        {{ t('landing.miniapps.body') }}
      </p>
    </header>
    <MiniAppFeaturedStrip :apps="apps" hide-header />
    <NuxtLink
      :to="localePath('/miniapps')"
      class="self-start inline-flex items-center gap-2 py-2 border-b border-[#1769e0]/35 !text-[var(--chip-blue-text)] font-extrabold no-underline hover:border-[#1769e0] focus-ring"
    >
      {{ t('landing.miniapps.browseAll', { count: total }) }}
    </NuxtLink>
  </section>
</template>
