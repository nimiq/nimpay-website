<script setup lang="ts">
import type { MiniApp } from '~~/server/utils/miniapps'
import { motion } from 'motion-v'
import { themeForType } from '~/utils/miniAppType'

defineProps<{ app: MiniApp }>()
const { t } = useI18n()
const localePath = useLocalePath()
const { select, vtStyle } = useMiniAppViewTransition()
</script>

<template>
  <motion.div
    class="group block h-full rounded-2xl"
    tabindex="-1"
    :while-hover="{ y: -4, scale: 1.015 }"
    :while-press="{ scale: 0.985 }"
    :transition="{ type: 'spring', stiffness: 320, damping: 24 }"
  >
    <NuxtLink
      :to="localePath(`/miniapps/${app.type}/${app.slug}`)"
      :aria-label="t('card.linkLabel', { name: app.name, type: themeForType(app.type).label })"
      class="flex flex-col gap-4 h-full p-6 rounded-2xl bg-[var(--surface-1)] border border-[var(--border-subtle)] text-inherit no-underline transition-[border-color,background] duration-200 group-hover:border-[var(--border-strong)] group-hover:bg-[var(--surface-2)] focus-ring"
      @pointerdown="select(app, 'grid')"
      @click="select(app, 'grid')"
    >
      <div class="flex items-start justify-between gap-3">
        <MiniAppLogo :logo="app.logo" :url="app.url" :name="app.name" :style="vtStyle(app, 'grid', 'logo')" />
        <MiniAppTypeBadge :type="app.type" :style="vtStyle(app, 'grid', 'badge')" />
      </div>
      <div class="flex flex-col gap-1.5 flex-1">
        <h3 class="m-0 text-lg font-bold leading-tight line-clamp-2 break-words" :style="vtStyle(app, 'grid', 'name')">
          {{ app.name }}
        </h3>
        <p v-if="app.developer" class="m-0 text-xs text-tertiary truncate" :style="vtStyle(app, 'grid', 'developer')">
          {{ app.developer }}
        </p>
        <p class="mt-1 mb-0 text-sm leading-snug text-secondary line-clamp-2" :style="vtStyle(app, 'grid', 'description')">
          {{ app.description }}
        </p>
      </div>
      <div class="flex items-center justify-end pt-3 mt-auto border-t border-[var(--border-subtle)]">
        <span class="inline-flex items-center gap-1 text-[13px] font-bold text-[var(--text-primary)] transition-transform duration-200 group-hover:translate-x-0.5">
          {{ t('card.details') }}
          <span aria-hidden="true">→</span>
        </span>
      </div>
    </NuxtLink>
  </motion.div>
</template>
