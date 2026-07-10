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
      class="block h-full rounded-[28px] text-inherit no-underline focus-ring"
      @pointerdown="select(app, 'grid')"
      @click="select(app, 'grid')"
    >
      <MiniAppCardSurface
        :logo="app.logo"
        :url="app.url"
        :name="app.name"
        :type="app.type"
        :category="app.category"
        :description="app.description"
        :developer="app.developer"
        :logo-style="vtStyle(app, 'grid', 'logo')"
        :type-badge-style="vtStyle(app, 'grid', 'badge')"
        :name-style="vtStyle(app, 'grid', 'name')"
        :developer-style="vtStyle(app, 'grid', 'developer')"
        :description-style="vtStyle(app, 'grid', 'description')"
      />
    </NuxtLink>
  </motion.div>
</template>
