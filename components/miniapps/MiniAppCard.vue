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
    class="group block h-full rounded-[28px]"
    tabindex="-1"
    :while-hover="{ y: -4, scale: 1.015 }"
    :while-press="{ scale: 0.985 }"
    :transition="{ type: 'spring', stiffness: 320, damping: 24 }"
  >
    <NuxtLink
      :to="localePath(`/miniapps/${app.type}/${app.slug}`)"
      :aria-label="t('card.linkLabel', { name: app.name, type: themeForType(app.type).label })"
      class="flex flex-col gap-5 h-full min-h-[210px] p-6 rounded-[28px] bg-[var(--surface-1)] border border-[var(--border-subtle)] text-inherit no-underline shadow-[var(--card-shadow)] transition-[border-color,background,box-shadow] duration-200 group-hover:border-[var(--border-strong)] group-hover:bg-[var(--card-hover-bg)] group-hover:shadow-[0_28px_70px_rgba(32,35,75,0.12)] focus-ring"
      @pointerdown="select(app, 'grid')"
      @click="select(app, 'grid')"
    >
      <div class="flex items-start justify-between gap-3">
        <MiniAppLogo :logo="app.logo" :url="app.url" :name="app.name" size="sm" :style="vtStyle(app, 'grid', 'logo')" />
        <div class="flex flex-wrap justify-end gap-2">
          <MiniAppCategoryBadge :category="app.category" />
          <MiniAppTypeBadge :type="app.type" :style="vtStyle(app, 'grid', 'badge')" />
        </div>
      </div>
      <div class="flex flex-col gap-2 flex-1">
        <h3 class="m-0 text-xl font-black leading-tight line-clamp-2 break-words text-[var(--text-primary)]" :style="vtStyle(app, 'grid', 'name')">
          {{ app.name }}
        </h3>
        <p v-if="app.developer" class="m-0 text-xs font-extrabold uppercase tracking-[0.08em] text-tertiary truncate" :style="vtStyle(app, 'grid', 'developer')">
          {{ app.developer }}
        </p>
        <p class="mt-auto mb-0 text-sm leading-[1.45] text-secondary line-clamp-3" :style="vtStyle(app, 'grid', 'description')">
          {{ app.description }}
        </p>
      </div>
    </NuxtLink>
  </motion.div>
</template>
